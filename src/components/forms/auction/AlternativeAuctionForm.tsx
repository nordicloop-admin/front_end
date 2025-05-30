"use client";

import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import form steps
import { MaterialTypeStep } from './steps/MaterialTypeStep';
import { MaterialSpecificationStep } from './steps/MaterialSpecificationStep';
import { MaterialOriginStep } from './steps/MaterialOriginStep';
import { ContaminationStep } from './steps/ContaminationStep';
import { ProcessingMethodStep } from './steps/ProcessingMethodStep';
import { LocationLogisticsStep } from './steps/LocationLogisticsStep';
import { PriceStep } from './steps/PriceStep';
import { ImagesStep } from './steps/ImagesStep';

export interface FormData {
  // Material Creation & Type
  materialType: string;
  businessType: string;
  sellFrequency: string;
  category: string;
  subcategory: string;
  specificMaterial: string;
  
  // Material Specification
  specifications: {
    grade?: string;
    color?: string;
    form?: string;
    additionalSpecs?: string[];
  };
  
  // Material Origin
  origin: {
    source: string;
  };
  
  // Contamination
  contamination: {
    level: string;
    additives?: string[];
    storage?: string;
  };
  
  // Processing Method
  processing: {
    methods?: string[];
  };
  
  // Location & Logistics
  location: {
    country: string;
    region: string;
    city: string;
    pickupAvailable: boolean;
    deliveryOptions: string[];
    fullAddress?: string;
  };
  
  // Quantity & Price
  quantity: {
    available: number;
    unit: string;
    minimumOrder: number;
    packaging: string;
  };
  
  price: {
    basePrice: number;
    currency: string;
    priceType: 'auction';
    reservePrice?: number;
    auctionDuration?: string;
  };
  
  // Image, Title & Description
  images: File[];
  title: string;
  description: string;
  keywords: string[];
}

const initialFormData: FormData = {
  materialType: '',
  businessType: '',
  sellFrequency: '',
  category: '',
  subcategory: '',
  specificMaterial: '',
  specifications: {},
  origin: {
    source: ''
  },
  contamination: {
    level: '',
    additives: [],
    storage: ''
  },
  processing: {
    methods: []
  },
  location: {
    country: '',
    region: '',
    city: '',
    pickupAvailable: false,
    deliveryOptions: []
  },
  quantity: {
    available: 0,
    unit: '',
    minimumOrder: 0,
    packaging: ''
  },
  price: {
    basePrice: 0,
    currency: 'SEK',
    priceType: 'auction',
    auctionDuration: '7'
  },
  images: [],
  title: '',
  description: '',
  keywords: []
};

const steps = [
  { id: 1, title: 'Material Type', component: MaterialTypeStep },
  { id: 2, title: 'Specifications', component: MaterialSpecificationStep },
  { id: 3, title: 'Material Origin', component: MaterialOriginStep },
  { id: 4, title: 'Contamination', component: ContaminationStep },
  { id: 5, title: 'Processing Method', component: ProcessingMethodStep },
  { id: 6, title: 'Location & Logistics', component: LocationLogisticsStep },
  { id: 7, title: 'Quantity & Price', component: PriceStep },
  { id: 8, title: 'Image & Description', component: ImagesStep }
];

export function AlternativeAuctionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateStep = (stepId: number): boolean => {
    // Add validation logic for each step
    switch (stepId) {
      case 1:
        return !!(formData.materialType && formData.businessType && formData.sellFrequency && formData.category && formData.subcategory);
      case 2:
        // Specifications are optional
        return true;
      case 3:
        return !!(formData.origin.source);
      case 4:
        return !!(formData.contamination.level);
      case 5:
        return !!(formData.processing.methods && formData.processing.methods.length > 0);
      case 6:
        return !!(formData.location.country && formData.location.city);
      case 7:
        return !!(formData.quantity.available > 0 && formData.quantity.unit && formData.price.basePrice > 0 && formData.price.auctionDuration);
      case 8:
        return !!(formData.images && formData.images.length > 0 && formData.title && formData.description);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.has(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = async () => {
    // Handle form submission
    // TODO: Implement actual submission logic
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Progress Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Step {currentStep} of {steps.length}
          </h2>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#FF8A00] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${step.id === currentStep 
                  ? 'bg-[#FF8A00] text-white' 
                  : completedSteps.has(step.id)
                  ? 'bg-green-100 text-green-700'
                  : step.id < currentStep
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }
              `}
              disabled={step.id > currentStep && !completedSteps.has(step.id)}
            >
              {completedSteps.has(step.id) && (
                <Check className="inline w-3 h-3 mr-1" />
              )}
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        {CurrentStepComponent && (
          <CurrentStepComponent 
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit}
            className="bg-[#FF8A00] hover:bg-[#e67700] text-white flex items-center gap-2"
          >
            Create Auction
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-[#FF8A00] hover:bg-[#e67700] text-white flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 