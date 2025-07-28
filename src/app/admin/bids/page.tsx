"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, Clock, RefreshCw } from 'lucide-react';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { getAdminBids, AdminBid } from '@/services/bids';

export default function BidsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [bids, setBids] = useState<AdminBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  });
  
  // URL state management for filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when filters change
  const updateURL = useCallback((search: string, status: string, page: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (page > 1) params.set('page', page.toString());
    
    const newURL = `/admin/bids${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL);
  }, [router]);

  // Fetch bids from API
  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: debouncedSearchTerm || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        page: currentPage,
        page_size: pagination.pageSize
      };

      const response = await getAdminBids(params);

      if (response.data) {
        setBids(response.data.results);
        setPagination({
          count: response.data.count,
          totalPages: response.data.total_pages,
          currentPage: response.data.current_page,
          pageSize: response.data.page_size
        });
      } else {
        setError(response.error || 'Failed to fetch bids');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching bids');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedStatus, currentPage, pagination.pageSize]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  // Update URL when filters change
  useEffect(() => {
    updateURL(debouncedSearchTerm, selectedStatus, currentPage);
  }, [debouncedSearchTerm, selectedStatus, currentPage, updateURL]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedBids = [...bids].sort((a, b) => {
      const aValue = a[key as keyof AdminBid];
      const bValue = b[key as keyof AdminBid];
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return direction === 'ascending' ? 1 : -1;
      if (bValue === undefined) return direction === 'ascending' ? -1 : 1;
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setBids(sortedBids);
  };

  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Format bid amount
  const formatBidAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Count bids that need review (pending status)
  const pendingReviewCount = bids.filter(bid => bid.status === 'pending').length;

  // Generate pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < pagination.totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Next
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * pagination.pageSize) + 1} to {Math.min(currentPage * pagination.pageSize, pagination.count)} of {pagination.count} results
        </div>
        <div className="flex">{pages}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Bids Management</h1>
        {pendingReviewCount > 0 && (
          <span className="ml-3 bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingReviewCount}
          </span>
        )}
        <button
          onClick={fetchBids}
          disabled={loading}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bids by item name, bidder name..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'outbid', label: 'Outbid' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'won', label: 'Won' }
              ]}
              value={selectedStatus}
              onChange={(value) => handleStatusChange({ target: { value } } as any)}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}
      
      {/* Bids Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('itemName')}>
                    Item
                    {getSortIndicator('itemName')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('bidAmount')}>
                    Bid Amount
                    {getSortIndicator('bidAmount')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('volume')}>
                    Volume
                    {getSortIndicator('volume')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('bidderName')}>
                    Bidder
                    {getSortIndicator('bidderName')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('status')}>
                    Status
                    {getSortIndicator('status')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('bidDate')}>
                    Bid Date
                    {getSortIndicator('bidDate')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                      <span className="text-gray-500">Loading bids...</span>
                    </div>
                  </td>
                </tr>
              ) : bids.length > 0 ? (
                bids.map((bid) => (
                  <tr key={bid.id} className={bid.status === 'pending' ? "bg-yellow-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bid.itemName}</div>
                      {/* <Link href={`/admin/marketplace/${bid.itemId}`} className="text-xs text-blue-600 hover:text-blue-900">
                        View Item
                      </Link> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatBidAmount(bid.bidAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatBidAmount(bid.volume)} {bid.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bid.bidderName}</div>
                      <div className="text-xs text-gray-500">{bid.bidderEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${bid.status === 'active' ? 'bg-green-100 text-green-800' : 
                          bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          bid.status === 'outbid' ? 'bg-gray-100 text-gray-800' :
                          bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          bid.status === 'won' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatDate(bid.bidDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/admin/bids/${bid.id}`} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {searchTerm || selectedStatus !== 'all' 
                        ? 'No bids found matching your criteria' 
                        : 'No bids available'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}
