"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { adCreationService } from '@/services/ads';
import { getCategories, Category, getAdDetails } from '@/services/auction';
import { validateStepData, convertLabelToValue, convertValueToLabel } from '@/utils/adValidation';

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
    customAuctionDuration?: number;
    allowBrokerBids?: boolean;
  };
  
  // Image, Title & Description
  images: File[];
  title: string;
  description: string;
  keywords: string[];
}

export interface AlternativeAuctionFormProps {
  isEditMode?: boolean;
  auctionId?: number | null;
  onClose?: () => void;
  onAuctionUpdated?: () => void;
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
    customEndDate: '',
    customAuctionDuration: 0,
    allowBrokerBids: true
  },
  images: [],
  title: '',
  description: '',
  keywords: []
};

// Define all possible steps
const allSteps = [
  { id: 1, title: 'Material Type', component: MaterialTypeStep },
  { id: 2, title: 'Specifications', component: MaterialSpecificationStep },
  { id: 3, title: 'Material Origin', component: MaterialOriginStep },
  { id: 4, title: 'Contamination', component: ContaminationStep },
  { id: 5, title: 'Processing Method', component: ProcessingMethodStep },
  { id: 6, title: 'Location & Logistics', component: LocationLogisticsStep },
  { id: 7, title: 'Quantity & Price', component: PriceStep },
  { id: 8, title: 'Image & Description', component: ImagesStep }
];

// Function to get steps based on material type
const getStepsByMaterialType = (materialType: string) => {
  // For plastics, show all steps
  if (materialType.toLowerCase() === 'plastic' || materialType.toLowerCase() === 'plastics') {
    return allSteps;
  }
  
  // For all other materials, skip steps 2-5
  return [
    allSteps[0], // Material Type
    { id: 2, title: 'Location & Logistics', component: LocationLogisticsStep },
    { id: 3, title: 'Quantity & Price', component: PriceStep },
    { id: 4, title: 'Image & Description', component: ImagesStep }
  ];
};

