"use client";

import React, { useState } from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface QuantityFilterProps {
  minQuantity: number;
  maxQuantity: number;
  setMinQuantity: (value: number) => void;
  setMaxQuantity: (value: number) => void;
}

export function QuantityFilter({ 
  minQuantity, 
  maxQuantity, 
  setMinQuantity, 
  setMaxQuantity 
}: QuantityFilterProps) {
  const [localMin, setLocalMin] = useState(minQuantity);
  const [localMax, setLocalMax] = useState(maxQuantity);

  const handleApply = () => {
    setMinQuantity(localMin);
    setMaxQuantity(localMax);
  };

  return (
    <FilterDropdown 
      label="Quantity"
      contentClassName="w-[400px]"
    >
      <div className="py-6 px-6 space-y-4">
        <div>
          <label htmlFor="min-quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Min Quantity (kg)
          </label>
          <input
            type="number"
            id="min-quantity"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            min={0}
          />
        </div>
        <div>
          <label htmlFor="max-quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Max Quantity (kg)
          </label>
          <input
            type="number"
            id="max-quantity"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            min={localMin}
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </FilterDropdown>
  );
}
