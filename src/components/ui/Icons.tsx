"use client";

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const ChevronDown: React.FC<IconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
};

export const SlidersHorizontal: React.FC<IconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="4" x2="10" y1="21" y2="21"/>
      <line x1="14" x2="20" y1="21" y2="21"/>
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="3" y2="3"/>
      <circle cx="12" cy="21" r="2"/>
      <circle cx="12" cy="3" r="2"/>
    </svg>
  );
};

export const ChevronRight: React.FC<IconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
};
