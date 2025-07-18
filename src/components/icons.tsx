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
        <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F970A1" />
          <stop offset="100%" stopColor="#ED4D5C" />
        </linearGradient>
        <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A861F3" />
          <stop offset="100%" stopColor="#8346D7" />
        </linearGradient>
        <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6783FF" />
          <stop offset="100%" stopColor="#3E61F7" />
        </linearGradient>
      </defs>
      <g fill="currentColor">
        <path
          d="M26.6,12.5 C18.8,12.5 12.5,18.8 12.5,26.6 L12.5,61.9 C12.5,69.7 18.8,76 26.6,76 L31.25,76 L31.25,81.25 C31.25,84.6 35,85.6 36.9,83.1 L46.25,70.6 C46.8,70 47.5,69.7 48.25,69.7 L71.9,69.7 C79.7,69.7 86,63.4 86,55.6 L86,26.6 C86,18.8 79.7,12.5 71.9,12.5 L26.6,12.5 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
        />
        <rect x="30" y="45" width="10" height="20" rx="4" fill="url(#bar1)" />
        <rect x="45" y="35" width="10" height="30" rx="4" fill="url(#bar2)" />
        <rect x="60" y="25" width="10" height="40" rx="4" fill="url(#bar3)" />
      </g>
    </svg>
  );
}
