import React from 'react';

const BrandMark = ({ className = 'w-9 h-9', color = 'currentColor' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 24A42 42 0 1 0 82 24"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path d="M13 24H26L19 14H17Z" fill={color} />
      <path d="M87 24H74L81 14H83Z" fill={color} />
      <path
        d="M26 70L40 36L50 58L60 36L74 62H88"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrandMark;

