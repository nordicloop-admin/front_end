import React from 'react';
import { Type, Tag, Info } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function TitleDescriptionStep({ formData, updateFormData }: Props) {
  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !formData.keywords.includes(keyword.trim())) {
      updateFormData({
        keywords: [...formData.keywords, keyword.trim()]
      });
    }
  };

  const handleKeywordRemove = (index: number) => {
    updateFormData({
      keywords: formData.keywords.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Title & Description
        </h3>
        <p className="text-gray-600">
          Create an attractive title and description for your listing
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Type className="inline w-4 h-4 mr-2" />
          Listing Title *
        </label>
        <input
          type="text"
          placeholder="e.g., High-Quality HDPE Post-Industrial Pellets - Food Grade"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Description *
        </label>
        <textarea
          rows={6}
          placeholder="Provide detailed information about your material including quality, applications, and any special features..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/500 characters recommended
        </p>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Tag className="inline w-4 h-4 mr-2" />
          Keywords (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#FF8A00] text-white"
            >
              {keyword}
              <button
                onClick={() => handleKeywordRemove(index)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add keywords separated by commas"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              handleKeywordAdd(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Press Enter or comma to add keywords. These help buyers find your listing.
        </p>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Listing Tips</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Use clear, descriptive titles that include material type and grade</p>
              <p>• Mention key selling points like certifications or special properties</p>
              <p>• Include relevant keywords for better search visibility</p>
              <p>• Be honest and detailed in your description</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      {(!formData.title || !formData.description) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please provide both a title and description for your listing.
          </p>
        </div>
      )}
    </div>
  );
} 