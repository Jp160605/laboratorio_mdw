import React from 'react';

export type PixelBadgeVariant =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'pink'
  | 'dark'
  | 'cream';

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: PixelBadgeVariant;
  withDot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export default function PixelBadge({
  children,
  variant = 'yellow',
  withDot = false,
  className = '',
  size = 'md',
}: PixelBadgeProps) {
  const isCream = variant === 'cream';

  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return 'bg-neo-blue text-white border-neo-dark';
      case 'green':
        return 'bg-neo-green text-neo-dark border-neo-dark';
      case 'pink':
        return 'bg-neo-pink text-white border-neo-dark';
      case 'dark':
        return 'bg-neo-dark text-white border-neo-dark';
      case 'cream':
        return 'bg-transparent text-current border-0';
      case 'yellow':
      default:
        return 'bg-neo-yellow text-neo-dark border-neo-dark';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'blue':
        return 'bg-white';
      case 'green':
        return 'bg-neo-dark';
      case 'pink':
        return 'bg-white';
      case 'dark':
        return 'bg-neo-green';
      default:
        return 'bg-neo-dark';
    }
  };

  const sizeStyles = isCream
    ? 'text-xs px-1 py-0.5'
    : size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5 border'
    : 'text-xs px-2.5 py-1 border-2';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-pixel font-bold uppercase tracking-wider ${getVariantStyles()} ${sizeStyles} ${className}`}
    >
      {withDot && (
        <span
          className={`inline-block h-2 w-2 rounded-full border border-neo-dark ${getDotColor()}`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
