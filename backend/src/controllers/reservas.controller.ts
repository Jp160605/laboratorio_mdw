import { Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../types';
import { invalidarDisponibilidadCache } from '../services/cache.service';
import { emitirReservaCreada, emitirReservaCancelada } from '../services/socket.service';
import { programarCorreosReserva, cancelarRecordatorioReserva } from '../services/queue.service';

export async function crearReserva(req: AuthRequest, res: Response): Promise<void> {
  const { sala_id, fecha, hora_inicio, version_actual } = req.body;
  const usuario = req.user;

  if (!usuario) {
    res.status(401).json({ error: 'Usuario no autenticado.' });
    return;
  }

  // Validación de bloque horario permitido (08:00 a 20:00)
  if (!sala_id || !fecha || hora_inicio === undefined || version_actual === undefined) {
    res.status(400).json({ error: 'Parámetros incompletos (sala_id, fecha, hora_inicio, version_actual).' });
    return;
  }

  const horaInt = parseInt(hora_inicio, 10);
  if (horaInt < 8 || horaInt > 20) {
    res.status(400).json({ error: 'El bloque horario debe encontrarse entre las 08:00 y las 20:00 horas.' });
    return;
  }

  const horaFin = horaInt + 1;

  // Validación Temporal: No permitir fechas pasadas ni horas concluidas hoy
  const ahora = new Date();
  const fechaStr = typeof fecha === 'string' && fecha.includes('T') ? fecha.split('T')[0] : String(fecha);
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const fechaHoyLocal = `${año}-${mes}-${dia}`;
  const horaActual = ahora.getHours();

  if (fechaStr < fechaHoyLocal) {
    res.status(400).json({
      error: 'No es posible reservar en fechas pasadas.',
      codigo: 'FECHA_PASADA',
    });
    return;
  }

  // Si es hoy, validar que el bloque no haya concluido ya (si son las 11:30, horaFin=12 está permitida, pero horaFin=11 ya concluyó)
  if (fechaStr === fechaHoyLocal && horaFin <= horaActual) {
    res.status(400).json({
      error: `El bloque horario de ${horaInt}:00 a ${horaFin}:00 ya ha concluido. Solo puedes reservar bloques en curso o futuros.`,
      codigo: 'HORA_PASADA',
    });
    return;
  }

  const client = await pool.connect();

  try {
    // =========================================================================
    // TRANSACCIÓN ACID CON BLOQUEO OPTIMISTA (RF-03 & RF-04)
    // =========================================================================
    await client.query('BEGIN');

    // 1. Verificar si ya existe una reserva confirmada en ese espacio y bloque (RF-03)
    const checkReserva = await client.query(
      `SELECT id FROM reservas 
       WHERE sala_id = $1 AND fecha = $2 AND hora_inicio = $3 AND estado = 'CONFIRMADA'
       LIMIT 1`,
      [sala_id, fecha, horaInt]
    );

    if (checkReserva.rows.length > 0) {
      await client.query('ROLLBACK');
      res.status(409).json({
        error: 'El bloque horario seleccionado ya se encuentra reservado.',
        codigo: 'SLOT_ALREADY_BOOKED',
      });
      return;
    }

    // 2. Ejecutar Bloqueo Optimista sobre la tabla salas (RF-04):
    // Incrementa la versión si coincide con la versión que leyó el cliente.
    const updateSala = await client.query(
      `UPDATE salas 
       SET version = version + 1 
       WHERE id = $1 AND version = $2 
       RETURNING id, nombre, version`,
      [sala_id, version_actual]
    );

    // Si rowCount === 0 significa que otro usuario modificó la sala milisegundos antes
    if (updateSala.rowCount === 0) {
      await client.query('ROLLBACK');
      res.status(409).json({
        error: 'Conflicto de concurrencia: la sala fue actualizada por otra solicitud simultánea. Por favor, reintenta con la versión más reciente.',
        codigo: 'CONFLICT_OPTIMISTIC_LOCK',
        sala_id,
        version_enviada: version_actual,
      });
      return;
    }

    const nuevaVersion = updateSala.rows[0].version;
    const nombreSala = updateSala.rows[0].nombre;

    // 3. Insertar la reserva confirmada en PostgreSQL
    const insertReserva = await client.query(
      `INSERT INTO reservas (sala_id, usuario_id, fecha, hora_inicio, hora_fin, estado, version_sala_aplicada) 
       VALUES ($1, $2, $3, $4, $5, 'CONFIRMADA', $6) 
       RETURNING id, sala_id, usuario_id, fecha, hora_inicio, hora_fin, estado, version_sala_aplicada, creado_en`,
      [sala_id, usuario.id, fecha, horaInt, horaFin, nuevaVersion]
    );

    const reservaCreada = insertReserva.rows[0];

    // Confirmar la transacción ACID
    await client.query('COMMIT');

    // =========================================================================
    // EFECTOS SECUNDARIOS ASÍNCRONOS (POST-COMMIT)
    // =========================================================================
    // 1. Invalidar caché en Redis para la fecha afectada
    await invalidarDisponibilidadCache(fecha);

    // 2. Emitir evento de Socket.io a todos los clientes conectados
    emitirReservaCreada({
      sala_id,
      fecha,
      hora_inicio: horaInt,
      nueva_version: nuevaVersion,
    });

    // 3. Encolar correos en BullMQ (Inmediato + Recordatorio 1h antes) (RF-06)
    await programarCorreosReserva({
      reservaId: reservaCreada.id,
      email: usuario.email,
      nombreUsuario: usuario.nombre,
      salaNombre: nombreSala,
      fecha,
      horaInicio: horaInt,
      horaFin,
    });

    res.status(201).json({
      mensaje: 'Reserva confirmada exitosamente.',
      reserva: reservaCreada,
      nueva_version_sala: nuevaVersion,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('[Reservas Controller - Crear]:', error);

    // Si salta el índice único parcial en base de datos como red de seguridad
    if (error.code === '23505') {
      res.status(409).json({
        error: 'Conflicto de integridad: ya existe una reserva activa para ese bloque horario.',
        codigo: 'UNIQUE_VIOLATION_SLOT',
      });
      return;
    }

    res.status(500).json({ error: 'Error interno al procesar la reserva.' });
  } finally {
    client.release();
  }
}

export async function cancelarReserva(req: AuthRequest, res: Response): Promise<void> {
  const reservaId = parseInt(req.params.id, 10);
  const usuario = req.user;

  if (!usuario) {
    res.status(401).json({ error: 'Usuario no autenticado.' });
    return;
  }

  try {
    // 1. Obtener los datos de la reserva
    const resultado = await pool.query(
      `SELECT id, sala_id, usuario_id, fecha, hora_inicio, hora_fin, estado 
       FROM reservas 
       WHERE id = $1`,
      [reservaId]
    );

    if (resultado.rows.length === 0) {
      res.status(404).json({ error: 'Reserva no encontrada.' });
      return;
    }

    const reserva = resultado.rows[0];

    // 2. Verificar pertenencia de la reserva
    if (reserva.usuario_id !== usuario.id) {
      res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva.' });
      return;
    }

    if (reserva.estado === 'CANCELADA') {
      res.status(400).json({ error: 'La reserva ya se encuentra cancelada.' });
      return;
    }

    // 3. Normalizar fecha a string YYYY-MM-DD para cálculo temporal preciso
    let fechaStr: string;
    if (reserva.fecha instanceof Date) {
      const y = reserva.fecha.getFullYear();
      const m = String(reserva.fecha.getMonth() + 1).padStart(2, '0');
      const d = String(reserva.fecha.getDate()).padStart(2, '0');
      fechaStr = `${y}-${m}-${d}`;
    } else {
      fechaStr = String(reserva.fecha).split('T')[0];
    }

    // Validar regla de al menos 2 horas de anticipación (RF-05)
    const fechaHoraInicio = new Date(`${fechaStr}T${reserva.hora_inicio < 10 ? '0' : ''}${reserva.hora_inicio}:00:00`);
    const ahora = new Date();
    const diferenciaMs = fechaHoraInicio.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    console.log(
      `[Reservas Controller - Cancelar] Intento de cancelación reserva #${reservaId} (${fechaStr} ${reserva.hora_inicio}:00). Horas de anticipación: ${diferenciaHoras.toFixed(2)}h (Hora actual: ${ahora.toLocaleTimeString('es-MX')})`
    );

    if (diferenciaHoras < 2) {
      res.status(400).json({
        error: 'Política de cancelación (RF-05): Se requiere un mínimo de 2 horas de anticipación.',
        horas_restantes: diferenciaHoras.toFixed(2),
      });
      return;
    }

    // 4. Actualizar estado a CANCELADA en PostgreSQL
    await pool.query(
      `UPDATE reservas SET estado = 'CANCELADA' WHERE id = $1`,
      [reservaId]
    );

    // 5. Invalidar caché en Redis para la fecha afectada
    await invalidarDisponibilidadCache(fechaStr);

    // 6. Cancelar recordatorio en BullMQ
    await cancelarRecordatorioReserva(reservaId);

    // 7. Emitir evento Socket.io liberando el bloque
    emitirReservaCancelada({
      sala_id: reserva.sala_id,
      fecha: fechaStr,
      hora_inicio: reserva.hora_inicio,
    });

    res.status(200).json({
      mensaje: 'Reserva cancelada exitosamente.',
      reserva_id: reservaId,
    });
  } catch (error: any) {
    console.error('[Reservas Controller - Cancelar]:', error);
    res.status(500).json({ error: 'Error al cancelar la reserva.' });
  }
}

export async function obtenerMisReservas(req: AuthRequest, res: Response): Promise<void> {
  const usuario = req.user;

  if (!usuario) {
    res.status(401).json({ error: 'Usuario no autenticado.' });
    return;
  }

  try {
    const resultado = await pool.query(
      `SELECT r.id, r.sala_id, s.nombre AS sala_nombre, s.ubicacion AS sala_ubicacion, 
              r.usuario_id, r.fecha, r.hora_inicio, r.hora_fin, r.estado, 
              r.version_sala_aplicada, r.creado_en
       FROM reservas r
       JOIN salas s ON s.id = r.sala_id
       WHERE r.usuario_id = $1
       ORDER BY r.fecha DESC, r.hora_inicio ASC`,
      [usuario.id]
    );

    res.status(200).json(resultado.rows);
  } catch (error: any) {
    console.error('[Reservas Controller - Mis Reservas]:', error);
    res.status(500).json({ error: 'Error al obtener tus reservas.' });
  }
}

export async function obtenerTodasReservas(_req: any, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(
      `SELECT r.id, r.sala_id, s.nombre AS sala_nombre, s.ubicacion AS sala_ubicacion, 
              r.usuario_id, u.nombre AS usuario_nombre, u.email AS usuario_email,
              r.fecha, r.hora_inicio, r.hora_fin, r.estado, 
              r.version_sala_aplicada, r.creado_en
       FROM reservas r
       JOIN salas s ON s.id = r.sala_id
       JOIN usuarios u ON u.id = r.usuario_id
       ORDER BY r.fecha DESC, r.hora_inicio DESC, r.id DESC`
    );
    res.status(200).json(resultado.rows);
  } catch (error: any) {
    console.error('[Reservas Controller - Todas]:', error);
    res.status(500).json({ error: 'Error al obtener la auditoría de reservas.' });
  }
}
