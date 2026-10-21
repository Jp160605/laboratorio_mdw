'use client';

import React from 'react';
import { Sala, Reserva, Usuario } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import RetroWindow from '@/components/RetroWindow';

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
    return `${inicio} // ${fin}`;
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

  // Paleta de 3 colores para encabezados de salas: Azul, Rojo, Amarillo (Verde exclusivo para CTA)
  const coloresSalas = [
    { bg: 'bg-[#38bdf8] text-[#073B4C]', border: 'border-[#0284c7]', versionBadge: 'border-[#0284c7] bg-[#bae6fd]' },
    { bg: 'bg-[#fb7185] text-[#073B4C]', border: 'border-[#e11d48]', versionBadge: 'border-[#e11d48] bg-[#fecdd3]' },
    { bg: 'bg-[#ffb220] text-[#073B4C]', border: 'border-[#dd6902]', versionBadge: 'border-[#dd6902] bg-[#ffdf88]' },
  ];

  return (
    <section className="space-y-4">
      {/* Barra de Controles Neobrutalista en Ventana Amarilla */}
      <RetroWindow
        title="HORARIO_DISPONIBILIDAD.SYS"
        badge="TIEMPO_REAL"
        color="yellow"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-[#073B4C]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border-2 border-[#dd6902] bg-[#ffb220] px-3 py-1.5">
              <PixelIcon name="calendar" size={18} className="text-[#073B4C]" />
              <label
                htmlFor="fecha-picker"
                className="font-pixel text-xs font-bold uppercase text-[#073B4C]"
              >
                Fecha:
              </label>
            </div>
            <input
              id="fecha-picker"
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => onCambiarFecha(e.target.value)}
              className="border-2 border-[#dd6902] bg-[#ffdf88] px-3 py-1.5 font-pixel text-sm font-bold text-[#073B4C] focus:bg-[#ffb220]/30 focus:outline-none"
            />
          </div>

          {/* Leyenda de Estados */}
          <div className="flex flex-wrap items-center gap-3 font-pixel text-xs font-bold">
            <div className="flex items-center gap-1.5 border-2 border-[#dd6902] bg-[#ffb220]/40 px-2 py-1">
              <span className="h-3 w-3 border border-[#073B4C] bg-[#06D6A0]"></span>
              <span className="text-[#073B4C]">LIBRE (Clic)</span>
            </div>
            <div className="flex items-center gap-1.5 border-2 border-[#0284c7] bg-[#bae6fd] px-2 py-1">
              <span className="h-3 w-3 border border-[#0284c7] bg-[#38bdf8]"></span>
              <span className="text-[#073B4C]">MI RESERVA</span>
            </div>
            <div className="flex items-center gap-1.5 border-2 border-[#e11d48] bg-[#fecdd3] px-2 py-1">
              <span className="h-3 w-3 border border-[#e11d48] bg-[#fb7185]"></span>
              <span className="text-[#073B4C]">OCUPADO</span>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Matriz / Grilla de Calendario Enmarcada como Ventana Retro */}
      <div className="overflow-x-auto border-4 border-[#dd6902] bg-[#ffdf88] shadow-md">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-[3px] border-[#dd6902]">
              <th className="sticky left-0 z-20 w-36 border-r-[3px] border-[#dd6902] bg-[#073B4C] p-3.5 font-pixel text-xs font-bold uppercase tracking-wider text-[#FFD166]">
                <div className="flex items-center gap-2">
                  <PixelIcon name="clock" size={16} className="text-[#FFD166]" />
                  <span>Horario</span>
                </div>
              </th>
              {salas.map((sala, idx) => {
                const colorConfig = coloresSalas[idx % coloresSalas.length];
                return (
                  <th
                    key={sala.id}
                    className={`min-w-56 border-r-[3px] border-b-[3px] ${colorConfig.border} p-3 last:border-r-0 ${colorConfig.bg}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-pixel text-[11px] opacity-75">
                            {'//'} 0{idx + 1}
                          </span>
                          <p className="font-pixel text-sm font-bold uppercase tracking-wide">
                            {sala.nombre}
                          </p>
                        </div>
                        <p className="mt-0.5 font-body text-xs opacity-90">
                          Aforo: {sala.capacidad} pers. • {sala.ubicacion}
                        </p>
                      </div>

                      {/* Badge de Versión Optimista */}
                      <span
                        title="Versión para bloqueo optimista"
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 font-pixel text-[10px] font-bold text-[#073B4C] border ${colorConfig.versionBadge}`}
                      >
                        v.{sala.version}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#dd6902]/25">
            {horas.map((hora) => (
              <tr key={hora} className="hover:bg-[#ffb220]/20 transition-colors">
                {/* Columna de Hora */}
                <td className="sticky left-0 z-10 border-r-[3px] border-[#dd6902] bg-[#ffb220]/70 p-2.5 font-pixel text-xs font-bold text-[#073B4C]">
                  {getEtiquetaHora(hora)}
                </td>

                {/* Celdas por Sala */}
                {salas.map((sala) => {
                  const reserva = obtenerReserva(sala.id, hora);
                  const esMia =
                    reserva && usuarioActual && reserva.usuario_id === usuarioActual.id;

                  if (reserva) {
                    return (
                      <td
                        key={sala.id}
                        className={`border-r-2 border-[#dd6902]/30 p-2 last:border-r-0 ${
                          esMia ? 'bg-[#38bdf8]/20' : 'bg-[#fb7185]/20'
                        }`}
                      >
                        <div
                          className={`flex flex-col justify-between border-2 p-2.5 ${
                            esMia
                              ? 'border-[#0284c7] bg-[#38bdf8] text-[#073B4C]'
                              : 'border-[#e11d48] bg-[#fb7185] text-[#073B4C]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-pixel text-[11px] font-bold uppercase tracking-wider">
                              {esMia ? '★ TU RESERVA' : '✗ OCUPADO'}
                            </span>
                            <PixelIcon
                              name={esMia ? 'check' : 'close'}
                              size={14}
                              color="#073B4C"
                            />
                          </div>
                          <p className="mt-1 font-body text-xs font-semibold opacity-95">
                            {esMia
                              ? 'Confirmado para ti'
                              : `Usuario #${reserva.usuario_id}`}
                          </p>
                          <div className="mt-1 flex items-center justify-between border-t border-[#073B4C]/20 pt-1 font-pixel text-[9px]">
                            <span>v_ok:{reserva.version_sala_aplicada}</span>
                            <span className="opacity-75">#{reserva.id}</span>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={sala.id}
                      className="border-r-2 border-[#dd6902]/30 p-2 last:border-r-0"
                    >
                      <button
                        type="button"
                        onClick={() => onSeleccionarBloque(sala, hora)}
                        className="group flex w-full flex-col justify-between bg-transparent border-0 p-2 text-left transition-colors hover:bg-[#06D6A0]/25"
                      >
                        <div className="flex items-center justify-between text-[#073B4C]">
                          <span className="font-pixel text-[11px] font-bold uppercase tracking-wider text-[#073B4C]/70 group-hover:text-[#073B4C]">
                            + DISPONIBLE
                          </span>
                          <PixelIcon
                            name="plus"
                            size={12}
                            className="text-[#073B4C] opacity-50 group-hover:opacity-100"
                          />
                        </div>
                        <span className="mt-1 font-pixel text-[10px] font-bold text-[#dd6902] group-hover:text-[#06D6A0]">
                          RESERVAR &gt;
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
