"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Edit, 
  Save, 
  X, 
  Award, 
  Wallet, 
  Mail, 
  User
} from 'lucide-react';
import { 
  getUserSubscription, 
  updateUserSubscription, 
  UserSubscription, 
  SubscriptionUpdateRequest 
} from '@/services/userSubscription';

const SubscriptionManager: React.FC = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState<SubscriptionUpdateRequest>({
    plan: '',
    auto_renew: false,
    payment_method: '',
    contact_name: '',
    contact_email: ''
  });

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await getUserSubscription();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setSubscription(response.data);
          // Initialize form data with current subscription values
          setFormData({
            plan: response.data.plan,
            auto_renew: response.data.auto_renew,
            payment_method: response.data.payment_method,
            contact_name: response.data.contact_name,
            contact_email: response.data.contact_email
          });
        }
      } catch (_error) {
        setError('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const response = await updateUserSubscription(formData);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSubscription(response.data.subscription);
        setUpdateSuccess(true);
        setIsEditing(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (_error) {
      setError('Failed to update subscription');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (_e) {
      return dateString;
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && !subscription) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Award className="mr-2" size={20} />
              Subscription Management
            </h2>
            {subscription && (
              <p className="text-white/80 mt-1">
                {subscription.plan_display} Plan
              </p>
            )}
          </div>
          {subscription && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(subscription.status)}`}>
              {subscription.status_display}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {updateSuccess && (
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">Subscription updated successfully!</p>
          </div>
        </div>
      )}

      {/* Subscription details */}
      {subscription ? (
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subscription Plan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['free', 'standard', 'premium'].map((plan) => (
                    <label 
                      key={plan}
                      className={`
                        relative border rounded-lg p-4 cursor-pointer transition-all
                        ${formData.plan === plan 
                          ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan}
                        checked={formData.plan === plan}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {plan}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {plan === 'free' && 'Basic features'}
                            {plan === 'standard' && 'All essential features'}
                            {plan === 'premium' && 'All features + priority support'}
                          </p>
                        </div>
                        {formData.plan === plan && (
                          <CheckCircle className="text-[#FF8A00]" size={18} />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['credit_card', 'bank_transfer', 'paypal'].map((method) => (
                    <label 
                      key={method}
                      className={`
                        relative border rounded-lg p-4 cursor-pointer transition-all
                        ${formData.payment_method === method 
                          ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={formData.payment_method === method}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {method === 'credit_card' && <CreditCard className="mr-2 text-gray-500" size={18} />}
                          {method === 'bank_transfer' && <Wallet className="mr-2 text-gray-500" size={18} />}
                          {method === 'paypal' && <Wallet className="mr-2 text-gray-500" size={18} />}
                          <p className="text-sm font-medium text-gray-900">
                            {method === 'credit_card' && 'Credit Card'}
                            {method === 'bank_transfer' && 'Bank Transfer'}
                            {method === 'paypal' && 'PayPal'}
                          </p>
                        </div>
                        {formData.payment_method === method && (
                          <CheckCircle className="text-[#FF8A00]" size={18} />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auto-renew toggle */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="auto_renew"
                      checked={formData.auto_renew}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`
                      block w-10 h-6 rounded-full transition-colors
                      ${formData.auto_renew ? 'bg-[#FF8A00]' : 'bg-gray-300'}
                    `}></div>
                    <div className={`
                      absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform
                      ${formData.auto_renew ? 'transform translate-x-4' : ''}
                    `}></div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Auto-renew subscription</div>
                </label>
                <p className="text-xs text-gray-500 ml-13">
                  {formData.auto_renew 
                    ? 'Your subscription will automatically renew when it expires' 
                    : 'Your subscription will not renew automatically'}
                </p>
              </div>

              {/* Contact information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Contact Information</h3>
                
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500">Contact Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="text"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500">Contact Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                  disabled={isLoading}
                >
                  <X className="inline-block mr-1" size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF8A00] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#E67E00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="inline-block mr-1 animate-spin" size={16} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="inline-block mr-1" size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Plan details */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Award className="mr-2 text-[#FF8A00]" size={16} />
                      Plan Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Plan</span>
                        <span className="text-sm font-medium">{subscription.plan_display}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount</span>
                        <span className="text-sm font-medium">{subscription.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Auto-renew</span>
                        <span className="text-sm font-medium flex items-center">
                          {subscription.auto_renew ? (
                            <>
                              <CheckCircle className="text-green-500 mr-1" size={14} />
                              Enabled
                            </>
                          ) : (
                            <>
                              <X className="text-red-500 mr-1" size={14} />
                              Disabled
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment details */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <CreditCard className="mr-2 text-[#FF8A00]" size={16} />
                      Payment Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Method</span>
                        <span className="text-sm font-medium">{subscription.payment_method_display}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Payment</span>
                        <span className="text-sm font-medium">{formatDate(subscription.last_payment)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Subscription period */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Calendar className="mr-2 text-[#FF8A00]" size={16} />
                      Subscription Period
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Start Date</span>
                        <span className="text-sm font-medium">{formatDate(subscription.start_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">End Date</span>
                        <span className="text-sm font-medium">{formatDate(subscription.end_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <User className="mr-2 text-[#FF8A00]" size={16} />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Name</span>
                        <span className="text-sm font-medium">{subscription.contact_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="text-sm font-medium">{subscription.contact_email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#FF8A00] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#E67E00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  <Edit className="inline-block mr-1" size={16} />
                  Update Subscription
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500">No subscription information available.</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
