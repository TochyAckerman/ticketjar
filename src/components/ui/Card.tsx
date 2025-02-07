import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'normal' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'normal'
}) => {
  const paddingStyles = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  return (
    <div className={`bg-white shadow rounded-lg ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 