import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-evergreen-700/25 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary:
      'bg-evergreen-700 text-white hover:bg-evergreen-800 shadow-xs border border-evergreen-800/20',
    accent:
      'bg-clay-600 text-white hover:bg-clay-700 shadow-xs border border-clay-700/20',
    secondary:
      'bg-surface-warm text-carbon hover:bg-border/40 border border-border text-carbon-2 hover:text-carbon shadow-xs',
    outline:
      'bg-surface text-carbon hover:bg-surface-warm border border-border shadow-xs',
    ghost:
      'bg-transparent text-carbon-2 hover:text-carbon hover:bg-surface-warm',
    danger:
      'bg-danger text-white hover:opacity-90 shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-2.5 gap-2.5 h-12',
    icon: 'p-2 w-9 h-9',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
