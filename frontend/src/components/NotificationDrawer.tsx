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
          className="flex items-center gap-2 border-3 border-neo-dark bg-neo-yellow px-4 py-2.5 font-pixel text-xs font-bold uppercase text-neo-dark hover:-translate-y-1 transition-all animate-bounce"
        >
          <span className="flex h-3 w-3 rounded-full border border-neo-dark bg-neo-pink animate-ping" />
          <PixelIcon name="terminal" size={16} />
          <span>BullMQ Correos ({notificaciones.length})</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 border-3 border-neo-dark bg-[#FFFAEB] animate-in slide-in-from-bottom-5">
          {/* Header de la Bandeja */}
          <div className="flex items-center justify-between border-b-3 border-neo-dark bg-neo-dark px-3 py-2 text-neo-bg">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-neo-green animate-pulse" />
              <span className="font-pixel text-xs font-bold uppercase tracking-wider text-neo-yellow">
                COLA_BULLMQ.LOG ({notificaciones.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={limpiarNotificaciones}
                title="Limpiar bandeja"
                className="font-pixel text-[10px] text-neo-bg/70 hover:text-neo-pink"
              >
                LIMPIAR
              </button>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="flex h-5 w-5 items-center justify-center border border-white bg-neo-pink text-white font-pixel font-bold text-xs"
              >
                ×
              </button>
            </div>
          </div>

          {/* Lista de Trabajos BullMQ Procesados */}
          <div className="max-h-80 overflow-y-auto divide-y-2 divide-neo-dark/20 p-2 space-y-2 bg-[#FFFDF5]">
            {notificaciones.map((notif) => (
              <div
                key={notif.id}
                className="p-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <PixelBadge
                    variant={notif.cola === 'correo-inmediato' ? 'green' : 'blue'}
                    size="sm"
                  >
                    {notif.cola}
                  </PixelBadge>
                  <span className="font-pixel text-[9px] text-neo-dark/60 font-bold">
                    {notif.timestamp}
                  </span>
                </div>

                <div className="mt-1.5">
                  <h4 className="font-pixel text-xs font-bold text-neo-dark leading-tight">
                    {notif.asunto}
                  </h4>
                  <p className="font-pixel text-[10px] text-neo-blue mt-0.5">
                    Para: {notif.destinatario}
                  </p>
                  <p className="mt-1 font-body text-xs text-neo-dark/85 p-1.5">
                    {notif.cuerpo}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between font-pixel text-[9px] text-neo-dark/60">
                    <span>JOB: {notif.jobId}</span>
                    <span className="text-neo-pink">{notif.delay}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarNotificacion(notif.id)}
                  className="absolute top-1 right-1 text-neo-dark/40 hover:text-neo-pink font-pixel text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-neo-dark bg-transparent p-2 text-center font-pixel text-[10px] text-neo-dark/70">
            * Simulación de BullMQ Worker con Redis en segundo plano
          </div>
        </div>
      )}
    </div>
  );
}
