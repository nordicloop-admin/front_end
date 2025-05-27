import React from 'react';
import { TrendingUp, TrendingDown, Package2 } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const tradeTypes = [
  {
    id: 'sell' as const,
    name: 'Selling',
    icon: TrendingUp,
    description: 'I want to sell materials',
    color: 'green'
  },
  {
    id: 'buy' as const,
    name: 'Buying',
    icon: TrendingDown,
    description: 'I want to buy materials',
    color: 'blue'
  }
];

const materialSubtypes = {
  plastics: [
    { id: 'post-industrial', name: 'Post-Industrial Plastics' },
    { id: 'post-consumer', name: 'Post-Consumer Plastics' },
    { id: 'virgin-equivalent', name: 'Virgin Equivalent' },
    { id: 'regrind', name: 'Regrind/Flakes' },
    { id: 'pellets', name: 'Pellets/Granules' },
    { id: 'mixed-plastic', name: 'Mixed Plastic Waste' }
  ],
  metals: [
    { id: 'ferrous', name: 'Ferrous Metals' },
    { id: 'non-ferrous', name: 'Non-Ferrous Metals' },
    { id: 'aluminum', name: 'Aluminum' },
    { id: 'copper', name: 'Copper' },
    { id: 'steel', name: 'Steel' },
    { id: 'mixed-metals', name: 'Mixed Metals' }
  ],
  paper: [
    { id: 'cardboard', name: 'Cardboard/OCC' },
    { id: 'office-paper', name: 'Office Paper' },
    { id: 'newspaper', name: 'Newspaper' },
    { id: 'magazines', name: 'Magazines/Catalogs' },
    { id: 'mixed-paper', name: 'Mixed Paper' }
  ],
  glass: [
    { id: 'clear-glass', name: 'Clear Glass' },
    { id: 'colored-glass', name: 'Colored Glass' },
    { id: 'broken-glass', name: 'Broken Glass/Cullet' },
    { id: 'bottles', name: 'Bottles' },
    { id: 'flat-glass', name: 'Flat Glass' }
  ],
  textiles: [
    { id: 'cotton', name: 'Cotton' },
    { id: 'polyester', name: 'Polyester' },
    { id: 'mixed-textiles', name: 'Mixed Textiles' },
    { id: 'clothing', name: 'Used Clothing' },
    { id: 'industrial-textiles', name: 'Industrial Textiles' }
  ],
  wood: [
    { id: 'clean-wood', name: 'Clean Wood' },
    { id: 'treated-wood', name: 'Treated Wood' },
    { id: 'chipboard', name: 'Chipboard/MDF' },
    { id: 'sawdust', name: 'Sawdust/Shavings' },
    { id: 'pallets', name: 'Pallets' }
  ]
};

export function TradeMaterialInfoStep({ formData, updateFormData }: Props) {
  const handleTradeTypeSelect = (tradeType: 'sell' | 'buy') => {
    updateFormData({ tradeType });
  };

  const handleMaterialSubtypeSelect = (materialSubtype: string) => {
    updateFormData({ materialSubtype });
  };

  const availableSubtypes = formData.materialType ? 
    materialSubtypes[formData.materialType as keyof typeof materialSubtypes] || [] : 
    [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Trade Material Information
        </h3>
        <p className="text-gray-600">
          Specify whether you&apos;re buying or selling, and the type of {formData.materialType} material
        </p>
      </div>

      {/* Trade Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What do you want to do? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tradeTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTradeTypeSelect(type.id)}
                className={`
                  p-6 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${formData.tradeType === type.id
                    ? type.color === 'green' 
                      ? 'border-green-500 bg-green-50'
                      : 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    p-3 rounded-md
                    ${formData.tradeType === type.id
                      ? type.color === 'green'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
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

      {/* Material Subtype Selection */}
      {formData.materialType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What specific type of {formData.materialType} do you want to {formData.tradeType}? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSubtypes.map((subtype) => (
              <button
                key={subtype.id}
                onClick={() => handleMaterialSubtypeSelect(subtype.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${formData.materialSubtype === subtype.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${formData.materialSubtype === subtype.id
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Package2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{subtype.name}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Package2 className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Material Classification</h4>
            <p className="text-sm text-blue-700 mt-1">
              Selecting the right material subtype helps buyers find exactly what they need. 
              This classification affects pricing, quality standards, and processing requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.tradeType || !formData.materialSubtype) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please select both trade type and material subtype to continue.
          </p>
        </div>
      )}
    </div>
  );
} 