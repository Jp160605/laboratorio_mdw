'use client';

import React, { useState } from 'react';
import { Sala, ResultadoConcurrencia } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';
import RetroWindow from '@/components/RetroWindow';

interface SimuladorConcurrenciaProps {
  salas: Sala[];
  onEjecutarColision: (
    salaId: number,
    hora: number,
    versionActual: number
  ) => Promise<{ resultadoA: ResultadoConcurrencia; resultadoB: ResultadoConcurrencia }>;
}

export default function SimuladorConcurrencia({
  salas,
  onEjecutarColision,
}: SimuladorConcurrenciaProps) {
  const [salaId, setSalaId] = useState<number>(salas[0]?.id || 1);
  const [hora, setHora] = useState<number>(10);
  const [ejecutando, setEjecutando] = useState<boolean>(false);
  const [resultadoA, setResultadoA] = useState<ResultadoConcurrencia | null>(null);
  const [resultadoB, setResultadoB] = useState<ResultadoConcurrencia | null>(null);

  const salaSeleccionada = salas.find((s) => s.id === salaId) || salas[0];

  const handleSimular = async () => {
    if (!salaSeleccionada) return;

    setEjecutando(true);
    setResultadoA(null);
    setResultadoB(null);

    try {
      const { resultadoA, resultadoB } = await onEjecutarColision(
        salaId,
        hora,
        salaSeleccionada.version
      );
      setResultadoA(resultadoA);
      setResultadoB(resultadoB);
    } finally {
      setEjecutando(false);
    }
  };

  return (
    <section className="space-y-4">
      {/* Banner de Contexto de Evaluación */}
      <RetroWindow
        title="BENCHMARK_CONCURRENCIA.EXE"
        badge="STRESS_TEST"
        headerColor="pink"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-pixel text-base font-bold uppercase tracking-wide text-neo-dark">
              Simulador de Carrera Crítica: 2 Peticiones Simultáneas
            </h2>
            <p className="font-body text-xs text-neo-dark/80">
              Dispara dos peticiones HTTP con <code className="bg-neo-yellow px-1 py-0.5 border border-neo-dark font-pixel font-bold">Promise.all</code> en el mismo milisegundo hacia el mismo bloque con idéntica versión.
            </p>
          </div>
          <PixelBadge variant="pink" withDot>
            ANTI-OVERBOOKING
          </PixelBadge>
        </div>
      </RetroWindow>

      {/* Panel de Control de Colisión */}
      <RetroWindow
        title="PANEL_COLISION.CFG"
        badge="SETUP"
        headerColor="cream"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
              {'//'} Espacio Objetivo
            </label>
            <select
              value={salaId}
              onChange={(e) => setSalaId(Number(e.target.value))}
              className="mt-1 w-full border-3 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow focus:outline-none"
            >
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} [v.{s.version}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
              {'//'} Bloque Horario
            </label>
            <select
              value={hora}
              onChange={(e) => setHora(Number(e.target.value))}
              className="mt-1 w-full border-3 border-neo-dark bg-transparent p-2.5 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow focus:outline-none"
            >
              {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
                <option key={h} value={h}>
                  {h < 10 ? `0${h}:00` : `${h}:00`} - {h + 1 < 10 ? `0${h + 1}:00` : `${h + 1}:00`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <PixelButton
              type="button"
              variant="danger"
              size="md"
              disabled={ejecutando}
              onClick={handleSimular}
              className="w-full"
              icon={<PixelIcon name="zap" size={16} />}
            >
              {ejecutando ? 'Ejecutando...' : '⚡ Disparar Colisión'}
            </PixelButton>
          </div>
        </div>

        {/* Snippet SQL Neobrutalista */}
        <div className="mt-4 border-2 border-neo-dark bg-neo-dark p-3 font-pixel text-xs text-neo-green">
          <span className="text-neo-yellow">{'//'} Transacción SQL de Bloqueo Optimista:</span>
          <pre className="mt-1 overflow-x-auto text-[11px] whitespace-pre-wrap">
{`BEGIN;
UPDATE salas SET version = version + 1 WHERE id = ${salaId} AND version = ${salaSeleccionada?.version || 1};
-- Si rowCount === 0 => ROLLBACK && HTTP 409 Conflict
-- Si rowCount === 1 => INSERT INTO reservas ... COMMIT && HTTP 201 Created`}
          </pre>
        </div>
      </RetroWindow>

      {/* Resultados Lado a Lado (Arcade VS Screen) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Petición A */}
        <RetroWindow
          title="HILO_01: USUARIO_A"
          badge={resultadoA ? `HTTP_${resultadoA.status}` : 'READY'}
          headerColor={
            resultadoA
              ? resultadoA.exito
                ? 'green'
                : 'pink'
              : 'blue'
          }
        >
          {resultadoA ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-neo-dark pb-2">
                <PixelBadge
                  variant={resultadoA.exito ? 'green' : 'pink'}
                  size="md"
                  withDot
                >
                  {resultadoA.exito ? '201 CREATED' : '409 CONFLICT'}
                </PixelBadge>
                <span className="font-pixel text-[10px] text-neo-dark/70 font-bold">
                  {resultadoA.timestamp}
                </span>
              </div>

              <div
                className={`border-2 border-neo-dark p-3 ${
                  resultadoA.exito
                    ? 'bg-neo-green/20 text-neo-dark'
                    : 'bg-neo-pink/20 text-neo-dark'
                }`}
              >
                <p className="font-pixel text-xs font-bold uppercase">
                  {resultadoA.mensaje}
                </p>
              </div>

              {resultadoA.datos && (
                <div className="border-2 border-neo-dark bg-neo-dark p-2.5 font-pixel text-[11px] text-neo-bg">
                  <span className="text-neo-yellow">{'//'} Payload confirmado:</span>
                  <pre className="mt-1 overflow-x-auto text-[10px] text-neo-green">
                    {JSON.stringify(resultadoA.datos, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center border-2 border-dashed border-neo-dark/30 p-6 text-center">
              <PixelIcon name="terminal" size={28} className="text-neo-blue mb-1" />
              <p className="font-pixel text-xs font-bold uppercase text-neo-dark/70">
                Petición #1 en espera
              </p>
            </div>
          )}
        </RetroWindow>

        {/* Petición B */}
        <RetroWindow
          title="HILO_02: USUARIO_B"
          badge={resultadoB ? `HTTP_${resultadoB.status}` : 'READY'}
          headerColor={
            resultadoB
              ? resultadoB.exito
                ? 'green'
                : 'pink'
              : 'yellow'
          }
        >
          {resultadoB ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-neo-dark pb-2">
                <PixelBadge
                  variant={resultadoB.exito ? 'green' : 'pink'}
                  size="md"
                  withDot
                >
                  {resultadoB.exito ? '201 CREATED' : '409 CONFLICT'}
                </PixelBadge>
                <span className="font-pixel text-[10px] text-neo-dark/70 font-bold">
                  {resultadoB.timestamp}
                </span>
              </div>

              <div
                className={`border-2 border-neo-dark p-3 ${
                  resultadoB.exito
                    ? 'bg-neo-green/20 text-neo-dark'
                    : 'bg-neo-pink/20 text-neo-dark'
                }`}
              >
                <p className="font-pixel text-xs font-bold uppercase">
                  {resultadoB.mensaje}
                </p>
              </div>

              {resultadoB.datos && (
                <div className="border-2 border-neo-dark bg-neo-dark p-2.5 font-pixel text-[11px] text-neo-bg">
                  <span className="text-neo-yellow">{'//'} Payload recibido:</span>
                  <pre className="mt-1 overflow-x-auto text-[10px] text-neo-pink">
                    {JSON.stringify(resultadoB.datos, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center border-2 border-dashed border-neo-dark/30 p-6 text-center">
              <PixelIcon name="terminal" size={28} className="text-neo-pink mb-1" />
              <p className="font-pixel text-xs font-bold uppercase text-neo-dark/70">
                Petición #2 en espera
              </p>
            </div>
          )}
        </RetroWindow>
      </div>
    </section>
  );
}
