"use client";

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { getNotificationCategories, notificationPriorities } from '@/utils/notificationUtils';
import { cn } from '@/lib/utils';

interface NotificationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedType?: string;
  onTypeChange: (type: string | undefined) => void;
  selectedPriority?: string;
  onPriorityChange: (priority: string | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function NotificationFilters({
  activeTab,
  onTabChange,
  selectedType,
  onTypeChange,
  selectedPriority,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters
}: NotificationFiltersProps) {
  const categories = getNotificationCategories();
  const priorities = Object.entries(notificationPriorities);
  
  const tabs = [
    { id: 'all', label: 'All', count: null },
    { id: 'unread', label: 'Unread', count: null },
    { id: 'read', label: 'Read', count: null }
  ];
  
  return (
    <div className="space-y-4">
      {/* Main Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-[#FF8A00] border-b-2 border-[#FF8A00]"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={onToggleFilters}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 text-sm border rounded-lg transition-colors",
              showFilters
                ? "bg-[#FF8A00] text-white border-[#FF8A00]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type
              </label>
              <select
                value={selectedType || ''}
                onChange={(e) => onTypeChange(e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              >
                <option value="">All Types</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={selectedPriority || ''}
                onChange={(e) => onPriorityChange(e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              >
                <option value="">All Priorities</option>
                {priorities.map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedType || selectedPriority || searchQuery) && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {selectedType && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full text-xs border">
                  <span>Type: {categories.find(c => c.value === selectedType)?.label}</span>
                  <button
                    onClick={() => onTypeChange(undefined)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {selectedPriority && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full text-xs border">
                  <span>Priority: {priorities.find(([key]) => key === selectedPriority)?.[1].label}</span>
                  <button
                    onClick={() => onPriorityChange(undefined)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full text-xs border">
                  <span>Search: &quot;{searchQuery}&quot;</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  onTypeChange(undefined);
                  onPriorityChange(undefined);
                  onSearchChange('');
                }}
                className="text-xs text-[#FF8A00] hover:text-[#e67e00] font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
