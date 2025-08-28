'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  current_page?: number;
  total_pages?: number;
  page_size?: number;
}

interface PaginationProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ 
  paginationInfo, 
  onPageChange, 
  className = '' 
}: PaginationProps) {
  // Calculate pagination details
  const pageSize = paginationInfo.page_size || 20;
  const totalPages = Math.ceil(paginationInfo.count / pageSize);
  
  // Extract current page from next/previous URLs or use provided current_page
  const getCurrentPage = () => {
    if (paginationInfo.current_page) {
      return paginationInfo.current_page;
    }
    
    if (paginationInfo.next) {
      const nextUrl = new URL(paginationInfo.next, window.location.origin);
      const nextPage = parseInt(nextUrl.searchParams.get('page') || '2');
      return nextPage - 1;
    }
    
    if (paginationInfo.previous) {
      const prevUrl = new URL(paginationInfo.previous, window.location.origin);
      const prevPage = parseInt(prevUrl.searchParams.get('page') || '1');
      return prevPage + 1;
    }
    
    return 1;
  };

  const currentPage = getCurrentPage();
  
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Add ellipsis if needed
    if (currentPage - delta > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if different from first)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * pageSize + 1, paginationInfo.count)} to{' '}
        {Math.min(currentPage * pageSize, paginationInfo.count)} of{' '}
        {paginationInfo.count} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!paginationInfo.previous}
          className={`p-2 rounded-lg border transition-colors ${
            paginationInfo.previous
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    page === currentPage
                      ? 'border-[#FF8A00] bg-[#FF8A00] text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!paginationInfo.next}
          className={`p-2 rounded-lg border transition-colors ${
            paginationInfo.next
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export type { PaginationInfo };

