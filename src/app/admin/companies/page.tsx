"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Mock data for companies
const mockCompanies = [
  {
    id: '1',
    companyName: 'Eco Solutions AB',
    vatNumber: 'SE123456789001',
    country: 'Sweden',
    sector: 'Recycling & Waste Management',
    contactName: 'Erik Johansson',
    contactEmail: 'erik@ecosolutions.se',
    status: 'approved',
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    companyName: 'Green Tech Norway',
    vatNumber: 'NO987654321001',
    country: 'Norway',
    sector: 'Energy & Utilities',
    contactName: 'Astrid Olsen',
    contactEmail: 'astrid@greentech.no',
    status: 'pending',
    createdAt: '2023-06-20'
  },
  {
    id: '3',
    companyName: 'Circular Materials Oy',
    vatNumber: 'FI567890123001',
    country: 'Finland',
    sector: 'Manufacturing & Production',
    contactName: 'Mikko Virtanen',
    contactEmail: 'mikko@circularmaterials.fi',
    status: 'pending',
    createdAt: '2023-07-05'
  }
];

export default function CompaniesPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  const [companies, setCompanies] = useState(mockCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || 'all');

  useEffect(() => {
    // Filter companies based on search term and status
    let filtered = companies;
    
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(company => company.status === selectedStatus);
    }
    
    setFilteredCompanies(filtered);
  }, [searchTerm, selectedStatus, companies]);

  const handleStatusChange = (companyId: string, newStatus: string) => {
    // Update company status
    const updatedCompanies = companies.map(company => 
      company.id === companyId ? { ...company, status: newStatus } : company
    );
    setCompanies(updatedCompanies);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies Management</h1>
        <Link 
          href="/admin/companies/new" 
          className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors"
        >
          Add New Company
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="status" className="mr-2 text-sm font-medium text-gray-700">Status:</label>
              <select
                id="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
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
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.companyName}</div>
                      <div className="text-sm text-gray-500">VAT: {company.vatNumber}</div>
                      <div className="text-xs text-gray-500">Registered: {company.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.contactName}</div>
                      <div className="text-sm text-gray-500">{company.contactEmail}</div>
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
                              onClick={() => handleStatusChange(company.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusChange(company.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No companies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
