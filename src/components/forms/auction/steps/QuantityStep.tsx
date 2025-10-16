import React from 'react';
import { Package, Scale, Box } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

// Use all units supported by backend - matching Ad.UNIT_CHOICES (singular codes)
const units = [
  'kg', 'ton', 'tonne', 'lb', 'pound',
  'piece', 'unit', 'bale', 'container',
  'm³', 'cubic meter', 'liter', 'gallon', 'meter'
];

const packagingOptions = [
  'Bulk (loose)',
  'Bales',
  'Bags (25kg)',
  'Bags (50kg)',
  'Bags (1000kg/Big bags)',
  'Containers (20ft)',
  'Containers (40ft)',
  'Pallets',
  'Drums',
  'Custom packaging'
];

export function QuantityStep({ formData, updateFormData }: Props) {
  const handleQuantityUpdate = (field: string, value: string | number) => {
    updateFormData({
      quantity: {
        ...formData.quantity,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Quantity Information
        </h3>
        <p className="text-gray-600">
          Specify the quantity available and packaging details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            Total quantity available for sale
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
          <span className="text-gray-500">{formData.quantity.unit || 'unit'}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum quantity buyers must purchase (leave 0 for no minimum)
        </p>
      </div>

      {/* Packaging */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <Box className="inline w-4 h-4 mr-2" />
          Packaging Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {packagingOptions.map((packaging) => (
            <button
              key={packaging}
              onClick={() => handleQuantityUpdate('packaging', packaging)}
              className={`
                p-3 rounded-lg border text-sm text-left transition-all hover:scale-105
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

      {/* Quantity Summary */}
      {(formData.quantity.available > 0 && formData.quantity.unit) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Quantity Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Available:</span><br />
              {formData.quantity.available.toLocaleString()} {formData.quantity.unit}
            </div>
            {formData.quantity.minimumOrder > 0 && (
              <div>
                <span className="font-medium text-gray-700">Minimum Order:</span><br />
                {formData.quantity.minimumOrder.toLocaleString()} {formData.quantity.unit}
              </div>
            )}
            {formData.quantity.packaging && (
              <div>
                <span className="font-medium text-gray-700">Packaging:</span><br />
                {formData.quantity.packaging}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Scale className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Quantity Guidelines</h4>
            <p className="text-sm text-blue-700 mt-1">
              Accurate quantity information helps buyers plan their purchases. Consider logistics 
              and handling when setting minimum order quantities. Proper packaging information 
              affects shipping costs and handling requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.quantity.available || !formData.quantity.unit) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please specify both available quantity and unit of measurement to continue.
          </p>
        </div>
      )}
    </div>
  );
} 