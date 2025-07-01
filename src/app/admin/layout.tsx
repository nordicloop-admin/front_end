import React from 'react';
import type { Metadata } from 'next';
import AdminLayoutClient from '@/components/layout/AdminLayoutClient';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';

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
    <AdminProtectedRoute>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProtectedRoute>
  );
}
