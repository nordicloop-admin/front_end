"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of visible range
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis if there's a gap after first page
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before last page
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                disabled={typeof page !== 'number'}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-[#FF8A00] border-[#FF8A00] text-white'
                    : typeof page === 'number'
                    ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    : 'bg-white border-gray-300 text-gray-300 cursor-default'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}