import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-carbon-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-carbon-3 pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full rounded-btn border bg-surface py-2 text-xs sm:text-sm text-carbon transition-colors placeholder:text-carbon-3',
              icon ? 'pl-9 pr-3' : 'px-3',
              'focus:outline-none focus:ring-2 focus:ring-evergreen-700/25 focus:border-evergreen-700',
              error ? 'border-danger' : 'border-border hover:border-border-strong',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-carbon-3">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
