import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A45B4" />
                <stop offset="100%" stopColor="#4A65D4" />
            </linearGradient>
            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E8A7A" />
                <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
        </defs>

        {/* Top-left rounded shape */}
        <path d="M22,35 C15,35 15,25 22,25 L38,25 C45,25 45,35 38,35 Z" fill="url(#blue-gradient)" />

        {/* Bottom-right rounded shape */}
        <path d="M78,65 C85,65 85,75 78,75 L62,75 C55,75 55,65 62,65 Z" fill="url(#green-gradient)" />

        {/* Middle lines */}
        <path d="M35,42 C50,42 50,58 65,58" stroke="url(#blue-gradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M42,50 C57,50 57,66 72,66" stroke="url(#green-gradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        {/* Top small gold circle */}
        <circle cx="28" cy="18" r="5" fill="url(#gold-gradient)" />

        {/* Middle big gold circle */}
        <circle cx="75" cy="55" r="6" fill="url(#gold-gradient)" />
        
        {/* Bottom-left small blue circle */}
        <circle cx="25" cy="58" r="5" fill="#3A55C4" />

        {/* Bottom-right small green circle */}
        <circle cx="60" cy="85" r="4" fill="#2AAE8D" />
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
