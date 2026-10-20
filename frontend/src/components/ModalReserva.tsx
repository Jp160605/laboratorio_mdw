'use client';

import React from 'react';
import { Sala, Usuario } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';

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

  const horaFin = horaInicio + 1;
  const etiquetaHora = `${horaInicio < 10 ? '0' : ''}${horaInicio}:00 - ${
    horaFin < 10 ? '0' : ''
  }${horaFin}:00`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-dark/70 p-4 backdrop-blur-none">
      <div className="w-full max-w-md border-3 border-neo-dark bg-[#FFFAEB] animate-in fade-in zoom-in-95 duration-100">
        {/* Cabecera estilo ventana clásica de sistema */}
        <div className="flex items-center justify-between border-b-3 border-neo-dark bg-neo-yellow px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-neo-dark bg-white"></span>
            <span className="inline-block h-3 w-3 rounded-full border-2 border-neo-dark bg-neo-dark"></span>
            <h3 className="font-pixel text-xs font-bold uppercase tracking-wider text-neo-dark">
              CONFIRMAR_SELECCION.SYS
            </h3>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="flex h-6 w-6 items-center justify-center border-2 border-neo-dark bg-neo-pink text-white font-pixel font-bold hover:bg-[#d8355c]"
          >
            ×
          </button>
        </div>

        {/* Cuerpo del Diálogo */}
        <div className="space-y-4 p-5">
          <p className="font-body text-xs text-neo-dark/80">
            Revisa los detalles técnicos antes de confirmar la reserva en la base de datos:
          </p>

          <div className="border-2 border-neo-dark bg-transparent p-4 font-body text-xs space-y-2.5">
            <div className="flex justify-between items-center border-b border-neo-dark/20 pb-2">
              <span className="font-pixel text-[11px] font-bold text-neo-dark/70 uppercase">
                {'//'} Espacio:
              </span>
              <span className="font-pixel text-sm font-bold text-neo-dark">
                {sala.nombre}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-neo-dark/70 uppercase">
                {'//'} Ubicación:
              </span>
              <span className="font-semibold text-neo-dark">
                {sala.ubicacion} (Aforo {sala.capacidad} pers.)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-neo-dark/70 uppercase">
                {'//'} Fecha:
              </span>
              <span className="font-pixel font-bold text-neo-blue">
                {fecha}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-neo-dark/70 uppercase">
                {'//'} Horario Bloque:
              </span>
              <span className="font-pixel font-bold text-neo-pink">
                {etiquetaHora}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-neo-dark/20 pt-2">
              <span className="font-pixel text-[11px] font-bold text-neo-dark uppercase">
                {'//'} Versión Enviada:
              </span>
              <PixelBadge variant="yellow" size="sm">
                v.{sala.version}
              </PixelBadge>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-pixel text-[11px] font-bold text-neo-dark uppercase">
                {'//'} Solicitante:
              </span>
              <span className="font-pixel text-xs font-bold text-neo-dark">
                {usuarioActual ? usuarioActual.nombre : 'No autenticado'}
              </span>
            </div>
          </div>

          <div className="border-2 border-neo-dark bg-neo-blue/15 p-3 text-[11px] font-body text-neo-dark">
            <strong className="font-pixel text-xs uppercase block text-neo-blue">
              Transacción ACID en Proceso:
            </strong>
            Al confirmar, el servidor valida <code className="font-pixel font-bold bg-neo-yellow/30 px-1 border border-neo-dark">version = {sala.version}</code>. Si nadie ha reservado en el mismo instante, la sala incrementa a <code className="font-pixel font-bold bg-neo-yellow/30 px-1 border border-neo-dark">version = {sala.version + 1}</code>.
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 border-t-3 border-neo-dark bg-transparent px-5 py-3">
          <PixelButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCerrar}
          >
            Cancelar
          </PixelButton>
          <PixelButton
            type="button"
            variant="success"
            size="md"
            onClick={() => onConfirmar(sala, fecha, horaInicio, sala.version)}
            icon={<PixelIcon name="check" size={16} />}
          >
            Confirmar Reserva
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
