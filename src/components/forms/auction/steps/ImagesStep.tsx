import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function ImagesStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Material Images
        </h3>
        <p className="text-gray-600">
          Upload high-quality images of your material
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Coming Soon</h4>
            <p className="text-sm text-blue-700 mt-1">
              Image upload functionality will be available in the next update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 