"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiLock } from 'react-icons/fi';
import { apiPost } from '@/services/api';

export const ActivationVerifyPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => { if (!email) router.push('/register'); }, [email, router]);
  useEffect(() => { if (resendCooldown>0){ const t=setTimeout(()=>setResendCooldown(resendCooldown-1),1000); return ()=>clearTimeout(t);} }, [resendCooldown]);

  const verifyActivation = async () => {
    return apiPost<{message:string;success?:boolean;token?:string}>(
      '/users/verify-activation-otp/',
      { email, otp },
      false
    );
  };
  const resendActivation = async () => {
    return apiPost<{message:string;success?:boolean}>(
      '/users/request-activation-otp/',
      { email },
      false
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    const resp = await verifyActivation();
    if (resp.error || !resp.data?.token){
      setError(resp.error || 'Invalid or expired code');
    } else {
      // forward to password creation page with token
      router.push(`/activate/set-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resp.data.token!)}`);
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown>0) return;
    setIsLoading(true); setError(null);
    const resp = await resendActivation();
    if (resp.error) setError(resp.error); else setResendCooldown(60);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Brand / illustration column (desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[#1E2A36] text-white p-10 flex-col justify-between">
        <div className="mt-4">
          <Image src="/nordic logo.png" alt="Nordic Loop Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">Verify & Continue</h1>
          <p className="text-gray-300 mt-4 text-base md:text-lg leading-relaxed">For security, we sent a one‑time code to your email. Enter it to proceed.</p>
        </div>
      </div>
      {/* Form column */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden mb-10 flex items-center justify-between">
          <Image src="/nordic logo.png" alt="Nordic Loop Logo" width={110} height={36} className="object-contain" />
          <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Support</Link>
        </div>
        <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Activate Your Account</h2>
            <p className="text-gray-500 mt-2 text-center">Enter the verification code we emailed to you.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={email} disabled className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <div className="relative">
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  placeholder="6-digit code"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#FF8A00] text-white py-3 rounded-lg font-medium transition-colors hover:bg-[#e67e00] ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className={`w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors hover:bg-gray-50 ${resendCooldown > 0 || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
            </button>
            <div className="text-center text-sm text-gray-600">
              Need help?{' '}
              <Link href="/contact" className="text-[#FF8A00] hover:text-[#e67e00] font-medium">Contact Support</Link>
            </div>
          </form>
        </div>
        <div className="mt-auto pt-8 pb-2 text-xs text-gray-400 text-center">© {new Date().getFullYear()} Nordic Loop</div>
      </div>
    </div>
  );
};

export default ActivationVerifyPage;
