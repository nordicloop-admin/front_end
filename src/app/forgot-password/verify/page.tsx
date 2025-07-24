'use client';

import React, { Suspense } from 'react';
import { VerifyOtpPage } from '@/components/pages/VerifyOtpPage';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">Loading verification page...</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyOtpPage />
    </Suspense>
  );
}
