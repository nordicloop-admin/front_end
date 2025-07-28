"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  className = ""
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  }, [onChange]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev =>
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          }
          break;
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, focusedIndex, options, handleSelect]);

  const selectedOption = options.find(option => option.value === value);
  const isActive = value !== 'all' && value !== '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        className={`
          w-full px-3 py-2 text-left border rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent focus:outline-none
          transition-all duration-200 ease-in-out
          ${disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'cursor-pointer hover:border-gray-400'
          }
          ${isActive
            ? 'border-[#FF8A00] bg-orange-50'
            : 'border-gray-300 bg-white'
          }
          ${isOpen ? 'ring-2 ring-[#FF8A00] border-transparent' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 min-w-full max-w-xs mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`
                  w-full px-3 py-2 text-left text-sm transition-all duration-150 ease-in-out
                  hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                  ${value === option.value
                    ? 'bg-orange-50 text-[#FF8A00] font-medium'
                    : 'text-gray-900 hover:text-gray-700'
                  }
                  ${focusedIndex === index ? 'bg-gray-50' : ''}
                  ${index === 0 ? 'rounded-t-md' : ''}
                  ${index === options.length - 1 ? 'rounded-b-md' : ''}
                `}
                style={{
                  animationDelay: `${index * 20}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="block leading-5">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-[#FF8A00] animate-in zoom-in-50 duration-200 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
