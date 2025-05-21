"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Calendar, Clock } from 'lucide-react';

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
  sellingType: 'auction' | 'fixed' | 'both';
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

const units = [
  'kg',
  'ton',
  'liter',
  'm²',
  'm³',
  'piece'
];

const countries = [
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Iceland',
  'Other'
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
    sellingType: 'both',
    countryOfOrigin: '',
    endDate: '',
    endTime: '',
    image: null
  });

  // Get subcategories based on selected category
  const subcategories = formData.category ? categoryOptions[formData.category as keyof typeof categoryOptions] : [];

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      // Reset subcategory when category changes
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subcategory: ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
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
                    disabled={!formData.category}
                  >
                    <option value="">Select a subcategory</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
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
                  type="text"
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
                  type="text"
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
                    type="text"
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
                      <option key={unit} value={unit}>{unit}</option>
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
                  <option value="auction">Auction Only</option>
                  <option value="fixed">Fixed Price Only</option>
                  <option value="both">Both (Auction & Fixed Price)</option>
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
