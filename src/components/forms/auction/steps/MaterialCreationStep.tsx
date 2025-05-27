import React from 'react';
import { Factory, Package, Recycle, Building2 } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const materialTypes = [
  {
    id: 'plastics',
    name: 'Plastics',
    icon: Package,
    description: 'Plastic materials, polymers, and compounds'
  },
  {
    id: 'metals',
    name: 'Metals',
    icon: Factory,
    description: 'Metal scraps, alloys, and raw materials'
  },
  {
    id: 'paper',
    name: 'Paper',
    icon: Package,
    description: 'Paper, cardboard, and fiber materials'
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: Package,
    description: 'Glass materials and fragments'
  },
  {
    id: 'textiles',
    name: 'Textiles',
    icon: Package,
    description: 'Fabric and textile materials'
  },
  {
    id: 'wood',
    name: 'Wood',
    icon: Package,
    description: 'Wood waste and timber materials'
  }
];

const businessTypes = [
  {
    id: 'manufacturer',
    name: 'Manufacturer',
    icon: Factory,
    description: 'Manufacturing company with production waste'
  },
  {
    id: 'recycler',
    name: 'Recycler',
    icon: Recycle,
    description: 'Recycling facility or waste processor'
  },
  {
    id: 'distributor',
    name: 'Distributor',
    icon: Building2,
    description: 'Material distributor or trading company'
  },
  {
    id: 'other',
    name: 'Other',
    icon: Package,
    description: 'Other business type'
  }
];

export function MaterialCreationStep({ formData, updateFormData }: Props) {
  const handleMaterialTypeSelect = (materialType: string) => {
    updateFormData({ materialType });
  };

  const handleBusinessTypeSelect = (businessType: string) => {
    updateFormData({ businessType });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Create New Material Listing
        </h3>
        <p className="text-gray-600">
          Let&apos;s start by understanding what type of material you want to list and your business type
        </p>
      </div>

      {/* Material Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What type of material are you listing? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materialTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleMaterialTypeSelect(type.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${formData.materialType === type.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${formData.materialType === type.id
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What type of business are you? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleBusinessTypeSelect(type.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${formData.businessType === type.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${formData.businessType === type.id
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.materialType || !formData.businessType) && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-600">
            Please select both material type and business type to continue.
          </p>
        </div>
      )}
    </div>
  );
} 