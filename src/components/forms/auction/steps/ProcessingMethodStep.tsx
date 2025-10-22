import React from 'react';
import { Settings, CheckCircle } from 'lucide-react';
import InfoCallout from '@/components/ui/InfoCallout';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const processingMethods = [
  {
    id: 'blow_moulding',
    name: 'Blow moulding',
    description: 'Process for creating hollow plastic parts'
  },
  {
    id: 'injection_moulding',
    name: 'Injection moulding',
    description: 'Molten plastic injected into molds'
  },
  {
    id: 'extrusion',
    name: 'Extrusion',
    description: 'Continuous process creating uniform cross-sections'
  },
  {
    id: 'calendering',
    name: 'Calendering',
    description: 'Process for creating films and sheets'
  },
  {
    id: 'rotational_moulding',
    name: 'Rotational moulding',
    description: 'Hollow parts formed by rotation during heating'
  },
  {
    id: 'sintering',
    name: 'Sintering',
    description: 'Powder compaction and heating process'
  },
  {
    id: 'thermoforming',
    name: 'Thermoforming',
    description: 'Heating and shaping thermoplastic sheets'
  }
];

export function ProcessingMethodStep({ formData, updateFormData }: Props) {
  const handleProcessingUpdate = (field: string, value: any) => {
    updateFormData({
      processing: {
        ...formData.processing,
        [field]: value
      }
    });
  };

  const toggleMethod = (method: string) => {
    const currentMethods = formData.processing.methods || [];
    const isSelected = currentMethods.includes(method);
    
    if (isSelected) {
      handleProcessingUpdate('methods', currentMethods.filter(m => m !== method));
    } else {
      handleProcessingUpdate('methods', [...currentMethods, method]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing methods
        </h3>
        <p className="text-gray-600">
          Select the applicable processing methods.
        </p>
      </div>

      {/* Processing Methods Selection */}
      <div>
        <div className="space-y-3">
          {processingMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              className={`
                w-full p-4 rounded-lg border text-left transition-all
                ${formData.processing.methods?.includes(method.id)
                  ? 'border-[#FF8A00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  ${formData.processing.methods?.includes(method.id)
                    ? 'text-[#FF8A00]'
                    : 'text-gray-400'
                  }
                `}>
                  <Settings className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    {formData.processing.methods?.includes(method.id) && (
                      <CheckCircle className="w-4 h-4 text-[#FF8A00]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Processing Summary */}
      {formData.processing.methods && formData.processing.methods.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Processing Methods</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {formData.processing.methods.map(methodId => {
              const method = processingMethods.find(m => m.id === methodId);
              return (
                <div key={methodId}>
                  <span className="font-medium text-gray-700">•</span> {method?.name}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Information Note */}
      <InfoCallout title="Processing Guidelines" variant="orange" className="mt-2">
        <ul className="list-disc pl-4 space-y-1">
          <li>Select all applicable processing methods</li>
          <li>Multiple methods are allowed</li>
          <li>Helps buyers assess production compatibility</li>
        </ul>
      </InfoCallout>
    </div>
  );
} 