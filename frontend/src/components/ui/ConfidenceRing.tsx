import React, { useEffect, useState } from 'react';

interface ConfidenceRingProps {
  score: number; // 0 to 1 or 0 to 100
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  score,
  size = 48,
  strokeWidth = 4,
  showText = true,
}) => {
  const normalized = score > 1 ? score : Math.round(score * 100);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent(normalized);
    }, 100);
    return () => clearTimeout(timer);
  }, [normalized]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  const color =
    normalized >= 75 ? '#12B76A' : normalized >= 50 ? '#F79009' : '#F04438';

  return (
    <div
      className="relative inline-flex items-center justify-center font-mono"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-surface-3 opacity-40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showText && (
        <span className="absolute text-[11px] font-semibold tracking-tighter text-content">
          {current}%
        </span>
      )}
    </div>
  );
};
