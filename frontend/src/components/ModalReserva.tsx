'use client';

import React from 'react';
import { Sala, Usuario } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';

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

  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const fechaHoyLocal = `${año}-${mes}-${dia}`;
  const horaActual = ahora.getHours();

  // Validación: si la fecha es pasada, o si es hoy y el bloque ya terminó (horaInicio + 1 <= horaActual)
  const fechaStr = fecha.includes('T') ? fecha.split('T')[0] : fecha;
  const esPasado = fechaStr < fechaHoyLocal || (fechaStr === fechaHoyLocal && horaInicio + 1 <= horaActual);

  const horaFin = horaInicio + 1;
  const etiquetaHora = `${horaInicio < 10 ? '0' : ''}${horaInicio}:00 - ${
    horaFin < 10 ? '0' : ''
  }${horaFin}:00`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-none">
      {/* Ventana Flotante Estilo Retro OS (Paleta Amarilla 200/400/600) */}
      <div className="w-full max-w-md border-4 border-[#dd6902] bg-[#ffdf88] overflow-hidden text-[#073B4C] shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        {/* Cabecera de la Ventana en #ffb220 con borde #dd6902 */}
        <div className="flex items-center justify-between border-b-[3px] border-[#dd6902] bg-[#ffb220] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-block h-3 w-3 rounded-full bg-[#EF476F] border border-[#dd6902]" />
              <span className="inline-block h-3 w-3 rounded-full bg-[#FFD166] border border-[#dd6902]" />
              <span className="inline-block h-3 w-3 rounded-full bg-[#118AB2] border border-[#dd6902]" />
            </div>
            <h3 className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C] ml-1.5">
              CONFIRMAR_SELECCION.SYS
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-4 h-4 flex items-center justify-center border-2 border-[#dd6902] bg-[#ffdf88] text-[#073B4C] text-[10px] leading-none select-none">
              _
            </span>
            <span className="w-4 h-4 flex items-center justify-center border-2 border-[#dd6902] bg-[#ffdf88] text-[#073B4C] text-[9px] leading-none select-none">
              □
            </span>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar modal"
              className="flex h-4 w-4 items-center justify-center border-2 border-[#dd6902] bg-[#EF476F] text-white font-pixel font-bold text-[10px] leading-none hover:brightness-110 active:scale-95 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cuerpo del Diálogo */}
        <div className="space-y-4 p-5 text-[#073B4C]">
          <p className="font-body text-xs text-[#073B4C]/85">
            Revisa los detalles técnicos antes de confirmar la reserva en la base de datos:
          </p>

          <div className="border-2 border-[#dd6902] bg-[#ffb220]/25 p-4 font-body text-xs space-y-2.5 text-[#073B4C]">
            <div className="flex justify-between items-center border-b border-[#dd6902]/30 pb-2">
              <span className="font-pixel text-[11px] font-bold text-[#073B4C]/80 uppercase">
                {'//'} Espacio:
              </span>
              <span className="font-pixel text-sm font-bold text-[#073B4C]">
                {sala.nombre}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-[#073B4C]/80 uppercase">
                {'//'} Ubicación:
              </span>
              <span className="font-semibold text-[#073B4C]">
                {sala.ubicacion} (Aforo {sala.capacidad} pers.)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-[#073B4C]/80 uppercase">
                {'//'} Fecha:
              </span>
              <span className="font-pixel font-bold text-[#118AB2]">
                {fecha}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-[#073B4C]/80 uppercase">
                {'//'} Horario Bloque:
              </span>
              <span className="font-pixel text-xs font-bold text-[#073B4C]">
                {etiquetaHora}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-[#073B4C]/80 uppercase">
                {'//'} Versión Enviada:
              </span>
              <span className="border-2 border-[#dd6902] bg-[#ffb220] px-2 py-0.5 font-pixel text-xs font-bold text-[#073B4C]">
                v.{sala.version}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-[#073B4C] uppercase">
                {'//'} Solicitante:
              </span>
              <span className="font-pixel text-xs font-bold text-[#073B4C]">
                {usuarioActual ? usuarioActual.nombre : 'No autenticado'}
              </span>
            </div>
          </div>

          {/* Alerta si el bloque ya concluyó */}
          {esPasado ? (
            <div className="border-2 border-[#e11d48] bg-[#fecdd3] p-3 text-[11px] font-body text-[#073B4C]">
              <strong className="font-pixel text-xs uppercase block text-[#e11d48] mb-0.5">
                ⚠️ HORARIO CONCLUIDO / NO DISPONIBLE:
              </strong>
              Este bloque horario ya ha transcurrido. No es posible crear reservas en el pasado.
            </div>
          ) : (
            <div className="border-2 border-[#dd6902] bg-[#ffb220]/40 p-3 text-[11px] font-body text-[#073B4C]">
              <strong className="font-pixel text-xs uppercase block text-[#073B4C] mb-0.5">
                Transacción ACID en Proceso:
              </strong>
              Al confirmar, el servidor valida <code className="font-pixel font-bold bg-[#ffdf88] px-1 border border-[#dd6902]">version = {sala.version}</code>. Si nadie ha reservado en el mismo instante, la sala incrementa a <code className="font-pixel font-bold bg-[#ffdf88] px-1 border border-[#dd6902]">version = {sala.version + 1}</code>.
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 border-t-[3px] border-[#dd6902] bg-[#ffb220]/25 px-5 py-3">
          <button
            type="button"
            onClick={onCerrar}
            className="border-2 border-[#dd6902] bg-transparent px-3 py-1.5 font-pixel text-xs font-bold uppercase text-[#073B4C] hover:bg-[#ffb220]/50 transition-colors"
          >
            Cancelar
          </button>
          {!esPasado && (
            <PixelButton
              type="button"
              variant="success"
              size="md"
              onClick={() => onConfirmar(sala, fecha, horaInicio, sala.version)}
              icon={<PixelIcon name="check" size={16} />}
            >
              Confirmar Reserva
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
