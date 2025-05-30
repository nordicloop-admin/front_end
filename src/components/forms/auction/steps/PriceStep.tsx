import React from 'react';
import { DollarSign, Scale, Package, Box, Clock } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const currencies = ['SEK', 'EUR'];

const units = [
  'kg', 'tons', 'tonnes', 'lbs', 'pounds',
  'pieces', 'units', 'bales', 'containers',
  'm³', 'cubic meters', 'liters', 'gallons'
];

const packagingOptions = [
  'Baled',
  'Loose',
  'Big-bag',
  'Octabin',
  'Roles',
  'Container',
  'Other'
];

const bidDurationOptions = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' }
];

export function PriceStep({ formData, updateFormData }: Props) {
  const handlePriceUpdate = (field: string, value: string | number) => {
    updateFormData({
      price: {
        ...formData.price,
        [field]: value,
        priceType: 'auction' // Always set to auction
      }
    });
  };

  const handleQuantityUpdate = (field: string, value: string | number) => {
    updateFormData({
      quantity: {
        ...formData.quantity,
        [field]: value
      }
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sv-SE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Quantity & Pricing
        </h3>
        <p className="text-gray-600">
          Specify the quantity available and set your auction pricing
        </p>
      </div>

      {/* Quantity Section */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Quantity Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Scale className="inline w-4 h-4 mr-2" />
              Available Quantity *
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg"
              value={formData.quantity.available || ''}
              onChange={(e) => handleQuantityUpdate('available', parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Total quantity available for auction
            </p>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Unit of Measurement *
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg"
              value={formData.quantity.unit}
              onChange={(e) => handleQuantityUpdate('unit', e.target.value)}
            >
              <option value="">Select unit...</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Minimum Order Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Package className="inline w-4 h-4 mr-2" />
          Minimum Order Quantity
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g., 100"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
            value={formData.quantity.minimumOrder || ''}
            onChange={(e) => handleQuantityUpdate('minimumOrder', parseFloat(e.target.value) || 0)}
          />
          <span className="text-gray-500">{formData.quantity.unit || 'units'}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum quantity buyers must purchase (leave 0 for no minimum)
        </p>
      </div>

      {/* Packaging */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <Box className="inline w-4 h-4 mr-2" />
          Packaging
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Detail the packaging method for the material.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {packagingOptions.map((packaging) => (
            <button
              key={packaging}
              onClick={() => handleQuantityUpdate('packaging', packaging)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.quantity.packaging === packaging
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {packaging}
            </button>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Auction Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starting Bid Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Starting Bid Price *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg"
                value={formData.price.basePrice || ''}
                onChange={(e) => handlePriceUpdate('basePrice', parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Initial bid price per {formData.quantity.unit || 'unit'}
            </p>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Currency *
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg"
              value={formData.price.currency}
              onChange={(e) => handlePriceUpdate('currency', e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bid Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Clock className="inline w-4 h-4 mr-2" />
          Auction Duration *
        </label>
        <p className="text-sm text-gray-500 mb-4">
          How long should the auction run?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {bidDurationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePriceUpdate('auctionDuration', option.value)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.price.auctionDuration === option.value
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reserve Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Reserve Price (Optional)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Minimum acceptable price"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
          value={formData.price.reservePrice || ''}
          onChange={(e) => handlePriceUpdate('reservePrice', parseFloat(e.target.value) || 0)}
        />
        <p className="text-xs text-gray-500 mt-1">
          If no bids reach this price, the auction will not complete
        </p>
      </div>

      {/* Price Summary */}
      {formData.price.basePrice > 0 && formData.quantity.available > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Auction Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Starting Price:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(formData.price.basePrice)} {formData.price.currency} per {formData.quantity.unit}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Quantity:</span>
              <span className="text-lg font-semibold text-gray-700">
                {formatPrice(formData.quantity.available)} {formData.quantity.unit}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Starting Value:</span>
              <span className="text-lg font-semibold text-[#FF8A00]">
                {formatPrice(formData.price.basePrice * formData.quantity.available)} {formData.price.currency}
              </span>
            </div>

            {formData.price.auctionDuration && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Auction Duration:</span>
                <span className="text-sm font-medium text-gray-700">
                  {bidDurationOptions.find(o => o.value === formData.price.auctionDuration)?.label || formData.price.auctionDuration + ' days'}
                </span>
              </div>
            )}

            {formData.price.reservePrice && formData.price.reservePrice > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reserve Price:</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatPrice(formData.price.reservePrice)} {formData.price.currency} per {formData.quantity.unit}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Pricing Guidelines</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Research market prices for similar materials</p>
              <p>• Consider material quality, quantity, and location</p>
              <p>• Factor in logistics and processing costs for buyers</p>
              <p>• Set reserve prices 10-20% below expected market value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.price.basePrice || !formData.quantity.available || !formData.quantity.unit || !formData.price.auctionDuration) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please set a starting price, available quantity, unit of measurement, and auction duration to continue.
          </p>
        </div>
      )}
    </div>
  );
} 