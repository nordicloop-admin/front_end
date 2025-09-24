"use client";

import React, { useState, useEffect } from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { ChevronRight } from '@/components/ui/Icons';
import { getCategories, Category } from '@/services/auction';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onCategoryChange: (categoryId: number | null, subcategoryIds: number[]) => void;
  onGlobalSubcategoryChange: (categoryId: number, subcategoryIds: number[], subcategoryData?: { id: number; name: string; categoryName: string }[]) => void;
  globalSubcategorySelections: { [categoryId: number]: number[] };
  resetTrigger?: number;
}

export function CategoryFilter({ selectedCategory, setSelectedCategory, onCategoryChange, onGlobalSubcategoryChange, globalSubcategorySelections, resetTrigger }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryObj, setSelectedCategoryObj] = useState<Category | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        if (response.data) {
          // Add "All materials" option at the beginning
          const allMaterialsCategory: Category = {
            id: 0,
            name: "All materials",
            subcategories: []
          };
          setCategories([allMaterialsCategory, ...response.data]);
        }
      } catch (_error) {
        // Handle error silently or show user-friendly message
        setCategories([{ id: 0, name: "All materials", subcategories: [] }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Reset component state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setSelectedSubcategories([]);
      setShowSubcategories(false);
      setSelectedCategoryObj(null);
    }
  }, [resetTrigger]);
  
  // Update local selections when showing subcategories for a specific category
  useEffect(() => {
    if (selectedCategoryObj && selectedCategoryObj.id > 0) {
      const existingSelections = globalSubcategorySelections[selectedCategoryObj.id] || [];
      setSelectedSubcategories(existingSelections);
    }
  }, [selectedCategoryObj, globalSubcategorySelections]);

  useEffect(() => {
    // Find the selected category object
    const categoryObj = categories.find(cat => cat.name === selectedCategory);
    setSelectedCategoryObj(categoryObj || null);
  }, [selectedCategory, categories]);

  // Split categories into two columns
  const leftCategories = categories.slice(0, Math.ceil(categories.length / 2));
  const rightCategories = categories.slice(Math.ceil(categories.length / 2));

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories.length > 0) {
      setSelectedCategoryObj(category);
      setShowSubcategories(true);
      // Load existing selections for this category instead of resetting
      const existingSelections = globalSubcategorySelections[category.id] || [];
      setSelectedSubcategories(existingSelections);
    } else {
      setSelectedCategory(category.name);
      setShowSubcategories(false);
      // CRITICAL FIX: Call onCategoryChange to update parent component's categoryId
      // For categories without subcategories, we need to inform the parent
      if (category.name === 'All materials') {
        onCategoryChange(null, []); // Clear category filter
      } else {
        onCategoryChange(category.id, []); // Set specific category
      }
    }
  };

  const handleBackClick = () => {
    setShowSubcategories(false);
  };

  const handleSubcategoryToggle = (subcategoryId: number) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
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
        setSelectedSubcategories(selectedCategoryObj.subcategories.map(sub => sub.id));
      }
    }
  };

  const handleApply = () => {
    if (selectedCategoryObj) {
      // Update global selections for this category
      const subcategoryData = selectedSubcategories.map(id => {
        const subcat = selectedCategoryObj.subcategories.find(s => s.id === id);
        return {
          id,
          name: subcat?.name || '',
          categoryName: selectedCategoryObj.name
        };
      }).filter(item => item.name);
      
      // Call both handlers for complete state management
      onGlobalSubcategoryChange(selectedCategoryObj.id, selectedSubcategories, subcategoryData);
      
      // CRITICAL FIX: Also call onCategoryChange to ensure categoryId is set
      onCategoryChange(selectedCategoryObj.id, selectedSubcategories);
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
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">Loading categories...</div>
        </div>
      ) : !showSubcategories ? (
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
                    id={`sub-${subcategory.id}`}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onChange={() => handleSubcategoryToggle(subcategory.id)}
                  />
                  <label htmlFor={`sub-${subcategory.id}`} className="ml-2 text-sm text-gray-700">
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
                    id={`sub-${subcategory.id}`}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onChange={() => handleSubcategoryToggle(subcategory.id)}
                  />
                  <label htmlFor={`sub-${subcategory.id}`} className="ml-2 text-sm text-gray-700">
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
                    id={`sub-${subcategory.id}`}
                    className="h-4 w-4 border-gray-300 rounded"
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onChange={() => handleSubcategoryToggle(subcategory.id)}
                  />
                  <label htmlFor={`sub-${subcategory.id}`} className="ml-2 text-sm text-gray-700">
                    {subcategory.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-category selection info */}
          {(() => {
            const totalSelections = Object.values(globalSubcategorySelections).flat().length;
            const currentCategorySelections = selectedSubcategories.length;
            const otherCategorySelections = totalSelections - currentCategorySelections;
            
            if (totalSelections > 0) {
              return (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
                  <div className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mt-0.5 flex-shrink-0">
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">
                        {currentCategorySelections > 0 && `${currentCategorySelections} selected in ${selectedCategoryObj?.name}`}
                        {currentCategorySelections > 0 && otherCategorySelections > 0 && ' • '}
                        {otherCategorySelections > 0 && `${otherCategorySelections} selected in other categories`}
                      </p>
                      <p className="text-blue-700 mt-1">Total: {totalSelections} subcategories across all categories</p>
                      <p className="text-blue-600 text-xs mt-1">✓ Cross-category filtering active! Add more or switch categories to modify selections.</p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

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
