'use client';

import React, { useState } from 'react';
import { Sala } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';
import RetroWindow from '@/components/RetroWindow';

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
  porcentajeAjuste: number;
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

  // Simulación del algoritmo del Reto en cliente
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
      const horaBloque = horaDeseada;
      const diffHoraria = Math.abs(horaBloque - horaDeseada);
      const desperdicio = sala.capacidad - aforoDeseado;
      const costo = diffHoraria * 100 + desperdicio;

      // Cálculo de porcentaje de ajuste (100% es ajuste perfecto sin desperdicio)
      const porcentaje = Math.max(
        60,
        Math.min(99, Math.round(100 - (desperdicio / sala.capacidad) * 40 - diffHoraria * 15))
      );

      if (!mejorResultado || costo < mejorResultado.puntuacionCosto) {
        mejorResultado = {
          sala,
          horaInicio: horaBloque,
          diferenciaHoraria: diffHoraria,
          desperdicioAforo: desperdicio,
          puntuacionCosto: costo,
          porcentajeAjuste: porcentaje,
        };
      }
    }

    setSugerencia(mejorResultado);
  };

  return (
    <section className="space-y-4">
      {/* Banner de Contexto de Optimización */}
      <RetroWindow
        title="RECOMENDADOR_OPTIMO.EXE"
        badge="ALGORITMO_COSTO"
        headerColor="blue"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-pixel text-base font-bold text-neo-dark uppercase tracking-wide">
              Función de Costo: Minimización de Espacio y Tiempo
            </h2>
            <p className="font-body text-xs text-neo-dark/80">
              Calcula en SQL puro la sala más eficiente: <code className="bg-neo-yellow px-1 py-0.5 border border-neo-dark font-pixel font-bold">MIN(ABS(hora - deseada)*10 + (capacidad - aforo))</code>
            </p>
          </div>
          <PixelBadge variant="yellow" withDot>
            SQL NATIVO
          </PixelBadge>
        </div>
      </RetroWindow>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Formulario de Parámetros */}
        <RetroWindow
          title="PARAMETROS_ENTRADA.SYS"
          badge="INPUT"
          headerColor="cream"
        >
          <form onSubmit={handleCalcularSugerencia} className="space-y-4">
            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                {'//'} Fecha de Reserva
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-1 w-full border-3 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                {'//'} Hora Preferida
              </label>
              <select
                value={horaDeseada}
                onChange={(e) => setHoraDeseada(Number(e.target.value))}
                className="mt-1 w-full border-3 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow focus:outline-none"
              >
                {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
                  <option key={h} value={h}>
                    {h < 10 ? `0${h}:00` : `${h}:00`} a{' '}
                    {h + 1 < 10 ? `0${h + 1}:00` : `${h + 1}:00`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                {'//'} Aforo Necesario (Personas)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={aforoDeseado}
                onChange={(e) => setAforoDeseado(Number(e.target.value))}
                className="mt-1 w-full border-3 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow focus:outline-none"
                required
              />
              <p className="mt-1 font-body text-[11px] text-neo-dark/70">
                Filtra únicamente espacios donde <span className="font-bold">capacidad &gt;= aforo</span>.
              </p>
            </div>

            <PixelButton
              type="submit"
              variant="warning"
              size="md"
              className="w-full"
              icon={<PixelIcon name="zap" size={16} />}
            >
              Calcular Sala Óptima
            </PixelButton>
          </form>
        </RetroWindow>

        {/* Visualización del Resultado de Sugerencia */}
        <RetroWindow
          title="SALIDA_OPTIMA.DAT"
          badge="RESULTADO"
          headerColor="green"
        >
          {sugerencia ? (
            <div className="flex h-full flex-col justify-between space-y-4">
              <div className="border-3 border-neo-dark bg-neo-yellow p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <PixelBadge variant="pink" size="sm">
                      MEJOR AJUSTE ENCONTRADO
                    </PixelBadge>
                    <h4 className="mt-2 font-pixel text-xl font-bold uppercase tracking-wider text-neo-dark">
                      {sugerencia.sala.nombre}
                    </h4>
                    <p className="font-body text-xs text-neo-dark/80">
                      {sugerencia.sala.ubicacion}
                    </p>
                  </div>

                  {/* Puntuación estilo arcade / figma */}
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border-3 border-neo-dark bg-transparent">
                    <span className="font-pixel text-base font-bold text-neo-dark">
                      {sugerencia.porcentajeAjuste}%
                    </span>
                    <span className="font-pixel text-[9px] uppercase text-neo-blue font-bold">
                      MATCH
                    </span>
                  </div>
                </div>

                {/* Métricas en Grilla Modular */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="border-2 border-neo-dark bg-transparent p-2">
                    <span className="block font-pixel text-[10px] uppercase text-neo-dark/60 font-bold">
                      {'//'} Horario Bloque
                    </span>
                    <span className="font-pixel text-sm font-bold text-neo-dark">
                      {sugerencia.horaInicio}:00 - {sugerencia.horaInicio + 1}:00
                    </span>
                  </div>
                  <div className="border-2 border-neo-dark bg-transparent p-2">
                    <span className="block font-pixel text-[10px] uppercase text-neo-dark/60 font-bold">
                      {'//'} Capacidad Sala
                    </span>
                    <span className="font-pixel text-sm font-bold text-neo-dark">
                      {sugerencia.sala.capacidad} personas
                    </span>
                  </div>
                </div>

                {/* Justificación de Función de Costo */}
                <div className="mt-3 border-2 border-neo-dark bg-transparent p-2.5 font-body text-xs space-y-1">
                  <p className="font-pixel font-bold uppercase text-neo-dark text-[11px]">
                    Desglose de Eficiencia:
                  </p>
                  <p>• Desviación horaria: <strong className="font-pixel">{sugerencia.diferenciaHoraria}h</strong></p>
                  <p>• Asientos sobrantes: <strong className="font-pixel">{sugerencia.desperdicioAforo} pers.</strong></p>
                </div>
              </div>

              <PixelButton
                type="button"
                variant="success"
                size="lg"
                className="w-full"
                onClick={() =>
                  onReservarSugerencia(sugerencia.sala, sugerencia.horaInicio)
                }
                icon={<PixelIcon name="check" size={18} />}
              >
                Aceptar y Confirmar Reserva
              </PixelButton>
            </div>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center border-2 border-dashed border-neo-dark/40 bg-transparent p-6 text-center">
              <PixelIcon name="sparkles" size={32} className="text-neo-blue mb-2" />
              <p className="font-pixel text-xs font-bold uppercase tracking-wider text-neo-dark">
                Esperando Parámetros...
              </p>
              <p className="mt-1 font-body text-xs text-neo-dark/70">
                Selecciona fecha, hora y aforo para evaluar la función de costo y encontrar la mejor sala disponible.
              </p>
            </div>
          )}
        </RetroWindow>
      </div>
    </section>
  );
}
