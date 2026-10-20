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
        headerColor="pink"
      >
        <div className="p-8 text-center">
          <PixelIcon name="lock" size={36} className="text-neo-pink mb-2" />
          <h3 className="font-pixel text-base font-bold uppercase text-neo-dark">
            Debes iniciar sesión
          </h3>
          <p className="mt-1 font-body text-xs text-neo-dark/70">
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
    <section className="space-y-4">
      {/* Encabezado Neobrutalista */}
      <RetroWindow
        title="HISTORIAL_RESERVAS.LOG"
        badge="RF-07"
        headerColor="yellow"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-pixel text-base font-bold uppercase tracking-wide text-neo-dark">
              Tus Movimientos // Reservas
            </h2>
            <p className="font-body text-xs text-neo-dark/80">
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
        <div className="bg-transparent p-12 text-center">
          <PixelIcon name="calendar" size={36} className="text-neo-blue mb-2" />
          <p className="font-pixel text-sm font-bold uppercase text-neo-dark">
            Sin Reservas Registradas
          </p>
          <p className="mt-1 font-body text-xs text-neo-dark/70">
            No tienes reservas activas con el usuario {usuarioActual.nombre}. Haz clic en el Calendario para agendar una.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {misReservas.map((reserva) => {
            const cancelacion = esCancelable(reserva);
            const esActiva = reserva.estado === 'CONFIRMADA';

            return (
              <div
                key={reserva.id}
                className={`bg-transparent p-4 border-0 transition-all ${
                  esActiva ? '' : 'opacity-85'
                }`}
              >
                {/* Cabecera del Ticket */}
                <div className="flex items-center justify-between border-b-2 border-neo-dark pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs font-bold text-neo-dark">
                      #{reserva.id}
                    </span>
                    <PixelBadge
                      variant={esActiva ? 'green' : 'dark'}
                      size="sm"
                      withDot={esActiva}
                    >
                      {reserva.estado}
                    </PixelBadge>
                  </div>
                  <span className="border border-neo-dark bg-transparent px-1.5 py-0.5 font-pixel text-[10px] font-bold text-neo-dark">
                    v_sala: {reserva.version_sala_aplicada}
                  </span>
                </div>

                {/* Detalles de la Reserva */}
                <div className="my-3 space-y-1">
                  <h4 className="font-pixel text-base font-bold uppercase text-neo-dark">
                    {reserva.sala_nombre || `Espacio #${reserva.sala_id}`}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 font-body text-xs text-neo-dark/80">
                    <span className="flex items-center gap-1 font-pixel font-bold">
                      <PixelIcon name="calendar" size={13} className="text-neo-blue" />
                      {reserva.fecha}
                    </span>
                    <span>{'//'}</span>
                    <span className="flex items-center gap-1 font-pixel font-bold">
                      <PixelIcon name="clock" size={13} className="text-neo-pink" />
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
                </div>

                {/* Acciones */}
                {esActiva && (
                  <div className="border-t-2 border-neo-dark/20 pt-3">
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
                      <p className="mt-1.5 flex items-center justify-center gap-1 font-body text-[11px] text-neo-pink font-semibold">
                        <PixelIcon name="alert" size={12} color="#EF476F" />
                        {cancelacion.motivo}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
