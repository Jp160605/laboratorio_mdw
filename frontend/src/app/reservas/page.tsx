'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CalendarioGrid from '@/components/CalendarioGrid';
import SugerirSala from '@/components/SugerirSala';
import ModalReserva from '@/components/ModalReserva';
import PixelBadge from '@/components/PixelBadge';
import PixelButton from '@/components/PixelButton';
import PixelIcon from '@/components/PixelIcon';
import { useReservas } from '@/context/ReservasContext';
import { Sala } from '@/types';

export default function ReservasPage() {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyStr);
  const [modalReservaAbierto, setModalReservaAbierto] = useState<boolean>(false);
  const [modalErrorVisible, setModalErrorVisible] = useState<boolean>(false);
  const [errorModalTexto, setErrorModalTexto] = useState<string>('');
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<{ sala: Sala; hora: number } | null>(null);

  const {
    salas,
    reservas,
    usuarioActual,
    confirmarReserva,
    cargarDisponibilidad,
    origenDisponibilidad,
  } = useReservas();

  // Refrescar disponibilidad en PostgreSQL / Redis al cambiar de fecha
  useEffect(() => {
    cargarDisponibilidad(fechaSeleccionada);
  }, [fechaSeleccionada, cargarDisponibilidad]);

  const handleSeleccionarBloque = (sala: Sala, horaInicio: number) => {
    // Validación preventiva en cliente para fecha y hora
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const fechaHoyLocal = `${año}-${mes}-${dia}`;
    const horaActual = ahora.getHours();

    const fechaStr = fechaSeleccionada.includes('T') ? fechaSeleccionada.split('T')[0] : fechaSeleccionada;
    if (fechaStr < fechaHoyLocal || (fechaStr === fechaHoyLocal && horaInicio + 1 <= horaActual)) {
      setErrorModalTexto(
        `El bloque horario de ${horaInicio}:00 a ${horaInicio + 1}:00 ya ha concluido. Para garantizar la consistencia, el sistema no permite reservar horarios en el pasado.`
      );
      setModalErrorVisible(true);
      return;
    }

    setBloqueSeleccionado({ sala, hora: horaInicio });
    setModalReservaAbierto(true);
  };

  const handleConfirmar = async (sala: Sala, fecha: string, horaInicio: number, version: number) => {
    const res = await confirmarReserva(sala, fecha, horaInicio, version);
    if (!res.exito) {
      throw new Error(res.error || 'La transacción no pudo completarse en la base de datos.');
    }
    setModalReservaAbierto(false);
  };

  return (
    <div className="min-h-screen text-neo-dark flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl p-3 sm:p-6 lg:p-8 space-y-6 min-w-0 overflow-hidden box-border">
        {/* Cabecera Personalizada */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#FFFAEB]">
          <div>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-white">
              Bienvenido(a), <span className="bg-[#FFD166] text-[#073B4C] px-2 border-2 border-[#dd6902]">{usuarioActual ? usuarioActual.nombre : 'Invitado'}</span>
            </h1>
            <p className="mt-1 font-body text-xs text-[#FFFAEB]/85">
              Explora las salas por horario, revisa la versión de cada espacio y agenda bloques con control de concurrencia optimista.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PixelBadge variant="green" size="md" withDot>
              ACID READY
            </PixelBadge>
            {origenDisponibilidad && (
              <PixelBadge variant={origenDisponibilidad === 'REDIS_CACHE' ? 'green' : 'yellow'} size="md">
                {origenDisponibilidad === 'REDIS_CACHE' ? '⚡ CACHE: REDIS' : '🐘 DB: POSTGRES'}
              </PixelBadge>
            )}
            <PixelBadge variant="yellow" size="md">
              v.{salas.reduce((acc, s) => acc + s.version, 0)} TOTAL_LOCKS
            </PixelBadge>
          </div>
        </div>

        {/* Recomendador Inteligente */}
        <SugerirSala
          fechaActual={fechaSeleccionada}
          salas={salas}
          onReservarSugerencia={(sala, hora) => {
            handleSeleccionarBloque(sala, hora);
          }}
        />

        {/* Matriz Completa de Disponibilidad (Grilla Horaria) */}
        <CalendarioGrid
          fechaSeleccionada={fechaSeleccionada}
          onCambiarFecha={setFechaSeleccionada}
          salas={salas}
          reservas={reservas}
          usuarioActual={usuarioActual}
          onSeleccionarBloque={handleSeleccionarBloque}
        />
      </main>

      {/* Modal de Confirmación de Reserva */}
      <ModalReserva
        abierto={modalReservaAbierto}
        onCerrar={() => setModalReservaAbierto(false)}
        sala={bloqueSeleccionado?.sala || null}
        fecha={fechaSeleccionada}
        horaInicio={bloqueSeleccionado?.hora || 8}
        usuarioActual={usuarioActual}
        onConfirmar={handleConfirmar}
      />

      {/* Modal Retro de Error Temporal / Restricción (Tema Neobrutalista Rojo) */}
      {modalErrorVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-none">
          <div className="w-full max-w-md border-4 border-[#e11d48] bg-[#ffdf88] overflow-hidden text-[#073B4C] shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b-[3px] border-[#e11d48] bg-[#fb7185] px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#e11d48] border border-[#073B4C]" />
                <span className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C]">
                  ACCESO_DENEGADO.SYS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalErrorVisible(false)}
                className="flex h-4 w-4 items-center justify-center border-2 border-[#e11d48] bg-[#e11d48] text-white font-pixel font-bold text-[10px] leading-none hover:brightness-110"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3 font-body text-xs text-[#073B4C]">
              <div className="flex items-center gap-2 font-pixel text-sm font-bold text-[#e11d48]">
                <PixelIcon name="alert" size={18} color="#e11d48" />
                <span>HORARIO NO DISPONIBLE</span>
              </div>
              <p className="font-bold border-2 border-[#e11d48]/40 bg-[#fecdd3] p-3 text-[#073B4C] leading-relaxed">
                {errorModalTexto}
              </p>
              <p className="text-[11px] text-[#073B4C]/80">
                La solicitud no fue enviada a PostgreSQL. El sistema solo acepta reservas para bloques en curso o futuros.
              </p>
            </div>
            <div className="flex justify-end border-t-[3px] border-[#e11d48] bg-[#ffb220]/25 p-3">
              <PixelButton
                variant="danger"
                size="sm"
                onClick={() => setModalErrorVisible(false)}
              >
                Entendido [Cerrar]
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
