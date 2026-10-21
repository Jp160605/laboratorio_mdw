'use client';

import React from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export type WindowColor = 'yellow' | 'blue' | 'red';

interface RetroWindowProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  color?: WindowColor;
  headerColor?: WindowColor | 'pink' | 'green' | 'dark' | 'cream';
  className?: string;
  bodyClassName?: string;
  actionButton?: React.ReactNode;
  onClose?: () => void;
}

export default function RetroWindow({
  title,
  badge,
  children,
  color,
  headerColor = 'yellow',
  className = '',
  bodyClassName = 'p-3.5 sm:p-5',
  actionButton,
  onClose,
}: RetroWindowProps) {
  const screenWidth = useWindowWidth();

  // Calcular dinámicamente el ancho máximo según el ancho actual de la pantalla
  const dynamicMaxWidth = screenWidth
    ? screenWidth < 640
      ? `${Math.max(280, screenWidth - 28)}px`
      : screenWidth < 1024
      ? `${Math.max(540, screenWidth - 48)}px`
      : '100%'
    : '100%';

  // Resolver color efectivo
  const effectiveColor: WindowColor = (() => {
    if (color) return color;
    if (headerColor === 'blue' || headerColor === 'dark') return 'blue';
    if (headerColor === 'red' || headerColor === 'pink') return 'red';
    if (headerColor === 'green') return 'blue'; // El verde está reservado exclusivamente para CTA
    return 'yellow';
  })();

  const themeStyles = {
    yellow: {
      wrapper: 'border-4 border-[#dd6902] bg-[#ffdf88]',
      header: 'bg-[#ffb220] border-b-[3px] border-[#dd6902]',
      dotBorder: 'border-[#dd6902]',
      btnBorder: 'border-[#dd6902]',
      btnBg: 'bg-[#ffdf88]',
      badge: 'border-2 border-[#dd6902] bg-[#ffdf88] text-[#073B4C]',
    },
    blue: {
      wrapper: 'border-4 border-[#0284c7] bg-[#bae6fd]',
      header: 'bg-[#38bdf8] border-b-[3px] border-[#0284c7]',
      dotBorder: 'border-[#0284c7]',
      btnBorder: 'border-[#0284c7]',
      btnBg: 'bg-[#bae6fd]',
      badge: 'border-2 border-[#0284c7] bg-[#bae6fd] text-[#073B4C]',
    },
    red: {
      wrapper: 'border-4 border-[#e11d48] bg-[#fecdd3]',
      header: 'bg-[#fb7185] border-b-[3px] border-[#e11d48]',
      dotBorder: 'border-[#e11d48]',
      btnBorder: 'border-[#e11d48]',
      btnBg: 'bg-[#fecdd3]',
      badge: 'border-2 border-[#e11d48] bg-[#fecdd3] text-[#073B4C]',
    },
  }[effectiveColor];

  return (
    <div
      style={{ maxWidth: dynamicMaxWidth }}
      className={`w-full overflow-hidden transition-all text-[#073B4C] min-w-0 box-border ${themeStyles.wrapper} ${className}`}
    >
      {/* Cabecera estilo OS retro */}
      <div
        className={`px-2.5 sm:px-3.5 py-2 flex items-center justify-between min-w-0 max-w-full overflow-hidden ${themeStyles.header}`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
          {/* Tres Círculos de Color Estilo Mac */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span
              className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF476F] border ${themeStyles.dotBorder}`}
            />
            <span
              className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFD166] border ${themeStyles.dotBorder}`}
            />
            <span
              className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#118AB2] border ${themeStyles.dotBorder}`}
            />
          </div>
          <span className="font-pixel text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#073B4C] ml-1 sm:ml-1.5 truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {badge && (
            <span
              className={`hidden xs:inline-block px-1.5 sm:px-2 py-0.5 font-pixel text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${themeStyles.badge}`}
            >
              {badge}
            </span>
          )}
          {actionButton}

          {/* Controles Retro de Ventana */}
          <div className="flex items-center gap-1 font-pixel text-xs font-bold">
            <span
              className={`w-4 h-4 flex items-center justify-center border-2 ${themeStyles.btnBorder} ${themeStyles.btnBg} text-[#073B4C] text-[10px] leading-none select-none`}
            >
              _
            </span>
            <span
              className={`w-4 h-4 flex items-center justify-center border-2 ${themeStyles.btnBorder} ${themeStyles.btnBg} text-[#073B4C] text-[9px] leading-none select-none`}
            >
              □
            </span>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar ventana"
                className={`w-4 h-4 flex items-center justify-center border-2 ${themeStyles.btnBorder} bg-[#EF476F] text-white text-[10px] leading-none hover:brightness-110 active:scale-95 transition-transform`}
              >
                ✕
              </button>
            ) : (
              <span
                className={`w-4 h-4 flex items-center justify-center border-2 ${themeStyles.btnBorder} bg-[#EF476F] text-white text-[10px] leading-none select-none`}
              >
                ✕
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contenido interior de la ventana */}
      <div className={`${bodyClassName} min-w-0 max-w-full overflow-hidden break-words`}>
        {children}
      </div>
    </div>
  );
}
