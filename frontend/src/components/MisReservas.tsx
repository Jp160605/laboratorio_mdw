'use client';

import React from 'react';
import { Reserva, Usuario } from '@/types';
import { AlertTriangle, CheckCircle, Ban } from 'lucide-react';

interface MisReservasProps {
  reservas: Reserva[];
  usuarioActual: Usuario | null;
  onCancelarReserva: (reservaId: number) => void;
}

export default function MisReservas({
  reservas,
  usuarioActual,
  onCancelarReserva,
}: MisReservasProps) {
  if (!usuarioActual) {
    return (
      <div className="rounded border border-gray-300 bg-white p-8 text-center text-gray-600">
        <p className="font-semibold text-sm">Debes iniciar sesión para consultar tu historial de reservas.</p>
      </div>
    );
  }

  const misReservas = reservas.filter((r) => r.usuario_id === usuarioActual.id);

  // Regla RF-05: Validar si faltan al menos 2 horas respecto a la fecha y hora de inicio
  const esCancelable = (reserva: Reserva): { puede: boolean; motivo?: string } => {
    if (reserva.estado === 'CANCELADA') {
      return { puede: false, motivo: 'La reserva ya se encuentra cancelada.' };
    }

    // Calcular fecha y hora de inicio de la reserva
    const fechaHoraInicio = new Date(`${reserva.fecha}T${reserva.hora_inicio < 10 ? '0' : ''}${reserva.hora_inicio}:00:00`);
    const ahora = new Date();
    const diferenciaMs = fechaHoraInicio.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    if (diferenciaHoras < 2) {
      return {
        puede: false,
        motivo: 'Regla RF-05: La cancelación requiere mínimo 2 horas de anticipación.',
      };
    }

    return { puede: true };
  };

  return (
    <section className="space-y-4">
      <div className="rounded border border-gray-300 bg-white p-4">
        <h2 className="text-base font-bold text-gray-900">Historial de Mis Reservas (RF-07)</h2>
        <p className="text-xs text-gray-500">
          Visualiza tus reservas activas e históricas. Aplica política de cancelación de al menos 2 horas de antelación (RF-05).
        </p>
      </div>

      {misReservas.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No tienes reservas registradas con el usuario {usuarioActual.nombre}.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-300 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-gray-700">
                <th className="p-3 font-bold">ID</th>
                <th className="p-3 font-bold">Espacio / Sala</th>
                <th className="p-3 font-bold">Fecha</th>
                <th className="p-3 font-bold">Horario</th>
                <th className="p-3 font-bold">Versión Aplicada</th>
                <th className="p-3 font-bold">Estado</th>
                <th className="p-3 font-bold">Acción (RF-05)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {misReservas.map((reserva) => {
                const cancelacion = esCancelable(reserva);
                return (
                  <tr key={reserva.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-gray-700">#{reserva.id}</td>
                    <td className="p-3 font-semibold text-gray-900">
                      {reserva.sala_nombre || `Sala #${reserva.sala_id}`}
                    </td>
                    <td className="p-3 font-mono text-gray-600">{reserva.fecha}</td>
                    <td className="p-3 font-mono text-gray-800">
                      {reserva.hora_inicio < 10 ? `0${reserva.hora_inicio}` : reserva.hora_inicio}:00 -{' '}
                      {reserva.hora_fin < 10 ? `0${reserva.hora_fin}` : reserva.hora_fin}:00
                    </td>
                    <td className="p-3 font-mono text-gray-500">v{reserva.version_sala_aplicada}</td>
                    <td className="p-3">
                      {reserva.estado === 'CONFIRMADA' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          CONFIRMADA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                          <Ban className="h-3 w-3" />
                          CANCELADA
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {reserva.estado === 'CONFIRMADA' && (
                        <div>
                          <button
                            type="button"
                            disabled={!cancelacion.puede}
                            onClick={() => onCancelarReserva(reserva.id)}
                            className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                              cancelacion.puede
                                ? 'border border-red-400 bg-white text-red-600 hover:bg-red-50'
                                : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
                            }`}
                          >
                            Cancelar Reserva
                          </button>
                          {!cancelacion.puede && (
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-700">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              {cancelacion.motivo}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
