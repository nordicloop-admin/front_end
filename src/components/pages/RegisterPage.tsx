"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SECTOR_CHOICES, COUNTRY_CHOICES } from '@/types/auth';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    vatNumber: '',
    email: '',
    website: '',
    country: '',
    sector: '',

    // Contact Person Information
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPosition: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // For testing purposes, we'll simulate a successful registration
      // and generate a fake token for the signup page
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a simple token with the email (in a real app, this would be more secure)
      const fakeToken = Buffer.from(JSON.stringify({
        email: formData.contactEmail,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
      })).toString('base64');

      // Redirect directly to signup page with the token
      router.push(`/signup?token=${fakeToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please check your information and try again.');
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register Your Company</h2>
            <p className="text-gray-500">Please enter your company details</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <h3 className="text-lg font-medium text-gray-900 mb-3">Company Information</h3>

            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name*
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">
                VAT Number*
              </label>
              <input
                id="vatNumber"
                name="vatNumber"
                type="text"
                value={formData.vatNumber}
                onChange={handleChange}
                placeholder="Enter your VAT number"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Company Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter company email"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter company website"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country*
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              >
                <option value="">Select a country</option>
                {COUNTRY_CHOICES.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                Sector*
              </label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              >
                <option value="">Select a sector</option>
                {SECTOR_CHOICES.map(sector => (
                  <option key={sector.value} value={sector.value}>
                    {sector.label}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Person Information</h3>

            <div className="mb-4">
              <label htmlFor="contactFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                id="contactFirstName"
                name="contactFirstName"
                type="text"
                value={formData.contactFirstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactLastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                id="contactLastName"
                name="contactLastName"
                type="text"
                value={formData.contactLastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="contactPosition" className="block text-sm font-medium text-gray-700 mb-1">
                Position*
              </label>
              <input
                id="contactPosition"
                name="contactPosition"
                type="text"
                value={formData.contactPosition}
                onChange={handleChange}
                placeholder="Enter your position"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Company'}
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
