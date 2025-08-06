import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ScrollArea({ children, className = '', height = 'auto' }: ScrollAreaProps) {
  return (
    <div 
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      {children}
    </div>
  );
}
