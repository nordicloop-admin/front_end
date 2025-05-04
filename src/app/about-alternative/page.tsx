import React from 'react';
import AboutPageAlternative from '@/components/pages/AboutPageAlternative';
import DesignToggle from '@/components/ui/DesignToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us (Alternative) - Nordic Loop",
  description: "Learn about Nordic Loop's mission to transform waste into valuable resources through sustainable material trading and circular economy solutions.",
};

export default function AboutAlternative() {
  return (
    <>
      <DesignToggle originalPath="/about" alternativePath="/about-alternative" />
      <AboutPageAlternative />
    </>
  );
}
