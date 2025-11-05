import React from 'react';

interface ClothingPlaceholderProps {
  type?: 'jacket' | 'dress' | 'shoes' | 'bag' | 'sweater' | 'jeans' | 'default';
  className?: string;
}

export const ClothingPlaceholder: React.FC<ClothingPlaceholderProps> = ({ 
  type = 'default',
  className = '' 
}) => {
  const baseClasses = `w-full h-full flex items-center justify-center bg-gradient-to-br ${className}`;
  
  const getGradient = () => {
    switch (type) {
      case 'jacket':
        return 'from-[#7d9e8a] via-[#a8c5b5] to-[#c8dfd0]'; // Soft sage greens
      case 'dress':
        return 'from-[#d9a88a] via-[#e8c4ad] to-[#f5e0d3]'; // Warm terracotta/sand
      case 'shoes':
        return 'from-[#a89b8e] via-[#c4b9ae] to-[#e0d8ce]'; // Natural stone/taupe
      case 'bag':
        return 'from-[#c9a26f] via-[#ddb88a] to-[#f0d4af]'; // Warm tan/leather
      case 'sweater':
        return 'from-[#b39d7c] via-[#ccb99a] to-[#e5d8c2]'; // Oatmeal/beige
      case 'jeans':
        return 'from-[#8b9fa3] via-[#adbfc2] to-[#d0dde0]'; // Soft denim/sky
      default:
        return 'from-[#d6cbb8] via-[#e8e0d3] to-[#f5f0e8]'; // Natural linen
    }
  };
  
  const getIcon = () => {
    const iconClasses = "w-24 h-24 opacity-20";
    
    switch (type) {
      case 'jacket':
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zM12 2v20M4 7l8 5M20 7l-8 5" />
          </svg>
        );
      case 'dress':
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 6l2 12H6L8 6M8 6L10 2h4l2 4" />
          </svg>
        );
      case 'shoes':
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8H3v6zM5 4h14l2 4H3l2-4z" />
          </svg>
        );
      case 'bag':
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6zM3 6h18M16 10a4 4 0 11-8 0" />
          </svg>
        );
      case 'sweater':
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6l-4-4h-8L4 6v12l4 4h8l4-4V6zM8 2L4 6M16 2l4 4" />
          </svg>
        );
      case 'jeans':
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2h8v20H8V2zM16 10H8" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 6v12m-3-9h6m-6 6h6" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`${baseClasses} ${getGradient()}`}>
      {getIcon()}
    </div>
  );
};

export default ClothingPlaceholder;
