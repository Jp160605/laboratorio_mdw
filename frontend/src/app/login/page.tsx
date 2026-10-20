'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PixelIcon from '@/components/PixelIcon';
import PixelButton from '@/components/PixelButton';
import PixelBadge from '@/components/PixelBadge';
import RetroWindow from '@/components/RetroWindow';
import { useReservas } from '@/context/ReservasContext';
import { Usuario } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setUsuarioActual } = useReservas();

  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState<string>('alumnoA@universidad.edu');
  const [password, setPassword] = useState<string>('password123');
  const [nombre, setNombre] = useState<string>('Juan Pérez');
  const [rol, setRol] = useState<'ALUMNO' | 'ADMINISTRADOR'>('ALUMNO');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioNuevo: Usuario = {
      id: Date.now(),
      nombre: modo === 'registro' ? nombre : (email.includes('admin') ? 'Administrador Sistema' : 'Juan Pérez (Alumno A)'),
      email,
      rol,
    };
    setUsuarioActual(usuarioNuevo);
    router.push('/reservas');
  };

  const iniciarComo = (u: Usuario) => {
    setUsuarioActual(u);
    router.push(u.rol === 'ADMINISTRADOR' ? '/admin' : '/reservas');
  };

  return (
    <div className="min-h-screen text-neo-dark flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Tarjeta de Inicio de Sesión (Del Figma: Login #8:814) */}
          <RetroWindow
            title="SISTEMA_ACCESO_AUTH.EXE"
            badge="JWT_SESSION"
            headerColor="yellow"
          >
            {/* Header del Formulario */}
            <div className="border-b-2 border-neo-dark pb-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <PixelBadge variant="pink" size="sm">
                  PORTAL UNIVERSITARIO
                </PixelBadge>
                <span className="font-pixel text-xs text-neo-dark/70 font-bold">
                  {'//'} RF-01
                </span>
              </div>
              <h1 className="font-pixel text-3xl font-bold uppercase text-neo-dark tracking-tight">
                {modo === 'login' ? 'Inicia Sesión' : 'Crea tu Cuenta'}
              </h1>
              <p className="mt-1 font-body text-xs text-neo-dark/80">
                Accede al sistema para consultar horarios, apartar salas y gestionar tus reservas universitarias.
              </p>
            </div>

            {/* Alternador de Modo */}
            <div className="flex border-2 border-neo-dark mb-5 overflow-hidden">
              <button
                type="button"
                onClick={() => setModo('login')}
                className={`flex-1 py-2 font-pixel text-xs font-bold uppercase transition-all ${
                  modo === 'login'
                    ? 'bg-neo-blue text-white'
                    : 'text-neo-dark/70 hover:bg-neo-yellow'
                }`}
              >
                1. Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setModo('registro')}
                className={`flex-1 py-2 font-pixel text-xs font-bold uppercase transition-all ${
                  modo === 'registro'
                    ? 'bg-neo-blue text-white'
                    : 'text-neo-dark/70 hover:bg-neo-yellow'
                }`}
              >
                2. Registrarse
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {modo === 'registro' && (
                <div>
                  <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                    {'//'} Nombre Completo
                  </label>
                  <div className="mt-1 flex items-center border-2 border-neo-dark bg-transparent px-3 py-2 focus-within:bg-neo-yellow/20">
                    <PixelIcon name="user" size={16} className="text-neo-dark mr-2" />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Mariana López"
                      className="w-full font-body text-xs text-neo-dark outline-none bg-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                  {'//'} Correo Institucional
                </label>
                <div className="mt-1 flex items-center border-2 border-neo-dark bg-transparent px-3 py-2 focus-within:bg-neo-yellow/20">
                  <span className="font-pixel text-xs font-bold text-neo-dark mr-2">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@universidad.edu"
                    className="w-full font-body text-xs text-neo-dark outline-none bg-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                    {'//'} Contraseña
                  </label>
                  <a href="#" className="font-body text-[11px] text-neo-blue hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="mt-1 flex items-center border-2 border-neo-dark bg-transparent px-3 py-2 focus-within:bg-neo-yellow/20">
                  <PixelIcon name="lock" size={16} className="text-neo-dark mr-2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full font-body text-xs text-neo-dark outline-none bg-transparent"
                    required
                  />
                </div>
              </div>

              {modo === 'registro' && (
                <div>
                  <label className="block font-pixel text-xs font-bold uppercase text-neo-dark">
                    {'//'} Rol en el Sistema
                  </label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as 'ALUMNO' | 'ADMINISTRADOR')}
                    className="mt-1 w-full border-2 border-neo-dark bg-transparent p-2 font-pixel text-xs font-bold text-neo-dark focus:bg-neo-yellow/20 focus:outline-none"
                  >
                    <option value="ALUMNO">Alumno (Reservas y Consultas)</option>
                    <option value="ADMINISTRADOR">Administrador (Gestión de Salas y Métricas)</option>
                  </select>
                </div>
              )}

              <PixelButton
                type="submit"
                variant="success"
                size="lg"
                className="w-full"
                icon={<PixelIcon name="arrow-tr" size={16} />}
              >
                {modo === 'login' ? 'Iniciar Sesión (POST)' : 'Crear Cuenta'}
              </PixelButton>
            </form>

            {/* Accesos Rápidos para Evaluación Académica */}
            <div className="mt-6 border-t-2 border-neo-dark pt-4">
              <span className="font-pixel text-[11px] font-bold uppercase text-neo-dark/70 block mb-2">
                {'//'} Perfiles de Prueba Rápidos (1-Clic):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    iniciarComo({
                      id: 1,
                      nombre: 'Juan Pérez (Alumno A)',
                      email: 'alumnoA@universidad.edu',
                      rol: 'ALUMNO',
                    })
                  }
                  className="p-2 font-pixel text-xs font-bold text-neo-dark hover:bg-neo-yellow transition-all"
                >
                  Alumno A
                </button>
                <button
                  type="button"
                  onClick={() =>
                    iniciarComo({
                      id: 2,
                      nombre: 'María López (Alumno B)',
                      email: 'alumnoB@universidad.edu',
                      rol: 'ALUMNO',
                    })
                  }
                  className="p-2 font-pixel text-xs font-bold text-neo-dark hover:bg-neo-yellow transition-all"
                >
                  Alumno B
                </button>
                <button
                  type="button"
                  onClick={() =>
                    iniciarComo({
                      id: 99,
                      nombre: 'Admin Sistema',
                      email: 'admin@universidad.edu',
                      rol: 'ADMINISTRADOR',
                    })
                  }
                  className="border-2 border-neo-dark bg-neo-pink text-white p-2 font-pixel text-xs font-bold hover:bg-[#d8355c] transition-all"
                >
                  Admin
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </main>
    </div>
  );
}
