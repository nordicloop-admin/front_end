"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, MapPin, Building, Check, X, RefreshCw } from 'lucide-react';
import { getAdminAddresses, AdminAddress } from '@/services/addresses';

export default function AddressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [addresses, setAddresses] = useState<AdminAddress[]>([]);
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
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedVerification, setSelectedVerification] = useState(searchParams.get('is_verified') || 'all');
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
  const updateURL = useCallback((search: string, type: string, verification: string, page: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type && type !== 'all') params.set('type', type);
    if (verification && verification !== 'all') params.set('is_verified', verification);
    if (page > 1) params.set('page', page.toString());
    
    const newURL = `/admin/addresses${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL);
  }, [router]);

  // Fetch addresses from API
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: debouncedSearchTerm || undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        is_verified: selectedVerification !== 'all' ? selectedVerification === 'verified' : undefined,
        page: currentPage,
        page_size: pagination.pageSize
      };

      const response = await getAdminAddresses(params);

      if (response.data) {
        setAddresses(response.data.results);
        setPagination({
          count: response.data.count,
          totalPages: response.data.total_pages,
          currentPage: response.data.current_page,
          pageSize: response.data.page_size
        });
      } else {
        setError(response.error || 'Failed to fetch addresses');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching addresses');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedType, selectedVerification, currentPage, pagination.pageSize]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Update URL when filters change
  useEffect(() => {
    updateURL(debouncedSearchTerm, selectedType, selectedVerification, currentPage);
  }, [debouncedSearchTerm, selectedType, selectedVerification, currentPage, updateURL]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle type filter change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle verification filter change
  const handleVerificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVerification(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle verification status change (placeholder for now)
  const handleVerificationStatusChange = (addressId: string, isVerified: boolean) => {
    // TODO: Implement API call to update verification status
    // For now, update local state
    const updatedAddresses = addresses.map(address =>
      address.id === addressId ? { ...address, isVerified } : address
    );
    setAddresses(updatedAddresses);
  };

  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    const sortedAddresses = [...addresses].sort((a, b) => {
      const aValue = a[key as keyof AdminAddress];
      const bValue = b[key as keyof AdminAddress];

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setAddresses(sortedAddresses);
  };

  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Count addresses that need verification
  const unverifiedCount = addresses.filter(address => !address.isVerified).length;

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
        <h1 className="text-xl font-medium">Address Management</h1>
        {unverifiedCount > 0 && (
          <span className="ml-3 bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unverifiedCount}
          </span>
        )}
        <button
          onClick={fetchAddresses}
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
              placeholder="Search addresses by company, city, country, contact..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="shipping">Shipping</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedVerification}
              onChange={handleVerificationChange}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Addresses Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('companyName')}>
                    Company
                    {getSortIndicator('companyName')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('type')}>
                    Type
                    {getSortIndicator('type')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('isVerified')}>
                    Verification
                    {getSortIndicator('isVerified')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                      <span className="text-gray-500">Loading addresses...</span>
                    </div>
                  </td>
                </tr>
              ) : addresses.length > 0 ? (
                addresses.map((address) => (
                  <tr key={address.id} className={!address.isVerified ? "bg-yellow-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{address.companyName}</div>
                      <Link href={`/admin/companies/${address.companyId}`} className="text-xs text-blue-600 hover:text-blue-900">
                        View Company
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {address.type === 'business' ? (
                          <Building className="h-4 w-4 mr-1 text-gray-400" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-900 capitalize">
                          {address.type}
                        </span>
                      </div>
                      {address.isPrimary && (
                        <span className="mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Primary
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {address.addressLine1}
                        {address.addressLine2 && <span>, {address.addressLine2}</span>}
                      </div>
                      <div className="text-sm text-gray-500">
                        {address.city}, {address.postalCode}
                      </div>
                      <div className="text-sm text-gray-500">
                        {address.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${address.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {address.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{address.contactName}</div>
                      <div className="text-sm text-gray-500">{address.contactPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/addresses/${address.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        {!address.isVerified ? (
                          <button
                            className="text-green-600 hover:text-green-900 flex items-center"
                            onClick={() => handleVerificationStatusChange(address.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </button>
                        ) : (
                          <button
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleVerificationStatusChange(address.id, false)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Unverify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {searchTerm || selectedType !== 'all' || selectedVerification !== 'all'
                        ? 'No addresses found matching your criteria'
                        : 'No addresses available'}
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
