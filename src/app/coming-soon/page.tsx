"use client";

import React, { Suspense } from 'react';
import ComingSoonPage from '../../components/pages/ComingSoonPage';

// Loading component to show while the page is loading
function ComingSoonLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8A00]"></div>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function ComingSoon() {
  return (
    <Suspense fallback={<ComingSoonLoading />}>
      <ComingSoonPage />
    </Suspense>
  );
}
