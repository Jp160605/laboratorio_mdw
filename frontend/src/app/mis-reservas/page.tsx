'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MisReservas from '@/components/MisReservas';
import PixelBadge from '@/components/PixelBadge';
import { useReservas } from '@/context/ReservasContext';

export default function MisReservasPage() {
  const { reservas, misReservas, usuarioActual, cancelarReserva, cargarMisReservas } = useReservas();

  useEffect(() => {
    cargarMisReservas();
  }, [cargarMisReservas, usuarioActual]);

  const listaReservas = misReservas && misReservas.length > 0 ? misReservas : reservas;

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

        {/* Componente del Historial de Reservas */}
        <MisReservas
          reservas={listaReservas}
          usuarioActual={usuarioActual}
          onCancelarReserva={async (id) => {
            const res = await cancelarReserva(id);
            if (!res.exito) {
              alert(res.error);
            }
          }}
        />
      </main>
    </div>
  );
}
