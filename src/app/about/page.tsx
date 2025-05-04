import React from 'react';
import AboutPage from '@/components/pages/AboutPage';
import DesignToggle from '@/components/ui/DesignToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us - Nordic Loop",
  description: "Learn about Nordic Loop's mission to transform waste into valuable resources through sustainable material trading and circular economy solutions.",
};

export default function About() {
  return (
    <>
      <DesignToggle originalPath="/about" alternativePath="/about-alternative" />
      <AboutPage />
    </>
  );
}
