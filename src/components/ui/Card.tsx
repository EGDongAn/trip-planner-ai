import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  selected = false,
  hoverable = true
}) => {
  const baseStyles = 'bg-slate-800 rounded-xl p-6 transition-all duration-200';
  const hoverStyles = hoverable ? 'hover:bg-slate-750 hover:shadow-lg hover:shadow-blue-500/10' : '';
  const selectedStyles = selected
    ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
    : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
