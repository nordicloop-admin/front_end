"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, ChevronLeft, ChevronRight, Save, AlertCircle, Package, Box, Recycle, Factory, Thermometer, Upload, MapPin, Search, CheckCircle, Globe, Truck, MapPinned, Info } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getCategories, Category } from '@/services/auction';
import { adUpdateService } from '@/services/ads';
import { getFullImageUrl } from '@/utils/imageUtils';
import { getCategoryImage } from '@/utils/categoryImages';
import { convertLabelToValue } from '@/utils/adValidation';
import { useGoogleMaps, usePlacesAutocomplete } from '@/hooks/useGoogleMaps';
import { toast } from 'sonner';
import Modal from '@/components/ui/modal';

// Import comprehensive data from the auction creation form
const packagingOptions = [
  {
    id: 'baled',
    name: 'Baled',
    icon: Box,
    description: 'Material compressed into bales'
  },
  {
    id: 'loose',
    name: 'Loose',
    icon: Package,
    description: 'Loose material without specific packaging'
  },
  {
    id: 'big_bag',
    name: 'Big-bag',
    icon: Package,
    description: 'Material in large industrial bags'
  },
  {
    id: 'octabin',
    name: 'Octabin',
    icon: Box,
    description: 'Octagonal bulk container packaging'
  },
  {
    id: 'roles',
    name: 'Roles',
    icon: Recycle,
    description: 'Material in rolled form'
  },
  {
    id: 'container',
    name: 'Container',
    icon: Box,
    description: 'Material in shipping containers'
  },
  {
    id: 'other',
    name: 'Other',
    icon: Package,
    description: 'Other packaging type'
  }
];

const sellFrequencies = [
  { id: 'one_time', name: 'One-time' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'bi_weekly', name: 'Bi-weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'quarterly', name: 'Quarterly' },
  { id: 'yearly', name: 'Yearly' }
];

const materialGrades = {
  plastics: [
    'Virgin Grade',
    'Industrial Grade',
    'Food Grade',
    'Medical Grade',
    'Automotive Grade',
    'Electrical Grade',
    'Recycled Grade'
  ],
  metals: [
    '1000 Series',
    '2000 Series',
    '3000 Series',
    '4000 Series',
    '5000 Series',
    '6000 Series',
    '7000 Series',
    'Commercial Grade',
    'Industrial Grade'
  ],
  paper: [
    'OCC Grade 11',
    'OCC Grade 12',
    'Mixed Paper Grade 1',
    'Mixed Paper Grade 2',
    'News Grade 8',
    'News Grade 9'
  ],
  default: [
    'Premium Grade',
    'Commercial Grade',
    'Industrial Grade',
    'Standard Grade'
  ]
};

const materialColors = [
  'Natural/Clear',
  'White',
  'Black',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Brown',
  'Gray',
  'Mixed Colors',
  'Custom Color'
];

const materialForms = {
  plastics: [
    'Pellets/Granules',
    'Flakes',
    'Regrind',
    'Sheets',
    'Film',
    'Parts/Components',
    'Powder',
    'Fiber'
  ],
  metals: [
    'Sheets',
    'Coils',
    'Bars',
    'Pipes/Tubes',
    'Scrap',
    'Castings',
    'Extrusions',
    'Wire'
  ],
  paper: [
    'Bales',
    'Loose',
    'Shredded',
    'Rolls',
    'Sheets',
    'Mixed'
  ],
  default: [
    'Raw Material',
    'Processed',
    'Components',
    'Mixed Form'
  ]
};

const originOptions = [
  {
    id: 'post_industrial',
    name: 'Post-industrial',
    description: 'Material from industrial processes'
  },
  {
    id: 'post_consumer',
    name: 'Post-consumer',
    description: 'Material from consumer use'
  },
  {
    id: 'mix',
    name: 'Mix',
    description: 'Mixed origin material'
  }
];

const contaminationLevels = [
  {
    id: 'clean',
    name: 'Clean',
    description: 'Free from most contaminants, requiring minimal processing before recycling.',
    color: 'green'
  },
  {
    id: 'slightly_contaminated',
    name: 'Slightly Contaminated',
    description: 'Contains some contaminants, may require cleaning or further processing.',
    color: 'yellow'
  },
  {
    id: 'heavily_contaminated',
    name: 'Heavily Contaminated',
    description: 'High levels of non-plastic materials present, requiring extensive processing.',
    color: 'red'
  }
];

const additives = [
  'UV Stabilizer',
  'Antioxidant',
  'Flame retardants',
  'Chlorides',
  'No additives'
];

const storageConditions = [
  {
    id: 'climate_controlled',
    name: 'Climate Controlled',
    description: 'Stored in a temperature and humidity-controlled environment.',
    icon: Thermometer
  },
  {
    id: 'protected_outdoor',
    name: 'Protected Outdoor',
    description: 'Covered or partially protected from the elements but outdoors.',
    icon: Package
  },
  {
    id: 'unprotected_outdoor',
    name: 'Unprotected Outdoor',
    description: 'Exposed to environmental conditions without protection.',
    icon: AlertCircle
  }
];

const processingMethods = [
  'Blow moulding',
  'Injection moulding',
  'Extrusion',
  'Calendering',
  'Rotational moulding',
  'Sintering',
  'Thermoforming',
  'Sorting',
  'Cleaning',
  'Shredding',
  'Melting',
  'Granulation'
];

const deliveryOptions = [
  {
    id: 'pickup-only',
    name: 'Pickup Only',
    description: 'Buyer arranges pickup from your location',
    icon: Package
  },
  {
    id: 'local-delivery',
    name: 'Local Delivery',
    description: 'You can deliver within local area',
    icon: Truck
  },
  {
    id: 'national-shipping',
    name: 'National Shipping',
    description: 'You can arrange national shipping',
    icon: Truck
  },
  {
    id: 'international-shipping',
    name: 'International Shipping',
    description: 'You can arrange international shipping',
    icon: Truck
  },
  {
    id: 'freight-forwarding',
    name: 'Freight Forwarding',
    description: 'Professional freight services available',
    icon: Truck
  }
];

const currencies = ['SEK', 'EUR', 'USD', 'NOK', 'DKK'];

const units = [
  'kg', 'tons', 'tonnes', 'lbs', 'pounds',
  'pieces', 'units', 'bales', 'containers',
  'm³', 'cubic meters', 'liters', 'gallons'
];

const bidDurationOptions = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: 'custom', label: 'Custom' }
];

