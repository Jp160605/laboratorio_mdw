import React from 'react';

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
  bodyClassName = 'p-4 sm:p-5',
  actionButton,
  onClose,
}: RetroWindowProps) {
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
      className={`w-full overflow-hidden transition-all text-[#073B4C] ${themeStyles.wrapper} ${className}`}
    >
      {/* Cabecera estilo OS retro */}
      <div
        className={`px-3.5 py-2 flex items-center justify-between ${themeStyles.header}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Tres Círculos de Color Estilo Mac: Rojo (#EF476F), Amarillo (#FFD166), Azul (#118AB2) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`inline-block w-3 h-3 rounded-full bg-[#EF476F] border ${themeStyles.dotBorder}`}
            />
            <span
              className={`inline-block w-3 h-3 rounded-full bg-[#FFD166] border ${themeStyles.dotBorder}`}
            />
            <span
              className={`inline-block w-3 h-3 rounded-full bg-[#118AB2] border ${themeStyles.dotBorder}`}
            />
          </div>
          <span className="font-pixel text-xs font-bold uppercase tracking-wider text-[#073B4C] ml-1.5 truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span
              className={`px-2 py-0.5 font-pixel text-[10px] font-bold uppercase tracking-wider ${themeStyles.badge}`}
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
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
