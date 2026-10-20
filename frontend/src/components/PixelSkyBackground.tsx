'use client';

import React from 'react';

type StarType = 'cross-vertical' | 'cross-horizontal' | 'dot-to-cross';
type StarColor = '#118AB2' | '#EF476F' | '#FFD166' | '#06D6A0';

interface StarConfig {
  id: number;
  top: string;
  left: string;
  color: StarColor;
  type: StarType;
  delay: string;
}

// Configuración de estrellas distribuidas en las 6 franjas horizontales (Inspirado en la referencia)
const STARS: StarConfig[] = [
  // Franja 1 (0% - 16.6%)
  { id: 1, top: '5%', left: '8%', color: '#FFD166', type: 'cross-vertical', delay: '0s' },
  { id: 2, top: '9%', left: '34%', color: '#06D6A0', type: 'dot-to-cross', delay: '1.1s' },
  { id: 3, top: '12%', left: '60%', color: '#118AB2', type: 'dot-to-cross', delay: '2.2s' },
  { id: 4, top: '6%', left: '88%', color: '#FFD166', type: 'cross-horizontal', delay: '0.7s' },

  // Franja 2 (16.6% - 33.3%)
  { id: 5, top: '19%', left: '15%', color: '#118AB2', type: 'dot-to-cross', delay: '1.8s' },
  { id: 6, top: '23%', left: '44%', color: '#EF476F', type: 'dot-to-cross', delay: '0.4s' },
  { id: 7, top: '24%', left: '79%', color: '#06D6A0', type: 'cross-vertical', delay: '1.5s' },

  // Franja 3 (33.3% - 50%)
  { id: 8, top: '37%', left: '5%', color: '#118AB2', type: 'dot-to-cross', delay: '2.6s' },
  { id: 9, top: '39%', left: '53%', color: '#118AB2', type: 'dot-to-cross', delay: '0.9s' },
  { id: 10, top: '42%', left: '87%', color: '#06D6A0', type: 'cross-horizontal', delay: '1.9s' },

  // Franja 4 (50% - 66.6%)
  { id: 11, top: '51%', left: '19%', color: '#FFD166', type: 'dot-to-cross', delay: '0.3s' },
  { id: 12, top: '55%', left: '35%', color: '#06D6A0', type: 'cross-vertical', delay: '1.4s' },
  { id: 13, top: '58%', left: '77%', color: '#118AB2', type: 'dot-to-cross', delay: '2.7s' },

  // Franja 5 (66.6% - 83.3%)
  { id: 14, top: '67%', left: '15%', color: '#06D6A0', type: 'cross-horizontal', delay: '0.8s' },
  { id: 15, top: '71%', left: '42%', color: '#EF476F', type: 'cross-vertical', delay: '2.0s' },
  { id: 16, top: '72%', left: '57%', color: '#FFD166', type: 'cross-horizontal', delay: '0.2s' },
  { id: 17, top: '75%', left: '91%', color: '#06D6A0', type: 'dot-to-cross', delay: '1.7s' },

  // Franja 6 (83.3% - 100%)
  { id: 18, top: '85%', left: '8%', color: '#FFD166', type: 'dot-to-cross', delay: '1.2s' },
  { id: 19, top: '86%', left: '20%', color: '#EF476F', type: 'dot-to-cross', delay: '2.5s' },
  { id: 20, top: '91%', left: '27%', color: '#FFD166', type: 'cross-vertical', delay: '0.6s' },
  { id: 21, top: '89%', left: '47%', color: '#118AB2', type: 'dot-to-cross', delay: '1.6s' },
  { id: 22, top: '87%', left: '67%', color: '#FFD166', type: 'dot-to-cross', delay: '0.1s' },
  { id: 23, top: '86%', left: '82%', color: '#EF476F', type: 'dot-to-cross', delay: '2.3s' },
  { id: 24, top: '89%', left: '91%', color: '#FFD166', type: 'cross-horizontal', delay: '1.3s' },
];

export default function PixelSkyBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 6 Franjas Horizontales con degradado duro */}
      <div className="absolute inset-0 flex flex-col h-full w-full">
        {/* Franja 1 (Más oscura: #073B4C) */}
        <div className="flex-1 bg-[#073B4C]" />
        {/* Franja 2 */}
        <div className="flex-1 bg-[#094559]" />
        {/* Franja 3 */}
        <div className="flex-1 bg-[#0D5167]" />
        {/* Franja 4 */}
        <div className="flex-1 bg-[#105E76]" />
        {/* Franja 5 */}
        <div className="flex-1 bg-[#146A85]" />
        {/* Franja 6 (Más clara / horizonte) */}
        <div className="flex-1 bg-[#187795]" />
      </div>

      {/* Capa de Estrellas Pixel Art */}
      <div className="absolute inset-0">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              top: star.top,
              left: star.left,
            }}
          >
            <PixelStarRenderer star={star} />
          </div>
        ))}
      </div>

      {/* Estilos de animación pixelada exacta: 1.5s normal -> 1.5s crecida */}
      <style jsx global>{`
        @keyframes pixelStarNormalState {
          0%, 49.99% {
            opacity: 1;
            visibility: visible;
          }
          50%, 100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes pixelStarGrownState {
          0%, 49.99% {
            opacity: 0;
            visibility: hidden;
          }
          50%, 100% {
            opacity: 1;
            visibility: visible;
          }
        }

        .anim-star-normal {
          animation: pixelStarNormalState 3s steps(1, end) infinite;
        }

        .anim-star-grown {
          animation: pixelStarGrownState 3s steps(1, end) infinite;
        }
      `}</style>
    </div>
  );
}

