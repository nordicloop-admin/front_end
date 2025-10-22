"use client";
import React from 'react';
import { Info } from 'lucide-react';

interface InfoCalloutProps {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'orange' | 'neutral' | 'brand' | 'warning';
  className?: string;
  small?: boolean;
}

// Flat callout (no shadows) accessible wrapper
export const InfoCallout: React.FC<InfoCalloutProps> = ({
  title,
  children,
  icon,
  variant = 'orange',
  className = '',
  small = false
}) => {
  const colorClasses = {
    orange: 'border-orange-200 bg-orange-50 text-orange-900',
    brand: 'border-[#FF8A00]/30 bg-[#FF8A00]/5 text-[#FF8A00]',
    neutral: 'border-gray-200 bg-gray-50 text-gray-700',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800'
  }[variant];

  return (
    <div
      role="note"
      aria-label={title || 'Information'}
      className={`rounded-md border px-4 ${small ? 'py-2' : 'py-3'} ${colorClasses} ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8A00] text-white text-xs font-semibold flex-shrink-0" aria-hidden="true">
          {icon || <Info className="h-4 w-4" />}
        </span>
        <div className="text-sm leading-relaxed flex-1">
          {title && <p className="font-medium mb-1">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoCallout;
