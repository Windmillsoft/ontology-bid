import React, { useEffect } from 'react';
import { SldsButton } from './SldsButton';
import { SldsIcon } from './SldsIcon';

interface SldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: string;
}

export function SldsModal({ 
  isOpen, 
  onClose, 
  title, 
  size = 'medium',
  children, 
  footer,
  description 
}: SldsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl'
  };

  return (
    <div className="slds-modal slds-fade-in-open">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div 
          className={`bg-white rounded-md shadow-xl w-full ${sizeClasses[size]} relative animate-in fade-in-0 zoom-in-95`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
        >
          {/* Header */}
          <header className="border-b border-gray-200 px-6 py-4 flex items-start justify-between">
            <div className="flex-1">
              <h2 id="modal-heading" className="text-lg font-normal">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="닫기"
            >
              <SldsIcon name="close" size="small" />
            </button>
          </header>

          {/* Body */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <footer className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-2">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
