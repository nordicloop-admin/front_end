import React from 'react';
import { AlertTriangle, CheckCircle, Package, Thermometer } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const contaminationLevels = [
  {
    id: 'clean',
    name: 'Clean',
    description: 'Free from most contaminants, requiring minimal processing before recycling.',
    color: 'green'
  },
  {
    id: 'slightly_contaminated',
    name: 'Slightly Contaminated',
    description: 'Contains some contaminants, may require cleaning or further processing.',
    color: 'yellow'
  },
  {
    id: 'heavily_contaminated',
    name: 'Heavily Contaminated',
    description: 'High levels of non-plastic materials present, requiring extensive processing.',
    color: 'red'
  }
];

const additives = [
  'UV Stabilizer',
  'Antioxidant',
  'Flame retardants',
  'Chlorides',
  'No additives'
];

const storageConditions = [
  {
    id: 'climate_controlled',
    name: 'Climate Controlled',
    description: 'Stored in a temperature and humidity-controlled environment.',
    icon: Thermometer
  },
  {
    id: 'protected_outdoor',
    name: 'Protected Outdoor',
    description: 'Covered or partially protected from the elements but outdoors.',
    icon: Package
  },
  {
    id: 'unprotected_outdoor',
    name: 'Unprotected Outdoor',
    description: 'Exposed to environmental conditions without protection.',
    icon: AlertTriangle
  }
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

  const toggleAdditive = (additive: string) => {
    const currentAdditives = formData.contamination.additives || [];
    const isSelected = currentAdditives.includes(additive);
    
    if (isSelected) {
      handleContaminationUpdate('additives', currentAdditives.filter(a => a !== additive));
    } else {
      handleContaminationUpdate('additives', [...currentAdditives, additive]);
    }
  };

  const handleStorageSelect = (storage: string) => {
    handleContaminationUpdate('storage', storage);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Contamination
        </h3>
        <p className="text-gray-600">
          Indicate the level of contamination to determine the necessary recycling steps.
        </p>
      </div>

      {/* Contamination Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Contamination Level *
        </label>
        <div className="space-y-3">
          {contaminationLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level.id)}
              className={`
                w-full p-4 rounded-lg border text-left transition-all
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
              <div className="flex items-start space-x-3">
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
                  <p className="text-sm text-gray-500 mt-1">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Additives
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select any additives used to enhance material properties.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {additives.map((additive) => (
            <button
              key={additive}
              onClick={() => toggleAdditive(additive)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.contamination.additives?.includes(additive)
                  ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {additive}
            </button>
          ))}
        </div>
      </div>

      {/* Storage Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Storage Conditions
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Describe the storage conditions of the material.
        </p>
        <div className="space-y-3">
          {storageConditions.map((condition) => {
            const Icon = condition.icon;
            return (
              <button
                key={condition.id}
                onClick={() => handleStorageSelect(condition.id)}
                className={`
                  w-full p-4 rounded-lg border text-left transition-all
                  ${formData.contamination.storage === condition.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${formData.contamination.storage === condition.id
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{condition.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{condition.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
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
            {formData.contamination.additives && formData.contamination.additives.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Additives:</span> {' '}
                {formData.contamination.additives.join(', ')}
              </div>
            )}
            {formData.contamination.storage && (
              <div>
                <span className="font-medium text-gray-700">Storage:</span> {' '}
                {storageConditions.find(s => s.id === formData.contamination.storage)?.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {/* {!formData.contamination.level && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please select a contamination level to continue.
          </p>
        </div>
      )} */}
    </div>
  );
} 