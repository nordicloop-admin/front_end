import React, { useState } from 'react';
import { DollarSign, Scale, Package, Clock, Calendar } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const currencies = ['SEK', 'EUR'];

// Use all units supported by backend - matching Ad.UNIT_CHOICES
const units = [
  'kg', 'tons', 'tonnes', 'lbs', 'pounds',
  'pieces', 'units', 'bales', 'containers',
  'm³', 'cubic_meters', 'liters', 'gallons', 'meters'
];

const bidDurationOptions = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: 'custom', label: 'Custom' }
];

export function PriceStep({ formData, updateFormData }: Props) {
  // Initialize state based on form data
  const [showCustomDuration, setShowCustomDuration] = useState(formData.price.auctionDuration === 'custom');
  const [customEndDate, setCustomEndDate] = useState(formData.price.customEndDate || '');

  const handlePriceUpdate = (field: string, value: string | number | boolean) => {
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

  const handleDurationSelect = (duration: string) => {
    // Force a state update first to ensure UI responds immediately
    setShowCustomDuration(duration === 'custom');
    
    // Create a new price object with all the updates
    const updatedPrice = {
      ...formData.price,
      auctionDuration: duration,
      priceType: 'auction' as const // Type assertion to fix TypeScript error
    };
    
    // If switching away from custom, clear custom fields
    if (duration !== 'custom') {
      updatedPrice.customEndDate = '';
      updatedPrice.customAuctionDuration = 0;
      setCustomEndDate('');
    }
    
    // Update form data with all changes at once
    updateFormData({
      price: updatedPrice
    });
    
    // Force re-render by triggering a state update
    // This ensures the UI reflects the current selection
    setTimeout(() => {
      setShowCustomDuration(duration === 'custom');
    }, 0);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setCustomEndDate(selectedDate);
    
    // Calculate days difference between today and selected date
    const today = new Date();
    const endDate = new Date(selectedDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Create a new price object with all the updates
    const updatedPrice = {
      ...formData.price,
      customEndDate: selectedDate,
      customAuctionDuration: diffDays > 0 ? diffDays : 1,
      auctionDuration: 'custom' as const, // Ensure auctionDuration stays as 'custom'
      priceType: 'auction' as const
    };
    
    // Update form data with all changes at once
    updateFormData({
      price: updatedPrice
    });
  };

  // Calculate minimum date (today) for the date picker
  const today = new Date().toISOString().split('T')[0];
  // Calculate maximum date (90 days from today) for the date picker
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateString = maxDate.toISOString().split('T')[0];

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {bidDurationOptions.map((option) => {
            // Determine if this option is currently selected
            const isSelected = formData.price.auctionDuration === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleDurationSelect(option.value)}
                style={{ cursor: 'pointer' }} /* Explicitly set cursor to pointer */
                className={`
                  p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                  ${isSelected 
                    ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                  hover:cursor-pointer /* Add hover cursor pointer class */
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Custom Duration Calendar */}
        {showCustomDuration && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="w-4 h-4 mr-2 text-[#FF8A00]" />
              <label className="text-sm font-medium text-gray-700">
                Select End Date
              </label>
            </div>
            <input
              type="date"
              min={today}
              max={maxDateString}
              value={customEndDate || formData.price.customEndDate || ''}
              onChange={handleCustomDateChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Select a date up to 90 days from today when the auction should end.
            </p>
          </div>
        )}
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

      {/* Broker Bid Permission */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="allowBrokerBids"
            checked={formData.price.allowBrokerBids ?? true}
            onChange={(e) => handlePriceUpdate('allowBrokerBids', e.target.checked)}
            className="mt-1 h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
          />
          <div className="flex-1">
            <label htmlFor="allowBrokerBids" className="block text-sm font-medium text-gray-700">
              Allow brokers to bid on this material
            </label>
            <p className="text-xs text-gray-500 mt-1">
              If unchecked, brokers will not be able to place bids on this auction
            </p>
          </div>
        </div>
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
                  {formData.price.auctionDuration === 'custom' 
                    ? (formData.price.customAuctionDuration 
                        ? `${formData.price.customAuctionDuration} days` 
                        : 'Custom duration')
                    : bidDurationOptions.find(o => o.value === formData.price.auctionDuration)?.label || 
                      `${formData.price.auctionDuration} days`}
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

            {formData.quantity.packaging && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Packaging:</span>
                <span className="text-sm font-medium text-gray-700">
                  {formData.quantity.packaging}
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