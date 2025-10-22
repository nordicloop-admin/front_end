import React from 'react';
import { Factory, Home, Shuffle } from 'lucide-react';
import InfoCallout from '@/components/ui/InfoCallout';
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
                  w-full p-6 rounded-lg border text-left transition-all
                  ${formData.origin.source === origin.id
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`
                    ${formData.origin.source === origin.id
                      ? 'text-[#FF8A00]'
                      : 'text-gray-400'
                    }
                  `}>
                    <Icon className="w-7 h-7" />
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
      <InfoCallout title="Material Origin Impact" variant="orange" className="mt-2">
        <ul className="list-disc pl-4 space-y-1">
          <li>Post-industrial materials often have higher consistent quality</li>
          <li>Post-consumer materials strengthen circular economy outcomes</li>
          <li>Mixed streams may need extra sorting/processing</li>
        </ul>
      </InfoCallout>


    </div>
  );
} 