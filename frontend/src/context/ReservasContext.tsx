'use client';

import React, { createContext, useContext, useState } from 'react';
import { Sala, Reserva, Usuario, ResultadoConcurrencia, NotificacionBullMQ } from '@/types';

interface ReservasContextType {
  salas: Sala[];
  reservas: Reserva[];
  usuarioActual: Usuario | null;
  setUsuarioActual: (usuario: Usuario | null) => void;
  notificaciones: NotificacionBullMQ[];
  eliminarNotificacion: (id: string) => void;
  limpiarNotificaciones: () => void;
  confirmarReserva: (
    sala: Sala,
    fecha: string,
    horaInicio: number,
    versionEnviada: number
  ) => { exito: boolean; error?: string; reserva?: Reserva };
  cancelarReserva: (reservaId: number) => { exito: boolean; error?: string };
  crearSala: (nueva: Omit<Sala, 'id' | 'version'>) => void;
  actualizarSala: (sala: Sala) => void;
  eliminarSala: (id: number) => void;
  ejecutarColisionConcurrencia: (
    salaId: number,
    hora: number,
    versionActual: number
  ) => Promise<{ resultadoA: ResultadoConcurrencia; resultadoB: ResultadoConcurrencia }>;
  wsConectado: boolean;
}

const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

