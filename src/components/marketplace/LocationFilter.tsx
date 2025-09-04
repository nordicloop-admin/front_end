"use client";

import React, { useState, useEffect } from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { ChevronRight } from '@/components/ui/Icons';
import locationsData from '@/data/locations.json';

interface Country {
  id: string;
  name: string;
  region: string;
}

interface Region {
  id: string;
  name: string;
}

interface LocationFilterProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onLocationChange: (countries: string[]) => void;
  resetTrigger?: number;
}

export function LocationFilter({ selectedLocation, setSelectedLocation, onLocationChange, resetTrigger }: LocationFilterProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<'near-me' | 'select-country'>('select-country');
  const [showRegionDetails, setShowRegionDetails] = useState<string | null>(null);
  // Prefix with underscore to indicate intentionally unused variables
  const [_savedLocation, _setSavedLocation] = useState<string>('');
  const [radius, _setRadius] = useState<string>('100 km');

  useEffect(() => {
    setCountries(locationsData.countries);
    setRegions(locationsData.regions);
  }, []);

  // Reset component state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setSelectedCountries([]);
      setLocationType('select-country');
      setShowRegionDetails(null);
    }
  }, [resetTrigger]);

  // Helper function to split countries into three columns
  const splitIntoThreeColumns = (countriesList: Country[]) => {
    const totalCountries = countriesList.length;
    const itemsPerColumn = Math.ceil(totalCountries / 3);

    return [
      countriesList.slice(0, itemsPerColumn),
      countriesList.slice(itemsPerColumn, itemsPerColumn * 2),
      countriesList.slice(itemsPerColumn * 2)
    ];
  };

  // Get countries for the main view based on region
  // Prefix with underscore to indicate intentionally unused variable
  const _getRegionCountries = (regionName: string) => {
    return countries.filter(country => country.region === regionName);
  };

  // Define popular countries to show in the initial view
  const popularCountries = [
    { id: "austria", name: "Austria", region: "Europe" },
    { id: "czech-republic", name: "Czech Republic", region: "Europe" },
    { id: "denmark", name: "Denmark", region: "Europe" },
    { id: "finland", name: "Finland", region: "Europe" },
    { id: "france", name: "France", region: "Europe" },
    { id: "germany", name: "Germany", region: "Europe" },
    { id: "italy", name: "Italy", region: "Europe" },
    { id: "norway", name: "Norway", region: "Europe" },
    { id: "poland", name: "Poland", region: "Europe" },
    { id: "slovakia", name: "Slovakia", region: "Europe" },
    { id: "sweden", name: "Sweden", region: "Europe" },
    { id: "switzerland", name: "Switzerland", region: "Europe" }
  ];

  // Split popular countries into three columns
  const [popularCountriesColumn1, popularCountriesColumn2, popularCountriesColumn3] = splitIntoThreeColumns(popularCountries);

  const handleLocationTypeChange = (type: 'near-me' | 'select-country') => {
    setLocationType(type);
    if (type === 'near-me') {
      setSelectedLocation('Near me');
      setSelectedCountries([]);
    }
  };

  const handleCountryToggle = (countryName: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryName)) {
        return prev.filter(name => name !== countryName);
      } else {
        return [...prev, countryName];
      }
    });
  };

  const handleRegionClick = (regionId: string) => {
    setShowRegionDetails(regionId);
  };

  const handleBackToRegions = () => {
    setShowRegionDetails(null);
  };

  const handleApply = () => {
    if (locationType === 'near-me') {
      setSelectedLocation('Near me');
      onLocationChange([]); // Near me doesn't filter by specific countries
    } else if (selectedCountries.length > 0) {
      setSelectedLocation(`${selectedCountries.length} countries selected`);
      onLocationChange(selectedCountries);
    } else {
      setSelectedLocation('All Locations');
      onLocationChange([]);
    }
  };

  // Get countries for a specific region by ID
  const getRegionCountriesById = (regionId: string) => {
    const regionName = regions.find(r => r.id === regionId)?.name || '';
    return countries.filter(country => country.region === regionName);
  };

  // Split region countries into columns
  const getRegionCountryColumns = (regionId: string) => {
    const regionCountries = getRegionCountriesById(regionId);
    return splitIntoThreeColumns(regionCountries);
  };

  return (
    <FilterDropdown
      label={selectedLocation}
      contentClassName="w-[600px]"
    >
      <div className="max-h-[500px] overflow-y-auto">
        {!showRegionDetails ? (
          <div>
            {/* Location type selection */}
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="near-me"
                  name="location-type"
                  className="h-4 w-4 text-[#FF8A00]"
                  checked={locationType === 'near-me'}
                  onChange={() => handleLocationTypeChange('near-me')}
                />
                <label htmlFor="near-me" className="text-sm">Near me</label>
              </div>

              {locationType === 'near-me' && (
                <div className="pl-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm text-gray-600">Your saved location:</span>
                    <button className="text-sm text-[#FF8A00] ml-1 underline">Please select your location</button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <span className="text-sm text-gray-600">Radius:</span>
                    <div className="relative inline-block">
                      <button className="flex items-center text-sm text-gray-800 font-medium">
                        {radius}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="select-country"
                  name="location-type"
                  className="h-4 w-4 text-[#FF8A00]"
                  checked={locationType === 'select-country'}
                  onChange={() => handleLocationTypeChange('select-country')}
                />
                <label htmlFor="select-country" className="text-sm">Select country</label>
              </div>
            </div>

            {locationType === 'select-country' && (
              <>
                {/* Popular countries grid */}
                <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                  {/* Column 1 */}
                  <div>
                    {popularCountriesColumn1.map(country => (
                      <div key={country.id} className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id={country.id}
                          className="h-4 w-4 border-gray-300 rounded"
                          checked={selectedCountries.includes(country.name)}
                          onChange={() => handleCountryToggle(country.name)}
                        />
                        <label htmlFor={country.id} className="ml-2 text-sm text-gray-700">
                          {country.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div>
                    {popularCountriesColumn2.map(country => (
                      <div key={country.id} className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id={country.id}
                          className="h-4 w-4 border-gray-300 rounded"
                          checked={selectedCountries.includes(country.name)}
                          onChange={() => handleCountryToggle(country.name)}
                        />
                        <label htmlFor={country.id} className="ml-2 text-sm text-gray-700">
                          {country.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Column 3 */}
                  <div>
                    {popularCountriesColumn3.map(country => (
                      <div key={country.id} className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id={country.id}
                          className="h-4 w-4 border-gray-300 rounded"
                          checked={selectedCountries.includes(country.name)}
                          onChange={() => handleCountryToggle(country.name)}
                        />
                        <label htmlFor={country.id} className="ml-2 text-sm text-gray-700">
                          {country.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regions list */}
                <div className="border-t border-gray-200">
                  <div
                    className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                    onClick={() => {}}
                  >
                    <span className="text-sm font-medium">Anywhere</span>
                  </div>

                  {regions.map(region => (
                    <div
                      key={region.id}
                      className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRegionClick(region.id)}
                    >
                      <span className="text-sm font-medium">{region.name}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </>
            )}

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
        ) : (
          <div>
            {/* Region details view */}
            <div className="p-4 border-b border-gray-200">
              <button
                className="flex items-center text-gray-700"
                onClick={handleBackToRegions}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4">
              {showRegionDetails && getRegionCountryColumns(showRegionDetails).map((columnCountries, columnIndex) => (
                <div key={columnIndex}>
                  {columnCountries.map(country => (
                    <div key={country.id} className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id={`region-${country.id}`}
                        className="h-4 w-4 border-gray-300 rounded"
                        checked={selectedCountries.includes(country.name)}
                        onChange={() => handleCountryToggle(country.name)}
                      />
                      <label htmlFor={`region-${country.id}`} className="ml-2 text-sm text-gray-700">
                        {country.name}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
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
        )}
      </div>
    </FilterDropdown>
  );
}
