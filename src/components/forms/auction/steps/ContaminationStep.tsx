import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const contaminationLevels = [
  {
    id: 'clean',
    name: 'Clean/Low Contamination',
    description: 'Less than 2% contamination',
    color: 'green'
  },
  {
    id: 'moderate',
    name: 'Moderate Contamination',
    description: '2-10% contamination',
    color: 'yellow'
  },
  {
    id: 'high',
    name: 'High Contamination',
    description: 'More than 10% contamination',
    color: 'red'
  }
];

const contaminationTypes = [
  'Labels/Adhesives',
  'Metal Parts',
  'Paper/Cardboard',
  'Other Plastics',
  'Organic Matter',
  'Paint/Coatings',
  'Textile Fibers',
  'Dirt/Dust',
  'Moisture',
  'Chemical Residues',
  'Unknown Contaminants'
];

export function ContaminationStep({ formData, updateFormData }: Props) {
  const handleContaminationUpdate = (field: string, value: any) => {
    updateFormData({
      contamination: {
        ...formData.contamination,
        [field]: value
      }
    });
  };

  const handleLevelSelect = (level: string) => {
    handleContaminationUpdate('level', level);
  };

  const toggleContaminationType = (type: string) => {
    const currentTypes = formData.contamination.types || [];
    const isSelected = currentTypes.includes(type);
    
    if (isSelected) {
      handleContaminationUpdate('types', currentTypes.filter(t => t !== type));
    } else {
      handleContaminationUpdate('types', [...currentTypes, type]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Contamination Assessment
        </h3>
        <p className="text-gray-600">
          Assess the contamination level and types in your material
        </p>
      </div>

      {/* Contamination Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Overall Contamination Level *
        </label>
        <div className="space-y-3">
          {contaminationLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level.id)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${formData.contamination.level === level.id
                  ? level.color === 'green'
                    ? 'border-green-500 bg-green-50'
                    : level.color === 'yellow'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-md
                  ${formData.contamination.level === level.id
                    ? level.color === 'green'
                      ? 'bg-green-500 text-white'
                      : level.color === 'yellow'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {level.color === 'green' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{level.name}</h4>
                  <p className="text-sm text-gray-500">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contamination Types */}
      {formData.contamination.level && formData.contamination.level !== 'clean' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Types of Contamination Present
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {contaminationTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleContaminationType(type)}
                className={`
                  p-3 rounded-lg border text-sm text-center transition-all
                  ${formData.contamination.types?.includes(type)
                    ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Additional Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Details (Optional)
        </label>
        <textarea
          rows={4}
          placeholder="Describe contamination sources, cleaning efforts, or specific details buyers should know..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
          value={formData.contamination.description}
          onChange={(e) => handleContaminationUpdate('description', e.target.value)}
        />
      </div>

      {/* Contamination Summary */}
      {formData.contamination.level && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Contamination Summary</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Level:</span> {' '}
              {contaminationLevels.find(l => l.id === formData.contamination.level)?.name}
            </div>
            {formData.contamination.types && formData.contamination.types.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Types:</span> {' '}
                {formData.contamination.types.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Quality Impact</h4>
            <p className="text-sm text-blue-700 mt-1">
              Honest contamination assessment builds trust with buyers and ensures fair pricing. 
              Clean materials typically command higher prices and attract more buyers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 