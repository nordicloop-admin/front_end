"use client";

import { useState, useEffect } from 'react';
import { Building, Shield, Save, X, RefreshCw, AlertCircle, CheckCircle, MapPin, Plus, Trash2, Edit, Check } from 'lucide-react';
import { getUserProfile, updateUserProfile, changePassword, UserProfile, ProfileUpdateRequest, PasswordChangeRequest } from '@/services/userProfile';
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress, setPrimaryAddress, Address, AddressCreateRequest } from '@/services/userAddresses';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Address-related state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Address form state
  const [addressFormData, setAddressFormData] = useState<AddressCreateRequest>({
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
  
  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getUserProfile();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setProfile(response.data);
          setFormData({
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (_err) {
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        setAddressError(null);
        
        const response = await getUserAddresses();
        
        if (response.error) {
          setAddressError(response.error);
        } else if (response.data) {
          setAddresses(response.data.addresses || []);
        }
      } catch (_err) {
        setAddressError('Failed to load address data');
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    
    if (activeTab === 'company') {
      fetchAddresses();
    }
  }, [activeTab]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle address form input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle address form submission
  const handleAddressSubmit = async () => {
    if (isSavingAddress) return;
    
    try {
      setIsSavingAddress(true);
      setAddressError(null);
      setAddressSuccess(null);
      
      // Validate required fields
      if (!addressFormData.address_line1 || !addressFormData.city || 
          !addressFormData.postal_code || !addressFormData.country || 
          !addressFormData.contact_name || !addressFormData.contact_phone) {
        setAddressError('Please fill in all required fields');
        setIsSavingAddress(false);
        return;
      }
      
      let response;
      
      if (editingAddressId) {
        // Update existing address
        response = await updateUserAddress(editingAddressId, addressFormData);
      } else {
        // Create new address
        response = await createUserAddress(addressFormData);
      }
      
      if (response.error) {
        setAddressError(response.error);
      } else if (response.data) {
        // Refresh addresses list
        const addressesResponse = await getUserAddresses();
        if (addressesResponse.data) {
          setAddresses(addressesResponse.data.addresses || []);
        }
        
        setAddressSuccess(editingAddressId ? 'Address updated successfully' : 'Address added successfully');
        setShowAddressForm(false);
        setEditingAddressId(null);
        
        // Reset form
        setAddressFormData({
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
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setAddressSuccess(null);
        }, 3000);
      }
    } catch (_err) {
      setAddressError('An error occurred while saving the address');
    } finally {
      setIsSavingAddress(false);
    }
  };
  
  // Handle edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    setAddressFormData({
      type: address.type,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
      is_primary: address.is_primary,
      contact_name: address.contact_name,
      contact_phone: address.contact_phone
    });
  };
  
  // Handle delete address
  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setIsSavingAddress(true);
      setAddressError(null);
      
      const response = await deleteUserAddress(addressId);
      
      if (response.error) {
        setAddressError(response.error);
      } else {
        // Remove from local state
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        setAddressSuccess('Address deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setAddressSuccess(null);
        }, 3000);
      }
    } catch (_err) {
      setAddressError('An error occurred while deleting the address');
    } finally {
      setIsSavingAddress(false);
    }
  };
  
  // Handle set primary address
  const handleSetPrimary = async (addressId: number) => {
    try {
      setIsSavingAddress(true);
      setAddressError(null);
      
      const response = await setPrimaryAddress(addressId);
      
      if (response.error) {
        setAddressError(response.error);
      } else if (response.data) {
        // Update addresses list with new primary status
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          is_primary: addr.id === addressId
        })));
        
        setAddressSuccess('Primary address updated');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setAddressSuccess(null);
        }, 3000);
      }
    } catch (_err) {
      setAddressError('An error occurred while updating primary address');
    } finally {
      setIsSavingAddress(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      // Check if we're on the security tab and changing password
      if (activeTab === 'security' && 
          formData.currentPassword && 
          formData.newPassword && 
          formData.confirmPassword) {
        
        // Handle password change
        setIsChangingPassword(true);
        
        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New password and confirmation do not match');
          setIsSaving(false);
          setIsChangingPassword(false);
          return;
        }
        
        // Validate password requirements
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(formData.newPassword)) {
          setError('New password does not meet the requirements');
          setIsSaving(false);
          setIsChangingPassword(false);
          return;
        }
        
        const passwordData: PasswordChangeRequest = {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword
        };
        
        const passwordResponse = await changePassword(passwordData);
        
        if (passwordResponse.error) {
          setError(passwordResponse.error);
        } else if (passwordResponse.data) {
          setSuccess(passwordResponse.data.message || 'Password updated successfully!');
          // Reset password fields
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
        
        setIsChangingPassword(false);
      } else {
        // Handle profile update
        const updateData: ProfileUpdateRequest = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email
        };
        
        const response = await updateUserProfile(updateData);
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setProfile(response.data);
          setSuccess('Profile updated successfully!');
        }
      }
    } catch (_err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-medium mb-5">My Profile</h1>

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
      
      {isLoading ? (
        <div className="bg-white border border-gray-100 rounded-md p-12 flex flex-col items-center justify-center shadow-sm">
          <RefreshCw size={32} className="text-[#FF8A00] animate-spin mb-4" />
          <p className="text-gray-500">Loading profile data...</p>
        </div>
      ) : profile ? (
        <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'personal' ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Information
              </button>
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'company' ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('company')}
              >
                Company
              </button>
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'security' ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5">
            <form onSubmit={handleSubmit}>
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>

                  {/* Permissions */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">Account Permissions</h3>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${profile?.can_place_ads ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-700">Place Advertisements</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${profile?.can_place_bids ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-700">Place Bids</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Tab */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  {/* Company Info */}
                  <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start">
                      <div className="h-14 w-14 bg-[#FF8A00]/10 rounded-lg flex items-center justify-center">
                        <Building size={24} className="text-[#FF8A00]" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">{profile?.company_name || 'Company'}</h3>
                        <div className="mt-1 flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {profile?.role_display || 'User'}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">Company information and role details</p>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Account Permissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-md">
                          <div className={`w-2 h-2 rounded-full mr-2 ${profile?.can_place_ads ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm text-gray-700">Place Advertisements</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-md">
                          <div className={`w-2 h-2 rounded-full mr-2 ${profile?.can_place_bids ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm text-gray-700">Place Bids</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Addresses Section */}
                  <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="h-14 w-14 bg-[#FF8A00]/10 rounded-lg flex items-center justify-center">
                          <MapPin size={24} className="text-[#FF8A00]" />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-800">Company Addresses</h3>
                          <p className="mt-1 text-sm text-gray-500">Manage your business addresses</p>
                        </div>
                      </div>
                      {!showAddressForm && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(true);
                            setEditingAddressId(null);
                            setAddressFormData({
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
                          }}
                          className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Address
                        </button>
                      )}
                    </div>
                    
                    {/* Address Error message */}
                    {addressError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                        <div className="flex items-center">
                          <AlertCircle className="text-red-500 mr-2" size={16} />
                          <p className="text-sm text-red-700">{addressError}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Address Success message */}
                    {addressSuccess && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-2" size={16} />
                          <p className="text-sm text-green-700">{addressSuccess}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Address Form */}
                    {showAddressForm && (
                      <div className="mt-6 border border-gray-100 rounded-md p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-700 mb-4">
                          {editingAddressId ? 'Edit Address' : 'Add New Address'}
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Address Type
                              </label>
                              <select
                                name="type"
                                value={addressFormData.type}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                              >
                                <option value="business">Business</option>
                                <option value="shipping">Shipping</option>
                                <option value="billing">Billing</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Contact Name
                              </label>
                              <input
                                type="text"
                                name="contact_name"
                                value={addressFormData.contact_name}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Address Line 1
                            </label>
                            <input
                              type="text"
                              name="address_line1"
                              value={addressFormData.address_line1}
                              onChange={handleAddressChange}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Address Line 2 (Optional)
                            </label>
                            <input
                              type="text"
                              name="address_line2"
                              value={addressFormData.address_line2 || ''}
                              onChange={handleAddressChange}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={addressFormData.city}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Postal Code
                              </label>
                              <input
                                type="text"
                                name="postal_code"
                                value={addressFormData.postal_code}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Country
                              </label>
                              <input
                                type="text"
                                name="country"
                                value={addressFormData.country}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Contact Phone
                            </label>
                            <input
                              type="tel"
                              name="contact_phone"
                              value={addressFormData.contact_phone}
                              onChange={handleAddressChange}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="is_primary"
                              name="is_primary"
                              checked={addressFormData.is_primary}
                              onChange={handleAddressChange}
                              className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                            />
                            <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-700">
                              Set as primary address
                            </label>
                          </div>
                          
                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddressForm(false);
                                setAddressError(null);
                              }}
                              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                            >
                              <X size={14} className="mr-1" />
                              Cancel
                            </button>
                            
                            <button
                              type="button"
                              onClick={handleAddressSubmit}
                              disabled={isSavingAddress}
                              className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
                            >
                              {isSavingAddress ? (
                                <>
                                  <RefreshCw size={14} className="animate-spin mr-1" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={14} className="mr-1" />
                                  {editingAddressId ? 'Update Address' : 'Save Address'}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Address List */}
                    <div className="mt-6">
                      {isLoadingAddresses ? (
                        <div className="flex justify-center py-8">
                          <RefreshCw size={24} className="text-[#FF8A00] animate-spin" />
                        </div>
                      ) : addresses.length > 0 ? (
                        <div className="space-y-4">
                          {addresses.map((address) => (
                            <div key={address.id} className="border border-gray-100 rounded-md p-4 hover:border-gray-200 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-800">{address.contact_name}</span>
                                    {address.is_primary && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        Primary
                                      </span>
                                    )}
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                      {address.type_display}
                                    </span>
                                    {address.is_verified && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                                        <Check size={10} className="mr-1" />
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-2 text-sm text-gray-600">
                                    <p>{address.address_line1}</p>
                                    {address.address_line2 && <p>{address.address_line2}</p>}
                                    <p>{address.city}, {address.postal_code}</p>
                                    <p>{address.country}</p>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-500">
                                    <p>Phone: {address.contact_phone}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  {!address.is_primary && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPrimary(address.id)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                      title="Set as primary"
                                    >
                                      <Check size={16} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleEditAddress(address)}
                                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                    title="Edit address"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete address"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <MapPin size={32} className="text-gray-300 mb-2" />
                          <p className="text-gray-500">No addresses found</p>
                          <p className="text-sm text-gray-400 mt-1">Add an address to get started</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield size={16} className="text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-700">Password Requirements</h3>
                        <div className="mt-1 text-xs text-yellow-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>At least 8 characters long</li>
                            <li>Include at least one uppercase letter</li>
                            <li>Include at least one number</li>
                            <li>Include at least one special character</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => {
                    // Reset form to initial values
                    if (profile) {
                      setFormData({
                        firstName: profile.first_name,
                        lastName: profile.last_name,
                        email: profile.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      {activeTab === 'security' && isChangingPassword ? 'Changing Password...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {activeTab === 'security' ? 'Change Password' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-md p-12 flex flex-col items-center justify-center shadow-sm">
          <AlertCircle size={32} className="text-red-500 mb-4" />
          <p className="text-gray-700 font-medium">Failed to load profile</p>
          <p className="text-gray-500 mt-1">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
