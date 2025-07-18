import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={32}
      height={32}
      {...props}
    >
      <g fill="currentColor">
        <path d="M 40 40 L 40 216 L 90 216 L 90 156 L 140 156 L 140 216 L 190 216 L 190 40 L 140 40 L 140 106 L 90 106 L 90 40 Z M 150 116 L 180 116 L 180 50 L 150 50 Z M 50 50 L 80 50 L 80 96 L 50 96 Z M 50 166 L 80 166 L 80 206 L 50 206 Z" />
      </g>
    </svg>
  );
}
