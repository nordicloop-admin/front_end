import React, { useState, useRef } from 'react';
import { Upload, X, Type, Tag, Info } from 'lucide-react';
import Image from 'next/image';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function ImagesStep({ formData, updateFormData }: Props) {
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

      {/* Validation Requirements Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Step 8 Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Title:</strong> Minimum 10 characters, maximum 255 characters</li>
              <li>• <strong>Description:</strong> Minimum 50 characters (no maximum limit)</li>
              <li>• <strong>Keywords:</strong> Optional, maximum 500 characters total</li>
              <li>• <strong>Image:</strong> At least one image is required (JPEG, PNG, WebP, GIF)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Type className="inline w-4 h-4 mr-2" />
          Listing Title *
          <span className="text-xs text-gray-500 font-normal ml-2">(Minimum 10 characters)</span>
        </label>
        <input
          type="text"
          placeholder="e.g., High-Quality HDPE Post-Industrial Pellets - Food Grade"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg ${
            formData.title.length > 0 && formData.title.trim().length < 10 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300'
          }`}
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          maxLength={255}
        />
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            formData.title.length > 0 && formData.title.trim().length < 10 
              ? 'text-red-500' 
              : 'text-gray-500'
          }`}>
            {formData.title.trim().length}/255 characters 
            {formData.title.length > 0 && formData.title.trim().length < 10 && 
              ` - Need at least ${10 - formData.title.trim().length} more characters`
            }
          </p>
          {formData.title.trim().length >= 10 && (
            <span className="text-xs text-green-600">✓ Valid length</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Description *
          <span className="text-xs text-gray-500 font-normal ml-2">(Minimum 50 characters)</span>
        </label>
        <textarea
          rows={6}
          placeholder="Provide detailed information about your material including quality, applications, and any special features..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm ${
            formData.description.length > 0 && formData.description.trim().length < 50 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300'
          }`}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            formData.description.length > 0 && formData.description.trim().length < 50 
              ? 'text-red-500' 
              : 'text-gray-500'
          }`}>
            {formData.description.trim().length} characters 
            {formData.description.length > 0 && formData.description.trim().length < 50 && 
              ` - Need at least ${50 - formData.description.trim().length} more characters`
            }
          </p>
          {formData.description.trim().length >= 50 && (
            <span className="text-xs text-green-600">✓ Valid length</span>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Tag className="inline w-4 h-4 mr-2" />
          Keywords (Optional)
          <span className="text-xs text-gray-500 font-normal ml-2">(Maximum 500 characters total)</span>
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
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            Press Enter or comma to add keywords. These help buyers find your listing.
          </p>
          <p className={`text-xs ${getKeywordsTextLength() > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
            {getKeywordsTextLength()}/500 characters
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
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
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${dragActive 
                ? 'border-[#FF8A00] bg-orange-50' 
                : 'border-gray-300 hover:border-gray-400'
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
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#e67700] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>
          </div>
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
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Listing Tips</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Use a clear, high-quality image showing the material</p>
              <p>• Create a descriptive title that includes material type and grade</p>
              <p>• Mention key selling points in your description</p>
              <p>• Include relevant keywords for better search visibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      {(!formData.images || formData.images.length === 0 || !formData.title || !formData.description) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please provide a title, description, and image for your listing.
          </p>
        </div>
      )}
    </div>
  );
} 