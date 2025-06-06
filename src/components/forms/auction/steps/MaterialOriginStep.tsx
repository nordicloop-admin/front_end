import React from 'react';
import { Factory, Home, Shuffle } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const materialOrigins = [
  {
    id: 'post_industrial',
    name: 'Post-industrial',
    description: 'Clean production waste from manufacturing processes',
    icon: Factory
  },
  {
    id: 'post_consumer',
    name: 'Post-consumer',
    description: 'Materials that have been used by consumers',
    icon: Home
  },
  {
    id: 'mix',
    name: 'Mix',
    description: 'Combination of post-industrial and post-consumer materials',
    icon: Shuffle
  }
];

export function MaterialOriginStep({ formData, updateFormData }: Props) {
  const handleOriginUpdate = (field: string, value: any) => {
    updateFormData({
      origin: {
        ...formData.origin,
        [field]: value
      }
    });
  };

  const handleOriginSelect = (origin: string) => {
    handleOriginUpdate('source', origin);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Material origin
        </h3>
        <p className="text-gray-600">
          Specify the source of the material.
        </p>
      </div>

      {/* Material Origin Selection */}
      <div>
        <div className="space-y-3">
          {materialOrigins.map((origin) => {
            const Icon = origin.icon;
            return (
              <button
                key={origin.id}
                onClick={() => handleOriginSelect(origin.id)}
                className={`
                  w-full p-6 rounded-lg border-2 text-left transition-all
                  ${formData.origin.source === origin.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    p-3 rounded-md
                    ${formData.origin.source === origin.id
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{origin.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{origin.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Origin Summary */}
      {formData.origin.source && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Material Origin</h4>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Source:</span> {' '}
            {materialOrigins.find(o => o.id === formData.origin.source)?.name}
          </div>
        </div>
      )}

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <Factory className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Material Origin Impact</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Post-industrial materials typically have higher quality and value</p>
              <p>• Post-consumer materials support circular economy goals</p>
              <p>• Mixed materials may require additional sorting and processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {!formData.origin.source && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please select the material origin to continue.
          </p>
        </div>
      )}
    </div>
  );
} 