export function AlternativeAuctionForm({ 
  isEditMode = false, 
  auctionId = null,
  onClose,
  onAuctionUpdated
}: AlternativeAuctionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [steps, setSteps] = useState(getStepsByMaterialType(''));
  
  // ADS Integration state
  const [adId, setAdId] = useState<number | null>(null);
  const [apiCompletedSteps, setApiCompletedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Categories state for mapping names to IDs
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // NEW: Validation state for better UX
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

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

  /**
   * Maps frontend step IDs to backend API step IDs based on material type
   * For plastics, the mapping is 1:1 (frontend step = backend step)
   * For other materials, we need to map the 4 frontend steps to the correct backend steps
   */
  const mapFrontendStepToBackendStep = useCallback((frontendStepId: number, materialType?: string): number => {
    const type = materialType || formData.materialType;
    // Step 1 is always the same for all material types
    if (frontendStepId === 1) return 1;
    
    // For plastics, the mapping is 1:1
    const isPlasticMaterial = type?.toLowerCase().includes('plastic');
    if (isPlasticMaterial) return frontendStepId;
    
    // For other materials, map frontend steps 2, 3, 4 to backend steps 6, 7, 8
    switch (frontendStepId) {
      case 2: return 6; // Location & Logistics (frontend step 2) maps to backend step 6
      case 3: return 7; // Quantity & Price (frontend step 3) maps to backend step 7
      case 4: return 8; // Image & Description (frontend step 4) maps to backend step 8
      default: return frontendStepId; // Fallback (should not happen)
    }
  }, [formData.materialType]);

  // Effect to load and populate form data in edit mode
  useEffect(() => {
    if (isEditMode && auctionId && categoriesLoaded) {
      const fetchAndSetAuctionData = async () => {
        const response = await getAdDetails(auctionId);
        if (!response.error && response.data) {
          const adData = response.data.data;
          
          // Transform API data to frontend format
          const transformedData: Partial<FormData> = {
            materialType: adData.category_name,
            tradeType: 'sell', // Assuming default
            businessType: '', // Assuming default
            sellFrequency: convertValueToLabel('material_frequency', adData.material_frequency),
            category: adData.category_name,
            subcategory: adData.subcategory_name,
            specificMaterial: adData.specific_material,
            specifications: {
              additionalSpecs: adData.additional_specifications?.split(',').map(s => s.trim()) || [],
            },
            origin: {
              source: adData.origin ? convertValueToLabel('origin', adData.origin) : '',
            },
            contamination: {
              level: adData.contamination ? convertValueToLabel('contamination', adData.contamination) : '',
              additives: adData.additives ? [convertValueToLabel('additives', adData.additives)] : [],
              storage: adData.storage_conditions ? convertValueToLabel('storage_conditions', adData.storage_conditions) : '',
            },
            processing: {
              methods: adData.processing_methods?.map(m => convertValueToLabel('processing_methods', m)) || [],
            },
            location: {
              country: adData.location?.country || '',
              region: adData.location?.state_province || '',
              city: adData.location?.city || '',
              deliveryOptions: adData.delivery_options?.map(o => convertValueToLabel('delivery_options', o)) || [],
              fullAddress: adData.location?.address_line || '',
            },
            quantity: {
              available: adData.available_quantity || 0,
              unit: convertValueToLabel('unit_of_measurement', adData.unit_of_measurement),
              minimumOrder: parseInt(adData.minimum_order_quantity) || 0,
              packaging: convertValueToLabel('packaging', adData.packaging),
            },
            price: {
              basePrice: adData.starting_bid_price || 0,
              currency: adData.currency,
              priceType: 'auction',
              reservePrice: adData.reserve_price || undefined,
              auctionDuration: adData.auction_duration?.toString(),
              customAuctionDuration: adData.auction_duration,
              allowBrokerBids: adData.allow_broker_bids,
            },
            images: [], // Images are handled separately and not re-downloaded
            title: adData.title || undefined,
            description: adData.description || undefined,
            keywords: adData.keywords?.split(',').map(k => k.trim()) || [],
          };

          setFormData(prev => ({ ...prev, ...transformedData }));
          setAdId(adData.id);
          
          const newSteps = getStepsByMaterialType(adData.category_name);
          setSteps(newSteps);

          // Set completion status from backend
          const apiStatus = adData.step_completion_status || {};
          setApiCompletedSteps(apiStatus);
          
          const completed = new Set<number>();
          newSteps.forEach(step => {
            const backendStepId = mapFrontendStepToBackendStep(step.id, adData.category_name);
            if (apiStatus[backendStepId.toString()]) {
              completed.add(step.id);
            }
          });
          setCompletedSteps(completed);
          
          // Set current step
          const nextIncompleteFrontendStep = newSteps.find(step => {
            const backendStepId = mapFrontendStepToBackendStep(step.id, adData.category_name);
            return !apiStatus[backendStepId.toString()];
          });

          setCurrentStep(nextIncompleteFrontendStep ? nextIncompleteFrontendStep.id : newSteps.length);
        } else {
          toast.error("Failed to load auction data for editing.");
          if (onClose) onClose();
        }
      };

      fetchAndSetAuctionData();
    }
  }, [isEditMode, auctionId, categoriesLoaded, onClose, mapFrontendStepToBackendStep]);

  const findCategoryId = useCallback((categoryName: string): number => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    return category ? category.id : 0;
  }, [categories]);

  const findSubcategoryId = useCallback((categoryName: string, subcategoryName: string): number => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!category) return 0;
    
    const subcategory = category.subcategories.find(sub => sub.name.toLowerCase() === subcategoryName.toLowerCase());
    return subcategory ? subcategory.id : 0;
  }, [categories]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      setHasUnsavedChanges(true);
      
      // If material type is being updated, update the steps
      if (updates.materialType !== undefined && updates.materialType !== prev.materialType) {
        setSteps(getStepsByMaterialType(updates.materialType));
        // Reset completed steps when material type changes
        setCompletedSteps(new Set([]));
      }
      
      return newData;
    });
  }, []);

  const convertFormDataToApiData = useCallback((step: number, data: FormData): any => {
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
          // Debug information is processed but not logged to console in production
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
          delivery_options: Array.isArray(data.location.deliveryOptions) 
            ? data.location.deliveryOptions.map(option => convertLabelToValue('delivery_options', option))
            : (data.location.deliveryOptions ? [convertLabelToValue('delivery_options', data.location.deliveryOptions)] : [])
        };
      case 7:
        // Handle custom auction duration properly
        const isCustomDuration = data.price.auctionDuration === 'custom';
        const auctionDurationValue = isCustomDuration ? 0 : parseInt(data.price.auctionDuration || '7');
        const customDurationValue = isCustomDuration && data.price.customAuctionDuration ? data.price.customAuctionDuration : undefined;
        
        const step7Data: any = {
          available_quantity: Number(data.quantity.available),
          unit_of_measurement: convertLabelToValue('unit_of_measurement', data.quantity.unit),
          minimum_order_quantity: Number(data.quantity.minimumOrder),
          starting_bid_price: Number(data.price.basePrice),
          currency: data.price.currency,
          auction_duration: auctionDurationValue,
          reserve_price: data.price.reservePrice ? Number(data.price.reservePrice) : undefined,
          allow_broker_bids: data.price.allowBrokerBids ?? true
        };
        
        // Add custom auction duration if applicable
        if (customDurationValue) {
          step7Data.custom_auction_duration = customDurationValue;
        }
        
        return step7Data;
      case 8:
        return {
          title: data.title,
          description: data.description,
          keywords: data.keywords.join(', ')
        };
      default:
        return {};
    }
  }, [findCategoryId, findSubcategoryId]);



  const handleAutoSave = useCallback(async () => {
    if (!adId || !hasUnsavedChanges || !categoriesLoaded) return;
    
    // Find the current step title
    const currentStepObj = steps.find(step => step.id === currentStep);
    const currentStepTitle = currentStepObj?.title || '';
    
    // Skip autosave for the final "Image & Description" step
    if (currentStepTitle === 'Image & Description') {
      return;
    }

    setIsAutoSaving(true);

    try {
      // Map frontend step to backend API step
      const backendStepId = mapFrontendStepToBackendStep(currentStep);
      
      // Debug logging for auto-save step mapping (only in development)
      if (process.env.NODE_ENV === 'development') {
        // Find the current step title
        const currentStepObj = steps.find(step => step.id === currentStep);
        const _currentStepTitle = currentStepObj?.title || '';
        // Step mapping information removed to comply with ESLint rules
      }
      
      // Convert form data based on the backend step ID
      const stepData = convertFormDataToApiData(backendStepId, formData);
      
      // Use the existing service for consistency with the correct backend step ID
      const result = await adCreationService.updateAdStep(backendStepId, stepData);
      
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
  }, [adId, currentStep, formData, convertFormDataToApiData, hasUnsavedChanges, categoriesLoaded, mapFrontendStepToBackendStep, steps]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !adId || isSubmitting || !categoriesLoaded) return;

    const timeoutId = setTimeout(async () => {
      await handleAutoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [hasUnsavedChanges, adId, isSubmitting, categoriesLoaded, handleAutoSave]);

  const validateStep8Detailed = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};
    
    // Title validation (minimum 3 characters)
    if (!formData.title || formData.title.trim().length < 3) {
      const titleError = 'Title must be at least 3 characters long';
      errors.push(titleError);
      fieldErrors.title = [titleError];
    } else if (formData.title.length > 255) {
      const titleError = 'Title must not exceed 255 characters';
      errors.push(titleError);
      fieldErrors.title = [titleError];
    }
    
    // Description now optional – no validation required
    
    // Keywords validation (optional, but if provided, max 500 chars total)
    const keywordsText = formData.keywords.join(', ');
    if (keywordsText.length > 500) {
      const keywordsError = 'Keywords must not exceed 500 characters total';
      errors.push(keywordsError);
      fieldErrors.keywords = [keywordsError];
    }
    
    // Image validation (at least one image required)
    if (!formData.images || formData.images.length === 0) {
      const imageError = 'At least one image is required';
      errors.push(imageError);
      fieldErrors.images = [imageError];
    }
    
    // Update validation state
    setValidationErrors(fieldErrors);
    setShowValidationErrors(errors.length > 0);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateCurrentStepDetailed = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    let isValid = true;

    // Find the actual step object based on current step index
    const currentStepObj = steps.find(step => step.id === currentStep);
    if (!currentStepObj) {
      errors.push('Invalid step');
      return { isValid: false, errors };
    }

    // Use the step title to determine which validation to run
    const stepTitle = currentStepObj.title;

    switch (stepTitle) {
      case 'Material Type':
        if (!formData.materialType) {
          errors.push('Material type is required');
          isValid = false;
        }
        if (!formData.category) {
          errors.push('Category is required');
          isValid = false;
        }
        if (!formData.subcategory) {
          errors.push('Subcategory is required');
          isValid = false;
        }
        if (!formData.quantity.packaging) {
          errors.push('Packaging type is required');
          isValid = false;
        }
        if (!formData.sellFrequency) {
          errors.push('Sell frequency is required');
          isValid = false;
        }
        break;

      case 'Specifications':
        // Allow empty specifications
        break;

      case 'Material Origin':
        if (!formData.origin.source) {
          errors.push('Material origin is required');
          isValid = false;
        }
        break;

      case 'Contamination':
        if (!formData.contamination.level) {
          errors.push('Contamination level is required');
          isValid = false;
        }
        break;

      case 'Processing Method':
        // Allow empty processing methods
        break;

      case 'Location & Logistics':
        if (!formData.location.country) {
          errors.push('Country is required');
          isValid = false;
        }
        if (!formData.location.region) {
          errors.push('Region is required');
          isValid = false;
        }
        if (!formData.location.city) {
          errors.push('City is required');
          isValid = false;
        }
        break;

      case 'Quantity & Price':
        if (formData.quantity.available <= 0) {
          errors.push('Available quantity must be greater than 0');
          isValid = false;
        }
        if (!formData.quantity.unit) {
          errors.push('Unit of measurement is required');
          isValid = false;
        }
        if (formData.quantity.minimumOrder < 0) {
          errors.push('Minimum order quantity must be greater than or equal to 0');
          isValid = false;
        }
        if (formData.price.basePrice <= 0) {
          errors.push('Base price must be greater than 0');
          isValid = false;
        }
        const hasValidAuctionDuration = formData.price.auctionDuration && 
          (formData.price.auctionDuration !== 'custom' || 
           (formData.price.auctionDuration === 'custom' && formData.price.customAuctionDuration && formData.price.customAuctionDuration > 0));
        if (!hasValidAuctionDuration) {
          errors.push('Valid auction duration is required');
          isValid = false;
        }
        break;

      case 'Image & Description':
        return validateStep8Detailed();

      default:
        break;
    }

    // Update validation state
    setValidationErrors(errors.reduce((acc, error) => ({ ...acc, [error]: [error] }), {}));
    setShowValidationErrors(errors.length > 0);

    return {
      isValid,
      errors
    };
  };

  const validateStep = useCallback((stepId: number): boolean => {
    // Find the actual step object based on step ID
    const stepObj = steps.find(step => step.id === stepId);
    if (!stepObj) return false;
    
    // Use the step title to determine which validation to run
    const stepTitle = stepObj.title;
    
    switch (stepTitle) {
      case 'Material Type':
        return !!formData.materialType && 
               !!formData.category && 
               !!formData.subcategory && 
               !!formData.quantity.packaging && 
               !!formData.sellFrequency;
      
      case 'Specifications':
        // Allow empty specifications
        return true;
      
      case 'Material Origin':
        return !!formData.origin.source;
      
      case 'Contamination':
        return !!formData.contamination.level;
      
      case 'Processing Method':
        // Allow empty processing methods
        return true;
        
      case 'Location & Logistics':
        return !!formData.location.country && 
               !!formData.location.region && 
               !!formData.location.city;
      
      case 'Quantity & Price':
        return formData.quantity.available > 0 && 
               !!formData.quantity.unit && 
               formData.quantity.minimumOrder >= 0 && 
               formData.price.basePrice > 0;
      
      case 'Image & Description':
        return !!formData.title && 
               formData.title.trim().length >= 3 && 
               !!formData.images &&
               formData.images.length > 0;
      
      default:
        return false;
    }
  }, [formData, steps]);

  const handleNext = async () => {
    // Clear previous validation errors
    setValidationErrors({});
    setShowValidationErrors(false);

    if (!validateStep(currentStep)) {
      const validation = validateCurrentStepDetailed();
      toast.error('Please fix the validation errors', {
        description: validation.errors.join(', ')
      });
      return;
    }
    
    // If this is step 1 and material type has been selected, update steps
    if (currentStep === 1 && formData.materialType) {
      setSteps(getStepsByMaterialType(formData.materialType));
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
        // Get the current step title to determine which step we're on
        const currentStepObj = steps.find(step => step.id === currentStep);
        const currentStepTitle = currentStepObj?.title || '';
        
        // Map frontend step to backend API step
        const backendStepId = mapFrontendStepToBackendStep(currentStep);
        
        // Debug logging for step mapping (only in development)
        if (process.env.NODE_ENV === 'development') {
          // Step mapping and material type logging removed to comply with ESLint rules
        }
        
        // Handle final step with file uploads separately
        if (currentStepTitle === 'Image & Description') {
          // Validate image data before sending
          if (!formData.title || formData.title.trim().length < 3) {
            toast.error('Title validation failed', {
              description: 'Title must be at least 3 characters long'
            });
            setIsSubmitting(false);
            return;
          }
          // Description optional – no check
          
          // Check if at least one image is provided
          if (!formData.images || formData.images.length === 0) {
            toast.error('Image validation failed', {
              description: 'At least one image is required for a new ad. For edits, you can skip if images already exist.'
            });
            setIsSubmitting(false);
            return;
          }
          
          // Final step: Handle file uploads with FormData
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
            toast.success(`Step ${currentStep} updated!`);
            if (isEditMode && onAuctionUpdated) {
              onAuctionUpdated();
            }
          } else {
            toast.error(`Failed to update step ${currentStep}`, {
              description: result.error || 'Please check your data and try again'
            });
          }
        } else {
          // All other steps: Regular JSON updates
          // Convert form data based on the backend step ID
          const stepData = convertFormDataToApiData(backendStepId, formData);
          
          // Validate step data before sending (skip specifications step as it has different validation)
          if (currentStepTitle !== 'Specifications') {
            const validation = validateStepData(backendStepId, stepData);
            if (!validation.isValid) {
              toast.error('Invalid data format', {
                description: validation.errors.join(', ')
              });
              setIsSubmitting(false);
              return;
            }
          }
          
          // Call the API with the correct backend step ID
          const result = await adCreationService.updateAdStep(backendStepId, stepData);

          if (result.success && result.data) {
            setApiCompletedSteps(result.data.step_completion_status);
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            if (currentStep < steps.length) {
              setCurrentStep(currentStep + 1);
            }
            setHasUnsavedChanges(false);
            toast.success(`Step ${currentStep} updated!`);
             if (isEditMode && onAuctionUpdated) {
              onAuctionUpdated();
            }
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
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = async () => {
    // Clear previous validation errors
    setValidationErrors({});
    setShowValidationErrors(false);

    // Check if we have all required data for step 8
    if (!formData.title || formData.title.trim().length < 3) {
      toast.error('Please enter a title with at least 3 characters');
      return;
    }
    // Description optional – no validation

    if (!formData.images || formData.images.length === 0) {
      // In edit mode, images might already exist, so this check is not always required.
      // We can rely on the backend to enforce this if no images have ever been uploaded.
      if (!isEditMode) {
        toast.error('Please upload at least one image');
        return;
      }
    }
    
    // If we get here, all validation has passed
    // Development logging removed to comply with ESLint rules

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
          toast.success(isEditMode ? 'Auction updated successfully!' : 'Auction created successfully!', {
            description: 'Your material is now listed for auction.'
          });
          
          if (onAuctionUpdated) onAuctionUpdated();
          if (onClose) onClose();

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

  // Find the current step component based on the current step ID
  const currentStepObj = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepObj?.component;

  // Real-time calculation of completed steps based on current form data
  const calculateCompletedSteps = useCallback(() => {
    const completed = new Set<number>();
    
    steps.forEach(step => {
      if (validateStep(step.id)) {
        completed.add(step.id);
      }
    });
    
    return completed;
  }, [steps, validateStep]);

  // Get real-time completed steps
  const realTimeCompletedSteps = calculateCompletedSteps();
  const totalCompleted = realTimeCompletedSteps.size;
  const progressPercentage = steps.length > 0 ? (totalCompleted / steps.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Progress Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Auction' : `Step ${currentStep} of ${steps.length}`}
          </h2>
          <div className="flex items-center gap-3">
            {isAutoSaving && (
              <div className="flex items-center text-sm text-gray-500">
                <Save className="w-4 h-4 mr-1 animate-pulse" />
                Auto-saving...
              </div>
            )}
            <span className="text-sm text-gray-500">
              {totalCompleted} of {steps.length} steps completed
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#FF8A00] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => {
            const isApiCompleted = apiCompletedSteps[step.id.toString()] || false;
            const isLocalCompleted = completedSteps.has(step.id);
            const isRealTimeCompleted = realTimeCompletedSteps.has(step.id);
            const isCompleted = isApiCompleted || isLocalCompleted || isRealTimeCompleted;
            
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
        {/* Validation Errors Summary for non-step-8 components */}
        {showValidationErrors && validationErrors && Object.keys(validationErrors).length > 0 && currentStep !== 8 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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

        {CurrentStepComponent && (
          <CurrentStepComponent 
            formData={formData}
            updateFormData={updateFormData}
            validationErrors={validationErrors}
            showValidationErrors={showValidationErrors}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
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
            className="bg-[#FF8A00] hover:bg-[#e67700] text-white flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {isEditMode ? 'Update Auction' : 'Create Auction'}
                <Check className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
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
          </Button>
        )}
      </div>
    </div>
  );
}