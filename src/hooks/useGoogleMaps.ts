'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

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

    // Google Maps API Key
    const googleMapsApiKey = 'AIzaSyDIlas6KRQPk1mIFlHzTZt2lH3w6b1bZw8';

    // Define the callback function
    window.initGoogleMapsAPI = () => {
      console.log('Google Maps API loaded successfully');
      window.googleMapsLoading = false;
      setIsLoaded(true);
    };

    // Create and append the script
    console.log('Creating Google Maps script...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initGoogleMapsAPI`;
    script.async = true;
    script.defer = true;
    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error);
      window.googleMapsLoading = false;
      setLoadError(new Error('Failed to load Google Maps API'));
    };

    console.log('Appending Google Maps script to head...');
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove the script as other components might be using it
      // Just reset the callback if this is the last component
    };
  }, []);

  return { isLoaded, loadError };
}

// Define the Autocomplete type
interface GoogleAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => any;
}

// Hook for places autocomplete
export function usePlacesAutocomplete(inputRef: RefObject<HTMLInputElement>, isLoaded: boolean) {
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) return;
    
    try {
      // Create autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        componentRestrictions: { country: 'se' } // Restrict to Sweden
      });
      
      // Add listener for place_changed event
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.address_components) {
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
          
          const placeResult: PlaceResult = {
            address: place.name || '',
            city,
            region,
            country,
            countryCode,
            formattedAddress: place.formatted_address || ''
          };
          
          setSelectedPlace(placeResult);
        }
      });
      
      autocompleteRef.current = autocomplete;
    } catch (_error) {
      // Error silently handled - removed console.error statement
    }
    
    // No explicit cleanup needed for autocomplete
  }, [isLoaded, inputRef]);

  const getPlaceDetails = async (): Promise<PlaceResult | null> => {
    // If we already have the selected place from the event listener, return it
    if (selectedPlace) {
      return selectedPlace;
    }
    
    // Fallback to manual fetching if needed
    if (!autocompleteRef.current) return null;

    return new Promise((resolve) => {
      try {
        const autocomplete = autocompleteRef.current;
        if (!autocomplete) {
          resolve(null);
          return;
        }
        
        const place = autocomplete.getPlace();
        
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
      } catch (_error) {
        // Error silently handled - removed console.error statement
        resolve(null);
      }
    });
  };
  
  return { getPlaceDetails, selectedPlace };
} 