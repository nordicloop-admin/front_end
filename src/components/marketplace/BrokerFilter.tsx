"use client";

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface BrokerFilterProps {
  selectedBrokerFilter: string;
  setBrokerFilter: (filter: string) => void;
}

export function BrokerFilter({ selectedBrokerFilter, setBrokerFilter }: BrokerFilterProps) {
  const brokerOptions = [
    { value: 'all', label: 'All Companies' },
    { value: 'exclude_brokers', label: 'Exclude Brokers' },
    { value: 'only_brokers', label: 'Only Brokers' }
  ];

  const getDisplayLabel = () => {
    const selected = brokerOptions.find(option => option.value === selectedBrokerFilter);
    return selected ? selected.label : 'All Companies';
  };

  return (
    <FilterDropdown
      label={getDisplayLabel()}
      contentClassName="w-[300px]"
    >
      <div className="py-6 px-6 space-y-4">
        {brokerOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={option.value}
              name="broker-filter"
              className="h-4 w-4 text-[#FF8A00]"
              checked={selectedBrokerFilter === option.value}
              onChange={() => setBrokerFilter(option.value)}
            />
            <label htmlFor={option.value} className="text-sm">{option.label}</label>
          </div>
        ))}
      </div>
    </FilterDropdown>
  );
}
