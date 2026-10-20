import { Request, Response } from 'express';
import { pool } from '../config/db';
import { obtenerDisponibilidadCache, guardarDisponibilidadCache } from '../services/cache.service';

export async function obtenerSalas(_req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, capacidad, ubicacion, version FROM salas ORDER BY id ASC'
    );
    res.status(200).json(resultado.rows);
  } catch (error: any) {
    console.error('[Salas Controller - Listar]:', error);
    res.status(500).json({ error: 'Error al obtener la lista de salas.' });
  }
}

export async function obtenerDisponibilidad(req: Request, res: Response): Promise<void> {
  const fecha = (req.query.fecha as string) || new Date().toISOString().split('T')[0];

  try {
    // 1. Intentar leer desde la caché en Redis
    const cacheado = await obtenerDisponibilidadCache(fecha);
    if (cacheado) {
      res.status(200).json({ origen: 'REDIS_CACHE', fecha, datos: cacheado });
      return;
    }

    // 2. Si no está en caché, consultar PostgreSQL (SQL Puro)
    const salasQuery = await pool.query('SELECT id, nombre, capacidad, ubicacion, version FROM salas ORDER BY id ASC');
    const reservasQuery = await pool.query(
      `SELECT r.id, r.sala_id, r.usuario_id, u.nombre as usuario_nombre, r.fecha, r.hora_inicio, r.hora_fin, r.estado, r.version_sala_aplicada
       FROM reservas r
       JOIN usuarios u ON u.id = r.usuario_id
       WHERE r.fecha = $1 AND r.estado = 'CONFIRMADA'`,
      [fecha]
    );

    const datosRespuesta = {
      salas: salasQuery.rows,
      reservas: reservasQuery.rows,
    };

    // 3. Guardar en Redis con TTL de 10 minutos (600 segundos)
    await guardarDisponibilidadCache(fecha, datosRespuesta, 600);

    res.status(200).json({ origen: 'POSTGRES_DB', fecha, datos: datosRespuesta });
  } catch (error: any) {
    console.error('[Salas Controller - Disponibilidad]:', error);
    res.status(500).json({ error: 'Error al consultar disponibilidad.' });
  }
}

export async function sugerirMejorSala(req: Request, res: Response): Promise<void> {
  const fecha = (req.query.fecha as string) || new Date().toISOString().split('T')[0];
  const horaDeseada = parseInt(req.query.hora_deseada as string, 10) || 10;
  const aforo = parseInt(req.query.aforo as string, 10) || 10;

  try {
    // Consulta SQL con función de costo:
    // Genera bloques de 8 a 20 mediante generate_series
    // Filtra salas con capacidad >= aforo que NO tengan reserva CONFIRMADA en esa fecha y bloque
    // Ordena primero por menor diferencia horaria y luego por menor desperdicio de aforo
    const query = `
      WITH bloques_posibles AS (
        SELECT s.id AS sala_id, s.nombre, s.capacidad, s.ubicacion, s.version, h.hora
        FROM salas s
        CROSS JOIN generate_series(8, 20) AS h(hora)
        WHERE s.capacidad >= $1
      )
      SELECT 
        bp.sala_id,
        bp.nombre,
        bp.capacidad,
        bp.ubicacion,
        bp.version,
        bp.hora AS hora_sugerida,
        ABS(bp.hora - $2) AS desviacion_horas,
        (bp.capacidad - $1) AS desperdicio_asientos,
        (ABS(bp.hora - $2) * 100 + (bp.capacidad - $1)) AS costo_total
      FROM bloques_posibles bp
      LEFT JOIN reservas r 
        ON r.sala_id = bp.sala_id 
        AND r.fecha = $3 
        AND r.hora_inicio = bp.hora 
        AND r.estado = 'CONFIRMADA'
      WHERE r.id IS NULL
      ORDER BY costo_total ASC, bp.capacidad ASC
      LIMIT 1;
    `;

    const resultado = await pool.query(query, [aforo, horaDeseada, fecha]);

    if (resultado.rows.length === 0) {
      res.status(404).json({
        mensaje: 'No se encontraron salas disponibles con la capacidad requerida para esa fecha.',
      });
      return;
    }

    const mejorOpcion = resultado.rows[0];

    res.status(200).json({
      mensaje: 'Mejor sala calculada exitosamente.',
      criterios: {
        fecha,
        hora_deseada: horaDeseada,
        aforo_requerido: aforo,
      },
      sugerencia: {
        sala_id: mejorOpcion.sala_id,
        nombre: mejorOpcion.nombre,
        capacidad: mejorOpcion.capacidad,
        ubicacion: mejorOpcion.ubicacion,
        version: mejorOpcion.version,
        hora_inicio: mejorOpcion.hora_sugerida,
        hora_fin: mejorOpcion.hora_sugerida + 1,
        desviacion_horas: mejorOpcion.desviacion_horas,
        desperdicio_asientos: mejorOpcion.desperdicio_asientos,
        costo_total: mejorOpcion.costo_total,
      },
    });
  } catch (error: any) {
    console.error('[Salas Controller - Sugerir]:', error);
    res.status(500).json({ error: 'Error al calcular la mejor sala sugerida.' });
  }
}
