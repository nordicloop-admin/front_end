import React from 'react';
import { DollarSign, TrendingUp, Handshake } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const currencies = [
  'SEK', 'EUR', 'USD', 'GBP', 'NOK', 'DKK'
];

const priceTypes = [
  {
    id: 'auction' as const,
    name: 'Auction',
    icon: TrendingUp,
    description: 'Let buyers bid on your material',
    color: 'orange'
  },
  {
    id: 'fixed' as const,
    name: 'Fixed Price',
    icon: DollarSign,
    description: 'Set a fixed price for immediate purchase',
    color: 'green'
  },
  {
    id: 'negotiable' as const,
    name: 'Negotiable',
    icon: Handshake,
    description: 'Allow price negotiations with buyers',
    color: 'blue'
  }
];

export function PriceStep({ formData, updateFormData }: Props) {
  const handlePriceUpdate = (field: string, value: string | number) => {
    updateFormData({
      price: {
        ...formData.price,
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
          Pricing Information
        </h3>
        <p className="text-gray-600">
          Set your pricing strategy and base price
        </p>
      </div>

      {/* Price Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Pricing Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priceTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handlePriceUpdate('priceType', type.id)}
                className={`
                  p-6 rounded-lg border-2 text-left transition-all hover:scale-105
                  ${formData.price.priceType === type.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-3 rounded-md
                    ${formData.price.priceType === type.id
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Base Price and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {formData.price.priceType === 'auction' ? 'Starting Price' : 'Base Price'} *
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
            Price per {formData.quantity.unit || 'unit'}
          </p>
        </div>

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

      {/* Reserve Price (for auctions) */}
      {formData.price.priceType === 'auction' && (
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
      )}

      {/* Price Summary */}
      {formData.price.basePrice > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {formData.price.priceType === 'auction' ? 'Starting Price:' : 'Price per unit:'}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(formData.price.basePrice)} {formData.price.currency}
              </span>
            </div>
            
            {formData.quantity.available > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value:</span>
                <span className="text-lg font-semibold text-[#FF8A00]">
                  {formatPrice(formData.price.basePrice * formData.quantity.available)} {formData.price.currency}
                </span>
              </div>
            )}

            {formData.price.reservePrice && formData.price.reservePrice > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reserve Price:</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatPrice(formData.price.reservePrice)} {formData.price.currency}
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
              {formData.price.priceType === 'auction' && (
                <p>• Set reserve prices 10-20% below expected market value</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.price.basePrice || !formData.price.priceType) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please select a pricing type and set a base price to continue.
          </p>
        </div>
      )}
    </div>
  );
} 