'use client';

import React, { useState } from 'react';
import { MapPin, Truck, Package, CheckCircle, Globe, MapPinned } from 'lucide-react';
import InfoCallout from '@/components/ui/InfoCallout';
import { FormData } from '../AlternativeAuctionForm';
import { PlacesAutocomplete } from '@/components/ui/PlacesAutocomplete';
import { PlaceResult } from '@/hooks/useGoogleMaps';

interface Props {
  readonly formData: FormData;
  readonly updateFormData: (updates: Partial<FormData>) => void;
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
  const [locationError, setLocationError] = useState('');

  // Handle place selection from the new PlacesAutocomplete component
  const handlePlaceSelect = (place: PlaceResult) => {
    updateFormData({
      location: {
        ...formData.location,
        country: place.country || place.countryCode?.toUpperCase() || '',
        region: place.stateProvince || place.region,
        city: place.city,
        fullAddress: place.addressLine || place.formattedAddress,
        postalCode: place.postalCode || '',
        latitude: place.latitude,
        longitude: place.longitude
      }
    });
    setLocationError('');
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
          
          {/* Places Autocomplete */}
          <div className="space-y-4">
            <div>
              <label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Address in Sweden *
              </label>
              <PlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Start typing your address in Sweden..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] ${locationError ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={formData.location.fullAddress || ''}
              />
              {locationError && (
                <p className="mt-1 text-sm text-red-600">{locationError}</p>
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
                      {formData.location.country && `, ${formData.location.country}`}
                    </span>
                  </div>
                  {formData.location.postalCode && (
                    <div className="flex">
                      <span className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Postal code: {formData.location.postalCode}</span>
                    </div>
                  )}
                  {(formData.location.latitude !== undefined && formData.location.longitude !== undefined) && (
                    <div className="flex">
                      <span className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Coordinates: {formData.location.latitude}, {formData.location.longitude}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
                  p-4 rounded-lg border text-left transition-all
                  ${isSelected
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    ${isSelected
                      ? 'text-[#FF8A00]'
                      : 'text-gray-400'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
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

      {/* Information Callout */}
      <InfoCallout title="Why location?" className="mt-2" variant="orange">
        <ul className="list-disc pl-4 space-y-1">
          <li>Accurate location helps buyers calculate logistics costs</li>
          <li>Currently we only serve locations within Sweden</li>
          <li>Delivery options make your listing more attractive</li>
          <li>You can reveal exact address later for sensitive materials</li>
        </ul>
      </InfoCallout>


    </div>
  );
} 