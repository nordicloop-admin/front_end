"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SECTOR_CHOICES, COUNTRY_CHOICES } from '@/types/auth';
// Imports removed to fix ESLint errors
// import { motion, AnimatePresence } from 'framer-motion';

// Step types for the registration process
type RegistrationStep = 'company' | 'contact';

const RegisterPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RegistrationStep>('company');
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

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // State to show company error message on contact tab
  const [showContactTabCompanyError, setShowContactTabCompanyError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear company error message when filling out company fields
    if (['companyName', 'vatNumber', 'country', 'sector'].includes(name) && value.trim() !== '') {
      setShowContactTabCompanyError(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Company validation
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.vatNumber.trim()) errors.vatNumber = 'VAT number is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.sector) errors.sector = 'Sector is required';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }

    // Contact validation
    if (!formData.contactFirstName.trim()) errors.contactFirstName = 'First name is required';
    if (!formData.contactLastName.trim()) errors.contactLastName = 'Last name is required';
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    if (!formData.contactPosition.trim()) errors.contactPosition = 'Position is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to check if required company fields are filled
  const validateCompanyFields = (): boolean => {
    // Check if required company fields are filled
    if (!formData.companyName.trim()) {
      setValidationErrors(prev => ({ ...prev, companyName: 'Company name is required' }));
      return false;
    }
    if (!formData.vatNumber.trim()) {
      setValidationErrors(prev => ({ ...prev, vatNumber: 'VAT number is required' }));
      return false;
    }
    if (!formData.country) {
      setValidationErrors(prev => ({ ...prev, country: 'Country is required' }));
      return false;
    }
    if (!formData.sector) {
      setValidationErrors(prev => ({ ...prev, sector: 'Sector is required' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First check if company fields are filled when on contact tab
    if (activeTab === 'contact') {
      const companyFieldsValid = validateCompanyFields();
      if (!companyFieldsValid) {
        setError('Please complete the required Company Information fields before submitting.');

        // Show a prominent error message on the contact tab
        setShowContactTabCompanyError(true);

        return;
      }
    }

    // Run full validation
    const isValid = validateForm();

    // Check which tab has errors
    const companyFieldsWithErrors = ['companyName', 'vatNumber', 'email', 'website', 'country', 'sector'];
    const contactFieldsWithErrors = ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition'];

    const hasCompanyErrors = companyFieldsWithErrors.some(field => validationErrors[field]);
    const hasContactErrors = contactFieldsWithErrors.some(field => validationErrors[field]);

    // If there are any errors, show the error message and switch to the appropriate tab
    if (!isValid) {
      setError('Please fill in all required fields correctly.');

      // If we're on the contact tab but there are company errors, switch to company tab
      if (activeTab === 'contact' && hasCompanyErrors) {
        setActiveTab('company');
      }
      // If we're on the company tab but there are only contact errors, switch to contact tab
      else if (activeTab === 'company' && !hasCompanyErrors && hasContactErrors) {
        setActiveTab('contact');
      }

      return;
    }

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



  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Dark Blue Background with Tagline */}
      <div className="hidden md:flex md:w-1/3 bg-[#1E2A36] text-white p-10 flex-col justify-between">
        {/* Logo at top */}
        <div className="mt-6">
          <Image
            src="/nordic logo.png"
            alt="Nordic Loop Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Tagline */}
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
      <div className="w-full md:w-2/3 bg-white p-6 md:p-10 pt-20 md:pt-6 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <div className="hidden sm:flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
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

        {/* Registration Form Container */}
        <div className="flex-grow flex flex-col justify-center items-center w-full px-4 sm:px-6">
          {/* Welcome Text */}
          <div className="text-center mb-6 w-full max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register Your Company</h2>
            <p className="text-gray-500">Please enter your company details</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            {error && !showContactTabCompanyError && activeTab === 'contact' && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Card Container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {/* Company Tab */}
                <button
                  type="button"
                  className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors relative ${
                    activeTab === 'company'
                      ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveTab('company');
                    setShowContactTabCompanyError(false);
                    setError('');
                  }}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Company Information

                    {/* Error indicator for Company tab */}
                    {Object.keys(validationErrors).some(key =>
                      ['companyName', 'vatNumber', 'country', 'sector', 'email', 'website'].includes(key)
                    ) && (
                      <span className="ml-2 flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </span>
                </button>

                {/* Contact Tab */}
                <button
                  type="button"
                  className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors relative ${
                    activeTab === 'contact'
                      ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveTab('contact');
                    setError('');
                  }}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Contact Person

                    {/* Error indicator for Contact tab */}
                    {Object.keys(validationErrors).some(key =>
                      ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition'].includes(key)
                    ) && (
                      <span className="ml-2 flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Company Information Tab */}
                <div className={activeTab === 'company' ? 'block' : 'hidden'}>
                  {/* Company Tab Error Summary */}
                  {Object.keys(validationErrors).some(key =>
                    ['companyName', 'vatNumber', 'country', 'sector', 'email', 'website'].includes(key)
                  ) && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-1">Please correct the following errors:</h4>
                      <ul className="list-disc pl-5 text-xs text-red-700 space-y-1">
                        {validationErrors.companyName && <li>{validationErrors.companyName}</li>}
                        {validationErrors.vatNumber && <li>{validationErrors.vatNumber}</li>}
                        {validationErrors.country && <li>{validationErrors.country}</li>}
                        {validationErrors.sector && <li>{validationErrors.sector}</li>}
                        {validationErrors.email && <li>{validationErrors.email}</li>}
                        {validationErrors.website && <li>{validationErrors.website}</li>}
                      </ul>
                    </div>
                  )}

                  {/* Removed notification about Contact tab errors - we already have the red dot indicator */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
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
                        className={`w-full p-3 border ${validationErrors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      />
                      {validationErrors.companyName && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.companyName}</p>
                      )}
                    </div>

                    <div>
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
                        className={`w-full p-3 border ${validationErrors.vatNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      />
                      {validationErrors.vatNumber && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.vatNumber}</p>
                      )}
                    </div>

                    <div>
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
                        className={`w-full p-3 border ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
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
                        className={`w-full p-3 border ${validationErrors.website ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                      />
                      {validationErrors.website && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.website}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country*
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full p-3 border ${validationErrors.country ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      >
                        <option value="">Select a country</option>
                        {COUNTRY_CHOICES.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                      {validationErrors.country && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.country}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                        Sector*
                      </label>
                      <select
                        id="sector"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className={`w-full p-3 border ${validationErrors.sector ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      >
                        <option value="">Select a sector</option>
                        {SECTOR_CHOICES.map(sector => (
                          <option key={sector.value} value={sector.value}>
                            {sector.label}
                          </option>
                        ))}
                      </select>
                      {validationErrors.sector && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.sector}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="bg-[#FF8A00] text-white py-2 px-6 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
                    >
                      Next: Contact Information
                    </button>
                  </div>
                </div>

                {/* Contact Person Tab */}
                <div className={activeTab === 'contact' ? 'block' : 'hidden'}>
                  {/* Company Information Missing Error - only show when needed */}
                  {showContactTabCompanyError && !Object.keys(validationErrors).some(key =>
                    ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition'].includes(key)
                  ) && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                      <div className="flex">
                        <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <h3 className="text-md font-medium text-red-800">Company Information Required</h3>
                          <p className="text-sm text-red-700 mt-1">
                            Please complete the required Company Information fields before submitting.
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('company')}
                            className="mt-2 text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                          >
                            Go to Company Information
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Tab Error Summary */}
                  {Object.keys(validationErrors).some(key =>
                    ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition'].includes(key)
                  ) && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-1">Please correct the following errors:</h4>
                      <ul className="list-disc pl-5 text-xs text-red-700 space-y-1">
                        {validationErrors.contactFirstName && <li>{validationErrors.contactFirstName}</li>}
                        {validationErrors.contactLastName && <li>{validationErrors.contactLastName}</li>}
                        {validationErrors.contactEmail && <li>{validationErrors.contactEmail}</li>}
                        {validationErrors.contactPosition && <li>{validationErrors.contactPosition}</li>}
                      </ul>
                    </div>
                  )}

                  {/* Removed notification about Company tab errors - we already have the red dot indicator */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
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
                        className={`w-full p-3 border ${validationErrors.contactFirstName ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      />
                      {validationErrors.contactFirstName && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.contactFirstName}</p>
                      )}
                    </div>

                    <div>
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
                        className={`w-full p-3 border ${validationErrors.contactLastName ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      />
                      {validationErrors.contactLastName && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.contactLastName}</p>
                      )}
                    </div>

                    <div>
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
                        className={`w-full p-3 border ${validationErrors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      />
                      {validationErrors.contactEmail && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.contactEmail}</p>
                      )}
                    </div>

                    <div>
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
                        className={`w-full p-3 border ${validationErrors.contactPosition ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 bg-white`}
                        required
                      />
                      {validationErrors.contactPosition && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.contactPosition}</p>
                      )}
                    </div>
                  </div>

                  {/* Information Box */}
                  <div className="mt-6 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          After registration, we&apos;ll send an invitation email to this address to complete your account setup.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('company')}
                      className="text-gray-700 bg-gray-100 py-2 px-6 rounded-md hover:bg-gray-200 transition-colors text-center font-medium"
                    >
                      Back to Company
                    </button>
                    <button
                      type="button"
                      className="bg-[#FF8A00] text-white py-2 px-6 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        // Check if company fields are filled
                        const companyFieldsValid = validateCompanyFields();

                        if (!companyFieldsValid) {
                          e.preventDefault();
                          setError('Please complete the required Company Information fields before submitting.');
                          setShowContactTabCompanyError(true);
                          return;
                        }

                        // If company fields are valid, submit the form
                        handleSubmit(e as any);
                      }}
                    >
                      {isSubmitting ? 'Registering...' : 'Register Company'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <Link href="/login" className="text-[#FF8A00] hover:text-[#e67e00]">Log in</Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nordic Loop 2025
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
