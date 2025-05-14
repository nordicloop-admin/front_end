"use client";

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Upload, AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Categories for the dropdown
const categories = [
  'Plastics',
  'Metals',
  'Paper',
  'Glass',
  'Wood',
  'Textiles',
  'Other'
];

// Subcategories mapping
const subcategories: Record<string, string[]> = {
  'Plastics': ['PET (Polyethylene Terephthalate)', 'HDPE (High-Density Polyethylene)', 'PVC (Polyvinyl Chloride)', 'LDPE (Low-Density Polyethylene)', 'PP (Polypropylene)', 'PS (Polystyrene)', 'Other'],
  'Metals': ['Aluminum', 'Steel', 'Copper', 'Brass', 'Iron', 'Zinc', 'Other'],
  'Paper': ['Cardboard', 'Newspaper', 'Office Paper', 'Mixed Paper', 'Other'],
  'Glass': ['Clear Glass', 'Green Glass', 'Brown Glass', 'Other'],
  'Wood': ['Hardwood', 'Softwood', 'Plywood', 'MDF', 'Other'],
  'Textiles': ['Cotton', 'Polyester', 'Wool', 'Nylon', 'Other'],
  'Other': ['Miscellaneous']
};

// Units for volume
const units = ['kg', 'ton', 'lbs', 'm³', 'pieces'];

export interface AuctionData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  basePrice: string;
  currentBid: string;
  status: string;
  timeLeft: string;
  volume: string;
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

  const [name, setName] = useState(auction.name);
  const [category, setCategory] = useState(auction.category);
  const [subcategory, setSubcategory] = useState(auction.subcategory);
  const [basePrice, setBasePrice] = useState(auction.basePrice);
  const [volume, setVolume] = useState(initialQuantity);
  const [unit, setUnit] = useState(initialUnit);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(auction.image);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens with auction data
  useEffect(() => {
    if (isOpen) {
      setName(auction.name);
      setCategory(auction.category);
      setSubcategory(auction.subcategory);
      setBasePrice(auction.basePrice);
      
      const volumeParts = auction.volume.split(' ');
      setVolume(volumeParts[0] || '');
      setUnit(volumeParts[1] || 'kg');
      
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
    
    if (!basePrice) {
      newErrors.basePrice = 'Base price is required';
    }
    
    if (!volume) {
      newErrors.volume = 'Volume is required';
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
      basePrice,
      volume: `${volume} ${unit}`,
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
            {/* Material Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Material Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
              />
              {errors.name && (
                <div className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.name}
                </div>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <div className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.category}
                </div>
              )}
            </div>
            
            {/* Subcategory */}
            {category && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                >
                  <option value="">Select a subcategory</option>
                  {subcategories[category]?.map((subcat) => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Base Price */}
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
              />
              {errors.basePrice && (
                <div className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.basePrice}
                </div>
              )}
            </div>
            
            {/* Volume */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                  Volume
                </label>
                <input
                  type="text"
                  id="volume"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-3 py-2 border ${errors.volume ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                />
                {errors.volume && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.volume}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
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
