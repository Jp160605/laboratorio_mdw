'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CalendarioGrid from '@/components/CalendarioGrid';
import SugerirSala from '@/components/SugerirSala';
import ModalReserva from '@/components/ModalReserva';
import PixelBadge from '@/components/PixelBadge';
import { useReservas } from '@/context/ReservasContext';
import { Sala } from '@/types';

export default function ReservasPage() {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyStr);
  const [modalReservaAbierto, setModalReservaAbierto] = useState<boolean>(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<{ sala: Sala; hora: number } | null>(null);

  const {
    salas,
    reservas,
    usuarioActual,
    confirmarReserva,
    cargarDisponibilidad,
    origenDisponibilidad,
  } = useReservas();

  // Refrescar disponibilidad en PostgreSQL / Redis al cambiar de fecha
  useEffect(() => {
    cargarDisponibilidad(fechaSeleccionada);
  }, [fechaSeleccionada, cargarDisponibilidad]);

  const handleSeleccionarBloque = (sala: Sala, horaInicio: number) => {
    setBloqueSeleccionado({ sala, hora: horaInicio });
    setModalReservaAbierto(true);
  };

  const handleConfirmar = async (sala: Sala, fecha: string, horaInicio: number, version: number) => {
    const res = await confirmarReserva(sala, fecha, horaInicio, version);
    if (!res.exito) {
      alert(res.error);
      return;
    }
    setModalReservaAbierto(false);
  };

  return (
    <div className="min-h-screen text-neo-dark flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl p-3 sm:p-6 lg:p-8 space-y-6 min-w-0 overflow-hidden box-border">
        {/* Cabecera Personalizada */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#FFFAEB]">
          <div>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-white">
              Bienvenido(a), <span className="bg-[#FFD166] text-[#073B4C] px-2 border-2 border-[#dd6902]">{usuarioActual ? usuarioActual.nombre : 'Invitado'}</span>
            </h1>
            <p className="mt-1 font-body text-xs text-[#FFFAEB]/85">
              Explora las salas por horario, revisa la versión de cada espacio y agenda bloques con control de concurrencia optimista.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PixelBadge variant="green" size="md" withDot>
              ACID READY
            </PixelBadge>
            {origenDisponibilidad && (
              <PixelBadge variant={origenDisponibilidad === 'REDIS_CACHE' ? 'green' : 'yellow'} size="md">
                {origenDisponibilidad === 'REDIS_CACHE' ? '⚡ CACHE: REDIS' : '🐘 DB: POSTGRES'}
              </PixelBadge>
            )}
            <PixelBadge variant="yellow" size="md">
              v.{salas.reduce((acc, s) => acc + s.version, 0)} TOTAL_LOCKS
            </PixelBadge>
          </div>
        </div>

        {/* Recomendador Inteligente (Figma: Filtros de Fecha, Hora, Aforo y Match) */}
        <SugerirSala
          fechaActual={fechaSeleccionada}
          salas={salas}
          onReservarSugerencia={(sala, hora) => {
            handleSeleccionarBloque(sala, hora);
          }}
        />

        {/* Matriz Completa de Disponibilidad (Grilla Horaria) */}
        <CalendarioGrid
          fechaSeleccionada={fechaSeleccionada}
          onCambiarFecha={setFechaSeleccionada}
          salas={salas}
          reservas={reservas}
          usuarioActual={usuarioActual}
          onSeleccionarBloque={handleSeleccionarBloque}
        />
      </main>

      {/* Modal de Confirmación de Reserva */}
      <ModalReserva
        abierto={modalReservaAbierto}
        onCerrar={() => setModalReservaAbierto(false)}
        sala={bloqueSeleccionado?.sala || null}
        fecha={fechaSeleccionada}
        horaInicio={bloqueSeleccionado?.hora || 8}
        usuarioActual={usuarioActual}
        onConfirmar={handleConfirmar}
      />
    </div>
  );
}
