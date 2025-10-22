import React, { useState, useEffect } from 'react';
import { Package, Recycle, ChevronDown, Box, AlertCircle } from 'lucide-react';
import { FormData } from '../AlternativeAuctionForm';
import { getCategories, Category } from '@/services/auction';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load categories from the correct API endpoint
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

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    updateFormData({ 
      category: categoryName, // Store the name for backend compatibility
      materialType: categoryName, // Set materialType to match category name
      subcategory: '', // Reset subcategory when category changes
      specificMaterial: '' 
    });
  };

  const handleSubcategorySelect = (subcategoryName: string) => {
    updateFormData({ subcategory: subcategoryName, specificMaterial: '' });
  };

  // Find selected category by name (since formData.category stores the name)
  const selectedCategory = categories.find(cat => cat.name === formData.category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-gray-600 mb-2">Failed to load categories</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
        >
          Refresh Page
        </button>
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
          {categories.filter(cat => cat.name !== 'All materials').map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id, category.name)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all hover:scale-105
                ${formData.category === category.name
                  ? 'border-[#FF8A00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <ChevronDown className={`
                  w-4 h-4 transition-transform
                  ${formData.category === category.name ? 'text-[#FF8A00] rotate-180' : 'text-gray-400'}
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
      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Subcategory *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategorySelect(subcategory.name)}
                className={`
                  p-3 rounded-lg border text-sm text-left transition-all hover:scale-105
                  ${formData.subcategory === subcategory.name
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
                  p-4 rounded-lg border transition-all text-left hover:scale-105
                  ${formData.quantity.packaging === type.name
                    ? 'border-[#FF8A00] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    ${formData.quantity.packaging === type.name
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


    </div>
  );
} 