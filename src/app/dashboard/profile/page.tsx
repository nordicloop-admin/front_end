"use client";

import { useState, useEffect } from 'react';
import { Building, Shield, Save, X, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { getUserProfile, updateUserProfile, changePassword, UserProfile, ProfileUpdateRequest, PasswordChangeRequest } from '@/services/userProfile';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
