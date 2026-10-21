'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReservas } from '@/context/ReservasContext';
import PixelIcon from '@/components/PixelIcon';

export default function Navbar() {
  const pathname = usePathname();
  const { usuarioActual, setUsuarioActual, reservas } = useReservas();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [simuladorModalMobile, setSimuladorModalMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const usuarioA = { id: 1, nombre: 'Juan Pérez (Alumno A)', email: 'alumnoA@universidad.edu', rol: 'ALUMNO' as const };
  const usuarioB = { id: 2, nombre: 'María López (Alumno B)', email: 'alumnoB@universidad.edu', rol: 'ALUMNO' as const };
  const usuarioAdmin = { id: 99, nombre: 'Admin Sistema', email: 'admin@universidad.edu', rol: 'ADMINISTRADOR' as const };

  const misReservasCount = reservas.filter((r) => r.usuario_id === usuarioActual?.id && r.estado === 'CONFIRMADA').length;

  const links = [
    { href: '/', label: 'Inicio', shortLabel: 'Inicio', icon: 'monitor' as const },
    { href: '/reservas', label: 'Disponibilidad', shortLabel: 'Disponibilidad', icon: 'calendar' as const },
    { href: '/mis-reservas', label: `Mis Reservas (${misReservasCount})`, shortLabel: 'Mis Reservas', icon: 'user' as const },
    { href: '/admin', label: 'Panel Admin', shortLabel: 'Admin', icon: 'terminal' as const },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          scrolled ? 'bg-[#073B4C]' : 'bg-transparent'
        }`}
      >
        {/* ============================================================== */}
        {/* HEADER MOBILE (< md): Logo a la izq, Usuario a la der,        */}
        {/* y a la izq del usuario el botón para el simulador              */}
        {/* ============================================================== */}
        <div className="flex md:hidden items-center justify-between px-4 py-2.5 w-full">
          {/* Logo SVG MDW a la izquierda */}
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity shrink-0"
            title="MDW // Laboratorio & Salas"
          >
            <svg
              viewBox="0 0 63 19"
              className="h-7 w-auto"
              fill="#FFD166"
              style={{ shapeRendering: 'crispEdges' }}
            >
              <path d="M4,0h1v1h-1z M19,0h1v1h-1z M28,0h6v1h-6z M44,0h1v1h-1z M59,0h1v1h-1z M3,1h3v1h-3z M18,1h3v1h-3z M26,1h10v1h-10z M43,1h3v1h-3z M58,1h3v1h-3z M2,2h5v1h-5z M17,2h5v1h-5z M26,2h11v1h-11z M42,2h5v1h-5z M57,2h5v1h-5z M1,3h8v1h-8z M15,3h8v1h-8z M26,3h12v1h-12z M41,3h7v1h-7z M56,3h7v1h-7z M1,4h8v1h-8z M15,4h8v1h-8z M26,4h13v1h-13z M41,4h7v1h-7z M56,4h7v1h-7z M1,5h9v1h-9z M14,5h9v1h-9z M26,5h6v1h-6z M33,5h6v1h-6z M42,5h5v1h-5z M57,5h5v1h-5z M1,6h10v1h-10z M13,6h10v1h-10z M26,6h6v1h-6z M33,6h7v1h-7z M42,6h5v1h-5z M51,6h2v1h-2z M57,6h5v1h-5z M1,7h22v1h-22z M26,7h6v1h-6z M33,7h1v1h-1z M35,7h5v1h-5z M43,7h4v1h-4z M51,7h2v1h-2z M57,7h4v1h-4z M1,8h6v1h-6z M8,8h8v1h-8z M17,8h6v1h-6z M26,8h14v1h-14z M43,8h4v1h-4z M50,8h4v1h-4z M57,8h4v1h-4z M1,9h6v1h-6z M9,9h6v1h-6z M17,9h6v1h-6z M26,9h3v1h-3z M31,9h1v1h-1z M33,9h1v1h-1z M37,9h4v1h-4z M43,9h4v1h-4z M50,9h4v1h-4z M57,9h4v1h-4z M1,10h6v1h-6z M10,10h4v1h-4z M17,10h6v1h-6z M26,10h14v1h-14z M43,10h5v1h-5z M49,10h6v1h-6z M56,10h5v1h-5z M1,11h6v1h-6z M10,11h4v1h-4z M17,11h6v1h-6z M26,11h4v1h-4z M31,11h1v1h-1z M33,11h1v1h-1z M35,11h5v1h-5z M43,11h18v1h-18z M1,12h6v1h-6z M11,12h2v1h-2z M17,12h6v1h-6z M26,12h6v1h-6z M33,12h7v1h-7z M43,12h18v1h-18z M1,13h6v1h-6z M17,13h6v1h-6z M26,13h6v1h-6z M33,13h7v1h-7z M43,13h8v1h-8z M53,13h8v1h-8z M1,14h6v1h-6z M17,14h6v1h-6z M26,14h13v1h-13z M43,14h6v1h-6z M55,14h6v1h-6z M0,15h8v1h-8z M16,15h8v1h-8z M26,15h12v1h-12z M43,15h5v1h-5z M56,15h5v1h-5z M0,16h8v1h-8z M16,16h8v1h-8z M26,16h11v1h-11z M43,16h5v1h-5z M56,16h5v1h-5z M2,17h4v1h-4z M18,17h4v1h-4z M26,17h10v1h-10z M43,17h4v1h-4z M57,17h4v1h-4z M3,18h2v1h-2z M19,18h2v1h-2z M28,18h6v1h-6z M44,18h2v1h-2z M58,18h2v1h-2z" />
            </svg>
          </Link>

          {/* A la derecha: Botón simulador + Usuario */}
          <div className="flex items-center gap-2">
            {/* Botón para el simulador de usuarios a la izquierda del usuario */}
            <button
              type="button"
              onClick={() => setSimuladorModalMobile(true)}
              className="flex items-center gap-1 border-2 border-[#FFFAEB] bg-transparent px-2 py-1 font-pixel text-[11px] font-bold text-[#FFFAEB] hover:text-[#FFD166] hover:border-[#FFD166] transition-colors"
              title="Abrir simulador de usuarios"
            >
              <PixelIcon name="refresh" size={12} color="#FFFAEB" />
              <span>Simular</span>
            </button>

            {/* Usuario a la derecha */}
            {usuarioActual ? (
              <Link
                href="/login"
                className="flex items-center gap-1.5 border-2 border-[#FFFAEB] bg-transparent px-2 py-1 text-xs font-pixel text-[#FFFAEB] hover:text-[#FFD166] hover:border-[#FFD166] transition-colors"
              >
                <div className="h-2.5 w-2.5 rounded-full border border-[#073B4C] bg-[#06D6A0]" />
                <span className="font-bold truncate max-w-[80px]">
                  {usuarioActual.nombre.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-2.5 py-1 border-2 border-[#FFFAEB] bg-transparent text-[#FFFAEB] font-pixel text-xs font-bold uppercase"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* HEADER IPAD & DESKTOP (>= md):                                 */}
        {/* Logo a la izq con navs después de él, y en la esquina el       */}
        {/* card cuadrado para usuario con dropdown de simulación          */}
        {/* ============================================================== */}
        <div className="hidden md:flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-3 sm:px-6">
          {/* Logo y Enlaces de Navegación después de él */}
          <div className="flex items-center gap-5 lg:gap-8 min-w-0">
            <Link
              href="/"
              className="flex items-center hover:opacity-85 transition-opacity shrink-0"
              title="MDW // Laboratorio & Salas"
            >
              <svg
                viewBox="0 0 63 19"
                className="h-8 w-auto"
                fill="#FFD166"
                style={{ shapeRendering: 'crispEdges' }}
              >
                <path d="M4,0h1v1h-1z M19,0h1v1h-1z M28,0h6v1h-6z M44,0h1v1h-1z M59,0h1v1h-1z M3,1h3v1h-3z M18,1h3v1h-3z M26,1h10v1h-10z M43,1h3v1h-3z M58,1h3v1h-3z M2,2h5v1h-5z M17,2h5v1h-5z M26,2h11v1h-11z M42,2h5v1h-5z M57,2h5v1h-5z M1,3h8v1h-8z M15,3h8v1h-8z M26,3h12v1h-12z M41,3h7v1h-7z M56,3h7v1h-7z M1,4h8v1h-8z M15,4h8v1h-8z M26,4h13v1h-13z M41,4h7v1h-7z M56,4h7v1h-7z M1,5h9v1h-9z M14,5h9v1h-9z M26,5h6v1h-6z M33,5h6v1h-6z M42,5h5v1h-5z M57,5h5v1h-5z M1,6h10v1h-10z M13,6h10v1h-10z M26,6h6v1h-6z M33,6h7v1h-7z M42,6h5v1h-5z M51,6h2v1h-2z M57,6h5v1h-5z M1,7h22v1h-22z M26,7h6v1h-6z M33,7h1v1h-1z M35,7h5v1h-5z M43,7h4v1h-4z M51,7h2v1h-2z M57,7h4v1h-4z M1,8h6v1h-6z M8,8h8v1h-8z M17,8h6v1h-6z M26,8h14v1h-14z M43,8h4v1h-4z M50,8h4v1h-4z M57,8h4v1h-4z M1,9h6v1h-6z M9,9h6v1h-6z M17,9h6v1h-6z M26,9h3v1h-3z M31,9h1v1h-1z M33,9h1v1h-1z M37,9h4v1h-4z M43,9h4v1h-4z M50,9h4v1h-4z M57,9h4v1h-4z M1,10h6v1h-6z M10,10h4v1h-4z M17,10h6v1h-6z M26,10h14v1h-14z M43,10h5v1h-5z M49,10h6v1h-6z M56,10h5v1h-5z M1,11h6v1h-6z M10,11h4v1h-4z M17,11h6v1h-6z M26,11h4v1h-4z M31,11h1v1h-1z M33,11h1v1h-1z M35,11h5v1h-5z M43,11h18v1h-18z M1,12h6v1h-6z M11,12h2v1h-2z M17,12h6v1h-6z M26,12h6v1h-6z M33,12h7v1h-7z M43,12h18v1h-18z M1,13h6v1h-6z M17,13h6v1h-6z M26,13h6v1h-6z M33,13h7v1h-7z M43,13h8v1h-8z M53,13h8v1h-8z M1,14h6v1h-6z M17,14h6v1h-6z M26,14h13v1h-13z M43,14h6v1h-6z M55,14h6v1h-6z M0,15h8v1h-8z M16,15h8v1h-8z M26,15h12v1h-12z M43,15h5v1h-5z M56,15h5v1h-5z M0,16h8v1h-8z M16,16h8v1h-8z M26,16h11v1h-11z M43,16h5v1h-5z M56,16h5v1h-5z M2,17h4v1h-4z M18,17h4v1h-4z M26,17h10v1h-10z M43,17h4v1h-4z M57,17h4v1h-4z M3,18h2v1h-2z M19,18h2v1h-2z M28,18h6v1h-6z M44,18h2v1h-2z M58,18h2v1h-2z" />
              </svg>
            </Link>

            {/* Enlaces de Navegación después del logo */}
            <div className="flex items-center gap-1.5 lg:gap-3 flex-wrap">
              {links.map((link) => {
                const activo = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1 font-pixel text-xs font-bold uppercase transition-all ${
                      activo
                        ? 'text-[#06D6A0] bg-transparent border-0'
                        : 'text-[#FFFAEB] bg-transparent border-0 hover:text-[#FFD166]'
                    }`}
                  >
                    {/* Destello pixel art al hacer hover */}
                    <span className="hidden group-hover:inline-flex items-center text-[#FFD166] animate-pulse">
                      <svg
                        width={10}
                        height={10}
                        viewBox="0 0 5 5"
                        style={{ shapeRendering: 'crispEdges' }}
                        className="mr-0.5"
                      >
                        <rect x={2} y={2} width={1} height={1} fill="#FFD166" />
                        <rect x={2} y={0} width={1} height={1} fill="#06D6A0" />
                        <rect x={2} y={4} width={1} height={1} fill="#06D6A0" />
                        <rect x={0} y={2} width={1} height={1} fill="#06D6A0" />
                        <rect x={4} y={2} width={1} height={1} fill="#06D6A0" />
                      </svg>
                    </span>

                    <PixelIcon
                      name={link.icon}
                      size={14}
                      color={activo ? '#06D6A0' : '#FFFAEB'}
                    />
                    <span className="transition-transform group-hover:translate-x-0.5 whitespace-nowrap">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* En la esquina: Card CUADRADO para usuario con círculo arriba, */}
          {/* usuario centrado y flecha abajo a la derecha (dropdown simulación) */}
          <div className="relative shrink-0 ml-4">
            <div className="w-16 h-16 border-2 border-[#FFFAEB] bg-[#073B4C]/80 hover:bg-[#073B4C] flex flex-col items-center justify-between p-1.5 relative select-none shadow-md">
              {/* Círculo de color arriba */}
              <span className="w-3 h-3 rounded-full border border-[#073B4C] bg-[#06D6A0] shrink-0 mt-0.5" />

              {/* Debajo y centrado el usuario */}
              <Link
                href="/login"
                className="font-pixel text-[10px] font-bold text-[#FFFAEB] uppercase truncate max-w-full text-center hover:text-[#FFD166] transition-colors leading-none mb-1 px-1"
                title={usuarioActual ? usuarioActual.nombre : 'Iniciar sesión'}
              >
                {usuarioActual ? usuarioActual.nombre.split(' ')[0] : 'Invitado'}
              </Link>

              {/* Flecha hacia abajo a la derecha: dropdown de simulación */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="absolute bottom-1 right-1 p-0.5 text-[#FFFAEB] hover:text-[#FFD166] transition-colors cursor-pointer"
                title="Abrir selector de simulación"
              >
                <PixelIcon name="chevron-down" size={10} color="#FFFAEB" />
              </button>
            </div>

            {/* Dropdown del Selector de Simulación */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 border-3 border-[#dd6902] bg-[#ffdf88] p-3 text-[#073B4C] shadow-2xl z-50">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#dd6902]/30 mb-2">
                  <span className="font-pixel text-[10px] font-bold uppercase text-[#073B4C]">
                    {'//'} SIMULAR USUARIO
                  </span>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(false)}
                    className="font-pixel text-xs font-bold text-[#e11d48] hover:opacity-80"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioActual(usuarioA);
                      setDropdownOpen(false);
                    }}
                    className={`w-full p-2 text-left font-pixel text-xs font-bold border-2 transition-all flex items-center justify-between ${
                      usuarioActual?.id === usuarioA.id
                        ? 'border-[#0284c7] bg-[#bae6fd] text-[#073B4C]'
                        : 'border-[#dd6902] bg-[#fef3c7] text-[#073B4C] hover:bg-[#ffb220]/40'
                    }`}
                  >
                    <span>Alumno A (Juan)</span>
                    {usuarioActual?.id === usuarioA.id && <PixelIcon name="check" size={12} color="#073B4C" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioActual(usuarioB);
                      setDropdownOpen(false);
                    }}
                    className={`w-full p-2 text-left font-pixel text-xs font-bold border-2 transition-all flex items-center justify-between ${
                      usuarioActual?.id === usuarioB.id
                        ? 'border-[#0284c7] bg-[#bae6fd] text-[#073B4C]'
                        : 'border-[#dd6902] bg-[#fef3c7] text-[#073B4C] hover:bg-[#ffb220]/40'
                    }`}
                  >
                    <span>Alumno B (María)</span>
                    {usuarioActual?.id === usuarioB.id && <PixelIcon name="check" size={12} color="#073B4C" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioActual(usuarioAdmin);
                      setDropdownOpen(false);
                    }}
                    className={`w-full p-2 text-left font-pixel text-xs font-bold border-2 transition-all flex items-center justify-between ${
                      usuarioActual?.id === usuarioAdmin.id
                        ? 'border-[#e11d48] bg-[#fecdd3] text-[#073B4C]'
                        : 'border-[#dd6902] bg-[#fef3c7] text-[#073B4C] hover:bg-[#ffb220]/40'
                    }`}
                  >
                    <span>Admin Sistema</span>
                    {usuarioActual?.id === usuarioAdmin.id && <PixelIcon name="check" size={12} color="#073B4C" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ============================================================== */}
      {/* NAVEGACIÓN FIJA INFERIOR PARA MOBILE (md:hidden)                */}
      {/* En amarillo, patrón similar a ventanas, icono y texto centrado   */}
      {/* ============================================================== */}
      <aside
        aria-label="Navegación móvil"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t-4 border-[#dd6902] bg-[#ffdf88] shadow-2xl"
      >
        <div className="grid grid-cols-4 items-center h-16 text-[#073B4C]">
          {links.map((link) => {
            const activo = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center h-full px-1 py-1 text-center transition-all ${
                  activo
                    ? 'bg-[#ffb220] border-t-2 border-[#dd6902] text-[#073B4C]'
                    : 'text-[#073B4C]/80 hover:bg-[#ffb220]/30'
                }`}
              >
                <PixelIcon
                  name={link.icon}
                  size={18}
                  color={activo ? '#06D6A0' : '#073B4C'}
                />
                <span
                  className={`font-pixel text-[9px] uppercase font-bold tracking-tight mt-1 leading-tight truncate max-w-full ${
                    activo ? 'text-[#073B4C]' : 'text-[#073B4C]/85'
                  }`}
                >
                  {link.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Modal Popup para simulación de usuarios en Mobile */}
      {simuladorModalMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:hidden backdrop-blur-none">
          <div className="w-full max-w-xs border-4 border-[#dd6902] bg-[#ffdf88] p-4 text-[#073B4C] shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-[#dd6902]/30 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF476F] border border-[#dd6902]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] border border-[#dd6902]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#118AB2] border border-[#dd6902]" />
                <span className="font-pixel text-xs font-bold uppercase ml-1">Simular Usuario</span>
              </div>
              <button
                type="button"
                onClick={() => setSimuladorModalMobile(false)}
                className="font-pixel font-bold text-xs p-1 text-[#e11d48]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setUsuarioActual(usuarioA);
                  setSimuladorModalMobile(false);
                }}
                className={`w-full p-2.5 text-left font-pixel text-xs font-bold border-2 transition-all flex items-center justify-between ${
                  usuarioActual?.id === usuarioA.id
                    ? 'border-[#0284c7] bg-[#bae6fd] text-[#073B4C]'
                    : 'border-[#dd6902] bg-[#fef3c7] text-[#073B4C]'
                }`}
              >
                <span>Alumno A (Juan)</span>
                {usuarioActual?.id === usuarioA.id && <PixelIcon name="check" size={12} color="#073B4C" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsuarioActual(usuarioB);
                  setSimuladorModalMobile(false);
                }}
                className={`w-full p-2.5 text-left font-pixel text-xs font-bold border-2 transition-all flex items-center justify-between ${
                  usuarioActual?.id === usuarioB.id
                    ? 'border-[#0284c7] bg-[#bae6fd] text-[#073B4C]'
                    : 'border-[#dd6902] bg-[#fef3c7] text-[#073B4C]'
                }`}
              >
                <span>Alumno B (María)</span>
                {usuarioActual?.id === usuarioB.id && <PixelIcon name="check" size={12} color="#073B4C" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsuarioActual(usuarioAdmin);
                  setSimuladorModalMobile(false);
                }}
                className={`w-full p-2.5 text-left font-pixel text-xs font-bold border-2 transition-all flex items-center justify-between ${
                  usuarioActual?.id === usuarioAdmin.id
                    ? 'border-[#e11d48] bg-[#fecdd3] text-[#073B4C]'
                    : 'border-[#dd6902] bg-[#fef3c7] text-[#073B4C]'
                }`}
              >
                <span>Admin Sistema</span>
                {usuarioActual?.id === usuarioAdmin.id && <PixelIcon name="check" size={12} color="#073B4C" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
