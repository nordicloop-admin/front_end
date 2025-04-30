import React from 'react';
import MarketplacePage from '@/components/pages/MarketplacePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Market Place - Nordic Loop",
  description: "Browse available materials and resources on the Nordic Loop marketplace.",
};

export default function MarketPlace() {
  return <MarketplacePage />;
}
