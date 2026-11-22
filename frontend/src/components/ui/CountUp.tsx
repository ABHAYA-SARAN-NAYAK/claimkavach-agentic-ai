import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../lib/format';

interface CountUpProps {
  end: number;
  duration?: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 800,
  isCurrency = false,
  prefix = '',
  suffix = '',
  className,
}) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(startValue + (end - startValue) * easeVal);
      setVal(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  if (isCurrency) {
    return <span className={className}>{formatCurrency(val)}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      {val.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};
