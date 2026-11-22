import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while retrieving data. Please try again.',
  onRetry,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-card border border-danger/20 bg-danger-bg/20 my-4">
      <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-danger mb-1">{title}</h3>
      <p className="text-sm text-carbon-2 max-w-md mb-6">{message}</p>
      {onAction && actionLabel ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : onRetry ? (
        <Button variant="outline" onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
};
