import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  const orientationClasses = {
    horizontal: 'h-px w-full',
    vertical: 'w-px h-full',
  };
  
  return (
    <div 
      className={`bg-gray-200 ${orientationClasses[orientation]} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
