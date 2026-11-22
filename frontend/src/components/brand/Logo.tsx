import React from 'react';
import { clsx } from 'clsx';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 36,
  showText = true,
  className,
}) => {
  return (
    <div className={clsx('inline-flex items-center gap-2.5 select-none font-sans', className)}>
      {/* Brand Shield Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-xs"
      >
        <defs>
          <linearGradient id="shieldNavyGrad" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#183528" />
            <stop offset="1" stopColor="#12271E" />
          </linearGradient>
          <linearGradient id="arcSwoopGrad" x1="10" y1="12" x2="54" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#C46A45" />
          </linearGradient>
        </defs>

        {/* Navy/Evergreen Shield Body */}
        <path
          d="M32 4.5L53.5 12.5V31C53.5 43.5 44.2 54.8 32 59C19.8 54.8 10.5 43.5 10.5 31V12.5L32 4.5Z"
          fill="url(#shieldNavyGrad)"
        />

        {/* Golden-Orange Surrounding Arc */}
        <path
          d="M10.5 24C12 13 25 7 43 10C53 12 57 17 55 23C52.5 18 45 14 35 13.5C20.5 12.5 12 18 10.5 24Z"
          fill="url(#arcSwoopGrad)"
        />

        {/* White Document Card with folded corner */}
        <path
          d="M21 17H38L45 23.5V45.5C45 46.9 43.9 48 42.5 48H21C19.6 48 18.5 46.9 18.5 45.5V19.5C18.5 18.1 19.6 17 21 17Z"
          fill="#FFFFFF"
        />
        <path d="M38 17V23.5H45" fill="#E5E7EB" />
        <path d="M23 23H33M23 28H33" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

        {/* Green Approval Checkmark */}
        <path
          d="M26 34.5L30.5 39L41 28.5"
          stroke="#2F8F5B"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Supporting Family / Cradle Arc in Clay */}
        <path
          d="M18 43.5C24.5 49 39.5 49 46 43.5C40 46.8 24 46.8 18 43.5Z"
          fill="#C46A45"
        />
      </svg>

      {/* Brand Wordmark: "Claim" in Carbon + "Kavach" in Clay */}
      {showText && (
        <span className="font-bold tracking-tight text-[1.35rem] leading-none inline-flex items-baseline">
          <span className="text-carbon relative">
            Claim
            {/* Signature clay accent leaf over the 'i' dot */}
            <span
              className="absolute -top-1.5 left-[23px] w-1.5 h-2 bg-clay-500 rounded-tr-full rounded-bl-full transform rotate-12"
              aria-hidden="true"
            />
          </span>
          <span className="text-clay-500 ml-0.5 font-bold">Kavach</span>
        </span>
      )}
    </div>
  );
};
