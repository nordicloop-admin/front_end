"use client";

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Save,
  ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  // General Settings
  const [siteName, setSiteName] = useState('Nordic Loop');
  const [siteDescription, setSiteDescription] = useState('B2B Waste Marketplace');
  const [supportEmail, setSupportEmail] = useState('support@nordicloop.se');
  const [adminEmail, setAdminEmail] = useState('admin@nordicloop.se');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [defaultCurrency, setDefaultCurrency] = useState('SEK');
  const [timeZone, setTimeZone] = useState('Europe/Stockholm');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserNotifications, setNewUserNotifications] = useState(true);
  const [newListingNotifications, setNewListingNotifications] = useState(true);
  const [newBidNotifications, setNewBidNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [loginAttempts, setLoginAttempts] = useState(5);

  // Payment Settings
  const [commissionRateFree, setCommissionRateFree] = useState(9);
  const [commissionRateStandard, setCommissionRateStandard] = useState(7);
  const [commissionRatePremium, setCommissionRatePremium] = useState(0);
  const [standardPlanPrice, setStandardPlanPrice] = useState(599);
  const [premiumPlanPrice, setPremiumPlanPrice] = useState(799);

  // Active tab state
  const [activeTab, setActiveTab] = useState('general');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save the settings to the backend
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
            <nav className="space-y-1">
              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'general'
                    ? 'bg-[#FF8A00] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('general')}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>General</span>
                <ChevronRight className="ml-auto h-5 w-5" />
              </button>

              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'notifications'
                    ? 'bg-[#FF8A00] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-3 h-5 w-5" />
                <span>Notifications</span>
                <ChevronRight className="ml-auto h-5 w-5" />
              </button>

              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'security'
                    ? 'bg-[#FF8A00] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-3 h-5 w-5" />
                <span>Security</span>
                <ChevronRight className="ml-auto h-5 w-5" />
              </button>

              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === 'payment'
                    ? 'bg-[#FF8A00] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('payment')}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                <span>Payment & Plans</span>
                <ChevronRight className="ml-auto h-5 w-5" />
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit}>
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                          Site Name
                        </label>
                        <input
                          type="text"
                          id="siteName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Site Description
                        </label>
                        <input
                          type="text"
                          id="siteDescription"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={siteDescription}
                          onChange={(e) => setSiteDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Support Email
                        </label>
                        <input
                          type="email"
                          id="supportEmail"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          id="adminEmail"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                          Default Language
                        </label>
                        <select
                          id="defaultLanguage"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={defaultLanguage}
                          onChange={(e) => setDefaultLanguage(e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="sv">Swedish</option>
                          <option value="no">Norwegian</option>
                          <option value="fi">Finnish</option>
                          <option value="da">Danish</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                          Default Currency
                        </label>
                        <select
                          id="defaultCurrency"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={defaultCurrency}
                          onChange={(e) => setDefaultCurrency(e.target.value)}
                        >
                          <option value="SEK">Swedish Krona (SEK)</option>
                          <option value="NOK">Norwegian Krone (NOK)</option>
                          <option value="DKK">Danish Krone (DKK)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="USD">US Dollar (USD)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
                          Time Zone
                        </label>
                        <select
                          id="timeZone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={timeZone}
                          onChange={(e) => setTimeZone(e.target.value)}
                        >
                          <option value="Europe/Stockholm">Stockholm (GMT+1)</option>
                          <option value="Europe/Oslo">Oslo (GMT+1)</option>
                          <option value="Europe/Copenhagen">Copenhagen (GMT+1)</option>
                          <option value="Europe/Helsinki">Helsinki (GMT+2)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                        Enable Email Notifications
                      </label>
                    </div>

                    <div className="pl-6 space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newUserNotifications"
                          className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                          checked={newUserNotifications}
                          onChange={(e) => setNewUserNotifications(e.target.checked)}
                          disabled={!emailNotifications}
                        />
                        <label htmlFor="newUserNotifications" className="ml-2 block text-sm text-gray-700">
                          New User Registrations
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newListingNotifications"
                          className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                          checked={newListingNotifications}
                          onChange={(e) => setNewListingNotifications(e.target.checked)}
                          disabled={!emailNotifications}
                        />
                        <label htmlFor="newListingNotifications" className="ml-2 block text-sm text-gray-700">
                          New Marketplace Listings
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newBidNotifications"
                          className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                          checked={newBidNotifications}
                          onChange={(e) => setNewBidNotifications(e.target.checked)}
                          disabled={!emailNotifications}
                        />
                        <label htmlFor="newBidNotifications" className="ml-2 block text-sm text-gray-700">
                          New Bids
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="paymentNotifications"
                          className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                          checked={paymentNotifications}
                          onChange={(e) => setPaymentNotifications(e.target.checked)}
                          disabled={!emailNotifications}
                        />
                        <label htmlFor="paymentNotifications" className="ml-2 block text-sm text-gray-700">
                          Payment Events
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="twoFactorAuth"
                        className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      />
                      <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                        Require Two-Factor Authentication for Admin Users
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          id="passwordExpiry"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={passwordExpiry}
                          onChange={(e) => setPasswordExpiry(parseInt(e.target.value))}
                          min="0"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Set to 0 for no expiry
                        </p>
                      </div>

                      <div>
                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          id="sessionTimeout"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                          min="5"
                        />
                      </div>

                      <div>
                        <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          id="loginAttempts"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                          value={loginAttempts}
                          onChange={(e) => setLoginAttempts(parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment & Subscription Plans</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-3">Commission Rates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="commissionRateFree" className="block text-sm font-medium text-gray-700 mb-1">
                            Free Plan Commission (%)
                          </label>
                          <input
                            type="number"
                            id="commissionRateFree"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                            value={commissionRateFree}
                            onChange={(e) => setCommissionRateFree(parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <label htmlFor="commissionRateStandard" className="block text-sm font-medium text-gray-700 mb-1">
                            Standard Plan Commission (%)
                          </label>
                          <input
                            type="number"
                            id="commissionRateStandard"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                            value={commissionRateStandard}
                            onChange={(e) => setCommissionRateStandard(parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <label htmlFor="commissionRatePremium" className="block text-sm font-medium text-gray-700 mb-1">
                            Premium Plan Commission (%)
                          </label>
                          <input
                            type="number"
                            id="commissionRatePremium"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                            value={commissionRatePremium}
                            onChange={(e) => setCommissionRatePremium(parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-3">Subscription Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="standardPlanPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Standard Plan Price (SEK)
                          </label>
                          <input
                            type="number"
                            id="standardPlanPrice"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                            value={standardPlanPrice}
                            onChange={(e) => setStandardPlanPrice(parseInt(e.target.value))}
                            min="0"
                          />
                        </div>

                        <div>
                          <label htmlFor="premiumPlanPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Premium Plan Price (SEK)
                          </label>
                          <input
                            type="number"
                            id="premiumPlanPrice"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                            value={premiumPlanPrice}
                            onChange={(e) => setPremiumPlanPrice(parseInt(e.target.value))}
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF8A00] hover:bg-[#e67e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
