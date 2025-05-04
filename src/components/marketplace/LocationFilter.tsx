"use client";

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface LocationFilterProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

export function LocationFilter({ selectedLocation, setSelectedLocation }: LocationFilterProps) {
  return (
    <FilterDropdown 
      label={selectedLocation}
      contentClassName="w-[400px]"
    >
      <div className="py-6 px-6 space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="near-me"
            name="location"
            className="h-4 w-4 text-blue-600"
            checked={selectedLocation === 'Near me'}
            onChange={() => setSelectedLocation('Near me')}
          />
          <label htmlFor="near-me" className="text-sm">Near me</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="select-country"
            name="location"
            className="h-4 w-4 text-blue-600"
            checked={selectedLocation === 'Select country'}
            onChange={() => setSelectedLocation('Select country')}
          />
          <label htmlFor="select-country" className="text-sm">Select country</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="all-locations"
            name="location"
            className="h-4 w-4 text-blue-600"
            checked={selectedLocation === 'All Locations'}
            onChange={() => setSelectedLocation('All Locations')}
          />
          <label htmlFor="all-locations" className="text-sm">All Locations</label>
        </div>
      </div>
    </FilterDropdown>
  );
}
