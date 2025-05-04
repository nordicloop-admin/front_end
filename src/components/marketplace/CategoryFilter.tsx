"use client";

import React, { useState, useEffect } from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { ChevronRight } from '@/components/ui/Icons';
import categoriesData from '@/data/categories.json';

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryObj, setSelectedCategoryObj] = useState<Category | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(categoriesData.categories);

    // Find the selected category object
    const categoryObj = categoriesData.categories.find(cat => cat.name === selectedCategory);
    setSelectedCategoryObj(categoryObj || null);
  }, [selectedCategory]);

  // Split categories into two columns
  const leftCategories = categories.slice(0, Math.ceil(categories.length / 2));
  const rightCategories = categories.slice(Math.ceil(categories.length / 2));

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories.length > 0) {
      setSelectedCategoryObj(category);
      setShowSubcategories(true);
      // Reset selected subcategories when changing categories
      setSelectedSubcategories([]);
    } else {
      setSelectedCategory(category.name);
      setShowSubcategories(false);
    }
  };

  const handleBackClick = () => {
    setShowSubcategories(false);
  };

  const handleSubcategoryToggle = (subcategoryName: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryName)) {
        return prev.filter(name => name !== subcategoryName);
      } else {
        return [...prev, subcategoryName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCategoryObj && selectedCategoryObj.subcategories.length > 0) {
      if (selectedSubcategories.length === selectedCategoryObj.subcategories.length) {
        // If all are selected, deselect all
        setSelectedSubcategories([]);
      } else {
        // Otherwise, select all
        setSelectedSubcategories(selectedCategoryObj.subcategories.map(sub => sub.name));
      }
    }
  };

  const handleApply = () => {
    if (selectedSubcategories.length > 0) {
      // If subcategories are selected, use them
      setSelectedCategory(`${selectedCategoryObj?.name} (${selectedSubcategories.length})`);
    } else if (selectedCategoryObj) {
      // If no subcategories selected, use the main category
      setSelectedCategory(selectedCategoryObj.name);
    }
    setShowSubcategories(false);
  };

  // Split subcategories into three columns
  const getSubcategoryColumns = () => {
    if (!selectedCategoryObj) return [[], [], []];

    const subcategories = selectedCategoryObj.subcategories;
    const itemsPerColumn = Math.ceil(subcategories.length / 3);

    return [
      subcategories.slice(0, itemsPerColumn),
      subcategories.slice(itemsPerColumn, itemsPerColumn * 2),
      subcategories.slice(itemsPerColumn * 2)
    ];
  };

  const [leftSubcategories, middleSubcategories, rightSubcategories] = getSubcategoryColumns();

  return (
    <FilterDropdown
      label={selectedCategory}
      contentClassName="w-[750px]"
    >
      {!showSubcategories ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 max-h-[400px] overflow-y-auto">
          {/* Left Column */}
          <div>
            {leftCategories.map((category) => (
              <div key={category.id} className="category-item border-b border-gray-200 py-3 px-4">
                <button
                  className="w-full text-left hover:text-[#FF8A00] font-medium flex justify-between items-center"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{category.name}</span>
                  {category.subcategories.length > 0 && <ChevronRight size={16} className="text-gray-400" />}
                </button>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="border-l border-gray-200">
            {rightCategories.map((category) => (
              <div key={category.id} className="category-item border-b border-gray-200 py-3 px-4">
                <button
                  className="w-full text-left hover:text-[#FF8A00] flex justify-between items-center"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{category.name}</span>
                  {category.subcategories.length > 0 && <ChevronRight size={16} className="text-gray-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto">
          {/* Header with back button and category name */}
          <div className="flex items-center justify-between py-3 px-6 border-b border-gray-200">
            <button
              className="text-gray-700 flex items-center font-medium"
              onClick={handleBackClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              {selectedCategoryObj?.name}
            </button>
            <button
              className="text-[#FF8A00] text-sm font-medium"
              onClick={handleSelectAll}
            >
              Select all
            </button>
          </div>

          {/* Subcategories with checkboxes in 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 p-6">
            {/* Left Column */}
            <div>
              {leftSubcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={subcategory.id}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedSubcategories.includes(subcategory.name)}
                    onChange={() => handleSubcategoryToggle(subcategory.name)}
                  />
                  <label htmlFor={subcategory.id} className="ml-2 text-sm text-gray-700">
                    {subcategory.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Middle Column */}
            <div>
              {middleSubcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={subcategory.id}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedSubcategories.includes(subcategory.name)}
                    onChange={() => handleSubcategoryToggle(subcategory.name)}
                  />
                  <label htmlFor={subcategory.id} className="ml-2 text-sm text-gray-700">
                    {subcategory.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div>
              {rightSubcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={subcategory.id}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedSubcategories.includes(subcategory.name)}
                    onChange={() => handleSubcategoryToggle(subcategory.name)}
                  />
                  <label htmlFor={subcategory.id} className="ml-2 text-sm text-gray-700">
                    {subcategory.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              className="bg-[#FF8A00] text-white px-6 py-2 rounded hover:bg-[#e67e00] font-medium transition-colors"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </FilterDropdown>
  );
}
