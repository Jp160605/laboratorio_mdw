'use client';

import React, { useState } from 'react';
import { useReservas } from '@/context/ReservasContext';
import PixelIcon from '@/components/PixelIcon';
import PixelBadge from '@/components/PixelBadge';

export default function NotificationDrawer() {
  const { notificaciones, eliminarNotificacion, limpiarNotificaciones } = useReservas();
  const [abierto, setAbierto] = useState<boolean>(false);

  if (notificaciones.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!abierto ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="flex items-center gap-2 border-3 border-[#0284c7] bg-[#38bdf8] px-4 py-2.5 font-pixel text-xs font-bold uppercase text-[#073B4C] hover:-translate-y-1 transition-all animate-bounce shadow-lg"
        >
          <span className="flex h-3 w-3 rounded-full border border-[#0284c7] bg-[#EF476F] animate-ping" />
          <PixelIcon name="terminal" size={16} />
          <span>BullMQ Correos ({notificaciones.length})</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 border-4 border-[#0284c7] bg-[#bae6fd] overflow-hidden text-[#073B4C] shadow-2xl animate-in slide-in-from-bottom-5">
          {/* Header estilo retro OS en #38bdf8 con borde #0284c7 */}
          <div className="flex items-center justify-between border-b-[3px] border-[#0284c7] bg-[#38bdf8] px-3.5 py-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* 3 Círculos Mac */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#EF476F] border border-[#0284c7]" />
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FFD166] border border-[#0284c7]" />
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#118AB2] border border-[#0284c7]" />
              </div>
              <span className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C] truncate ml-1">
                BULLMQ.LOG ({notificaciones.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={limpiarNotificaciones}
                title="Limpiar bandeja"
                className="font-pixel text-[10px] text-[#073B4C] font-bold underline hover:text-[#e11d48] px-1"
              >
                LIMPIAR
              </button>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="flex h-4 w-4 items-center justify-center border-2 border-[#0284c7] bg-[#EF476F] text-white font-pixel font-bold text-[10px] leading-none hover:brightness-110 active:scale-95 transition-transform"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lista de Trabajos BullMQ Procesados */}
          <div className="max-h-80 overflow-y-auto divide-y-2 divide-[#0284c7]/20 p-2 space-y-2 bg-[#bae6fd] text-[#073B4C]">
            {notificaciones.map((notif) => (
              <div
                key={notif.id}
                className="p-2.5 relative border border-[#0284c7]/40 bg-[#38bdf8]/20"
              >
                <div className="flex items-center justify-between">
                  <PixelBadge
                    variant={notif.cola === 'correo-inmediato' ? 'green' : 'blue'}
                    size="sm"
                  >
                    {notif.cola}
                  </PixelBadge>
                  <span className="font-pixel text-[9px] text-[#073B4C]/70 font-bold">
                    {notif.timestamp}
                  </span>
                </div>

                <div className="mt-1.5">
                  <h4 className="font-pixel text-xs font-bold text-[#073B4C] leading-tight">
                    {notif.asunto}
                  </h4>
                  <p className="font-pixel text-[10px] text-[#0284c7] mt-0.5 font-bold">
                    Para: {notif.destinatario}
                  </p>
                  <p className="mt-1 font-body text-xs text-[#073B4C]/90 p-1.5 border border-[#0284c7]/20 bg-[#bae6fd]">
                    {notif.cuerpo}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between font-pixel text-[9px] text-[#073B4C]/70">
                    <span>JOB: {notif.jobId}</span>
                    <span className="text-[#e11d48] font-bold">{notif.delay}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarNotificacion(notif.id)}
                  className="absolute top-1 right-1 text-[#073B4C]/50 hover:text-[#e11d48] font-pixel text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
