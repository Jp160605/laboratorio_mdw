'use client';

import React, { useState } from 'react';
import { Sala, ResultadoConcurrencia } from '@/types';
import { Zap, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

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
      {/* Banner de Contexto Académico */}
      <div className="rounded border border-amber-300 bg-amber-50 p-4 text-amber-900">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-700" />
          <h2 className="text-base font-bold">
            Simulador de Concurrencia y Bloqueo Optimista (Demostración de Evaluación)
          </h2>
        </div>
        <p className="mt-1 text-xs text-amber-800">
          Demuestra la prevención de <em>overbooking</em> enviando dos peticiones HTTP concurrentes con <code>Promise.all</code> en el mismo milisegundo hacia el mismo espacio y bloque, ambas portando el mismo valor de <code>version</code>.
        </p>
      </div>

      {/* Controles de la Simulación */}
      <div className="rounded border border-gray-300 bg-white p-4">
        <h3 className="text-xs font-semibold uppercase text-gray-500">Parámetros del Conflicto</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Espacio / Sala</label>
            <select
              value={salaId}
              onChange={(e) => setSalaId(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-medium focus:border-black focus:outline-none"
            >
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} (Versión actual: v{s.version})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Bloque Horario</label>
            <select
              value={hora}
              onChange={(e) => setHora(Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-medium focus:border-black focus:outline-none"
            >
              {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
                <option key={h} value={h}>
                  {h < 10 ? `0${h}:00` : `${h}:00`} - {h + 1 < 10 ? `0${h + 1}:00` : `${h + 1}:00`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              disabled={ejecutando}
              onClick={handleSimular}
              className="flex w-full items-center justify-center gap-2 rounded border border-black bg-black py-2.5 text-xs font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
            >
              <Zap className={`h-4 w-4 ${ejecutando ? 'animate-spin' : ''}`} />
              <span>{ejecutando ? 'Disparando Promise.all...' : '⚡ Simular Colisión de 2 Usuarios'}</span>
            </button>
          </div>
        </div>

        <div className="mt-3 rounded bg-gray-100 p-2 text-[11px] font-mono text-gray-700">
          Query SQL ejecutada por el backend en la transacción: <br />
          <code>
            UPDATE salas SET version = version + 1 WHERE id = {salaId} AND version ={' '}
            {salaSeleccionada?.version || 1}
          </code>
        </div>
      </div>

      {/* Resultados de Ambas Peticiones Lado a Lado */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Resultado Petición A */}
        <div
          className={`rounded border p-4 transition ${
            resultadoA
              ? resultadoA.exito
                ? 'border-green-400 bg-green-50/40'
                : 'border-red-400 bg-red-50/40'
              : 'border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-bold text-xs text-gray-800 uppercase">
              Petición #1 (Usuario A)
            </h4>
            {resultadoA && (
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  resultadoA.status === 201
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                HTTP {resultadoA.status}
              </span>
            )}
          </div>

          {resultadoA ? (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                {resultadoA.exito ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-semibold text-gray-900">{resultadoA.mensaje}</span>
              </div>
              <p className="text-[11px] text-gray-600 font-mono">
                Timestamp: {resultadoA.timestamp}
              </p>
              {resultadoA.datos && (
                <pre className="rounded bg-gray-900 p-2 font-mono text-[10px] text-green-300 overflow-x-auto">
                  {JSON.stringify(resultadoA.datos, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <p className="mt-4 text-center text-xs text-gray-400">
              Esperando disparo de la simulación...
            </p>
          )}
        </div>

        {/* Resultado Petición B */}
        <div
          className={`rounded border p-4 transition ${
            resultadoB
              ? resultadoB.exito
                ? 'border-green-400 bg-green-50/40'
                : 'border-red-400 bg-red-50/40'
              : 'border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-bold text-xs text-gray-800 uppercase">
              Petición #2 (Usuario B)
            </h4>
            {resultadoB && (
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  resultadoB.status === 201
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                HTTP {resultadoB.status}
              </span>
            )}
          </div>

          {resultadoB ? (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                {resultadoB.exito ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                )}
                <span className="font-semibold text-gray-900">{resultadoB.mensaje}</span>
              </div>
              <p className="text-[11px] text-gray-600 font-mono">
                Timestamp: {resultadoB.timestamp}
              </p>
              {resultadoB.datos && (
                <pre className="rounded bg-gray-900 p-2 font-mono text-[10px] text-red-300 overflow-x-auto">
                  {JSON.stringify(resultadoB.datos, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <p className="mt-4 text-center text-xs text-gray-400">
              Esperando disparo de la simulación...
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
