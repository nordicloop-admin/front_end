"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logger from '@/utils/logger';

const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Get form data
    const formElement = e.target as HTMLFormElement;
    const nameInput = formElement.querySelector('input[name="name"]') as HTMLInputElement;
    const emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement;

    const name = nameInput?.value;
    const email = emailInput?.value;

    if (!name || !email) {
      setSubmitStatus({ success: false, message: 'Please fill in all fields' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Send confirmation email using EmailJS browser library
        try {
          // Access the EmailJS global object from the window
          const emailjs = (window as Window & typeof globalThis & { emailjs?: { send: (serviceId: string, templateId: string, templateParams: Record<string, unknown>) => Promise<unknown> } }).emailjs;

          if (emailjs) {
            // Send the email
            await emailjs.send(
              process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_NEWSLETTER || 'service_8xb9iql',
              process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NEWSLETTER || 'template_esd49tn',
              {
              name: name,
              email: email,
            });

            logger.info('Newsletter confirmation email sent successfully');
          } else {
            logger.error('EmailJS not available');
          }
        } catch (emailError) {
          logger.error('Error sending newsletter confirmation email:', emailError);
          // We still consider the subscription successful even if the email fails
        }

        setSubmitStatus({ success: true, message: 'Thank you for subscribing! Check your email for confirmation.' });
        // Reset form
        formElement.reset();
      } else {
        setSubmitStatus({ success: false, message: data.message || 'Something went wrong' });
      }
    } catch (error: unknown) {
      logger.error('Newsletter subscription error:', error);
      setSubmitStatus({ success: false, message: 'Failed to connect to server' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-[#1E2A36] text-white py-12">
      <div className="max-w-[86%] mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          {/* Left side - Logo and newsletter text */}
          <div className="md:w-1/4">
            {/* Logo */}
            <div className="mb-12">
              <Link href="/" className="block">
                <div className="flex items-center">
                  <div className="relative w-[140px] h-[40px]">
                    <Image
                      src="/nordic logo.png"
                      alt="Nordic Loop Logo"
                      fill
                      sizes="140px"
                      className="object-contain"
                      priority
                      loading="eager"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Newsletter text */}
            <div>
              <h3 className="text-base font-normal">
                Get to know us more.<br/>
                Join our newsletter.
              </h3>
            </div>
          </div>

          {/* Right side - Navigation, social icons, and newsletter inputs */}
          <div className="md:w-3/4">
            {/* Navigation and social icons */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              {/* Navigation */}
              <div className="flex space-x-8 mb-6 md:mb-0">
                <Link href="/about" className="text-white hover:text-gray-300 transition-colors">
                  About Us
                </Link>
                <Link href="/market-place" className="text-white hover:text-gray-300 transition-colors">
                  Market Place
                </Link>
                <Link href="/pricing" className="text-white hover:text-gray-300 transition-colors">
                  Pricing
                </Link>
                <Link href="/contact" className="text-white hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </div>

              {/* LinkedIn Icon */}
              <div className="flex items-center">
                <a
                  href="https://www.linkedin.com/company/nordic-loop"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Nordic Loop on LinkedIn"
                  className="flex items-center justify-center gap-2 bg-[#0A66C2] text-white px-4 py-2 rounded-sm hover:bg-[#004182] transition-colors group w-full md:w-[140px]"
                >
                  <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="font-medium text-sm">Follow us</span>
                </a>
              </div>
            </div>

            {/* Newsletter inputs */}
            <div className="flex justify-between">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    className="px-4 py-3 bg-[#2A3642] border-none rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-gray-300 placeholder-gray-400 w-full md:flex-1"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    className="px-4 py-3 bg-[#2A3642] border-none rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-gray-300 placeholder-gray-400 w-full md:flex-1"
                  />

                  <button
                    type="submit"
                    className="bg-[#FF8A00] text-white px-8 py-3 rounded-sm hover:bg-[#FF9A20] transition-colors w-full md:w-[140px] font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>

                {submitStatus && (
                  <div className={`mt-2 text-sm ${submitStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {submitStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#2A3642] pt-8">
          <p className="text-sm text-gray-400 text-center">
            © Nordic loop 2025, all right reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
