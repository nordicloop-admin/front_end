"use client";

import React, { useState } from 'react';
import { CreditCard, History, Calendar, Settings } from 'lucide-react';
import BankAccountSetup from '@/components/payments/BankAccountSetup';
import TransactionHistory from '@/components/payments/TransactionHistory';
import PayoutSchedule from '@/components/payments/PayoutSchedule';

type TabType = 'account' | 'transactions' | 'payouts';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');

  const tabs = [
    { key: 'transactions' as TabType, label: 'Transaction History', icon: History },
    { key: 'payouts' as TabType, label: 'Payout Schedule', icon: Calendar },
    { key: 'account' as TabType, label: 'Payment Account', icon: CreditCard },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">
          Manage your payment account, view transaction history, and track payouts
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-[#FF8A00] text-[#FF8A00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'account' && (
          <BankAccountSetup className="w-full" />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionHistory className="w-full" />
        )}
        
        {activeTab === 'payouts' && (
          <PayoutSchedule className="w-full" />
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <Settings className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h3 className="font-medium mb-2">Payment Information</h3>
            <ul className="space-y-1">
              <li>• Set up your bank account to receive payments from sales</li>
              <li>• All payments are processed securely through Stripe</li>
              <li>• Payouts are processed manually by our admin team</li>
              <li>• Commission rates depend on your subscription plan</li>
              <li>• Contact support if you need help with payments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
