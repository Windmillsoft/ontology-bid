import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface SldsRadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function SldsRadioGroup({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  error,
  required 
}: SldsRadioGroupProps) {
  return (
    <fieldset className={`slds-form-element ${error ? 'slds-has-error' : ''}`}>
      {label && (
        <legend className="block text-xs text-gray-700 mb-2">
          {label}
          {required && <abbr className="text-red-600 ml-0.5" title="필수">*</abbr>}
        </legend>
      )}
      
      <div className="slds-form-element__control space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
            />
            <label 
              htmlFor={`${name}-${option.value}`}
              className="flex-1 cursor-pointer"
            >
              <div className="text-sm text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-xs text-gray-600 mt-0.5">
                  {option.description}
                </div>
              )}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="text-xs text-red-600 mt-1">
          {error}
        </div>
      )}
    </fieldset>
  );
}
