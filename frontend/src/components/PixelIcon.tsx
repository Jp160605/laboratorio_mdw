import React from 'react';

export type PixelIconName =
  | 'calendar'
  | 'clock'
  | 'monitor'
  | 'user'
  | 'zap'
  | 'check'
  | 'close'
  | 'arrow-tr'
  | 'plus'
  | 'minus'
  | 'sparkles'
  | 'shield'
  | 'lock'
  | 'alert'
  | 'refresh'
  | 'terminal'
  | 'trash'
  | 'filter'
  | 'play'
  | 'heart'
  | 'heart-outline'
  | 'trophy'
  | 'crosshair'
  | 'gamepad'
  | 'chevron-down'
  | 'arrow-down';

interface PixelIconProps {
  name: PixelIconName;
  size?: number;
  className?: string;
  color?: string;
}

export default function PixelIcon({
  name,
  size = 20,
  className = '',
  color = 'currentColor',
}: PixelIconProps) {
  // Renderizamos cada glifo en una cuadrícula virtual de 16x16 o 24x24 con píxeles nítidos
  const renderGlyph = () => {
    switch (name) {
      case 'calendar':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 2h2v2h10V2h2v2h2v18H3V4h2V2zm14 6H5v12h14V8zm-11 3h3v3H8v-3zm5 0h3v3h-3v-3zm-5 5h3v3H8v-3zm5 0h3v3h-3v-3z"
            fill={color}
          />
        );
      case 'clock':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 2h8v2h4v4h2v8h-2v4h-4v2H8v-2H4v-4H2V8h2V4h4V2zm8 4H8v2H6v8h2v2h8v-2h2V8h-2V6zm-5 4h2v4h4v2h-6v-6z"
            fill={color}
          />
        );
      case 'monitor':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 3h18v12H3V3zm2 2v8h14V5H5zm4 12h6v2h4v2H5v-2h4v-2z"
            fill={color}
          />
        );
      case 'user':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 2h6v2h2v4h-2v2H9v-2H7V4h2V2zm0 4h6V4H9v2zm-5 8h16v2h2v6H2v-6h2v-2zm2 6h12v-4H6v4z"
            fill={color}
          />
        );
      case 'zap':
        return (
          <path
            d="M13 2h-4v6H5v2h4v2H7v2h2v2h2v2h2v-6h4v-2h-4v-2h2V6h-2V4h2V2z"
            fill={color}
          />
        );
      case 'check':
        return (
          <path
            d="M19 5l2 2-10 10-5-5 2-2 3 3 8-8z"
            fill={color}
          />
        );
      case 'close':
        return (
          <path
            d="M5 5h3v3h2v2h4V8h2V5h3v3h-3v2h-2v4h2v2h3v3h-3v-3h-2v-2h-4v2H8v3H5v-3h3v-2h2v-4H8V8H5V5z"
            fill={color}
          />
        );
      case 'arrow-tr':
        return (
          <path
            d="M6 4h14v14h-4V11.66L7.41 20.25 4.58 17.42 13.17 8.83H6V4z"
            fill={color}
          />
        );
      case 'plus':
        return (
          <path
            d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z"
            fill={color}
          />
        );
      case 'minus':
        return (
          <path
            d="M4 11h16v2H4z"
            fill={color}
          />
        );
      case 'sparkles':
        return (
          <path
            d="M11 2h2v4h-2V2zm0 16h2v4h-2v-4zM2 11h4v2H2v-2zm16 0h4v2h-4v-2zm-9-5h2v2H9V6zm6 0h2v2h-2V6zm-6 10h2v2H9v-2zm6 0h2v2h-2v-2z"
            fill={color}
          />
        );
      case 'shield':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 3h16v8h-2v4h-2v4h-2v2h-4v-2H8v-4H6v-4H4V3zm4 2v6h2v4h2v2h2v-2h2v-4h2V5H8z"
            fill={color}
          />
        );
      case 'lock':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 4h8v2h2v4h2v12H4V10h2V6h2V4zm2 2v4h4V6h-4zm-4 6v8h12v-8H6zm5 2h2v4h-2v-4z"
            fill={color}
          />
        );
      case 'alert':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11 2h2v4h-2V2zm-2 6h6v2h-6V8zm0 4h6v2h-6v-2zm1 6h4v4h-4v-4zM3 20h18v2H3v-2z"
            fill={color}
          />
        );
      case 'refresh':
        return (
          <path
            d="M18 4h4v4h-2V6h-3.5A7.5 7.5 0 004 12H2A9.5 9.5 0 0116.5 4H18zM6 20H2v-4h2v2h3.5A7.5 7.5 0 0020 12h2a9.5 9.5 0 01-14.5 8H6z"
            fill={color}
          />
        );
      case 'terminal':
        return (
          <path
            d="M3 4h18v16H3V4zm2 2v12h14V6H5zm3 3l3 3-3 3-1.4-1.4L8.2 12l-1.6-1.6L8 9zm5 5h4v2h-4v-2z"
            fill={color}
          />
        );
      case 'trash':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 3h12v2h4v2h-2v14H4V7H2V5h4V3zm2 4v12h8V7H8zm2 2h2v8h-2V9zm4 0h2v8h-2V9z"
            fill={color}
          />
        );
      case 'filter':
        return (
          <path
            d="M3 4h18v2l-7 7v7h-4v-7L3 6V4zm3 2l5 5v5h2v-5l5-5H6z"
            fill={color}
          />
        );
      case 'play':
        return (
          <path
            d="M4 2h3v20H4V2zm3 2h3v16H7V4zm3 2h3v12h-3V6zm3 2h3v8h-3V8zm3 2h3v4h-3v-4zm3 1h3v2h-3v-2z"
            fill={color}
          />
        );
      case 'heart':
        return (
          <path
            d="M4 4h6v2H4V4zm10 0h6v2h-6V4zM2 6h20v6H2V6zm2 6h16v2H4v-2zm2 2h12v2H6v-2zm2 2h8v2H8v-2zm2 2h4v2h-4v-2zm1 2h2v2h-2v-2z"
            fill={color}
          />
        );
      case 'heart-outline':
        return (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 4h6v2H4V4zm10 0h6v2h-6V4zM2 6h2v6H2V6zm20 6h-2V6h2v6zm-2 2h-2v-2h2v2zm-2 2h-2v-2h2v2zm-2 2h-2v-2h2v2zm-2 2h-2v-2h2v2zm-2 2h-2v-2h2v2zm-2-2h-2v-2h2v2zm-2-2H8v-2h2v2zm-2-2H6v-2h2v2zm-2-2H4v-2h2v2zm6-8h4v2h-4V6z"
            fill={color}
          />
        );
      case 'trophy':
        return (
          <path
            d="M5 3h14v2h2v5h-2v2h-2v2h-2v3h3v2H8v-2h3v-3H9v-2H7v-2H5V5H3V3h2zm2 2v5h2V5H7zm10 0v5h-2V5h2zM3 5v3h2V5H3zm16 0v3h2V5h-2z"
            fill={color}
          />
        );
      case 'crosshair':
        return (
          <path
            d="M11 2h2v4h-2V2zm0 16h2v4h-2v-4zM2 11h4v2H2v-2zm16 0h4v2h-4v-2zm-5-3h-2v2h2v-2zm-4-2h6v2h-6V6zm0 8h6v2h-6v-2zm-2-6h2v6H6v-6zm10 0h2v6h-2v-6z"
            fill={color}
          />
        );
      case 'gamepad':
        return (
          <path
            d="M6 7h12v2h3v7h-2v2h-3v-2h-2v-1H10v1H8v2H5v-2H3V9h3V7zm1 3v3h2v-3H7zm10 0v3h2v-3h-2z"
            fill={color}
          />
        );
      case 'chevron-down':
      case 'arrow-down':
        return (
          <path
            d="M5 8h2v2h2v2h2v2h2v-2h2v-2h2V8h2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5V8z"
            fill={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
      aria-hidden="true"
    >
      {renderGlyph()}
    </svg>
  );
}
