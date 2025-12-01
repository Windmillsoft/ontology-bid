import React from 'react';

type BadgeVariant = 'default' | 'inverse' | 'success' | 'warning' | 'error' | 'lightest';

interface SldsBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function SldsBadge({ children, variant = 'default', className = '' }: SldsBadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-gray-200 text-gray-800',
    inverse: 'bg-gray-800 text-white',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    lightest: 'bg-gray-100 text-gray-700 border border-gray-300'
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-normal ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
