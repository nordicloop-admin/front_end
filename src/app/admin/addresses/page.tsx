"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, MapPin, Building, Check, X, RefreshCw } from 'lucide-react';
import { getAdminAddresses, AdminAddress } from '@/services/addresses';
import { verifyAddress } from '@/services/adminAddresses';

// Interface for processing state
interface ProcessingAddress extends AdminAddress {
  isProcessing?: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [addresses, setAddresses] = useState<ProcessingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  // Handle verification status change
  const handleVerificationStatusChange = async (addressId: string, isVerified: boolean) => {
    try {
      // Show loading state
      setAddresses(prevAddresses => 
        prevAddresses.map(address => 
          address.id === addressId ? { ...address, isProcessing: true } : address
        )
      );
      
      // Call the API to update verification status
      const response = await verifyAddress(Number(addressId), isVerified);
      
      if (response.error) {
        // Show error message
        setError(`Failed to ${isVerified ? 'verify' : 'unverify'} address: ${response.error}`);
        
        // Revert the optimistic update
        setAddresses(prevAddresses => 
          prevAddresses.map(address => 
            address.id === addressId ? { ...address, isProcessing: false } : address
          )
        );
      } else {
        // Update was successful
        setAddresses(prevAddresses => 
          prevAddresses.map(address => 
            address.id === addressId ? { ...address, isVerified, isProcessing: false } : address
          )
        );
        
        // Show success message
        setSuccess(`Address ${isVerified ? 'verified' : 'unverified'} successfully`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (_err) {
      setError(`An error occurred while ${isVerified ? 'verifying' : 'unverifying'} the address`);
      
      // Revert the optimistic update
      setAddresses(prevAddresses => 
        prevAddresses.map(address => 
          address.id === addressId ? { ...address, isProcessing: false } : address
        )
      );
    }
  };

  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedAddresses = [...addresses].sort((a, b) => {
      if (a[key as keyof AdminAddress] < b[key as keyof AdminAddress]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key as keyof AdminAddress] > b[key as keyof AdminAddress]) {
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
    
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Calculate unverified count
  const unverifiedCount = addresses.filter(address => !address.isVerified).length;

  // Generate pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
        disabled={pagination.currentPage === 1}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          pagination.currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Previous
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            i === pagination.currentPage
              ? 'bg-orange-500 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
        disabled={pagination.currentPage === pagination.totalPages}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          pagination.currentPage === pagination.totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Next
      </button>
    );
    
    return (
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {pages}
        </nav>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">Address Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all user addresses</p>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md mb-5">
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md mb-5">
          <div className="flex items-center">
            <X className="text-red-500 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search addresses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full md:w-64"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Types</option>
                  <option value="business">Business</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedVerification}
                  onChange={handleVerificationChange}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Verification</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Unverified count */}
        {unverifiedCount > 0 && (
          <div className="px-6 py-3 bg-yellow-50">
            <div className="flex items-center">
              <X className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-sm text-yellow-700">
                <span className="font-medium">{unverifiedCount}</span> {unverifiedCount === 1 ? 'address' : 'addresses'} pending verification
              </p>
            </div>
          </div>
        )}
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('companyName')}
                >
                  <div className="flex items-center">
                    Company
                    {getSortIndicator('companyName')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('isVerified')}
                >
                  <div className="flex items-center">
                    Status
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${address.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
                            disabled={address.isProcessing}
                          >
                            {address.isProcessing ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-1" />
                            )}
                            Verify
                          </button>
                        ) : (
                          <button
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleVerificationStatusChange(address.id, false)}
                            disabled={address.isProcessing}
                          >
                            {address.isProcessing ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
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
