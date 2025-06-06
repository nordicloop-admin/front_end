"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronLeft, ChevronRight, Save, AlertCircle, Package, Box, Recycle, Factory, Thermometer, Upload } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronLeft, ChevronRight, Save, AlertCircle, Package, Box, Recycle, Factory, Thermometer, Upload } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getCategories, Category } from '@/services/auction';
import { adUpdateService } from '@/services/ads';

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
import { Button } from '@/components/ui/button';
import { getCategories, Category } from '@/services/auction';
import { adUpdateService } from '@/services/ads';

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
  'Pickup Only',
  'Local Delivery',
  'National Shipping',
  'International Shipping',
  'Freight Forwarding'
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
  { value: '30', label: '30 days' }
];

// Default fallback images based on category
const getCategoryImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    'Plastics': '/images/marketplace/categories/plastics.jpg',
    'Metals': '/images/marketplace/categories/metals.jpg',
    'Paper': '/images/marketplace/categories/paper.jpg',
    'Glass': '/images/marketplace/categories/glass.jpg',
    'Textiles': '/images/marketplace/categories/textiles.jpg',
    'Wood': '/images/marketplace/categories/wood.jpg'
  };
  
  return categoryImages[category] || '/images/marketplace/categories/plastics.jpg';
};
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
  'Pickup Only',
  'Local Delivery',
  'National Shipping',
  'International Shipping',
  'Freight Forwarding'
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
  { value: '30', label: '30 days' }
];

// Default fallback images based on category
const getCategoryImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    'Plastics': '/images/marketplace/categories/plastics.jpg',
    'Metals': '/images/marketplace/categories/metals.jpg',
    'Paper': '/images/marketplace/categories/paper.jpg',
    'Glass': '/images/marketplace/categories/glass.jpg',
    'Textiles': '/images/marketplace/categories/textiles.jpg',
    'Wood': '/images/marketplace/categories/wood.jpg'
  };
  
  return categoryImages[category] || '/images/marketplace/categories/plastics.jpg';
};

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
  onSubmit: (auctionData: AuctionData) => Promise<void>;
  auction: AuctionData;
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
  };
  
  // Step 7: Quantity & Price
  availableQuantity?: number;
  unit?: string;
  minimumOrder?: number;
  startingPrice?: number;
  currency?: string;
  auctionDuration?: string;
  reservePrice?: number;
  
  // Step 8: Details with image handling
  title?: string;
  description?: string;
  keywords?: string[];
  images?: File[];
  currentImageUrl?: string; // Current image from backend
}

const steps = [
  { id: 1, title: 'Material Type', description: 'Category, packaging, and frequency' },
  { id: 2, title: 'Specifications', description: 'Grade, color, form, and details' },
  { id: 3, title: 'Material Origin', description: 'Source and origin information' },
  { id: 4, title: 'Contamination', description: 'Contamination level and additives' },
  { id: 5, title: 'Processing Methods', description: 'Processing and treatment methods' },
  { id: 6, title: 'Location & Logistics', description: 'Location and delivery options' },
  { id: 7, title: 'Quantity & Price', description: 'Pricing and quantity details' },
  { id: 8, title: 'Title & Description', description: 'Final details and images' }
];

// Helper function to get full image URL from backend
const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /media/, construct the full URL
  if (imagePath.startsWith('/media/')) {
    return `https://nordic-loop-platform.onrender.com${imagePath}`;
  }
  
  // If it's just a filename, assume it's in the material_images directory
  if (!imagePath.startsWith('/')) {
    return `https://nordic-loop-platform.onrender.com/media/material_images/${imagePath}`;
  }
  
  return `https://nordic-loop-platform.onrender.com${imagePath}`;
};

