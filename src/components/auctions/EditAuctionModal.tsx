"use client";

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Upload, AlertCircle, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import { getCategories, Category, Subcategory } from '@/services/auction';

// Units for volume
const units = ['kg', 'g', 'ton', 'lb'];

// Selling types
const sellingTypes = [
  { value: 'partition', label: 'Sell as partition only' },
  { value: 'whole', label: 'Sell as whole only' },
  { value: 'both', label: 'Sell as whole and partition' }
];

// Countries
const countries = [
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Iceland',
  'Other'
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
}

interface EditAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (auctionData: AuctionData) => void;
  auction: AuctionData;
}

export default function EditAuctionModal({ isOpen, onClose, onSubmit, auction }: EditAuctionModalProps) {
  // Parse volume to get quantity and unit
  const volumeParts = auction.volume.split(' ');
  const initialQuantity = volumeParts[0] || '';
  const initialUnit = volumeParts[1] || 'kg';

  // State for form fields
  const [name, setName] = useState(auction.name);
  const [category, setCategory] = useState(auction.category);
  const [subcategory, setSubcategory] = useState(auction.subcategory);
  const [description, setDescription] = useState(auction.description || '');
  const [basePrice, setBasePrice] = useState(auction.basePrice);
  const [pricePerPartition, setPricePerPartition] = useState(auction.pricePerPartition || '');
  const [volume, setVolume] = useState(initialQuantity);
  const [unit, setUnit] = useState(initialUnit);
  const [sellingType, setSellingType] = useState<'partition' | 'whole' | 'both'>(auction.sellingType || 'both');
  const [countryOfOrigin, setCountryOfOrigin] = useState(auction.countryOfOrigin || '');
  const [endDate, setEndDate] = useState(auction.endDate || '');
  const [endTime, setEndTime] = useState(auction.endTime || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(auction.image);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for API categories
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [apiSubcategories, setApiSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getCategories();
        if (response.data) {
          setApiCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Reset form when modal opens with auction data
  useEffect(() => {
    if (isOpen) {
      setName(auction.name);
      setCategory(auction.category);
      setSubcategory(auction.subcategory);
      setDescription(auction.description || '');
      setBasePrice(auction.basePrice);
      setPricePerPartition(auction.pricePerPartition || '');

      const volumeParts = auction.volume.split(' ');
      setVolume(volumeParts[0] || '');
      setUnit(volumeParts[1] || 'kg');

      setSellingType(auction.sellingType || 'both');
      setCountryOfOrigin(auction.countryOfOrigin || '');
      setEndDate(auction.endDate || '');
      setEndTime(auction.endTime || '');

      setImagePreview(auction.image);
      setImage(null);
      setErrors({});
    }
  }, [isOpen, auction]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (category && apiCategories.length > 0) {
      const selectedCategory = apiCategories.find(cat => cat.name === category);
      if (selectedCategory) {
        setApiSubcategories(selectedCategory.subcategories);
      } else {
        setApiSubcategories([]);
      }
    }
  }, [category, apiCategories]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    // Reset subcategory when category changes
    setSubcategory('');
  };

  // Format price input with commas
  const formatPrice = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format with commas
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!basePrice) {
      newErrors.basePrice = 'Base price is required';
    }

    if (sellingType === 'partition' || sellingType === 'both') {
      if (!pricePerPartition) {
        newErrors.pricePerPartition = 'Price per partition is required when selling as partition';
      }
    }

    if (!volume) {
      newErrors.volume = 'Volume is required';
    }

    if (!countryOfOrigin) {
      newErrors.countryOfOrigin = 'Country of origin is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    onSubmit({
      ...auction,
      name,
      category,
      subcategory,
      description,
      basePrice,
      pricePerPartition,
      volume: `${volume} ${unit}`,
      unit,
      sellingType,
      countryOfOrigin,
      endDate,
      endTime,
      image: image ? URL.createObjectURL(image) : auction.image
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium">Edit Auction</h2>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  required
                />
                {errors.name && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {/* Use API categories if available, otherwise fall back to hardcoded */}
                    {apiCategories && apiCategories.length > 0 ? (
                      apiCategories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))
                    ) : (
                      ['Plastics', 'Metals', 'Paper', 'Glass', 'Wood', 'Textiles', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    )}
                  </select>
                  {errors.category && (
                    <div className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.category}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                    required
                    disabled={!category || isLoading}
                  >
                    <option value="">Select a subcategory</option>
                    {/* Use API subcategories if available, otherwise fall back to hardcoded */}
                    {apiSubcategories && apiSubcategories.length > 0 ? (
                      apiSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
                      ))
                    ) : (
                      category && ['Plastics', 'Metals', 'Paper', 'Glass', 'Wood', 'Textiles', 'Other'].includes(category) ? (
                        {
                          'Plastics': ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'],
                          'Metals': ['Aluminum', 'Steel', 'Copper', 'Brass', 'Iron', 'Zinc', 'Other'],
                          'Paper': ['Cardboard', 'Newspaper', 'Office Paper', 'Mixed Paper', 'Other'],
                          'Glass': ['Clear Glass', 'Green Glass', 'Brown Glass', 'Other'],
                          'Wood': ['Hardwood', 'Softwood', 'Plywood', 'MDF', 'Other'],
                          'Textiles': ['Cotton', 'Polyester', 'Wool', 'Nylon', 'Other'],
                          'Other': ['Miscellaneous']
                        }[category].map(subcat => (
                          <option key={subcat} value={subcat}>{subcat}</option>
                        ))
                      ) : []
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  rows={4}
                  required
                ></textarea>
                {errors.description && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (SEK)
                </label>
                <input
                  type="text"
                  id="basePrice"
                  value={basePrice}
                  onChange={(e) => setBasePrice(formatPrice(e.target.value))}
                  className={`w-full px-3 py-2 border ${errors.basePrice ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  required
                />
                {errors.basePrice && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.basePrice}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="pricePerPartition" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Partition (SEK)
                </label>
                <input
                  type="text"
                  id="pricePerPartition"
                  value={pricePerPartition}
                  onChange={(e) => setPricePerPartition(formatPrice(e.target.value))}
                  className={`w-full px-3 py-2 border ${errors.pricePerPartition ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  required={sellingType === 'partition' || sellingType === 'both'}
                  disabled={sellingType === 'whole'}
                />
                {errors.pricePerPartition && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.pricePerPartition}
                  </div>
                )}
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
                    type="text"
                    id="volume"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-3 py-2 border ${errors.volume ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                    required
                  />
                  {errors.volume && (
                    <div className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.volume}
                    </div>
                  )}
                </div>
                <div className="w-1/3">
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                    required
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
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
                  value={sellingType}
                  onChange={(e) => setSellingType(e.target.value as 'partition' | 'whole' | 'both')}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                  required
                >
                  {sellingTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country and End Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700 mb-1">
                  Country of Origin
                </label>
                <select
                  id="countryOfOrigin"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.countryOfOrigin ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.countryOfOrigin && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.countryOfOrigin}
                  </div>
                )}
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
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border ${errors.endDate ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                      required
                    />
                  </div>
                  {errors.endDate && (
                    <div className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.endDate}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border ${errors.endTime ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                      required
                    />
                  </div>
                  {errors.endTime && (
                    <div className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.endTime}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Image
              </label>

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-gray-100 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-40 mb-3">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-300" />
                  )}

                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#FF8A00] hover:text-[#e67e00] focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

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
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
            >
              Save Changes
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
