import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={32}
      height={32}
      {...props}
    >
      <defs>
        <linearGradient id="logo-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
          <stop offset="100%" stopColor="hsl(240, 10%, 20%)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#logo-bg-gradient)" stroke="#FFF" strokeWidth="2" />
      <g fill="#FFFFFF" transform="translate(25, 25) scale(0.5)">
        {/* Stylized 'F' */}
        <path d="M30,10 H70 V25 H45 V90 H30 V10 Z" />
        {/* Stylized 'A' */}
        <path d="M60,90 L75,90 L90,40 H75 L70,55 L65,40 H50 L60,90 Z" transform="translate(5, 0)" />
        <path d="M55,65 H80" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function CreditScore(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
