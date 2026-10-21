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
        {/* Banner de Cabecera de Administrador (Tema Amarillo) */}
        <div className="border-4 border-[#dd6902] bg-[#ffdf88] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#073B4C]">
          <div>
            <div className="flex items-center gap-2 font-pixel text-xs font-bold text-[#dd6902] mb-1">
              <span>ADMIN_CONSOLE.ROOT</span>
              <span>{'//'}</span>
              <span className="text-[#118AB2]">CONTROL_GLOBAL</span>
            </div>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-[#073B4C] tracking-tight">
              Panel de Administración y Control ACID
            </h1>
            <p className="mt-1 font-body text-xs text-[#073B4C]/85">
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

        {/* Métricas Globales del Middleware en Tarjetas Retro (Azul, Amarillo, Rojo, Azul) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Azul */}
          <div className="p-4 border-4 border-[#0284c7] bg-[#bae6fd] text-[#073B4C]">
            <span className="font-pixel text-[11px] font-bold text-[#0284c7] uppercase block">
              {'//'} Espacios Registrados
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-[#073B4C]">{salas.length}</span>
              <span className="font-pixel text-xs text-[#073B4C]/70 font-bold">SALAS</span>
            </div>
          </div>

          {/* Card 2: Amarillo */}
          <div className="p-4 border-4 border-[#dd6902] bg-[#ffdf88] text-[#073B4C]">
            <span className="font-pixel text-[11px] font-bold text-[#dd6902] uppercase block">
              {'//'} Reservas Totales
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-[#073B4C]">{reservas.length}</span>
              <span className="font-pixel text-xs text-[#06D6A0] bg-[#073B4C] px-1.5 py-0.5 font-bold">
                {reservas.filter((r) => r.estado === 'CONFIRMADA').length} ACTIVAS
              </span>
            </div>
          </div>

          {/* Card 3: Rojo */}
          <div className="p-4 border-4 border-[#e11d48] bg-[#fecdd3] text-[#073B4C]">
            <span className="font-pixel text-[11px] font-bold text-[#e11d48] uppercase block">
              {'//'} Suma Bloqueos Optimistas
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-[#073B4C]">
                v.{salas.reduce((acc, s) => acc + s.version, 0)}
              </span>
              <span className="font-pixel text-xs text-[#e11d48] font-bold">VERSION SUM</span>
            </div>
          </div>

          {/* Card 4: Azul */}
          <div className="p-4 border-4 border-[#0284c7] bg-[#bae6fd] text-[#073B4C]">
            <span className="font-pixel text-[11px] font-bold text-[#0284c7] uppercase block">
              {'//'} Trabajos en BullMQ
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-pixel text-3xl font-bold text-[#073B4C]">
                {notificaciones.length}
              </span>
              <span className="font-pixel text-xs text-[#0284c7] font-bold">JOBS REDIS</span>
            </div>
          </div>
        </div>

        {/* Sección 1: Gestión de Espacios y Salas (Ventana Azul) */}
        <RetroWindow
          title="INVENTARIO_SALAS.DAT"
          badge="CATALOGO"
          color="blue"
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
                <tr className="border-b-[3px] border-[#0284c7] bg-[#38bdf8] text-[#073B4C] font-pixel text-xs">
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre del Espacio</th>
                  <th className="p-3">Capacidad</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Versión (Lock)</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#0284c7]/25 text-[#073B4C]">
                {salas.map((sala) => (
                  <tr key={sala.id} className="hover:bg-[#38bdf8]/20 transition-colors">
                    <td className="p-3 font-pixel font-bold">#{sala.id}</td>
                    <td className="p-3 font-pixel text-sm font-bold text-[#073B4C]">
                      {sala.nombre}
                    </td>
                    <td className="p-3 font-bold">{sala.capacidad} pers.</td>
                    <td className="p-3 text-[#073B4C]/80">{sala.ubicacion}</td>
                    <td className="p-3">
                      <span className="border-2 border-[#0284c7] bg-[#bae6fd] px-2 py-0.5 font-pixel text-xs font-bold text-[#073B4C]">
                        v.{sala.version}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => eliminarSala(sala.id)}
                        className="border-2 border-[#e11d48] bg-[#fb7185] px-2.5 py-1 font-pixel text-[11px] font-bold text-white hover:bg-[#e11d48] transition-colors"
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

        {/* Sección 2: Auditoría Global de Reservas (Ventana Roja) */}
        <RetroWindow
          title="AUDITORIA_GLOBAL_RESERVAS.LOG"
          badge="RF-07"
          color="red"
          actionButton={
            <div className="flex items-center gap-1 font-pixel text-xs">
              <button
                type="button"
                onClick={() => setFiltroEstado('TODAS')}
                className={`px-2 py-0.5 border ${filtroEstado === 'TODAS' ? 'bg-[#fb7185] text-[#073B4C] border-2 border-[#e11d48] font-bold' : 'bg-[#fecdd3] text-[#073B4C]/70 border-[#e11d48]/40 hover:bg-[#fb7185]/30'}`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFiltroEstado('CONFIRMADA')}
                className={`px-2 py-0.5 border ${filtroEstado === 'CONFIRMADA' ? 'bg-[#fb7185] text-[#073B4C] border-2 border-[#e11d48] font-bold' : 'bg-[#fecdd3] text-[#073B4C]/70 border-[#e11d48]/40 hover:bg-[#fb7185]/30'}`}
              >
                Confirmadas
              </button>
              <button
                type="button"
                onClick={() => setFiltroEstado('CANCELADA')}
                className={`px-2 py-0.5 border ${filtroEstado === 'CANCELADA' ? 'bg-[#fb7185] text-[#073B4C] border-2 border-[#e11d48] font-bold' : 'bg-[#fecdd3] text-[#073B4C]/70 border-[#e11d48]/40 hover:bg-[#fb7185]/30'}`}
              >
                Canceladas
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-body text-xs">
              <thead>
                <tr className="border-b-[3px] border-[#e11d48] bg-[#fb7185] font-pixel text-xs text-[#073B4C]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Espacio</th>
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Horario</th>
                  <th className="p-3">Versión Sala</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#e11d48]/25 text-[#073B4C]">
                {reservasFiltradas.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fb7185]/20 transition-colors">
                    <td className="p-3 font-pixel font-bold">#{r.id}</td>
                    <td className="p-3 font-pixel text-xs font-bold text-[#073B4C]">{r.sala_nombre || `#${r.sala_id}`}</td>
                    <td className="p-3 font-semibold">{r.usuario_nombre || `#${r.usuario_id}`}</td>
                    <td className="p-3 font-pixel font-bold">{r.fecha}</td>
                    <td className="p-3 font-pixel">
                      {r.hora_inicio}:00 - {r.hora_fin}:00
                    </td>
                    <td className="p-3 font-pixel text-[#0284c7] font-bold">v.{r.version_sala_aplicada}</td>
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

        {/* Sección 3: Monitor de Cola BullMQ y Notificaciones (Ventana Amarilla) */}
        <RetroWindow
          title="MONITOR_COLAS_BULLMQ_REDIS.SYS"
          badge="WORKER_STATUS"
          color="yellow"
          actionButton={
            <button
              type="button"
              onClick={limpiarNotificaciones}
              className="font-pixel text-xs text-[#dd6902] underline hover:text-[#b05202]"
            >
              Vaciar Cola
            </button>
          }
        >
          {notificaciones.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[#dd6902]/30 bg-[#ffb220]/15 text-[#073B4C]">
              <PixelIcon name="terminal" size={28} className="text-[#dd6902] mb-1 inline-block" />
              <p className="font-pixel text-xs font-bold uppercase text-[#073B4C]">
                Cola BullMQ en reposo (0 jobs pendientes)
              </p>
              <p className="font-body text-xs text-[#073B4C]/75 mt-1">
                Realiza una reserva en la pestaña de Disponibilidad para observar los correos programados e inmediatos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notificaciones.map((n) => (
                <div key={n.id} className="p-3 border-2 border-[#dd6902] bg-[#ffb220]/25 text-[#073B4C]">
                  <div className="flex items-center justify-between border-b border-[#dd6902]/30 pb-1.5">
                    <PixelBadge variant={n.cola === 'correo-inmediato' ? 'green' : 'blue'} size="sm">
                      {n.cola}
                    </PixelBadge>
                    <span className="font-pixel text-[10px] text-[#073B4C]/70 font-bold">{n.jobId}</span>
                  </div>
                  <h4 className="mt-2 font-pixel text-xs font-bold text-[#073B4C] leading-tight">{n.asunto}</h4>
                  <p className="mt-1 font-body text-xs text-[#073B4C]/90 p-2 border border-[#dd6902]/20 bg-[#ffdf88]">{n.cuerpo}</p>
                  <div className="mt-2 flex items-center justify-between font-pixel text-[10px] text-[#073B4C]/70">
                    <span>Para: {n.destinatario}</span>
                    <span className="text-[#e11d48] font-bold">{n.delay}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RetroWindow>
      </main>

      {/* Modal para Crear Nueva Sala (Ventana Flotante Amarilla) */}
      {modalNuevaSala && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-none">
          <div className="w-full max-w-md border-4 border-[#dd6902] bg-[#ffdf88] overflow-hidden text-[#073B4C] shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b-[3px] border-[#dd6902] bg-[#ffb220] px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#EF476F] border border-[#dd6902]" />
                  <span className="inline-block h-3 w-3 rounded-full bg-[#FFD166] border border-[#dd6902]" />
                  <span className="inline-block h-3 w-3 rounded-full bg-[#118AB2] border border-[#dd6902]" />
                </div>
                <span className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C] ml-1.5">
                  CREAR_ESPACIO.SYS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevaSala(false)}
                className="flex h-4 w-4 items-center justify-center border-2 border-[#dd6902] bg-[#EF476F] text-white font-pixel font-bold text-[10px] leading-none hover:brightness-110 active:scale-95 transition-transform"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearSalaSubmit} className="space-y-4 p-5 text-[#073B4C]">
              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                  {'//'} Nombre del Laboratorio o Sala
                </label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Lab de Inteligencia Artificial"
                  className="mt-1 w-full border-2 border-[#dd6902] bg-[#ffdf88] p-2.5 font-pixel text-xs font-bold text-[#073B4C] focus:bg-[#ffb220]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                  {'//'} Capacidad Máxima (Aforo)
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={nuevaCapacidad}
                  onChange={(e) => setNuevaCapacidad(Number(e.target.value))}
                  className="mt-1 w-full border-2 border-[#dd6902] bg-[#ffdf88] p-2.5 font-pixel text-xs font-bold text-[#073B4C] focus:bg-[#ffb220]/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                  {'//'} Ubicación en Campus
                </label>
                <input
                  type="text"
                  value={nuevaUbicacion}
                  onChange={(e) => setNuevaUbicacion(e.target.value)}
                  placeholder="Ej. Edificio B - 3er Piso"
                  className="mt-1 w-full border-2 border-[#dd6902] bg-[#ffdf88] p-2.5 font-pixel text-xs font-bold text-[#073B4C] focus:bg-[#ffb220]/30 focus:outline-none"
                  required
                />
              </div>

              {/* Botón CTA -> VERDE #06D6A0 */}
              <div className="flex items-center justify-end gap-3 border-t-[3px] border-[#dd6902] bg-[#ffb220]/25 pt-3 -mx-5 -mb-5 px-5 pb-4">
                <button
                  type="button"
                  onClick={() => setModalNuevaSala(false)}
                  className="border-2 border-[#dd6902] bg-transparent px-3 py-1.5 font-pixel text-xs font-bold uppercase text-[#073B4C] hover:bg-[#ffb220]/50 transition-colors"
                >
                  Cancelar
                </button>
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
