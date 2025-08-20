"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Check, AlertCircle, CreditCard, Building, Edit2, X, Clock } from 'lucide-react';
import { setupBankAccount, getUserStripeAccount, StripeAccount, BankAccountSetup } from '@/services/payments';

interface BankAccountSetupProps {
  onSetupComplete?: (account: StripeAccount) => void;
  className?: string;
}

export default function BankAccountSetup({ onSetupComplete, className = '' }: BankAccountSetupProps) {
  const [formData, setFormData] = useState<BankAccountSetup>({
    account_holder_name: '',
    account_number: '',
    routing_number: '',
    bank_name: '',
    bank_country: 'SE',
    currency: 'SEK'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [existingAccount, setExistingAccount] = useState<StripeAccount | null>(null);
  const [isCheckingAccount, setIsCheckingAccount] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkExistingAccount();
  }, []);

  const checkExistingAccount = async () => {
    try {
      const account = await getUserStripeAccount();
      setExistingAccount(account);
    } catch (error) {
      // Error occurred while checking account (not just "no account found")
      console.error('Error checking existing account:', error);
      setExistingAccount(null);
      toast.error('Failed to check existing account', {
        description: 'Please refresh the page and try again'
      });
    } finally {
      setIsCheckingAccount(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    if (existingAccount) {
      // Pre-populate form with existing data
      setFormData({
        account_holder_name: '',
        account_number: '',
        routing_number: '',
        bank_name: existingAccount.bank_name || '',
        bank_country: existingAccount.bank_country || 'SE',
        currency: 'SEK'
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      account_holder_name: '',
      account_number: '',
      routing_number: '',
      bank_name: '',
      bank_country: 'SE',
      currency: 'SEK'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await setupBankAccount(formData);
      
      if (result.success && result.stripe_account) {
        toast.success(isEditing ? 'Bank account updated successfully!' : 'Bank account setup successful!', {
          description: isEditing ? 'Your payment account has been updated.' : 'Your payment account has been created and is being verified.'
        });
        setExistingAccount(result.stripe_account);
        setIsEditing(false);
        onSetupComplete?.(result.stripe_account);
      } else {
        toast.error('Setup failed', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Setup failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountStatusInfo = (status: string | null | undefined) => {
    // Handle null/undefined status
    if (!status) {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: <Clock className="w-5 h-5" />,
        message: 'Account setup in progress. Verification may take 1-2 business days.',
        displayStatus: 'Setting Up'
      };
    }

    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: <Check className="w-5 h-5" />,
          message: 'Your account is active and ready to receive payments',
          displayStatus: 'Active'
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: <Clock className="w-5 h-5" />,
          message: 'Your account is being verified. This may take 1-2 business days',
          displayStatus: 'Pending Verification'
        };
      case 'restricted':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: <AlertCircle className="w-5 h-5" />,
          message: 'Your account needs additional information. Please contact support',
          displayStatus: 'Restricted'
        };
      case 'inactive':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: <AlertCircle className="w-5 h-5" />,
          message: 'Your account is inactive. Please contact support',
          displayStatus: 'Inactive'
        };
      default:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          icon: <Clock className="w-5 h-5" />,
          message: 'Account setup in progress. Verification may take 1-2 business days.',
          displayStatus: 'Setting Up'
        };
    }
  };

  if (isCheckingAccount) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      </div>
    );
  }

  if (existingAccount && !isEditing) {
    const statusInfo = getAccountStatusInfo(existingAccount.account_status);
    const isAccountActive = existingAccount.account_status === 'active';
    const hasAccountDetails = existingAccount.bank_name || existingAccount.bank_account_last4;

    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 text-[#FF8A00] mr-3" />
            <h2 className="text-xl font-semibold">Payment Account</h2>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={16} className="mr-2" />
            Edit Account
          </button>
        </div>

        {/* Status Display */}
        <div className={`p-4 rounded-lg ${statusInfo.bgColor} mb-6`}>
          <div className={`flex items-center ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="ml-2 font-medium">
              {statusInfo.displayStatus}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{statusInfo.message}</p>
        </div>

        {/* Account Details - Only show when account is active or has meaningful data */}
        {(isAccountActive || hasAccountDetails) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Account Details</h3>
            <div className="space-y-2">
              {existingAccount.bank_name && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bank:</span>
                  <span className="text-sm font-medium">{existingAccount.bank_name}</span>
                </div>
              )}
              {existingAccount.bank_account_last4 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account ending in:</span>
                  <span className="text-sm font-mono">****{existingAccount.bank_account_last4}</span>
                </div>
              )}
              {existingAccount.stripe_account_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account ID:</span>
                  <span className="text-xs font-mono text-gray-500">
                    {existingAccount.stripe_account_id.length >= 12
                      ? existingAccount.stripe_account_id.slice(-12)
                      : existingAccount.stripe_account_id
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Capabilities - Only show when account is active */}
        {isAccountActive && (
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 mb-3">Account Capabilities</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Accept Payments:</span>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">Enabled</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Receive Payouts:</span>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Progress - Show when account is not active */}
        {!isAccountActive && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Setup Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Bank account information submitted</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Account verification in progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                <span className="text-sm text-gray-500">Payment capabilities will be enabled</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building className="w-6 h-6 text-[#FF8A00] mr-3" />
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Payment Account' : 'Set Up Payment Account'}
          </h2>
        </div>
        {isEditing && (
          <button
            onClick={handleCancelEdit}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
        )}
      </div>

      {/* Welcome message for new users */}
      {!isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Start Receiving Payments</h3>
              <p className="text-sm text-blue-800 mb-3">
                Set up your bank account to receive payments from buyers when you sell materials.
                This is required to participate as a seller in the marketplace.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Secure processing through Stripe Connect</li>
                <li>• Automatic payouts to your bank account</li>
                <li>• Commission rates based on your subscription plan</li>
                <li>• Full transaction history and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-600 mb-6">
        {isEditing
          ? 'Update your bank account information. This will replace your current payment account.'
          : 'Complete the form below to connect your bank account. All information is encrypted and securely stored.'
        }
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="account_holder_name" className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name *
          </label>
          <input
            type="text"
            id="account_holder_name"
            name="account_holder_name"
            value={formData.account_holder_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            placeholder="Full name as it appears on your bank account"
          />
        </div>

        <div>
          <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name *
          </label>
          <input
            type="text"
            id="bank_name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            placeholder="e.g., Swedbank, SEB, Nordea"
          />
        </div>

        <div>
          <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number *
          </label>
          <input
            type="text"
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            placeholder="Your bank account number"
          />
        </div>

        <div>
          <label htmlFor="routing_number" className="block text-sm font-medium text-gray-700 mb-1">
            Routing Number (if applicable)
          </label>
          <input
            type="text"
            id="routing_number"
            name="routing_number"
            value={formData.routing_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            placeholder="Bank routing number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bank_country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="bank_country"
              name="bank_country"
              value={formData.bank_country}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            >
              <option value="SE">Sweden</option>
              <option value="NO">Norway</option>
              <option value="DK">Denmark</option>
              <option value="FI">Finland</option>
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency *
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
            >
              <option value="SEK">SEK</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Secure Processing</p>
              <p>Your banking information is securely processed and stored by Stripe, our payment processor. We never store your full account details on our servers.</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF8A00] text-white py-2 px-4 rounded-md hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              {isEditing ? 'Updating account...' : 'Setting up account...'}
            </div>
          ) : (
            isEditing ? 'Update Payment Account' : 'Set Up Payment Account'
          )}
        </button>
      </form>
    </div>
  );
}
