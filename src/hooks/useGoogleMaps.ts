'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

// Define types for Google Maps API
declare global {
  interface Window {
    google: any;
    initGoogleMapsAPI: () => void;
  }
}

// Result interface for Places Autocomplete
export interface PlaceResult {
  address: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
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

    // Google Maps API Key
    const googleMapsApiKey = 'AIzaSyDIlas6KRQPk1mIFlHzTZt2lH3w6b1bZw8';
    
    // Define the callback function
    window.initGoogleMapsAPI = () => {
      setIsLoaded(true);
    };

    // Create and append the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initGoogleMapsAPI`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.initGoogleMapsAPI = () => {};
    };
  }, []);

  return { isLoaded, loadError };
}

// Hook for places autocomplete
export function usePlacesAutocomplete(inputRef: RefObject<HTMLInputElement>, isLoaded: boolean) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) return;
    
    try {
      // Create autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        componentRestrictions: { country: 'se' } // Restrict to Sweden
      });
      
      autocompleteRef.current = autocomplete;
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
    }
    
    // No explicit cleanup needed for autocomplete
  }, [isLoaded, inputRef]);

  const getPlaceDetails = async (): Promise<PlaceResult | null> => {
    if (!autocompleteRef.current) return null;

    return new Promise((resolve) => {
      try {
        const place = autocompleteRef.current.getPlace();
        
        if (!place || !place.address_components) {
          resolve(null);
          return;
        }
        
        // Extract address components
        let city = '';
        let region = '';
        let country = '';
        let countryCode = '';
        
        place.address_components.forEach((component: any) => {
          const types = component.types;
          
          if (types.includes('locality') || types.includes('postal_town')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            region = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
            countryCode = component.short_name.toLowerCase();
          }
        });
        
        resolve({
          address: place.name || '',
          city,
          region,
          country,
          countryCode,
          formattedAddress: place.formatted_address || ''
        });
      } catch (error) {
        console.error('Error getting place details:', error);
        resolve(null);
      }
    });
  };
  
  return { getPlaceDetails };
} 