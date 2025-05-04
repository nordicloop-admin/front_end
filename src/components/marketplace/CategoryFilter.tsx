"use client";

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { ChevronRight } from '@/components/ui/Icons';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const categories = [
    'All materials',
    'Plastics',
    'Paper',
    'Wood',
    'Glass',
    'Textiles',
    'Building material',
    'Metals',
    'Organic waste',
    'E-waste',
    'Machinery and equipment',
    'Chemical substances',
    'Other'
  ];

  // Split categories into two columns
  const leftCategories = categories.slice(0, Math.ceil(categories.length / 2));
  const rightCategories = categories.slice(Math.ceil(categories.length / 2));

  return (
    <FilterDropdown 
      label={selectedCategory}
      contentClassName="w-[600px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 max-h-[400px] overflow-y-auto">
        {/* Left Column */}
        <div>
          {leftCategories.map((category) => (
            <div key={category} className="category-item border-b border-gray-200 py-3 px-4">
              <button
                className="w-full text-left hover:text-blue-600 font-medium flex justify-between items-center"
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category}</span>
                {category !== 'All materials' && <ChevronRight size={16} className="text-gray-400" />}
              </button>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="border-l border-gray-200">
          {rightCategories.map((category) => (
            <div key={category} className="category-item border-b border-gray-200 py-3 px-4">
              <button
                className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category}</span>
                {category !== 'Other' && <ChevronRight size={16} className="text-gray-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </FilterDropdown>
  );
}
