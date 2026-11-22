import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-surface rounded-xl border border-border shadow-sm p-5 transition-all duration-200',
        hover && 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
