"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SECTOR_CHOICES, COUNTRY_CHOICES, CompanyRegistration } from '@/types/auth';
import { registerCompany } from '@/services/company';
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

    // Primary Contact Person Information
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPosition: '',

    // Secondary Contact Person Information (Optional)
    contact2FirstName: '',
    contact2LastName: '',
    contact2Email: '',
    contact2Position: '',
  });

  // State for success message
  const [successMessage, setSuccessMessage] = useState('');
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

    // Primary Contact validation
    if (!formData.contactFirstName.trim()) errors.contactFirstName = 'First name is required';
    if (!formData.contactLastName.trim()) errors.contactLastName = 'Last name is required';
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    if (!formData.contactPosition.trim()) errors.contactPosition = 'Position is required';

    // Secondary Contact validation (only if any field is filled)
    const hasSecondaryContact =
      formData.contact2FirstName.trim() ||
      formData.contact2LastName.trim() ||
      formData.contact2Email.trim() ||
      formData.contact2Position.trim();

    if (hasSecondaryContact) {
      // If any secondary contact field is filled, validate all fields
      if (!formData.contact2FirstName.trim()) errors.contact2FirstName = 'First name is required';
      if (!formData.contact2LastName.trim()) errors.contact2LastName = 'Last name is required';
      if (!formData.contact2Email.trim()) {
        errors.contact2Email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.contact2Email)) {
        errors.contact2Email = 'Please enter a valid email address';
      }
      if (!formData.contact2Position.trim()) errors.contact2Position = 'Position is required';
    }

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
    const contactFieldsWithErrors = [
      'contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition',
      'contact2FirstName', 'contact2LastName', 'contact2Email', 'contact2Position'
    ];

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
    setSuccessMessage('');

    try {
      // Prepare the company registration data with the new API format
      const companyRegistrationData: CompanyRegistration = {
        official_name: formData.companyName,
        vat_number: formData.vatNumber,
        email: formData.email || undefined,
        website: formData.website || undefined,
        country: formData.country,
        sector: formData.sector,

        // Primary contact person
        primary_first_name: formData.contactFirstName,
        primary_last_name: formData.contactLastName,
        primary_email: formData.contactEmail,
        primary_position: formData.contactPosition,

        status: 'pending'
      };

      // Add second contact person data if provided
      const hasSecondaryContact =
        formData.contact2FirstName.trim() ||
        formData.contact2LastName.trim() ||
        formData.contact2Email.trim() ||
        formData.contact2Position.trim();

      if (hasSecondaryContact) {
        companyRegistrationData.secondary_first_name = formData.contact2FirstName;
        companyRegistrationData.secondary_last_name = formData.contact2LastName;
        companyRegistrationData.secondary_email = formData.contact2Email;
        companyRegistrationData.secondary_position = formData.contact2Position;
      }

      // Register the company
      const response = await registerCompany(companyRegistrationData);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('Failed to register company. Please try again.');
      }

      // Backend now sends OTP to primary contact; move to activation verify step
      setSuccessMessage('Company registered. Verification code sent to primary contact email...');

      setTimeout(() => {
        router.push(`/activate/verify?email=${encodeURIComponent(formData.contactEmail)}`);
      }, 1200);
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
            href="/contact"
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
          {/* Logo and Welcome Text */}
          <div className="text-center mb-8 w-full max-w-3xl">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <Image
                  src="/favicon_io/logo.png"
                  alt="Nordic Loop Logo"
                  width={96}
                  height={96}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">Register Your Company</h2>
            <p className="text-gray-500">Please enter your company details</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            {error && !showContactTabCompanyError && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {/* Card Container */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {/* Company Tab */}
                <button
                  type="button"
                  className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors relative ${
                    activeTab === 'company'
                      ? 'border-b-[3px] border-[#FF8A00]'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => {
                    setActiveTab('company');
                    setShowContactTabCompanyError(false);
                    setError('');
                  }}
                >
                  <span className="flex items-center justify-center">
                    <svg className={`w-5 h-5 mr-2 ${activeTab === 'company' ? 'text-[#FF8A00]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className={activeTab === 'company' ? 'text-[#FF8A00]' : ''}>Company Information</span>

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
                      ? 'border-b-[3px] border-[#FF8A00]'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => {
                    setActiveTab('contact');
                    setError('');
                  }}
                >
                  <span className="flex items-center justify-center">
                    <svg className={`w-5 h-5 mr-2 ${activeTab === 'contact' ? 'text-[#FF8A00]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className={activeTab === 'contact' ? 'text-[#FF8A00]' : ''}>Contact Person</span>

                    {/* Error indicator for Contact tab */}
                    {Object.keys(validationErrors).some(key =>
                      ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition',
                       'contact2FirstName', 'contact2LastName', 'contact2Email', 'contact2Position'].includes(key)
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
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
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
                        className={`w-full p-3 border ${validationErrors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
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
                        className={`w-full p-3 border ${validationErrors.vatNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
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
                        className={`w-full p-3 border ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
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
                        className={`w-full p-3 border ${validationErrors.website ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
                      />
                      {validationErrors.website && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.website}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country*
                      </label>
                      <div className="relative">
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className={`w-full p-3 border ${validationErrors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white appearance-none`}
                          required
                        >
                          <option value="">Select a country</option>
                          {COUNTRY_CHOICES.map(country => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                      {validationErrors.country && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.country}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                        Sector*
                      </label>
                      <div className="relative">
                        <select
                          id="sector"
                          name="sector"
                          value={formData.sector}
                          onChange={handleChange}
                          className={`w-full p-3 border ${validationErrors.sector ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white appearance-none`}
                          required
                        >
                          <option value="">Select a sector</option>
                          {SECTOR_CHOICES.map(sector => (
                            <option key={sector.value} value={sector.value}>
                              {sector.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                      {validationErrors.sector && (
                        <p className="mt-1 text-xs text-red-500">{validationErrors.sector}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="bg-[#FF8A00] text-white py-3 px-8 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
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
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
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
                    ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPosition',
                     'contact2FirstName', 'contact2LastName', 'contact2Email', 'contact2Position'].includes(key)
                  ) && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-1">Please correct the following errors:</h4>
                      <ul className="list-disc pl-5 text-xs text-red-700 space-y-1">
                        {/* Primary Contact Errors */}
                        {validationErrors.contactFirstName && <li>{validationErrors.contactFirstName}</li>}
                        {validationErrors.contactLastName && <li>{validationErrors.contactLastName}</li>}
                        {validationErrors.contactEmail && <li>{validationErrors.contactEmail}</li>}
                        {validationErrors.contactPosition && <li>{validationErrors.contactPosition}</li>}

                        {/* Secondary Contact Errors */}
                        {validationErrors.contact2FirstName && <li>{validationErrors.contact2FirstName}</li>}
                        {validationErrors.contact2LastName && <li>{validationErrors.contact2LastName}</li>}
                        {validationErrors.contact2Email && <li>{validationErrors.contact2Email}</li>}
                        {validationErrors.contact2Position && <li>{validationErrors.contact2Position}</li>}
                      </ul>
                    </div>
                  )}

                  {/* Primary Contact Person */}
                  <div className="mb-8">
                    <h3 className="text-base font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">Primary Contact Person</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
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
                          placeholder="Enter first name"
                          className={`w-full p-3 border ${validationErrors.contactFirstName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
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
                          placeholder="Enter last name"
                          className={`w-full p-3 border ${validationErrors.contactLastName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
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
                          placeholder="Enter email"
                          className={`w-full p-3 border ${validationErrors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
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
                          placeholder="Enter position"
                          className={`w-full p-3 border ${validationErrors.contactPosition ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
                          required
                        />
                        {validationErrors.contactPosition && (
                          <p className="mt-1 text-xs text-red-500">{validationErrors.contactPosition}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Contact Person (Optional) */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-800 pb-2 border-b border-gray-200 w-full">
                        Secondary Contact Person <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                        <label htmlFor="contact2FirstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          id="contact2FirstName"
                          name="contact2FirstName"
                          type="text"
                          value={formData.contact2FirstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          className={`w-full p-3 border ${validationErrors.contact2FirstName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
                        />
                        {validationErrors.contact2FirstName && (
                          <p className="mt-1 text-xs text-red-500">{validationErrors.contact2FirstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contact2LastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          id="contact2LastName"
                          name="contact2LastName"
                          type="text"
                          value={formData.contact2LastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          className={`w-full p-3 border ${validationErrors.contact2LastName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
                        />
                        {validationErrors.contact2LastName && (
                          <p className="mt-1 text-xs text-red-500">{validationErrors.contact2LastName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contact2Email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          id="contact2Email"
                          name="contact2Email"
                          type="email"
                          value={formData.contact2Email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          className={`w-full p-3 border ${validationErrors.contact2Email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
                        />
                        {validationErrors.contact2Email && (
                          <p className="mt-1 text-xs text-red-500">{validationErrors.contact2Email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contact2Position" className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          id="contact2Position"
                          name="contact2Position"
                          type="text"
                          value={formData.contact2Position}
                          onChange={handleChange}
                          placeholder="Enter position"
                          className={`w-full p-3 border ${validationErrors.contact2Position ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-gray-700 bg-white`}
                        />
                        {validationErrors.contact2Position && (
                          <p className="mt-1 text-xs text-red-500">{validationErrors.contact2Position}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Information Box */}
                  <div
                    className="mt-6 rounded-md border border-orange-200 bg-orange-50 px-4 py-3"
                    role="note"
                    aria-labelledby="registration-info-heading"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8A00] text-white text-xs font-semibold"
                      >
                        i
                      </span>
                      <div className="text-sm text-orange-900">
                        <p id="registration-info-heading" className="font-medium">Email Verification</p>
                        <p className="mt-1 leading-relaxed">
                          After registration we will send an invitation email to the primary contact to activate and complete the account setup.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('company')}
                      className="text-gray-700 bg-gray-100 py-3 px-8 rounded-md hover:bg-gray-200 transition-colors text-center font-medium"
                    >
                      Back to Company
                    </button>
                    <button
                      type="button"
                      className="bg-[#FF8A00] text-white py-3 px-8 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
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

            <div className="text-center text-sm text-gray-600 mt-6">
              Already have an account? <Link href="/login" className="text-[#FF8A00] hover:text-[#e67e00] font-medium">Log in</Link>
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
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
