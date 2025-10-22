"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Check, Save, AlertCircle, Package, Box, Recycle, Factory, Thermometer, Upload, MapPin, Search, CheckCircle, Globe, Truck, MapPinned, Info, Plus, Settings, Type, Tag } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getCategories, Category } from '@/services/auction';
import { adUpdateService, adCreationService } from '@/services/ads';
import { getFullImageUrl } from '@/utils/imageUtils';
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
  {
    id: 'uv_stabilizer',
    name: 'UV Stabilizer'
  },
  {
    id: 'antioxidant',
    name: 'Antioxidant'
  },
  {
    id: 'flame_retardants',
    name: 'Flame retardants'
  },
  {
    id: 'chlorides',
    name: 'Chlorides'
  },
  {
    id: 'no_additives',
    name: 'No additives'
  }
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
  {
    id: 'blow_moulding',
    name: 'Blow moulding',
    description: 'Process for creating hollow plastic parts'
  },
  {
    id: 'injection_moulding',
    name: 'Injection moulding',
    description: 'Molten plastic injected into molds'
  },
  {
    id: 'extrusion',
    name: 'Extrusion',
    description: 'Continuous process creating uniform cross-sections'
  },
  {
    id: 'calendering',
    name: 'Calendering',
    description: 'Process for creating films and sheets'
  },
  {
    id: 'rotational_moulding',
    name: 'Rotational moulding',
    description: 'Hollow parts formed by rotation during heating'
  },
  {
    id: 'sintering',
    name: 'Sintering',
    description: 'Powder compaction and heating process'
  },
  {
    id: 'thermoforming',
    name: 'Thermoforming',
    description: 'Heating and shaping thermoplastic sheets'
  }
];

const deliveryOptions = [
  {
    id: 'pickup_only',
    name: 'Pickup Only',
    description: 'Buyer arranges pickup from your location',
    icon: Package
  },
  {
    id: 'local_delivery',
    name: 'Local Delivery',
    description: 'You can deliver within local area',
    icon: Truck
  },
  {
    id: 'national_shipping',
    name: 'National Shipping',
    description: 'You can arrange national shipping',
    icon: Truck
  },
  {
    id: 'international_shipping',
    name: 'International Shipping',
    description: 'You can arrange international shipping',
    icon: Truck
  },
  {
    id: 'freight_forwarding',
    name: 'Freight Forwarding',
    description: 'Professional freight services available',
    icon: Truck
  }
];

const currencies = ['SEK'];

// Use all units supported by backend - matching Ad.UNIT_CHOICES (singular backend codes)
const units = [
  'kg', 'ton', 'tonne', 'lb', 'pound',
  'piece', 'unit', 'bale', 'container',
  'm³', 'cubic meter', 'liter', 'gallon', 'meter'
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
  /** Optional currency code (e.g., SEK, EUR) */
  currency?: string;
  pricePerPartition?: string;
  currentBid?: string;
  status?: string;
  timeLeft?: string | null;
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
  onRefresh?: () => Promise<void>; // Optional: callback to refresh parent data
}

