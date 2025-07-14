"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Wallet, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { getUserSubscription, updateUserSubscription } from '@/services/userSubscription';

// Payment method types
type PaymentMethod = 'credit_card' | 'bank_transfer' | 'paypal';

// Mock payment methods for UI demonstration
// In a real implementation, these would come from an API
const mockPaymentMethods = [
  {
    id: '1',
    type: 'credit_card' as PaymentMethod,
    name: 'Visa ending in 4242',
    expiryDate: '12/2025',
    isDefault: true
  },
  {
    id: '2',
    type: 'bank_transfer' as PaymentMethod,
    name: 'Nordea Bank',
    accountNumber: '****3456',
    isDefault: false
  }
];

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<{
    type: PaymentMethod;
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
    bankName?: string;
    accountNumber?: string;
  }>({
    type: 'credit_card'
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
        }
      } catch (_error) {
        setError('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Handle setting a payment method as default
  const handleSetDefault = async (methodId: string) => {
    if (!subscription || isUpdating) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);
      
      // Find the selected payment method
      const selectedMethod = paymentMethods.find(method => method.id === methodId);
      if (!selectedMethod) return;
      
      // Update the subscription with the new payment method
      const updateData = {
        plan: subscription.plan,
        auto_renew: subscription.auto_renew,
        payment_method: selectedMethod.type,
        contact_name: subscription.contact_name,
        contact_email: subscription.contact_email
      };
      
      const response = await updateUserSubscription(updateData);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSubscription(response.data.subscription);
        
        // Update local payment methods to reflect the new default
        setPaymentMethods(prevMethods => 
          prevMethods.map(method => ({
            ...method,
            isDefault: method.id === methodId
          }))
        );
        
        setSuccess('Default payment method updated successfully');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (_error) {
      setError('Failed to update payment method');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle deleting a payment method
  const handleDelete = (methodId: string) => {
    // Don't allow deleting the default payment method
    const methodToDelete = paymentMethods.find(method => method.id === methodId);
    if (methodToDelete?.isDefault) {
      setError("You cannot delete your default payment method. Please set another method as default first.");
      return;
    }
    
    // Remove the payment method
    setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== methodId));
    setSuccess('Payment method removed successfully');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Handle adding a new payment method
  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new payment method object based on type
    let newMethod;
    
    if (newPaymentMethod.type === 'credit_card') {
      newMethod = {
        id: `${paymentMethods.length + 1}`,
        type: newPaymentMethod.type,
        name: `Card ending in ${newPaymentMethod.cardNumber?.slice(-4) || '****'}`,
        expiryDate: newPaymentMethod.expiryDate || '',
        isDefault: paymentMethods.length === 0
      };
    } else if (newPaymentMethod.type === 'bank_transfer') {
      newMethod = {
        id: `${paymentMethods.length + 1}`,
        type: newPaymentMethod.type,
        name: newPaymentMethod.bankName || 'Bank Account',
        accountNumber: `****${newPaymentMethod.accountNumber?.slice(-4) || '****'}`,
        isDefault: paymentMethods.length === 0
      };
    } else {
      // PayPal or other payment types - adding empty accountNumber to satisfy type requirements
      newMethod = {
        id: `${paymentMethods.length + 1}`,
        type: newPaymentMethod.type,
        name: 'PayPal Account',
        accountNumber: '',  // Empty string to satisfy the type requirement
        isDefault: paymentMethods.length === 0
      };
    }
    
    // Add the new method to the list
    setPaymentMethods([...paymentMethods, newMethod]);
    
    // Reset the form
    setNewPaymentMethod({ type: 'credit_card' });
    setShowAddForm(false);
    
    // Show success message
    setSuccess('Payment method added successfully');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Handle input change for the new payment method form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPaymentMethod(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-5">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/dashboard/subscriptions')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">Payment Methods</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md mb-5">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md mb-5">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      ) : (
        <>
          {/* Payment methods list */}
          <div className="bg-white border border-gray-100 rounded-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-700">Your Payment Methods</h2>
            </div>
            
            {paymentMethods.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {method.type === 'credit_card' && (
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <CreditCard className="text-blue-600" size={20} />
                          </div>
                        )}
                        {method.type === 'bank_transfer' && (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <Wallet className="text-green-600" size={20} />
                          </div>
                        )}
                        {method.type === 'paypal' && (
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <svg 
                              className="text-indigo-600" 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                d="M19.5 8.25C19.5 11.0784 17.0784 13.5 14.25 13.5H10.5L9 18H5.25C4.83579 18 4.5 17.6642 4.5 17.25V6.75C4.5 6.33579 4.83579 6 5.25 6H14.25C17.0784 6 19.5 8.42157 19.5 11.25V8.25Z" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm font-medium">{method.name}</div>
                          <div className="text-xs text-gray-500">
                            {method.type === 'credit_card' && method.expiryDate && `Expires ${method.expiryDate}`}
                            {method.type === 'bank_transfer' && method.accountNumber && `Account ${method.accountNumber}`}
                            {method.type === 'paypal' && 'PayPal Account'}
                          </div>
                        </div>
                        
                        {method.isDefault && (
                          <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <button 
                            onClick={() => handleSetDefault(method.id)}
                            disabled={isUpdating}
                            className="text-xs text-[#FF8A00] hover:text-[#e67e00] font-medium px-2 py-1 rounded hover:bg-orange-50 transition-colors"
                          >
                            {isUpdating ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              'Set Default'
                            )}
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(method.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No payment methods added yet.</p>
              </div>
            )}
            
            {!showAddForm && (
              <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Payment Method
                </button>
              </div>
            )}
          </div>
          
          {/* Add payment method form */}
          {showAddForm && (
            <div className="bg-white border border-gray-100 rounded-md overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-700">Add Payment Method</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddPaymentMethod} className="p-4">
                {/* Payment method type selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`
                      relative border rounded-md p-3 flex items-center justify-center cursor-pointer transition-all
                      ${newPaymentMethod.type === 'credit_card' 
                        ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      <input
                        type="radio"
                        name="type"
                        value="credit_card"
                        checked={newPaymentMethod.type === 'credit_card'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <CreditCard className={newPaymentMethod.type === 'credit_card' ? 'text-[#FF8A00]' : 'text-gray-400'} size={20} />
                        <span className="text-xs mt-1">Credit Card</span>
                      </div>
                    </label>
                    
                    <label className={`
                      relative border rounded-md p-3 flex items-center justify-center cursor-pointer transition-all
                      ${newPaymentMethod.type === 'bank_transfer' 
                        ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      <input
                        type="radio"
                        name="type"
                        value="bank_transfer"
                        checked={newPaymentMethod.type === 'bank_transfer'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <Wallet className={newPaymentMethod.type === 'bank_transfer' ? 'text-[#FF8A00]' : 'text-gray-400'} size={20} />
                        <span className="text-xs mt-1">Bank Transfer</span>
                      </div>
                    </label>
                    
                    <label className={`
                      relative border rounded-md p-3 flex items-center justify-center cursor-pointer transition-all
                      ${newPaymentMethod.type === 'paypal' 
                        ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      <input
                        type="radio"
                        name="type"
                        value="paypal"
                        checked={newPaymentMethod.type === 'paypal'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <svg 
                          className={newPaymentMethod.type === 'paypal' ? 'text-[#FF8A00]' : 'text-gray-400'} 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M19.5 8.25C19.5 11.0784 17.0784 13.5 14.25 13.5H10.5L9 18H5.25C4.83579 18 4.5 17.6642 4.5 17.25V6.75C4.5 6.33579 4.83579 6 5.25 6H14.25C17.0784 6 19.5 8.42157 19.5 11.25V8.25Z" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-xs mt-1">PayPal</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Credit Card Fields */}
                {newPaymentMethod.type === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={newPaymentMethod.cardNumber || ''}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={newPaymentMethod.cardName || ''}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={newPaymentMethod.expiryDate || ''}
                          onChange={handleInputChange}
                          placeholder="MM/YYYY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={newPaymentMethod.cvv || ''}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Bank Transfer Fields */}
                {newPaymentMethod.type === 'bank_transfer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={newPaymentMethod.bankName || ''}
                        onChange={handleInputChange}
                        placeholder="Nordea Bank"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={newPaymentMethod.accountNumber || ''}
                        onChange={handleInputChange}
                        placeholder="1234567890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                
                {/* PayPal Fields */}
                {newPaymentMethod.type === 'paypal' && (
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      You&apos;ll be redirected to PayPal to connect your account after clicking &quot;Add Payment Method&quot;.
                    </p>
                  </div>
                )}
                
                {/* Form Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF8A00] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#E67E00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Auto-renew settings */}
          {subscription && (
            <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-700">Auto-Renew Settings</h2>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Automatic Renewal</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {subscription.auto_renew 
                        ? 'Your subscription will automatically renew when it expires' 
                        : 'Your subscription will not renew automatically'}
                    </p>
                  </div>
                  
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={subscription.auto_renew}
                        onChange={async () => {
                          if (isUpdating) return;
                          
                          try {
                            setIsUpdating(true);
                            setError(null);
                            setSuccess(null);
                            
                            const updateData = {
                              plan: subscription.plan,
                              auto_renew: !subscription.auto_renew,
                              payment_method: subscription.payment_method,
                              contact_name: subscription.contact_name,
                              contact_email: subscription.contact_email
                            };
                            
                            const response = await updateUserSubscription(updateData);
                            
                            if (response.error) {
                              setError(response.error);
                            } else if (response.data) {
                              setSubscription(response.data.subscription);
                              setSuccess('Auto-renew settings updated successfully');
                              
                              // Hide success message after 3 seconds
                              setTimeout(() => {
                                setSuccess(null);
                              }, 3000);
                            }
                          } catch (_error) {
                            setError('Failed to update auto-renew settings');
                          } finally {
                            setIsUpdating(false);
                          }
                        }}
                        className="sr-only"
                        disabled={isUpdating}
                      />
                      <div className={`
                        block w-10 h-6 rounded-full transition-colors
                        ${isUpdating ? 'bg-gray-300' : subscription.auto_renew ? 'bg-[#FF8A00]' : 'bg-gray-300'}
                      `}></div>
                      <div className={`
                        absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform
                        ${subscription.auto_renew ? 'transform translate-x-4' : ''}
                      `}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
