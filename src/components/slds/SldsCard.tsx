import React from 'react';

interface SldsCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

export function SldsCard({ children, className = '', title, actions }: SldsCardProps) {
  return (
    <article className={`slds-card-custom ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h3 className="slds-text-heading_small">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={title ? 'p-4' : ''}>
        {children}
      </div>
    </article>
  );
}

export function SldsCardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-200 px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

export function SldsCardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

export function SldsCardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-t border-gray-200 px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}
