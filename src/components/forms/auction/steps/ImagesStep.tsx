import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Plus, AlertCircle } from 'lucide-react';
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
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`${file.name} is not a supported image format. Please use JPG, PNG, or WebP.`);
        return;
      }
      if (file.size > maxSize) {
        setUploadError(`${file.name} is too large. Maximum file size is 10MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const currentImages = formData.images || [];
      const newImages = [...currentImages, ...validFiles];
      
      if (newImages.length > 10) {
        setUploadError('Maximum 10 images allowed per listing.');
        return;
      }

      updateFormData({ images: newImages });
    }
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

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: newImages });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    updateFormData({ images: newImages });
  };

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Material Images
        </h3>
        <p className="text-gray-600">
          Upload high-quality images of your material (up to 10 images)
        </p>
      </div>

      {/* Upload Area */}
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
          multiple
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
              Drop images here or click to upload
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              JPG, PNG, or WebP • Max 10MB per image • Up to 10 images
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#e67700] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Choose Images
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {formData.images && formData.images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Uploaded Images ({formData.images.length}/10)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={createImageUrl(image)}
                    alt={`Material image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index < formData.images.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-[#FF8A00] text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Image Info */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {image.name}
                  <br />
                  {(image.size / 1024 / 1024).toFixed(1)}MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Image Guidelines</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Use well-lit, clear photos showing material quality</p>
              <p>• Include close-ups of material texture and any contamination</p>
              <p>• Show packaging and storage conditions</p>
              <p>• The first image will be used as the primary listing image</p>
              <p>• Good quality images increase buyer confidence and bids</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {(!formData.images || formData.images.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            At least one image is recommended to attract buyers and showcase your material quality.
          </p>
        </div>
      )}
    </div>
  );
} 