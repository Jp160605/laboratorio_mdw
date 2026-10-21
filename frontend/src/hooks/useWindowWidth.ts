'use client';

import { useState, useEffect } from 'react';

/**
 * Hook reactivo que calcula el ancho actual de la pantalla en tiempo real (window.innerWidth)
 * para definir y adaptar dinámicamente el tamaño de cards, ventanas y tablas.
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