export interface AuctionData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description?: string;
  basePrice: string;
  pricePerPartition?: string;
  currentBid?: string;
  status?: string;
  timeLeft?: string;
  volume: string;
  unit?: string;
  sellingType?: 'partition' | 'whole' | 'both';
  countryOfOrigin?: string;
  endDate?: string;
  endTime?: string;
  image: string;
  auctionStatus?: string;
  stepCompletionStatus?: Record<string, boolean>;
  isComplete?: boolean;
  currentStep?: number;
  keywords?: string;
  specifications?: Array<{ name: string; value: string }>;
  material_image?: string; // Backend image URL
}

interface EditAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (auctionData: AuctionData) => Promise<void>;
  auction: AuctionData;
  materialType?: string; // Optional: if provided, use this instead of waiting for API
}

interface StepData {
  // Step 1: Material Type
  materialType?: string;
  category?: string;
  subcategory?: string;
  specificMaterial?: string;
  packaging?: string;
  materialFrequency?: string;
  
  // Step 2: Specifications
  grade?: string;
  color?: string;
  form?: string;
  additionalSpecs?: string[];
  
  // Step 3: Origin
  origin?: string;
  
  // Step 4: Contamination
  contaminationLevel?: string;
  additives?: string[];
  storageConditions?: string;
  
  // Step 5: Processing
  processingMethods?: string[];
  
  // Step 6: Location
  location?: {
    country?: string;
    region?: string;
    city?: string;
    pickupAvailable?: boolean;
    deliveryOptions?: string[];
    fullAddress?: string;
  };
  
  // Step 7: Quantity & Price
  availableQuantity?: number;
  unit?: string;
  minimumOrder?: number;
  startingPrice?: number;
  currency?: string;
  auctionDuration?: string;
  reservePrice?: number;
  customAuctionDuration?: number;
  
  // Step 8: Details with image handling
  title?: string;
  description?: string;
  keywords?: string[];
  images?: File[];
  currentImageUrl?: string; // Current image from backend
}

// All possible steps
const allSteps = [
  { id: 1, title: 'Material Type', description: 'Category, packaging, and frequency' },
  { id: 2, title: 'Specifications', description: 'Grade, color, form, and details' },
  { id: 3, title: 'Material Origin', description: 'Source and origin information' },
  { id: 4, title: 'Contamination', description: 'Contamination level and additives' },
  { id: 5, title: 'Processing Methods', description: 'Processing and treatment methods' },
  { id: 6, title: 'Location & Logistics', description: 'Location and delivery options' },
  { id: 7, title: 'Quantity & Price', description: 'Pricing and quantity details' },
  { id: 8, title: 'Title & Description', description: 'Final details and images' }
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
    { id: 6, title: 'Location & Logistics', description: 'Location and delivery options' },
    { id: 7, title: 'Quantity & Price', description: 'Pricing and quantity details' },
    { id: 8, title: 'Title & Description', description: 'Final details and images' }
  ];
};

