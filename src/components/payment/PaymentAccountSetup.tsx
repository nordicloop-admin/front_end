/**
 * Payment Account Setup Component
 * Handles complete Stripe Connect onboarding flow
 */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  CreditCard,
  Building2,
  Loader2
} from 'lucide-react';
import { 
  getAccountStatus, 
  createPaymentAccount, 
  createOnboardingLink, 
  getDashboardLink
} from '@/services/payment';

interface AccountStatus {
  company_id: number;
  company_name: string;
  payment_ready: boolean;
  stripe_onboarding_complete: boolean;
  stripe_capabilities_complete: boolean;
  account_info: {
    exists: boolean;
    account_id?: string | null;
    charges_enabled: boolean;
    details_submitted: boolean;
    payouts_enabled: boolean;
    requirements: string[];
    capabilities: {
      card_payments?: string;
      transfers?: string;
    };
    country?: string;
    email?: string;
    type?: string;
    error?: string;
  };
}

const PaymentAccountSetup: React.FC = () => {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountStatus();
  }, []);

  const fetchAccountStatus = async () => {
    try {
      setLoading(true);
      
      const response = await getAccountStatus();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setAccountStatus(response.data);
      }
    } catch (_err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createStripeAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await createPaymentAccount();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // If onboarding URL is provided, redirect immediately to Stripe
        if (response.data.onboarding_url) {
          setSuccess('Payment account created! Redirecting to Stripe setup...');
          // Small delay to show the success message, then redirect
          setTimeout(() => {
            if (response.data?.onboarding_url) {
              window.location.href = response.data.onboarding_url;
            }
          }, 1500);
        } else {
          // Fallback: show success and refresh status
          setSuccess('Payment account created successfully!');
          setTimeout(() => {
            fetchAccountStatus();
          }, 1000);
        }
      }
    } catch (_err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startOnboarding = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await createOnboardingLink();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        window.location.href = response.data.onboarding_url;
      }
    } catch (_err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const openDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDashboardLink();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        window.open(response.data.dashboard_url, '_blank');
      }
    } catch (_err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {loading && !accountStatus ? (
        <div className="bg-white border border-gray-100 rounded-md p-12 flex flex-col items-center justify-center">
          <Loader2 size={32} className="text-[#FF8A00] animate-spin mb-4" />
          <p className="text-gray-500">Loading payment setup...</p>
        </div>
      ) : (
        <>
          {/* Account Status Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start">
                <div className="h-14 w-14 bg-[#FF8A00]/10 rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-[#FF8A00]" />
                </div>
                <div className="ml-5">
                  <h2 className="text-lg font-medium text-gray-800">Payment Account Setup</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {accountStatus?.company_name || 'Set up your payment account to receive funds from winning auctions'}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              {accountStatus?.payment_ready ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle size={14} className="mr-1" />
                  Ready for Payments
                </span>
              ) : accountStatus?.account_info.exists ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Clock size={14} className="mr-1" />
                  Setup Required
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  <AlertTriangle size={14} className="mr-1" />
                  Not Created
                </span>
              )}
            </div>

            {/* Account Details */}
            {accountStatus?.account_info.exists ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Capabilities */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${accountStatus.account_info.charges_enabled ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {accountStatus.account_info.charges_enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Accept Payments</p>
                        <p className="text-xs text-gray-500">
                          {accountStatus.account_info.charges_enabled ? 'Active' : 'Pending Setup'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payout Capabilities */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${accountStatus.account_info.payouts_enabled ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {accountStatus.account_info.payouts_enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Receive Payouts</p>
                        <p className="text-xs text-gray-500">
                          {accountStatus.account_info.payouts_enabled ? 'Active' : 'Pending Setup'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Onboarding Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${accountStatus.stripe_onboarding_complete ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {accountStatus.stripe_onboarding_complete ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Account Information</p>
                        <p className="text-xs text-gray-500">
                          {accountStatus.stripe_onboarding_complete ? 'Complete' : 'Incomplete'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Ready Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${accountStatus.payment_ready ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {accountStatus.payment_ready ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Ready for Auctions</p>
                        <p className="text-xs text-gray-500">
                          {accountStatus.payment_ready ? 'Ready to receive payments' : 'Not ready yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                {accountStatus.account_info.account_id && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Account ID:</span> {accountStatus.account_info.account_id}
                      </div>
                      {accountStatus.account_info.country && (
                        <div>
                          <span className="font-medium">Country:</span> {accountStatus.account_info.country.toUpperCase()}
                        </div>
                      )}
                      {accountStatus.account_info.type && (
                        <div>
                          <span className="font-medium">Type:</span> {accountStatus.account_info.type}
                        </div>
                      )}
                      {accountStatus.account_info.email && (
                        <div>
                          <span className="font-medium">Email:</span> {accountStatus.account_info.email}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {accountStatus.account_info.requirements && accountStatus.account_info.requirements.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Action Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Complete the following requirements to activate your payment account:
                        </p>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                          {accountStatus.account_info.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              • {req.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Payment Account Found</h3>
                <p className="text-gray-500 mb-6">
                  Create a secure Stripe account to start receiving payments from your auction wins.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                {!accountStatus?.account_info.exists ? (
                  <button
                    onClick={createStripeAccount}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-[#FF8A00] text-white rounded-md font-medium hover:bg-[#e67e00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Building2 className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Creating...' : 'Create Payment Account'}
                  </button>
                ) : accountStatus.payment_ready ? (
                  <button
                    onClick={openDashboard}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-[#FF8A00] text-white rounded-md font-medium hover:bg-[#e67e00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Opening...' : 'Manage Payment Account'}
                  </button>
                ) : (
                  <button
                    onClick={startOnboarding}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-[#FF8A00] text-white rounded-md font-medium hover:bg-[#e67e00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Opening...' : 'Complete Account Setup'}
                  </button>
                )}

                {accountStatus?.account_info.exists && (
                  <button
                    onClick={openDashboard}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-4 w-4" />
                    )}
                    Open Stripe Dashboard
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                All payments are processed securely through Stripe Connect
              </p>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <div className="flex items-start">
              <div className="h-14 w-14 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-800">Payment Information</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Learn how payments work on Nordic Loop Marketplace
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                <p className="text-sm text-gray-700">
                  <strong>Secure Processing:</strong> All payments are processed securely through Stripe Connect
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                <p className="text-sm text-gray-700">
                  <strong>Direct Deposits:</strong> Receive payments directly to your business bank account
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                <p className="text-sm text-gray-700">
                  <strong>Automatic Payouts:</strong> Payments are transferred based on your payout schedule
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                <p className="text-sm text-gray-700">
                  <strong>Full Transparency:</strong> Complete transaction history and detailed reporting
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                <p className="text-sm text-gray-700">
                  <strong>Commission Rates:</strong> Low fees depend on your subscription plan
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentAccountSetup;