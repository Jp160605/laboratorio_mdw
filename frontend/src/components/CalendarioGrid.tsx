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

  // Paleta de colores para los encabezados de salas
  const coloresSalas = [
    { bg: 'bg-neo-blue text-white', badge: 'blue' as const },
    { bg: 'bg-neo-pink text-white', badge: 'pink' as const },
    { bg: 'bg-neo-yellow text-neo-dark', badge: 'yellow' as const },
    { bg: 'bg-neo-green text-neo-dark', badge: 'green' as const },
  ];

  return (
    <section className="space-y-4">
      {/* Barra de Controles Neobrutalista */}
      <RetroWindow
        title="HORARIO_DISPONIBILIDAD.SYS"
        badge="TIEMPO_REAL"
        headerColor="cream"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border-2 border-neo-dark bg-neo-yellow px-3 py-1.5">
              <PixelIcon name="calendar" size={18} className="text-neo-dark" />
              <label
                htmlFor="fecha-picker"
                className="font-pixel text-xs font-bold uppercase text-neo-dark"
              >
                Fecha:
              </label>
            </div>
            <input
              id="fecha-picker"
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => onCambiarFecha(e.target.value)}
              className="border-3 border-neo-dark bg-transparent px-3 py-1.5 font-pixel text-sm font-bold text-neo-dark focus:bg-neo-yellow focus:outline-none"
            />
          </div>

          {/* Leyenda de Estados */}
          <div className="flex flex-wrap items-center gap-3 font-pixel text-xs font-bold">
            <div className="flex items-center gap-1.5 border-2 border-neo-dark bg-neo-green/30 px-2 py-1">
              <span className="h-3 w-3 border-2 border-neo-dark bg-neo-green"></span>
              <span className="text-neo-dark">LIBRE (Clic)</span>
            </div>
            <div className="flex items-center gap-1.5 border-2 border-neo-dark bg-neo-blue/20 px-2 py-1">
              <span className="h-3 w-3 border-2 border-neo-dark bg-neo-blue"></span>
              <span className="text-neo-dark">MI RESERVA</span>
            </div>
            <div className="flex items-center gap-1.5 border-2 border-neo-dark bg-neo-pink/20 px-2 py-1">
              <span className="h-3 w-3 border-2 border-neo-dark bg-neo-pink"></span>
              <span className="text-neo-dark">OCUPADO</span>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Matriz / Grilla de Calendario */}
      <div className="overflow-x-auto border-3 border-neo-dark bg-transparent">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-3 border-neo-dark bg-neo-dark text-neo-bg">
              <th className="sticky left-0 z-20 w-36 border-r-3 border-neo-dark bg-neo-dark p-3.5 font-pixel text-xs font-bold uppercase tracking-wider text-neo-yellow">
                <div className="flex items-center gap-2">
                  <PixelIcon name="clock" size={16} className="text-neo-yellow" />
                  <span>Horario</span>
                </div>
              </th>
              {salas.map((sala, idx) => {
                const colorConfig = coloresSalas[idx % coloresSalas.length];
                return (
                  <th
                    key={sala.id}
                    className={`min-w-56 border-r-3 border-neo-dark p-3 last:border-r-0 ${colorConfig.bg}`}
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
                        className="inline-flex items-center gap-1 bg-transparent px-1.5 py-0.5 font-pixel text-[10px] font-bold text-neo-dark"
                      >
                        v.{sala.version}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neo-dark">
            {horas.map((hora) => (
              <tr key={hora} className="hover:bg-[#FFFDF5]">
                {/* Columna de Hora */}
                <td className="sticky left-0 z-10 border-r-3 border-neo-dark bg-[#FFF3D6] p-2.5 font-pixel text-xs font-bold text-neo-dark">
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
                        className={`border-r-2 border-neo-dark p-2 last:border-r-0 ${
                          esMia ? 'bg-neo-blue/10' : 'bg-neo-pink/10'
                        }`}
                      >
                        <div
                          className={`flex flex-col justify-between border-2 border-neo-dark p-2.5 ${
                            esMia
                              ? 'bg-neo-blue text-white'
                              : 'bg-neo-pink text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-pixel text-[11px] font-bold uppercase tracking-wider">
                              {esMia ? '★ TU RESERVA' : '✗ OCUPADO'}
                            </span>
                            <PixelIcon
                              name={esMia ? 'check' : 'close'}
                              size={14}
                              color="#FFFFFF"
                            />
                          </div>
                          <p className="mt-1 font-body text-xs opacity-95">
                            {esMia
                              ? 'Confirmado para ti'
                              : `Usuario #${reserva.usuario_id}`}
                          </p>
                          <div className="mt-1 flex items-center justify-between border-t border-white/30 pt-1 font-pixel text-[9px]">
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
                      className="border-r-2 border-neo-dark p-2 last:border-r-0"
                    >
                      <button
                        type="button"
                        onClick={() => onSeleccionarBloque(sala, hora)}
                        className="group flex w-full flex-col justify-between bg-transparent border-0 p-2 text-left transition-colors hover:bg-neo-green/30"
                      >
                        <div className="flex items-center justify-between text-neo-dark">
                          <span className="font-pixel text-[11px] font-bold uppercase tracking-wider text-neo-dark/70 group-hover:text-neo-dark">
                            + DISPONIBLE
                          </span>
                          <PixelIcon
                            name="plus"
                            size={12}
                            className="text-neo-dark opacity-50 group-hover:opacity-100"
                          />
                        </div>
                        <span className="mt-1 font-pixel text-[10px] font-bold text-neo-blue group-hover:text-neo-dark">
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
