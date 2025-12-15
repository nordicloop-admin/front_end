'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePlacesAutocomplete, PlaceResult } from '@/hooks/useGoogleMaps';

interface PlacesAutocompleteProps {
  onPlaceSelect?: (place: PlaceResult) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
}

export function PlacesAutocomplete({ 
  onPlaceSelect, 
  placeholder = "Start typing your address in Sweden...", 
  defaultValue = "",
  className = "",
  disabled = false
}: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { 
    searchPlaces, 
    getPlaceDetails, 
    suggestions, 
    isLoading, 
    error 
  } = usePlacesAutocomplete();

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim().length >= 3) {
        searchPlaces(inputValue);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchPlaces]);

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: any) => {
    const placeId = suggestion.placePrediction?.placeId;
    if (!placeId) return;

    const placeDetails = await getPlaceDetails(placeId);
    if (placeDetails) {
      setInputValue(placeDetails.formattedAddress);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onPlaceSelect?.(placeDetails);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  // Handle input focus
  const handleFocus = () => {
    if (inputValue.trim().length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${className}`}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 z-50">
          {error}
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.placePrediction?.placeId || index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="font-medium text-sm text-gray-900">
                {suggestion.placePrediction?.structuredFormat?.mainText?.text || 
                 suggestion.placePrediction?.text?.text}
              </div>
              <div className="text-xs text-gray-500">
                {suggestion.placePrediction?.structuredFormat?.secondaryText?.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && inputValue.trim().length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-500 z-50">
          No addresses found. Try a different search term.
        </div>
      )}
    </div>
  );
}