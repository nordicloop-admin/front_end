'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyOtp, requestPasswordReset } from '@/services/passwordReset';
import { FiLock } from 'react-icons/fi';

export const VerifyOtpPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Redirect to forgot password page if no email is provided
    if (!email) {
      router.push('/forgot-password');
    }
  }, [email, router]);

  useEffect(() => {
    // Countdown for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOtp({ email, otp });
      
      if (response.error) {
        setError(response.error);
      } else if (response.data?.success && response.data?.token) {
        // Redirect to reset password page with email and token
        router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&token=${encodeURIComponent(response.data.token)}`);
      } else {
        setError('Invalid OTP code. Please try again.');
      }
    } catch (_error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestPasswordReset({ email });
      
      if (response.error) {
        setError(response.error);
      } else {
        // Start cooldown for 60 seconds
        setResendCooldown(60);
      }
    } catch (_error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="hidden sm:flex justify-between items-center mb-8">
          <Link
            href="/forgot-password"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to email form
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
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Verify OTP Code</h2>
          <p className="text-gray-500 mt-2">Enter the one-time password (OTP) sent to your email address.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  disabled
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-100 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP Code
              </label>
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-gray-700 transition-colors"
                  placeholder="Enter OTP code"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#FF8A00] text-white py-3 px-4 rounded-lg hover:bg-[#e67e00] transition-colors text-center font-medium shadow-sm ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Need help?{' '}
              <Link href="/contact" className="text-[#FF8A00] hover:text-[#e67e00] transition-colors font-medium">
                Contact Support
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isLoading}
              className={`w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium shadow-sm ${
                resendCooldown > 0 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
