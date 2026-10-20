'use client';

import React from 'react';
import { Sala, Reserva, Usuario } from '@/types';
import { Calendar as CalendarIcon, Clock, Layers, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

interface CalendarioGridProps {
  fechaSeleccionada: string;
  onCambiarFecha: (nuevaFecha: string) => void;
  salas: Sala[];
  reservas: Reserva[];
  usuarioActual: Usuario | null;
  onSeleccionarBloque: (sala: Sala, horaInicio: number) => void;
}

export default function CalendarioGrid({
  fechaSeleccionada,
  onCambiarFecha,
  salas,
  reservas,
  usuarioActual,
  onSeleccionarBloque,
}: CalendarioGridProps) {
  // Generar bloques de 1 hora de 08:00 a 20:00
  const horas: number[] = Array.from({ length: 13 }, (_, i) => i + 8); // 8 a 20

  const getEtiquetaHora = (hora: number): string => {
    const inicio = hora < 10 ? `0${hora}:00` : `${hora}:00`;
    const fin = hora + 1 < 10 ? `0${hora + 1}:00` : `${hora + 1}:00`;
    return `${inicio} - ${fin}`;
  };

  // Buscar reserva para una sala, fecha y hora específicas
  const obtenerReserva = (salaId: number, hora: number): Reserva | undefined => {
    return reservas.find(
      (r) =>
        r.sala_id === salaId &&
        r.fecha === fechaSeleccionada &&
        r.hora_inicio === hora &&
        r.estado === 'CONFIRMADA'
    );
  };

  return (
    <section className="space-y-4">
      {/* Barra de Controles y Filtros */}
      <div className="flex flex-col gap-3 rounded border border-gray-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <div>
            <label htmlFor="fecha-picker" className="block text-xs font-semibold text-gray-500 uppercase">
              Fecha de Visualización
            </label>
            <input
              id="fecha-picker"
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => onCambiarFecha(e.target.value)}
              className="mt-0.5 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 focus:border-black focus:outline-none"
            />
          </div>
        </div>

        {/* Leyenda de Estados */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded border border-green-600 bg-green-100"></span>
            <span>Disponible (Clic para reservar)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded border border-blue-600 bg-blue-100"></span>
            <span>Mi Reserva</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded border border-red-500 bg-red-100"></span>
            <span>Ocupado (Conflicto)</span>
          </div>
        </div>
      </div>

      {/* Matriz / Cuadrícula de Calendario */}
      <div className="overflow-x-auto rounded border border-gray-300 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-100 text-gray-700">
              <th className="sticky left-0 z-10 w-28 border-r border-gray-300 bg-gray-100 p-3 font-bold">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Horario</span>
                </div>
              </th>
              {salas.map((sala) => (
                <th key={sala.id} className="min-w-44 border-r border-gray-300 p-3 last:border-r-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{sala.nombre}</p>
                      <p className="text-[11px] text-gray-500">
                        Capacidad: {sala.capacidad} pers. • {sala.ubicacion}
                      </p>
                    </div>
                    {/* Indicador de Versión para Bloqueo Optimista */}
                    <span
                      title="Versión actual de la sala (control de concurrencia optimista)"
                      className="flex items-center gap-0.5 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gray-800"
                    >
                      <Layers className="h-3 w-3" />
                      v{sala.version}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {horas.map((hora) => (
              <tr key={hora} className="hover:bg-gray-50/50">
                {/* Columna de Hora */}
                <td className="sticky left-0 z-10 border-r border-gray-300 bg-gray-50 p-2 font-mono font-semibold text-gray-800">
                  {getEtiquetaHora(hora)}
                </td>

                {/* Celdas por Sala */}
                {salas.map((sala) => {
                  const reserva = obtenerReserva(sala.id, hora);
                  const esMia = reserva && usuarioActual && reserva.usuario_id === usuarioActual.id;

                  if (reserva) {
                    return (
                      <td
                        key={sala.id}
                        className={`border-r border-gray-200 p-2 last:border-r-0 ${
                          esMia ? 'bg-blue-50' : 'bg-red-50'
                        }`}
                      >
                        <div
                          className={`flex flex-col justify-between rounded border p-2 ${
                            esMia
                              ? 'border-blue-400 bg-blue-100/70 text-blue-900'
                              : 'border-red-300 bg-red-100/70 text-red-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] uppercase tracking-wide">
                              {esMia ? 'Tu Reserva' : 'Ocupado'}
                            </span>
                            {esMia ? (
                              <UserCheck className="h-3.5 w-3.5 text-blue-700" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-red-600" />
                            )}
                          </div>
                          <p className="mt-1 text-[10px] text-gray-600">
                            {esMia ? 'Confirmada por ti' : `Usuario #${reserva.usuario_id}`}
                          </p>
                          <span className="mt-0.5 font-mono text-[9px] text-gray-500">
                            v. aplicada: {reserva.version_sala_aplicada}
                          </span>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={sala.id} className="border-r border-gray-200 p-2 last:border-r-0">
                      <button
                        type="button"
                        onClick={() => onSeleccionarBloque(sala, hora)}
                        className="group flex w-full flex-col justify-between rounded border border-dashed border-gray-300 bg-white p-2 text-left transition hover:border-green-600 hover:bg-green-50"
                      >
                        <div className="flex items-center justify-between text-gray-600 group-hover:text-green-700">
                          <span className="font-medium text-[11px]">Disponible</span>
                          <CheckCircle2 className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                        </div>
                        <span className="mt-1 text-[10px] text-gray-400 group-hover:text-green-600 font-semibold">
                          + Reservar bloque
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
