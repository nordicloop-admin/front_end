"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to companies page since users are now managed within companies
    router.replace('/admin/companies');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Companies page...</p>
        <p className="text-sm text-gray-500 mt-2">Users are now managed within company profiles.</p>
      </div>
    </div>
  );
}