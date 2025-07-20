'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { requestPasswordReset } from '@/services/passwordReset';

export const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestPasswordReset({ email });
      
      if (response.error) {
        setError(response.error);
      } else {
        // Always show success message even if email doesn't exist (security best practice)
        setSuccess(true);
        
        // After 3 seconds, redirect to OTP verification page
        setTimeout(() => {
          router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
        }, 3000);
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
            href="/login"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
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
          <h2 className="text-2xl font-semibold text-gray-900">Reset your password</h2>
          <p className="text-gray-500 mt-2">Enter your email address and we&apos;ll send you a one-time password (OTP) to reset your password.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {success ? (
            <div className="mb-5 p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm">
              <p className="font-medium mb-1">Check your email</p>
              <p>
                If an account exists with this email, we&apos;ve sent you an OTP code. 
                You&apos;ll be redirected to the verification page shortly.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-gray-700 transition-colors"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Need help?{' '}
              <Link href="/contact" className="text-[#FF8A00] hover:text-[#e67e00] transition-colors font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
