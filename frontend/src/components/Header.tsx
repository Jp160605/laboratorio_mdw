'use client';

import React from 'react';
import { Usuario } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';

interface HeaderProps {
  usuarioActual: Usuario | null;
  onCambiarUsuario: (usuario: Usuario) => void;
  onAbrirAuth: () => void;
  wsConectado: boolean;
}

export default function Header({
  usuarioActual,
  onCambiarUsuario,
  onAbrirAuth,
  wsConectado,
}: HeaderProps) {
  // Usuarios simulados para pruebas de concurrencia
  const usuarioA: Usuario = {
    id: 1,
    nombre: 'Juan Pérez (Alumno A)',
    email: 'alumnoA@universidad.edu',
  };
  const usuarioB: Usuario = {
    id: 2,
    nombre: 'María López (Alumno B)',
    email: 'alumnoB@universidad.edu',
  };

  return (
    <header className="border-b-2 border-neo-dark bg-[#FFFAEB] px-4 py-3.5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Identidad del Sistema y Marca Neobrutalista */}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Logo Marca */}
            <div className="flex items-center gap-2 border-2 border-neo-dark bg-neo-yellow px-3 py-1">
              <PixelIcon name="monitor" size={18} className="text-neo-dark" />
              <span className="font-pixel text-base font-bold tracking-wider text-neo-dark">
                LabReserva
              </span>
            </div>

            <PixelBadge variant="pink" size="sm">
              v1.0 ACID
            </PixelBadge>

            {/* Estado WebSocket */}
            <div className="flex items-center gap-2 border-2 border-neo-dark px-2.5 py-1 text-xs font-pixel">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full border border-neo-dark ${
                  wsConectado ? 'bg-neo-green animate-pulse' : 'bg-neo-pink'
                }`}
              />
              <span className="text-neo-dark font-bold">
                WS: {wsConectado ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <p className="font-body text-xs text-neo-dark/80">
            Control de Concurrencia Optimista (columna <code className="bg-neo-yellow px-1 py-0.5 border border-neo-dark font-pixel font-bold">version</code>) {'//'} Transacciones puras sin ORM
          </p>
        </div>

        {/* Panel de Sesión y Selector de Usuario */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Alternador Rápido de Usuarios para Demostración */}
          <div className="flex items-center gap-1.5 border-2 border-neo-dark p-1.5">
            <span className="px-2 font-pixel text-xs font-bold uppercase text-neo-dark">
              Simular:
            </span>
            <button
              type="button"
              onClick={() => onCambiarUsuario(usuarioA)}
              className={`px-2.5 py-1 font-pixel text-xs font-bold transition-all ${
                usuarioActual?.id === usuarioA.id
                  ? 'bg-neo-blue text-white border-2 border-neo-dark'
                  : 'bg-transparent text-neo-dark hover:bg-neo-yellow'
              }`}
            >
              Usuario A
            </button>
            <button
              type="button"
              onClick={() => onCambiarUsuario(usuarioB)}
              className={`px-2.5 py-1 font-pixel text-xs font-bold transition-all ${
                usuarioActual?.id === usuarioB.id
                  ? 'bg-neo-blue text-white border-2 border-neo-dark'
                  : 'bg-transparent text-neo-dark hover:bg-neo-yellow'
              }`}
            >
              Usuario B
            </button>
          </div>

          {/* Estado de Usuario Activo o Botón Login */}
          {usuarioActual ? (
            <div className="flex items-center gap-2 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center border-2 border-neo-dark bg-neo-green">
                <PixelIcon name="user" size={16} className="text-neo-dark" />
              </div>
              <div>
                <p className="font-pixel text-xs font-bold text-neo-dark leading-tight">
                  {usuarioActual.nombre}
                </p>
                <p className="font-body text-[11px] text-neo-dark/70">
                  {usuarioActual.email}
                </p>
              </div>
            </div>
          ) : (
            <PixelButton
              variant="warning"
              size="sm"
              onClick={onAbrirAuth}
              icon={<PixelIcon name="lock" size={14} />}
            >
              Iniciar Sesión
            </PixelButton>
          )}
        </div>
      </div>
    </header>
  );
}
