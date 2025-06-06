"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { adCreationService } from '@/services/ads';
import { getCategories, Category } from '@/services/auction';
import { validateStepData, convertLabelToValue } from '@/utils/adValidation';
import { toast } from 'sonner';
import { adCreationService } from '@/services/ads';
import { getCategories, Category } from '@/services/auction';
import { validateStepData, convertLabelToValue } from '@/utils/adValidation';

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
  tradeType: 'sell' | 'buy' | '';
  businessType: string;
  sellFrequency: string;
  category: string;
  subcategory: string;
  specificMaterial: string;
  materialSubtype: string;
  
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
    customEndDate?: string;
  };
  
  // Image, Title & Description
  images: File[];
  title: string;
  description: string;
  keywords: string[];
}

const initialFormData: FormData = {
  materialType: '',
  tradeType: '',
  businessType: '',
  sellFrequency: '',
  category: '',
  subcategory: '',
  specificMaterial: '',
  materialSubtype: '',
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
    auctionDuration: '7',
    customEndDate: ''
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
  
  // ADS Integration state
  const [adId, setAdId] = useState<number | null>(null);
  const [apiCompletedSteps, setApiCompletedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Categories state for mapping names to IDs
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (_error) {
        toast.error('Failed to load categories');
      } finally {
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, []);

  const findCategoryId = (categoryName: string): number => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!category && categoryName) {
      toast.warning(`Category "${categoryName}" not found, using default`);
    }
    return category?.id || 1; // Default to 1 if not found
  };

  const findSubcategoryId = (categoryName: string, subcategoryName: string): number => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!category) {
      return 1;
    }
    
    const subcategory = category.subcategories.find(sub => sub.name.toLowerCase() === subcategoryName.toLowerCase());
    if (!subcategory && subcategoryName) {
      toast.warning(`Subcategory "${subcategoryName}" not found, using default`);
    }
    return subcategory?.id || 1; // Default to 1 if not found
  };
  
  // ADS Integration state
  const [adId, setAdId] = useState<number | null>(null);
  const [apiCompletedSteps, setApiCompletedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Categories state for mapping names to IDs
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (_error) {
        toast.error('Failed to load categories');
      } finally {
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, []);

  const findCategoryId = (categoryName: string): number => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!category && categoryName) {
      toast.warning(`Category "${categoryName}" not found, using default`);
    }
    return category?.id || 1; // Default to 1 if not found
  };

  const findSubcategoryId = (categoryName: string, subcategoryName: string): number => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!category) {
      return 1;
    }
    
    const subcategory = category.subcategories.find(sub => sub.name.toLowerCase() === subcategoryName.toLowerCase());
    if (!subcategory && subcategoryName) {
      toast.warning(`Subcategory "${subcategoryName}" not found, using default`);
    }
    return subcategory?.id || 1; // Default to 1 if not found
  };

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
    setHasUnsavedChanges(true);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !adId || isSubmitting || !categoriesLoaded) return;

    const timeoutId = setTimeout(async () => {
      await handleAutoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, hasUnsavedChanges, adId, isSubmitting, categoriesLoaded]);

  const convertFormDataToApiData = (step: number, data: FormData): any => {
    switch (step) {
      case 1:
        const step1Data = {
          category_id: findCategoryId(data.category),
          subcategory_id: findSubcategoryId(data.category, data.subcategory),
          specific_material: data.specificMaterial,
          packaging: convertLabelToValue('packaging', data.quantity.packaging),
          material_frequency: convertLabelToValue('material_frequency', data.sellFrequency)
        };
        
        // Debug logging for Step 1 data
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('Step 1 data being sent to backend:', step1Data);
          // eslint-disable-next-line no-console
          console.log('Form data used:', {
            category: data.category,
            subcategory: data.subcategory,
            specificMaterial: data.specificMaterial,
            packaging: data.quantity.packaging,
            sellFrequency: data.sellFrequency
          });
          // eslint-disable-next-line no-console
          console.log('Converted values:', {
            packagingConverted: convertLabelToValue('packaging', data.quantity.packaging),
            frequencyConverted: convertLabelToValue('material_frequency', data.sellFrequency)
          });
        }
        
        return step1Data;
      case 2:
        return {
          specification_id: null,
          additional_specifications: data.specifications.additionalSpecs?.join(', ') || ''
        };
      case 3:
        return {
          origin: convertLabelToValue('origin', data.origin.source)
        };
      case 4:
        return {
          contamination: convertLabelToValue('contamination', data.contamination.level),
          additives: data.contamination.additives?.[0] ? convertLabelToValue('additives', data.contamination.additives[0]) : 'no_additives',
          storage_conditions: data.contamination.storage ? convertLabelToValue('storage_conditions', data.contamination.storage) : 'climate_controlled'
        };
      case 5:
        return {
          processing_methods: Array.isArray(data.processing.methods) 
            ? data.processing.methods.map(method => convertLabelToValue('processing_methods', method))
            : (data.processing.methods ? [convertLabelToValue('processing_methods', data.processing.methods)] : [])
        };
      case 6:
        return {
          location_data: {
            country: data.location.country,
            state_province: data.location.region || undefined,
            city: data.location.city,
            address_line: data.location.fullAddress || undefined,
            postal_code: ''
          },
          pickup_available: Boolean(data.location.pickupAvailable),
          delivery_options: Array.isArray(data.location.deliveryOptions) 
            ? data.location.deliveryOptions.map(option => convertLabelToValue('delivery_options', option))
            : (data.location.deliveryOptions ? [convertLabelToValue('delivery_options', data.location.deliveryOptions)] : [])
        };
      case 7:
        return {
          available_quantity: Number(data.quantity.available),
          unit_of_measurement: convertLabelToValue('unit_of_measurement', data.quantity.unit),
          minimum_order_quantity: Number(data.quantity.minimumOrder),
          starting_bid_price: Number(data.price.basePrice),
          currency: data.price.currency,
          auction_duration: parseInt(data.price.auctionDuration || '7'),
          reserve_price: data.price.reservePrice ? Number(data.price.reservePrice) : undefined
        };
      case 8:
        return {
          title: data.title,
          description: data.description,
          keywords: data.keywords.join(', ')
        };
      default:
        return {};
    }
  };

  const handleAutoSave = async () => {
    if (!adId || currentStep === 1) return; // Skip auto-save for step 1 and if no ad exists

    setIsAutoSaving(true);
    try {
      const stepData = convertFormDataToApiData(currentStep, formData);
      
      // Validate step data before auto-saving (skip step 2 and 8 as they have different validation)
      if (currentStep !== 2 && currentStep !== 8) {
        const validation = validateStepData(currentStep, stepData);
        if (!validation.isValid) {
          // Silent failure for auto-save with invalid data - don't disrupt user
          setIsAutoSaving(false);
          return;
        }
      }
      
      const result = await adCreationService.updateAdStep(currentStep, stepData);
      
      if (result.success) {
        setHasUnsavedChanges(false);
        if (result.data) {
          setApiCompletedSteps(result.data.step_completion_status);
        }
      }
    } catch (_error) {
      // Silent failure for auto-save - don't show error to user
      // Error is handled gracefully without disrupting the user experience
    } finally {
      setIsAutoSaving(false);
    }
  };

  const validateStep8Detailed = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Title validation (minimum 10 characters)
    if (!formData.title || formData.title.trim().length < 10) {
      errors.push('Title must be at least 10 characters long');
    }
    
    // Description validation (minimum 50 characters)
    if (!formData.description || formData.description.trim().length < 50) {
      errors.push('Description must be at least 50 characters long');
    }
    
    // Image validation (at least one image required)
    if (!formData.images || formData.images.length === 0) {
      errors.push('At least one image is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateStep = (stepId: number): boolean => {
    // Add validation logic for each step
    switch (stepId) {
      case 1:
        return !!(formData.materialType && formData.quantity.packaging && formData.sellFrequency && formData.category && formData.subcategory);
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
        // Step 8 validation according to STEP_8_VALIDATION_GUIDE.md
        const titleValid = formData.title && formData.title.trim().length >= 10;
        const descriptionValid = formData.description && formData.description.trim().length >= 50;
        const imagesValid = formData.images && formData.images.length > 0;
        return !!(titleValid && descriptionValid && imagesValid);
        // Step 8 validation according to STEP_8_VALIDATION_GUIDE.md
        const titleValid = formData.title && formData.title.trim().length >= 10;
        const descriptionValid = formData.description && formData.description.trim().length >= 50;
        const imagesValid = formData.images && formData.images.length > 0;
        return !!(titleValid && descriptionValid && imagesValid);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      // Special handling for Step 8 to show detailed validation errors
      if (currentStep === 8) {
        const validation = validateStep8Detailed();
        toast.error('Please fix the following issues:', {
          description: validation.errors.join(', ')
        });
      } else {
        toast.error('Please fill in all required fields');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentStep === 1) {
        // Step 1: Create new ad
        const stepData = convertFormDataToApiData(1, formData);
        
        // Validate step data before sending
        const validation = validateStepData(1, stepData);
        if (!validation.isValid) {
          toast.error('Invalid data format', {
            description: validation.errors.join(', ')
          });
          setIsSubmitting(false);
          return;
        }
        
        const result = await adCreationService.createAdStep1(stepData);

        if (result.success && result.data) {
          setAdId(result.adId);
          setApiCompletedSteps(result.data.step_completion_status);
          setCompletedSteps(prev => new Set([...prev, currentStep]));
          setCurrentStep(currentStep + 1);
          setHasUnsavedChanges(false);
          toast.success('Ad created successfully!');
        } else {
          toast.error('Failed to create ad', {
            description: result.error || 'Please check your data and try again'
          });
        }
      } else {
        // Steps 2-8: Update existing ad
        if (currentStep === 8) {
          // Step 8: Handle file uploads with FormData
          const result = await adCreationService.updateAdStep8WithFiles(
            formData.title,
            formData.description,
            formData.keywords.join(', '),
            formData.images
          );

          if (result.success && result.data) {
            setApiCompletedSteps(result.data.step_completion_status);
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setHasUnsavedChanges(false);
            toast.success(`Step ${currentStep} completed!`);
          } else {
            toast.error(`Failed to update step ${currentStep}`, {
              description: result.error || 'Please check your data and try again'
            });
          }
        } else {
          // Steps 2-7: Regular JSON updates
          const stepData = convertFormDataToApiData(currentStep, formData);
          
          // Validate step data before sending (skip step 2 as it has different validation)
          if (currentStep !== 2) {
            const validation = validateStepData(currentStep, stepData);
            if (!validation.isValid) {
              toast.error('Invalid data format', {
                description: validation.errors.join(', ')
              });
              setIsSubmitting(false);
              return;
            }
          }
          
          const result = await adCreationService.updateAdStep(currentStep, stepData);

          if (result.success && result.data) {
            setApiCompletedSteps(result.data.step_completion_status);
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            if (currentStep < steps.length) {
              setCurrentStep(currentStep + 1);
            }
            setHasUnsavedChanges(false);
            toast.success(`Step ${currentStep} completed!`);
          } else {
            toast.error(`Failed to update step ${currentStep}`, {
              description: result.error || 'Please check your data and try again'
            });
          }
        }
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      // Special handling for Step 8 to show detailed validation errors
      if (currentStep === 8) {
        const validation = validateStep8Detailed();
        toast.error('Please fix the following issues:', {
          description: validation.errors.join(', ')
        });
      } else {
        toast.error('Please fill in all required fields');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentStep === 1) {
        // Step 1: Create new ad
        const stepData = convertFormDataToApiData(1, formData);
        
        // Validate step data before sending
        const validation = validateStepData(1, stepData);
        if (!validation.isValid) {
          toast.error('Invalid data format', {
            description: validation.errors.join(', ')
          });
          setIsSubmitting(false);
          return;
        }
        
        const result = await adCreationService.createAdStep1(stepData);

        if (result.success && result.data) {
          setAdId(result.adId);
          setApiCompletedSteps(result.data.step_completion_status);
          setCompletedSteps(prev => new Set([...prev, currentStep]));
          setCurrentStep(currentStep + 1);
          setHasUnsavedChanges(false);
          toast.success('Ad created successfully!');
        } else {
          toast.error('Failed to create ad', {
            description: result.error || 'Please check your data and try again'
          });
        }
      } else {
        // Steps 2-8: Update existing ad
        if (currentStep === 8) {
          // Step 8: Handle file uploads with FormData
          const result = await adCreationService.updateAdStep8WithFiles(
            formData.title,
            formData.description,
            formData.keywords.join(', '),
            formData.images
          );

          if (result.success && result.data) {
            setApiCompletedSteps(result.data.step_completion_status);
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setHasUnsavedChanges(false);
            toast.success(`Step ${currentStep} completed!`);
          } else {
            toast.error(`Failed to update step ${currentStep}`, {
              description: result.error || 'Please check your data and try again'
            });
          }
        } else {
          // Steps 2-7: Regular JSON updates
          const stepData = convertFormDataToApiData(currentStep, formData);
          
          // Validate step data before sending (skip step 2 as it has different validation)
          if (currentStep !== 2) {
            const validation = validateStepData(currentStep, stepData);
            if (!validation.isValid) {
              toast.error('Invalid data format', {
                description: validation.errors.join(', ')
              });
              setIsSubmitting(false);
              return;
            }
          }
          
          const result = await adCreationService.updateAdStep(currentStep, stepData);

          if (result.success && result.data) {
            setApiCompletedSteps(result.data.step_completion_status);
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            if (currentStep < steps.length) {
              setCurrentStep(currentStep + 1);
            }
            setHasUnsavedChanges(false);
            toast.success(`Step ${currentStep} completed!`);
          } else {
            toast.error(`Failed to update step ${currentStep}`, {
              description: result.error || 'Please check your data and try again'
            });
          }
        }
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or current step
    if (stepId <= currentStep || completedSteps.has(stepId) || apiCompletedSteps[stepId.toString()]) {
    // Allow navigation to completed steps or current step
    if (stepId <= currentStep || completedSteps.has(stepId) || apiCompletedSteps[stepId.toString()]) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(8)) {
      const validation = validateStep8Detailed();
      toast.error('Please fix the following issues:', {
        description: validation.errors.join(', ')
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit final step (Step 8) with file uploads
      const result = await adCreationService.updateAdStep8WithFiles(
        formData.title,
        formData.description,
        formData.keywords.join(', '),
        formData.images
      );

      if (result.success && result.data) {
        if (result.data.is_complete) {
          toast.success('Auction created successfully!', {
            description: 'Your material is now listed for auction.'
          });
          
          // Redirect to the auction or listing page
          window.location.href = '/dashboard/my-auctions';
        } else {
          toast.warning('Ad updated but not complete', {
            description: 'Please complete all required steps.'
          });
        }
      } else {
        toast.error('Failed to create auction', {
          description: result.error || 'Please try again'
        });
      }
    } catch (error) {
      toast.error('Failed to create auction', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
    if (!validateStep(8)) {
      const validation = validateStep8Detailed();
      toast.error('Please fix the following issues:', {
        description: validation.errors.join(', ')
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit final step (Step 8) with file uploads
      const result = await adCreationService.updateAdStep8WithFiles(
        formData.title,
        formData.description,
        formData.keywords.join(', '),
        formData.images
      );

      if (result.success && result.data) {
        if (result.data.is_complete) {
          toast.success('Auction created successfully!', {
            description: 'Your material is now listed for auction.'
          });
          
          // Redirect to the auction or listing page
          window.location.href = '/dashboard/my-auctions';
        } else {
          toast.warning('Ad updated but not complete', {
            description: 'Please complete all required steps.'
          });
        }
      } else {
        toast.error('Failed to create auction', {
          description: result.error || 'Please try again'
        });
      }
    } catch (error) {
      toast.error('Failed to create auction', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex items-center gap-3">
            {isAutoSaving && (
              <div className="flex items-center text-sm text-gray-500">
                <Save className="w-4 h-4 mr-1 animate-pulse" />
                Auto-saving...
              </div>
            )}
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAutoSaving && (
              <div className="flex items-center text-sm text-gray-500">
                <Save className="w-4 h-4 mr-1 animate-pulse" />
                Auto-saving...
              </div>
            )}
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
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
          {steps.map((step) => {
            const isApiCompleted = apiCompletedSteps[step.id.toString()] || false;
            const isLocalCompleted = completedSteps.has(step.id);
            const isCompleted = isApiCompleted || isLocalCompleted;
            
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${step.id === currentStep 
                    ? 'bg-[#FF8A00] text-white' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : step.id < currentStep
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
                disabled={step.id > currentStep && !isCompleted}
              >
                {isCompleted && (
                  <Check className="inline w-3 h-3 mr-1" />
                )}
                {step.title}
              </button>
            );
          })}
          {steps.map((step) => {
            const isApiCompleted = apiCompletedSteps[step.id.toString()] || false;
            const isLocalCompleted = completedSteps.has(step.id);
            const isCompleted = isApiCompleted || isLocalCompleted;
            
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${step.id === currentStep 
                    ? 'bg-[#FF8A00] text-white' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : step.id < currentStep
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
                disabled={step.id > currentStep && !isCompleted}
              >
                {isCompleted && (
                  <Check className="inline w-3 h-3 mr-1" />
                )}
                {step.title}
              </button>
            );
          })}
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
          disabled={currentStep === 1 || isSubmitting}
          disabled={currentStep === 1 || isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            disabled={isSubmitting}
            className="bg-[#FF8A00] hover:bg-[#e67700] text-white flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                Creating Auction...
              </>
            ) : (
              <>
                Create Auction
                <Check className="w-4 h-4" />
              </>
            )}
            {isSubmitting ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                Creating Auction...
              </>
            ) : (
              <>
                Create Auction
                <Check className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            disabled={isSubmitting}
            className="bg-[#FF8A00] hover:bg-[#e67700] text-white flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            {isSubmitting ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
} 