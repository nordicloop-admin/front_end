"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ComingSoonPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // State for notification form
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Go back to home page
  const goBack = () => {
    router.push('/');
  };

  // Handle notification form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!email) {
      setSubmitStatus({ success: false, message: 'Please enter your email' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ success: true, message: 'Thank you! We will notify you when we launch.' });
        setEmail('');
      } else {
        setSubmitStatus({ success: false, message: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Failed to connect to server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-10 relative w-[180px] h-[48px] mx-auto">
          <Image
            src="/nordic logo.png"
            alt="Nordic Loop Logo"
            fill
            sizes="180px"
            className="object-contain"
            priority
            loading="eager"
          />
        </div>

        {/* Coming Soon Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E2A36] mb-4">
          Coming Soon
        </h1>

        <div className="w-24 h-1 bg-[#FF8A00] mx-auto mb-6"></div>

        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          We're working hard to bring you something amazing. This page is under construction.
        </p>

        {/* Countdown Timer */}
        <div className="flex justify-center space-x-6 md:space-x-10 mb-12">
          <div className="flex flex-col items-center">
            <div className="text-[#1E2A36] text-3xl md:text-4xl font-bold border-b-2 border-[#FF8A00] pb-1 w-16 md:w-20 text-center">
              {countdown.days}
            </div>
            <span className="text-sm mt-3 text-gray-600 font-medium">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[#1E2A36] text-3xl md:text-4xl font-bold border-b-2 border-[#FF8A00] pb-1 w-16 md:w-20 text-center">
              {countdown.hours.toString().padStart(2, '0')}
            </div>
            <span className="text-sm mt-3 text-gray-600 font-medium">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[#1E2A36] text-3xl md:text-4xl font-bold border-b-2 border-[#FF8A00] pb-1 w-16 md:w-20 text-center">
              {countdown.minutes.toString().padStart(2, '0')}
            </div>
            <span className="text-sm mt-3 text-gray-600 font-medium">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[#1E2A36] text-3xl md:text-4xl font-bold border-b-2 border-[#FF8A00] pb-1 w-16 md:w-20 text-center">
              {countdown.seconds.toString().padStart(2, '0')}
            </div>
            <span className="text-sm mt-3 text-gray-600 font-medium">Seconds</span>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border border-gray-200 p-8 rounded-lg mb-10 max-w-md mx-auto shadow-sm bg-white">
          <h3 className="text-xl font-medium text-[#1E2A36] mb-2">Get Notified When We Launch</h3>
          <p className="text-gray-500 mb-6 text-sm">Be the first to know when we go live.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Notify Me'}
            </button>

            {submitStatus && (
              <div className={`mt-2 text-sm ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={goBack}
          className="mt-2 border border-[#FF8A00] text-[#FF8A00] hover:bg-[#FF8A00] hover:text-white transition-colors font-medium flex items-center justify-center mx-auto px-6 py-2 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
