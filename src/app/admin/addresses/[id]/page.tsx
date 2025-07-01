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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/addresses"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Addresses
          </Link>
          <h1 className="text-2xl font-bold">Address Details</h1>
        </div>
        <button
          onClick={fetchAddressDetails}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Address Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Address Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address ID
                  </label>
                  <div className="text-sm font-medium text-gray-900">{address.id}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Type
                  </label>
                  <div className="flex items-center">
                    {getTypeIcon(address.type)}
                    <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                      {address.type}
                    </span>
                    {address.isPrimary && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Verification Status
                  </label>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getVerificationBadgeColor(address.isVerified)}`}>
                    {address.isVerified ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Unverified
                      </>
                    )}
                  </span>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Street Address
                  </label>
                  <div className="text-sm text-gray-900">
                    {address.addressLine1}
                    {address.addressLine2 && (
                      <div className="text-sm text-gray-600 mt-1">{address.addressLine2}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    City
                  </label>
                  <div className="text-sm text-gray-900">{address.city}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Postal Code
                  </label>
                  <div className="text-sm text-gray-900">{address.postalCode}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Country
                  </label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{address.country}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created Date
                  </label>
                  <div className="text-sm text-gray-900">{formatDate(address.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Contact Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Contact Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{address.contactName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Contact Phone
                  </label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{address.contactPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Company Information & Actions */}
        <div className="space-y-6">
          {/* Company Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <Building className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Company Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{address.companyName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company ID
                  </label>
                  <div className="text-sm text-gray-900">{address.companyId}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Address Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{address.type}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-sm font-medium ${address.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {address.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Primary Address</span>
                  <span className="text-sm font-medium text-gray-900">
                    {address.isPrimary ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <Link
                  href={`/admin/companies/${address.companyId}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View Company Details
                </Link>
                <Link
                  href={`/admin/addresses`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8A00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View All Addresses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 