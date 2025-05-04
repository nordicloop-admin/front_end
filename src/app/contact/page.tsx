import React from 'react';
import ContactPage from '@/components/pages/ContactPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Nordic Loop",
  description: "Get in touch with Nordic Loop. We're here to answer your questions and help you get started with sustainable material trading.",
};

export default function Contact() {
  return <ContactPage />;
}
