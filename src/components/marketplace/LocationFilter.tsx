"use client";

import React, { useState, useEffect } from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import locationsData from '@/data/locations.json';

interface Country {
  id: string;
  name: string;
  region: string;
}

interface LocationFilterProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onLocationChange: (countries: string[]) => void;
  resetTrigger?: number;
}

export function LocationFilter({ selectedLocation, setSelectedLocation, onLocationChange, resetTrigger }: LocationFilterProps) {
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);

  // Reset component state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setSelectedCounties([]);
    }
  }, [resetTrigger]);

  // Swedish counties
  const swedishCounties = locationsData.countries;

  // Helper function to split counties into three columns
  const splitIntoThreeColumns = (countiesList: Country[]) => {
    const totalCounties = countiesList.length;
    const itemsPerColumn = Math.ceil(totalCounties / 3);

    return [
      countiesList.slice(0, itemsPerColumn),
      countiesList.slice(itemsPerColumn, itemsPerColumn * 2),
      countiesList.slice(itemsPerColumn * 2)
    ];
  };

  // Split Swedish counties into three columns
  const [countiesColumn1, countiesColumn2, countiesColumn3] = splitIntoThreeColumns(swedishCounties);

  const handleCountyToggle = (countyName: string) => {
    setSelectedCounties(prev => {
      if (prev.includes(countyName)) {
        return prev.filter(name => name !== countyName);
      } else {
        return [...prev, countyName];
      }
    });
  };

  const handleApply = () => {
    if (selectedCounties.length > 0) {
      setSelectedLocation(`${selectedCounties.length} counties selected`);
      onLocationChange(selectedCounties);
    } else {
      setSelectedLocation('All Counties');
      onLocationChange([]);
    }
  };

  return (
    <FilterDropdown
      label={selectedLocation}
      contentClassName="w-[600px]"
    >
      <div className="max-h-[500px] overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Swedish Counties</h3>
            <p className="text-sm text-gray-600">Choose one or more counties to filter results</p>
          </div>

          {/* Swedish counties grid */}
          <div className="grid grid-cols-3 gap-4 px-6 pb-6">
            {/* Column 1 */}
            <div>
              {countiesColumn1.map(county => (
                <div key={county.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={county.id}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedCounties.includes(county.name)}
                    onChange={() => handleCountyToggle(county.name)}
                  />
                  <label htmlFor={county.id} className="ml-2 text-sm text-gray-700">
                    {county.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div>
              {countiesColumn2.map(county => (
                <div key={county.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={county.id}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedCounties.includes(county.name)}
                    onChange={() => handleCountyToggle(county.name)}
                  />
                  <label htmlFor={county.id} className="ml-2 text-sm text-gray-700">
                    {county.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Column 3 */}
            <div>
              {countiesColumn3.map(county => (
                <div key={county.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={county.id}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedCounties.includes(county.name)}
                    onChange={() => handleCountyToggle(county.name)}
                  />
                  <label htmlFor={county.id} className="ml-2 text-sm text-gray-700">
                    {county.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              className="bg-[#FF8A00] text-white px-6 py-2 rounded hover:bg-[#e67e00] font-medium transition-colors"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </FilterDropdown>
  );
}
