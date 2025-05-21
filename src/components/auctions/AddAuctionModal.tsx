"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Calendar, Clock, AlertCircle } from 'lucide-react';
import { getCategories, Category, Subcategory } from '@/services/auction';

interface AddAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (auctionData: AuctionFormData) => void;
}

export interface AuctionFormData {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  basePrice: string;
  pricePerPartition: string;
  volume: string;
  unit: string;
  sellingType: 'partition' | 'whole' | 'both';
  countryOfOrigin: string;
  endDate: string;
  endTime: string;
  image: File | null;
}

// Categories with subcategories
const categoryOptions = {
  'Plastics': [
    'PET (Polyethylene Terephthalate)',
    'HDPE (High-Density Polyethylene)',
    'PVC (Polyvinyl Chloride)',
    'LDPE (Low-Density Polyethylene)',
    'PP (Polypropylene)',
    'PS (Polystyrene)',
    'Other Plastics'
  ],
  'Metals': [
    'Aluminum',
    'Steel',
    'Copper',
    'Brass',
    'Iron',
    'Stainless Steel',
    'Other Metals'
  ],
  'Paper': [
    'Cardboard',
    'Office Paper',
    'Newspaper',
    'Magazines',
    'Mixed Paper',
    'Other Paper'
  ],
  'Glass': [
    'Clear Glass',
    'Green Glass',
    'Brown Glass',
    'Mixed Glass',
    'Other Glass'
  ],
  'Wood': [
    'Hardwood',
    'Softwood',
    'Plywood',
    'MDF',
    'Particleboard',
    'Other Wood'
  ],
  'Textiles': [
    'Cotton',
    'Polyester',
    'Wool',
    'Nylon',
    'Mixed Textiles',
    'Other Textiles'
  ],
  'Electronics': [
    'Computers',
    'Smartphones',
    'Batteries',
    'Circuit Boards',
    'Cables',
    'Other Electronics'
  ],
  'Other': [
    'Rubber',
    'Ceramics',
    'Composites',
    'Mixed Materials',
    'Other Materials'
  ]
};

// Get just the main categories for the dropdown
const categories = Object.keys(categoryOptions);

// Unit choices from backend
const units = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'lb', label: 'Pound' },
  { value: 'ton', label: 'Ton' }
];

// Selling type choices from backend
const sellingTypes = [
  { value: 'partition', label: 'Selling in Partition' },
  { value: 'whole', label: 'Selling as Whole' },
  { value: 'both', label: 'Selling as Whole and Partition' }
];

const countries = [
  'Sweden',
  // 'Norway',
  // 'Denmark',
  // 'Finland',
  // 'Iceland',
  // 'Other'
];

export default function AddAuctionModal({ isOpen, onClose, onSubmit }: AddAuctionModalProps) {
  const [formData, setFormData] = useState<AuctionFormData>({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    basePrice: '',
    pricePerPartition: '',
    volume: '',
    unit: 'kg',
    sellingType: 'both', // Default to "selling as whole and partition"
    countryOfOrigin: '',
    endDate: '',
    endTime: '',
    image: null
  });

  // State for API categories
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [apiSubcategories, setApiSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get subcategories based on selected category (fallback to hardcoded if API fails)
  const subcategories = formData.category && categoryOptions[formData.category as keyof typeof categoryOptions]
    ? categoryOptions[formData.category as keyof typeof categoryOptions]
    : [];

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch categories from API when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await getCategories();

          if (response.error) {
            // Error handling for category fetch failures
            setError(response.error);
          } else if (response.data) {
            // Successfully fetched categories
            setApiCategories(response.data);
          } else {
            // No categories data available
            setError('No categories found');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategories();
    }
  }, [isOpen]);

  // Update subcategories when category changes
  useEffect(() => {
    // Category selection or API categories have been updated

    if (formData.category && apiCategories && apiCategories.length > 0) {
      const selectedCategory = apiCategories.find(cat => cat.name === formData.category);
      // Found matching category from API

      if (selectedCategory && selectedCategory.subcategories) {
        // Setting subcategories from selected category
        setApiSubcategories(selectedCategory.subcategories);
      } else {
        // If category not found in API data, reset subcategories
        // Category not found or has no subcategories, resetting
        setApiSubcategories([]);
      }
    } else {
      // No category selected or API data unavailable, resetting subcategories
      setApiSubcategories([]);
    }
  }, [formData.category, apiCategories]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium">Add New Auction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  {isLoading ? (
                    <div className="w-full px-3 py-2 border border-gray-100 rounded-md bg-gray-50 text-gray-500 text-sm flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-[#FF8A00] border-t-transparent rounded-full mr-2"></div>
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) => {
                        // Reset subcategory when category changes
                        const newCategory = e.target.value;


                        setFormData({
                          ...formData,
                          category: newCategory,
                          subcategory: ''
                        });

                        // Category changed, subcategories will be updated in the useEffect
                      }}
                      className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                      required
                    >
                      <option value="">Select a category</option>
                      {/* Use API categories if available, otherwise fall back to hardcoded */}
                      {apiCategories && apiCategories.length > 0 ? (
                        apiCategories.map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))
                      ) : (
                        categories && categories.length > 0 ? (
                          categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))
                        ) : null
                      )}
                    </select>
                  )}
                  {error && (
                    <div className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {error}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                    required
                    disabled={!formData.category || isLoading}
                  >
                    <option value="">Select a subcategory</option>
                    {/* Use API subcategories if available, otherwise fall back to hardcoded */}
                    {apiSubcategories && apiSubcategories.length > 0 ? (
                      apiSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
                      ))
                    ) : (
                      subcategories && subcategories.length > 0 ? (
                        subcategories.map(subcategory => (
                          <option key={subcategory} value={subcategory}>{subcategory}</option>
                        ))
                      ) : null
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>
            </div>

            {/* Pricing and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (SEK)
                </label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="pricePerPartition" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Partition (SEK)
                </label>
                <input
                  type="number"
                  id="pricePerPartition"
                  name="pricePerPartition"
                  value={formData.pricePerPartition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>
            </div>

            {/* Volume and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                    Volume
                  </label>
                  <input
                    type="number"
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                    required
                  />
                </div>

                <div className="w-24">
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="sellingType" className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Type
                </label>
                <select
                  id="sellingType"
                  name="sellingType"
                  value={formData.sellingType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                >
                  {sellingTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Origin and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700 mb-1">
                  Country of Origin
                </label>
                <select
                  id="countryOfOrigin"
                  name="countryOfOrigin"
                  value={formData.countryOfOrigin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="w-24">
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Image
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative h-40 w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop an image, or click to browse</p>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image')?.click()}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
