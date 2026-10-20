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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-dark/70 p-4 backdrop-blur-none">
      <div className="w-full max-w-sm border-3 border-neo-dark bg-[#FFFAEB] animate-in fade-in zoom-in-95 duration-100">
        {/* Cabecera de la Ventana */}
        <div className="flex items-center justify-between border-b-3 border-neo-dark bg-neo-blue px-4 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-neo-dark bg-white"></span>
            <span className="inline-block h-3 w-3 rounded-full border-2 border-neo-dark bg-neo-dark"></span>
            <span className="font-pixel text-xs font-bold uppercase tracking-wider">
              AUTH_SYSTEM.EXE
            </span>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="flex h-6 w-6 items-center justify-center border-2 border-neo-dark bg-neo-pink text-white font-pixel font-bold hover:bg-[#d8355c]"
          >
            ×
          </button>
        </div>

        {/* Pestañas Neobrutalistas */}
        <div className="flex border-b-3 border-neo-dark">
          <button
            type="button"
            onClick={() => setModo('login')}
            className={`flex-1 py-2 text-center font-pixel text-xs font-bold uppercase transition-all ${
              modo === 'login'
                ? 'bg-neo-blue text-white'
                : 'text-neo-dark/70 hover:bg-neo-yellow/50'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setModo('registro')}
            className={`flex-1 py-2 text-center font-pixel text-xs font-bold uppercase transition-all ${
              modo === 'registro'
                ? 'bg-neo-blue text-white'
                : 'text-neo-dark/70 hover:bg-neo-yellow/50'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {modo === 'registro' && (
            <div>
              <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                {'//'} Nombre Completo
              </label>
              <div className="mt-1 flex items-center border-2 border-neo-dark bg-transparent px-2.5 py-1.5 focus-within:bg-neo-yellow/20">
                <PixelIcon name="user" size={16} className="text-neo-dark mr-2" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full font-body text-xs text-neo-dark outline-none bg-transparent"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
              {'//'} Correo Institucional
            </label>
            <div className="mt-1 flex items-center border-2 border-neo-dark bg-transparent px-2.5 py-1.5 focus-within:bg-neo-yellow/20">
              <span className="font-pixel text-xs font-bold text-neo-dark mr-2">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-body text-xs text-neo-dark outline-none bg-transparent"
                placeholder="usuario@universidad.edu"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
              {'//'} Contraseña
            </label>
            <div className="mt-1 flex items-center border-2 border-neo-dark bg-transparent px-2.5 py-1.5 focus-within:bg-neo-yellow/20">
              <PixelIcon name="lock" size={16} className="text-neo-dark mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-body text-xs text-neo-dark outline-none bg-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="p-2 text-[10px] font-body text-neo-dark/80">
            * Hash en backend mediante <strong>bcrypt</strong> y generación de token de sesión firmado con <strong>JWT</strong>.
          </div>

          <PixelButton
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            icon={<PixelIcon name="arrow-tr" size={14} color="#FFFFFF" />}
          >
            {modo === 'login' ? 'Entrar al Sistema' : 'Confirmar Registro'}
          </PixelButton>
        </form>
      </div>
    </div>
  );
}
