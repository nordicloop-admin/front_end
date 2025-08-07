"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAdminCompany, updateCompanyStatus, getCompanyStatistics, type AdminCompany, type CompanyStatistics, type TransactionHistoryItem } from '@/services/company';
import { createNotification, type CreateNotificationRequest } from '@/services/notifications';
import { toast } from 'sonner';
import { ArrowLeft, Building, Mail, Phone, MapPin, Calendar, User, Plus, Edit, Trash2, BarChart3, ExternalLink, Bell, X } from 'lucide-react';

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<AdminCompany | null>(null);
  const [statistics, setStatistics] = useState<CompanyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Modal states
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'system' as const,
    priority: 'normal' as const
  });

  const [sendingNotification, setSendingNotification] = useState(false);

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

    const loadStatistics = async () => {
      if (!companyId) return;

      setStatsLoading(true);

      try {
        const response = await getCompanyStatistics(companyId);

        if (response.data) {
          setStatistics(response.data);
        }
      } catch (_err) {
        // Statistics are not critical, so we don't show error for this
        console.error('Failed to load company statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    loadCompany();
    loadStatistics();
  }, [companyId]);



  // Handle notification sending
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSendingNotification(true);
    try {
      const notificationData: CreateNotificationRequest = {
        title: `[Admin] ${notificationForm.title}`,
        message: notificationForm.message,
        type: notificationForm.type,
        priority: notificationForm.priority,
        metadata: {
          company_id: company.id,
          company_name: company.companyName,
          admin_notification: true,
          target_email: company.companyEmail
        }
      };

      const response = await createNotification(notificationData);

      if (response.error) {
        toast.error('Failed to send notification', {
          description: response.error,
        });
      } else {
        toast.success('Notification sent successfully', {
          description: `Notification sent to ${company.companyName}`,
        });
        setNotificationForm({
          title: '',
          message: '',
          type: 'system',
          priority: 'normal'
        });
        setShowNotificationModal(false);
      }
    } catch (_err) {
      toast.error('Failed to send notification', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setSendingNotification(false);
    }
  };

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
          <h1 className="text-xl font-medium">Company Details</h1>
        </div>
        
        {company.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleStatusUpdate('approved')}
              disabled={updating}
              className="border border-green-300 text-green-700 px-4 py-2 rounded-md hover:bg-green-50 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {updating ? 'Updating...' : 'Approve Company'}
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={updating}
              className="border border-red-300 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <div className="flex items-center mb-4">
              <Building className="text-[#FF8A00] mr-2" size={20} />
              <h2 className="text-sm font-medium">Company Information</h2>
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

          {/* Company Users Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <User className="text-[#FF8A00] mr-2" size={20} />
                <h2 className="text-sm font-medium">Company Users ({company.contacts.length})</h2>
              </div>
              <button className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors text-sm flex items-center">
                <Plus size={16} className="mr-2" />
                Add User
              </button>
            </div>
            
            <div className="space-y-3">
              {company.contacts.map((contact, index) => (
                <div key={index} className={`p-4 border rounded-md ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600 font-medium text-sm">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium text-sm">{contact.name}</p>
                            {index === 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                Primary Contact
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {contact.email}
                        </a>
                      </div>

                      <div>
                        <p className="text-gray-900 text-sm">{contact.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Remove User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status and Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <h2 className="text-sm font-medium mb-4">Quick Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => setShowNotificationModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#FF8A00] border border-[#FF8A00] rounded-md hover:bg-[#e67700] transition-colors"
              >
                <Bell size={16} className="mr-2" />
                Send Notification
              </button>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <h2 className="text-sm font-medium mb-4">Status</h2>

            <div className="text-center">
              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold
                ${company.status === 'approved' ? 'bg-green-100 text-green-800' :
                  company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}>
                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
              </span>
            </div>
          </div>



          {/* Company Stats */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-[#FF8A00] mr-2" size={20} />
              <h2 className="text-sm font-medium">Statistics</h2>
            </div>

            {statsLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Ads</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {statistics?.active_ads || 0}
                    </span>
                    {statistics && statistics.active_ads > 0 && (
                      <Link
                        href={`/admin/auctions?search=${encodeURIComponent(company?.companyName || statistics.company_name)}`}
                        className="text-[#FF8A00] hover:text-[#e67700] transition-colors"
                        title="View active company auctions"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bids</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {statistics?.total_bids || 0}
                    </span>
                    {statistics && statistics.total_bids > 0 && (
                      <Link
                        href={`/admin/bids?search=${encodeURIComponent(company?.companyName || statistics.company_name)}`}
                        className="text-[#FF8A00] hover:text-[#e67700] transition-colors"
                        title="View all company bids"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Deals</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {statistics?.completed_deals || 0}
                    </span>
                    {statistics && statistics.completed_deals > 0 && (
                      <Link
                        href={`/admin/bids?search=${encodeURIComponent(company?.companyName || statistics.company_name)}&status=won`}
                        className="text-[#FF8A00] hover:text-[#e67700] transition-colors"
                        title="View completed deals"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Winning Bids</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {statistics?.winning_bids || 0}
                    </span>
                    {statistics && statistics.winning_bids > 0 && (
                      <Link
                        href={`/admin/bids?search=${encodeURIComponent(company?.companyName || statistics.company_name)}&status=winning`}
                        className="text-[#FF8A00] hover:text-[#e67700] transition-colors"
                        title="View winning bids"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Ads</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {statistics?.total_ads || 0}
                    </span>
                    {statistics && statistics.total_ads > 0 && (
                      <Link
                        href={`/admin/auctions?search=${encodeURIComponent(company?.companyName || statistics.company_name)}`}
                        className="text-[#FF8A00] hover:text-[#e67700] transition-colors"
                        title="View all company ads"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Ads</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {statistics?.pending_ads || 0}
                    </span>
                    {statistics && statistics.pending_ads > 0 && (
                      <Link
                        href={`/admin/auctions?search=${encodeURIComponent(company?.companyName || statistics.company_name)}&status=pending`}
                        className="text-[#FF8A00] hover:text-[#e67700] transition-colors"
                        title="View pending company ads"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white border border-gray-100 rounded-md p-6">
            <h2 className="text-sm font-medium mb-4">Transaction History</h2>

            {statsLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {statistics && statistics.recent_transactions && statistics.recent_transactions.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 mb-3">
                      Recent completed transactions:
                    </div>
                    {statistics.recent_transactions.map((transaction: TransactionHistoryItem) => (
                      <div key={transaction.id} className="border border-gray-100 rounded-md p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {transaction.ad_name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Buyer: {transaction.buyer_name}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-medium text-green-600">
                              €{transaction.total_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Volume: {transaction.volume} units</span>
                          <span>Price: €{transaction.bid_amount}/unit</span>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Successful Transactions:</span>
                        <span className="font-medium text-green-600">
                          {statistics.completed_deals}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Active Negotiations:</span>
                        <span className="font-medium text-blue-600">
                          {statistics.winning_bids}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-sm text-gray-500 italic">
                      No completed transactions yet
                    </div>
                    {statistics && statistics.winning_bids > 0 && (
                      <div className="text-xs text-gray-400 mt-2">
                        {statistics.winning_bids} active negotiation{statistics.winning_bids !== 1 ? 's' : ''} in progress
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Send Notification</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">

              <form onSubmit={handleSendNotification}>
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="text"
                    value={`${company?.companyName} users`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    >
                      <option value="system">System</option>
                      <option value="account">Account</option>
                      <option value="security">Security</option>
                      <option value="subscription">Subscription</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={notificationForm.priority}
                      onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF8A00] rounded-md hover:bg-[#e67700] disabled:opacity-50 flex items-center"
                >
                  {sendingNotification ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Bell size={16} className="mr-2" />
                      Send Notification
                    </>
                  )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}