export default function EditAuctionModal({ isOpen, onClose, onSubmit, auction, materialType }: EditAuctionModalProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepData, setStepData] = useState<StepData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [_error, setError] = useState<string | null>(null);
  // Initialize steps based on provided materialType or auction category
  // Default to non-plastic steps (4 steps) if no material type is available yet
  const initialMaterialType = materialType || auction?.category?.toLowerCase() || '';
  const [steps, setSteps] = useState(() => {
    if (!initialMaterialType) {
      // Default to 4 steps while waiting for data (better UX than showing all 8)
      return [
        allSteps[0], // Material Type
        { id: 6, title: 'Location & Logistics', description: 'Location and delivery options' },
        { id: 7, title: 'Quantity & Price', description: 'Pricing and quantity details' },
        { id: 8, title: 'Title & Description', description: 'Final details and images' }
      ];
    }
    return getStepsByMaterialType(initialMaterialType);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NEW: Validation state for better UX (synchronized with AlternativeAuctionForm)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Google Maps integration state
  const [_addressInput, setAddressInput] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null!);

  // Load Google Maps API
  const { isLoaded, loadError } = useGoogleMaps();
  const { getPlaceDetails, selectedPlace } = usePlacesAutocomplete(addressInputRef, isLoaded && isOpen);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data && response.data.length > 0) {
          setCategories(response.data);
        } else {
          setError('No categories available. Please try again later.');
        }
      } catch (_error) {
        setError('Failed to load categories. Please check your connection and try again.');
      } finally {
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, []);

  // Handle Google Maps place selection
  useEffect(() => {
    if (selectedPlace) {
      handleStepDataChange({
        location: {
          ...stepData.location,
          country: selectedPlace.countryCode,
          region: selectedPlace.region,
          city: selectedPlace.city,
          fullAddress: selectedPlace.formattedAddress
        }
      });
      setLocationError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlace]);

  // Reinitialize Google Maps autocomplete when modal opens and we're on location step
  useEffect(() => {
    if (isOpen && activeStep === 6 && isLoaded && addressInputRef.current && window.google?.maps?.places) {
      try {
        // Create autocomplete instance
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
          componentRestrictions: { country: 'se' } // Restrict to Sweden
        });

        // Add listener for place_changed event
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.address_components) {
            // Extract address components
            let city = '';
            let region = '';
            const _country = '';
            let countryCode = '';

            place.address_components.forEach((component: any) => {
              const types = component.types;

              if (types.includes('locality') || types.includes('postal_town')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                region = component.long_name;
              } else if (types.includes('country')) {
                // country = component.long_name;
                countryCode = component.short_name.toLowerCase();
              }
            });

            handleStepDataChange({
              location: {
                ...stepData.location,
                country: countryCode,
                region: region,
                city: city,
                fullAddress: place.formatted_address || ''
              }
            });
            setLocationError('');
          }
        });
      } catch (_error) {
        // Failed to initialize Google Maps autocomplete
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeStep, isLoaded]);

  // Initialize form data from auction
  useEffect(() => {
    if (auction && categoriesLoaded) {
      const volumeParts = auction.volume.split(' ');
      const volumeValue = parseFloat(volumeParts[0]) || 0;
      const volumeUnit = volumeParts[1] || '';
      
      const basePriceValue = parseFloat(auction.basePrice.replace(/[^0-9.]/g, '')) || 0;
      
      // Extract specifications from auction.specifications array
      let grade = '';
      let color = '';
      let form = '';
      const additionalSpecs: string[] = [];
      
      if (auction.specifications && Array.isArray(auction.specifications)) {
        // Map common specification names to our form fields
        auction.specifications.forEach(spec => {
          const name = spec.name.toLowerCase();
          if (name.includes('grade') || name.includes('quality')) {
            grade = spec.value;
          } else if (name.includes('color') || name.includes('colour')) {
            color = spec.value;
          } else if (name.includes('form') || name.includes('shape') || name.includes('type')) {
            form = spec.value;
          } else if (name.includes('additional specifications')) {
            // Parse additional specifications string back into individual specs
            const additionalSpecsStr = spec.value;
            if (additionalSpecsStr) {
              // Split by comma and extract grade, color, form if they exist
              const specsArray = additionalSpecsStr.split(',').map(s => s.trim());
              specsArray.forEach(specItem => {
                const lowerSpec = specItem.toLowerCase();
                if (lowerSpec.startsWith('grade:') && !grade) {
                  grade = specItem.split(':')[1]?.trim() || '';
                } else if (lowerSpec.startsWith('color:') && !color) {
                  color = specItem.split(':')[1]?.trim() || '';
                } else if (lowerSpec.startsWith('form:') && !form) {
                  form = specItem.split(':')[1]?.trim() || '';
                } else {
                  // Keep as additional spec if it's not grade/color/form
                  additionalSpecs.push(specItem);
                }
              });
            }
          } else {
            // Add other specifications to additional specs
            additionalSpecs.push(`${spec.name}: ${spec.value}`);
          }
        });
      }
      
      // Also check if there's a description or other fields that might contain specifications
      // This handles cases where the backend might return specifications in different formats
      if (auction.description && auction.description.length > 0) {
        // Look for common specification patterns in the description
        const desc = auction.description.toLowerCase();
        if (!grade && (desc.includes('grade') || desc.includes('quality'))) {
          // Try to extract grade information from description if available
        }
      }
      
      const materialType = auction.category.toLowerCase();

      setStepData({
        // Step 1
        category: auction.category,
        subcategory: auction.subcategory,
        materialType: materialType,

        // Step 2: Initialize specifications data
        grade: grade || '',
        color: color || '',
        form: form || '',
        additionalSpecs: additionalSpecs,

        // Step 7
        availableQuantity: volumeValue,
        unit: volumeUnit,
        startingPrice: basePriceValue,
        currency: 'SEK',

        // Step 8
        title: auction.name,
        description: auction.description,
        keywords: auction.keywords ? auction.keywords.split(',').map(k => k.trim()) : [],
        currentImageUrl: auction.material_image || auction.image,
        images: []
      });

      // Set steps based on material type (only if not already set correctly)
      const expectedSteps = getStepsByMaterialType(materialType);
      if (steps.length !== expectedSteps.length || steps[0].id !== expectedSteps[0].id) {
        setSteps(expectedSteps);
      }
    }
  }, [auction, categoriesLoaded, steps]);

  const handleStepDataChange = useCallback((updates: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);

    // If material type is being updated, update the steps
    if (updates.materialType || updates.category) {
      const materialType = updates.materialType || updates.category?.toLowerCase() || '';
      const newSteps = getStepsByMaterialType(materialType);
      setSteps(newSteps);

      // If current active step is not available in new steps, go to step 1
      const currentStepExists = newSteps.some(step => step.id === activeStep);
      if (!currentStepExists) {
        setActiveStep(1);
      }
    }

    // Clear validation errors when user starts fixing them (synchronized with AlternativeAuctionForm)
    if (showValidationErrors) {
      const clearedErrors = { ...validationErrors };
      let hasChanges = false;

      // Clear errors for fields being updated
      Object.keys(updates).forEach(field => {
        if (clearedErrors[field]) {
          delete clearedErrors[field];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setValidationErrors(clearedErrors);
        if (Object.keys(clearedErrors).length === 0) {
          setShowValidationErrors(false);
        }
      }
    }
  }, [activeStep, showValidationErrors, validationErrors]);

  // Handle image file upload
  const handleImageUpload = (files: FileList | null) => {
    setUploadError(null);
    
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    if (file.size > maxSize) {
      setUploadError('Image file is too large. Maximum size is 10MB.');
      return;
    }
    
    handleStepDataChange({ images: [file] });
  };

  // Handle image removal
  const removeImage = () => {
    handleStepDataChange({ images: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Create preview URL for uploaded image
  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Google Maps address selection handler
  const handleAddressSelect = async () => {
    if (!isLoaded) return;

    setIsSearching(true);

    try {
      const placeResult = await getPlaceDetails();

      if (placeResult) {
        handleStepDataChange({
          location: {
            ...stepData.location,
            country: placeResult.countryCode,
            region: placeResult.region,
            city: placeResult.city,
            fullAddress: placeResult.formattedAddress
          }
        });
        setLocationError('');
      } else {
        setLocationError('Please select a valid address from the suggestions');
      }
    } catch (_error) {
      // Handle error silently
      setLocationError('Failed to get location details');
    } finally {
      setIsSearching(false);
    }
  };

  // Submit changes to backend
  const handleSubmit = async () => {
    // Clear previous validation errors
    setValidationErrors({});
    setShowValidationErrors(false);

    if (!validateStep(activeStep)) {
      const validation = validateCurrentStepDetailed();
      toast.error('Please fix the validation errors', {
        description: validation.errors.join(', ')
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine which step we're updating based on the current active step
      const currentStepData = getCurrentStepData();
      
      if (activeStep === 8) {
        // Step 8: Handle title, description, keywords, and image using the update service for single image
        const response = await adUpdateService.updateAdStep8WithImage(
          parseInt(auction.id),
          stepData.title || auction.name,
          stepData.description || auction.description || '',
          stepData.keywords?.join(', ') || '',
          stepData.images && stepData.images.length > 0 ? stepData.images[0] : undefined
        );
        
        if (!response.success) {
          throw new Error(response.error);
        }
      } else if (currentStepData) {
        // Steps 1-7: Use step-specific update endpoint
        const response = await adUpdateService.updateAdStep(
          parseInt(auction.id),
          activeStep,
          currentStepData
        );
        
        if (!response.success) {
          throw new Error(response.error || `Failed to update step ${activeStep}`);
        }
      } else {
        throw new Error(`No data to update for step ${activeStep}`);
      }

      // Convert step data back to auction format for the parent component
      const updatedAuction: AuctionData = {
        ...auction,
        name: stepData.title || auction.name,
        category: stepData.category || auction.category,
        subcategory: stepData.subcategory || auction.subcategory,
        description: stepData.description || auction.description,
        basePrice: stepData.startingPrice ? `${stepData.startingPrice} ${stepData.currency || 'SEK'}` : auction.basePrice,
        volume: stepData.availableQuantity && stepData.unit ? `${stepData.availableQuantity} ${stepData.unit}` : auction.volume,
        keywords: stepData.keywords ? stepData.keywords.join(', ') : auction.keywords
      };

      await onSubmit(updatedAuction);
      setHasChanges(false);
      
      // Reset loading state on success
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'Failed to save changes');
      toast.error('Failed to save changes', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  // Helper function to get current step data based on active step
  const getCurrentStepData = () => {
    switch (activeStep) {
      case 1:
        // Material Type step - match creation form structure exactly
        if (!stepData.category) return null;
        
        const selectedCategory = categories.find(cat => cat.name === stepData.category);
        const selectedSubcategory = selectedCategory?.subcategories.find(sub => sub.name === stepData.subcategory);
        
        return {
          category_id: selectedCategory?.id,
          subcategory_id: selectedSubcategory?.id,
          specific_material: stepData.specificMaterial || '',
          packaging: convertLabelToValue('packaging', stepData.packaging || ''),
          material_frequency: convertLabelToValue('material_frequency', stepData.materialFrequency || '')
        };
        
      case 2:
        // Specifications step - match creation form structure exactly
        // Backend expects only: specification_id and additional_specifications
        // Combine all step 2 form fields into additional_specifications
        const specs: string[] = [];
        
        // Add grade, color, form if selected
        if (stepData.grade) {
          specs.push(`Grade: ${stepData.grade}`);
        }
        if (stepData.color) {
          specs.push(`Color: ${stepData.color}`);
        }
        if (stepData.form) {
          specs.push(`Form: ${stepData.form}`);
        }
        
        // Add any additional specs from the form
        if (stepData.additionalSpecs && stepData.additionalSpecs.length > 0) {
          specs.push(...stepData.additionalSpecs.filter(spec => spec.trim()));
        }
        
        return {
          specification_id: null,
          additional_specifications: specs.join(', ')
        };
        
      case 3:
        // Material Origin step - match creation form structure
        return {
          origin: convertLabelToValue('origin', stepData.origin || '')
        };
        
      case 4:
        // Contamination step - match creation form structure
        return {
          contamination: convertLabelToValue('contamination', stepData.contaminationLevel || ''),
          additives: stepData.additives?.[0] ? convertLabelToValue('additives', stepData.additives[0]) : 'no_additives',
          storage_conditions: stepData.storageConditions ? convertLabelToValue('storage_conditions', stepData.storageConditions) : 'climate_controlled'
        };
        
      case 5:
        // Processing Methods step - match creation form structure
        return {
          processing_methods: Array.isArray(stepData.processingMethods) 
            ? stepData.processingMethods.map(method => convertLabelToValue('processing_methods', method))
            : (stepData.processingMethods ? [convertLabelToValue('processing_methods', stepData.processingMethods)] : [])
        };
        
      case 6:
        // Location & Logistics step - match creation form structure
        return {
          location_data: {
            country: stepData.location?.country || '',
            state_province: stepData.location?.region || undefined,
            city: stepData.location?.city || '',
            address_line: stepData.location?.fullAddress || undefined,
            postal_code: ''
          },
          pickup_available: Boolean(stepData.location?.pickupAvailable),
          delivery_options: Array.isArray(stepData.location?.deliveryOptions) 
            ? stepData.location.deliveryOptions.map(option => convertLabelToValue('delivery_options', option))
            : (stepData.location?.deliveryOptions ? [convertLabelToValue('delivery_options', stepData.location.deliveryOptions)] : [])
        };
        
      case 7:
        // Quantity & Price step - match creation form structure exactly
        // Handle custom auction duration properly
        const isCustomDuration = stepData.auctionDuration === 'custom';
        const auctionDurationValue = isCustomDuration ? 0 : parseInt(stepData.auctionDuration || '7');
        
        const step7Data: any = {
          available_quantity: Number(stepData.availableQuantity || 0),
          unit_of_measurement: convertLabelToValue('unit_of_measurement', stepData.unit || ''),
          minimum_order_quantity: Number(stepData.minimumOrder || 0),
          starting_bid_price: Number(stepData.startingPrice || 0),
          currency: stepData.currency || 'SEK',
          auction_duration: auctionDurationValue,
          reserve_price: stepData.reservePrice ? Number(stepData.reservePrice) : undefined
        };
        
        // Add custom auction duration if applicable
        if (isCustomDuration && stepData.customAuctionDuration) {
          step7Data.custom_auction_duration = stepData.customAuctionDuration;
        }
        
        return step7Data;
        
      case 8:
        // Title & Description step - handled separately above
        return null;
        
      default:
        return null;
    }
  };

  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'pending' => {
    if (auction.stepCompletionStatus) {
      return auction.stepCompletionStatus[stepNumber.toString()] ? 'completed' : 'pending';
    }
    return stepNumber <= (auction.currentStep || 1) ? 'completed' : 'pending';
  };

  const selectedCategory = categories.find(cat => cat.name === stepData.category);
  const availableSubcategories = selectedCategory?.subcategories || [];
  const materialTypeForSpecs = stepData.materialType || stepData.category?.toLowerCase() || 'default';
  const availableGrades = materialGrades[materialTypeForSpecs as keyof typeof materialGrades] || materialGrades.default;
  const availableForms = materialForms[materialTypeForSpecs as keyof typeof materialForms] || materialForms.default;

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            {!categoriesLoaded ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-6 h-6 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin mr-3" />
                <span className="text-gray-600">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-600 mb-2">No categories available</p>
                <p className="text-sm text-gray-500">Please try refreshing the page or contact support.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.filter(cat => cat.name !== 'All materials').map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleStepDataChange({ 
                          category: category.name,
                          materialType: category.name.toLowerCase(),
                          subcategory: '', // Reset subcategory when category changes
                          specificMaterial: ''
                        })}
                        className={`
                          p-3 rounded-lg border text-sm text-left transition-all hover:scale-105
                          ${stepData.category === category.name
                            ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedCategory && selectedCategory.subcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Subcategory *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSubcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleStepDataChange({ subcategory: subcategory.name })}
                          className={`
                            p-3 rounded-lg border text-sm text-left transition-all hover:scale-105
                            ${stepData.subcategory === subcategory.name
                              ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }
                          `}
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {stepData.subcategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Material (Optional)
                    </label>
                    <input
                      type="text"
                      value={stepData.specificMaterial || ''}
                      onChange={(e) => handleStepDataChange({ specificMaterial: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                      placeholder="e.g., Grade 5052 Aluminum, HDPE milk bottles, etc."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How is the material packaged? *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packagingOptions.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleStepDataChange({ packaging: type.name })}
                          className={`
                            p-4 rounded-lg border-2 transition-all text-left hover:scale-105
                            ${stepData.packaging === type.name
                              ? 'border-[#FF8A00] bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`
                              p-2 rounded-md
                              ${stepData.packaging === type.name
                                ? 'bg-[#FF8A00] text-white'
                                : 'bg-gray-100 text-gray-600'
                              }
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{type.name}</h4>
                              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How often do you have this material? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sellFrequencies.map((frequency) => (
                      <button
                        key={frequency.id}
                        onClick={() => handleStepDataChange({ materialFrequency: frequency.id })}
                        className={`
                          p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                          ${stepData.materialFrequency === frequency.id
                            ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }
                        `}
                      >
                        {frequency.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Grade
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableGrades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleStepDataChange({ grade })}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.grade === grade
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {materialColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleStepDataChange({ color })}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.color === color
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Form
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableForms.map((form) => (
                  <button
                    key={form}
                    onClick={() => handleStepDataChange({ form })}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.form === form
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {form}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Specifications
              </label>
              <div className="space-y-2">
                {stepData.additionalSpecs?.map((spec, _index) => (
                  <div key={_index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => {
                        const newSpecs = [...(stepData.additionalSpecs || [])];
                        newSpecs[_index] = e.target.value;
                        handleStepDataChange({ additionalSpecs: newSpecs });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                      placeholder="Enter specification"
                    />
                    <button
                      onClick={() => {
                        const newSpecs = stepData.additionalSpecs?.filter((_, i) => i !== _index) || [];
                        handleStepDataChange({ additionalSpecs: newSpecs });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSpecs = [...(stepData.additionalSpecs || []), ''];
                    handleStepDataChange({ additionalSpecs: newSpecs });
                  }}
                  className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-700"
                >
                  + Add Specification
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Material Origin *
              </label>
              <div className="space-y-3">
                {originOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepDataChange({ origin: option.id })}
                    className={`
                      w-full p-4 rounded-lg border text-left transition-all
                      ${stepData.origin === option.id
                        ? 'border-[#FF8A00] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        p-2 rounded-md
                        ${stepData.origin === option.id
                          ? 'bg-[#FF8A00] text-white'
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        <Factory className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Contamination Level *
              </label>
              <div className="space-y-3">
                {contaminationLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleStepDataChange({ contaminationLevel: level.id })}
                    className={`
                      w-full p-4 rounded-lg border-2 text-left transition-all
                      ${stepData.contaminationLevel === level.id
                        ? level.color === 'green'
                          ? 'border-green-500 bg-green-50'
                          : level.color === 'yellow'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        p-2 rounded-md
                        ${stepData.contaminationLevel === level.id
                          ? level.color === 'green'
                            ? 'bg-green-500 text-white'
                            : level.color === 'yellow'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {level.color === 'green' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{level.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additives
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {additives.map((additive) => (
                  <button
                    key={additive}
                    onClick={() => {
                      const currentAdditives = stepData.additives || [];
                      const isSelected = currentAdditives.includes(additive);
                      
                      if (isSelected) {
                        handleStepDataChange({ 
                          additives: currentAdditives.filter(a => a !== additive) 
                        });
                      } else {
                        handleStepDataChange({ 
                          additives: [...currentAdditives, additive] 
                        });
                      }
                    }}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.additives?.includes(additive)
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {additive}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Storage Conditions
              </label>
              <div className="space-y-3">
                {storageConditions.map((condition) => {
                  const Icon = condition.icon;
                  return (
                    <button
                      key={condition.id}
                      onClick={() => handleStepDataChange({ storageConditions: condition.id })}
                      className={`
                        w-full p-4 rounded-lg border text-left transition-all
                        ${stepData.storageConditions === condition.id
                          ? 'border-[#FF8A00] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`
                          p-2 rounded-md
                          ${stepData.storageConditions === condition.id
                            ? 'bg-[#FF8A00] text-white'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{condition.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{condition.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Processing Methods *
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Select the processing methods suitable for this material.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {processingMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      const currentMethods = stepData.processingMethods || [];
                      const isSelected = currentMethods.includes(method);
                      
                      if (isSelected) {
                        handleStepDataChange({ 
                          processingMethods: currentMethods.filter(m => m !== method) 
                        });
                      } else {
                        handleStepDataChange({ 
                          processingMethods: [...currentMethods, method] 
                        });
                      }
                    }}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.processingMethods?.includes(method)
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Location & Logistics
              </h3>
              <p className="text-gray-600">
                Specify material location and delivery options for buyers
              </p>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPinned className="mr-2 h-5 w-5 text-[#FF8A00]" />
                  Material Location
                </h4>

                {/* Google Maps Autocomplete */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Address in Sweden *
                    </label>
                    <div className="relative">
                      <input
                        ref={addressInputRef}
                        type="text"
                        placeholder="Start typing your address in Sweden..."
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] ${locationError ? 'border-red-500' : 'border-gray-300'}`}
                        onChange={(e) => {
                          setAddressInput(e.target.value);
                          if (locationError) {
                            setLocationError('');
                          }
                        }}
                        disabled={!isLoaded || isSearching}
                      />
                      <button
                        onClick={handleAddressSelect}
                        disabled={!isLoaded || isSearching}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${!isLoaded || isSearching ? 'text-gray-400 cursor-not-allowed' : 'text-[#FF8A00] hover:bg-orange-50'}`}
                      >
                        {isSearching ? (
                          <div className="animate-spin h-5 w-5 border-2 border-[#FF8A00] border-t-transparent rounded-full"></div>
                        ) : (
                          <Search className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {locationError && (
                      <p className="mt-1 text-sm text-red-600">{locationError}</p>
                    )}
                    {!isLoaded && !loadError && (
                      <p className="mt-1 text-sm text-gray-500">Loading Google Maps...</p>
                    )}
                    {loadError && (
                      <p className="mt-1 text-sm text-red-600">Failed to load Google Maps. Please enter location manually.</p>
                    )}
                  </div>

                  {/* Selected Location Summary */}
                  {stepData.location?.country && stepData.location?.city && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Selected Location
                      </h5>
                      <div className="space-y-2 text-sm">
                        {stepData.location.fullAddress && (
                          <div className="flex">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-1" />
                            <span className="text-gray-700">{stepData.location.fullAddress}</span>
                          </div>
                        )}
                        <div className="flex">
                          <Globe className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">
                            {stepData.location.city}
                            {stepData.location.region && `, ${stepData.location.region}`}
                            {stepData.location.country && `, ${stepData.location.country.toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Location Input (Fallback) */}
                  {loadError && (
                    <div className="space-y-4 mt-4 border-t border-gray-200 pt-4">
                      <h5 className="font-medium text-gray-900">Manual Location Entry</h5>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter country"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                          value={stepData.location?.country || ''}
                          onChange={(e) => handleStepDataChange({
                            location: { ...stepData.location, country: e.target.value }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Region/State
                        </label>
                        <input
                          type="text"
                          placeholder="Enter region or state"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                          value={stepData.location?.region || ''}
                          onChange={(e) => handleStepDataChange({
                            location: { ...stepData.location, region: e.target.value }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                          value={stepData.location?.city || ''}
                          onChange={(e) => handleStepDataChange({
                            location: { ...stepData.location, city: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pickup Available */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stepData.location?.pickupAvailable || false}
                  onChange={(e) => handleStepDataChange({
                    location: { ...stepData.location, pickupAvailable: e.target.checked }
                  })}
                  className="w-4 h-4 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Pickup Available</span>
                  <p className="text-xs text-gray-500">Buyers can collect material from your location</p>
                </div>
              </label>
            </div>

            {/* Delivery Options */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Delivery Options
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Select all the delivery options that apply to this material.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = stepData.location?.deliveryOptions?.includes(option.id) || false;

                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        const currentOptions = stepData.location?.deliveryOptions || [];
                        const isSelected = currentOptions.includes(option.id);

                        if (isSelected) {
                          handleStepDataChange({
                            location: {
                              ...stepData.location,
                              deliveryOptions: currentOptions.filter(o => o !== option.id)
                            }
                          });
                        } else {
                          handleStepDataChange({
                            location: {
                              ...stepData.location,
                              deliveryOptions: [...currentOptions, option.id]
                            }
                          });
                        }
                      }}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-[#FF8A00] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`
                          p-2 rounded-full
                          ${isSelected
                            ? 'bg-[#FF8A00] text-white'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h5 className="font-medium text-gray-900">{option.name}</h5>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 ml-2 text-[#FF8A00]" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Why location matters</h4>
                  <div className="text-sm text-blue-700 mt-1">
                    <p className="mb-1">• Accurate location helps buyers calculate logistics costs</p>
                    <p className="mb-1">• Currently, the Nordic Loop Marketplace only serves locations within Sweden</p>
                    <p className="mb-1">• Specify delivery options to make your listing more attractive</p>
                    <p>• For sensitive materials, you can choose to reveal exact location only to serious buyers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Message */}
            {(!stepData.location?.country || !stepData.location?.city) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-600">
                  Please specify the location (country and city) where the material is available.
                </p>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={stepData.availableQuantity || ''}
                  onChange={(e) => handleStepDataChange({ availableQuantity: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={stepData.unit || ''}
                  onChange={(e) => handleStepDataChange({ unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                >
                  <option value="">Select unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Quantity
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={stepData.minimumOrder || ''}
                  onChange={(e) => handleStepDataChange({ minimumOrder: parseFloat(e.target.value) })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="0"
                />
                <span className="text-gray-500">{stepData.unit || 'units'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={stepData.startingPrice || ''}
                  onChange={(e) => handleStepDataChange({ startingPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={stepData.currency || 'SEK'}
                  onChange={(e) => handleStepDataChange({ currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auction Duration
              </label>
              <select
                value={stepData.auctionDuration || '7'}
                onChange={(e) => {
                  const duration = e.target.value;
                  handleStepDataChange({ auctionDuration: duration });
                  // Clear custom duration fields if switching away from custom
                  if (duration !== 'custom') {
                    handleStepDataChange({ customAuctionDuration: 0 });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              >
                {bidDurationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              {/* Custom Duration Date Picker */}
              {stepData.auctionDuration === 'custom' && (
                <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select End Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      if (selectedDate) {
                        // Calculate days difference
                        const today = new Date();
                        const endDate = new Date(selectedDate);
                        const diffTime = endDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        handleStepDataChange({ 
                          customAuctionDuration: diffDays > 0 ? diffDays : 1 
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a date up to 90 days from today when the auction should end.
                  </p>
                  {stepData.customAuctionDuration && stepData.customAuctionDuration > 0 && (
                    <p className="text-xs text-[#FF8A00] mt-1">
                      Auction will run for {stepData.customAuctionDuration} days
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reserve Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={stepData.reservePrice || ''}
                onChange={(e) => handleStepDataChange({ reservePrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum price you&apos;re willing to accept
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            {/* Validation Errors Summary */}
            {showValidationErrors && validationErrors && Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={stepData.title || ''}
                onChange={(e) => handleStepDataChange({ title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent ${
                  (stepData.title && stepData.title.length > 0 && stepData.title.trim().length < 10) || (showValidationErrors && validationErrors?.title)
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter auction title"
                maxLength={255}
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
                  (stepData.title && stepData.title.length > 0 && stepData.title.trim().length < 10) || (showValidationErrors && validationErrors?.title)
                    ? 'text-red-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {(stepData.title || '').trim().length}/255 characters
                  {stepData.title && stepData.title.length > 0 && stepData.title.trim().length < 10 && 
                    ` - Need at least ${10 - stepData.title.trim().length} more characters`
                  }
                </p>
                {stepData.title && stepData.title.trim().length >= 10 && stepData.title.length <= 255 && !validationErrors?.title && (
                  <span className="text-xs text-green-600">✓ Valid length</span>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={stepData.description || ''}
                onChange={(e) => handleStepDataChange({ description: e.target.value })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent resize-vertical min-h-[120px] ${
                  (stepData.description && stepData.description.length > 0 && stepData.description.trim().length < 50) || (showValidationErrors && validationErrors?.description)
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Describe your material in detail - quality, source, condition, processing history, etc. (minimum 50 characters)"
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
                  (stepData.description && stepData.description.length > 0 && stepData.description.trim().length < 50) || (showValidationErrors && validationErrors?.description)
                    ? 'text-red-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {(stepData.description || '').trim().length} characters
                  {stepData.description && stepData.description.length > 0 && stepData.description.trim().length < 50 && 
                    ` - Need at least ${50 - stepData.description.trim().length} more characters`
                  }
                </p>
                {stepData.description && stepData.description.trim().length >= 50 && !validationErrors?.description && (
                  <span className="text-xs text-green-600">✓ Valid length</span>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated, optional)
              </label>
              <input
                type="text"
                value={stepData.keywords?.join(', ') || ''}
                onChange={(e) => handleStepDataChange({ 
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent ${
                  showValidationErrors && validationErrors?.keywords ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="plastic, recycled, high quality"
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
                  showValidationErrors && validationErrors?.keywords ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  {(stepData.keywords?.join(', ') || '').length}/500 characters total
                  {(stepData.keywords?.join(', ') || '').length > 500 && 
                    ` - Exceeded by ${(stepData.keywords?.join(', ') || '').length - 500} characters`
                  }
                </p>
                {(stepData.keywords?.join(', ') || '').length <= 500 && (stepData.keywords?.join(', ') || '').length > 0 && !validationErrors?.keywords && (
                  <span className="text-xs text-green-600">✓ Valid length</span>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Image (Optional but Recommended)
              </label>
              
              {/* Current Image or Upload Area */}
              {stepData.images && stepData.images.length > 0 ? (
                // Show newly uploaded image preview
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={createImageUrl(stepData.images[0])}
                      alt="New material image"
                      width={600}
                      height={400}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Remove new image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    New image: {stepData.images[0].name} - {(stepData.images[0].size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              ) : stepData.currentImageUrl ? (
                // Show current image from backend
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={getFullImageUrl(stepData.currentImageUrl)}
                      alt={auction.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to category image on error
                        const target = e.target as HTMLImageElement;
                        target.src = getCategoryImage(auction.category);
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-md px-2 py-1">
                    <span className="text-xs text-gray-600">Current image</span>
                  </div>
                  
                  {/* Upload new image button */}
                  <div className="absolute bottom-2 left-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#FF8A00] text-white px-3 py-1 rounded-md text-sm hover:bg-[#e67700] transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                // Upload area when no image exists
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <Upload className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Upload Material Image
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG, GIF, or WebP • Max 10MB
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
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />
              
              {/* Error Message */}
              {uploadError && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Upload a high-quality image of your material to attract more buyers
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Validation functions synchronized with AlternativeAuctionForm
  const validateStep8Detailed = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};
    
    // Title validation (minimum 10 characters)
    if (!stepData.title || stepData.title.trim().length < 10) {
      const titleError = 'Title must be at least 10 characters long';
      errors.push(titleError);
      fieldErrors.title = [titleError];
    } else if (stepData.title.length > 255) {
      const titleError = 'Title must not exceed 255 characters';
      errors.push(titleError);
      fieldErrors.title = [titleError];
    }
    
    // Description validation (minimum 30 characters - matching create form)
    if (!stepData.description || stepData.description.trim().length < 30) {
      const descError = 'Description must be at least 30 characters long';
      errors.push(descError);
      fieldErrors.description = [descError];
    }

    // Keywords validation (optional, but if provided, max 500 chars total)
    const keywordsText = stepData.keywords?.join(', ') || '';
    if (keywordsText.length > 500) {
      const keywordsError = 'Keywords must not exceed 500 characters total';
      errors.push(keywordsError);
      fieldErrors.keywords = [keywordsError];
    }

    // Image validation (at least one image required - matching create form)
    if (!stepData.images || stepData.images.length === 0) {
      // Only require image if there's no current image URL
      if (!stepData.currentImageUrl) {
        const imageError = 'At least one image is required';
        errors.push(imageError);
        fieldErrors.images = [imageError];
      }
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
    const fieldErrors: Record<string, string[]> = {};

    switch (activeStep) {
      case 1:
        if (!stepData.category) {
          const error = 'Category is required';
          errors.push(error);
          fieldErrors.category = [error];
        }
        if (!stepData.subcategory) {
          const error = 'Subcategory is required';
          errors.push(error);
          fieldErrors.subcategory = [error];
        }
        if (!stepData.packaging) {
          const error = 'Packaging type is required';
          errors.push(error);
          fieldErrors.packaging = [error];
        }
        if (!stepData.materialFrequency) {
          const error = 'Material frequency is required';
          errors.push(error);
          fieldErrors.materialFrequency = [error];
        }
        break;

      case 3:
        if (!stepData.origin) {
          const error = 'Material origin is required';
          errors.push(error);
          fieldErrors.origin = [error];
        }
        break;

      case 4:
        if (!stepData.contaminationLevel) {
          const error = 'Contamination level is required';
          errors.push(error);
          fieldErrors.contaminationLevel = [error];
        }
        break;

      case 5:
        // Processing methods are optional (matching create form)
        break;

      case 6:
        if (!stepData.location?.country) {
          const error = 'Country is required';
          errors.push(error);
          fieldErrors.country = [error];
        }
        if (!stepData.location?.region) {
          const error = 'Region is required';
          errors.push(error);
          fieldErrors.region = [error];
        }
        if (!stepData.location?.city) {
          const error = 'City is required';
          errors.push(error);
          fieldErrors.city = [error];
        }
        break;

      case 7:
        if (!stepData.availableQuantity || stepData.availableQuantity <= 0) {
          const error = 'Available quantity must be greater than 0';
          errors.push(error);
          fieldErrors.availableQuantity = [error];
        }
        if (!stepData.unit) {
          const error = 'Unit of measurement is required';
          errors.push(error);
          fieldErrors.unit = [error];
        }
        if (!stepData.startingPrice || stepData.startingPrice <= 0) {
          const error = 'Base price must be greater than 0';
          errors.push(error);
          fieldErrors.startingPrice = [error];
        }
        const hasValidAuctionDuration = stepData.auctionDuration && 
          (stepData.auctionDuration !== 'custom' || 
           (stepData.auctionDuration === 'custom' && stepData.customAuctionDuration && stepData.customAuctionDuration > 0));
        if (!hasValidAuctionDuration) {
          const error = 'Valid auction duration is required';
          errors.push(error);
          fieldErrors.auctionDuration = [error];
        }
        break;

      case 8:
        return validateStep8Detailed();

      default:
        break;
    }

    // Update validation state
    setValidationErrors(fieldErrors);
    setShowValidationErrors(errors.length > 0);

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateStep = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return !!(stepData.category && stepData.subcategory && stepData.packaging && stepData.materialFrequency);
      case 2:
        // Specifications are optional
        return true;
      case 3:
        return !!(stepData.origin);
      case 4:
        return !!(stepData.contaminationLevel);
      case 5:
        // Processing methods are optional (matching create form)
        return true;
      case 6:
        return !!(stepData.location?.country && stepData.location?.region && stepData.location?.city);
      case 7:
        const hasValidAuctionDuration = stepData.auctionDuration &&
          (stepData.auctionDuration !== 'custom' ||
           (stepData.auctionDuration === 'custom' && stepData.customAuctionDuration && stepData.customAuctionDuration > 0));
        return !!(stepData.availableQuantity && stepData.availableQuantity > 0 && stepData.unit && stepData.startingPrice && stepData.startingPrice > 0 && hasValidAuctionDuration);
      case 8:
        // Step 8 validation (matching create form requirements)
        const titleValid = stepData.title && stepData.title.trim().length >= 10;
        const descriptionValid = stepData.description && stepData.description.trim().length >= 30;
        const imageValid = (stepData.images && stepData.images.length > 0) || stepData.currentImageUrl;
        return !!(titleValid && descriptionValid && imageValid);
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      showCloseButton={false}
      className="h-[90vh] max-h-[90vh] flex flex-col p-0"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Auction</h2>
            <p className="text-sm text-gray-600">
              {auction.name} - Step {steps.findIndex(step => step.id === activeStep) + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Steps Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-3">
              {steps.map((step, _index) => {
                const status = getStepStatus(step.id);
                const isActive = activeStep === step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
                        : status === 'completed'
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-white text-[#FF8A00]'
                          : status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-white' : status === 'completed' ? 'text-green-700' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-xs ${
                          isActive ? 'text-orange-100' : status === 'completed' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Completion Status */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Completed</span>
                <span>
                  {auction.stepCompletionStatus 
                    ? Object.values(auction.stepCompletionStatus).filter(Boolean).length 
                    : auction.currentStep || 0
                  } / {steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#FF8A00] h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((auction.stepCompletionStatus 
                      ? Object.values(auction.stepCompletionStatus).filter(Boolean).length 
                      : auction.currentStep || 0
                    ) / steps.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Step Content */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {steps[activeStep - 1]?.title}
                  </h3>
                  <p className="text-gray-600">
                    {steps[activeStep - 1]?.description}
                  </p>
                </div>

                {/* Validation Errors Summary for non-step-8 components */}
                {showValidationErrors && validationErrors && Object.keys(validationErrors).length > 0 && activeStep !== 8 && (
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

                {renderStepContent()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === activeStep);
                    if (currentIndex > 0) {
                      setActiveStep(steps[currentIndex - 1].id);
                    }
                  }}
                  disabled={steps.findIndex(step => step.id === activeStep) === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === activeStep);
                    if (currentIndex < steps.length - 1) {
                      setActiveStep(steps[currentIndex + 1].id);
                    }
                  }}
                  disabled={steps.findIndex(step => step.id === activeStep) === steps.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex space-x-3">
                {hasChanges && (
                  <div className="flex items-center space-x-2 text-sm text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Unsaved changes</span>
                  </div>
                )}
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00] disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