// Renderizador pixel-perfect de cada tipo de estrella en SVG con crispEdges
function PixelStarRenderer({ star }: { star: StarConfig }) {
  const { color, type, delay } = star;
  const p = 6; // Tamaño duplicado de cada pixel virtual en pantalla (6px)

  if (type === 'dot-to-cross') {
    // Tipo: Punto que se convierte en cruz pequeña al crecer
    return (
      <div className="relative" style={{ width: p * 3, height: p * 3 }}>
        {/* Estado Normal: 1 Solo Pixel centrado */}
        <svg
          width={p * 3}
          height={p * 3}
          viewBox={`0 0 ${p * 3} ${p * 3}`}
          className="absolute inset-0 anim-star-normal"
          style={{ animationDelay: delay, shapeRendering: 'crispEdges' }}
        >
          <rect x={p} y={p} width={p} height={p} fill={color} />
        </svg>

        {/* Estado Crecido: Se convierte en estrella cruz de 3x3 */}
        <svg
          width={p * 3}
          height={p * 3}
          viewBox={`0 0 ${p * 3} ${p * 3}`}
          className="absolute inset-0 anim-star-grown"
          style={{ animationDelay: delay, shapeRendering: 'crispEdges' }}
        >
          {/* Centro */}
          <rect x={p} y={p} width={p} height={p} fill={color} />
          {/* Brazos */}
          <rect x={p} y={0} width={p} height={p} fill={color} />
          <rect x={p} y={p * 2} width={p} height={p} fill={color} />
          <rect x={0} y={p} width={p} height={p} fill={color} />
          <rect x={p * 2} y={p} width={p} height={p} fill={color} />
        </svg>
      </div>
    );
  }

  if (type === 'cross-vertical') {
    // Tipo: Cruz que destella creciendo 1 pixel verticalmente
    return (
      <div className="relative" style={{ width: p * 3, height: p * 5 }}>
        {/* Estado Normal: Cruz simétrica centrada */}
        <svg
          width={p * 3}
          height={p * 5}
          viewBox={`0 0 ${p * 3} ${p * 5}`}
          className="absolute inset-0 anim-star-normal"
          style={{ animationDelay: delay, shapeRendering: 'crispEdges' }}
        >
          {/* Centro en y=p*2 */}
          <rect x={p} y={p * 2} width={p} height={p} fill={color} />
          {/* Brazos simétricos de 1 pixel */}
          <rect x={p} y={p} width={p} height={p} fill={color} />
          <rect x={p} y={p * 3} width={p} height={p} fill={color} />
          <rect x={0} y={p * 2} width={p} height={p} fill={color} />
          <rect x={p * 2} y={p * 2} width={p} height={p} fill={color} />
        </svg>

        {/* Estado Crecido: Destello vertical (+1 pixel en extremos superior e inferior) */}
        <svg
          width={p * 3}
          height={p * 5}
          viewBox={`0 0 ${p * 3} ${p * 5}`}
          className="absolute inset-0 anim-star-grown"
          style={{ animationDelay: delay, shapeRendering: 'crispEdges' }}
        >
          {/* Centro */}
          <rect x={p} y={p * 2} width={p} height={p} fill={color} />
          {/* Brazos laterales */}
          <rect x={0} y={p * 2} width={p} height={p} fill={color} />
          <rect x={p * 2} y={p * 2} width={p} height={p} fill={color} />
          {/* Destello vertical extendido (crece 1 pixel extra arriba y abajo) */}
          <rect x={p} y={0} width={p} height={p} fill={color} />
          <rect x={p} y={p} width={p} height={p} fill={color} />
          <rect x={p} y={p * 3} width={p} height={p} fill={color} />
          <rect x={p} y={p * 4} width={p} height={p} fill={color} />
        </svg>
      </div>
    );
  }

  // Tipo: cross-horizontal (Cruz que destella creciendo 1 pixel horizontalmente)
  return (
    <div className="relative" style={{ width: p * 5, height: p * 3 }}>
      {/* Estado Normal: Cruz simétrica */}
      <svg
        width={p * 5}
        height={p * 3}
        viewBox={`0 0 ${p * 5} ${p * 3}`}
        className="absolute inset-0 anim-star-normal"
        style={{ animationDelay: delay, shapeRendering: 'crispEdges' }}
      >
        {/* Centro en x=p*2 */}
        <rect x={p * 2} y={p} width={p} height={p} fill={color} />
        {/* Brazos simétricos */}
        <rect x={p * 2} y={0} width={p} height={p} fill={color} />
        <rect x={p * 2} y={p * 2} width={p} height={p} fill={color} />
        <rect x={p} y={p} width={p} height={p} fill={color} />
        <rect x={p * 3} y={p} width={p} height={p} fill={color} />
      </svg>

      {/* Estado Crecido: Destello horizontal (+1 pixel a la izquierda y derecha) */}
      <svg
        width={p * 5}
        height={p * 3}
        viewBox={`0 0 ${p * 5} ${p * 3}`}
        className="absolute inset-0 anim-star-grown"
        style={{ animationDelay: delay, shapeRendering: 'crispEdges' }}
      >
        {/* Centro */}
        <rect x={p * 2} y={p} width={p} height={p} fill={color} />
        {/* Brazos verticales */}
        <rect x={p * 2} y={0} width={p} height={p} fill={color} />
        <rect x={p * 2} y={p * 2} width={p} height={p} fill={color} />
        {/* Destello horizontal extendido */}
        <rect x={0} y={p} width={p} height={p} fill={color} />
        <rect x={p} y={p} width={p} height={p} fill={color} />
        <rect x={p * 3} y={p} width={p} height={p} fill={color} />
        <rect x={p * 4} y={p} width={p} height={p} fill={color} />
      </svg>
    </div>
  );
}
