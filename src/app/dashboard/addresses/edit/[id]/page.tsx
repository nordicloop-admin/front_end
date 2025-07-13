"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  MapPin, 
  Building, 
  Home, 
  Briefcase, 
  ChevronLeft, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Globe,
  Phone,
  User,
  Loader2
} from 'lucide-react';
import { 
  getUserAddressById, 
  updateUserAddress, 
  Address 
} from '@/services/userAddresses';

// Country options for select dropdown
const countries = [
  'Sweden', 'Norway', 'Finland', 'Denmark', 'Germany', 
  'United Kingdom', 'France', 'Spain', 'Italy', 'Netherlands',
  'Belgium', 'Poland', 'Austria', 'Switzerland', 'United States'
];

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const addressId = params.id as string;
  
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'shipping',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'Sweden',
    is_primary: false,
    contact_name: '',
    contact_phone: ''
  });

  // Fetch address data on component mount
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setIsLoading(true);
        const response = await getUserAddressById(addressId);
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          const address = response.data as Address;
          setFormData({
            type: address.type || 'shipping',
            address_line1: address.address_line1 || '',
            address_line2: address.address_line2 || '',
            city: address.city || '',
            postal_code: address.postal_code || '',
            country: address.country || 'Sweden',
            is_primary: address.is_primary || false,
            contact_name: address.contact_name || '',
            contact_phone: address.contact_phone || ''
          });
        }
      } catch (_err) {
        setError('Failed to load address data');
      } finally {
        setIsLoading(false);
      }
    };

    if (addressId) {
      fetchAddress();
    }
  }, [addressId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle address type selection
  const handleTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Basic validation
    if (!formData.address_line1 || !formData.city || !formData.postal_code || !formData.country) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await updateUserAddress(Number(addressId), formData);
      
      if (response.error) {
        setError(response.error);
        setIsSubmitting(false);
      } else {
        // Navigate back to addresses list on success
        router.push('/dashboard/addresses');
      }
    } catch (_error) {
      setError('Failed to update address');
      setIsSubmitting(false);
    }
  };

  // Get icon based on address type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shipping':
        return <Home className="h-6 w-6" />;
      case 'billing':
        return <Building className="h-6 w-6" />;
      case 'business':
        return <Briefcase className="h-6 w-6" />;
      default:
        return <MapPin className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-[#FF8A00] animate-spin mb-4" />
        <p className="text-gray-500">Loading address data...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/dashboard/addresses')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">Edit Address</h1>
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

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FF8A00]" 
                  style={{ width: `${(activeStep / 3) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <div 
                  className={`flex flex-col items-center ${activeStep >= 1 ? 'text-[#FF8A00]' : 'text-gray-400'}`}
                  onClick={() => setActiveStep(1)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeStep >= 1 ? 'bg-[#FF8A00] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {activeStep > 1 ? <Check size={16} /> : '1'}
                  </div>
                  <span className="text-xs mt-1">Type</span>
                </div>
                <div 
                  className={`flex flex-col items-center ${activeStep >= 2 ? 'text-[#FF8A00]' : 'text-gray-400'}`}
                  onClick={() => activeStep > 1 ? setActiveStep(2) : null}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeStep >= 2 ? 'bg-[#FF8A00] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {activeStep > 2 ? <Check size={16} /> : '2'}
                  </div>
                  <span className="text-xs mt-1">Address</span>
                </div>
                <div 
                  className={`flex flex-col items-center ${activeStep >= 3 ? 'text-[#FF8A00]' : 'text-gray-400'}`}
                  onClick={() => activeStep > 2 ? setActiveStep(3) : null}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeStep >= 3 ? 'bg-[#FF8A00] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className="text-xs mt-1">Contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Address Type */}
          {activeStep === 1 && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">What type of address is this?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`
                    border rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105
                    ${formData.type === 'shipping' 
                      ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleTypeSelect('shipping')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mb-4
                      ${formData.type === 'shipping' ? 'bg-[#FF8A00]' : 'bg-gray-100'}
                    `}>
                      <Home className={formData.type === 'shipping' ? 'text-white' : 'text-gray-500'} size={32} />
                    </div>
                    <h3 className="text-base font-medium">Shipping Address</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Where your purchases will be delivered
                    </p>
                  </div>
                </div>
                
                <div 
                  className={`
                    border rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105
                    ${formData.type === 'billing' 
                      ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleTypeSelect('billing')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mb-4
                      ${formData.type === 'billing' ? 'bg-[#FF8A00]' : 'bg-gray-100'}
                    `}>
                      <Building className={formData.type === 'billing' ? 'text-white' : 'text-gray-500'} size={32} />
                    </div>
                    <h3 className="text-base font-medium">Billing Address</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Used for invoices and payment details
                    </p>
                  </div>
                </div>
                
                <div 
                  className={`
                    border rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105
                    ${formData.type === 'business' 
                      ? 'border-[#FF8A00] bg-orange-50 ring-1 ring-[#FF8A00]' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleTypeSelect('business')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mb-4
                      ${formData.type === 'business' ? 'bg-[#FF8A00]' : 'bg-gray-100'}
                    `}>
                      <Briefcase className={formData.type === 'business' ? 'text-white' : 'text-gray-500'} size={32} />
                    </div>
                    <h3 className="text-base font-medium">Business Address</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Your company or organization location
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#E67E00] transition-colors"
                  onClick={() => setActiveStep(2)}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Address Details */}
          {activeStep === 2 && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${formData.type === 'shipping' ? 'bg-blue-100' : 
                    formData.type === 'billing' ? 'bg-purple-100' : 'bg-orange-100'}
                `}>
                  {getTypeIcon(formData.type)}
                </div>
                <h2 className="text-lg font-medium">
                  {formData.type === 'shipping' ? 'Shipping' : 
                   formData.type === 'billing' ? 'Billing' : 'Business'} Address Details
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    placeholder="Street address, P.O. box, company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2 || ''}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe size={16} className="text-gray-400" />
                    </div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      required
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_primary"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                  />
                  <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-700">
                    Set as primary address
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveStep(1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#E67E00] transition-colors"
                  onClick={() => setActiveStep(3)}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Contact Information */}
          {activeStep === 3 && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${formData.type === 'shipping' ? 'bg-blue-100' : 
                    formData.type === 'billing' ? 'bg-purple-100' : 'bg-orange-100'}
                `}>
                  {getTypeIcon(formData.type)}
                </div>
                <h2 className="text-lg font-medium">Contact Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF8A00] focus:border-[#FF8A00] sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveStep(2)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#E67E00] transition-colors flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Address'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
        
        {/* Preview panel */}
        <div className="bg-gray-50 border-t border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Address Preview</h3>
          
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-start">
              <div className="mr-3">
                {getTypeIcon(formData.type)}
              </div>
              
              <div>
                <div className="flex items-center">
                  <h4 className="text-sm font-medium">
                    {formData.type === 'shipping' ? 'Shipping' : 
                     formData.type === 'billing' ? 'Billing' : 'Business'} Address
                  </h4>
                  {formData.is_primary && (
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                
                {formData.address_line1 && (
                  <div className="text-sm text-gray-700 mt-1">
                    {formData.address_line1}
                    {formData.address_line2 && <span>, {formData.address_line2}</span>}
                  </div>
                )}
                
                {(formData.city || formData.postal_code) && (
                  <div className="text-sm text-gray-700">
                    {formData.city}{formData.city && formData.postal_code && ', '}{formData.postal_code}
                  </div>
                )}
                
                {formData.country && (
                  <div className="text-sm text-gray-700">
                    {formData.country}
                  </div>
                )}
                
                {formData.contact_name && (
                  <div className="mt-2 text-xs text-gray-500">
                    Contact: {formData.contact_name}
                    {formData.contact_phone && <span>, {formData.contact_phone}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
