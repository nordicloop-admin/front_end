'use client';

import { useState, useEffect, useCallback } from 'react';

// Define types for Google Maps API
declare global {
  interface Window {
    google: any;
    initGoogleMapsAPI: () => void;
    googleMapsLoading: boolean;
  }
}

// Result interface for Places Autocomplete
export interface PlaceResult {
  // Original fields (kept for backward compatibility)
  address: string; // street number and route combined (legacy alias)
  city: string;
  region: string; // legacy alias for state/province
  country: string; // country name
  countryCode: string; // ISO-2
  formattedAddress: string;

  // New fields required by backend LocationSerializer
  placeId?: string;
  addressLine?: string; // maps to address_line
  stateProvince?: string; // maps to state_province
  postalCode?: string; // maps to postal_code
  latitude?: number;
  longitude?: number;
}

// Hook for loading Google Maps API
export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Skip in SSR
    if (typeof window === 'undefined') return;

    // If already loaded, return early
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // If already loading, wait for it to complete
    if (window.googleMapsLoading) {
      const checkLoaded = () => {
        if (window.google?.maps) {
          setIsLoaded(true);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Mark as loading
    window.googleMapsLoading = true;

    // Google Maps API Key from environment
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    // Check if API key is available
    if (!googleMapsApiKey) {
      window.googleMapsLoading = false;
      setLoadError(new Error('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.'));
      return;
    }

    // Define the callback function
    window.initGoogleMapsAPI = () => {
      // Google Maps API loaded successfully
      window.googleMapsLoading = false;
      setIsLoaded(true);
    };

    // Create and append the script
    // Creating Google Maps script (without legacy places library)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initGoogleMapsAPI`;
    script.async = true;
    script.defer = true;
    script.onerror = (_error) => {
      // Failed to load Google Maps API
      window.googleMapsLoading = false;
      setLoadError(new Error('Failed to load Google Maps API'));
    };

    // Appending Google Maps script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove the script as other components might be using it
      // Just reset the callback if this is the last component
    };
  }, []);

  return { isLoaded, loadError };
}

// Hook for places autocomplete using new Places API (New)
export function usePlacesAutocomplete() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Search for places using new Places API
  const searchPlaces = useCallback(async (input: string) => {
    if (!apiKey) {
      setError('Google Maps API key not found');
      return;
    }

    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          // Return only the fields we actually use from suggestions
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
          // Table B types allowed for includedPrimaryTypes in Autocomplete (New)
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
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search places');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Get detailed place information
  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceResult | null> => {
    if (!apiKey) {
      setError('Google Maps API key not found');
      return null;
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
        throw new Error(`Places API error: ${response.status}`);
      }

  const place = await response.json();

      // Parse address components
      const result: PlaceResult = {
        placeId,
        address: '',
        addressLine: '',
        city: '',
        region: '',
        stateProvince: '',
        country: '',
        countryCode: '',
        postalCode: '',
        formattedAddress: place.formattedAddress || '',
        latitude: place?.location?.latitude ?? undefined,
        longitude: place?.location?.longitude ?? undefined,
      };

      if (place.addressComponents) {
        let streetNumber = '';
        let routeName = '';
        for (const component of place.addressComponents) {
          const types = component.types as string[];

          if (types.includes('street_number')) {
            streetNumber = component.longText || component.shortText || '';
          } else if (types.includes('route')) {
            routeName = component.longText || component.shortText || '';
          } else if (types.includes('locality') || types.includes('postal_town')) {
            result.city = component.longText;
          } else if (types.includes('administrative_area_level_1')) {
            result.region = component.longText;
            result.stateProvince = component.longText;
          } else if (types.includes('postal_code')) {
            result.postalCode = component.longText || component.shortText || '';
          } else if (types.includes('country')) {
            result.country = component.longText;
            result.countryCode = (component.shortText || '').toLowerCase();
          }
        }
        const addressLine = [routeName, streetNumber].filter(Boolean).join(' ').trim();
        // Maintain backward-compat address while providing explicit addressLine
        result.addressLine = addressLine;
        result.address = addressLine;
      }

      setSelectedPlace(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get place details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);
  
  return { 
    getPlaceDetails, 
    selectedPlace, 
    searchPlaces, 
    suggestions, 
    isLoading, 
    error,
    setSelectedPlace 
  };
} 