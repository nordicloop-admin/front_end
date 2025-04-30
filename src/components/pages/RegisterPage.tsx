"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopUrl, setShopUrl] = useState('');
  const [shopUrl2, setShopUrl2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // For now, just simulate a registration process
    // In a real app, you would connect this to your authentication system
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, redirect to success page
      router.push('/register/success');
    } catch (_err) {
      setError('Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Dark Blue Background with Tagline */}
      <div className="hidden md:flex md:w-1/2 bg-[#1E2A36] text-white p-10 flex-col justify-end">
        <div className="mb-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            The Marketplace Where Waste Becomes A Resource
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Nordic Loop Connects Businesses To Trade Surplus Materials,<br />
            Reducing Costs, Cutting CO<sub>2</sub> Emissions, And Driving<br />
            Sustainability.
          </p>
        </div>
      </div>

      {/* Mobile-only dark header */}
      <div className="md:hidden w-full bg-[#1E2A36] text-white p-6 absolute top-0 left-0 right-0">
        <h1 className="text-xl font-bold">
          Nordic Loop
        </h1>
      </div>

      {/* Right Side - White Background with Registration Form */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-10 pt-20 md:pt-10 flex flex-col min-h-screen">
        {/* Top Navigation - Hidden on very small screens */}
        <div className="hidden sm:flex justify-between items-center mb-16">
          <button
            onClick={goBack}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Link
            href="/coming-soon"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact support
          </Link>
        </div>

        {/* Registration Form Container - Centered */}
        <div className="flex-grow flex flex-col justify-center items-center max-w-md mx-auto w-full px-4 sm:px-0">
          {/* Logo */}
          <div className="mb-8 relative w-16 h-16">
            <Image
              src="/nordic-infinity-logo.svg"
              alt="Nordic Loop Logo"
              width={64}
              height={64}
              priority
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register to Nordi loop</h2>
            <p className="text-gray-500">Please enter your details</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Your full name"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                Shop name
              </label>
              <input
                id="shopName"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter Your shop name"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="shopUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Shop url
              </label>
              <input
                id="shopUrl"
                type="url"
                value={shopUrl}
                onChange={(e) => setShopUrl(e.target.value)}
                placeholder="Enter Your shop url"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="shopUrl2" className="block text-sm font-medium text-gray-700 mb-1">
                Shop url
              </label>
              <input
                id="shopUrl2"
                type="url"
                value={shopUrl2}
                onChange={(e) => setShopUrl2(e.target.value)}
                placeholder="Enter Your shop url"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Continue'}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already Have An Account?{' '}
                <Link href="/login" className="text-[#FF8A00] hover:text-[#e67e00] transition-colors font-medium">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nordic loop 2025
          </div>
          <Link href="/coming-soon" className="text-gray-500 hover:text-gray-700 transition-colors">
            Privacy and policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
