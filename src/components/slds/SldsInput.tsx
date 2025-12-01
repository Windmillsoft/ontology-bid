import React from 'react';

interface SldsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function SldsInput({ 
  label, 
  error, 
  required, 
  helpText, 
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props 
}: SldsInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`slds-form-element ${error ? 'slds-has-error' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs text-gray-700 mb-1"
        >
          {label}
          {required && <abbr className="text-red-600 ml-0.5" title="필수">*</abbr>}
        </label>
      )}
      
      <div className="slds-form-element__control relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            w-full px-3 py-2 text-sm
            bg-white border border-gray-300 rounded
            focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-600' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-xs text-red-600 mt-1">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="text-xs text-gray-600 mt-1">
          {helpText}
        </div>
      )}
    </div>
  );
}
