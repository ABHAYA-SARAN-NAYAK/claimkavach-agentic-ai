import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border bg-surface/50 my-4">
      <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center mb-4">
        {icon || <ShieldAlert className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-content mb-1">{title}</h3>
      <p className="text-sm text-content-2 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
