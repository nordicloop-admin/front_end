"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Package, ArrowRight, Check, AlertCircle, Clock, Award, Bookmark, Box, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { getUserDashboardStatistics, UserDashboardStatistics } from '@/services/statistics';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserDashboardStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await getUserDashboardStatistics();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setStats(response.data);
        }
      } catch (_error) {
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Helper function to format the date
  const formatBidDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_e) {
      return dateString;
    }
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'winning':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'outbid':
        return 'bg-yellow-100 text-yellow-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get verification status info
  const getVerificationInfo = () => {
    if (!stats) return { status: 'Unknown', message: 'Loading verification status', icon: Clock, colorClass: 'text-gray-500' };
    
    if (stats.is_verified) {
      return {
        status: 'Verified',
        message: 'Your business is verified',
        icon: CheckCircle,
        colorClass: 'text-green-500'
      };
    } else if (stats.pending_verification) {
      return {
        status: 'Pending',
        message: stats.verification_message || 'Your business is under verification',
        icon: Clock,
        colorClass: 'text-blue-500'
      };
    } else {
      return {
        status: 'Not Verified',
        message: 'Please complete the verification process',
        icon: XCircle,
        colorClass: 'text-red-500'
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  // Get verification status info
  const verificationInfo = getVerificationInfo();
  const VerificationIcon = verificationInfo.icon;

  return (
    <div className="p-5">
      {/* Error message if any */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mt-0.5 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Header with Greeting */}
      <div className="mb-5">
        <div className="text-gray-500 text-sm">Hello</div>
        <h1 className="text-xl font-medium text-gray-900">
          {stats?.username || user?.firstName || user?.username?.split(' ')[0] || 'User'}
          {stats?.company_name && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({stats.company_name})
            </span>
          )}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Active Bids</h2>
            <div className="text-blue-500">
              <Bookmark size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.active_bids || 0}</div>
          <Link
            href="/dashboard/my-bids?status=active"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
          >
            View active bids <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Winning Bids</h2>
            <div className="text-green-500">
              <Award size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.winning_bids || 0}</div>
          <Link
            href="/dashboard/my-bids?status=winning"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
          >
            View winning bids <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Active Auctions</h2>
            <div className="text-purple-500">
              <Package size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.active_ads || 0}</div>
          <Link
            href="/dashboard/my-auctions"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
          >
            View my auctions <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Subscription</h2>
            <div className="text-indigo-500">
              <Check size={18} />
            </div>
          </div>
          <div className="text-md font-medium mb-1">{stats?.subscription || 'Free Plan'}</div>
          <Link
            href="/dashboard/subscriptions"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
          >
            Upgrade plan <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Verification Status Alert */}
      {!stats?.is_verified && (
        <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <VerificationIcon size={16} className={verificationInfo.colorClass} />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-700">{verificationInfo.status}</h3>
              <div className="mt-1 text-xs text-blue-600">
                <p>{verificationInfo.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Bids */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <h2 className="text-base font-medium text-gray-800 mb-4">Recent Bids</h2>
          {stats?.recent_bids && stats.recent_bids.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_bids.map((bid) => (
                <div key={bid.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        href={`/dashboard/auctions/${bid.ad_id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#FF8A00] transition-colors"
                      >
                        Bid #{bid.id}
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{formatBidDate(bid.created_at)}</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#FF8A00]">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(bid.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <Box className="text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-500">You haven't placed any bids yet</p>
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              href="/dashboard/my-bids"
              className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center justify-center"
            >
              View all bids <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Recent Auctions */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <h2 className="text-base font-medium text-gray-800 mb-4">My Auctions</h2>
          {stats?.recent_ads && stats.recent_ads.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_ads.map((ad) => (
                <div key={ad.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        href={`/dashboard/my-auctions/${ad.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#FF8A00] transition-colors"
                      >
                        {ad.title || `Auction #${ad.id}`}
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{formatBidDate(ad.created_at)}</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ad.status)}`}>
                          {ad.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {ad.bids_count} {ad.bids_count === 1 ? 'bid' : 'bids'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <Package className="text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-500">You haven't created any auctions yet</p>
              <Link 
                href="/dashboard/my-auctions/create"
                className="mt-2 text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium"
              >
                Create your first auction
              </Link>
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              href="/dashboard/my-auctions"
              className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center justify-center"
            >
              View all auctions <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
