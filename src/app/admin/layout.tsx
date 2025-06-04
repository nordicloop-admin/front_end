import React from 'react';
import type { Metadata } from 'next';
import AdminLayoutClient from '@/components/layout/AdminLayoutClient';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: "Admin Dashboard - Nordic Loop",
  description: "Admin dashboard for Nordic Loop platform.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ProtectedRoute>
  );
}
