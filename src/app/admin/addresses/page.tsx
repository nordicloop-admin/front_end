"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, MapPin, Building, Check, X } from 'lucide-react';

// Mock data for addresses
const mockAddresses = [
  {
    id: '1',
    companyId: '1',
    companyName: 'Eco Solutions AB',
    type: 'business',
    addressLine1: 'Storgatan 45',
    addressLine2: '',
    city: 'Stockholm',
    postalCode: '11455',
    country: 'Sweden',
    isVerified: true,
    isPrimary: true,
    contactName: 'Erik Johansson',
    contactPhone: '+46 70 123 4567',
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    companyId: '1',
    companyName: 'Eco Solutions AB',
    type: 'shipping',
    addressLine1: 'Industrivägen 12',
    addressLine2: 'Port 3',
    city: 'Stockholm',
    postalCode: '12645',
    country: 'Sweden',
    isVerified: true,
    isPrimary: false,
    contactName: 'Maria Andersson',
    contactPhone: '+46 70 987 6543',
    createdAt: '2023-05-16'
  },
  {
    id: '3',
    companyId: '2',
    companyName: 'Green Tech Norway',
    type: 'business',
    addressLine1: 'Kongens gate 20',
    addressLine2: '4th Floor',
    city: 'Oslo',
    postalCode: '0153',
    country: 'Norway',
    isVerified: true,
    isPrimary: true,
    contactName: 'Astrid Olsen',
    contactPhone: '+47 912 34 567',
    createdAt: '2023-06-20'
  },
  {
    id: '4',
    companyId: '2',
    companyName: 'Green Tech Norway',
    type: 'shipping',
    addressLine1: 'Havnegata 7',
    addressLine2: '',
    city: 'Oslo',
    postalCode: '0150',
    country: 'Norway',
    isVerified: false,
    isPrimary: false,
    contactName: 'Johan Berg',
    contactPhone: '+47 987 65 432',
    createdAt: '2023-06-21'
  },
  {
    id: '5',
    companyId: '3',
    companyName: 'Circular Materials Oy',
    type: 'business',
    addressLine1: 'Mannerheimintie 15',
    addressLine2: '',
    city: 'Helsinki',
    postalCode: '00100',
    country: 'Finland',
    isVerified: true,
    isPrimary: true,
    contactName: 'Mikko Virtanen',
    contactPhone: '+358 40 123 4567',
    createdAt: '2023-07-05'
  }
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [filteredAddresses, setFilteredAddresses] = useState(mockAddresses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
  // Filter addresses based on search term, type, and verification status
  useEffect(() => {
    let result = addresses;
    
    if (searchTerm) {
      result = result.filter(address => 
        address.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      result = result.filter(address => address.type === selectedType);
    }
    
    if (selectedVerification !== 'all') {
      const isVerified = selectedVerification === 'verified';
      result = result.filter(address => address.isVerified === isVerified);
    }
    
    setFilteredAddresses(result);
  }, [searchTerm, selectedType, selectedVerification, addresses]);
  
  // Handle verification status change
  const handleVerificationChange = (addressId: string, isVerified: boolean) => {
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
    
    const sortedAddresses = [...filteredAddresses].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredAddresses(sortedAddresses);
  };
  
  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Format address for display
  const formatAddress = (address: typeof mockAddresses[0]) => {
    let formattedAddress = address.addressLine1;
    if (address.addressLine2) formattedAddress += `, ${address.addressLine2}`;
    formattedAddress += `, ${address.city}, ${address.postalCode}, ${address.country}`;
    return formattedAddress;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Address Management</h1>
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
              placeholder="Search addresses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
              onChange={(e) => setSelectedVerification(e.target.value)}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>
      
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
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address) => (
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
                        <Link href={`/admin/addresses/${address.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                        {!address.isVerified ? (
                          <button 
                            className="text-green-600 hover:text-green-900 flex items-center"
                            onClick={() => handleVerificationChange(address.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </button>
                        ) : (
                          <button 
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleVerificationChange(address.id, false)}
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
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No addresses found
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
