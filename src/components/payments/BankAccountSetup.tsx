"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Check, AlertCircle, CreditCard, Building } from 'lucide-react';
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

  useEffect(() => {
    checkExistingAccount();
  }, []);

  const checkExistingAccount = async () => {
    try {
      const account = await getUserStripeAccount();
      setExistingAccount(account);
    } catch (error) {
      // No existing account found, which is fine
      setExistingAccount(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await setupBankAccount(formData);
      
      if (result.success && result.stripe_account) {
        toast.success('Bank account setup successful!', {
          description: 'Your payment account has been created and is being verified.'
        });
        setExistingAccount(result.stripe_account);
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

  const getAccountStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: <Check className="w-5 h-5" />,
          message: 'Your account is active and ready to receive payments'
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: <AlertCircle className="w-5 h-5" />,
          message: 'Your account is being verified. This may take 1-2 business days'
        };
      case 'restricted':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: <AlertCircle className="w-5 h-5" />,
          message: 'Your account needs additional information. Please contact support'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: <AlertCircle className="w-5 h-5" />,
          message: 'Account status unknown'
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

  if (existingAccount) {
    const statusInfo = getAccountStatusInfo(existingAccount.account_status);
    
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <CreditCard className="w-6 h-6 text-[#FF8A00] mr-3" />
          <h2 className="text-xl font-semibold">Payment Account</h2>
        </div>

        <div className={`p-4 rounded-lg ${statusInfo.bgColor} mb-4`}>
          <div className={`flex items-center ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="ml-2 font-medium">
              {existingAccount.account_status.charAt(0).toUpperCase() + existingAccount.account_status.slice(1)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{statusInfo.message}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Account ID:</span>
            <span className="font-mono text-sm">{existingAccount.stripe_account_id.slice(-12)}</span>
          </div>
          {existingAccount.bank_name && (
            <div className="flex justify-between">
              <span className="text-gray-600">Bank:</span>
              <span>{existingAccount.bank_name}</span>
            </div>
          )}
          {existingAccount.bank_account_last4 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Account ending in:</span>
              <span>****{existingAccount.bank_account_last4}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Payments enabled:</span>
            <span className={existingAccount.charges_enabled ? 'text-green-600' : 'text-red-600'}>
              {existingAccount.charges_enabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payouts enabled:</span>
            <span className={existingAccount.payouts_enabled ? 'text-green-600' : 'text-red-600'}>
              {existingAccount.payouts_enabled ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Building className="w-6 h-6 text-[#FF8A00] mr-3" />
        <h2 className="text-xl font-semibold">Set Up Payment Account</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Set up your bank account to receive payments from sales. This information is securely processed by Stripe.
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
              Setting up account...
            </div>
          ) : (
            'Set Up Payment Account'
          )}
        </button>
      </form>
    </div>
  );
}
