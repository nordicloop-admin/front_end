"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowLeft, Save, RefreshCw, AlertCircle, CheckCircle, Building, Home, Briefcase } from 'lucide-react';
import { createUserAddress, AddressCreateRequest } from '@/services/userAddresses';

export default function NewAddress() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<AddressCreateRequest>({
    type: 'business',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
    is_primary: false,
    contact_name: '',
    contact_phone: ''
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await createUserAddress(formData);
      
      if (response.error) {
        setError(response.error);
        setIsSubmitting(false);
      } else {
        setSuccess('Address added successfully!');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard/addresses');
        }, 1500);
      }
    } catch (_err) {
      setError('Failed to add address');
      setIsSubmitting(false);
    }
  };

  // Address type options
  const addressTypes = [
    { value: 'business', label: 'Business', icon: <Briefcase size={18} className="mr-2" /> },
    { value: 'shipping', label: 'Shipping', icon: <MapPin size={18} className="mr-2" /> },
    { value: 'billing', label: 'Billing', icon: <Home size={18} className="mr-2" /> }
  ];

  return (
    <div className="p-5">
      <div className="mb-5">
        <Link 
          href="/dashboard/addresses" 
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Addresses
        </Link>
      </div>
      
      <h1 className="text-xl font-medium mb-5">Add New Address</h1>
      
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
      
      <div className="bg-white border border-gray-100 rounded-md shadow-sm">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Address Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {addressTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors
                      ${formData.type === type.value 
                        ? 'bg-[#FF8A00]/10 border-[#FF8A00] text-[#FF8A00]' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as 'business' | 'shipping' | 'billing' }))}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Line 1 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                  placeholder="Street address, P.O. box, company name"
                />
              </div>
              
              {/* Address Line 2 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
              
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Country */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                  placeholder="+46 70 123 4567"
                />
              </div>
              
              {/* Set as Primary */}
              <div className="col-span-2">
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
            </div>
            
            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <Link
                href="/dashboard/addresses"
                className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    Adding Address...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Add Address
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
