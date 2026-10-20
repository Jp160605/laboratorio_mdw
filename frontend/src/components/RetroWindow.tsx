import React from 'react';

interface RetroWindowProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  headerColor?: 'yellow' | 'pink' | 'blue' | 'green' | 'dark' | 'cream';
  className?: string;
  actionButton?: React.ReactNode;
}

export default function RetroWindow({
  title,
  badge,
  children,
  headerColor = 'yellow',
  className = '',
  actionButton,
}: RetroWindowProps) {
  const getHeaderBg = () => {
    switch (headerColor) {
      case 'yellow':
        return 'bg-neo-yellow text-neo-dark';
      case 'pink':
        return 'bg-neo-pink text-white';
      case 'blue':
        return 'bg-neo-blue text-white';
      case 'green':
        return 'bg-neo-green text-neo-dark';
      case 'dark':
        return 'bg-neo-dark text-neo-bg';
      case 'cream':
      default:
        return 'bg-transparent text-neo-dark border-b-2 border-neo-dark';
    }
  };

  return (
    <div
      className={`border-3 border-neo-dark bg-transparent transition-all ${className}`}
    >
      {/* Barra de título estilo OS retro */}
      <div
        className={`flex items-center justify-between border-b-3 border-neo-dark px-3 py-2 ${getHeaderBg()}`}
      >
        <div className="flex items-center gap-2">
          {/* Botones de control estilo retro ventana */}
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-neo-dark bg-transparent"></span>
            <span className="inline-block h-3 w-3 rounded-full border-2 border-neo-dark bg-neo-dark"></span>
          </div>
          <span className="font-pixel text-xs font-bold uppercase tracking-wider">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="border-2 border-neo-dark px-2 py-0.5 font-pixel text-[11px] font-bold text-neo-dark bg-transparent">
              {badge}
            </span>
          )}
          {actionButton}
        </div>
      </div>

      {/* Contenido interior de la ventana */}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