interface StepData {
  // Step 1: Material Type
  materialType?: string;
  category?: string;
  subcategory?: string;
  specificMaterial?: string[];
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
    deliveryOptions?: string[];
    fullAddress?: string;
    postalCode?: string;
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

export default function EditAuctionModal({ isOpen, onClose, onSubmit, auction, materialType, onRefresh }: EditAuctionModalProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [stepData, setStepData] = useState<StepData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [shouldCloseAfterSave, setShouldCloseAfterSave] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [completeAdData, setCompleteAdData] = useState<any>(null);
  const [adDataLoaded, setAdDataLoaded] = useState(false);
  // Initialize steps based on provided materialType or auction category
  // Default to non-plastic steps (4 steps) if no material type is available yet
  const [steps, setSteps] = useState(() => {
    // Always use the provided materialType prop first, then fall back to auction data
    const typeToUse = materialType || auction?.category?.toLowerCase() || '';
    if (!typeToUse) {
      // Default to 4 steps while waiting for data (better UX than showing all 8)
      return [
        allSteps[0], // Material Type
        { id: 6, title: 'Location & Logistics', description: 'Location and delivery options' },
        { id: 7, title: 'Quantity & Price', description: 'Pricing and quantity details' },
        { id: 8, title: 'Title & Description', description: 'Final details and images' }
      ];
    }
    return getStepsByMaterialType(typeToUse);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation states for integer fields
  const [quantityErrors, setQuantityErrors] = useState({
    availableQuantity: '',
    minimumOrder: ''
  });
  const [priceErrors, setPriceErrors] = useState({
    startingPrice: '',
    reservePrice: ''
  });

  // Validate integer input - only allows positive integers
  const validateIntegerInput = useCallback((value: string, fieldName: string, allowZero: boolean = false): { isValid: boolean; error: string } => {
    if (value === '') {
      return { isValid: true, error: '' };
    }
    
    // Check if value contains only digits
    if (!/^\d+$/.test(value)) {
      return { 
        isValid: false, 
        error: `${fieldName} must contain only numbers (no decimals, letters, or special characters)` 
      };
    }
    
    const numValue = parseInt(value);
    if (allowZero && numValue < 0) {
      return { 
        isValid: false, 
        error: `${fieldName} cannot be negative` 
      };
    } else if (!allowZero && numValue <= 0) {
      return { 
        isValid: false, 
        error: `${fieldName} must be greater than 0` 
      };
    }
    
    return { isValid: true, error: '' };
  }, []);

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
          // Categories not available - silently handle
        }
      } catch (_error) {
        // Failed to load categories - silently handle
      } finally {
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, []);

  // Fetch complete ad data when modal opens
  useEffect(() => {
    if (isOpen && auction.id && !adDataLoaded) {
      const fetchCompleteAdData = async () => {
        try {


          // Use the existing API to get complete ad details
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ads/${auction.id}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('nordic_loop_access_token')}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();

            setCompleteAdData(result.data);
            setAdDataLoaded(true);
          } else {

          }
        } catch (_error) {

        }
      };

      fetchCompleteAdData();
    }
  }, [isOpen, auction.id, adDataLoaded]);

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
            let countryCode = '';

            place.address_components.forEach((component: any) => {
              const types = component.types;

              if (types.includes('locality') || types.includes('postal_town')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                region = component.long_name;
              } else if (types.includes('country')) {
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
    if (auction && categoriesLoaded && adDataLoaded && completeAdData) {
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
      
      // Use the materialType prop if provided, otherwise fall back to auction.category
      const determinedMaterialType = materialType || auction.category?.toLowerCase() || '';



      try {
        setStepData({
          // Step 1 - Use complete ad data with safe property access
          category: completeAdData?.category_name || auction?.category || '',
          subcategory: completeAdData?.subcategory_name || auction?.subcategory || '',
          materialType: determinedMaterialType || '',
          specificMaterial: completeAdData?.specific_material ? 
            (typeof completeAdData.specific_material === 'string' ? 
              completeAdData.specific_material.split(',').map((s: string) => s.trim()).filter(Boolean) : 
              []) : [],
          packaging: (() => {
            const backendPackaging = completeAdData?.packaging || '';
            // Keep backend packaging value as ID for consistency
            const matchingOption = packagingOptions.find(opt => 
              opt.id === backendPackaging || opt.name === backendPackaging
            );
            return matchingOption ? matchingOption.id : backendPackaging;
          })(),
          materialFrequency: completeAdData?.material_frequency || '',

          // Step 2: Initialize specifications data from complete ad data with null checks
          grade: completeAdData?.specification?.material_grade_display || grade || '',
          color: completeAdData?.specification?.color || color || '',
          form: completeAdData?.specification?.material_form_display || form || '',
          additionalSpecs: completeAdData?.specification?.additional_specifications ?
            [completeAdData.specification.additional_specifications] : (Array.isArray(additionalSpecs) ? additionalSpecs : []),

          // Step 3: Material Origin - use ID value for form selection
          origin: completeAdData?.origin || '',

          // Step 4: Contamination - use ID values for form selection
        contaminationLevel: completeAdData.contamination || '',
        additives: completeAdData.additives ? [completeAdData.additives] : [],
        storageConditions: completeAdData.storage_conditions || '',

        // Step 5: Processing Methods
        processingMethods: completeAdData.processing_methods || [],

        // Step 6: Location & Logistics
        location: completeAdData.location ? {
          country: completeAdData.location.country || '',
          region: completeAdData.location.state_province || '',
          city: completeAdData.location.city || '',
          fullAddress: completeAdData.location.address_line || '',
          postalCode: completeAdData.location.postal_code || '',
          deliveryOptions: completeAdData.delivery_options || []
        } : {
          country: '',
          region: '',
          city: '',
          fullAddress: '',
          postalCode: '',
          deliveryOptions: []
        },

        // Step 7: Quantity & Price - use complete ad data when available
        availableQuantity: completeAdData.available_quantity || volumeValue,
        unit: completeAdData.unit_of_measurement || volumeUnit,
        minimumOrder: completeAdData.minimum_order_quantity || 0,
        startingPrice: completeAdData.starting_bid_price || basePriceValue,
        currency: completeAdData.currency || 'SEK',
        auctionDuration: completeAdData.auction_duration ? String(completeAdData.auction_duration) : '',
        reservePrice: completeAdData.reserve_price || 0,
        customAuctionDuration: completeAdData.custom_auction_duration || 0,

        // Step 8: Title & Description - use complete ad data when available with safe property access
        title: completeAdData?.title || auction?.name || '',
        description: completeAdData?.description || auction?.description || '',
        keywords: completeAdData?.keywords ?
          (typeof completeAdData.keywords === 'string' ? completeAdData.keywords.split(', ').map((k: string) => k.trim()) : []) :
          (auction?.keywords ?
            (typeof auction.keywords === 'string' ? auction.keywords.split(',').map((k: string) => k.trim()) :
             Array.isArray(auction.keywords) ? auction.keywords : []) : []),
        currentImageUrl: completeAdData?.material_image || auction?.material_image || auction?.image || '',
        images: []
        });

        // Reset image load error when new data is loaded
        setImageLoadError(false);

        // Set steps based on material type (only if not already set correctly)
        const expectedSteps = getStepsByMaterialType(determinedMaterialType);
        if (steps.length !== expectedSteps.length || steps[0].id !== expectedSteps[0].id) {
          // Use setTimeout to avoid conflicts with other state updates
          setTimeout(() => {
            setSteps(expectedSteps);
          }, 0);
        }
      } catch (error) {
        // Handle any errors during data initialization
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error initializing auction edit data:', error);
        }
        // Failed to load auction data - silently handle

        // Set minimal default data to prevent crashes
        setStepData({
          category: auction?.category || '',
          subcategory: auction?.subcategory || '',
          materialType: auction?.category?.toLowerCase() || '',
          specificMaterial: [],
          packaging: '',
          materialFrequency: '',
          grade: '',
          color: '',
          form: '',
          additionalSpecs: [],
          origin: '',
          contaminationLevel: '',
          processingMethods: [],
          location: {
            country: '',
            region: '',
            city: '',
            fullAddress: '',
            postalCode: '',
            deliveryOptions: []
          },
          availableQuantity: 0,
          unit: '',
          minimumOrder: 0,
          startingPrice: 0,
          currency: 'SEK',
          auctionDuration: '',
          reservePrice: 0,
          customAuctionDuration: 0,
          title: auction?.name || '',
          description: auction?.description || '',
          keywords: [],
          currentImageUrl: auction?.image || '',
          images: []
        });
      }
    }
  }, [auction, categoriesLoaded, adDataLoaded, completeAdData, categories.length, steps, materialType]);

  // Update steps when materialType prop changes
  useEffect(() => {
    if (materialType) {
      const newSteps = getStepsByMaterialType(materialType);
      setSteps(newSteps);
    }
  }, [materialType]);


  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveStep(1);
      setStepData({});
      setHasChanges(false);
      setValidationErrors({});
      setShowValidationErrors(false);
      setUploadError(null);
      setImageLoadError(false);
      setCompleteAdData(null);
      setAdDataLoaded(false);
    }
  }, [isOpen]);

  const handleStepDataChange = useCallback((updates: Partial<StepData>) => {
    setStepData(prev => {
      const newData = { ...prev, ...updates };
      
      // If material type or category is being updated, update the steps
      if (updates.materialType || updates.category) {
        const materialType = updates.materialType || updates.category?.toLowerCase() || '';
        const newSteps = getStepsByMaterialType(materialType);
        
        // Use setTimeout to avoid state update conflicts
        setTimeout(() => {
          setSteps(newSteps);
          
          // If current active step is not available in new steps, go to step 1
          const currentStepExists = newSteps.some(step => step.id === activeStep);
          if (!currentStepExists) {
            setActiveStep(1);
          }
        }, 0);
      }
      
      return newData;
    });
    
    setHasChanges(true);

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

  // Category selection handler - moved after handleStepDataChange to fix initialization order
  const handleCategorySelect = useCallback((category: any) => {
    // Set the selected category ID to trigger subcategory loading
    setSelectedCategoryId(category.id);
    
    // Update step data with new category using proper data change handler
    handleStepDataChange({
      category: category.name,
      materialType: category.name.toLowerCase(),
      subcategory: '', // Clear subcategory when category changes
      specificMaterial: [] // Clear specific material too
    });
  }, [handleStepDataChange]);

  // Subcategory selection handler - moved after handleStepDataChange to fix initialization order
  const handleSubcategorySelect = useCallback((subcategory: any) => {
    handleStepDataChange({
      subcategory: subcategory.name
    });
  }, [handleStepDataChange]);

  // Handle integer field changes with validation
  const handleIntegerFieldChange = useCallback((fieldName: string, value: string) => {
    const fieldDisplayNames: { [key: string]: string } = {
      availableQuantity: 'Available Quantity',
      minimumOrder: 'Minimum Order Quantity',
      startingPrice: 'Starting Bid Price',
      reservePrice: 'Reserve Price'
    };
    
    const displayName = fieldDisplayNames[fieldName] || fieldName;
    const isOptionalField = fieldName === 'minimumOrder' || fieldName === 'reservePrice';
    const validation = validateIntegerInput(value, displayName, isOptionalField);
    
    // Update error states
    if (fieldName === 'availableQuantity' || fieldName === 'minimumOrder') {
      setQuantityErrors(prev => ({
        ...prev,
        [fieldName]: validation.error
      }));
    } else if (fieldName === 'startingPrice' || fieldName === 'reservePrice') {
      setPriceErrors(prev => ({
        ...prev,
        [fieldName]: validation.error
      }));
    }
    
    // Only update form data if valid or empty (to allow clearing)
    if (validation.isValid) {
      const numericValue = value === '' ? 0 : parseInt(value);
      handleStepDataChange({ [fieldName]: numericValue });
    }
  }, [validateIntegerInput, handleStepDataChange]);

  // Keywords handling functions (matching creation form)
  const getKeywordsTextLength = () => {
    return (stepData.keywords || []).join(', ').length;
  };

  const areKeywordsValid = () => {
    return getKeywordsTextLength() <= 500;
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !(stepData.keywords || []).includes(keyword.trim())) {
      const currentKeywordsText = (stepData.keywords || []).join(', ');
      const newKeywordsText = currentKeywordsText ? `${currentKeywordsText}, ${keyword.trim()}` : keyword.trim();

      // Check if adding this keyword would exceed 500 characters
      if (newKeywordsText.length <= 500) {
        handleStepDataChange({
          keywords: [...(stepData.keywords || []), keyword.trim()]
        });
      }
    }
  };

  const handleKeywordRemove = (index: number) => {
    handleStepDataChange({
      keywords: (stepData.keywords || []).filter((_, i) => i !== index)
    });
  };

  // Specific Material handling functions (similar to keywords)
  const handleSpecificMaterialAdd = (material: string) => {
    if (material.trim() && !(stepData.specificMaterial || []).includes(material.trim())) {
      handleStepDataChange({
        specificMaterial: [...(stepData.specificMaterial || []), material.trim()]
      });
    }
  };

  const handleSpecificMaterialRemove = (index: number) => {
    handleStepDataChange({
      specificMaterial: (stepData.specificMaterial || []).filter((_, i) => i !== index)
    });
  };

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

      if (!currentStepData && activeStep !== 8) {
        throw new Error(`No data to update for step ${activeStep}`);
      }

      // Use backend API to update the ad
      let updateResult;

      if (activeStep === 8) {
        // For step 8, handle title, description, keywords, and image
        const title = stepData.title || auction.name;
        const description = stepData.description || auction.description || '';
        const keywords = stepData.keywords?.join(', ') || '';

        // Check if there's a new image to upload
        if (stepData.images && stepData.images.length > 0 && stepData.images[0] instanceof File) {
          // Use step 8 specific method with image upload
          updateResult = await adUpdateService.updateAdStep8WithImage(
            parseInt(auction.id),
            title,
            description,
            keywords,
            stepData.images[0]
          );
        } else {
          // Use step 8 spmaterialType={auction.category?.toLowerCase()ecific method without image
          updateResult = await adUpdateService.updateAdStep8WithImage(
            parseInt(auction.id),
            title,
            description,
            keywords
          );
        }
      } else {
        // Use step-by-step update for other steps

        updateResult = await adUpdateService.updateAdStep(parseInt(auction.id), activeStep, currentStepData);
      }

      if (!updateResult.success) {
        // Handle validation errors from backend
        if (updateResult.details) {
          setValidationErrors(updateResult.details);
          setShowValidationErrors(true);
          throw new Error('Please fix the validation errors and try again');
        }
        throw new Error(updateResult.error || 'Failed to update ad');
      }

      // Convert updated backend data back to auction format for the parent component
      const backendData = updateResult.data?.data;
      if (backendData) {
        const updatedAuction: AuctionData = {
          ...auction,
          name: backendData.title || auction.name,
          // Handle step 1 response format (category_name, subcategory_name) vs other steps (category, subcategory)
          category: backendData.category_name || backendData.category || auction.category,
          subcategory: backendData.subcategory_name || backendData.subcategory || auction.subcategory,
          description: backendData.description || auction.description,
          basePrice: backendData.starting_bid_price ? `${backendData.starting_bid_price} ${backendData.currency || 'SEK'}` : auction.basePrice,
          volume: backendData.available_quantity && backendData.unit_of_measurement ? `${backendData.available_quantity} ${backendData.unit_of_measurement}` : auction.volume,
          keywords: backendData.keywords || auction.keywords
        };

        await onSubmit(updatedAuction);
      }

      setHasChanges(false);
      toast.success('Changes saved successfully!', {
        description: `Step ${activeStep} has been updated.`
      });
      // Force refresh of the auction detail page so latest data shows up immediately
      try {
        if (onRefresh) {
          await onRefresh(); // Call parent's refresh function if available
        } else {
          router.refresh(); // Fallback to Next.js refresh if no parent callback
        }
      } catch (_e) {
        // Fallback hard reload if refresh fails or errors
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }

      // Reload complete ad data to refresh step completion status
      try {
        const refreshedData = await adCreationService.getAdDetails(parseInt(auction.id));
        if (refreshedData.success && refreshedData.data) {
          setCompleteAdData(refreshedData.data);

          // Re-initialize step data with fresh backend data
          const freshData = refreshedData.data;
          setStepData({
            // Step 1: Material Type
            materialType: freshData.category_name || '',
            category: freshData.category_name || '',
            subcategory: freshData.subcategory_name || '',
            specificMaterial: freshData.specific_material ? 
              (typeof freshData.specific_material === 'string' ? 
                freshData.specific_material.split(',').map((s: string) => s.trim()).filter(Boolean) : 
                []) : [],
            packaging: freshData.packaging || '',
            materialFrequency: freshData.material_frequency || '',

            // Step 2: Specifications
            grade: freshData.specification?.material_grade_display || '',
            color: freshData.specification?.color || '',
            form: freshData.specification?.material_form_display || '',
            additionalSpecs: freshData.additional_specifications ? [freshData.additional_specifications] : [],

            // Step 3: Origin
            origin: freshData.origin_display || '',

            // Step 4: Contamination
            contaminationLevel: freshData.contamination_display || '',
            additives: freshData.additives_display ? [freshData.additives_display] : [],
            storageConditions: freshData.storage_conditions_display || '',

            // Step 5: Processing Methods
            processingMethods: freshData.processing_methods || [],

            // Step 6: Location & Logistics
            location: freshData.location ? {
              country: freshData.location.country || '',
              region: freshData.location.state_province || '',
              city: freshData.location.city || '',
              fullAddress: freshData.location.address_line || '',
              postalCode: freshData.location.postal_code || '',
              deliveryOptions: freshData.delivery_options || []
            } : {
              country: '',
              region: '',
              city: '',
              fullAddress: '',
              postalCode: '',
              deliveryOptions: []
            },

            // Step 7: Quantity & Price
            availableQuantity: freshData.available_quantity || 0,
            unit: freshData.unit_of_measurement || '',
            minimumOrder: freshData.minimum_order_quantity || 0,
            startingPrice: freshData.starting_bid_price || 0,
            currency: freshData.currency || 'SEK',
            auctionDuration: freshData.auction_duration ? String(freshData.auction_duration) : '',
            reservePrice: freshData.reserve_price || 0,
            customAuctionDuration: freshData.custom_auction_duration || 0,

            // Step 8: Details with image handling
            title: freshData.title || '',
            description: freshData.description || '',
            keywords: freshData.keywords ? freshData.keywords.split(', ') : [],
            images: [],
            currentImageUrl: freshData.material_image || ''
          });

        }
      } catch (_reloadError) {
        // Don't throw error here, save was successful
      }

      // Close modal if requested
      if (shouldCloseAfterSave) {
        onClose();
        setShouldCloseAfterSave(false);
      }

      // Reset loading state on success
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      // Error already handled by toast notification
      toast.error('Failed to save changes', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  // Helper function to get current step data based on active step
  const getCurrentStepData = () => {
    switch (activeStep) {
      case 1:
        // Step 1: Material Type - backend integration
        if (!selectedCategoryId || !stepData.subcategory) {
          return null;
        }

        // Find subcategory ID from the selected subcategory name
        const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
        if (!selectedCategory || !selectedCategory.subcategories) {
          return null;
        }

        const subcategory = selectedCategory.subcategories.find(sub => sub.name === stepData.subcategory);
        if (!subcategory) {
          return null;
        }

        const step1Data: any = {
          category_id: selectedCategoryId,
          subcategory_id: subcategory.id
        };

        // Add optional fields if they exist
        if (stepData.specificMaterial && stepData.specificMaterial.length > 0) {
          step1Data.specific_material = stepData.specificMaterial.join(', ');
        }

        if (stepData.packaging) {
          step1Data.packaging = stepData.packaging;
        }

        if (stepData.materialFrequency) {
          step1Data.material_frequency = stepData.materialFrequency;
        }

        return step1Data;
        
      case 2:
        // Specifications step - match NEW backend API format
        // Backend expects: specification_color, specification_material_grade, specification_material_form, specification_additional

        const step2Data: any = {};

        // Map frontend values to backend field names
        if (stepData.color) {
          step2Data.specification_color = stepData.color;
        }

        if (stepData.grade) {
          // Convert display name to backend value (e.g., "Virgin Grade" -> "virgin_grade")
          step2Data.specification_material_grade = convertLabelToValue('material_grade', stepData.grade);
        }

        if (stepData.form) {
          // Convert display name to backend value (e.g., "Pellets/Granules" -> "pellets_granules")
          step2Data.specification_material_form = convertLabelToValue('material_form', stepData.form);
        }

        // Combine additional specs into a single string
        if (stepData.additionalSpecs && stepData.additionalSpecs.length > 0) {
          step2Data.specification_additional = stepData.additionalSpecs.filter(spec => spec.trim()).join(', ');
        }


        // Ensure at least one field is provided (backend requirement)
        if (Object.keys(step2Data).length === 0) {
          return null;
        }

        return step2Data;
        
      case 3:
        // Material Origin step - match creation form structure
        if (!stepData.origin) {
          return null;
        }

        const step3Data = {
          origin: stepData.origin // Already using correct ID
        };

        return step3Data;
        
      case 4:
        // Contamination step - match creation form structure
        if (!stepData.contaminationLevel) {
          return null;
        }

        if (!stepData.additives || stepData.additives.length === 0) {
          return null;
        }

        if (!stepData.storageConditions) {
          return null;
        }

        const step4Data = {
          contamination: stepData.contaminationLevel, // Already using correct ID
          additives: stepData.additives[0], // Already using correct ID
          storage_conditions: stepData.storageConditions // Already using correct ID
        };

        return step4Data;
        
      case 5:
        // Processing Methods step - use method IDs directly

        const methods = Array.isArray(stepData.processingMethods)
          ? stepData.processingMethods
          : (stepData.processingMethods ? [stepData.processingMethods] : []);

        if (!methods || methods.length === 0) {
          return null;
        }

        const step5Data = {
          processing_methods: methods
        };

        return step5Data;
        
      case 6:
        // Location & Logistics step - match creation form structure

        if (!stepData.location?.country || !stepData.location?.city) {
          return null;
        }

        const deliveryOptions = Array.isArray(stepData.location?.deliveryOptions)
          ? stepData.location.deliveryOptions // Already using correct IDs
          : (stepData.location?.deliveryOptions ? [stepData.location.deliveryOptions] : []);

        if (!deliveryOptions || deliveryOptions.length === 0) {
          return null;
        }

        const step6Data = {
          location_data: {
            country: stepData.location.country,
            state_province: stepData.location.region || undefined,
            city: stepData.location.city,
            address_line: stepData.location.fullAddress || undefined,
            postal_code: stepData.location.postalCode || undefined
          },
          delivery_options: deliveryOptions
        };

        return step6Data;
        
      case 7:
        // Quantity & Price step - match creation form structure exactly
        // Handle custom auction duration properly
        const isCustomDuration = stepData.auctionDuration === 'custom';
        const auctionDurationValue = isCustomDuration ? 0 : parseInt(stepData.auctionDuration || '7');
        
        const step7Data: any = {
          available_quantity: Number(stepData.availableQuantity || 0),
          unit_of_measurement: stepData.unit || '', // Already using correct unit values
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
    // First check backend step completion status from completeAdData (fresh from API)
    if (completeAdData?.step_completion_status && completeAdData.step_completion_status[stepNumber.toString()]) {
      return 'completed';
    }
    
    // Fallback to auction prop data if available
    if (auction.stepCompletionStatus && auction.stepCompletionStatus[stepNumber.toString()]) {
      return 'completed';
    }

    // If backend status is not available or incomplete, check data presence
    if (completeAdData) {
      switch (stepNumber) {
        case 1:
          // Step 1: UI only mode - never mark as completed from data
          break;
        case 2:
          // Step 2: Specifications - check if specification OR additional_specifications exist
          const hasSpecification = completeAdData.specification && (
            completeAdData.specification.material_grade ||
            completeAdData.specification.color ||
            completeAdData.specification.material_form
          );
          const hasAdditionalSpecs = completeAdData.additional_specifications &&
            (typeof completeAdData.additional_specifications === 'string' ?
             completeAdData.additional_specifications.trim().length > 0 : false);

          // Only mark as completed if there's actual specification data
          if (hasSpecification || hasAdditionalSpecs) {
            return 'completed';
          }
          break;
        case 3:
          // Step 3: Material Origin - check if origin exists
          if (completeAdData.origin) {
            return 'completed';
          }
          break;
        case 4:
          // Step 4: Contamination - check if ALL contamination fields exist (strict check)
          const hasContamination = completeAdData.contamination &&
            (typeof completeAdData.contamination === 'string' ? completeAdData.contamination.trim() !== '' : false);
          const hasAdditives = completeAdData.additives &&
            (typeof completeAdData.additives === 'string' ? completeAdData.additives.trim() !== '' : false);
          const hasStorage = completeAdData.storage_conditions &&
            (typeof completeAdData.storage_conditions === 'string' ? completeAdData.storage_conditions.trim() !== '' : false);

          if (hasContamination && hasAdditives && hasStorage) {
            return 'completed';
          }
          break;
        case 5:
          // Step 5: Processing Methods - check if processing_methods exist
          if (completeAdData.processing_methods && completeAdData.processing_methods.length > 0) {
            return 'completed';
          }
          break;
        case 6:
          // Step 6: Location & Logistics - check if ALL required fields exist (strict check)
          const hasLocation = completeAdData.location &&
            completeAdData.location.country &&
            completeAdData.location.city;
          const hasDeliveryOptions = completeAdData.delivery_options &&
            Array.isArray(completeAdData.delivery_options) &&
            completeAdData.delivery_options.length > 0;

          if (hasLocation && hasDeliveryOptions) {
            return 'completed';
          }
          break;
        case 7:
          // Step 7: Quantity & Pricing - check if ALL required fields exist (strict check)
          const hasQuantity = completeAdData.available_quantity && completeAdData.available_quantity > 0;
          const hasUnit = completeAdData.unit_of_measurement &&
            (typeof completeAdData.unit_of_measurement === 'string' ? completeAdData.unit_of_measurement.trim() !== '' : false);
          const hasStartingPrice = completeAdData.starting_bid_price && completeAdData.starting_bid_price > 0;
          const hasCurrency = completeAdData.currency &&
            (typeof completeAdData.currency === 'string' ? completeAdData.currency.trim() !== '' : false);
          const hasAuctionDuration = completeAdData.auction_duration &&
            (typeof completeAdData.auction_duration === 'string' ? completeAdData.auction_duration.trim() !== '' :
             typeof completeAdData.auction_duration === 'number' ? completeAdData.auction_duration > 0 : false);

          if (hasQuantity && hasUnit && hasStartingPrice && hasCurrency && hasAuctionDuration) {
            return 'completed';
          }
          break;
        case 8:
          // Step 8: Title & Description - check if ALL required fields exist (strict check)
          const hasTitle = completeAdData.title &&
            (typeof completeAdData.title === 'string' ? completeAdData.title.trim().length >= 10 : false);
          const hasDescription = completeAdData.description &&
            (typeof completeAdData.description === 'string' ? completeAdData.description.trim().length >= 30 : false);

          if (hasTitle && hasDescription) {
            return 'completed';
          }
          break;
      }
    }

    // Only use current step fallback if no step completion status is available at all
    if (!completeAdData?.step_completion_status && !auction.stepCompletionStatus) {
      return stepNumber <= (auction.currentStep || 1) ? 'completed' : 'pending';
    }

    // If we have step completion status but this specific step is not completed, return pending
    return 'pending';
  };

  // New state management for categories and subcategories
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);

  // Find selected category object - moved here to fix initialization order
  const selectedCategory = React.useMemo(() => {
    if (!selectedCategoryId || !categories.length) return null;
    return categories.find(cat => cat.id === selectedCategoryId) || null;
  }, [selectedCategoryId, categories]);

  // Handle subcategory loading when category is selected
  useEffect(() => {
    if (selectedCategory && selectedCategory.subcategories) {
      setIsLoadingSubcategories(true);
      
      // Simulate loading delay for better UX (can be removed if not needed)
      const timer = setTimeout(() => {
        setAvailableSubcategories(selectedCategory.subcategories || []);
        setIsLoadingSubcategories(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setAvailableSubcategories([]);
      setIsLoadingSubcategories(false);
    }
  }, [selectedCategory]);

  // Initialize category selection from existing data
  useEffect(() => {
    if (categories.length > 0 && stepData.category && !selectedCategoryId) {
      const existingCategory = categories.find(cat => cat.name === stepData.category);
      if (existingCategory) {
        setSelectedCategoryId(existingCategory.id);
      }
    }
  }, [categories, stepData.category, selectedCategoryId]);

  // Reset category state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategoryId(null);
      setAvailableSubcategories([]);
      setIsLoadingSubcategories(false);
    }
  }, [isOpen]);
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
                {/* NEW CATEGORY SELECTION SYSTEM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Main Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.filter(cat => cat.name !== 'All materials').map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className={`
                          p-4 rounded-lg border-2 text-left transition-all hover:scale-105 relative
                          ${selectedCategoryId === category.id
                            ? 'border-[#FF8A00] bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center justify-center">
                          <h4 className="text-gray-900 text-center font-medium">{category.name}</h4>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* NEW SUBCATEGORY SELECTION SYSTEM */}
                {selectedCategoryId && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Subcategory *
                    </label>
                    
                    {isLoadingSubcategories ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin mr-3" />
                        <span className="text-gray-600 text-sm">Loading subcategories...</span>
                      </div>
                    ) : availableSubcategories.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => handleSubcategorySelect(subcategory)}
                            className={`
                              p-3 rounded-lg border-2 text-sm text-left transition-all hover:scale-105 relative
                              ${stepData.subcategory === subcategory.name
                                ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }
                            `}
                          >
                            <span>{subcategory.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : selectedCategory ? (
                      <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No subcategories available for {selectedCategory.name}</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Verify Category Button */}
                {selectedCategory && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      Verify Category
                    </button>
                  </div>
                )}

                {/* Specific Material Input - Tag-based like keywords */}
                {stepData.subcategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Material (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(stepData.specificMaterial || []).map((material, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 bg-[#FF8A00] text-white text-sm rounded-full">
                          {material}
                          <button
                            onClick={() => handleSpecificMaterialRemove(index)}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., Grade 5052 Aluminum, HDPE milk bottles, etc. Press Enter to add"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            handleSpecificMaterialAdd(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add specific details about the material and press Enter. You can add multiple materials.
                    </p>
                  </div>
                )}

                {/* Packaging Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    How is the material packaged? *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packagingOptions.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleStepDataChange({ packaging: type.id })}
                          className={`
                            p-4 rounded-lg border-2 transition-all text-left hover:scale-105
                            ${stepData.packaging === type.id
                              ? 'border-[#FF8A00] bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`
                              ${stepData.packaging === type.id
                                ? 'text-[#FF8A00]'
                                : 'text-gray-400'
                              }
                            `}>
                              <Icon className="w-6 h-6" />
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

                {/* Sell Frequency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    How often do you have this material? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sellFrequencies.map((frequency) => (
                      <button
                        key={frequency.id}
                        onClick={() => handleStepDataChange({ materialFrequency: frequency.id })}
                        className={`
                          p-3 rounded-lg border-2 text-sm text-center transition-all hover:scale-105
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
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Material Specifications
              </h3>
              <p className="text-gray-600">
                Provide detailed specifications for your {stepData.materialType || 'material'}
              </p>
            </div>

            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Grade
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

            {/* Material Form Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Form
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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

            {/* Additional Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Specifications
              </label>

              {/* Custom specification input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g., Melt Flow Index: 2.5, Density: 0.95 g/cm³"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      if (input.value.trim()) {
                        const newSpecs = [...(stepData.additionalSpecs || []), input.value.trim()];
                        handleStepDataChange({ additionalSpecs: newSpecs });
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      const newSpecs = [...(stepData.additionalSpecs || []), input.value.trim()];
                      handleStepDataChange({ additionalSpecs: newSpecs });
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#e67700] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Display added specifications */}
              {stepData.additionalSpecs && stepData.additionalSpecs.length > 0 && (
                <div className="space-y-2">
                  {stepData.additionalSpecs.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                    >
                      <span className="text-sm text-gray-700">{spec}</span>
                      <button
                        onClick={() => {
                          const newSpecs = stepData.additionalSpecs?.filter((_, i) => i !== index) || [];
                          handleStepDataChange({ additionalSpecs: newSpecs });
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    <div className="flex items-center space-x-3">
                      <div className={`
                        ${stepData.origin === option.id
                          ? 'text-[#FF8A00]'
                          : 'text-gray-400'
                        }
                      `}>
                        <Factory className="w-7 h-7" />
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
                      w-full p-4 rounded-lg border text-left transition-all
                      ${stepData.contaminationLevel === level.id
                        ? 'border-[#FF8A00] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        ${stepData.contaminationLevel === level.id
                          ? level.color === 'green'
                            ? 'text-green-500'
                            : 'text-red-500'
                          : 'text-gray-400'
                        }
                      `}>
                        {level.color === 'green' ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
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
                    key={additive.id}
                    onClick={() => {
                      const currentAdditives = stepData.additives || [];
                      const isSelected = currentAdditives.includes(additive.id);

                      if (isSelected) {
                        handleStepDataChange({
                          additives: currentAdditives.filter(a => a !== additive.id)
                        });
                      } else {
                        handleStepDataChange({
                          additives: [...currentAdditives, additive.id]
                        });
                      }
                    }}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.additives?.includes(additive.id)
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {additive.name}
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
                      <div className="flex items-center space-x-3">
                        <div className={`
                          ${stepData.storageConditions === condition.id
                            ? 'text-[#FF8A00]'
                            : 'text-gray-400'
                          }
                        `}>
                          <Icon className="w-6 h-6" />
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
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing methods
              </h3>
              <p className="text-gray-600">
                Select the applicable processing methods.
              </p>
            </div>

            {/* Processing Methods Selection */}
            <div>
              <div className="space-y-3">
                {processingMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      const currentMethods = stepData.processingMethods || [];
                      const isSelected = currentMethods.includes(method.id);

                      if (isSelected) {
                        handleStepDataChange({
                          processingMethods: currentMethods.filter(m => m !== method.id)
                        });
                      } else {
                        handleStepDataChange({
                          processingMethods: [...currentMethods, method.id]
                        });
                      }
                    }}
                    className={`
                      w-full p-4 rounded-lg border text-left transition-all
                      ${stepData.processingMethods?.includes(method.id)
                        ? 'border-[#FF8A00] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        ${stepData.processingMethods?.includes(method.id)
                          ? 'text-[#FF8A00]'
                          : 'text-gray-400'
                        }
                      `}>
                        <Settings className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{method.name}</h4>
                          {stepData.processingMethods?.includes(method.id) && (
                            <CheckCircle className="w-4 h-4 text-[#FF8A00]" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Processing Summary */}
            {stepData.processingMethods && stepData.processingMethods.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Processing Methods</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {stepData.processingMethods.map(methodId => {
                    const method = processingMethods.find(m => m.id === methodId);
                    return (
                      <div key={methodId}>
                        <span className="font-medium text-gray-700">•</span> {method?.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Information Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Processing Guidelines</h4>
                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                    <p>• Select all applicable processing methods for your material</p>
                    <p>• Multiple methods can be selected if applicable</p>
                    <p>• This helps buyers understand material compatibility</p>
                  </div>
                </div>
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
                      <div className="flex items-center space-x-3">
                        <div className={`
                          ${isSelected
                            ? 'text-[#FF8A00]'
                            : 'text-gray-400'
                          }
                        `}>
                          <Icon className="w-6 h-6" />
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
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quantity & Pricing
              </h3>
              <p className="text-gray-600">
                Specify the quantity available and set your auction pricing
              </p>
            </div>

            {/* Quantity Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Quantity Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Package className="inline w-4 h-4 mr-2" />
                    Available Quantity *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1000"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg ${
                      quantityErrors.availableQuantity 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    value={stepData.availableQuantity || ''}
                    onChange={(e) => {
                      // Filter out non-digits
                      const filteredValue = e.target.value.replace(/[^\d]/g, '');
                      handleIntegerFieldChange('availableQuantity', filteredValue);
                    }}
                  />
                  {quantityErrors.availableQuantity && (
                    <p className="text-red-500 text-xs mt-1">{quantityErrors.availableQuantity}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Total quantity available for auction
                  </p>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Unit of Measurement *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg"
                    value={stepData.unit || ''}
                    onChange={(e) => handleStepDataChange({ unit: e.target.value })}
                  >
                    <option value="">Select unit...</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Minimum Order Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Box className="inline w-4 h-4 mr-2" />
                Minimum Order Quantity
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g., 100"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                    quantityErrors.minimumOrder 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  value={stepData.minimumOrder || ''}
                  onChange={(e) => {
                    // Filter out non-digits
                    const filteredValue = e.target.value.replace(/[^\d]/g, '');
                    handleIntegerFieldChange('minimumOrder', filteredValue);
                  }}
                />
                <span className="text-gray-500">{stepData.unit || 'unit'}</span>
              </div>
              {quantityErrors.minimumOrder && (
                <p className="text-red-500 text-xs mt-1">{quantityErrors.minimumOrder}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum quantity buyers must purchase (leave 0 for no minimum)
              </p>
            </div>

            {/* Price Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Auction Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starting Bid Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Starting Bid Price *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0"
                      className={`w-full px-4 py-3 pr-16 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg ${
                        priceErrors.startingPrice 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                      value={stepData.startingPrice || ''}
                      onChange={(e) => {
                        // Filter out non-digits
                        const filteredValue = e.target.value.replace(/[^\d]/g, '');
                        handleIntegerFieldChange('startingPrice', filteredValue);
                      }}
                    />
                  </div>
                  {priceErrors.startingPrice && (
                    <p className="text-red-500 text-xs mt-1">{priceErrors.startingPrice}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Initial bid price per {stepData.unit || 'unit'}
                  </p>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Currency *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg bg-gray-100"
                    value={stepData.currency || 'SEK'}
                    disabled
                    title="Only SEK currency is supported"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Only Swedish Krona (SEK) is currently supported
                  </p>
                </div>
              </div>
            </div>

            {/* Auction Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Thermometer className="inline w-4 h-4 mr-2" />
                Auction Duration *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {bidDurationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      const duration = option.value;
                      handleStepDataChange({ auctionDuration: duration });
                      // Clear custom duration fields if switching away from custom
                      if (duration !== 'custom') {
                        handleStepDataChange({ customAuctionDuration: 0 });
                      }
                    }}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.auctionDuration === option.value
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Custom Duration Calendar */}
              {stepData.auctionDuration === 'custom' && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Thermometer className="w-4 h-4 mr-2 text-[#FF8A00]" />
                    <label className="text-sm font-medium text-gray-700">
                      Select End Date
                    </label>
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
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

            {/* Reserve Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reserve Price (Optional)
              </label>
              <input
                type="text"
                placeholder="Minimum acceptable price"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                  priceErrors.reservePrice 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={stepData.reservePrice || ''}
                onChange={(e) => {
                  // Filter out non-digits
                  const filteredValue = e.target.value.replace(/[^\d]/g, '');
                  handleIntegerFieldChange('reservePrice', filteredValue);
                }}
              />
              {priceErrors.reservePrice && (
                <p className="text-red-500 text-xs mt-1">{priceErrors.reservePrice}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                If no bids reach this price, the auction will not complete
              </p>
            </div>

            {/* Price Summary */}
            {stepData.startingPrice && stepData.startingPrice > 0 && stepData.availableQuantity && stepData.availableQuantity > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Auction Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Starting Price:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {stepData.startingPrice.toLocaleString('sv-SE', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                      })} {stepData.currency || 'SEK'} per {stepData.unit || 'unit'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Quantity:</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {stepData.availableQuantity.toLocaleString('sv-SE', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                      })} {stepData.unit || 'unit'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Starting Value:</span>
                    <span className="text-lg font-semibold text-[#FF8A00]">
                      {(stepData.startingPrice * stepData.availableQuantity).toLocaleString('sv-SE', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                      })} {stepData.currency || 'SEK'}
                    </span>
                  </div>

                  {stepData.auctionDuration && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Auction Duration:</span>
                      <span className="text-sm font-medium text-gray-700">
                        {stepData.auctionDuration === 'custom'
                          ? (stepData.customAuctionDuration
                              ? `${stepData.customAuctionDuration} days`
                              : 'Custom duration')
                          : bidDurationOptions.find(o => o.value === stepData.auctionDuration)?.label ||
                            `${stepData.auctionDuration} days`}
                      </span>
                    </div>
                  )}

                  {stepData.reservePrice && stepData.reservePrice > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reserve Price:</span>
                      <span className="text-sm font-medium text-gray-700">
                        {stepData.reservePrice.toLocaleString('sv-SE', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2
                        })} {stepData.currency || 'SEK'} per {stepData.unit || 'unit'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Validation Message */}
            {(!stepData.startingPrice || !stepData.availableQuantity || !stepData.unit || !stepData.auctionDuration) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-600">
                  Please set a starting price, available quantity, unit of measurement, and auction duration to continue.
                </p>
              </div>
            )}
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

            {/* Title - Matching creation form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Type className="inline w-4 h-4 mr-2" />
                Listing Title *
                <span className="text-xs text-gray-500 font-normal ml-2">(Minimum 3 characters)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., High-Quality HDPE Post-Industrial Pellets - Food Grade"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-lg ${
                  (stepData.title && stepData.title.length > 0 && stepData.title.trim().length < 3) || (showValidationErrors && validationErrors?.title)
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                value={stepData.title || ''}
                onChange={(e) => handleStepDataChange({ title: e.target.value })}
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
                  (stepData.title && stepData.title.length > 0 && stepData.title.trim().length < 3) || (showValidationErrors && validationErrors?.title)
                    ? 'text-red-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {(stepData.title || '').trim().length}/255 characters
                  {stepData.title && stepData.title.length > 0 && stepData.title.trim().length < 3 && 
                    ` - Need at least ${3 - stepData.title.trim().length} more characters`
                  }
                </p>
                {stepData.title && stepData.title.trim().length >= 3 && stepData.title.length <= 255 && !validationErrors?.title && (
                  <span className="text-xs text-green-600">✓ Valid length</span>
                )}
              </div>
            </div>
            
            {/* Description - now optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Description (Optional)
              </label>
              <textarea
                placeholder="Describe your material in detail - quality, source, condition, processing history, etc. (optional)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] resize-vertical min-h-[120px] ${
                  'border-gray-300'
                }`}
                value={stepData.description || ''}
                onChange={(e) => handleStepDataChange({ description: e.target.value })}
                rows={4}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{(stepData.description || '').trim().length} characters</p>
              </div>
            </div>
            
            {/* Keywords - Matching creation form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Tag className="inline w-4 h-4 mr-2" />
                Keywords (Optional)
                <span className="text-xs text-gray-500 font-normal ml-2">(Maximum 500 characters total)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(stepData.keywords || []).map((keyword, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 bg-[#FF8A00] text-white text-sm rounded-full">
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
              ) : stepData.currentImageUrl && !imageLoadError ? (
                // Show current image from backend (only if no load error)
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={getFullImageUrl(stepData.currentImageUrl)}
                      alt={auction.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-contain"
                      onError={() => {
                        // Set error state to prevent infinite loop
                        setImageLoadError(true);
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
    
    // Title validation (minimum 3 characters)
    if (!stepData.title || stepData.title.trim().length < 3) {
      const titleError = 'Title must be at least 3 characters long';
      errors.push(titleError);
      fieldErrors.title = [titleError];
    } else if (stepData.title.length > 255) {
      const titleError = 'Title must not exceed 255 characters';
      errors.push(titleError);
      fieldErrors.title = [titleError];
    }
    // Description optional – no validation

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
        // Step 1 validation - require category and subcategory
        if (!selectedCategoryId) {
          const error = 'Material category is required';
          errors.push(error);
          fieldErrors.category = [error];
        }
        if (!stepData.subcategory) {
          const error = 'Material subcategory is required';
          errors.push(error);
          fieldErrors.subcategory = [error];
        }
        break;

      case 2:
        // Step 2: Specifications - At least one field must be provided (matching backend requirement)
        const hasGrade = stepData.grade && stepData.grade.trim();
        const hasColor = stepData.color && stepData.color.trim();
        const hasForm = stepData.form && stepData.form.trim();
        const hasAdditionalSpecs = stepData.additionalSpecs && stepData.additionalSpecs.length > 0 && stepData.additionalSpecs.some(spec => spec.trim());

        if (!hasGrade && !hasColor && !hasForm && !hasAdditionalSpecs) {
          const error = 'At least one specification field must be provided (grade, color, form, or additional specifications)';
          errors.push(error);
          fieldErrors.specifications = [error];
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
        // Step 1 validation - require category and subcategory
        return !!(selectedCategoryId && stepData.subcategory);
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
  const titleValid = stepData.title && stepData.title.trim().length >= 3;
  const imageValid = (stepData.images && stepData.images.length > 0) || stepData.currentImageUrl;
  return !!(titleValid && imageValid);
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
              {auction?.name || 'Auction'} - Step {steps.findIndex(step => step.id === activeStep) + 1} of {steps.length}
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
                        ? 'bg-white text-gray-700 border-emerald-300 hover:bg-gray-50'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-white text-[#FF8A00]'
                          : status === 'completed'
                          ? 'bg-emerald-400 text-white'
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
                          isActive ? 'text-white' : status === 'completed' ? 'text-gray-900' : 'text-gray-900'
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
                  {completeAdData?.step_completion_status 
                    ? Object.values(completeAdData.step_completion_status).filter(Boolean).length 
                    : (auction.stepCompletionStatus 
                      ? Object.values(auction.stepCompletionStatus).filter(Boolean).length 
                      : auction.currentStep || 0)
                  } / {steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#FF8A00] h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(() => {
                      const completedCount = completeAdData?.step_completion_status 
                        ? Object.values(completeAdData.step_completion_status).filter(Boolean).length 
                        : (auction.stepCompletionStatus 
                          ? Object.values(auction.stepCompletionStatus).filter(Boolean).length 
                          : auction.currentStep || 0);
                      return (completedCount / steps.length) * 100;
                    })()}%` 
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
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end bg-gray-50 flex-shrink-0">
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

                <Button
                  onClick={() => {
                    setShouldCloseAfterSave(true);
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Close</span>
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
