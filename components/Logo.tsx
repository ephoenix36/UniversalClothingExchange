import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'wordmark';
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'full',
  size = 40 
}) => {
  const iconSize = variant === 'icon' ? size : size * 0.8;
  
  // Icon only - Circular fashion/swap symbol
  if (variant === 'icon') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a8a62" />
            <stop offset="100%" stopColor="#d98960" />
          </linearGradient>
        </defs>
        
        {/* Outer circle */}
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.1"/>
        
        {/* Circular arrows representing circular fashion */}
        <path
          d="M 70 50 A 20 20 0 1 1 50 30 L 50 35 L 60 30 L 50 25 L 50 30 Z"
          fill="url(#logoGradient)"
          transform="rotate(0 50 50)"
        />
        <path
          d="M 30 50 A 20 20 0 1 1 50 70 L 50 65 L 40 70 L 50 75 L 50 70 Z"
          fill="url(#logoGradient)"
          transform="rotate(180 50 50)"
        />
        
        {/* Hanger symbol in center */}
        <path
          d="M 50 40 L 45 45 L 40 45 L 38 47 L 38 52 L 62 52 L 62 47 L 60 45 L 55 45 L 50 40 Z"
          fill="url(#logoGradient)"
        />
        <circle cx="50" cy="36" r="3" fill="url(#logoGradient)"/>
      </svg>
    );
  }
  
  // Wordmark only
  if (variant === 'wordmark') {
    return (
      <svg
        width={size * 4}
        height={size}
        viewBox="0 0 400 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a8a62" />
            <stop offset="100%" stopColor="#d98960" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="70"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="48"
          fontWeight="700"
          fill="url(#textGradient)"
        >
          UCE
        </text>
      </svg>
    );
  }
  
  // Full logo with icon and text
  return (
    <svg
      width={size * 5}
      height={size}
      viewBox="0 0 500 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      >
        <defs>
          <linearGradient id="fullLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a8a62" />
            <stop offset="100%" stopColor="#d98960" />
          </linearGradient>
        </defs>      {/* Icon */}
      <circle cx="50" cy="50" r="45" fill="url(#fullLogoGradient)" opacity="0.1"/>
      <path
        d="M 70 50 A 20 20 0 1 1 50 30 L 50 35 L 60 30 L 50 25 L 50 30 Z"
        fill="url(#fullLogoGradient)"
      />
      <path
        d="M 30 50 A 20 20 0 1 1 50 70 L 50 65 L 40 70 L 50 75 L 50 70 Z"
        fill="url(#fullLogoGradient)"
        transform="rotate(180 50 50)"
      />
      <path
        d="M 50 40 L 45 45 L 40 45 L 38 47 L 38 52 L 62 52 L 62 47 L 60 45 L 55 45 L 50 40 Z"
        fill="url(#fullLogoGradient)"
      />
      <circle cx="50" cy="36" r="3" fill="url(#fullLogoGradient)"/>
      
      {/* Text */}
      <text
        x="120"
        y="60"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="currentColor"
      >
        Universal Clothing Exchange
      </text>
    </svg>
  );
};

export default Logo;
