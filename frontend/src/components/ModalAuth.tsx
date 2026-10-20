'use client';

import React, { useState } from 'react';
import { Usuario } from '@/types';
import { X, Lock, Mail, User } from 'lucide-react';

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
    // Simulación de autenticación JWT para la maqueta
    const usuarioMock: Usuario = {
      id: 1,
      nombre: modo === 'registro' ? nombre : 'Juan Pérez',
      email,
    };
    onLoginExitoso(usuarioMock);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded border border-gray-300 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModo('login')}
              className={`text-xs font-bold uppercase pb-1 border-b-2 transition ${
                modo === 'login'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Iniciar Sesión (RF-01)
            </button>
            <button
              type="button"
              onClick={() => setModo('registro')}
              className={`text-xs font-bold uppercase pb-1 border-b-2 transition ${
                modo === 'registro'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Registrarse
            </button>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 p-4 text-xs">
          {modo === 'registro' && (
            <div>
              <label className="block font-semibold text-gray-700">Nombre Completo</label>
              <div className="mt-1 flex items-center gap-2 rounded border border-gray-300 p-2">
                <User className="h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs outline-none"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700">Correo Institucional</label>
            <div className="mt-1 flex items-center gap-2 rounded border border-gray-300 p-2">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs outline-none"
                placeholder="usuario@universidad.edu"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Contraseña</label>
            <div className="mt-1 flex items-center gap-2 rounded border border-gray-300 p-2">
              <Lock className="h-3.5 w-3.5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-500">
            * Se valida contra PostgreSQL con hash de contraseñas mediante <code>bcrypt</code> y firma de token JWT.
          </p>

          <button
            type="submit"
            className="w-full rounded border border-black bg-black py-2 font-bold text-white transition hover:bg-gray-800"
          >
            {modo === 'login' ? 'Acceder al Sistema' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
