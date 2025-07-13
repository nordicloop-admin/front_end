"use client";

import React from 'react';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';
import { CreditCard, Award, Info } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  return (
    <div className="p-5">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
        <p className="text-gray-500 mt-1">
          View and manage your Nordic Loop Marketplace subscription
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Subscription Manager */}
        <div className="lg:col-span-2">
          <SubscriptionManager />
        </div>

        {/* Sidebar - Subscription Benefits */}
        <div className="space-y-5">
          {/* Plan Benefits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0088CC] to-[#0077B5] p-4 text-white">
              <h3 className="font-medium flex items-center">
                <Award className="mr-2" size={18} />
                Plan Benefits
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Standard Plan</h4>
                    <p className="text-xs text-gray-500">
                      Access to all basic features, up to 10 active auctions, and standard customer support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">2</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Premium Plan</h4>
                    <p className="text-xs text-gray-500">
                      Unlimited auctions, featured listings, priority customer support, and detailed analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00A36C] to-[#00875A] p-4 text-white">
              <h3 className="font-medium flex items-center">
                <CreditCard className="mr-2" size={18} />
                Payment Information
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">
                We accept various payment methods including credit cards, bank transfers, and PayPal. All transactions are secure and encrypted.
              </p>
              <div className="mt-3 text-xs text-gray-500">
                For billing inquiries, please contact our support team at <a href="mailto:billing@nordicloop.com" className="text-[#FF8A00] hover:underline">billing@nordicloop.com</a>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#6B7280] to-[#4B5563] p-4 text-white">
              <h3 className="font-medium flex items-center">
                <Info className="mr-2" size={18} />
                Help & Support
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">
                Need help with your subscription? Our support team is available Monday to Friday, 9 AM - 5 PM CET.
              </p>
              <div className="mt-3">
                <a 
                  href="/support" 
                  className="text-sm text-[#FF8A00] hover:underline"
                >
                  Visit our Support Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
