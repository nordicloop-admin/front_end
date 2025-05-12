import React from 'react';
import PricingPage from '@/components/pages/PricingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pricing - Nordic Loop",
  description: "Flexible business plans for sustainable growth. Choose the plan that fits your business needs.",
};

export default function Pricing() {
  return <PricingPage />;
}
