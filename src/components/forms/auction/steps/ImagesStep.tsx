import React, { useState, useRef } from 'react';
import { Upload, X, Type, Tag, Info, AlertCircle } from 'lucide-react';
import InfoCallout from '../../../ui/InfoCallout';
import Image from 'next/image';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  readonly formData: FormData;
  readonly updateFormData: (updates: Partial<FormData>) => void;
  readonly validationErrors?: Record<string, string[]>;
  readonly showValidationErrors?: boolean;
}

export function ImagesStep({ formData, updateFormData, validationErrors, showValidationErrors }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    setUploadError(null);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (files.length === 0) return;
    
    const file = files[0]; // Only take the first file
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`${file.name} is not a supported image format. Please use JPG, PNG, or WebP.`);
      return;
    }
    
    if (file.size > maxSize) {
      setUploadError(`${file.name} is too large. Maximum file size is 10MB.`);
      return;
    }
    
    // Update with a single image
    updateFormData({ images: [file] });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = () => {
    updateFormData({ images: [] });
  };

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Calculate total keywords text length (as comma-separated string)
  const getKeywordsTextLength = () => {
    return formData.keywords.join(', ').length;
  };

  // Validation helpers
  const isTitleValid = () => {
    return formData.title.trim().length >= 3 && formData.title.length <= 255;
  };

  // Description now optional – always valid (could add max length in future)
  const isDescriptionValid = () => {
    return true;
  };

  const areKeywordsValid = () => {
    return getKeywordsTextLength() <= 500;
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !formData.keywords.includes(keyword.trim())) {
      const currentKeywordsText = formData.keywords.join(', ');
      const newKeywordsText = currentKeywordsText ? `${currentKeywordsText}, ${keyword.trim()}` : keyword.trim();
      
      // Check if adding this keyword would exceed 500 characters
      if (newKeywordsText.length <= 500) {
        updateFormData({
          keywords: [...formData.keywords, keyword.trim()]
        });
      }
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
          Title, Description & Image
        </h3>
        <p className="text-gray-600">
          Create an attractive title and description, and upload an image for your listing
        </p>
      </div>

      {/* Requirements banner removed per request */}

      {/* Validation Errors Summary */}
      {showValidationErrors && validationErrors && Object.keys(validationErrors).length > 0 && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-2">Please fix the following validation errors:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {Object.entries(validationErrors).map(([field, errors]) => (
                  <li key={field}>• <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {errors[0]}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="listing-title" className="block text-sm font-medium text-gray-700 mb-3">
          <Type className="inline w-4 h-4 mr-2" />
          Listing Title *
          <span className="text-xs text-gray-500 font-normal ml-2">(Minimum 3 characters)</span>
        </label>
        <input
          type="text"
          placeholder="e.g., High-Quality HDPE Post-Industrial Pellets - Food Grade"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg ${
            (formData.title.length > 0 && !isTitleValid()) || (showValidationErrors && validationErrors?.title)
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300'
          }`}
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          maxLength={255}
          id="listing-title"
        />
        {/* Validation Error Message */}
        {showValidationErrors && validationErrors?.title && (
          <div className="flex items-center mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            <span className="text-sm font-medium text-red-700">{validationErrors.title[0]}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            (formData.title.length > 0 && !isTitleValid()) || (showValidationErrors && validationErrors?.title)
              ? 'text-red-600 font-medium' 
              : 'text-gray-500'
          }`}>
            {formData.title.trim().length}/255 characters 
            {formData.title.length > 0 && formData.title.trim().length < 3 && 
              ` - Need at least ${3 - formData.title.trim().length} more characters`
            }
          </p>
          {isTitleValid() && !validationErrors?.title && (
            <span className="text-xs text-green-600">✓ Valid length</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="listing-description" className="block text-sm font-medium text-gray-700 mb-3">
          Description (Optional)
        </label>
        <textarea
          placeholder="Describe your material in detail - quality, source, condition, processing history, etc. (optional)"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] resize-vertical min-h-[120px] ${
            (formData.description.length > 0 && !isDescriptionValid()) || (showValidationErrors && validationErrors?.description)
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300'
          }`}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={4}
          id="listing-description"
        />
        {/* Validation Error Message */}
        {showValidationErrors && validationErrors?.description && (
          <div className="flex items-center mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            <span className="text-sm font-medium text-red-700">{validationErrors.description[0]}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            (formData.description.length > 0 && !isDescriptionValid()) || (showValidationErrors && validationErrors?.description)
              ? 'text-red-600 font-medium' 
              : 'text-gray-500'
          }`}>
            {formData.description.trim().length} characters
          </p>
          {isDescriptionValid() && !validationErrors?.description && (
            <span className="text-xs text-green-600">✓ Valid length</span>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label htmlFor="keywords-input" className="block text-sm font-medium text-gray-700 mb-3">
          <Tag className="inline w-4 h-4 mr-2" />
          Keywords (Optional)
          <span className="text-xs text-gray-500 font-normal ml-2">(Maximum 500 characters total)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.keywords.map((keyword) => (
            <span key={`${keyword}`} className="inline-flex items-center px-3 py-1 bg-[#FF8A00] text-white text-sm rounded-full">
              {keyword}
              <button
                onClick={() => handleKeywordRemove(formData.keywords.indexOf(keyword))}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add keywords separated by commas (e.g., HDPE, recycling, food grade)"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm ${
            !areKeywordsValid() || (showValidationErrors && validationErrors?.keywords) ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          disabled={!areKeywordsValid()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              const input = e.currentTarget;
              if (input.value.trim()) {
                handleKeywordAdd(input.value.trim());
                input.value = '';
              }
            }
          }}
          id="keywords-input"
        />
        {/* Validation Error Message */}
        {showValidationErrors && validationErrors?.keywords && (
          <div className="flex items-center mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            <span className="text-sm font-medium text-red-700">{validationErrors.keywords[0]}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            !areKeywordsValid() || (showValidationErrors && validationErrors?.keywords) ? 'text-red-600 font-medium' : 'text-gray-500'
          }`}>
            {getKeywordsTextLength()}/500 characters total
            {!areKeywordsValid() && 
              ` - Exceeded by ${getKeywordsTextLength() - 500} characters`
            }
          </p>
          {areKeywordsValid() && getKeywordsTextLength() > 0 && !validationErrors?.keywords && (
            <span className="text-xs text-green-600">✓ Valid length</span>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div className="pt-4 border-t border-gray-200">
        <label htmlFor="material-image-input" className="block text-sm font-medium text-gray-700 mb-3">
          Material Image *
        </label>
        {formData.images && formData.images.length > 0 ? (
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={createImageUrl(formData.images[0])}
                alt="Material image"
                width={600}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {formData.images[0].name} - {(formData.images[0].size / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>
        ) : (
          <label
            aria-label="Upload material image by clicking or dragging a file"
            htmlFor="material-image-input"
            className={`
              relative rounded-lg p-8 text-center transition-all cursor-pointer
              ${dragActive 
                // ? 'bg-orange-50' 
                // : 'hover:bg-gray-50'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
              id="material-image-input"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop image here or click to upload
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  JPG, PNG, or WebP • Max 10MB
                </p>
                
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                  className="inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#e67700] transition-colors"
                  aria-controls="material-image-input"
                >
                  Choose Image
                </button>
              </div>
            </div>
          </label>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Information Note */}
      <InfoCallout title="Listing Tips" variant="orange" icon={<Info className="h-4 w-4" />}>
        <ul className="space-y-1 list-disc pl-4">
          <li>Use a clear, high-quality image showing the material</li>
          <li>Create a descriptive title including material type and grade</li>
          <li>Mention key selling points in your description</li>
          <li>Include relevant keywords for better search visibility</li>
        </ul>
      </InfoCallout>

      {/* Inline quick guidance when title too short and not yet showing full validation errors */}
      {(!showValidationErrors && formData.title.length > 0 && formData.title.trim().length < 3) && (
        <div className="mt-2">
          <InfoCallout variant="warning" small>
            <p className="text-xs">Title needs at least 3 characters. Description is optional.</p>
          </InfoCallout>
        </div>
      )}
    </div>
  );
} 