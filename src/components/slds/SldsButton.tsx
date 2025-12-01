import React from 'react';

type ButtonVariant = 'base' | 'neutral' | 'brand' | 'outline-brand' | 'destructive' | 'success';
type ButtonSize = 'small' | 'medium';

interface SldsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function SldsButton({ 
  variant = 'neutral', 
  size = 'medium',
  children, 
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}: SldsButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 border transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses: Record<ButtonVariant, string> = {
    base: 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
    neutral: 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
    brand: 'border-blue-700 bg-blue-600 text-white hover:bg-blue-700',
    'outline-brand': 'border-blue-600 bg-white text-blue-600 hover:bg-blue-50',
    destructive: 'border-red-700 bg-red-600 text-white hover:bg-red-700',
    success: 'border-green-700 bg-green-600 text-white hover:bg-green-700'
  };

  const sizeClasses: Record<ButtonSize, string> = {
    small: 'px-3 py-1 text-xs rounded',
    medium: 'px-4 py-2 text-sm rounded'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}
