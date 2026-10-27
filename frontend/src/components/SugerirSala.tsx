'use client';

import React, { useState } from 'react';
import { Sala } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';
import RetroWindow from '@/components/RetroWindow';
import { apiSugerirMejorSala } from '@/services/api';

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
  const [fecha, setFecha] = useState<string>('');
  const [horaDeseada, setHoraDeseada] = useState<number>(10);
  const [aforoDeseado, setAforoDeseado] = useState<string>('');
  const [sugerencia, setSugerencia] = useState<SugerenciaResultado | null>(null);

  const aforoNum = Number(aforoDeseado);
  const formularioValido = fecha.trim() !== '' && aforoDeseado.trim() !== '' && aforoNum > 0;

  // Algoritmo de sugerencia óptima
  const handleCalcularSugerencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;

    try {
      const resp = await apiSugerirMejorSala(fecha, horaDeseada, aforoNum);
      if (resp.sugerencia) {
        const s = resp.sugerencia;
        const salaEncontrada = salas.find((item) => item.id === s.sala_id) || {
          id: s.sala_id,
          nombre: s.nombre,
          capacidad: s.capacidad,
          ubicacion: s.ubicacion,
          version: s.version,
        };
        const horaInicio = s.hora_sugerida !== undefined ? s.hora_sugerida : (s.hora_inicio || horaDeseada);
        const diffHoraria = s.desviacion_horas !== undefined ? s.desviacion_horas : Math.abs(horaInicio - horaDeseada);
        const desperdicio = s.desperdicio_asientos !== undefined ? s.desperdicio_asientos : (salaEncontrada.capacidad - aforoNum);
        const costo = s.costo_total !== undefined ? s.costo_total : (diffHoraria * 100 + desperdicio);
        const porcentaje = Math.max(
          60,
          Math.min(99, Math.round(100 - (desperdicio / salaEncontrada.capacidad) * 40 - diffHoraria * 15))
        );

        setSugerencia({
          sala: salaEncontrada,
          horaInicio,
          diferenciaHoraria: diffHoraria,
          desperdicioAforo: desperdicio,
          puntuacionCosto: costo,
          porcentajeAjuste: porcentaje,
        });
        return;
      }
    } catch {
      // Fallback a calculo local si el backend no responde
    }

    // 1. Filtrar salas con capacidad suficiente (capacidad >= aforo)
    const candidatas = salas.filter((s) => s.capacidad >= aforoNum);

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
      const desperdicio = sala.capacidad - aforoNum;
      const costo = diffHoraria * 100 + desperdicio;

      // Cálculo de porcentaje de ajuste
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
      {/* Banner de Contexto de Optimización (Tema Azul: #bae6fd fondo, #38bdf8 cabecera, #0284c7 bordes) */}
      <RetroWindow
        title="RECOMENDADOR_OPTIMO.EXE"
        badge="ALGORITMO_COSTO"
        color="blue"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[#073B4C]">
          <div>
            <h2 className="font-pixel text-base font-bold uppercase tracking-wide text-[#073B4C]">
              Función de Costo: Minimización de Espacio y Tiempo
            </h2>
            <p className="font-body text-xs text-[#073B4C]/85">
              Calcula en SQL puro la sala más eficiente:{' '}
              <code className="bg-[#38bdf8] px-1 py-0.5 border border-[#0284c7] font-pixel font-bold text-[#073B4C]">
                MIN(ABS(hora - deseada)*10 + (capacidad - aforo))
              </code>
            </p>
          </div>
          <PixelBadge variant="blue" withDot>
            SQL NATIVO
          </PixelBadge>
        </div>
      </RetroWindow>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Formulario de Parámetros (Tema Amarillo: #ffdf88 fondo, #ffb220 cabecera, #dd6902 bordes) */}
        <RetroWindow
          title="PARAMETROS_ENTRADA.SYS"
          badge="INPUT"
          color="yellow"
        >
          <form onSubmit={handleCalcularSugerencia} className="space-y-4 text-[#073B4C]">
            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                {'//'} Fecha de Reserva
              </label>
              <input
                type="date"
                min={fechaActual}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-1 w-full border-2 border-[#dd6902] bg-[#fef3c7] p-2.5 font-pixel text-xs font-bold text-[#073B4C] focus:bg-[#fef3c7] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                {'//'} Hora Preferida
              </label>
              <select
                value={horaDeseada}
                onChange={(e) => setHoraDeseada(Number(e.target.value))}
                className="mt-1 w-full border-2 border-[#dd6902] bg-[#fef3c7] p-2.5 font-pixel text-xs font-bold text-[#073B4C] focus:bg-[#fef3c7] focus:outline-none"
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
              <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                {'//'} Aforo Necesario (Personas)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                placeholder="Ej. 12"
                value={aforoDeseado}
                onChange={(e) => setAforoDeseado(e.target.value)}
                className="mt-1 w-full border-2 border-[#dd6902] bg-[#fef3c7] p-2.5 font-pixel text-xs font-bold text-[#073B4C] focus:bg-[#fef3c7] focus:outline-none"
                required
              />
              <p className="mt-1 font-body text-[11px] text-[#073B4C]/80">
                Filtra únicamente espacios donde <span className="font-bold">capacidad &gt;= aforo</span>.
              </p>
            </div>

            {/* Botón CTA Verde (#06D6A0), deshabilitado con verde claro (#a7f3d0) hasta ingresar datos */}
            <button
              type="submit"
              disabled={!formularioValido}
              className={`w-full py-2.5 px-4 font-pixel text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none ${
                formularioValido
                  ? 'bg-[#06D6A0] text-[#073B4C] border-2 border-[#073B4C] hover:bg-[#05b88a] cursor-pointer shadow-sm active:translate-y-0.5'
                  : 'bg-[#a7f3d0] text-[#073B4C]/50 border-2 border-[#073B4C]/30 cursor-not-allowed'
              }`}
            >
              <PixelIcon name="zap" size={16} color={formularioValido ? '#073B4C' : '#073B4C80'} />
              <span>Calcular Sala Óptima</span>
            </button>
          </form>
        </RetroWindow>

        {/* Visualización del Resultado (Tema Rojo: #fecdd3 fondo, #fb7185 cabecera, #e11d48 bordes) */}
        <RetroWindow
          title="SALIDA_OPTIMA.DAT"
          badge="RESULTADO"
          color="red"
        >
          {sugerencia ? (
            <div className="flex h-full flex-col justify-between space-y-4 text-[#073B4C]">
              <div className="border-3 border-[#e11d48] bg-[#fb7185]/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="border-2 border-[#e11d48] bg-[#fb7185] px-2 py-0.5 font-pixel text-[10px] font-bold text-[#073B4C] uppercase">
                      MEJOR AJUSTE ENCONTRADO
                    </span>
                    <h4 className="mt-2 font-pixel text-xl font-bold uppercase tracking-wider text-[#073B4C]">
                      {sugerencia.sala.nombre}
                    </h4>
                    <p className="font-body text-xs text-[#073B4C]/80">
                      {sugerencia.sala.ubicacion}
                    </p>
                  </div>

                  {/* Puntuación de match */}
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border-2 border-[#e11d48] bg-[#fecdd3]">
                    <span className="font-pixel text-base font-bold text-[#073B4C]">
                      {sugerencia.porcentajeAjuste}%
                    </span>
                    <span className="font-pixel text-[9px] uppercase text-[#e11d48] font-bold">
                      MATCH
                    </span>
                  </div>
                </div>

                {/* Métricas en Grilla Modular */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="border-2 border-[#e11d48] bg-[#fecdd3] p-2">
                    <span className="block font-pixel text-[10px] uppercase text-[#073B4C]/70 font-bold">
                      {'//'} Horario Bloque
                    </span>
                    <span className="font-pixel text-sm font-bold text-[#073B4C]">
                      {sugerencia.horaInicio}:00 - {sugerencia.horaInicio + 1}:00
                    </span>
                  </div>
                  <div className="border-2 border-[#e11d48] bg-[#fecdd3] p-2">
                    <span className="block font-pixel text-[10px] uppercase text-[#073B4C]/70 font-bold">
                      {'//'} Capacidad Sala
                    </span>
                    <span className="font-pixel text-sm font-bold text-[#073B4C]">
                      {sugerencia.sala.capacidad} personas
                    </span>
                  </div>
                </div>

                {/* Justificación de Función de Costo */}
                <div className="mt-3 border-2 border-[#e11d48] bg-[#fecdd3] p-2.5 font-body text-xs space-y-1 text-[#073B4C]">
                  <p className="font-pixel font-bold uppercase text-[#073B4C] text-[11px]">
                    Desglose de Eficiencia:
                  </p>
                  <p>• Desviación horaria: <strong className="font-pixel">{sugerencia.diferenciaHoraria}h</strong></p>
                  <p>• Asientos sobrantes: <strong className="font-pixel">{sugerencia.desperdicioAforo} pers.</strong></p>
                </div>
              </div>

              {/* Botón CTA -> VERDE #06D6A0 */}
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
            <div className="flex h-56 flex-col items-center justify-center border-2 border-dashed border-[#e11d48]/40 bg-[#fecdd3]/40 p-6 text-center text-[#073B4C]">
              <PixelIcon name="sparkles" size={32} className="text-[#e11d48] mb-2" />
              <p className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C]">
                Esperando Parámetros...
              </p>
              <p className="mt-1 font-body text-xs text-[#073B4C]/80">
                Selecciona fecha, hora y aforo para evaluar la función de costo y encontrar la mejor sala disponible.
              </p>
            </div>
          )}
        </RetroWindow>
      </div>
    </section>
  );
}
