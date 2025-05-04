"use client";

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface FormFilterProps {
  selectedForms: string[];
  toggleFormSelection: (form: string) => void;
}

export function FormFilter({ selectedForms, toggleFormSelection }: FormFilterProps) {
  const formOptions = [
    'Granulate',
    'Flakes',
    'Pellets',
    'Powder',
    'Sheets',
    'Rolls',
    'Bales',
    'Liquid',
    'Other'
  ];

  return (
    <FilterDropdown 
      label={selectedForms.length > 0 ? `Form (${selectedForms.length})` : 'Form'}
      contentClassName="w-[450px]"
    >
      <div className="py-6 px-6">
        <div className="grid grid-cols-2 gap-4">
          {formOptions.map((form) => (
            <div key={form} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={form.toLowerCase()}
                className="h-4 w-4 text-blue-600"
                checked={selectedForms.includes(form)}
                onChange={() => toggleFormSelection(form)}
              />
              <label htmlFor={form.toLowerCase()} className="text-sm">{form}</label>
            </div>
          ))}
        </div>
      </div>
    </FilterDropdown>
  );
}
