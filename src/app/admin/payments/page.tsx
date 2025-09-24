"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';
import AdminPaymentDashboard from '@/components/payments/AdminPaymentDashboard';

export default function AdminPaymentsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-md p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00] mr-2"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin/staff
  if (!user || user.role !== 'Admin') {
    return (
      <div className="p-6">
        <div className="bg-white border border-red-100 rounded-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700 mb-4">
            You don&apos;t have permission to access the admin payment dashboard.
          </p>
          <p className="text-sm text-gray-600">
            This page is restricted to administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminPaymentDashboard />
    </div>
  );
}
