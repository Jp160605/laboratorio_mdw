'use client';

import React from 'react';
import { Usuario } from '@/types';
import { Radio, User, LogIn } from 'lucide-react';

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
  const usuarioA: Usuario = { id: 1, nombre: 'Juan Pérez (Alumno A)', email: 'alumnoA@universidad.edu' };
  const usuarioB: Usuario = { id: 2, nombre: 'María López (Alumno B)', email: 'alumnoB@universidad.edu' };

  return (
    <header className="border-b border-gray-300 bg-gray-50 px-6 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Identidad del Sistema */}
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              MVP Académico
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <Radio
                className={`h-3.5 w-3.5 ${
                  wsConectado ? 'text-green-600 animate-pulse' : 'text-red-500'
                }`}
              />
              WebSockets: {wsConectado ? 'Conectado (Tiempo Real)' : 'Desconectado'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Sistema de Reservas - Salas y Laboratorios
          </h1>
          <p className="text-xs text-gray-500">
            Control de Concurrencia Optimista (version) • Transacciones ACID • BullMQ + Redis
          </p>
        </div>

        {/* Panel de Sesión y Selector Rápido para Demostraciones */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Herramienta de Demostración: Alternador Rápido de Usuarios */}
          <div className="flex items-center gap-1 rounded border border-gray-300 bg-white p-1 text-xs">
            <span className="px-2 text-gray-500 font-medium">Simular como:</span>
            <button
              type="button"
              onClick={() => onCambiarUsuario(usuarioA)}
              className={`rounded px-2 py-1 font-semibold transition ${
                usuarioActual?.id === usuarioA.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Usuario A
            </button>
            <button
              type="button"
              onClick={() => onCambiarUsuario(usuarioB)}
              className={`rounded px-2 py-1 font-semibold transition ${
                usuarioActual?.id === usuarioB.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Usuario B
            </button>
          </div>

          {/* Información del Usuario Activo */}
          {usuarioActual ? (
            <div className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-semibold text-gray-800 leading-none">{usuarioActual.nombre}</p>
                <p className="text-gray-500 text-[11px]">{usuarioActual.email}</p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAbrirAuth}
              className="flex items-center gap-1.5 rounded border border-gray-400 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              <LogIn className="h-4 w-4" />
              Iniciar Sesión / Registro (JWT)
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
