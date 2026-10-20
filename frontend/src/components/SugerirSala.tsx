'use client';

import React, { useState } from 'react';
import { Sala } from '@/types';
import { Sparkles, Users, Clock, ArrowRight } from 'lucide-react';

interface SugerirSalaProps {
  fechaActual: string;
  salas: Sala[];
  onReservarSugerencia: (sala: Sala, hora: number) => void;
}

interface SugerenciaResultado {
  sala: Sala;
  horaInicio: number;
  diferenciaHoraria: number;
  desperdicioAforo: number;
  puntuacionCosto: number;
}

export default function SugerirSala({
  fechaActual,
  salas,
  onReservarSugerencia,
}: SugerirSalaProps) {
  const [fecha, setFecha] = useState<string>(fechaActual);
  const [horaDeseada, setHoraDeseada] = useState<number>(10);
  const [aforoDeseado, setAforoDeseado] = useState<number>(12);
  const [sugerencia, setSugerencia] = useState<SugerenciaResultado | null>(null);

  // Simulación del algoritmo del Reto en cliente para la maqueta
  const handleCalcularSugerencia = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Filtrar salas con capacidad suficiente (capacidad >= aforo)
    const candidatas = salas.filter((s) => s.capacidad >= aforoDeseado);

    if (candidatas.length === 0) {
      setSugerencia(null);
      alert('No se encontraron salas con la capacidad requerida.');
      return;
    }

    // 2. Evaluar función de costo:
    // Menor diferencia horaria: ABS(hora - horaDeseada)
    // Menor desperdicio de espacio: (capacidad - aforoDeseado)
    let mejorResultado: SugerenciaResultado | null = null;

    for (const sala of candidatas) {
      // Tomamos un bloque de prueba disponible cercano
      const horaBloque = horaDeseada; // En backend será calculado en SQL
      const diffHoraria = Math.abs(horaBloque - horaDeseada);
      const desperdicio = sala.capacidad - aforoDeseado;
      const costo = diffHoraria * 100 + desperdicio; // Ponderación de costo

      if (!mejorResultado || costo < mejorResultado.puntuacionCosto) {
        mejorResultado = {
          sala,
          horaInicio: horaBloque,
          diferenciaHoraria: diffHoraria,
          desperdicioAforo: desperdicio,
          puntuacionCosto: costo,
        };
      }
    }

    setSugerencia(mejorResultado);
  };

  return (
    <section className="space-y-4">
      {/* Encabezado del Reto */}
      <div className="rounded border border-gray-300 bg-white p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-gray-900">
            Recomendador Inteligente: &quot;Mejor Sala&quot; (Reto)
          </h2>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Algoritmo de optimización que minimiza la desviación horaria y el desperdicio de asientos mediante una función de costo SQL.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Formulario de Criterios */}
        <form
          onSubmit={handleCalcularSugerencia}
          className="space-y-4 rounded border border-gray-300 bg-white p-4"
        >
          <h3 className="font-semibold text-xs uppercase text-gray-500">Parámetros Deseados</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Fecha del Bloque</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-medium focus:border-black focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Hora Deseada</label>
            <select
              value={horaDeseada}
              onChange={(e) => setHoraDeseada(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-medium focus:border-black focus:outline-none"
            >
              {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
                <option key={h} value={h}>
                  {h < 10 ? `0${h}:00` : `${h}:00`} a {h + 1 < 10 ? `0${h + 1}:00` : `${h + 1}:00`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Aforo Requerido (Personas)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={aforoDeseado}
              onChange={(e) => setAforoDeseado(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-medium focus:border-black focus:outline-none"
              required
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Filtra salas donde <code className="bg-gray-100 px-1 font-mono">capacidad &gt;= aforo</code>.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded border border-black bg-black py-2 text-xs font-bold text-white transition hover:bg-gray-800"
          >
            Calcular Mejor Sala con Función de Costo
          </button>
        </form>

        {/* Visualización de la Sala Recomendada */}
        <div className="flex flex-col justify-between rounded border border-gray-300 bg-white p-4">
          <h3 className="font-semibold text-xs uppercase text-gray-500">Resultado de la Sugerencia</h3>

          {sugerencia ? (
            <div className="my-auto space-y-4">
              <div className="rounded border border-indigo-200 bg-indigo-50/50 p-4">
                <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  Recomendación Óptima
                </span>
                <h4 className="mt-2 text-lg font-bold text-gray-900">{sugerencia.sala.nombre}</h4>
                <p className="text-xs text-gray-600">{sugerencia.sala.ubicacion}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 rounded border border-indigo-200 bg-white p-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <div>
                      <span className="block text-[10px] text-gray-500">Horario Asignado</span>
                      <span className="font-bold">
                        {sugerencia.horaInicio}:00 - {sugerencia.horaInicio + 1}:00
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded border border-indigo-200 bg-white p-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <div>
                      <span className="block text-[10px] text-gray-500">Capacidad Total</span>
                      <span className="font-bold">{sugerencia.sala.capacidad} personas</span>
                    </div>
                  </div>
                </div>

                {/* Justificación de la función de costo */}
                <div className="mt-3 rounded bg-white p-2.5 text-[11px] text-gray-700 space-y-1 border border-indigo-100">
                  <p className="font-semibold text-indigo-900">Cálculo de la función de costo:</p>
                  <p>• Desviación horaria: {sugerencia.diferenciaHoraria} horas</p>
                  <p>• Asientos desaprovechados: {sugerencia.desperdicioAforo} asientos</p>
                  <p className="font-mono text-[10px] text-gray-500">
                    Costo = ABS({sugerencia.horaInicio} - {horaDeseada}) + ({sugerencia.sala.capacidad} - {aforoDeseado})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onReservarSugerencia(sugerencia.sala, sugerencia.horaInicio)}
                className="flex w-full items-center justify-center gap-2 rounded border border-indigo-700 bg-indigo-600 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
              >
                <span>Aceptar y Proceder a Reservar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="my-auto rounded border border-dashed border-gray-300 p-8 text-center text-xs text-gray-500">
              Ingresa los parámetros y pulsa en &quot;Calcular Mejor Sala&quot; para ver la opción óptima calculada por la función de costo.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
