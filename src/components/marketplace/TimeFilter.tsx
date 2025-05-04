"use client";

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface TimeFilterProps {
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
}

export function TimeFilter({ selectedDateFilter, setSelectedDateFilter }: TimeFilterProps) {
  const timeOptions = [
    'Last 24 hours',
    'Last 3 days',
    'Last 7 days',
    'Last 30 days',
    'All time'
  ];

  return (
    <FilterDropdown 
      label={selectedDateFilter}
      contentClassName="w-[400px]"
    >
      <div className="py-6 px-6 space-y-4">
        {timeOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              id={option.replace(/\s+/g, '-').toLowerCase()}
              name="time-filter"
              className="h-4 w-4 text-blue-600"
              checked={selectedDateFilter === option}
              onChange={() => setSelectedDateFilter(option)}
            />
            <label htmlFor={option.replace(/\s+/g, '-').toLowerCase()} className="text-sm">{option}</label>
          </div>
        ))}
      </div>
    </FilterDropdown>
  );
}
