'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Truck, Package, Search, CheckCircle, Globe, MapPinned, Info } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';
import { useGoogleMaps, usePlacesAutocomplete } from '@/hooks/useGoogleMaps';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const deliveryOptions = [
  {
    id: 'pickup-only',
    name: 'Pickup Only',
    description: 'Buyer arranges pickup from your location',
    icon: Package
  },
  {
    id: 'local-delivery',
    name: 'Local Delivery',
    description: 'You can deliver within local area',
    icon: Truck
  },
  {
    id: 'national-shipping',
    name: 'National Shipping',
    description: 'You can arrange national shipping',
    icon: Truck
  },
  {
    id: 'international-shipping',
    name: 'International Shipping',
    description: 'You can arrange international shipping',
    icon: Truck
  },
  {
    id: 'freight-forwarding',
    name: 'Freight Forwarding',
    description: 'Professional freight services available',
    icon: Truck
  }
];

export function LocationLogisticsStep({ formData, updateFormData }: Props) {
  const [addressInput, setAddressInput] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null!);
  
  // Load Google Maps API
  const { isLoaded, loadError } = useGoogleMaps();
  const { getPlaceDetails, selectedPlace } = usePlacesAutocomplete(addressInputRef, isLoaded);

  // Watch for changes to selectedPlace and update the form data
  useEffect(() => {
    if (selectedPlace) {
      updateFormData({
        location: {
          ...formData.location,
          country: selectedPlace.countryCode,
          region: selectedPlace.region,
          city: selectedPlace.city,
          fullAddress: selectedPlace.formattedAddress
        }
      });
      setLocationError('');
    }
  }, [selectedPlace, formData.location, updateFormData]);

  const handleAddressSelect = async () => {
    if (!isLoaded) return;
    
    setIsSearching(true);
    
    try {
      const placeResult = await getPlaceDetails();
      
      if (placeResult) {
        updateFormData({
          location: {
            ...formData.location,
            country: placeResult.countryCode,
            region: placeResult.region,
            city: placeResult.city,
            fullAddress: placeResult.formattedAddress
          }
        });
        setLocationError('');
      } else {
        setLocationError('Please select a valid address from the suggestions');
      }
    } catch (_error) {
      // Handle error silently
      setLocationError('Failed to get location details');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationUpdate = (field: string, value: any) => {
    updateFormData({
      location: {
        ...formData.location,
        [field]: value
      }
    });
  };

  const toggleDeliveryOption = (option: string) => {
    const currentOptions = formData.location.deliveryOptions || [];
    const isSelected = currentOptions.includes(option);
    
    if (isSelected) {
      handleLocationUpdate('deliveryOptions', currentOptions.filter(o => o !== option));
    } else {
      handleLocationUpdate('deliveryOptions', [...currentOptions, option]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Location & Logistics
        </h3>
        <p className="text-gray-600">
          Specify material location and delivery options for buyers
        </p>
      </div>

      {/* Location Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPinned className="mr-2 h-5 w-5 text-[#FF8A00]" />
            Material Location
          </h4>
          
          {/* Google Maps Autocomplete */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Address in Sweden *
              </label>
              <div className="relative">
                <input
                  ref={addressInputRef}
                  type="text"
                  placeholder="Start typing your address in Sweden..."
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] ${locationError ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => {
                    setAddressInput(e.target.value);
                    if (locationError) {
                      setLocationError('');
                    }
                  }}
                  disabled={!isLoaded || isSearching}
                />
                <button 
                  onClick={handleAddressSelect}
                  disabled={!isLoaded || isSearching || !addressInput}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${!isLoaded || isSearching || !addressInput ? 'text-gray-400 cursor-not-allowed' : 'text-[#FF8A00] hover:bg-orange-50'}`}
                >
                  {isSearching ? (
                    <div className="animate-spin h-5 w-5 border-2 border-[#FF8A00] border-t-transparent rounded-full"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
              {locationError && (
                <p className="mt-1 text-sm text-red-600">{locationError}</p>
              )}
              {!isLoaded && !loadError && (
                <p className="mt-1 text-sm text-gray-500">Loading Google Maps...</p>
              )}
              {loadError && (
                <p className="mt-1 text-sm text-red-600">Failed to load Google Maps. Please enter location manually.</p>
              )}
            </div>

            {/* Selected Location Summary */}
            {formData.location.country && formData.location.city && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Selected Location
                </h5>
                <div className="space-y-2 text-sm">
                  {formData.location.fullAddress && (
                    <div className="flex">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{formData.location.fullAddress}</span>
                    </div>
                  )}
                  <div className="flex">
                    <Globe className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      {formData.location.city}
                      {formData.location.region && `, ${formData.location.region}`}
                      {formData.location.country && `, ${formData.location.country.toUpperCase()}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Location Input (Fallback) */}
            {loadError && (
              <div className="space-y-4 mt-4 border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-900">Manual Location Entry</h5>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                    value={formData.location.country || ''}
                    onChange={(e) => handleLocationUpdate('country', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region/State
                  </label>
                  <input
                    type="text"
                    placeholder="Enter region or state"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                    value={formData.location.region || ''}
                    onChange={(e) => handleLocationUpdate('region', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                    value={formData.location.city || ''}
                    onChange={(e) => handleLocationUpdate('city', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pickup Available */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.location.pickupAvailable}
            onChange={(e) => handleLocationUpdate('pickupAvailable', e.target.checked)}
            className="w-4 h-4 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00]"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Pickup Available</span>
            <p className="text-xs text-gray-500">Buyers can collect material from your location</p>
          </div>
        </label>
      </div>

      {/* Delivery Options */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Delivery Options
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Select all the delivery options that apply to this material.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.location.deliveryOptions?.includes(option.id) || false;
            
            return (
              <button
                key={option.id}
                onClick={() => toggleDeliveryOption(option.id)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${isSelected
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-full
                    ${isSelected
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h5 className="font-medium text-gray-900">{option.name}</h5>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 ml-2 text-[#FF8A00]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Why location matters</h4>
            <div className="text-sm text-blue-700 mt-1">
              <p className="mb-1">• Accurate location helps buyers calculate logistics costs</p>
              <p className="mb-1">• Currently, the Nordic Loop Marketplace only serves locations within Sweden</p>
              <p className="mb-1">• Specify delivery options to make your listing more attractive</p>
              <p>• For sensitive materials, you can choose to reveal exact location only to serious buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.location.country || !formData.location.city) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please specify the location (country and city) where the material is available.
          </p>
        </div>
      )}
    </div>
  );
} 