"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Building, Plus, Edit2, Trash2, Check, AlertCircle, RefreshCw, Briefcase, Home, User } from 'lucide-react';
import { getUserAddresses, deleteUserAddress, setPrimaryAddress, Address } from '@/services/userAddresses';
import { getUserProfile, UserProfile } from '@/services/userProfile';



export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Fetch addresses and user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch addresses
        const addressResponse = await getUserAddresses();
        if (addressResponse.error) {
          setError(addressResponse.error);
        } else if (addressResponse.data) {
          setAddresses(addressResponse.data.addresses);
        }
        
        // Fetch user profile
        const profileResponse = await getUserProfile();
        if (profileResponse.data) {
          setProfile(profileResponse.data);
        }
      } catch (_error) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to set an address as primary
  const handleSetPrimary = async (id: number) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setProcessingId(id);
      setError(null);
      setSuccess(null);
      
      const response = await setPrimaryAddress(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Update local state to reflect the change
        setAddresses(prevAddresses => 
          prevAddresses.map(address => ({
            ...address,
            is_primary: address.id === id
          }))
        );
        
        setSuccess('Primary address updated successfully');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (_error) {
      setError('Failed to update primary address');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  // Function to delete an address
  const handleDeleteAddress = async (id: number) => {
    if (isProcessing) return;
    
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      setIsProcessing(true);
      setProcessingId(id);
      setError(null);
      setSuccess(null);
      
      const response = await deleteUserAddress(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Remove the address from local state
        setAddresses(prevAddresses => 
          prevAddresses.filter(address => address.id !== id)
        );
        
        setSuccess('Address deleted successfully');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (_error) {
      setError('Failed to delete address');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  return (
    <div className="p-5">
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-medium">My Addresses</h1>
          {profile && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <User size={14} className="mr-1" />
              {profile.name} • {profile.role_display} at {profile.company_name}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/addresses/new"
          className="bg-[#FF8A00] text-white py-2 px-4 rounded-md flex items-center text-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Address
        </Link>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md mb-5">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md mb-5">
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white border border-gray-100 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {address.type === 'business' ? (
                      <Briefcase size={18} className="text-[#FF8A00]" />
                    ) : address.type === 'billing' ? (
                      <Building size={18} className="text-purple-500" />
                    ) : (
                      <Home size={18} className="text-blue-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center">
                      <h2 className="text-base font-medium text-gray-900">
                        {address.type_display}
                      </h2>
                      {address.is_primary && (
                        <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                      {address.is_verified && (
                        <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                          <Check size={10} className="mr-0.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 mt-1">
                      {address.address_line1}
                      {address.address_line2 && <span>, {address.address_line2}</span>}
                    </div>
                    <div className="text-sm text-gray-700">
                      {address.city}, {address.postal_code}
                    </div>
                    <div className="text-sm text-gray-700">
                      {address.country}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Contact: {address.contact_name}, {address.contact_phone}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/addresses/${address.id}/edit`}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isProcessing && processingId === address.id}
                  >
                    {isProcessing && processingId === address.id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>

              {!address.is_primary && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
                    onClick={() => handleSetPrimary(address.id)}
                    disabled={isProcessing && processingId === address.id}
                  >
                    {isProcessing && processingId === address.id ? (
                      <>
                        <RefreshCw size={12} className="animate-spin mr-1" />
                        Setting as primary...
                      </>
                    ) : (
                      <>Set as primary address</>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && addresses.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-[#FF8A00]" />
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">No addresses yet</h2>
          <p className="text-sm text-gray-500 mb-4">You haven&apos;t added any addresses to your account yet.</p>
          <Link
            href="/dashboard/addresses/new"
            className="bg-[#FF8A00] text-white py-2 px-4 rounded-md inline-flex items-center text-sm hover:bg-[#e67e00] transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Address
          </Link>
        </div>
      )}
    </div>
  );
}
