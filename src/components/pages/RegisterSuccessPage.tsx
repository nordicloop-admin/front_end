"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterSuccessPage = () => {
  const _router = useRouter();

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

      {/* Right Side - White Background with Success Message */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-10 pt-20 md:pt-10 flex flex-col min-h-screen">
        {/* Success Content - Centered */}
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

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register to Nordi loop</h2>
          </div>

          {/* Success Card */}
          <div className="bg-gray-50 rounded-lg p-8 w-full flex flex-col items-center mb-8">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L20 7" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-medium text-gray-900 mb-3">Company Registration Successful</h3>
            <p className="text-gray-600 text-center mb-6">
              Thank you for registering your company. We've sent an invitation email to the contact person's email address. Please check the email to complete the sign-up process.
            </p>

            {/* Back to Home Button */}
            <Link
              href="/"
              className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
