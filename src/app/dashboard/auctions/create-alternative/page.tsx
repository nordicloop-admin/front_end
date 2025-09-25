"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlternativeAuctionForm } from '@/components/forms/auction/AlternativeAuctionForm';

export default function CreateAlternativeAuction() {
  const router = useRouter();

  const handleAuctionCreated = () => {
    // Redirect to my-activity page after successful auction creation
    router.push('/dashboard/my-activity');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Auction</h1>
          <p className="text-gray-600 mt-2">List your materials for auction in our marketplace</p>
        </div>
        
        <AlternativeAuctionForm onAuctionUpdated={handleAuctionCreated} />
      </div>
    </div>
  );
} 