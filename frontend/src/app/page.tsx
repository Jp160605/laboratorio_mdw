'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar Transparente Superior (se vuelve sólido #073B4C con scroll) */}
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
            <div className="absolute left-2 top-1/4 bottom-1/4 flex flex-col justify-between items-center">
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
              <span className="w-2 h-2 bg-[#EF476F] shadow-[0_0_6px_#EF476F]" />
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
            </div>
            <div className="absolute right-2 top-1/4 bottom-1/4 flex flex-col justify-between items-center">
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
              <span className="w-2 h-2 bg-[#EF476F] shadow-[0_0_6px_#EF476F]" />
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
              <span className="w-1.5 h-1.5 bg-[#FFFAEB]/30" />
            </div>

            {/* Cabecera Superior del Marco (HUD Arcade con Pixel Art) */}
            <div className="w-full flex items-center justify-between text-[#FFFAEB] font-pixel text-xs sm:text-sm tracking-wider mb-6 sm:mb-8 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FFD166] mr-1">1UP</span>
                {/* Corazón lleno en pixel art */}
                <PixelIcon name="heart" size={16} color="#EF476F" className="animate-pulse" />
                {/* Corazones vacíos en pixel art */}
                <PixelIcon name="heart-outline" size={16} color="#FFFAEB" className="opacity-60" />
                <PixelIcon name="heart-outline" size={16} color="#FFFAEB" className="opacity-60" />
                {/* Fila de puntos en pixel art */}
                <div className="hidden sm:flex items-center gap-1.5 ml-2">
                  <span className="w-1.5 h-1.5 bg-[#FFFAEB]/40" />
                  <span className="w-1.5 h-1.5 bg-[#FFFAEB]/40" />
                  <span className="w-1.5 h-1.5 bg-[#FFFAEB]/40" />
                  <span className="w-1.5 h-1.5 bg-[#FFFAEB]/40" />
                  <span className="w-1.5 h-1.5 bg-[#FFFAEB]/40" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#FFFAEB] font-bold">
                <span className="tracking-widest">CONTINUE?</span>
                <svg width={10} height={10} viewBox="0 0 10 10" fill="none" className="inline-block shrink-0">
                  <path d="M0 0h10v10H7V3H0V0z" fill="#FFD166" />
                </svg>
              </div>
            </div>

            {/* Gran Título Centrado en 2 Líneas (Laboratorio en Amarillo #FFD166) */}
            <div className="my-2 sm:my-4 text-center">
              <h1 className="font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold uppercase text-white tracking-wider leading-[0.9] drop-shadow-[0_2px_0_#073B4C]">
                Reserva tu
                <br />
                <span className="text-[#FFD166]">Laboratorio</span>
              </h1>
            </div>

            {/* Menú Interactivo Vertical (Tamaño x1.5 y Triángulo casi igual a la altura de la fuente) */}
            <div className="my-6 sm:my-8 w-full max-w-lg lg:max-w-xl flex flex-col items-center space-y-3 font-pixel">
              {MENU_ITEMS.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group w-full flex items-center justify-center gap-2 sm:gap-3 py-1.5 text-center font-bold tracking-widest uppercase transition-all ${
                      isSelected
                        ? 'text-[#06D6A0] text-3xl sm:text-4xl lg:text-5xl'
                        : 'text-[#FFFAEB]/85 hover:text-white text-2xl sm:text-3xl lg:text-4xl'
                    }`}
                  >
                    {/* Ícono Play Pixelado Cursor con altura acorde a la fuente */}
                    <span
                      className={`inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 shrink-0 transition-opacity ${
                        isSelected ? 'opacity-100 text-[#06D6A0]' : 'opacity-0'
                      }`}
                    >
                      <PixelIcon
                        name="play"
                        size={44}
                        color="#06D6A0"
                        className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 animate-pulse"
                      />
                    </span>

                    <span>{item.label}</span>

                    {/* Espaciador invisible para balancear y centrar el texto con el icono */}
                    <span
                      className="inline-block w-8 sm:w-10 lg:w-12 shrink-0 opacity-0"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            {/* Ventana Retro (Paleta de 3 Colores de la Referencia: #ffdf88 fondo, #ffb220 cabecera, #dd6902 bordes) */}
            <div className="w-full mt-6 border-4 border-[#dd6902] bg-[#ffdf88] overflow-hidden">
              {/* Cabecera de la Ventana en #ffb220 con Borde #dd6902 */}
              <div className="bg-[#ffb220] px-3.5 py-2 flex items-center justify-between border-b-[3px] border-[#dd6902]">
                <div className="flex items-center gap-2">
                  {/* Tres Círculos de Color Estilo Mac: Rojo (#EF476F), Amarillo (#FFD166), Azul (#118AB2) */}
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#EF476F] border border-[#dd6902]" />
                    <span className="inline-block w-3 h-3 rounded-full bg-[#FFD166] border border-[#dd6902]" />
                    <span className="inline-block w-3 h-3 rounded-full bg-[#118AB2] border border-[#dd6902]" />
                  </div>
                  <span className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C] ml-1.5">
                    labreserva_system.exe
                  </span>
                </div>

                {/* Controles Retro de Ventana */}
                <div className="flex items-center gap-1 font-pixel text-xs font-bold">
                  <span className="w-4 h-4 flex items-center justify-center border-2 border-[#dd6902] bg-[#ffdf88] text-[#073B4C] text-[10px] leading-none select-none">_</span>
                  <span className="w-4 h-4 flex items-center justify-center border-2 border-[#dd6902] bg-[#ffdf88] text-[#073B4C] text-[9px] leading-none select-none">□</span>
                  <span className="w-4 h-4 flex items-center justify-center border-2 border-[#dd6902] bg-[#EF476F] text-white text-[10px] leading-none select-none">✕</span>
                </div>
              </div>

              {/* Cuerpo de la Ventana con fondo #ffdf88, texto #073B4C y remates #118AB2 */}
              <div className="p-4 sm:p-6 space-y-4 text-[#073B4C]">
                {/* Divisor Punteado Central con Cruz en Pixel Art */}
                <div className="w-full flex items-center justify-center gap-2.5 my-1">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={`l-${i}`} className="w-1.5 h-1.5 bg-[#dd6902]/35" />
                    ))}
                  </div>
                  {/* Cruz Pixel Art con Remate de Color #118AB2 */}
                  <svg width={10} height={10} viewBox="0 0 5 5" className="shrink-0" style={{ shapeRendering: 'crispEdges' }}>
                    <path d="M0 0h1v1H0zm4 0h1v1H4zm-1 1h1v1H3zm-2 0h1v1H1zm1 1h1v1H2zm-1 1h1v1H1zm2 0h1v1H3zm-3 1h1v1H0zm4 0h1v1H4z" fill="#118AB2" />
                  </svg>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={`r-${i}`} className="w-1.5 h-1.5 bg-[#dd6902]/35" />
                    ))}
                  </div>
                </div>

                {/* Lemas y Subtítulos en Dos Líneas */}
                <div className="text-center font-pixel text-xs sm:text-sm tracking-wider uppercase my-2 space-y-1">
                  <p className="text-[#073B4C] font-bold">
                    SISTEMA UNIVERSITARIO DE RESERVAS Y LABORATORIOS.
                  </p>
                  <p className="text-[#118AB2] font-bold tracking-widest text-[11px] sm:text-xs">
                    CONTROL DE CONCURRENCIA OPTIMISTA · TRANSACCIONES ACID PURAS.
                  </p>
                </div>

                {/* Divisor con Ícono de Gamepad Pixel Art */}
                <div className="w-full flex items-center justify-center gap-3 my-2">
                  <span className="h-0.5 w-12 sm:w-16 bg-[#dd6902]/30" />
                  <PixelIcon name="gamepad" size={20} color="#118AB2" />
                  <span className="h-0.5 w-12 sm:w-16 bg-[#dd6902]/30" />
                </div>

                {/* Sección Interior: 3 Columnas (FOCUS, PERSIST, VICTORY) con Borde #dd6902 y fondo #ffb220/20 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-center mt-2 pt-1 border-2 border-[#dd6902] bg-[#ffb220]/25 p-3">
                  {/* Columna 1: Enfoque / Disponibilidad */}
                  <div className="flex flex-col items-center space-y-1 p-1">
                    <PixelIcon name="crosshair" size={24} color="#118AB2" />
                    <h4 className="font-pixel text-xs font-bold uppercase text-[#118AB2] tracking-wider">
                      DISPONIBILIDAD
                    </h4>
                    <p className="font-body text-[11px] text-[#073B4C]/90 leading-snug">
                      WebSockets en vivo. Horarios sin recarga.
                    </p>
                  </div>

                  {/* Columna 2: Persistencia / Bloqueo Optimista */}
                  <div className="flex flex-col items-center space-y-1 p-1 sm:border-x-2 sm:border-[#dd6902]/30">
                    <PixelIcon name="heart" size={24} color="#118AB2" />
                    <h4 className="font-pixel text-xs font-bold uppercase text-[#118AB2] tracking-wider">
                      ANTI-OVERBOOK
                    </h4>
                    <p className="font-body text-[11px] text-[#073B4C]/90 leading-snug">
                      Bloqueo optimista. Cero dobles reservas.
                    </p>
                  </div>

                  {/* Columna 3: Eficiencia / BullMQ */}
                  <div className="flex flex-col items-center space-y-1 p-1">
                    <PixelIcon name="trophy" size={24} color="#118AB2" />
                    <h4 className="font-pixel text-xs font-bold uppercase text-[#118AB2] tracking-wider">
                      BULLMQ REDIS
                    </h4>
                    <p className="font-body text-[11px] text-[#073B4C]/90 leading-snug">
                      Colas asíncronas. Correos al instante.
                    </p>
                  </div>
                </div>

                {/* Badge / Pill Inferior Enmarcado en #ffb220 con Borde #dd6902 */}
                <div className="mt-3 border-2 border-[#dd6902] bg-[#ffb220] px-4 py-1 text-center">
                  <span className="font-pixel text-[11px] font-bold uppercase tracking-widest text-[#073B4C]">
                    LABRESERVA · MDW V1.0 ACID
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
