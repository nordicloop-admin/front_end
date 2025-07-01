"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Building, MapPin, User, Globe, Phone, Check, X } from 'lucide-react';
import { getAdminAddress, AdminAddress } from '@/services/addresses';

export default function AddressDetailPage() {
  const { id } = useParams();
  
  // State management
  const [address, setAddress] = useState<AdminAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch address details
  const fetchAddressDetails = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminAddress(id);

      if (response.data) {
        setAddress(response.data);
      } else {
        setError(response.error || 'Failed to fetch address details');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching address details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAddressDetails();
  }, [fetchAddressDetails]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get verification badge color
  const getVerificationBadgeColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    return type === 'business' ? (
      <Building className="h-5 w-5 text-[#FF8A00]" />
    ) : (
      <MapPin className="h-5 w-5 text-[#FF8A00]" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="text-gray-500">Loading address details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchAddressDetails}
          className="mt-4 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Address not found</div>
        <Link
          href="/admin/addresses"
          className="mt-4 inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Addresses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -mx-5">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/addresses"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Addresses</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getVerificationBadgeColor(address.isVerified)}`}>
                {address.isVerified ? 'Verified' : 'Unverified'}
              </span>
              
              <button
                onClick={fetchAddressDetails}
                className="flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address</h1>
            <p className="text-gray-500 mt-1">Created on {formatDate(address.createdAt)} • Address ID: #{address.id}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1">Address Type</div>
              <div className="text-2xl font-bold text-[#FF8A00] capitalize">{address.type}</div>
              {address.isPrimary && (
                <div className="text-sm text-blue-600 mt-1">Primary Address</div>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </div>
              <div className="text-xl font-bold text-gray-900">{address.city}</div>
              <div className="text-sm text-gray-500">{address.country}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Company
              </div>
              <div className="text-xl font-bold text-gray-900">{address.companyName}</div>
              <div className="text-sm text-gray-500">{address.contactName}</div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Address Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Type</div>
                  <div className="text-gray-900 font-medium text-sm text-right capitalize">{address.type}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Status</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.isVerified ? 'Verified' : 'Unverified'}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Primary Address</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.isPrimary ? 'Yes' : 'No'}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Street Address</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.addressLine1}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">City</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.city}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Postal Code</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.postalCode}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Country</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.country}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Created Date</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatDate(address.createdAt)}</div>
                </div>
              </div>
              
              {address.addressLine2 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2">Additional Address Information</h3>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100 text-gray-700">
                    {address.addressLine2}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Contact Name</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.contactName}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Contact Phone</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{address.contactPhone}</div>
                </div>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                <Link
                  href={`/admin/companies/${address.companyId}`}
                  className="text-[#FF8A00] text-sm hover:text-orange-700 font-medium"
                >
                  View Company Details
                </Link>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-100">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                  <Building size={24} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{address.companyName}</h3>
                  <p className="text-sm text-gray-500">ID: {address.companyId}</p>
                  <p className="text-sm text-gray-500">Contact: {address.contactName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Address Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verification Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    address.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {address.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Primary Address</span>
                  <span className="font-medium text-gray-900">{address.isPrimary ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-900 capitalize">{address.type}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/companies/${address.companyId}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  View Company Details
                </Link>
                <Link
                  href={`/admin/addresses`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8A00] hover:bg-orange-600 transition-colors"
                >
                  View All Addresses
                </Link>
              </div>
            </div>
            
            {/* Admin Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Notes</h3>
              <textarea
                placeholder="Add private notes about this address (only visible to admins)"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              ></textarea>
              <button className="mt-2 w-full px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 