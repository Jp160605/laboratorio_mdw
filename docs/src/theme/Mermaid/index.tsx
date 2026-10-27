import React, { useState, useEffect, useRef } from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { ErrorBoundaryErrorMessageFallback } from '@docusaurus/theme-common';
import {
  MermaidContainerClassName,
  useMermaidRenderResult,
} from '@docusaurus/theme-mermaid/client';
import styles from './styles.module.css';

interface MermaidProps {
  value: string;
}

function MermaidRenderResult({ renderResult }: { renderResult: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const div = ref.current;
    renderResult.bindFunctions?.(div);
  }, [renderResult]);

  // Manejo de la tecla Escape para cerrar modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpen = () => {
    setScale(1.25);
    setPosition({ x: 0, y: 0 });
    setIsOpen(true);
  };

  const handleZoomIn = () => setScale((s) => Math.min(Number((s + 0.25).toFixed(2)), 4.0));
  const handleZoomOut = () => setScale((s) => Math.max(Number((s - 0.25).toFixed(2)), 0.4));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((s) => Math.min(Number((s + 0.15).toFixed(2)), 4.0));
    } else {
      setScale((s) => Math.max(Number((s - 0.15).toFixed(2)), 0.4));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Solo arrastrar si es el botón izquierdo del ratón
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className={styles.wrapper}>
      {/* Botón flotante de lupa interactiva en la esquina superior derecha */}
      <button
        type="button"
        className={styles.zoomButton}
        onClick={handleOpen}
        title="Ampliar diagrama (Lupa)"
        aria-label="Ampliar diagrama"
      >
        <span className={styles.zoomIcon}>🔍</span>
        <span className={styles.zoomText}>Ampliar</span>
      </button>

      {/* Renderizado en la página */}
      <div
        ref={ref}
        className={`${MermaidContainerClassName} ${styles.container}`}
        dangerouslySetInnerHTML={{ __html: renderResult.svg }}
      />

      {/* Modal / Visor a pantalla completa con Lupa Interactiva */}
      {isOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con controles de zoom */}
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span>🔍 Visor de Diagrama</span>
                <span className={styles.zoomLevelBadge}>
                  {Math.round(scale * 100)}%
                </span>
              </div>
              <div className={styles.modalControls}>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={handleZoomIn}
                  title="Acercar (+)"
                >
                  ➕ Acercar
                </button>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={handleZoomOut}
                  title="Alejar (-)"
                >
                  ➖ Alejar
                </button>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={handleReset}
                  title="Restablecer (100%)"
                >
                  ↺ 100%
                </button>
                <button
                  type="button"
                  className={`${styles.controlBtn} ${styles.closeBtn}`}
                  onClick={() => setIsOpen(false)}
                  title="Cerrar (Esc)"
                >
                  ✕ Cerrar
                </button>
              </div>
            </div>

            {/* Banner de ayuda rápida para el presentador */}
            <div className={styles.modalHelp}>
              💡 <strong>Tip para la presentación:</strong> Usa la rueda del ratón para acercar o alejar, y arrastra con el cursor para mover el diagrama libremente.
            </div>

            {/* Viewport interactivo con soporte de paneo y zoom */}
            <div
              className={styles.viewport}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              <div
                className={styles.svgContainer}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                }}
                dangerouslySetInnerHTML={{ __html: renderResult.svg }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MermaidRenderer({ value }: MermaidProps) {
  const renderResult = useMermaidRenderResult({ text: value });
  if (renderResult === null) {
    return null;
  }
  return <MermaidRenderResult renderResult={renderResult} />;
}

export default function Mermaid(props: MermaidProps) {
  return (
    <ErrorBoundary
      fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}>
      <MermaidRenderer {...props} />
    </ErrorBoundary>
  );
}