export function ReservasProvider({ children }: { children: React.ReactNode }) {
  const hoyStr = new Date().toISOString().split('T')[0];

  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>({
    id: 1,
    nombre: 'Juan Pérez (Alumno A)',
    email: 'alumnoA@universidad.edu',
    rol: 'ALUMNO',
  });

  const [wsConectado] = useState<boolean>(true);

  // Semilla inicial de salas con control de versiones optimista
  const [salas, setSalas] = useState<Sala[]>([
    { id: 1, nombre: 'Lab de Cómputo A', capacidad: 25, ubicacion: 'Edificio A - Piso 2', version: 1 },
    { id: 2, nombre: 'Sala de Estudio Grupal 1', capacidad: 10, ubicacion: 'Biblioteca - PB', version: 1 },
    { id: 3, nombre: 'Cabina de Proyectos', capacidad: 4, ubicacion: 'Biblioteca - Piso 1', version: 1 },
    { id: 4, nombre: 'Lab de Robótica y Hardware', capacidad: 18, ubicacion: 'Edificio B - Lab 3', version: 1 },
  ]);

  // Semilla inicial de reservas
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 101,
      sala_id: 1,
      sala_nombre: 'Lab de Cómputo A',
      usuario_id: 1,
      usuario_nombre: 'Juan Pérez (Alumno A)',
      fecha: hoyStr,
      hora_inicio: 9,
      hora_fin: 10,
      estado: 'CONFIRMADA',
      version_sala_aplicada: 1,
      creado_en: new Date().toISOString(),
    },
    {
      id: 102,
      sala_id: 2,
      sala_nombre: 'Sala de Estudio Grupal 1',
      usuario_id: 2,
      usuario_nombre: 'María López (Alumno B)',
      fecha: hoyStr,
      hora_inicio: 11,
      hora_fin: 12,
      estado: 'CONFIRMADA',
      version_sala_aplicada: 1,
      creado_en: new Date().toISOString(),
    },
  ]);

  // Bandeja de simulación de trabajos BullMQ / Notificaciones de Correo
  const [notificaciones, setNotificaciones] = useState<NotificacionBullMQ[]>([]);

  const eliminarNotificacion = (id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const limpiarNotificaciones = () => {
    setNotificaciones([]);
  };

  // Confirmar reserva con Bloqueo Optimista y disparo de Jobs BullMQ
  const confirmarReserva = (
    sala: Sala,
    fecha: string,
    horaInicio: number,
    versionEnviada: number
  ) => {
    if (!usuarioActual) {
      return { exito: false, error: 'Debes iniciar sesión para reservar.' };
    }

    // Validar versión optimista
    const salaExistente = salas.find((s) => s.id === sala.id);
    if (!salaExistente || salaExistente.version !== versionEnviada) {
      return {
        exito: false,
        error: `409 Conflict: La versión enviada (v${versionEnviada}) no coincide con la versión en base de datos (v${salaExistente?.version}). Conflicto de concurrencia optimista detectado.`,
      };
    }

    // Incrementar versión de la sala (simulando UPDATE salas SET version = version + 1 WHERE version = $version)
    const nuevaVersion = versionEnviada + 1;
    setSalas((prev) =>
      prev.map((s) => (s.id === sala.id ? { ...s, version: nuevaVersion } : s))
    );

    const nuevaReserva: Reserva = {
      id: Date.now(),
      sala_id: sala.id,
      sala_nombre: sala.nombre,
      usuario_id: usuarioActual.id,
      usuario_nombre: usuarioActual.nombre,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaInicio + 1,
      estado: 'CONFIRMADA',
      version_sala_aplicada: nuevaVersion,
      creado_en: new Date().toISOString(),
    };

    setReservas((prev) => [...prev, nuevaReserva]);

    // Simulación de BullMQ: 2 Jobs creados
    // Job 1: Envío Inmediato de Confirmación
    const notifInmediata: NotificacionBullMQ = {
      id: `job-inm-${Date.now()}`,
      tipo: 'EMAIL_CONFIRMACION',
      jobId: `bullmq-job-${Math.floor(Math.random() * 90000 + 10000)}`,
      cola: 'correo-inmediato',
      delay: '0ms (Inmediato)',
      asunto: `Confirmación de Reserva #${nuevaReserva.id}: ${sala.nombre}`,
      destinatario: usuarioActual.email,
      cuerpo: `Hola ${usuarioActual.nombre}, tu reserva para el espacio "${sala.nombre}" el día ${fecha} en el horario ${horaInicio}:00 - ${horaInicio + 1}:00 ha sido confirmada con éxito. Versión ACID aplicada: v${nuevaVersion}.`,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Job 2: Recordatorio con Delay (1 hora antes)
    const notifRecordatorio: NotificacionBullMQ = {
      id: `job-rec-${Date.now()}`,
      tipo: 'EMAIL_RECORDATORIO',
      jobId: `bullmq-job-${Math.floor(Math.random() * 90000 + 10000)}`,
      cola: 'correo-recordatorio',
      delay: 'Delay programado: 1 hora antes del bloque',
      asunto: `Recordatorio de Próxima Reserva: ${sala.nombre}`,
      destinatario: usuarioActual.email,
      cuerpo: `Recordatorio automático: En 1 hora comienza tu reserva en "${sala.nombre}" (${sala.ubicacion}). Recuerda presentarte a tiempo.`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setNotificaciones((prev) => [notifInmediata, notifRecordatorio, ...prev]);

    return { exito: true, reserva: nuevaReserva };
  };

  // Cancelar reserva (RF-05)
  const cancelarReserva = (reservaId: number) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === reservaId ? { ...r, estado: 'CANCELADA' } : r))
    );

    const r = reservas.find((res) => res.id === reservaId);
    if (r && usuarioActual) {
      const notifCancel: NotificacionBullMQ = {
        id: `job-canc-${Date.now()}`,
        tipo: 'EMAIL_CONFIRMACION',
        jobId: `bullmq-job-${Math.floor(Math.random() * 90000 + 10000)}`,
        cola: 'correo-inmediato',
        delay: '0ms (Inmediato)',
        asunto: `Cancelación de Reserva #${r.id} Confirmada`,
        destinatario: usuarioActual.email,
        cuerpo: `Tu reserva #${r.id} para el ${r.fecha} ha sido cancelada. El espacio ha quedado libre nuevamente en el calendario.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setNotificaciones((prev) => [notifCancel, ...prev]);
    }

    return { exito: true };
  };

  // Funciones de Administrador
  const crearSala = (nueva: Omit<Sala, 'id' | 'version'>) => {
    const salaNueva: Sala = {
      ...nueva,
      id: Date.now(),
      version: 1,
    };
    setSalas((prev) => [...prev, salaNueva]);
  };

  const actualizarSala = (salaActualizada: Sala) => {
    setSalas((prev) =>
      prev.map((s) => (s.id === salaActualizada.id ? salaActualizada : s))
    );
  };

  const eliminarSala = (id: number) => {
    setSalas((prev) => prev.filter((s) => s.id !== id));
  };

  // Simulación de Concurrencia (Promise.all)
  const ejecutarColisionConcurrencia = async (
    salaId: number,
    hora: number,
    versionActual: number
  ): Promise<{ resultadoA: ResultadoConcurrencia; resultadoB: ResultadoConcurrencia }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const resultadoA: ResultadoConcurrencia = {
      usuario: 'Usuario A (Alumno A)',
      status: 201,
      exito: true,
      mensaje: `201 Created: Transacción confirmada. Versión de sala actualizada a v${versionActual + 1}`,
      timestamp: new Date().toLocaleTimeString(),
      datos: {
        sala_id: salaId,
        hora_inicio: hora,
        version_previa: versionActual,
        version_nueva: versionActual + 1,
        transaccion: 'ACID COMMIT',
      },
    };

    const resultadoB: ResultadoConcurrencia = {
      usuario: 'Usuario B (Alumno B)',
      status: 409,
      exito: false,
      mensaje: `409 Conflict: Optimistic Lock Collision. La versión enviada (${versionActual}) ya expiró en base de datos. Transacción revertida con ROLLBACK.`,
      timestamp: new Date().toLocaleTimeString(),
      datos: {
        error: 'CONFLICT_OPTIMISTIC_LOCK',
        codigo_http: 409,
        detalle: 'UPDATE salas SET version = version + 1 WHERE id = $1 AND version = $2 retornó 0 filas afectadas.',
        transaccion: 'ROLLBACK',
      },
    };

    setSalas((prev) =>
      prev.map((s) => (s.id === salaId ? { ...s, version: s.version + 1 } : s))
    );

    return { resultadoA, resultadoB };
  };

  return (
    <ReservasContext.Provider
      value={{
        salas,
        reservas,
        usuarioActual,
        setUsuarioActual,
        notificaciones,
        eliminarNotificacion,
        limpiarNotificaciones,
        confirmarReserva,
        cancelarReserva,
        crearSala,
        actualizarSala,
        eliminarSala,
        ejecutarColisionConcurrencia,
        wsConectado,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservas debe usarse dentro de un ReservasProvider');
  }
  return context;
}
