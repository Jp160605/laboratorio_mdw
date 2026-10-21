'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';
import RetroWindow from '@/components/RetroWindow';
import { useReservas } from '@/context/ReservasContext';

export default function AdminPage() {
  const {
    salas,
    reservas,
    usuarioActual,
    setUsuarioActual,
    crearSala,
    eliminarSala,
    notificaciones,
    limpiarNotificaciones,
  } = useReservas();

  // Estados del formulario para crear nueva sala
  const [modalNuevaSala, setModalNuevaSala] = useState<boolean>(false);
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevaCapacidad, setNuevaCapacidad] = useState<number>(20);
  const [nuevaUbicacion, setNuevaUbicacion] = useState<string>('Edificio C - Lab 1');

  // Filtro de auditoría
  const [filtroEstado, setFiltroEstado] = useState<'TODAS' | 'CONFIRMADA' | 'CANCELADA'>('TODAS');

  const esAdmin = usuarioActual?.rol === 'ADMINISTRADOR';

  const handleCrearSalaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;
    crearSala({
      nombre: nuevoNombre,
      capacidad: nuevaCapacidad,
      ubicacion: nuevaUbicacion,
    });
    setNuevoNombre('');
    setModalNuevaSala(false);
  };

  const reservasFiltradas = reservas.filter((r) => {
    if (filtroEstado === 'TODAS') return true;
    return r.estado === filtroEstado;
  });

  return (
    <div className="min-h-screen text-neo-dark flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner de Cabecera de Administrador */}
        <div className="border-3 border-neo-dark bg-neo-yellow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-pixel text-xs font-bold text-neo-dark/80 mb-1">
              <span>ADMIN_CONSOLE.ROOT</span>
              <span>{'//'}</span>
              <span className="text-neo-blue">CONTROL_GLOBAL</span>
            </div>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neo-dark tracking-tight">
              Panel de Administración y Control ACID
            </h1>
            <p className="mt-1 font-body text-xs text-neo-dark/90">
              Gestión de inventario de salas, auditoría de transacciones concurrentes y monitor de colas BullMQ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!esAdmin && (
              <PixelButton
                variant="dark"
                size="sm"
                onClick={() =>
                  setUsuarioActual({
                    id: 99,
                    nombre: 'Administrador General',
                    email: 'admin@universidad.edu',
                    rol: 'ADMINISTRADOR',
                  })
                }
                icon={<PixelIcon name="shield" size={14} color="#FFFFFF" />}
              >
                Elevar a Admin
              </PixelButton>
            )}
            <PixelBadge variant={esAdmin ? 'pink' : 'dark'} size="md" withDot>
              {esAdmin ? 'SESION_ROOT' : 'MODO_LECTURA'}
            </PixelBadge>
          </div>
        </div>

        {/* Métricas Globales del Middleware */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border-2 border-[#FFFAEB]/20 bg-[#073B4C]/40 backdrop-blur-sm">
            <span className="font-pixel text-[11px] font-bold text-neo-blue uppercase block">
              {'//'} Espacios Registrados
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-white">{salas.length}</span>
              <span className="font-pixel text-xs text-white/60 font-bold">SALAS</span>
            </div>
          </div>

          <div className="p-4 border-2 border-[#FFFAEB]/20 bg-[#073B4C]/40 backdrop-blur-sm">
            <span className="font-pixel text-[11px] font-bold text-neo-green uppercase block">
              {'//'} Reservas Totales
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-white">{reservas.length}</span>
              <span className="font-pixel text-xs text-neo-green font-bold">
                {reservas.filter((r) => r.estado === 'CONFIRMADA').length} ACTIVAS
              </span>
            </div>
          </div>

          <div className="p-4 border-2 border-[#FFFAEB]/20 bg-[#073B4C]/40 backdrop-blur-sm">
            <span className="font-pixel text-[11px] font-bold text-neo-pink uppercase block">
              {'//'} Suma Bloqueos Optimistas
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-white">
                v.{salas.reduce((acc, s) => acc + s.version, 0)}
              </span>
              <span className="font-pixel text-xs text-neo-pink font-bold">VERSION SUM</span>
            </div>
          </div>

          <div className="p-4 border-2 border-[#FFFAEB]/20 bg-[#073B4C]/40 backdrop-blur-sm">
            <span className="font-pixel text-[11px] font-bold text-neo-yellow uppercase block">
              {'//'} Trabajos en BullMQ
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-white">
                {notificaciones.length}
              </span>
              <span className="font-pixel text-xs text-neo-blue font-bold">JOBS REDIS</span>
            </div>
          </div>
        </div>

        {/* Sección 1: Gestión de Espacios y Salas */}
        <RetroWindow
          title="INVENTARIO_SALAS.DAT"
          badge="CATALOGO"
          headerColor="blue"
          actionButton={
            <PixelButton
              variant="warning"
              size="sm"
              onClick={() => setModalNuevaSala(true)}
              icon={<PixelIcon name="plus" size={12} />}
            >
              Nueva Sala
            </PixelButton>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-body text-xs">
              <thead>
                <tr className="border-b-2 border-neo-dark bg-neo-dark text-neo-bg font-pixel text-xs">
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre del Espacio</th>
                  <th className="p-3">Capacidad</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Versión (Lock)</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neo-dark/20">
                {salas.map((sala) => (
                  <tr key={sala.id} className="hover:bg-[#FFFDF5]">
                    <td className="p-3 font-pixel font-bold">#{sala.id}</td>
                    <td className="p-3 font-pixel text-sm font-bold text-neo-dark">
                      {sala.nombre}
                    </td>
                    <td className="p-3 font-bold">{sala.capacidad} pers.</td>
                    <td className="p-3 text-neo-dark/80">{sala.ubicacion}</td>
                    <td className="p-3">
                      <span className="border-2 border-neo-dark bg-neo-yellow px-2 py-0.5 font-pixel text-xs font-bold text-neo-dark">
                        v.{sala.version}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => eliminarSala(sala.id)}
                        className="border-2 border-neo-dark bg-neo-pink px-2.5 py-1 font-pixel text-[11px] font-bold text-white hover:bg-[#d8355c]"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RetroWindow>

        {/* Sección 2: Auditoría Global de Reservas */}
        <RetroWindow
          title="AUDITORIA_GLOBAL_RESERVAS.LOG"
          badge="RF-07"
          headerColor="green"
          actionButton={
            <div className="flex items-center gap-1 font-pixel text-xs">
              <button
                type="button"
                onClick={() => setFiltroEstado('TODAS')}
                className={`px-2 py-0.5 border border-neo-dark ${filtroEstado === 'TODAS' ? 'bg-neo-blue text-white' : 'bg-transparent text-neo-dark'}`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFiltroEstado('CONFIRMADA')}
                className={`px-2 py-0.5 border border-neo-dark ${filtroEstado === 'CONFIRMADA' ? 'bg-neo-green text-neo-dark' : 'bg-transparent text-neo-dark'}`}
              >
                Confirmadas
              </button>
              <button
                type="button"
                onClick={() => setFiltroEstado('CANCELADA')}
                className={`px-2 py-0.5 border border-neo-dark ${filtroEstado === 'CANCELADA' ? 'bg-neo-pink text-white' : 'bg-transparent text-neo-dark'}`}
              >
                Canceladas
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-body text-xs">
              <thead>
                <tr className="border-b-2 border-neo-dark bg-[#FFF3D6] font-pixel text-xs text-neo-dark">
                  <th className="p-3">ID</th>
                  <th className="p-3">Espacio</th>
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Horario</th>
                  <th className="p-3">Versión Sala</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neo-dark/20">
                {reservasFiltradas.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FFFDF5]">
                    <td className="p-3 font-pixel font-bold">#{r.id}</td>
                    <td className="p-3 font-pixel text-xs font-bold text-neo-dark">{r.sala_nombre || `#${r.sala_id}`}</td>
                    <td className="p-3 font-semibold">{r.usuario_nombre || `#${r.usuario_id}`}</td>
                    <td className="p-3 font-pixel font-bold">{r.fecha}</td>
                    <td className="p-3 font-pixel">
                      {r.hora_inicio}:00 - {r.hora_fin}:00
                    </td>
                    <td className="p-3 font-pixel text-neo-blue font-bold">v.{r.version_sala_aplicada}</td>
                    <td className="p-3">
                      <PixelBadge
                        variant={r.estado === 'CONFIRMADA' ? 'green' : 'pink'}
                        size="sm"
                        withDot
                      >
                        {r.estado}
                      </PixelBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RetroWindow>

        {/* Sección 3: Monitor de Cola BullMQ y Notificaciones */}
        <RetroWindow
          title="MONITOR_COLAS_BULLMQ_REDIS.SYS"
          badge="WORKER_STATUS"
          headerColor="cream"
          actionButton={
            <button
              type="button"
              onClick={limpiarNotificaciones}
              className="font-pixel text-xs text-neo-pink underline hover:text-[#d8355c]"
            >
              Vaciar Cola
            </button>
          }
        >
          {notificaciones.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-neo-dark/30">
              <PixelIcon name="terminal" size={28} className="text-neo-dark/40 mb-1" />
              <p className="font-pixel text-xs font-bold uppercase text-neo-dark/70">
                Cola BullMQ en reposo (0 jobs pendientes)
              </p>
              <p className="font-body text-xs text-neo-dark/60 mt-1">
                Realiza una reserva en la pestaña de Disponibilidad para observar los correos programados e inmediatos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notificaciones.map((n) => (
                <div key={n.id} className="p-3">
                  <div className="flex items-center justify-between border-b border-neo-dark/20 pb-1.5">
                    <PixelBadge variant={n.cola === 'correo-inmediato' ? 'green' : 'blue'} size="sm">
                      {n.cola}
                    </PixelBadge>
                    <span className="font-pixel text-[10px] text-neo-dark/60 font-bold">{n.jobId}</span>
                  </div>
                  <h4 className="mt-2 font-pixel text-xs font-bold text-neo-dark leading-tight">{n.asunto}</h4>
                  <p className="mt-1 font-body text-xs text-neo-dark/80 p-2">{n.cuerpo}</p>
                  <div className="mt-2 flex items-center justify-between font-pixel text-[10px] text-neo-dark/70">
                    <span>Para: {n.destinatario}</span>
                    <span className="text-neo-pink font-bold">{n.delay}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RetroWindow>
      </main>

      {/* Modal para Crear Nueva Sala */}
      {modalNuevaSala && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-dark/70 p-4">
          <div className="w-full max-w-md border-3 border-neo-dark bg-[#FFFAEB]">
            <div className="flex items-center justify-between border-b-3 border-neo-dark bg-neo-yellow px-4 py-2.5">
              <span className="font-pixel text-xs font-bold uppercase tracking-wider text-neo-dark">
                CREAR_ESPACIO.SYS
              </span>
              <button
                type="button"
                onClick={() => setModalNuevaSala(false)}
                className="flex h-6 w-6 items-center justify-center border-2 border-neo-dark bg-neo-pink text-white font-pixel font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCrearSalaSubmit} className="space-y-4 p-5">
              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                  {'//'} Nombre del Laboratorio o Sala
                </label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Lab de Inteligencia Artificial"
                  className="mt-1 w-full border-2 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                  {'//'} Capacidad Máxima (Aforo)
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={nuevaCapacidad}
                  onChange={(e) => setNuevaCapacidad(Number(e.target.value))}
                  className="mt-1 w-full border-2 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                  {'//'} Ubicación en Campus
                </label>
                <input
                  type="text"
                  value={nuevaUbicacion}
                  onChange={(e) => setNuevaUbicacion(e.target.value)}
                  placeholder="Ej. Edificio B - 3er Piso"
                  className="mt-1 w-full border-2 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow/20 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t-2 border-neo-dark/20 pt-3">
                <PixelButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalNuevaSala(false)}
                >
                  Cancelar
                </PixelButton>
                <PixelButton
                  type="submit"
                  variant="success"
                  size="md"
                  icon={<PixelIcon name="plus" size={14} />}
                >
                  Registrar Espacio
                </PixelButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
