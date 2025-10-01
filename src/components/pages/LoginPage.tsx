"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is coming from a successful signup
    if (searchParams.get('signup') === 'success') {
      setSuccessMessage('Your account has been created successfully. Please log in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Call the login function from the auth context
      const result = await login(email, password);

      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        // Display error message
        setError(result.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Dark Blue Background with Tagline */}
      <div className="hidden md:flex md:w-1/2 bg-[#1E2A36] text-white p-10 flex-col justify-between">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            The Marketplace Where Waste Becomes A Resource
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Nordic Loop Connects Businesses To Trade Surplus Materials,<br />
            Reducing Costs, Cutting CO<sub>2</sub> Emissions, And Driving<br />
            Sustainability.
          </p>
        </div>
      </div>

      {/* Mobile-only dark header */}
      <div className="md:hidden w-full bg-[#1E2A36] text-white p-6 absolute top-0 left-0 right-0 flex items-center">
        <Image
          src="/nordic logo.png"
          alt="Nordic Loop Logo"
          width={100}
          height={32}
          className="object-contain"
        />
      </div>

      {/* Right Side - White Background with Login Form */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-10 pt-20 md:pt-10 flex flex-col min-h-screen">
        {/* Top Navigation - Hidden on very small screens */}
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

        {/* Login Form Container - Centered */}
        <div className="flex-grow flex flex-col justify-center items-center max-w-md mx-auto w-full px-4 sm:px-0">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 mb-3">
              <Image
                src="/nordic-infinity-logo.svg"
                alt="Nordic Loop Logo"
                width={80}
                height={80}
                priority
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to Nordic Loop</h2>
            <p className="text-gray-500 mt-2">Please enter your details</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="personal email"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-gray-700 transition-colors"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-gray-700 transition-colors"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <Link href="/forgot-password" className="text-sm text-[#FF8A00] hover:text-[#e67e00] transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-lg hover:bg-[#e67e00] transition-colors text-center font-medium shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Continue'}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don&apos;t Have An Account?{' '}
                <Link href="/register" className="text-[#FF8A00] hover:text-[#e67e00] transition-colors font-medium">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 pb-2 flex justify-between items-center text-sm text-gray-500">
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

export default LoginPage;
