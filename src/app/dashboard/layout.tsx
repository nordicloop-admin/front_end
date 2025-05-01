import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - Nordic Loop",
  description: "Manage your Nordic Loop account and listings.",
};

import DashboardLayoutClient from '@/components/layout/DashboardLayoutClient';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
