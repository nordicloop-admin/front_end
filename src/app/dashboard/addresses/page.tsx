"use client";

import React from 'react';
import Link from 'next/link';

export default function Addresses() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Addresses</h1>
      <div className="bg-white p-8 rounded-md border border-gray-200">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">This page is under development.</p>
          <Link href="/dashboard" className="text-[#FF8A00] hover:text-[#e67e00]">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
