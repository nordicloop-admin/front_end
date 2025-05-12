"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const SignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // For testing purposes, we'll decode the token directly in the browser
    const verifyToken = () => {
      if (!token) {
        setError('Invalid invitation link. Please contact support.');
        setIsVerifying(false);
        return;
      }

      try {
        // Decode the token (in a real app, this would be done securely on the server)
        const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString());

        // Check if the token has expired
        if (decodedToken.exp < Date.now()) {
          throw new Error('Invitation link has expired');
        }

        // Set the email from the token
        setEmail(decodedToken.email);
        setIsVerifying(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid invitation link. Please contact support.');
        setIsVerifying(false);
      }
    };

    // Simulate a short delay to show the loading state
    setTimeout(verifyToken, 1000);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // For testing purposes, we'll simulate a successful sign-up
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect directly to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/nordic-infinity-logo.svg"
              alt="Nordic Loop Logo"
              width={64}
              height={64}
              priority
              className="mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying invitation...</h2>
          <p className="text-gray-500">Please wait while we verify your invitation link.</p>
        </div>
      </div>
    );
  }

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

      {/* Right Side - White Background with Sign-Up Form */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-10 pt-20 md:pt-10 flex flex-col min-h-screen">
        {/* Sign-Up Form Container - Centered */}
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Complete Your Registration</h2>
            <p className="text-gray-500">Set your password to access your account</p>
          </div>

          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                disabled
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 pr-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
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

export default SignUpPage;
