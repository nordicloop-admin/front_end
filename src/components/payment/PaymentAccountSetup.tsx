/**
 * Payment Account Setup Component
 * Handles complete Stripe Connect onboarding flow
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
    account_id?: string;
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
        // Map the new API response to the existing interface
        const mappedData: AccountStatus = {
          company_id: 0,
          company_name: '',
          payment_ready: response.data.is_ready_for_payments,
          stripe_onboarding_complete: response.data.details_submitted,
          stripe_capabilities_complete: response.data.charges_enabled && response.data.payouts_enabled,
          account_info: {
            exists: response.data.has_stripe_account,
            account_id: response.data.account_id || undefined,
            charges_enabled: response.data.charges_enabled,
            payouts_enabled: response.data.payouts_enabled,
            details_submitted: response.data.details_submitted,
            requirements: response.data.requirements?.currently_due || [],
            capabilities: {
              card_payments: response.data.charges_enabled ? 'active' : 'pending',
              transfers: response.data.payouts_enabled ? 'active' : 'pending'
            }
          }
        };
        setAccountStatus(mappedData);
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

  if (loading && !accountStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading payment setup...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building2 className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Payment Account Setup</h2>
          <p className="text-gray-600">Set up your payment account to receive funds from winning auctions</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Account Status</span>
            {accountStatus?.payment_ready ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">Setup Complete</Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Setup Required</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!accountStatus?.account_info.exists ? (
            <div className="text-center space-y-4">
              <div className="text-gray-500">
                You haven&apos;t created a payment account yet
              </div>
              <Button 
                onClick={createStripeAccount}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Building2 className="mr-2 h-4 w-4" />
                )}
                Create Payment Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${accountStatus.account_info.details_submitted ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {accountStatus.account_info.details_submitted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">Account Information</div>
                  <div className="text-sm text-gray-500">
                    {accountStatus.account_info.details_submitted ? 'Completed' : 'Incomplete'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${accountStatus.account_info.charges_enabled ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {accountStatus.account_info.charges_enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">Accept Payments</div>
                  <div className="text-sm text-gray-500">
                    {accountStatus.account_info.charges_enabled ? 'Active' : 'Pending'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${accountStatus.account_info.payouts_enabled ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {accountStatus.account_info.payouts_enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">Receive Payouts</div>
                  <div className="text-sm text-gray-500">
                    {accountStatus.account_info.payouts_enabled ? 'Active' : 'Pending'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${accountStatus.payment_ready ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {accountStatus.payment_ready ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">Ready for Auctions</div>
                  <div className="text-sm text-gray-500">
                    {accountStatus.payment_ready ? 'Ready' : 'Not Ready'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountStatus?.account_info.requirements && accountStatus.account_info.requirements.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Action Required</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {accountStatus.account_info.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-2 flex-shrink-0" />
                    {req.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {accountStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {!accountStatus.payment_ready ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center space-y-4">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">Create Your Payment Account</h3>
                      <p className="text-gray-500 mt-1">
                        Start by creating a secure Stripe account to receive payments from your auctions.
                      </p>
                    </div>
                    {accountStatus.account_info.exists ? (
                      <Button 
                        onClick={startOnboarding}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ExternalLink className="mr-2 h-4 w-4" />
                        )}
                        Complete Setup
                      </Button>
                    ) : (
                      <Button 
                        onClick={createStripeAccount}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        Create Payment Account
                      </Button>
                    )}
                    <div className="text-xs text-gray-400">
                      You&apos;ll be redirected to Stripe to complete your account setup
                    </div>
                  </div>
                </div>

                {accountStatus.account_info.exists && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={openDashboard}
                      disabled={loading}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Stripe Dashboard
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-green-800">Payment Setup Complete!</h3>
                  <p className="text-green-600 mt-1">
                    Your payment account is ready to receive payments from auctions.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={openDashboard}
                  disabled={loading}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Payment Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">Set up your bank account to receive payments from winning auctions</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">All payments are processed securely through Stripe</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">Receive payments directly to your business bank account</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">Full transaction history and reporting available</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentAccountSetup;