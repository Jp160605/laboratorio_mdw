'use client';

import React from 'react';
import { Sala, Usuario } from '@/types';
import { X } from 'lucide-react';

interface ModalReservaProps {
  abierto: boolean;
  onCerrar: () => void;
  sala: Sala | null;
  fecha: string;
  horaInicio: number;
  usuarioActual: Usuario | null;
  onConfirmar: (sala: Sala, fecha: string, horaInicio: number, version: number) => void;
}

export default function ModalReserva({
  abierto,
  onCerrar,
  sala,
  fecha,
  horaInicio,
  usuarioActual,
  onConfirmar,
}: ModalReservaProps) {
  if (!abierto || !sala) return null;

  const horaFin = horaInicio + 1;
  const etiquetaHora = `${horaInicio < 10 ? '0' : ''}${horaInicio}:00 - ${horaFin < 10 ? '0' : ''}${horaFin}:00`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded border border-gray-300 bg-white shadow-xl">
        {/* Header del Modal */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900">Confirmar Reserva de Espacio</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cuerpo del Modal con Resumen de Parámetros */}
        <div className="space-y-3 p-4 text-xs">
          <div className="rounded border border-gray-200 bg-gray-50 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Espacio Seleccionado:</span>
              <span className="font-bold text-gray-900">{sala.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Ubicación y Capacidad:</span>
              <span className="text-gray-700">{sala.ubicacion} ({sala.capacidad} pers.)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Fecha:</span>
              <span className="font-mono text-gray-900">{fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Horario de Bloque:</span>
              <span className="font-mono font-bold text-blue-700">{etiquetaHora}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span className="font-semibold text-gray-500">Versión de Sala Enviada:</span>
              <span className="font-mono font-bold bg-gray-200 px-1.5 py-0.5 rounded text-gray-800">
                v{sala.version}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Usuario Solicitante:</span>
              <span className="font-semibold text-gray-900">
                {usuarioActual ? usuarioActual.nombre : 'No autenticado'}
              </span>
            </div>
          </div>

          <div className="rounded bg-blue-50 p-2.5 text-[11px] text-blue-800 border border-blue-200">
            <strong>Flujo de la Transacción:</strong> Al pulsar &quot;Confirmar Reserva&quot;, Express iniciará una transacción ACID (<code>BEGIN</code>), validará la versión actual <code>v{sala.version}</code> con Bloqueo Optimista, invalidará la caché en Redis y emitirá el evento en tiempo real por WebSockets.
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 p-3">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirmar(sala, fecha, horaInicio, sala.version)}
            className="rounded border border-black bg-black px-4 py-1.5 text-xs font-bold text-white transition hover:bg-gray-800"
          >
            Confirmar Reserva (POST)
          </button>
        </div>
      </div>
    </div>
  );
}
