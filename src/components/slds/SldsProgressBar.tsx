import React from 'react';

interface SldsProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  size?: 'x-small' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'circular';
  className?: string;
}

export function SldsProgressBar({ 
  value, 
  max = 100, 
  label,
  size = 'medium',
  variant = 'default',
  className = '' 
}: SldsProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    'x-small': 'h-1',
    'small': 'h-1.5',
    'medium': 'h-2',
    'large': 'h-3'
  };

  return (
    <div className={`slds-progress-bar ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-700">{label}</span>
          <span className="text-xs text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div 
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
