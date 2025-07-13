"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Shield, Key, Save, X, RefreshCw, AlertCircle, Briefcase, Calendar, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile } from '@/services/userProfile';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Fetch user profile data
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
        }
      } catch (_err) {
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email
      }));
    }
  }, [profile]);

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
    
    if (activeTab === 'personal') {
      try {
        setIsSaving(true);
        setSaveSuccess(false);
        setError(null);
        
        const response = await updateUserProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email
        });
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setProfile(response.data);
          setSaveSuccess(true);
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            setSaveSuccess(false);
          }, 3000);
        }
      } catch (_err) {
        setError('Failed to update profile');
      } finally {
        setIsSaving(false);
      }
    } else if (activeTab === 'security') {
      // Password change would be handled by a separate API endpoint
      // This is just a placeholder
      alert('Password change functionality would be implemented here');
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
      {saveSuccess && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md mb-5">
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-gray-100 rounded-md p-10 flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 text-[#FF8A00] animate-spin mb-4" />
          <p className="text-gray-500">Loading profile data...</p>
        </div>
      ) : (
        <div>
          <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
            {/* Profile Header */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                {profile?.name || 'User Profile'}
              </h2>
              <div className="text-sm text-gray-500 flex items-center">
                <Shield className="mr-1" size={14} />
                {profile?.role_display || 'User'} at {profile?.company_name || 'Company'}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'personal'
                      ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Information
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'account'
                      ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('account')}
                >
                  Account Details
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'security'
                      ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Details Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-md p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Account Information</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Building size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Company</span>
                          </div>
                          <span className="text-sm font-medium">{profile?.company_name || 'Not specified'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Shield size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Role</span>
                          </div>
                          <span className="text-sm font-medium">{profile?.role_display || 'User'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Member Since</span>
                          </div>
                          <span className="text-sm font-medium">
                            {profile?.date_joined ? format(new Date(profile.date_joined), 'MMMM d, yyyy') : 'Not available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-100 rounded-md p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Permissions</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Briefcase size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Can Place Ads</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${profile?.can_place_ads ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {profile?.can_place_ads ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Briefcase size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Can Place Bids</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${profile?.can_place_bids ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {profile?.can_place_bids ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle size={16} className="text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-700">Account Settings</h3>
                          <div className="mt-1 text-xs text-yellow-600">
                            Contact your administrator to change company details or permissions.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                        />
                      </div>
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
                    className="px-4 py-2 border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
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
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Profile ID Card */}
          {profile && (
            <div className="mt-6 bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-medium">Profile ID Card</h2>
              </div>
              <div className="p-5">
                <div className="bg-gradient-to-r from-[#FF8A00] to-[#FF5F00] rounded-lg p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{profile.name}</h3>
                      <p className="text-white/80 text-sm">{profile.role_display}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <User size={24} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center">
                      <Mail size={14} className="mr-2 opacity-70" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Building size={14} className="mr-2 opacity-70" />
                      <span className="text-sm">{profile.company_name}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                    <div>
                      <p className="text-xs opacity-70">Member ID</p>
                      <p className="font-mono font-medium">{profile.id}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Joined</p>
                      <p className="font-medium">{format(new Date(profile.date_joined), 'MMM yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
