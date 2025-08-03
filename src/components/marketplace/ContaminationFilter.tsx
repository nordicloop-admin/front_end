"use client";

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface ContaminationFilterProps {
  selectedContamination: string;
  setContamination: (contamination: string) => void;
  onContaminationChange: (contamination: string | null) => void;
}

export function ContaminationFilter({ selectedContamination, setContamination, onContaminationChange }: ContaminationFilterProps) {
  const contaminationOptions = [
    { value: '', label: 'All Levels' },
    { value: 'clean', label: 'Clean' },
    { value: 'slightly_contaminated', label: 'Slightly Contaminated' },
    { value: 'heavily_contaminated', label: 'Heavily Contaminated' }
  ];

  const getDisplayLabel = () => {
    const selected = contaminationOptions.find(option => option.value === selectedContamination);
    return selected ? selected.label : 'All Levels';
  };

  const handleContaminationSelect = (value: string) => {
    setContamination(value);
    onContaminationChange(value || null);
  };

  return (
    <FilterDropdown
      label={getDisplayLabel()}
      contentClassName="w-[300px]"
    >
      <div className="py-6 px-6 space-y-4">
        {contaminationOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`contamination-${option.value}`}
              name="contamination-filter"
              className="h-4 w-4 text-[#FF8A00]"
              checked={selectedContamination === option.value}
              onChange={() => handleContaminationSelect(option.value)}
            />
            <label htmlFor={`contamination-${option.value}`} className="text-sm">{option.label}</label>
          </div>
        ))}
      </div>
    </FilterDropdown>
  );
}
