import React from 'react';

interface SldsSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
}

export function SldsSelect({ 
  label, 
  error, 
  required, 
  helpText,
  options,
  className = '',
  id,
  ...props 
}: SldsSelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`slds-form-element ${error ? 'slds-has-error' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-xs text-gray-700 mb-1"
        >
          {label}
          {required && <abbr className="text-red-600 ml-0.5" title="필수">*</abbr>}
        </label>
      )}
      
      <div className="slds-form-element__control">
        <select
          id={selectId}
          className={`
            w-full px-3 py-2 text-sm
            bg-white border border-gray-300 rounded
            focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-600' : ''}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
