"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAdminCompanies, updateCompanyStatus, getCompanyFilterOptions, type AdminCompany, type AdminCompanyParams, type FilterOption } from '@/services/company';

export default function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get('status');
  const sectorFilter = searchParams.get('sector');
  const countryFilter = searchParams.get('country');
  const pageParam = searchParams.get('page');

  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || 'all');
  const [selectedSector, setSelectedSector] = useState(sectorFilter || 'all');
  const [selectedCountry, setSelectedCountry] = useState(countryFilter || 'all');
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [updatingCompanyId, setUpdatingCompanyId] = useState<string | null>(null);

  // Filter options
  const [sectors, setSectors] = useState<FilterOption[]>([]);
  const [countries, setCountries] = useState<FilterOption[]>([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    total_pages: 1,
    page_size: 10
  });

  // Debounced search to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      setFilterOptionsLoading(true);
      try {
        const response = await getCompanyFilterOptions();
        if (response.data) {
          setSectors(response.data.sectors);
          setCountries(response.data.countries);
        }
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setFilterOptionsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Load companies data
  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      setError(null);

      const params: AdminCompanyParams = {
        page: currentPage,
        page_size: 10
      };

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      if (selectedStatus !== 'all') {
        params.status = selectedStatus as 'pending' | 'approved' | 'rejected';
      }

      if (selectedSector !== 'all') {
        params.sector = selectedSector;
      }

      if (selectedCountry !== 'all') {
        params.country = selectedCountry;
      }

      try {
        const response = await getAdminCompanies(params);

        if (response.error) {
          setError(response.error);
          setCompanies([]);
        } else if (response.data) {
          setCompanies(response.data.results);
          setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            total_pages: response.data.total_pages,
            page_size: response.data.page_size
          });
        }
      } catch (_err) {
        setError('Failed to load companies');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [debouncedSearchTerm, selectedStatus, selectedSector, selectedCountry, currentPage]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedStatus !== 'all') {
      params.set('status', selectedStatus);
    }

    if (selectedSector !== 'all') {
      params.set('sector', selectedSector);
    }

    if (selectedCountry !== 'all') {
      params.set('country', selectedCountry);
    }

    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    const newUrl = `/admin/companies${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [selectedStatus, selectedSector, selectedCountry, currentPage, router]);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleSectorChange = (newSector: string) => {
    setSelectedSector(newSector);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusUpdate = async (companyId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingCompanyId(companyId);
    setError(null);

    try {
      const response = await updateCompanyStatus(companyId, newStatus);

      if (response.error) {
        setError(response.error);
      } else {
        // Update the local state immediately for better UX
        setCompanies(prevCompanies => 
          prevCompanies.map(company => 
            company.id === companyId 
              ? { ...company, status: newStatus }
              : company
          )
        );

        // Optionally refresh the data to ensure consistency
        const params: AdminCompanyParams = {
          page: currentPage,
          page_size: 10
        };

        if (debouncedSearchTerm) {
          params.search = debouncedSearchTerm;
        }

        if (selectedStatus !== 'all') {
          params.status = selectedStatus as 'pending' | 'approved' | 'rejected';
        }

        if (selectedSector !== 'all') {
          params.sector = selectedSector;
        }

        if (selectedCountry !== 'all') {
          params.country = selectedCountry;
        }

        const refreshResponse = await getAdminCompanies(params);
        if (refreshResponse.data) {
          setCompanies(refreshResponse.data.results);
          setPagination({
            count: refreshResponse.data.count,
            next: refreshResponse.data.next,
            previous: refreshResponse.data.previous,
            total_pages: refreshResponse.data.total_pages,
            page_size: refreshResponse.data.page_size
          });
        }
      }
    } catch (_err) {
      setError(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} company`);
    } finally {
      setUpdatingCompanyId(null);
    }
  };

  const renderPagination = () => {
    if (pagination.total_pages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(pagination.total_pages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.previous}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.next}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * pagination.page_size + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pagination.page_size, pagination.count)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{pagination.count}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.previous}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-[#FF8A00] border-[#FF8A00] text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.next}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Companies Management</h1>
        <Link
          href="/admin/companies/new"
          className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors text-sm"
        >
          Add New Company
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by company name, VAT, email, country, or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="status" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                <select
                  id="status"
                  className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md min-w-[120px]"
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center">
                <label htmlFor="sector" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">Sector:</label>
                <select
                  id="sector"
                  className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md min-w-[180px]"
                  value={selectedSector}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  disabled={filterOptionsLoading}
                >
                  <option value="all">
                    {filterOptionsLoading ? 'Loading sectors...' : 'All Sectors'}
                  </option>
                  {sectors.map((sector) => (
                    <option key={sector.value} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label htmlFor="country" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">Country:</label>
                <select
                  id="country"
                  className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md min-w-[140px]"
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={filterOptionsLoading}
                >
                  <option value="all">
                    {filterOptionsLoading ? 'Loading countries...' : 'All Countries'}
                  </option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00]"></div>
            <p className="mt-2 text-gray-500">Loading companies...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact People
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.length > 0 ? (
                    companies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{company.companyName}</div>
                          <div className="text-sm text-gray-500">VAT: {company.vatNumber}</div>
                          <div className="text-xs text-gray-500">Registered: {company.registrationDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {company.companyEmail}
                          </div>
                          {company.companyPhone && (
                            <div className="text-sm text-gray-500 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {company.companyPhone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {company.contacts.map((contact, index) => (
                            <div key={index} className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                              <div className="text-sm text-gray-500">{contact.email}</div>
                              <div className="text-xs text-gray-500">{contact.position}</div>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.sector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${company.status === 'approved' ? 'bg-green-100 text-green-800' :
                              company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/admin/companies/${company.id}`} className="text-blue-600 hover:text-blue-900">
                              View
                            </Link>
                            {company.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(company.id, 'approved')}
                                  disabled={updatingCompanyId === company.id}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {updatingCompanyId === company.id ? 'Approving...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(company.id, 'rejected')}
                                  disabled={updatingCompanyId === company.id}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {updatingCompanyId === company.id ? 'Rejecting...' : 'Reject'}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No companies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
