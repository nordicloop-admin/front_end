"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building, Plus, Edit2, Trash2, Check } from 'lucide-react';

// Mock data for addresses
const mockAddresses = [
  {
    id: '1',
    type: 'business',
    isPrimary: true,
    addressLine1: 'Storgatan 45',
    addressLine2: '',
    city: 'Stockholm',
    postalCode: '11455',
    country: 'Sweden',
    isVerified: true,
    contactName: 'Erik Johansson',
    contactPhone: '+46 70 123 4567'
  },
  {
    id: '2',
    type: 'shipping',
    isPrimary: false,
    addressLine1: 'Industrivägen 12',
    addressLine2: 'Port 3',
    city: 'Stockholm',
    postalCode: '12645',
    country: 'Sweden',
    isVerified: true,
    contactName: 'Maria Andersson',
    contactPhone: '+46 70 987 6543'
  }
];

export default function Addresses() {
  const [addresses, setAddresses] = useState(mockAddresses);

  // Function to set an address as primary
  const setPrimaryAddress = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isPrimary: address.id === id
    })));
  };

  // Function to delete an address
  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">My Addresses</h1>
        <Link
          href="/dashboard/addresses/new"
          className="bg-[#FF8A00] text-white py-2 px-4 rounded-md flex items-center text-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Address
        </Link>
      </div>

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white border border-gray-100 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {address.type === 'business' ? (
                    <Building size={18} className="text-gray-400" />
                  ) : (
                    <MapPin size={18} className="text-gray-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center">
                    <h2 className="text-base font-medium text-gray-900 capitalize">
                      {address.type} Address
                    </h2>
                    {address.isPrimary && (
                      <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                    {address.isVerified && (
                      <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <Check size={10} className="mr-0.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 mt-1">
                    {address.addressLine1}
                    {address.addressLine2 && <span>, {address.addressLine2}</span>}
                  </div>
                  <div className="text-sm text-gray-700">
                    {address.city}, {address.postalCode}
                  </div>
                  <div className="text-sm text-gray-700">
                    {address.country}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Contact: {address.contactName}, {address.contactPhone}
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
                  onClick={() => deleteAddress(address.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {!address.isPrimary && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium"
                  onClick={() => setPrimaryAddress(address.id)}
                >
                  Set as primary address
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <MapPin size={32} className="mx-auto mb-3 text-gray-300" />
          <h2 className="text-base font-medium text-gray-800 mb-2">No addresses yet</h2>
          <p className="text-sm text-gray-500 mb-4">You haven't added any addresses to your account yet.</p>
          <Link
            href="/dashboard/addresses/new"
            className="bg-[#FF8A00] text-white py-2 px-4 rounded-md inline-flex items-center text-sm"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Address
          </Link>
        </div>
      )}
    </div>
  );
}
