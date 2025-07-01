"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAdminCompany, updateCompanyStatus, type AdminCompany } from '@/services/company';
import { ArrowLeft, Building, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<AdminCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getAdminCompany(companyId);

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setCompany(response.data);
        }
      } catch (_err) {
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    if (!company) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await updateCompanyStatus(companyId, newStatus);

      if (response.error) {
        setError(response.error);
      } else {
        // Update the local state immediately for better UX
        setCompany({
          ...company,
          status: newStatus
        });

        // Show success message or redirect if needed
        // For now, just update the state
      }
    } catch (_err) {
      setError(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} company`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00]"></div>
          <p className="mt-2 text-gray-500">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Link
            href="/admin/companies"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Companies
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Link
            href="/admin/companies"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Companies
          </Link>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-500">Company not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/companies"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Companies
          </Link>
          <h1 className="text-2xl font-bold">Company Details</h1>
        </div>
        
        {company.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleStatusUpdate('approved')}
              disabled={updating}
              className="border border-green-300 text-green-700 px-4 py-2 rounded-md hover:bg-green-50 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Approve Company'}
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={updating}
              className="border border-red-300 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Reject Company'}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Building className="text-[#FF8A00] mr-2" size={24} />
              <h2 className="text-lg font-semibold">Company Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <p className="text-gray-900">{company.companyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VAT Number
                </label>
                <p className="text-gray-900">{company.vatNumber}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-1" />
                  <p className="text-gray-900">{company.country}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <p className="text-gray-900">{company.sector}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email
                </label>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-1" />
                  <a 
                    href={`mailto:${company.companyEmail}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {company.companyEmail}
                  </a>
                </div>
              </div>
              
              {company.companyPhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-400 mr-1" />
                    <a 
                      href={`tel:${company.companyPhone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {company.companyPhone}
                    </a>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-1" />
                  <p className="text-gray-900">{company.registrationDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact People Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <User className="text-[#FF8A00] mr-2" size={24} />
              <h2 className="text-lg font-semibold">Contact People</h2>
            </div>
            
            <div className="space-y-4">
              {company.contacts.map((contact, index) => (
                <div key={index} className={`p-4 border rounded-lg ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-gray-900 font-medium">{contact.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contact.email}
                      </a>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <p className="text-gray-900">{contact.position}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Primary Contact
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status and Actions Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            
            <div className="text-center">
              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold
                ${company.status === 'approved' ? 'bg-green-100 text-green-800' :
                  company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}>
                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Send Email
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Activity Log
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Export Details
              </button>
            </div>
          </div>

          {/* Company Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Ads</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bids</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Deals</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 