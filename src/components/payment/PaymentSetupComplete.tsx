/**
 * Payment Setup Completion Page
 * Shown after user returns from Stripe onboarding
 */
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAccountStatus, AccountStatusResponse } from '@/services/payment';

const PaymentSetupComplete: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'complete' | 'pending' | 'error'>('checking');
  const [_accountStatus, setAccountStatus] = useState<AccountStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      const response = await getAccountStatus();

      if (response.error) {
        setStatus('error');
        setError(response.error);
      } else if (response.data) {
        setAccountStatus(response.data);
        
        if (response.data.payment_ready) {
          setStatus('complete');
        } else if (response.data.account_info.details_submitted) {
          setStatus('pending');
        } else {
          setStatus('error');
          setError('Onboarding was not completed successfully');
        }
      }
    } catch (_err) {
      setStatus('error');
      setError('Failed to check account status');
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const goToPayments = () => {
    router.push('/dashboard/payments');
  };

  const retrySetup = () => {
    router.push('/dashboard/payments/setup');
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md mx-4 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Checking your account status...</h3>
            <p className="text-gray-600 text-center">
              We&apos;re verifying your payment setup with Stripe
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-lg mx-4 bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="flex items-center text-red-600 text-xl font-semibold">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Setup Incomplete
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                There was an issue completing your payment account setup. Please try again.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={retrySetup} 
                  className="px-4 py-2 bg-[#FF8A00] hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Retry Setup
                </button>
                <button 
                  onClick={goToDashboard}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-lg mx-4 bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="flex items-center text-yellow-600 text-xl font-semibold">
              <Clock className="h-6 w-6 mr-2" />
              Setup In Progress
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Account Under Review</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account information has been submitted and is being reviewed by Stripe. 
                    This process typically takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                We&apos;ll notify you once your account is ready to receive payments.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={goToPayments} 
                  className="px-4 py-2 bg-[#FF8A00] hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Payment Dashboard
                </button>
                <button 
                  onClick={goToDashboard}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // status === 'complete'
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-lg mx-4 bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="flex items-center text-green-600 text-xl font-semibold">
            <CheckCircle className="h-6 w-6 mr-2" />
            Payment Setup Complete!
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Congratulations!
            </h3>
            <p className="text-green-700">
              Your payment account is now ready to receive payments from winning auctions.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">What&apos;s next?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                You can now create and publish auctions
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Payments will be automatically transferred to your bank account
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Track all transactions in your payment dashboard
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Manage your account settings through Stripe
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={goToDashboard} 
              className="flex-1 px-4 py-2 bg-[#FF8A00] hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Dashboard
            </button>
            <button 
              onClick={goToPayments}
              className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            >
              View Payments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetupComplete;