import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
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

export function MaterialTypeStep({ formData, updateFormData }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load categories from the data file
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories'); // We'll need to create this API endpoint
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        // Fallback to static data if API fails
        console.error('Failed to load categories:', error);
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    updateFormData({ 
      category, 
      subcategory: '', // Reset subcategory when category changes
      specificMaterial: '' 
    });
  };

  const handleSubcategorySelect = (subcategory: string) => {
    updateFormData({ subcategory, specificMaterial: '' });
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
          Select Material Type
        </h3>
        <p className="text-gray-600">
          Choose the specific category and subcategory for your {formData.materialType} material
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search categories and materials..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Main Category *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
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

      {/* Selection Summary */}
      {(formData.category || formData.subcategory) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Current Selection</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {formData.category && (
              <div>Category: <span className="font-medium">{selectedCategory?.name}</span></div>
            )}
            {formData.subcategory && (
              <div>Subcategory: <span className="font-medium">
                {availableSubcategories.find(sub => sub.id === formData.subcategory)?.name}
              </span></div>
            )}
            {formData.specificMaterial && (
              <div>Specific: <span className="font-medium">{formData.specificMaterial}</span></div>
            )}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {(!formData.category || !formData.subcategory) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-600">
            Please select both category and subcategory to continue.
          </p>
        </div>
      )}
    </div>
  );
} 