'use client';

import React, { useState } from 'react';
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
  } = useReservas();

  const handleSeleccionarBloque = (sala: Sala, horaInicio: number) => {
    setBloqueSeleccionado({ sala, hora: horaInicio });
    setModalReservaAbierto(true);
  };

  const handleConfirmar = (sala: Sala, fecha: string, horaInicio: number, version: number) => {
    const res = confirmarReserva(sala, fecha, horaInicio, version);
    if (!res.exito) {
      alert(res.error);
      return;
    }
    setModalReservaAbierto(false);
  };

  return (
    <div className="min-h-screen text-neo-dark flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Cabecera Personalizada (Del Figma: "Bienvenida Mariana López") */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#FFFAEB]">
          <div>
            <div className="flex items-center gap-2 font-pixel text-xs font-bold text-[#FFFAEB]/70 mb-1">
              <span>PANEL_RESERVAS</span>
              <span>{'//'}</span>
              <span className="text-[#06D6A0]">DISPONIBILIDAD_HORARIA</span>
            </div>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-white">
              Bienvenido(a), <span className="bg-neo-yellow text-neo-dark px-2 border-2 border-neo-dark">{usuarioActual ? usuarioActual.nombre : 'Invitado'}</span>
            </h1>
            <p className="mt-1 font-body text-xs text-[#FFFAEB]/85">
              Explora las salas por horario, revisa la versión de cada espacio y agenda bloques con control de concurrencia optimista.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PixelBadge variant="green" size="md" withDot>
              ACID READY
            </PixelBadge>
            <PixelBadge variant="yellow" size="md">
              v.{salas.reduce((acc, s) => acc + s.version, 0)} TOTAL_LOCKS
            </PixelBadge>
          </div>
        </div>

        {/* Recomendador Inteligente (Figma: Filtros de Fecha, Hora, Aforo y 92% Match) */}
        <SugerirSala
          fechaActual={fechaSeleccionada}
          salas={salas}
          onReservarSugerencia={(sala, hora) => {
            handleSeleccionarBloque(sala, hora);
          }}
        />

        {/* Matriz Completa de Disponibilidad (Figma: Grilla Horaria) */}
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
