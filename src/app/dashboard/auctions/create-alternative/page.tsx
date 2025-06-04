"use client";

import React from 'react';
import { AlternativeAuctionForm } from '@/components/forms/auction/AlternativeAuctionForm';

export default function CreateAlternativeAuction() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Auction</h1>
          <p className="text-gray-600 mt-2">List your materials for auction in our marketplace</p>
        </div>
        
        <AlternativeAuctionForm />
      </div>
    </div>
  );
} 