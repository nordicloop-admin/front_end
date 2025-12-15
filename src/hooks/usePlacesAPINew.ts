'use client';

import { useState, useCallback } from 'react';

// Types for the new Places API (New)
export interface PlaceAutocompleteResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface PlaceResult {
  address: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
}

// Hook for the new Places API (New)
export function usePlacesAPINew() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Autocomplete search using Places API (New)
  const searchPlaces = useCallback(async (input: string): Promise<PlaceAutocompleteResult[]> => {
    if (!apiKey) {
      throw new Error('Google Maps API key not found');
    }

    if (!input.trim()) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': [
            'suggestions.placePrediction.placeId',
            'suggestions.placePrediction.structuredFormat.mainText',
            'suggestions.placePrediction.structuredFormat.secondaryText',
            'suggestions.placePrediction.text'
          ].join(','),
        },
        body: JSON.stringify({
          input: input,
          regionCode: 'SE', // Restrict to Sweden
          // Use supported primary types for address-like predictions
          includedPrimaryTypes: [
            'street_address',
            'route',
            'premise',
            'subpremise',
            'intersection'
          ],
          languageCode: 'en',
        }),
      });

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Get place details using Places API (New)
  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceResult> => {
    if (!apiKey) {
      throw new Error('Google Maps API key not found');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,addressComponents',
        },
      });

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status} ${response.statusText}`);
      }

      const place: PlaceDetails = await response.json();

      // Parse address components
      const result: PlaceResult = {
        address: '',
        city: '',
        region: '',
        country: '',
        countryCode: '',
        formattedAddress: place.formatted_address || '',
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
      };

      // Extract address components
      if (place.address_components) {
        for (const component of place.address_components) {
          const types = component.types;
          
          if (types.includes('street_number') || types.includes('route')) {
            result.address = result.address 
              ? `${result.address} ${component.long_name}`
              : component.long_name;
          } else if (types.includes('locality')) {
            result.city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            result.region = component.long_name;
          } else if (types.includes('country')) {
            result.country = component.long_name;
            result.countryCode = component.short_name;
          }
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get place details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return {
    searchPlaces,
    getPlaceDetails,
    isLoading,
    error,
  };
}