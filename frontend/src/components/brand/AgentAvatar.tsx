import React from 'react';
import { clsx } from 'clsx';
import { BookOpen, Scale, Send, ShieldCheck, Cpu } from 'lucide-react';
import { AgentName } from '../../lib/types';
import { getAgentColor } from '../../lib/format';

interface AgentAvatarProps {
  agent: AgentName | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const normAgent = (agent || 'system').toLowerCase();

  const getIcon = () => {
    switch (normAgent) {
      case 'lekha':
        return <BookOpen className="w-full h-full p-1" />;
      case 'nyaya':
        return <Scale className="w-full h-full p-1" />;
      case 'doot':
        return <Send className="w-full h-full p-1" />;
      case 'rakshak':
        return <ShieldCheck className="w-full h-full p-1" />;
      default:
        return <Cpu className="w-full h-full p-1" />;
    }
  };

  const getTitle = () => {
    switch (normAgent) {
      case 'lekha':
        return 'Lekha (Reader)';
      case 'nyaya':
        return 'Nyaya (Judge)';
      case 'doot':
        return 'Doot (Escalator)';
      case 'rakshak':
        return 'Rakshak (Guardian)';
      default:
        return 'System';
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const color = getAgentColor(normAgent);

  return (
    <div className={clsx('inline-flex items-center gap-2 select-none', className)}>
      <div
        className={clsx(
          'rounded-full flex items-center justify-center text-white shadow-xs font-semibold flex-shrink-0 transition-transform hover:scale-105',
          sizeClasses[size]
        )}
        style={{ backgroundColor: color }}
        title={getTitle()}
      >
        {getIcon()}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-content capitalize">
          {normAgent}
        </span>
      )}
    </div>
  );
};
