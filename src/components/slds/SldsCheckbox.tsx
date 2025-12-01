import React from 'react';

interface SldsCheckboxProps {
  id?: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
  className?: string;
}

export function SldsCheckbox({ 
  id, 
  label, 
  checked, 
  onChange, 
  disabled = false,
  description,
  className = ''
}: SldsCheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`slds-form-element ${className}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="
            mt-0.5 w-4 h-4 rounded border-gray-300
            text-blue-600 focus:ring-blue-600 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        />
        {(label || description) && (
          <label 
            htmlFor={checkboxId} 
            className="flex-1 cursor-pointer"
          >
            {label && (
              <div className={`text-sm ${checked ? 'text-gray-900' : 'text-gray-700'}`}>
                {label}
              </div>
            )}
            {description && (
              <div className="text-xs text-gray-600 mt-0.5">
                {description}
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
