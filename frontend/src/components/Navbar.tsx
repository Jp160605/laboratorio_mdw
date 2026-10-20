'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReservas } from '@/context/ReservasContext';
import PixelIcon from '@/components/PixelIcon';

export default function Navbar() {
  const pathname = usePathname();
  const { usuarioActual, setUsuarioActual, reservas } = useReservas();

  const usuarioA = { id: 1, nombre: 'Juan Pérez (Alumno A)', email: 'alumnoA@universidad.edu', rol: 'ALUMNO' as const };
  const usuarioB = { id: 2, nombre: 'María López (Alumno B)', email: 'alumnoB@universidad.edu', rol: 'ALUMNO' as const };
  const usuarioAdmin = { id: 99, nombre: 'Admin Sistema', email: 'admin@universidad.edu', rol: 'ADMINISTRADOR' as const };

  const misReservasCount = reservas.filter((r) => r.usuario_id === usuarioActual?.id && r.estado === 'CONFIRMADA').length;

  const links = [
    { href: '/', label: 'Inicio', icon: 'monitor' as const },
    { href: '/reservas', label: 'Disponibilidad', icon: 'calendar' as const },
    { href: '/mis-reservas', label: `Mis Reservas (${misReservasCount})`, icon: 'user' as const },
    { href: '/admin', label: 'Panel Admin', icon: 'terminal' as const },
  ];

  return (
    <nav className="bg-transparent sticky top-0 z-40">
      {/* Barra Superior con Logo MDW y Navegación */}
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          {/* Logo SVG MDW en #FFD166 */}
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity"
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
        </div>

        {/* Enlaces de Navegación: Activo solo texto #06D6A0 (sin botón), Hover con destello pixel art */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                <span className="transition-transform group-hover:translate-x-0.5">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Selector de Usuario Activo y Acceso con delineados y textos claros #FFFAEB */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector Rápido */}
          <div className="flex items-center gap-1 border-2 border-[#FFFAEB] bg-transparent p-1 text-[11px] font-pixel text-[#FFFAEB]">
            <span className="px-1 text-[#FFFAEB]/85 font-bold">Simular:</span>
            <button
              type="button"
              onClick={() => setUsuarioActual(usuarioA)}
              className={`px-1.5 py-0.5 font-bold transition-all ${
                usuarioActual?.id === usuarioA.id
                  ? 'bg-[#06D6A0] text-neo-dark border border-[#FFFAEB]'
                  : 'bg-transparent text-[#FFFAEB] border border-transparent hover:border-[#FFFAEB]'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setUsuarioActual(usuarioB)}
              className={`px-1.5 py-0.5 font-bold transition-all ${
                usuarioActual?.id === usuarioB.id
                  ? 'bg-[#06D6A0] text-neo-dark border border-[#FFFAEB]'
                  : 'bg-transparent text-[#FFFAEB] border border-transparent hover:border-[#FFFAEB]'
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => setUsuarioActual(usuarioAdmin)}
              title="Cambiar a Administrador"
              className={`px-1.5 py-0.5 font-bold transition-all ${
                usuarioActual?.id === usuarioAdmin.id
                  ? 'bg-[#EF476F] text-white border border-[#FFFAEB]'
                  : 'bg-transparent text-[#FFFAEB] border border-transparent hover:border-[#FFFAEB]'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Botón Login o Perfil con delineado y texto #FFFAEB */}
          {usuarioActual ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 border-2 border-[#FFFAEB] bg-transparent px-2.5 py-1 text-xs font-pixel text-[#FFFAEB] hover:text-[#FFD166] hover:border-[#FFD166] transition-colors"
            >
              <div className="h-3 w-3 rounded-full border border-[#FFFAEB] bg-[#06D6A0]" />
              <span className="font-bold truncate max-w-[100px]">{usuarioActual.nombre.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 border-2 border-[#FFFAEB] bg-transparent text-[#FFFAEB] font-pixel text-xs font-bold uppercase hover:text-[#FFD166] hover:border-[#FFD166] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
