/**
 * Validation utilities for Ad Creation form values
 * Based on FRONTEND_CHOICE_VALUES_REFERENCE.md
 */

import { AD_CHOICES } from '@/services/ads';

// Get all valid values for a specific field
export const getValidValues = (field: string): string[] => {
  switch (field) {
    case 'packaging':
      return Object.values(AD_CHOICES.PACKAGING);
    case 'material_frequency':
      return Object.values(AD_CHOICES.MATERIAL_FREQUENCY);
    case 'origin':
      return Object.values(AD_CHOICES.ORIGIN);
    case 'contamination':
      return Object.values(AD_CHOICES.CONTAMINATION);
    case 'additives':
      return Object.values(AD_CHOICES.ADDITIVES);
    case 'storage_conditions':
      return Object.values(AD_CHOICES.STORAGE_CONDITIONS);
    case 'processing_methods':
      return Object.values(AD_CHOICES.PROCESSING_METHODS);
    case 'delivery_options':
      return Object.values(AD_CHOICES.DELIVERY_OPTIONS);
    case 'unit_of_measurement':
      return Object.values(AD_CHOICES.UNIT_OF_MEASUREMENT);
    case 'currency':
      return Object.values(AD_CHOICES.CURRENCY);
    default:
      return [];
  }
};

// Validate if a value is valid for a specific field
export const isValidValue = (field: string, value: string): boolean => {
  const validValues = getValidValues(field);
  return validValues.includes(value);
};

// Validate auction duration (must be integer)
export const isValidAuctionDuration = (duration: number): boolean => {
  const validDurations = Object.values(AD_CHOICES.AUCTION_DURATION);
  // Also allow 0 for custom duration
  return validDurations.includes(duration) || duration === 0;
};

