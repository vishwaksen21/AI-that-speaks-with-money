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
        <linearGradient id="logo-blue-gradient" x1="0.22" y1="0.16" x2="0.77" y2="0.83">
            <stop offset="0%" stopColor="#4A47C2" />
            <stop offset="100%" stopColor="#1E1C8A" />
        </linearGradient>
        <linearGradient id="logo-green-gradient" x1="0.22" y1="0.16" x2="0.77" y2="0.83">
            <stop offset="0%" stopColor="#3DB49E" />
            <stop offset="100%" stopColor="#1C8A67" />
        </linearGradient>
         <linearGradient id="logo-gold-gradient" x1="0.22" y1="0.16" x2="0.77" y2="0.83">
            <stop offset="0%" stopColor="#E6A23C" />
            <stop offset="100%" stopColor="#C47B1A" />
        </linearGradient>
      </defs>
      <g>
        <path fill="url(#logo-blue-gradient)" d="M49.61 45.06a3.43 3.43 0 0 1-4.71-1.3l-5.7-8.31a3.43 3.43 0 0 1 1.3-4.71l1-.69a3.43 3.43 0 0 1 4.71 1.3l5.7 8.31a3.43 3.43 0 0 1-1.3 4.71l-1 .69z" />
        <path fill="url(#logo-blue-gradient)" d="M37.9 31.81a3.43 3.43 0 0 1-4.71-1.3L27.49 22.2a3.43 3.43 0 0 1 1.3-4.71l1-.69a3.43 3.43 0 0 1 4.71 1.3l5.7 8.31a3.43 3.43 0 0 1-1.3 4.71l-1 .69z" />
        <path fill="url(#logo-green-gradient)" d="M60.1 66.19a3.43 3.43 0 0 1-4.71-1.3L49.69 56.6a3.43 3.43 0 0 1 1.3-4.71l1-.69a3.43 3.43 0 0 1 4.71 1.3l5.7 8.31a3.43 3.43 0 0 1-1.3 4.71l-1 .69z" />
        <path fill="url(#logo-green-gradient)" d="M71.41 77.8a3.43 3.43 0 0 1-4.71-1.3l-5.7-8.31a3.43 3.43 0 0 1 1.3-4.71l1-.69a3.43 3.43 0 0 1 4.71 1.3l5.7 8.31a3.43 3.43 0 0 1-1.3 4.71l-1 .69z" />
        <path fill="url(#logo-blue-gradient)" stroke="#FFF" strokeMiterlimit="10" strokeWidth=".5" d="M39.69 57.3a10.87 10.87 0 0 1-7.48-1.54 11.48 11.48 0 0 1-4-11.83 11.48 11.48 0 0 1 11.83-4l.7.12a10.87 10.87 0 0 1 7.48 1.54 11.48 11.48 0 0 1 4 11.83 11.48 11.48 0 0 1-11.83 4l-.7-.12z" />
        <path fill="url(#logo-green-gradient)" stroke="#FFF" strokeMiterlimit="10" strokeWidth=".5" d="M68.12 55.45a11.48 11.48 0 0 1-4 11.83 11.48 11.48 0 0 1-11.83 4l-.7-.12a10.87 10.87 0 0 1-7.48-1.54 11.48 11.48 0 0 1-4-11.83 11.48 11.48 0 0 1 11.83-4l.7.12a10.87 10.87 0 0 1 7.48 1.54z" />
        <circle cx="28.98" cy="62.1" r="5.62" fill="url(#logo-blue-gradient)" />
        <circle cx="70.31" cy="35.9" r="5.62" fill="url(#logo-green-gradient)" />
        <circle cx="36.88" cy="18.84" r="5.62" fill="url(#logo-gold-gradient)" />
        <circle cx="63.82" cy="80.16" r="5.62" fill="url(#logo-gold-gradient)" />
        <circle cx="79.91" cy="58.28" r="3.74" fill="url(#logo-green-gradient)" />
        <circle cx="18.98" cy="41.52" r="3.74" fill="url(#logo-blue-gradient)" />
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
