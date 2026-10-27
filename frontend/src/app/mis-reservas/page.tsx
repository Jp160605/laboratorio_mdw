'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MisReservas from '@/components/MisReservas';
import PixelBadge from '@/components/PixelBadge';
import PixelIcon from '@/components/PixelIcon';
import { useReservas } from '@/context/ReservasContext';

export default function MisReservasPage() {
  const { misReservas, usuarioActual, cancelarReserva, cargarMisReservas } = useReservas();
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  useEffect(() => {
    cargarMisReservas();
  }, [cargarMisReservas, usuarioActual]);

  const handleCancelar = async (id: number) => {
    setMensajeExito(null);
    setMensajeError(null);
    const res = await cancelarReserva(id);
    if (!res.exito) {
      setMensajeError(res.error || 'No se pudo cancelar la reserva.');
    } else {
      setMensajeExito(`Reserva #${id} cancelada exitosamente en PostgreSQL. El espacio ha quedado libre en el calendario.`);
    }
  };

  return (
    <div className="min-h-screen text-neo-dark flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl p-3 sm:p-6 lg:p-8 space-y-6 min-w-0 overflow-hidden box-border">
        {/* Cabecera del Historial */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#FFFAEB]">
          <div>
            <div className="flex items-center gap-2 font-pixel text-xs font-bold text-[#FFFAEB]/70 mb-1">
              <span>HISTORIAL_MOVIMIENTOS</span>
              <span>{'//'}</span>
              <span className="text-[#EF476F]">MIS_RESERVAS</span>
            </div>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-white">
              Tus Movimientos // Reservas
            </h1>
            <p className="mt-1 font-body text-xs text-[#FFFAEB]/85">
              Gestiona tus reservas activas, cancela con mínimo 2 horas de anticipación (RF-05) y visualiza las confirmaciones procesadas por BullMQ.
            </p>
          </div>

          <PixelBadge variant="pink" size="md">
            RF-05 & RF-07
          </PixelBadge>
        </div>

        {/* Notificación Retro de Éxito al Cancelar */}
        {mensajeExito && (
          <div className="border-4 border-[#06D6A0] bg-[#06D6A0]/20 p-4 font-body text-xs text-[#073B4C] flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 font-pixel font-bold">
              <PixelIcon name="check" size={16} color="#06D6A0" />
              <span>{mensajeExito}</span>
            </div>
            <button
              type="button"
              onClick={() => setMensajeExito(null)}
              className="font-pixel font-bold text-xs text-[#073B4C] hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        {/* Notificación Retro de Error al Cancelar */}
        {mensajeError && (
          <div className="border-4 border-[#e11d48] bg-[#fecdd3] p-4 font-body text-xs text-[#073B4C] flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 font-pixel font-bold text-[#e11d48]">
              <PixelIcon name="alert" size={16} color="#e11d48" />
              <span>{mensajeError}</span>
            </div>
            <button
              type="button"
              onClick={() => setMensajeError(null)}
              className="font-pixel font-bold text-xs text-[#073B4C] hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        {/* Componente del Historial de Reservas */}
        <MisReservas
          reservas={misReservas}
          usuarioActual={usuarioActual}
          onCancelarReserva={handleCancelar}
        />
      </main>
    </div>
  );
}
