import React from 'react';

interface FeatureIconProps {
  type: 'upload' | 'swap' | 'impact';
  className?: string;
  size?: number;
}

export const FeatureIcon: React.FC<FeatureIconProps> = ({ 
  type, 
  className = '',
  size = 56 
}) => {
  const baseClasses = `inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#4a8a62] to-[#d98960] shadow-lg ${className}`;
  
  if (type === 'upload') {
    return (
      <div className={baseClasses} style={{ width: size, height: size }}>
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L8 6H11V12H13V6H16L12 2Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8H18V20H6V8H4Z"
            fill="white"
            fillOpacity="0.9"
          />
          <circle cx="12" cy="16" r="1.5" fill="white" fillOpacity="0.7" />
        </svg>
      </div>
    );
  }
  
  if (type === 'swap') {
    return (
      <div className={baseClasses} style={{ width: size, height: size }}>
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L3 12L6 15V13H11V11H6V9Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M18 9V11H13V13H18V15L21 12L18 9Z"
            fill="white"
            fillOpacity="0.9"
          />
          <circle cx="7" cy="12" r="1.5" fill="white" fillOpacity="0.6" />
          <circle cx="17" cy="12" r="1.5" fill="white" fillOpacity="0.6" />
        </svg>
      </div>
    );
  }
  
  if (type === 'impact') {
    return (
      <div className={baseClasses} style={{ width: size, height: size }}>
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M12 6L10.5 10.5L6 12L10.5 13.5L12 18L13.5 13.5L18 12L13.5 10.5L12 6Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>
    );
  }
  
  return null;
};

export default FeatureIcon;