// Convert display label to backend value
export const convertLabelToValue = (field: string, label: string): string => {
  // This is a helper function to convert UI labels to backend values
  // You can extend this based on your UI needs
  
  const labelMappings: Record<string, Record<string, string>> = {
    packaging: {
      'Baled': 'baled',
      'Loose': 'loose',
      'Big-bag': 'big_bag',
      'Octabin': 'octabin',
      'Roles': 'roles',
      'Container': 'container',
      'Other': 'other',
      // Add lowercase versions as well
      'baled': 'baled',
      'loose': 'loose',
      'big_bag': 'big_bag',
      'octabin': 'octabin',
      'roles': 'roles',
      'container': 'container',
      'other': 'other'
    },
    material_frequency: {
      'One-time': 'one_time',
      'Weekly': 'weekly',
      'Bi-weekly': 'bi_weekly',
      'Monthly': 'monthly',
      'Quarterly': 'quarterly',
      'Yearly': 'yearly',
      // Add variations
      'one-time': 'one_time',
      'bi-weekly': 'bi_weekly',
      'weekly': 'weekly',
      'monthly': 'monthly',
      'quarterly': 'quarterly',
      'yearly': 'yearly',
      'one_time': 'one_time',
      'bi_weekly': 'bi_weekly'
    },
    material_grade: {
      'Virgin Grade': 'virgin_grade',
      'Industrial Grade': 'industrial_grade',
      'Food Grade': 'food_grade',
      'Medical Grade': 'medical_grade',
      'Automotive Grade': 'automotive_grade',
      'Electrical Grade': 'electrical_grade',
      'Recycled Grade': 'recycled_grade',
      // Add variations
      'virgin_grade': 'virgin_grade',
      'industrial_grade': 'industrial_grade',
      'food_grade': 'food_grade',
      'medical_grade': 'medical_grade',
      'automotive_grade': 'automotive_grade',
      'electrical_grade': 'electrical_grade',
      'recycled_grade': 'recycled_grade',
      'virgin grade': 'virgin_grade',
      'industrial grade': 'industrial_grade',
      'food grade': 'food_grade',
      'medical grade': 'medical_grade',
      'automotive grade': 'automotive_grade',
      'electrical grade': 'electrical_grade',
      'recycled grade': 'recycled_grade'
    },
    material_form: {
      'Pellets/Granules': 'pellets_granules',
      'Flakes': 'flakes',
      'Regrind': 'regrind',
      'Sheets': 'sheets',
      'Film': 'film',
      'Powder': 'powder',
      'Fiber': 'fiber',
      'Blocks': 'blocks',
      // Add variations
      'pellets_granules': 'pellets_granules',
      'flakes': 'flakes',
      'regrind': 'regrind',
      'sheets': 'sheets',
      'film': 'film',
      'powder': 'powder',
      'fiber': 'fiber',
      'blocks': 'blocks',
      'pellets/granules': 'pellets_granules',
      'pellets granules': 'pellets_granules',
      'Pellets': 'pellets_granules',
      'Granules': 'pellets_granules'
    },
    origin: {
      'Post-industrial': 'post_industrial',
      'Post-consumer': 'post_consumer',
      'Mix': 'mix',
      // Add variations
      'post-industrial': 'post_industrial',
      'post-consumer': 'post_consumer',
      'post_industrial': 'post_industrial',
      'post_consumer': 'post_consumer',
      'mix': 'mix'
    },
    contamination: {
      'Clean': 'clean',
      'Slightly Contaminated': 'slightly_contaminated',
      'Heavily Contaminated': 'heavily_contaminated',
      // Add variations
      'clean': 'clean',
      'slightly_contaminated': 'slightly_contaminated',
      'heavily_contaminated': 'heavily_contaminated',
      'slightly contaminated': 'slightly_contaminated',
      'heavily contaminated': 'heavily_contaminated'
    },
    additives: {
      'UV Stabilizer': 'uv_stabilizer',
      'Antioxidant': 'antioxidant',
      'Flame retardants': 'flame_retardants',
      'Chlorides': 'chlorides',
      'No additives': 'no_additives',
      // Add variations
      'uv_stabilizer': 'uv_stabilizer',
      'antioxidant': 'antioxidant',
      'flame_retardants': 'flame_retardants',
      'chlorides': 'chlorides',
      'no_additives': 'no_additives',
      'uv stabilizer': 'uv_stabilizer',
      'flame retardants': 'flame_retardants',
      'no additives': 'no_additives'
    },
    storage_conditions: {
      'Climate Controlled': 'climate_controlled',
      'Protected Outdoor': 'protected_outdoor',
      'Unprotected Outdoor': 'unprotected_outdoor',
      // Add variations
      'climate_controlled': 'climate_controlled',
      'protected_outdoor': 'protected_outdoor',
      'unprotected_outdoor': 'unprotected_outdoor',
      'climate controlled': 'climate_controlled',
      'protected outdoor': 'protected_outdoor',
      'unprotected outdoor': 'unprotected_outdoor'
    },
    processing_methods: {
      'Blow moulding': 'blow_moulding',
      'Injection moulding': 'injection_moulding',
      'Extrusion': 'extrusion',
      'Calendering': 'calendering',
      'Rotational moulding': 'rotational_moulding',
      'Sintering': 'sintering',
      'Thermoforming': 'thermoforming',
      // Add variations
      'blow_moulding': 'blow_moulding',
      'injection_moulding': 'injection_moulding',
      'extrusion': 'extrusion',
      'calendering': 'calendering',
      'rotational_moulding': 'rotational_moulding',
      'sintering': 'sintering',
      'thermoforming': 'thermoforming',
      'blow moulding': 'blow_moulding',
      'injection moulding': 'injection_moulding',
      'rotational moulding': 'rotational_moulding'
    },
    delivery_options: {
      'Pickup Only': 'pickup_only',
      'Local Delivery': 'local_delivery',
      'National Shipping': 'national_shipping',
      'International Shipping': 'international_shipping',
      'Freight Forwarding': 'freight_forwarding',
      // Add variations
      'pickup_only': 'pickup_only',
      'local_delivery': 'local_delivery',
      'national_shipping': 'national_shipping',
      'international_shipping': 'international_shipping',
      'freight_forwarding': 'freight_forwarding',
      'pickup only': 'pickup_only',
      'local delivery': 'local_delivery',
      'national shipping': 'national_shipping',
      'international shipping': 'international_shipping',
      'freight forwarding': 'freight_forwarding'
    },
    unit_of_measurement: {
      'Kilogram': 'kg',
      'Gram': 'g',
      'Pound': 'lb',
      'Tons': 'tons',
      'Tonnes': 'tonnes',
      'Pounds': 'lbs',
      'Pieces': 'pieces',
      'Units': 'units',
      'Bales': 'bales',
      'Containers': 'containers',
      'Cubic Meters': 'm³',
      'Liters': 'liters',
      'Gallons': 'gallons',
      'Meters': 'meters',
      // Add variations and direct mappings
      'kg': 'kg',
      'g': 'g',
      'lb': 'lb',
      'tons': 'tons',
      'tonnes': 'tonnes',
      'lbs': 'lbs',
      'pounds': 'pounds',
      'pieces': 'pieces',
      'units': 'units',
      'bales': 'bales',
      'containers': 'containers',
      'm³': 'm³',
      'cubic_meters': 'cubic_meters',
      'liters': 'liters',
      'gallons': 'gallons',
      'meters': 'meters',
      'kilogram': 'kg',
      'gram': 'g',
      'pound': 'lb',
      'cubic meters': 'cubic_meters'
    }
  };

  // First try exact match from mapping
  const exactMatch = labelMappings[field]?.[label];
  if (exactMatch) {
    return exactMatch;
  }

  // Try case-insensitive match
  const lowerLabel = label.toLowerCase();
  for (const [key, value] of Object.entries(labelMappings[field] || {})) {
    if (key.toLowerCase() === lowerLabel) {
      return value;
    }
  }

  // Fallback: convert to snake_case and lowercase
  const fallback = label.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  // Validate the fallback against valid values
  const validValues = getValidValues(field);
  if (validValues.includes(fallback)) {
    return fallback;
  }

  // If nothing works, return the original value (this will be caught by validation)
  return label;
};