export default function EditAuctionModal({ isOpen, onClose, onSubmit, auction }: EditAuctionModalProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepData, setStepData] = useState<StepData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories on component mount
  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);
          setCategories(response.data);
        }
      } catch (_error) {
        // Fallback to static categories
        setCategories([
          {
            id: 1,
            name: 'Plastics',
            subcategories: [
              { id: 1, name: 'HDPE' },
              { id: 2, name: 'LDPE' },
              { id: 3, name: 'PET' },
              { id: 4, name: 'PP' },
              { id: 5, name: 'PS' },
              { id: 6, name: 'PVC' },
              { id: 7, name: 'ABS' }
            ]
          },
          {
            id: 2,
            name: 'Metals',
            subcategories: [
              { id: 8, name: 'Aluminum' },
              { id: 9, name: 'Steel' },
              { id: 10, name: 'Copper' },
              { id: 11, name: 'Brass' }
            ]
          },
          {
            id: 3,
            name: 'Paper',
            subcategories: [
              { id: 12, name: 'Cardboard' },
              { id: 13, name: 'Newspaper' },
              { id: 14, name: 'Office Paper' }
            ]
          },
          {
            id: 4,
            name: 'Glass',
            subcategories: [
              { id: 15, name: 'Clear Glass' },
              { id: 16, name: 'Colored Glass' },
              { id: 17, name: 'Glass Bottles' }
            ]
          },
          {
            id: 5,
            name: 'Textiles',
            subcategories: [
              { id: 18, name: 'Cotton' },
              { id: 19, name: 'Polyester' },
              { id: 20, name: 'Mixed Textiles' }
            ]
          },
          {
            id: 6,
            name: 'Wood',
            subcategories: [
              { id: 21, name: 'Clean Wood' },
              { id: 22, name: 'Treated Wood' },
              { id: 23, name: 'Pallets' }
            ]
          }
        ]);
      } catch (_error) {
        // Fallback to static categories
        setCategories([
          {
            id: 1,
            name: 'Plastics',
            subcategories: [
              { id: 1, name: 'HDPE' },
              { id: 2, name: 'LDPE' },
              { id: 3, name: 'PET' },
              { id: 4, name: 'PP' },
              { id: 5, name: 'PS' },
              { id: 6, name: 'PVC' },
              { id: 7, name: 'ABS' }
            ]
          },
          {
            id: 2,
            name: 'Metals',
            subcategories: [
              { id: 8, name: 'Aluminum' },
              { id: 9, name: 'Steel' },
              { id: 10, name: 'Copper' },
              { id: 11, name: 'Brass' }
            ]
          },
          {
            id: 3,
            name: 'Paper',
            subcategories: [
              { id: 12, name: 'Cardboard' },
              { id: 13, name: 'Newspaper' },
              { id: 14, name: 'Office Paper' }
            ]
          },
          {
            id: 4,
            name: 'Glass',
            subcategories: [
              { id: 15, name: 'Clear Glass' },
              { id: 16, name: 'Colored Glass' },
              { id: 17, name: 'Glass Bottles' }
            ]
          },
          {
            id: 5,
            name: 'Textiles',
            subcategories: [
              { id: 18, name: 'Cotton' },
              { id: 19, name: 'Polyester' },
              { id: 20, name: 'Mixed Textiles' }
            ]
          },
          {
            id: 6,
            name: 'Wood',
            subcategories: [
              { id: 21, name: 'Clean Wood' },
              { id: 22, name: 'Treated Wood' },
              { id: 23, name: 'Pallets' }
            ]
          }
        ]);
      } finally {
        setCategoriesLoaded(true);
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, []);
    loadCategories();
  }, []);

  // Initialize form data from auction
  // Initialize form data from auction
  useEffect(() => {
    if (auction && categoriesLoaded) {
    if (auction && categoriesLoaded) {
      const volumeParts = auction.volume.split(' ');
      const volumeValue = parseFloat(volumeParts[0]) || 0;
      const volumeUnit = volumeParts[1] || '';
      
      const basePriceValue = parseFloat(auction.basePrice.replace(/[^0-9.]/g, '')) || 0;
      
      setStepData({
        // Step 1
        category: auction.category,
        subcategory: auction.subcategory,
        materialType: auction.category.toLowerCase(),
        
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
      const volumeValue = parseFloat(volumeParts[0]) || 0;
      const volumeUnit = volumeParts[1] || '';
      
      const basePriceValue = parseFloat(auction.basePrice.replace(/[^0-9.]/g, '')) || 0;
      
      setStepData({
        // Step 1
        category: auction.category,
        subcategory: auction.subcategory,
        materialType: auction.category.toLowerCase(),
        
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
    }
  }, [auction, categoriesLoaded]);

  const handleStepDataChange = (updates: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
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

  // Submit changes to backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Determine if we need to use FormData (for image uploads) or JSON
      const hasImageUpload = stepData.images && stepData.images.length > 0;
      
      if (hasImageUpload) {
        // Use FormData for image upload (PUT request to step 8)
        const response = await adUpdateService.updateAdStep8WithImage(
          parseInt(auction.id),
          stepData.title || auction.name,
          stepData.description || auction.description || '',
          stepData.keywords?.join(', ') || '',
          stepData.images![0]
        );
        
        if (!response.success) {
          throw new Error(response.error);
        }
      } else {
        // Use PATCH for partial updates without image
        const updateData: any = {};
        
        if (stepData.title && stepData.title !== auction.name) {
          updateData.title = stepData.title;
        }
        
        if (stepData.description && stepData.description !== auction.description) {
          updateData.description = stepData.description;
        }
        
        if (stepData.keywords && stepData.keywords.join(', ') !== auction.keywords) {
          updateData.keywords = stepData.keywords.join(', ');
        }
        
        if (stepData.category && stepData.category !== auction.category) {
          // Find category ID
          const selectedCategory = categories.find(cat => cat.name === stepData.category);
          if (selectedCategory) {
            updateData.category = selectedCategory.id;
          }
        }
        
        if (stepData.subcategory && stepData.subcategory !== auction.subcategory) {
          // Find subcategory ID
          const selectedCategory = categories.find(cat => cat.name === stepData.category);
          const selectedSubcategory = selectedCategory?.subcategories.find(sub => sub.name === stepData.subcategory);
          if (selectedSubcategory) {
            updateData.subcategory = selectedSubcategory.id;
          }
        }
        
        if (stepData.startingPrice && stepData.startingPrice !== parseFloat(auction.basePrice.replace(/[^0-9.]/g, ''))) {
          updateData.starting_bid_price = stepData.startingPrice;
        }
        
        if (stepData.currency && stepData.currency !== 'SEK') {
          updateData.currency = stepData.currency;
        }
        
        if (stepData.availableQuantity && stepData.unit) {
          const currentVolume = parseFloat(auction.volume.split(' ')[0]);
          const currentUnit = auction.volume.split(' ')[1];
          
          if (stepData.availableQuantity !== currentVolume) {
            updateData.available_quantity = stepData.availableQuantity;
          }
          
          if (stepData.unit !== currentUnit) {
            updateData.unit_of_measurement = stepData.unit;
          }
        }
        
        // Only make the request if there are changes
        if (Object.keys(updateData).length > 0) {
          const response = await adUpdateService.updatePartialAd(parseInt(auction.id), updateData);
          
          if (!response.success) {
            throw new Error(response.error);
          }
        }
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
    } catch (error) {
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'pending' => {
    if (auction.stepCompletionStatus) {
      return auction.stepCompletionStatus[stepNumber.toString()] ? 'completed' : 'pending';
    }
    return stepNumber <= (auction.currentStep || 1) ? 'completed' : 'pending';
  }, [auction, categoriesLoaded]);

  const handleStepDataChange = (updates: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
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

  // Submit changes to backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Determine if we need to use FormData (for image uploads) or JSON
      const hasImageUpload = stepData.images && stepData.images.length > 0;
      
      if (hasImageUpload) {
        // Use FormData for image upload (PUT request to step 8)
        const response = await adUpdateService.updateAdStep8WithImage(
          parseInt(auction.id),
          stepData.title || auction.name,
          stepData.description || auction.description || '',
          stepData.keywords?.join(', ') || '',
          stepData.images![0]
        );
        
        if (!response.success) {
          throw new Error(response.error);
        }
      } else {
        // Use PATCH for partial updates without image
        const updateData: any = {};
        
        if (stepData.title && stepData.title !== auction.name) {
          updateData.title = stepData.title;
        }
        
        if (stepData.description && stepData.description !== auction.description) {
          updateData.description = stepData.description;
        }
        
        if (stepData.keywords && stepData.keywords.join(', ') !== auction.keywords) {
          updateData.keywords = stepData.keywords.join(', ');
        }
        
        if (stepData.category && stepData.category !== auction.category) {
          // Find category ID
          const selectedCategory = categories.find(cat => cat.name === stepData.category);
          if (selectedCategory) {
            updateData.category = selectedCategory.id;
          }
        }
        
        if (stepData.subcategory && stepData.subcategory !== auction.subcategory) {
          // Find subcategory ID
          const selectedCategory = categories.find(cat => cat.name === stepData.category);
          const selectedSubcategory = selectedCategory?.subcategories.find(sub => sub.name === stepData.subcategory);
          if (selectedSubcategory) {
            updateData.subcategory = selectedSubcategory.id;
          }
        }
        
        if (stepData.startingPrice && stepData.startingPrice !== parseFloat(auction.basePrice.replace(/[^0-9.]/g, ''))) {
          updateData.starting_bid_price = stepData.startingPrice;
        }
        
        if (stepData.currency && stepData.currency !== 'SEK') {
          updateData.currency = stepData.currency;
        }
        
        if (stepData.availableQuantity && stepData.unit) {
          const currentVolume = parseFloat(auction.volume.split(' ')[0]);
          const currentUnit = auction.volume.split(' ')[1];
          
          if (stepData.availableQuantity !== currentVolume) {
            updateData.available_quantity = stepData.availableQuantity;
          }
          
          if (stepData.unit !== currentUnit) {
            updateData.unit_of_measurement = stepData.unit;
          }
        }
        
        // Only make the request if there are changes
        if (Object.keys(updateData).length > 0) {
          const response = await adUpdateService.updatePartialAd(parseInt(auction.id), updateData);
          
          if (!response.success) {
            throw new Error(response.error);
          }
        }
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
    } catch (error) {
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'Failed to save changes');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
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
            
            {selectedCategory && (
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
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
            
            {selectedCategory && (
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
          </div>
        );
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={stepData.location?.country || ''}
                  onChange={(e) => handleStepDataChange({ 
                    location: { ...stepData.location, country: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <input
                  type="text"
                  value={stepData.location?.region || ''}
                  onChange={(e) => handleStepDataChange({ 
                    location: { ...stepData.location, region: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="Enter region or state"
                />
                  value={stepData.location?.country || ''}
                  onChange={(e) => handleStepDataChange({ 
                    location: { ...stepData.location, country: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <input
                  type="text"
                  value={stepData.location?.region || ''}
                  onChange={(e) => handleStepDataChange({ 
                    location: { ...stepData.location, region: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="Enter region or state"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={stepData.location?.city || ''}
                onChange={(e) => handleStepDataChange({ 
                  location: { ...stepData.location, city: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stepData.location?.pickupAvailable || false}
                  onChange={(e) => handleStepDataChange({ 
                    location: { ...stepData.location, pickupAvailable: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                <span className="text-sm text-gray-700">Pickup available at location</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Options
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliveryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      const currentOptions = stepData.location?.deliveryOptions || [];
                      const isSelected = currentOptions.includes(option);
                      
                      if (isSelected) {
                        handleStepDataChange({ 
                          location: {
                            ...stepData.location,
                            deliveryOptions: currentOptions.filter(o => o !== option)
                          }
                        });
                      } else {
                        handleStepDataChange({ 
                          location: {
                            ...stepData.location,
                            deliveryOptions: [...currentOptions, option]
                          }
                        });
                      }
                    }}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.location?.deliveryOptions?.includes(option)
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={stepData.location?.city || ''}
                onChange={(e) => handleStepDataChange({ 
                  location: { ...stepData.location, city: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stepData.location?.pickupAvailable || false}
                  onChange={(e) => handleStepDataChange({ 
                    location: { ...stepData.location, pickupAvailable: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                <span className="text-sm text-gray-700">Pickup available at location</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Options
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliveryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      const currentOptions = stepData.location?.deliveryOptions || [];
                      const isSelected = currentOptions.includes(option);
                      
                      if (isSelected) {
                        handleStepDataChange({ 
                          location: {
                            ...stepData.location,
                            deliveryOptions: currentOptions.filter(o => o !== option)
                          }
                        });
                      } else {
                        handleStepDataChange({ 
                          location: {
                            ...stepData.location,
                            deliveryOptions: [...currentOptions, option]
                          }
                        });
                      }
                    }}
                    className={`
                      p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                      ${stepData.location?.deliveryOptions?.includes(option)
                        ? 'border-[#FF8A00] bg-orange-50 text-[#FF8A00] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={stepData.currency || 'SEK'}
                  onChange={(e) => handleStepDataChange({ currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auction Duration
              </label>
              <select
                value={stepData.auctionDuration || '7'}
                onChange={(e) => handleStepDataChange({ auctionDuration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              >
                {bidDurationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={stepData.title || ''}
                onChange={(e) => handleStepDataChange({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="Enter auction title"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters required
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={stepData.description || ''}
                onChange={(e) => handleStepDataChange({ description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="Describe your material..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters required
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={stepData.keywords?.join(', ') || ''}
                onChange={(e) => handleStepDataChange({ 
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="plastic, recycled, high quality"
              />
              <p className="text-xs text-gray-500 mt-1">
                Help buyers find your material with relevant keywords
              </p>
            </div>
            
            {/* Image Upload Section */}
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Image
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Auction</h2>
            <p className="text-sm text-gray-600">
              {auction.name} - Step {activeStep} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
              
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Auction</h2>
            <p className="text-sm text-gray-600">
              {auction.name} - Step {activeStep} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Steps Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
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
          <div className="flex-1 flex flex-col">
            {/* Step Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {steps[activeStep - 1]?.title}
                  </h3>
                  <p className="text-gray-600">
                    {steps[activeStep - 1]?.description}
                  </p>
                </div>

                {renderStepContent()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                  disabled={activeStep === steps.length}
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
        <div className="flex flex-1 overflow-hidden">
          {/* Steps Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
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
          <div className="flex-1 flex flex-col">
            {/* Step Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {steps[activeStep - 1]?.title}
                  </h3>
                  <p className="text-gray-600">
                    {steps[activeStep - 1]?.description}
                  </p>
                </div>

                {renderStepContent()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                  disabled={activeStep === steps.length}
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
    </div>
  );
}
