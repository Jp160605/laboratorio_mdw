import React from 'react';

export type PixelButtonVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'ghost';

export type PixelButtonSize = 'sm' | 'md' | 'lg';

interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PixelButtonVariant;
  size?: PixelButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PixelButton({
  variant = 'warning',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}: PixelButtonProps) {
  const isGhost = variant === 'ghost';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-neo-blue text-white border-neo-dark hover:bg-[#0e7497]';
      case 'success':
        return 'bg-neo-green text-neo-dark border-neo-dark hover:bg-[#05b88a]';
      case 'warning':
        return 'bg-neo-yellow text-neo-dark border-neo-dark hover:bg-[#f3be48]';
      case 'danger':
        return 'bg-neo-pink text-white border-neo-dark hover:bg-[#d8355c]';
      case 'dark':
        return 'bg-neo-dark text-neo-bg border-neo-dark hover:bg-[#0c4e64]';
      case 'ghost':
        // Blanco / FFFAEB -> transparente y sin bordes
        return 'bg-transparent text-current border-0 hover:opacity-80';
      default:
        return 'bg-neo-yellow text-neo-dark border-neo-dark';
    }
  };

  const getSizeStyles = () => {
    const borderClass = isGhost ? 'border-0' : size === 'sm' ? 'border-2' : 'border-3';
    switch (size) {
      case 'sm':
        return `px-2.5 py-1 text-xs ${borderClass}`;
      case 'lg':
        return `px-6 py-3 text-base ${borderClass}`;
      case 'md':
      default:
        return `px-4 py-2 text-sm ${borderClass}`;
    }
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-pixel font-bold uppercase tracking-wider transition-colors select-none ${getVariantStyles()} ${getSizeStyles()} ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
