import React, { useState, useEffect } from 'react';
import { Package, Recycle, ChevronDown, Box } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string; }[];
}

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

export function MaterialTypeStep({ formData, updateFormData }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load categories from the data file
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories'); // We'll need to create this API endpoint
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (_error) {
        // Fallback to static data if API fails
        setCategories([
          {
            id: 'plastics',
            name: 'Plastics',
            subcategories: [
              { id: 'plastics-hdpe', name: 'HDPE' },
              { id: 'plastics-ldpe', name: 'LDPE' },
              { id: 'plastics-pet', name: 'PET' },
              { id: 'plastics-pp', name: 'PP' },
              { id: 'plastics-ps', name: 'PS' },
              { id: 'plastics-pvc', name: 'PVC' },
              { id: 'plastics-abs', name: 'ABS' }
            ]
          },
          {
            id: 'metals',
            name: 'Metals',
            subcategories: [
              { id: 'metals-aluminum', name: 'Aluminum' },
              { id: 'metals-steel', name: 'Steel' },
              { id: 'metals-copper', name: 'Copper' },
              { id: 'metals-brass', name: 'Brass' }
            ]
          },
          {
            id: 'paper',
            name: 'Paper',
            subcategories: [
              { id: 'paper-cardboard', name: 'Cardboard' },
              { id: 'paper-newspaper', name: 'Newspaper' },
              { id: 'paper-office', name: 'Office Paper' }
            ]
          },
          {
            id: 'glass',
            name: 'Glass',
            subcategories: [
              { id: 'glass-clear', name: 'Clear Glass' },
              { id: 'glass-colored', name: 'Colored Glass' },
              { id: 'glass-bottles', name: 'Glass Bottles' }
            ]
          },
          {
            id: 'textiles',
            name: 'Textiles',
            subcategories: [
              { id: 'textiles-cotton', name: 'Cotton' },
              { id: 'textiles-polyester', name: 'Polyester' },
              { id: 'textiles-mixed', name: 'Mixed Textiles' }
            ]
          },
          {
            id: 'wood',
            name: 'Wood',
            subcategories: [
              { id: 'wood-clean', name: 'Clean Wood' },
              { id: 'wood-treated', name: 'Treated Wood' },
              { id: 'wood-pallets', name: 'Pallets' }
            ]
          },
          {
            id: 'building-material',
            name: 'Building Material',
            subcategories: [
              { id: 'building-concrete', name: 'Concrete' },
              { id: 'building-bricks', name: 'Bricks' },
              { id: 'building-insulation', name: 'Insulation' }
            ]
          },
          {
            id: 'organic-waste',
            name: 'Organic Waste',
            subcategories: [
              { id: 'organic-food', name: 'Food Waste' },
              { id: 'organic-garden', name: 'Garden Waste' },
              { id: 'organic-compost', name: 'Compost' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handlePackagingSelect = (packaging: string) => {
    updateFormData({ 
      quantity: {
        ...formData.quantity,
        packaging
      }
    });
  };

  const handleFrequencySelect = (frequency: string) => {
    updateFormData({ sellFrequency: frequency });
  };

  const handleCategorySelect = (category: string) => {
    updateFormData({ 
      category,
      materialType: category, // Set materialType to match category
      subcategory: '', // Reset subcategory when category changes
      specificMaterial: '' 
    });
  };

  const handleSubcategorySelect = (subcategory: string) => {
    updateFormData({ subcategory, specificMaterial: '' });
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Material Information
        </h3>
        <p className="text-gray-600">
          Let&apos;s start by understanding what type of material you want to list
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Main Category *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all hover:scale-105
                ${formData.category === category.id
                  ? 'border-[#FF8A00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <ChevronDown className={`
                  w-4 h-4 transition-transform
                  ${formData.category === category.id ? 'text-[#FF8A00] rotate-180' : 'text-gray-400'}
                `} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {category.subcategories.length} subcategories
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Subcategory *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategorySelect(subcategory.id)}
                className={`
                  p-3 rounded-lg border text-sm text-left transition-all hover:scale-105
                  ${formData.subcategory === subcategory.id
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

      {/* Specific Material Input */}
      {formData.subcategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specific Material (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Grade 5052 Aluminum, HDPE milk bottles, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
            value={formData.specificMaterial}
            onChange={(e) => updateFormData({ specificMaterial: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Add specific details about the material if applicable
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
                onClick={() => handlePackagingSelect(type.name)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${formData.quantity.packaging === type.name
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${formData.quantity.packaging === type.name
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

      {/* Sell Frequency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How often do you have this material? *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sellFrequencies.map((frequency) => (
            <button
              key={frequency.id}
              onClick={() => handleFrequencySelect(frequency.id)}
              className={`
                p-3 rounded-lg border text-sm text-center transition-all hover:scale-105
                ${formData.sellFrequency === frequency.id
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

      {/* Validation Message */}
      {(!formData.category || !formData.subcategory || !formData.quantity.packaging || !formData.sellFrequency) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please complete all required fields marked with an asterisk (*) to continue.
          </p>
        </div>
      )}
    </div>
  );
} 