"use client";

import React, { useEffect } from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface OriginFilterProps {
  selectedOrigin: string;
  setOrigin: (origin: string) => void;
  onOriginChange: (origin: string | null) => void;
  resetTrigger?: number;
}

export function OriginFilter({ selectedOrigin, setOrigin, onOriginChange, resetTrigger }: OriginFilterProps) {
  const originOptions = [
    { value: '', label: 'All Origins' },
    { value: 'post_industrial', label: 'Post-industrial' },
    { value: 'post_consumer', label: 'Post-consumer' },
    { value: 'mix', label: 'Mix' }
  ];

  const getDisplayLabel = () => {
    const selected = originOptions.find(option => option.value === selectedOrigin);
    return selected ? selected.label : 'All Origins';
  };

  const handleOriginSelect = (value: string) => {
    setOrigin(value);
    onOriginChange(value || null);
  };

  // Reset component state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setOrigin('');
      onOriginChange(null);
    }
  }, [resetTrigger, setOrigin, onOriginChange]);

  return (
    <FilterDropdown
      label={getDisplayLabel()}
      contentClassName="w-[300px]"
    >
      <div className="py-6 px-6 space-y-4">
        {originOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`origin-${option.value}`}
              name="origin-filter"
              className="h-4 w-4 text-[#FF8A00]"
              checked={selectedOrigin === option.value}
              onChange={() => handleOriginSelect(option.value)}
            />
            <label htmlFor={`origin-${option.value}`} className="text-sm">{option.label}</label>
          </div>
        ))}
      </div>
    </FilterDropdown>
  );
}
