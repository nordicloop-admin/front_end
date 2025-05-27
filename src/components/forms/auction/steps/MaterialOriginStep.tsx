import React from 'react';
import { Factory, Home, Award, CheckCircle } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const materialSources = [
  {
    id: 'manufacturing',
    name: 'Manufacturing Waste',
    description: 'From production processes, clean and known composition',
    icon: Factory
  },
  {
    id: 'automotive',
    name: 'Automotive Industry',
    description: 'From car manufacturing, parts production',
    icon: Factory
  },
  {
    id: 'electronics',
    name: 'Electronics Industry',
    description: 'From electronic device manufacturing',
    icon: Factory
  },
  {
    id: 'packaging',
    name: 'Packaging Industry',
    description: 'From packaging material production',
    icon: Factory
  },
  {
    id: 'household',
    name: 'Household Collection',
    description: 'From household recycling programs',
    icon: Home
  },
  {
    id: 'commercial',
    name: 'Commercial Collection',
    description: 'From offices, restaurants, retail stores',
    icon: Factory
  }
];

const certifications = [
  'ISO 14001 (Environmental Management)',
  'ISCC PLUS (Sustainability Certification)',
  'GRS (Global Recycled Standard)',
  'RCS (Recycled Claim Standard)',
  'Cradle to Cradle Certified',
  'Ocean Positive',
  'FDA Compliant',
  'Food Contact Approved',
  'REACH Compliant',
  'RoHS Compliant',
  'Other Certification'
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

  const togglePostIndustrial = () => {
    handleOriginUpdate('postIndustrial', !formData.origin.postIndustrial);
    if (formData.origin.postConsumer) {
      handleOriginUpdate('postConsumer', false);
    }
  };

  const togglePostConsumer = () => {
    handleOriginUpdate('postConsumer', !formData.origin.postConsumer);
    if (formData.origin.postIndustrial) {
      handleOriginUpdate('postIndustrial', false);
    }
  };

  const handleSourceSelect = (source: string) => {
    handleOriginUpdate('source', source);
  };

  const toggleCertification = (certification: string) => {
    const currentCerts = formData.origin.certifications || [];
    const isSelected = currentCerts.includes(certification);
    
    if (isSelected) {
      handleOriginUpdate('certifications', currentCerts.filter(c => c !== certification));
    } else {
      handleOriginUpdate('certifications', [...currentCerts, certification]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Material Origin
        </h3>
        <p className="text-gray-600">
          Specify the origin and classification of your material
        </p>
      </div>

      {/* Post-Industrial vs Post-Consumer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Material Classification *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={togglePostIndustrial}
            className={`
              p-6 rounded-lg border-2 text-left transition-all
              ${formData.origin.postIndustrial
                ? 'border-[#FF8A00] bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                p-3 rounded-md
                ${formData.origin.postIndustrial
                  ? 'bg-[#FF8A00] text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <Factory className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">Post-Industrial</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Clean production waste from manufacturing processes. 
                  Never used by end consumers, known composition.
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Higher Value
                  </span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={togglePostConsumer}
            className={`
              p-6 rounded-lg border-2 text-left transition-all
              ${formData.origin.postConsumer
                ? 'border-[#FF8A00] bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                p-3 rounded-md
                ${formData.origin.postConsumer
                  ? 'bg-[#FF8A00] text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <Home className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">Post-Consumer</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Materials that have been used by consumers and collected 
                  through recycling programs.
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Recycled Content
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Material Source */}
      {(formData.origin.postIndustrial || formData.origin.postConsumer) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Specific Source
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {materialSources.map((source) => {
              const Icon = source.icon;
              return (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source.id)}
                  className={`
                    p-4 rounded-lg border text-left transition-all hover:scale-105
                    ${formData.origin.source === source.id
                      ? 'border-[#FF8A00] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      p-2 rounded-md
                      ${formData.origin.source === source.id
                        ? 'bg-[#FF8A00] text-white'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{source.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{source.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Certifications (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certifications.map((certification) => (
            <button
              key={certification}
              onClick={() => toggleCertification(certification)}
              className={`
                p-3 rounded-lg border text-left transition-all
                ${formData.origin.certifications?.includes(certification)
                  ? 'border-[#FF8A00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-1.5 rounded-md
                  ${formData.origin.certifications?.includes(certification)
                    ? 'bg-[#FF8A00] text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{certification}</span>
              </div>
            </button>
          ))}
        </div>
        
        {formData.origin.certifications && formData.origin.certifications.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>{formData.origin.certifications.length} certification(s) selected:</strong> {formData.origin.certifications.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Factory className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Material Origin Impact</h4>
            <p className="text-sm text-blue-700 mt-1">
              Post-industrial materials typically command higher prices due to their cleanliness and consistent quality. 
              Certifications can significantly increase the value and marketability of your materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 