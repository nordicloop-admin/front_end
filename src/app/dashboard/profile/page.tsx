"use client";

import React, { useState } from 'react';
// Link is imported but not used in this file
import _Link from 'next/link';
import { User, Mail, Phone, Building, Shield, Key, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  // Mock user data
  const userData = {
    firstName: user?.firstName || 'Charmant',
    lastName: user?.lastName || 'Uwase',
    email: user?.email || 'charmant@ecosolutions.se',
    phone: '+46 70 123 4567',
    company: 'Eco Solutions AB',
    position: 'Procurement Manager'
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    company: userData.company,
    position: userData.position,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the data to the backend
    alert('Profile updated successfully!');
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-medium mb-5">My Profile</h1>

      <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
        {/* Profile Header */}
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">
            {userData.firstName} {userData.lastName}
          </h2>
          <div className="text-sm text-gray-500">
            {userData.position} at {userData.company}
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
                activeTab === 'company'
                  ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('company')}
            >
              Company Details
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company Details Tab */}
            {activeTab === 'company' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Position
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2 w-full border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield size={16} className="text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-700">Company Verification</h3>
                      <div className="mt-1 text-xs text-blue-600">
                        <p>Your company is currently under verification. Once verified, you&apos;ll have full access to all platform features.</p>
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
                  setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    company: userData.company,
                    position: userData.position,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
