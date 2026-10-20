'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PixelSkyBackground from '@/components/PixelSkyBackground';
import PixelIcon from '@/components/PixelIcon';

const MENU_ITEMS = [
  { label: 'RESERVAR LAB', href: '/reservas' },
  { label: 'MIS RESERVAS', href: '/mis-reservas' },
  { label: 'ACCESO / LOGIN', href: '/login' },
  { label: 'PANEL ADMIN', href: '/admin' },
];

export default function LandingPage() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Navegación por teclado (Flechas arriba/abajo y Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        router.push(MENU_ITEMS[selectedIndex].href);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, router]);

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    router.push(MENU_ITEMS[idx].href);
  };

  return (
    <div className="min-h-screen text-neo-dark flex flex-col relative select-none">
      {/* Fondo de Cielo con Estrellas Pixel Art (6 Franjas Duras) */}
      <PixelSkyBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar Transparente Superior */}
        <Navbar />

        {/* Contenido Principal con Distribución de Cartel Retro Arcade (40% ancho de pantalla) */}
        <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
          <div className="w-full lg:w-[42vw] max-w-2xl mx-auto flex flex-col items-center relative py-6 px-4 sm:px-8 border-2 border-[#FFFAEB]/20 bg-transparent">
            {/* Esquinas Neobrutalistas / Retro Brackets */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-3 border-l-3 border-[#FFFAEB]" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-3 border-r-3 border-[#FFFAEB]" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-3 border-l-3 border-[#FFFAEB]" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-3 border-r-3 border-[#FFFAEB]" />

            {/* Marcadores Laterales Punteados estilo Arcade Frame */}
            <div className="absolute left-1.5 top-1/4 bottom-1/4 flex flex-col justify-between text-[#FFFAEB]/30 font-pixel text-[10px]">
              <span>:</span>
              <span>:</span>
              <span className="text-neo-pink">■</span>
              <span>:</span>
              <span>:</span>
            </div>
            <div className="absolute right-1.5 top-1/4 bottom-1/4 flex flex-col justify-between text-[#FFFAEB]/30 font-pixel text-[10px]">
              <span>:</span>
              <span>:</span>
              <span className="text-neo-pink">■</span>
              <span>:</span>
              <span>:</span>
            </div>

            {/* Cabecera Superior del Marco (HUD Arcade) */}
            <div className="w-full flex items-center justify-between text-[#FFFAEB] font-pixel text-xs sm:text-sm tracking-wider mb-6 sm:mb-8 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FFD166]">1UP</span>
                <span className="text-neo-pink text-sm animate-pulse">❤️</span>
                <span className="text-[#FFFAEB]/60 text-xs">♡</span>
                <span className="text-[#FFFAEB]/60 text-xs">♡</span>
                <span className="text-[#FFFAEB]/40 tracking-widest hidden sm:inline">·····</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#FFFAEB]/85 font-bold">
                <span>CONTINUE?</span>
                <span className="text-neo-yellow">⏋</span>
              </div>
            </div>

            {/* Gran Título Centrado en 2 Líneas (Estilo GAME OVER) */}
            <div className="my-2 sm:my-4 text-center">
              <h1 className="font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold uppercase text-white tracking-wider leading-[0.9] drop-shadow-[0_2px_0_#073B4C]">
                Reserva tu
                <br />
                <span className="text-[#FFFAEB]">Laboratorio</span>
              </h1>
            </div>

            {/* Menú Interactivo Vertical (Estilo RESTART / QUIT) */}
            <div className="my-6 sm:my-8 w-full max-w-sm flex flex-col items-center space-y-3 font-pixel">
              {MENU_ITEMS.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group w-full flex items-center justify-center gap-3 py-1.5 text-center font-bold tracking-widest uppercase transition-all ${
                      isSelected
                        ? 'text-[#06D6A0] text-2xl sm:text-3xl'
                        : 'text-[#FFFAEB]/85 hover:text-white text-xl sm:text-2xl'
                    }`}
                  >
                    {/* Ícono Play Pixelado Cursor a la izquierda */}
                    <span
                      className={`inline-flex items-center justify-center transition-opacity ${
                        isSelected ? 'opacity-100 text-[#06D6A0]' : 'opacity-0'
                      }`}
                    >
                      <PixelIcon
                        name="play"
                        size={20}
                        color="#06D6A0"
                        className="animate-pulse"
                      />
                    </span>

                    <span>{item.label}</span>

                    {/* Espaciador invisible para balancear y centrar el texto con el icono */}
                    <span
                      className="inline-block w-5 opacity-0"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            {/* Divisor Punteado Central con Cruz (Estilo del Poster) */}
            <div className="w-full flex items-center justify-center gap-2 text-[#FFFAEB]/40 font-pixel text-xs my-2">
              <span className="tracking-widest">··············</span>
              <span className="text-neo-pink font-bold">✕</span>
              <span className="tracking-widest">··············</span>
            </div>

            {/* Lemas y Subtítulos en Dos Líneas */}
            <div className="text-center font-pixel text-xs sm:text-sm tracking-wider uppercase my-3 space-y-1">
              <p className="text-[#FFFAEB]/95 font-bold">
                SISTEMA UNIVERSITARIO DE RESERVAS Y LABORATORIOS.
              </p>
              <p className="text-neo-pink font-bold tracking-widest text-[11px] sm:text-xs">
                CONTROL DE CONCURRENCIA OPTIMISTA · TRANSACCIONES ACID PURAS.
              </p>
            </div>

            {/* Divisor con Ícono de Gamepad Pixel Art */}
            <div className="w-full flex items-center justify-center gap-3 my-3">
              <span className="h-0.5 w-12 sm:w-16 bg-[#FFFAEB]/30" />
              <PixelIcon name="gamepad" size={20} color="#FFD166" />
              <span className="h-0.5 w-12 sm:w-16 bg-[#FFFAEB]/30" />
            </div>

            {/* Sección Inferior de 3 Columnas (FOCUS, PERSIST, VICTORY) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center mt-3 pt-2">
              {/* Columna 1: Enfoque / Disponibilidad */}
              <div className="flex flex-col items-center space-y-1 p-2">
                <PixelIcon name="crosshair" size={24} color="#118AB2" />
                <h4 className="font-pixel text-xs font-bold uppercase text-neo-pink tracking-wider">
                  DISPONIBILIDAD
                </h4>
                <p className="font-body text-[11px] text-[#FFFAEB]/80 leading-snug">
                  WebSockets en vivo. Horarios sin recarga.
                </p>
              </div>

              {/* Columna 2: Persistencia / Bloqueo Optimista */}
              <div className="flex flex-col items-center space-y-1 p-2">
                <PixelIcon name="heart" size={24} color="#EF476F" />
                <h4 className="font-pixel text-xs font-bold uppercase text-neo-pink tracking-wider">
                  ANTI-OVERBOOK
                </h4>
                <p className="font-body text-[11px] text-[#FFFAEB]/80 leading-snug">
                  Bloqueo optimista. Cero dobles reservas.
                </p>
              </div>

              {/* Columna 3: Eficiencia / BullMQ */}
              <div className="flex flex-col items-center space-y-1 p-2">
                <PixelIcon name="trophy" size={24} color="#FFD166" />
                <h4 className="font-pixel text-xs font-bold uppercase text-neo-pink tracking-wider">
                  BULLMQ REDIS
                </h4>
                <p className="font-body text-[11px] text-[#FFFAEB]/80 leading-snug">
                  Colas asíncronas. Correos al instante.
                </p>
              </div>
            </div>

            {/* Badge / Pill Inferior Enmarcado */}
            <div className="mt-6 border border-[#FFFAEB]/50 bg-transparent px-4 py-1 text-center">
              <span className="font-pixel text-[11px] font-bold uppercase tracking-widest text-[#FFFAEB]">
                LABRESERVA · MDW V1.0 ACID
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
