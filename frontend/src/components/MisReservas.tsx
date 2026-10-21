'use client';

import React from 'react';
import { Reserva, Usuario } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';
import RetroWindow from '@/components/RetroWindow';

interface MisReservasProps {
  reservas: Reserva[];
  usuarioActual: Usuario | null;
  onCancelarReserva: (reservaId: number) => void;
}

export default function MisReservas({
  reservas,
  usuarioActual,
  onCancelarReserva,
}: MisReservasProps) {
  if (!usuarioActual) {
    return (
      <RetroWindow
        title="ACCESO_DENEGADO.SYS"
        badge="AUTH_ERROR"
        color="red"
      >
        <div className="p-8 text-center text-[#073B4C]">
          <PixelIcon name="lock" size={36} className="text-[#e11d48] mb-2 inline-block" />
          <h3 className="font-pixel text-base font-bold uppercase text-[#073B4C]">
            Debes iniciar sesión
          </h3>
          <p className="mt-1 font-body text-xs text-[#073B4C]/80">
            Inicia sesión o selecciona un perfil para consultar tus reservas activas e históricas.
          </p>
        </div>
      </RetroWindow>
    );
  }

  const misReservas = reservas.filter((r) => r.usuario_id === usuarioActual.id);
  const confirmadasCount = misReservas.filter((r) => r.estado === 'CONFIRMADA').length;
  const canceladasCount = misReservas.filter((r) => r.estado === 'CANCELADA').length;

  // Regla RF-05: Validar si faltan al menos 2 horas respecto a la fecha y hora de inicio
  const esCancelable = (reserva: Reserva): { puede: boolean; motivo?: string } => {
    if (reserva.estado === 'CANCELADA') {
      return { puede: false, motivo: 'La reserva ya se encuentra cancelada.' };
    }

    const fechaHoraInicio = new Date(
      `${reserva.fecha}T${reserva.hora_inicio < 10 ? '0' : ''}${reserva.hora_inicio}:00:00`
    );
    const ahora = new Date();
    const diferenciaMs = fechaHoraInicio.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    if (diferenciaHoras < 2) {
      return {
        puede: false,
        motivo: 'RF-05: Requiere mínimo 2 horas de anticipación.',
      };
    }

    return { puede: true };
  };

  return (
    <section className="space-y-4 text-[#073B4C]">
      {/* Encabezado Neobrutalista en Ventana Amarilla */}
      <RetroWindow
        title="HISTORIAL_RESERVAS.LOG"
        badge="RF-07"
        color="yellow"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[#073B4C]">
          <div>
            <h2 className="font-pixel text-base font-bold uppercase tracking-wide text-[#073B4C]">
              Tus Movimientos // Reservas
            </h2>
            <p className="font-body text-xs text-[#073B4C]/85">
              {confirmadasCount} confirmada(s) activa(s) · {canceladasCount} cancelada(s)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PixelBadge variant="green" withDot>
              {confirmadasCount} ACTIVAS
            </PixelBadge>
          </div>
        </div>
      </RetroWindow>

      {misReservas.length === 0 ? (
        <div className="border-4 border-[#0284c7] bg-[#bae6fd] p-12 text-center text-[#073B4C]">
          <PixelIcon name="calendar" size={36} className="text-[#0284c7] mb-2 inline-block" />
          <p className="font-pixel text-sm font-bold uppercase text-[#073B4C]">
            Sin Reservas Registradas
          </p>
          <p className="mt-1 font-body text-xs text-[#073B4C]/80">
            No tienes reservas activas con el usuario {usuarioActual.nombre}. Haz clic en el Calendario para agendar una.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {misReservas.map((reserva) => {
            const cancelacion = esCancelable(reserva);
            const esActiva = reserva.estado === 'CONFIRMADA';

            // Tema de la tarjeta: Azul para reservas activas, Rojo para canceladas
            const theme = esActiva
              ? {
                  wrapper: 'border-4 border-[#0284c7] bg-[#bae6fd]',
                  header: 'bg-[#38bdf8] border-b-[3px] border-[#0284c7]',
                  dotBorder: 'border-[#0284c7]',
                  badge: 'border border-[#0284c7] bg-[#bae6fd] text-[#073B4C]',
                  detailBox: 'border-2 border-[#0284c7] bg-[#38bdf8]/30',
                }
              : {
                  wrapper: 'border-4 border-[#e11d48] bg-[#fecdd3] opacity-85',
                  header: 'bg-[#fb7185] border-b-[3px] border-[#e11d48]',
                  dotBorder: 'border-[#e11d48]',
                  badge: 'border border-[#e11d48] bg-[#fecdd3] text-[#073B4C]',
                  detailBox: 'border-2 border-[#e11d48] bg-[#fb7185]/30',
                };

            return (
              <div
                key={reserva.id}
                className={`overflow-hidden text-[#073B4C] transition-all w-full min-w-0 box-border ${theme.wrapper}`}
              >
                {/* Cabecera estilo retro OS */}
                <div
                  className={`px-3.5 py-2 flex items-center justify-between ${theme.header}`}
                >
                  <div className="flex items-center gap-2">
                    {/* Tres Círculos Mac */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full bg-[#EF476F] border ${theme.dotBorder}`} />
                      <span className={`inline-block w-2.5 h-2.5 rounded-full bg-[#FFD166] border ${theme.dotBorder}`} />
                      <span className={`inline-block w-2.5 h-2.5 rounded-full bg-[#118AB2] border ${theme.dotBorder}`} />
                    </div>
                    <span className="font-pixel text-xs font-bold text-[#073B4C] ml-1">
                      #{reserva.id}
                    </span>
                    <PixelBadge
                      variant={esActiva ? 'green' : 'pink'}
                      size="sm"
                      withDot={esActiva}
                    >
                      {reserva.estado}
                    </PixelBadge>
                  </div>
                  <span className={`px-1.5 py-0.5 font-pixel text-[10px] font-bold ${theme.badge}`}>
                    v_sala: {reserva.version_sala_aplicada}
                  </span>
                </div>

                {/* Detalles de la Reserva */}
                <div className="p-4 space-y-3 text-[#073B4C]">
                  <div>
                    <h4 className="font-pixel text-base font-bold uppercase text-[#073B4C]">
                      {reserva.sala_nombre || `Espacio #${reserva.sala_id}`}
                    </h4>
                  </div>

                  <div className={`p-2.5 flex flex-wrap items-center gap-3 font-body text-xs text-[#073B4C] ${theme.detailBox}`}>
                    <span className="flex items-center gap-1 font-pixel font-bold">
                      <PixelIcon name="calendar" size={13} className="text-[#0284c7]" />
                      {reserva.fecha}
                    </span>
                    <span>{'//'}</span>
                    <span className="flex items-center gap-1 font-pixel font-bold">
                      <PixelIcon name="clock" size={13} className="text-[#e11d48]" />
                      {reserva.hora_inicio < 10
                        ? `0${reserva.hora_inicio}`
                        : reserva.hora_inicio}
                      :00 -{' '}
                      {reserva.hora_fin < 10
                        ? `0${reserva.hora_fin}`
                        : reserva.hora_fin}
                      :00
                    </span>
                  </div>

                  {/* Acciones */}
                  {esActiva && (
                    <div className="border-t-2 border-[#0284c7]/30 pt-3">
                      <PixelButton
                        type="button"
                        variant="danger"
                        size="sm"
                        disabled={!cancelacion.puede}
                        onClick={() => onCancelarReserva(reserva.id)}
                        icon={<PixelIcon name="trash" size={12} color="#FFFFFF" />}
                        className="w-full"
                      >
                        Cancelar Reserva (RF-05)
                      </PixelButton>

                      {!cancelacion.puede && (
                        <p className="mt-1.5 flex items-center justify-center gap-1 font-body text-[11px] text-[#e11d48] font-bold">
                          <PixelIcon name="alert" size={12} color="#EF476F" />
                          {cancelacion.motivo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
