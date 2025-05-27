import React, { useState } from 'react';
import { Plus, X, Info } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const materialGrades = {
  plastics: [
    'Virgin Grade',
    'Industrial Grade',
    'Food Grade',
    'Medical Grade',
    'Automotive Grade',
    'Electrical Grade',
    'Recycled Grade'
  ],
  metals: [
    '1000 Series',
    '2000 Series',
    '3000 Series',
    '4000 Series',
    '5000 Series',
    '6000 Series',
    '7000 Series',
    'Commercial Grade',
    'Industrial Grade'
  ],
  paper: [
    'OCC Grade 11',
    'OCC Grade 12',
    'Mixed Paper Grade 1',
    'Mixed Paper Grade 2',
    'News Grade 8',
    'News Grade 9'
  ]
};

const materialColors = [
  'Natural/Clear',
  'White',
  'Black',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Brown',
  'Gray',
  'Mixed Colors',
  'Custom Color'
];

const materialForms = {
  plastics: [
    'Pellets/Granules',
    'Flakes',
    'Regrind',
    'Sheets',
    'Film',
    'Parts/Components',
    'Powder',
    'Fiber'
  ],
  metals: [
    'Sheets',
    'Coils',
    'Bars',
    'Pipes/Tubes',
    'Scrap',
    'Castings',
    'Extrusions',
    'Wire'
  ],
  paper: [
    'Bales',
    'Loose',
    'Shredded',
    'Rolls',
    'Sheets',
    'Mixed'
  ]
};

export function MaterialSpecificationStep({ formData, updateFormData }: Props) {
  const [customSpec, setCustomSpec] = useState('');

  const handleSpecificationUpdate = (field: string, value: string) => {
    updateFormData({
      specifications: {
        ...formData.specifications,
        [field]: value
      }
    });
  };

  const handleAdditionalSpecsUpdate = (specs: string[]) => {
    updateFormData({
      specifications: {
        ...formData.specifications,
        additionalSpecs: specs
      }
    });
  };

  const addCustomSpecification = () => {
    if (customSpec.trim()) {
      const currentSpecs = formData.specifications.additionalSpecs || [];
      handleAdditionalSpecsUpdate([...currentSpecs, customSpec.trim()]);
      setCustomSpec('');
    }
  };

  const removeCustomSpecification = (index: number) => {
    const currentSpecs = formData.specifications.additionalSpecs || [];
    const newSpecs = currentSpecs.filter((_, i) => i !== index);
    handleAdditionalSpecsUpdate(newSpecs);
  };

  const availableGrades = materialGrades[formData.materialType as keyof typeof materialGrades] || [];
  const availableForms = materialForms[formData.materialType as keyof typeof materialForms] || [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Material Specifications
        </h3>
        <p className="text-gray-600">
          Provide detailed specifications for your {formData.materialType} material
        </p>
      </div>

      {/* Grade Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Material Grade
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableGrades.map((grade) => (
            <button
              key={grade}
              onClick={() => handleSpecificationUpdate('grade', grade)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.specifications.grade === grade
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color
        </label>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {materialColors.map((color) => (
            <button
              key={color}
              onClick={() => handleSpecificationUpdate('color', color)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.specifications.color === color
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Form Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Material Form
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableForms.map((form) => (
            <button
              key={form}
              onClick={() => handleSpecificationUpdate('form', form)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.specifications.form === form
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Specifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Specifications
        </label>
        
        {/* Custom specification input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g., Melt Flow Index: 2.5, Density: 0.95 g/cm³"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
            value={customSpec}
            onChange={(e) => setCustomSpec(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomSpecification()}
          />
          <button
            onClick={addCustomSpecification}
            className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#e67700] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Display added specifications */}
        {formData.specifications.additionalSpecs && formData.specifications.additionalSpecs.length > 0 && (
          <div className="space-y-2">
            {formData.specifications.additionalSpecs.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <span className="text-sm text-gray-700">{spec}</span>
                <button
                  onClick={() => removeCustomSpecification(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Specification Guidelines</h4>
            <p className="text-sm text-blue-700 mt-1">
              Detailed specifications help buyers understand the exact quality and properties of your material. 
              Include technical data like density, melt flow index, tensile strength, or purity levels when available.
            </p>
          </div>
        </div>
      </div>

      {/* Specification Summary */}
      {(formData.specifications.grade || formData.specifications.color || formData.specifications.form) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Current Specifications</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {formData.specifications.grade && (
              <div>
                <span className="font-medium text-gray-700">Grade:</span><br />
                {formData.specifications.grade}
              </div>
            )}
            {formData.specifications.color && (
              <div>
                <span className="font-medium text-gray-700">Color:</span><br />
                {formData.specifications.color}
              </div>
            )}
            {formData.specifications.form && (
              <div>
                <span className="font-medium text-gray-700">Form:</span><br />
                {formData.specifications.form}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 