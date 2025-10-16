"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiPost } from '@/services/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ActivationSetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const token = searchParams?.get('token') || '';
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [error,setError]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  // Resend functionality intentionally omitted on this page (only available on verification page)

  useEffect(()=>{ if(!email || !token) router.push('/register'); },[email,token,router]);
  // No resend countdown effect needed

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    setError(null);
    if(password.length<8) { setError('Password must be at least 8 characters'); return; }
    if(password!==confirm){ setError('Passwords do not match'); return; }
    setLoading(true);
    const resp = await apiPost<{message:string;success?:boolean}>(
      '/users/activate-set-password/',
      { email, token, password, confirm_password: confirm },
      false
    );
    if(resp.error){ setError(resp.error); }
    else if(resp.data){ setSuccess(true); setTimeout(()=>router.push('/login'),1500); }
    setLoading(false);
  };

  // Resend handler removed

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden md:flex md:w-1/2 bg-[#1E2A36] text-white p-10 flex-col justify-between">
        <div className="mt-4">
          <Image src="/nordic logo.png" alt="Nordic Loop Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">Create Password</h1>
          <p className="text-gray-300 mt-4 text-base md:text-lg leading-relaxed">Choose a secure password to finish activating your account.</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
        <div className="md:hidden mb-10 flex items-center justify-between">
          <Image src="/nordic logo.png" alt="Nordic Loop Logo" width={110} height={36} className="object-contain" />
          <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Support</Link>
        </div>
        <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Set Your Password</h2>
            <p className="text-gray-500 mt-2 text-center">Finalize your account activation.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (<div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">{error}</div>)}
            {success && (<div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm">Password set successfully! Redirecting...</div>)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={email} disabled className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword? 'text':'password'}
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={()=>setShowPassword(p=>!p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword? 'Hide password':'Show password'}
                >
                  {showPassword? <FiEyeOff className="h-5 w-5"/> : <FiEye className="h-5 w-5"/>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm? 'text':'password'}
                  value={confirm}
                  onChange={e=>setConfirm(e.target.value)}
                  required
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={()=>setShowConfirm(p=>!p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirm? 'Hide confirm password':'Show confirm password'}
                >
                  {showConfirm? <FiEyeOff className="h-5 w-5"/> : <FiEye className="h-5 w-5"/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={`w-full bg-[#FF8A00] text-white py-3 rounded-lg font-medium transition-colors hover:bg-[#e67e00] ${loading?'opacity-70':''}`}>{loading?'Saving...':'Set Password'}</button>
            <div className="text-center text-sm text-gray-600">
              Need help? <Link href="/contact" className="text-[#FF8A00] hover:text-[#e67e00] font-medium">Contact Support</Link>
            </div>
          </form>
        </div>
        <div className="mt-auto pt-8 pb-2 text-xs text-gray-400 text-center">© {new Date().getFullYear()} Nordic Loop</div>
      </div>
    </div>
  );
};
export default ActivationSetPasswordPage;
