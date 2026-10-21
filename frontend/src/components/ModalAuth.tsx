'use client';

import React, { useState } from 'react';
import { Usuario } from '@/types';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';

interface ModalAuthProps {
  abierto: boolean;
  onCerrar: () => void;
  onLoginExitoso: (usuario: Usuario) => void;
}

export default function ModalAuth({
  abierto,
  onCerrar,
  onLoginExitoso,
}: ModalAuthProps) {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState<string>('alumnoA@universidad.edu');
  const [password, setPassword] = useState<string>('password123');
  const [nombre, setNombre] = useState<string>('Juan Pérez');

  if (!abierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioMock: Usuario = {
      id: 1,
      nombre: modo === 'registro' ? nombre : 'Juan Pérez',
      email,
    };
    onLoginExitoso(usuarioMock);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-none">
      {/* Ventana Flotante Estilo Retro OS (Paleta Azul 200/400/600) */}
      <div className="w-full max-w-sm border-4 border-[#0284c7] bg-[#bae6fd] overflow-hidden text-[#073B4C] shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        {/* Cabecera de la Ventana en #38bdf8 con Borde #0284c7 */}
        <div className="flex items-center justify-between border-b-[3px] border-[#0284c7] bg-[#38bdf8] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            {/* Tres Círculos de Color Estilo Mac */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-block h-3 w-3 rounded-full bg-[#EF476F] border border-[#0284c7]" />
              <span className="inline-block h-3 w-3 rounded-full bg-[#FFD166] border border-[#0284c7]" />
              <span className="inline-block h-3 w-3 rounded-full bg-[#118AB2] border border-[#0284c7]" />
            </div>
            <span className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C] ml-1.5">
              AUTH_SYSTEM.EXE
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-4 h-4 flex items-center justify-center border-2 border-[#0284c7] bg-[#bae6fd] text-[#073B4C] text-[10px] leading-none select-none">
              _
            </span>
            <span className="w-4 h-4 flex items-center justify-center border-2 border-[#0284c7] bg-[#bae6fd] text-[#073B4C] text-[9px] leading-none select-none">
              □
            </span>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar modal"
              className="flex h-4 w-4 items-center justify-center border-2 border-[#0284c7] bg-[#EF476F] text-white font-pixel font-bold text-[10px] leading-none hover:brightness-110 active:scale-95 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Pestañas Neobrutalistas */}
        <div className="flex border-b-[3px] border-[#0284c7]">
          <button
            type="button"
            onClick={() => setModo('login')}
            className={`flex-1 py-2 text-center font-pixel text-xs font-bold uppercase transition-all ${
              modo === 'login'
                ? 'bg-[#38bdf8] text-[#073B4C] border-b-2 border-[#0284c7]'
                : 'bg-[#bae6fd] text-[#073B4C]/70 hover:bg-[#38bdf8]/40'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setModo('registro')}
            className={`flex-1 py-2 text-center font-pixel text-xs font-bold uppercase transition-all ${
              modo === 'registro'
                ? 'bg-[#38bdf8] text-[#073B4C] border-b-2 border-[#0284c7]'
                : 'bg-[#bae6fd] text-[#073B4C]/70 hover:bg-[#38bdf8]/40'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5 text-[#073B4C]">
          {modo === 'registro' && (
            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
                {'//'} Nombre Completo
              </label>
              <div className="mt-1 flex items-center border-2 border-[#0284c7] bg-[#e0f2fe] px-2.5 py-1.5 focus-within:bg-[#e0f2fe]">
                <PixelIcon name="user" size={16} className="text-[#073B4C] mr-2" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full font-body text-xs text-[#073B4C] outline-none bg-transparent placeholder-[#073B4C]/50 font-medium"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
              {'//'} Correo Institucional
            </label>
            <div className="mt-1 flex items-center border-2 border-[#0284c7] bg-[#e0f2fe] px-2.5 py-1.5 focus-within:bg-[#e0f2fe]">
              <span className="font-pixel text-xs font-bold text-[#073B4C] mr-2">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-body text-xs text-[#073B4C] outline-none bg-transparent placeholder-[#073B4C]/50 font-medium"
                placeholder="usuario@universidad.edu"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-pixel text-xs font-bold uppercase text-[#073B4C]">
              {'//'} Contraseña
            </label>
            <div className="mt-1 flex items-center border-2 border-[#0284c7] bg-[#e0f2fe] px-2.5 py-1.5 focus-within:bg-[#e0f2fe]">
              <PixelIcon name="lock" size={16} className="text-[#073B4C] mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-body text-xs text-[#073B4C] outline-none bg-transparent placeholder-[#073B4C]/50 font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="border border-[#0284c7]/40 bg-[#38bdf8]/20 p-2 text-[10px] font-body text-[#073B4C]">
            * Hash en backend mediante <strong>bcrypt</strong> y sesión con <strong>JWT</strong>.
          </div>

          {/* Botón CTA -> VERDE #06D6A0 */}
          <PixelButton
            type="submit"
            variant="success"
            size="md"
            className="w-full"
            icon={<PixelIcon name="arrow-tr" size={14} />}
          >
            {modo === 'login' ? 'Entrar al Sistema' : 'Confirmar Registro'}
          </PixelButton>
        </form>
      </div>
    </div>
  );
}