// Convert backend value to display label
export const convertValueToLabel = (field: string, value: string): string => {
  if (!value) return '';

  const valueMappings: Record<string, Record<string, string>> = {
    packaging: {
      'baled': 'Baled',
      'loose': 'Loose',
      'big_bag': 'Big-bag',
      'octabin': 'Octabin',
      'roles': 'Roles',
      'container': 'Container',
      'other': 'Other',
    },
    material_frequency: {
      'one_time': 'One-time',
      'weekly': 'Weekly',
      'bi_weekly': 'Bi-weekly',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'yearly': 'Yearly',
    },
    origin: {
      'post_industrial': 'Post-industrial',
      'post_consumer': 'Post-consumer',
      'mix': 'Mix',
    },
    contamination: {
      'clean': 'Clean',
      'slightly_contaminated': 'Slightly Contaminated',
      'heavily_contaminated': 'Heavily Contaminated',
    },
    additives: {
      'uv_stabilizer': 'UV Stabilizer',
      'antioxidant': 'Antioxidant',
      'flame_retardants': 'Flame retardants',
      'chlorides': 'Chlorides',
      'no_additives': 'No additives',
    },
    storage_conditions: {
      'climate_controlled': 'Climate Controlled',
      'protected_outdoor': 'Protected Outdoor',
      'unprotected_outdoor': 'Unprotected Outdoor',
    },
    processing_methods: {
      'blow_moulding': 'Blow moulding',
      'injection_moulding': 'Injection moulding',
      'extrusion': 'Extrusion',
      'calendering': 'Calendering',
      'rotational_moulding': 'Rotational moulding',
      'sintering': 'Sintering',
      'thermoforming': 'Thermoforming',
    },
    delivery_options: {
      'pickup_only': 'Pickup Only',
      'local_delivery': 'Local Delivery',
      'national_shipping': 'National Shipping',
      'international_shipping': 'International Shipping',
      'freight_forwarding': 'Freight Forwarding',
    },
    unit_of_measurement: {
      'kg': 'Kilogram',
      'g': 'Gram',
      'lb': 'Pound',
      'tons': 'Tons',
      'tonnes': 'Tonnes',
      'lbs': 'Pounds',
      'pieces': 'Pieces',
      'units': 'Units',
      'bales': 'Bales',
      'containers': 'Containers',
      'm³': 'Cubic Meters',
      'cubic_meters': 'Cubic Meters',
      'liters': 'Liters',
      'gallons': 'Gallons',
      'meters': 'Meters',
    }
  };

  const label = valueMappings[field]?.[value];
  if (label) {
    return label;
  }

  // Fallback for values that don't have a direct mapping
  // (e.g., 'post_industrial' -> 'Post Industrial')
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Validation helper for Step data before sending to API
export const validateStepData = (step: number, data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!isValidValue('packaging', data.packaging)) {
        errors.push(`Invalid packaging value: ${data.packaging}`);
      }
      if (!isValidValue('material_frequency', data.material_frequency)) {
        errors.push(`Invalid material_frequency value: ${data.material_frequency}`);
      }
      break;

    case 3:
      if (!isValidValue('origin', data.origin)) {
        errors.push(`Invalid origin value: ${data.origin}`);
      }
      break;

    case 4:
      if (!isValidValue('contamination', data.contamination)) {
        errors.push(`Invalid contamination value: ${data.contamination}`);
      }
      if (!isValidValue('additives', data.additives)) {
        errors.push(`Invalid additives value: ${data.additives}`);
      }
      if (!isValidValue('storage_conditions', data.storage_conditions)) {
        errors.push(`Invalid storage_conditions value: ${data.storage_conditions}`);
      }
      break;

    case 5:
      if (!Array.isArray(data.processing_methods)) {
        errors.push('processing_methods must be an array');
      } else {
        data.processing_methods.forEach((method: string) => {
          if (!isValidValue('processing_methods', method)) {
            errors.push(`Invalid processing_methods value: ${method}`);
          }
        });
      }
      break;

    case 6:
      if (!Array.isArray(data.delivery_options)) {
        errors.push('delivery_options must be an array');
      } else {
        data.delivery_options.forEach((option: string) => {
          if (!isValidValue('delivery_options', option)) {
            errors.push(`Invalid delivery_options value: ${option}`);
          }
        });
      }
      break;

    case 7:
      if (!isValidValue('unit_of_measurement', data.unit_of_measurement)) {
        errors.push(`Invalid unit_of_measurement value: ${data.unit_of_measurement}`);
      }
      if (!isValidValue('currency', data.currency)) {
        errors.push(`Invalid currency value: ${data.currency}`);
      }
      if (!isValidAuctionDuration(data.auction_duration)) {
        errors.push(`Invalid auction_duration value: ${data.auction_duration}`);
      }
      if (typeof data.auction_duration !== 'number') {
        errors.push('auction_duration must be a number');
      }
      
      // Validate custom auction duration if auction_duration is 0
      if (data.auction_duration === 0) {
        if (!data.custom_auction_duration || typeof data.custom_auction_duration !== 'number') {
          errors.push('custom_auction_duration is required when auction_duration is 0');
        } else if (data.custom_auction_duration <= 0 || data.custom_auction_duration > 90) {
          errors.push('custom_auction_duration must be between 1 and 90 days');
        }
      }
      break;

    case 8:
      // Step 8 validation updated: Title min 3 chars; Description optional
      if (!data.title || typeof data.title !== 'string') {
        errors.push('Title is required');
      } else if (data.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters long');
      } else if (data.title.length > 255) {
        errors.push('Title must not exceed 255 characters');
      }

      // Description optional – no validation errors if missing or short

      // Keywords validation - optional but if provided, check total length
      if (data.keywords) {
        let keywordsText = '';
        if (Array.isArray(data.keywords)) {
          keywordsText = data.keywords.join(', ');
        } else if (typeof data.keywords === 'string') {
          keywordsText = data.keywords;
        }
        
        if (keywordsText.length > 500) {
          errors.push('Keywords must not exceed 500 characters total');
        }
      }
      
      // Image validation - OPTIONAL according to backend
      // No image validation required as per STEP_8_VALIDATION_GUIDE.md
      
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};