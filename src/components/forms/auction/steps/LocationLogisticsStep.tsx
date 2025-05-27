import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Package, Search, CheckCircle } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

interface Country {
  id: string;
  name: string;
  region: string;
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

const nordicRegions = [
  'Stockholm County',
  'Gothenburg',
  'Malmö',
  'Uppsala',
  'Västerås',
  'Örebro',
  'Linköping',
  'Oslo',
  'Bergen',
  'Stavanger',
  'Trondheim',
  'Helsinki',
  'Espoo',
  'Tampere',
  'Turku',
  'Copenhagen',
  'Aarhus',
  'Odense',
  'Aalborg',
  'Reykjavik'
];

export function LocationLogisticsStep({ formData, updateFormData }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load countries from locations data
    const loadCountries = async () => {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        setCountries(data.countries || []);
      } catch (_error) {
        // Fallback to Nordic countries
        setCountries([
          { id: 'sweden', name: 'Sweden', region: 'Europe' },
          { id: 'norway', name: 'Norway', region: 'Europe' },
          { id: 'finland', name: 'Finland', region: 'Europe' },
          { id: 'denmark', name: 'Denmark', region: 'Europe' },
          { id: 'iceland', name: 'Iceland', region: 'Europe' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

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

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = countries.find(c => c.id === formData.location.country);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

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

      {/* Country Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <MapPin className="inline w-4 h-4 mr-2" />
          Country *
        </label>
        
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search countries..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {filteredCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => handleLocationUpdate('country', country.id)}
              className={`
                p-2 rounded-lg border text-sm text-left transition-all hover:scale-105
                ${formData.location.country === country.id
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {country.name}
              <div className="text-xs text-gray-500 mt-1">{country.region}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Region/State Selection */}
      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Region/State
          </label>
          {['sweden', 'norway', 'finland', 'denmark', 'iceland'].includes(selectedCountry.id) ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {nordicRegions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleLocationUpdate('region', region)}
                  className={`
                    p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                    ${formData.location.region === region
                      ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  {region}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Enter region or state"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
              value={formData.location.region}
              onChange={(e) => handleLocationUpdate('region', e.target.value)}
            />
          )}
        </div>
      )}

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          City *
        </label>
        <input
          type="text"
          placeholder="Enter city name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
          value={formData.location.city}
          onChange={(e) => handleLocationUpdate('city', e.target.value)}
        />
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
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <Truck className="inline w-4 h-4 mr-2" />
          Delivery Options
        </label>
        <div className="space-y-3">
          {deliveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => toggleDeliveryOption(option.id)}
                className={`
                  w-full p-4 rounded-lg border text-left transition-all
                  ${formData.location.deliveryOptions?.includes(option.id)
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${formData.location.deliveryOptions?.includes(option.id)
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      {formData.location.deliveryOptions?.includes(option.id) && (
                        <CheckCircle className="w-4 h-4 text-[#FF8A00]" />
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

      {/* Location Summary */}
      {(formData.location.country && formData.location.city) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Location Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Location:</span> {' '}
              {formData.location.city}
              {formData.location.region && `, ${formData.location.region}`}
              {selectedCountry && `, ${selectedCountry.name}`}
            </div>
            {formData.location.pickupAvailable && (
              <div className="text-green-600">✓ Pickup available</div>
            )}
            {formData.location.deliveryOptions && formData.location.deliveryOptions.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Delivery:</span> {' '}
                {formData.location.deliveryOptions.map(option => 
                  deliveryOptions.find(o => o.id === option)?.name
                ).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logistics Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Logistics Guidelines</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Accurate location helps buyers calculate transport costs</p>
              <p>• Offering multiple delivery options increases buyer interest</p>
              <p>• Consider material weight and volume for shipping options</p>
              <p>• Local pickup often preferred for large quantities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.location.country || !formData.location.city) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please specify both country and city to continue.
          </p>
        </div>
      )}
    </div>
  );
} 