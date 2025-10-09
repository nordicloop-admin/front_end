"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Package, ArrowRight, Check, AlertCircle, Clock, Award, Bookmark, Box, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { getUserDashboardStatistics, UserDashboardStatistics } from '@/services/statistics';
import NotificationWidget from '@/components/notifications/NotificationWidget';
import { toast } from 'sonner';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserDashboardStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [shownRejectionToast, setShownRejectionToast] = useState(false);

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

  // Show a toast with quick access to contact page if verification was rejected
  useEffect(() => {
    if (stats?.verification_status === 'rejected' && !shownRejectionToast) {
      toast.error('Business verification rejected', {
        description: (
          <div className="text-sm">
            Your verification was not approved. Please review requirements and reach out if you need help.
            <div className="mt-2">
              <Link href="/contact" className="inline-flex items-center px-3 py-1 rounded-md bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#e67700] transition-colors">Contact Support</Link>
            </div>
          </div>
        ),
        duration: 8000
      });
      setShownRejectionToast(true);
    }
  }, [stats, shownRejectionToast]);

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

  // Helper function to get verification status info (now includes rejected state)
  const getVerificationInfo = () => {
    if (!stats) return { status: 'Unknown', message: 'Loading verification status', icon: Clock, colorClass: 'text-gray-500', bgClass: 'bg-gray-50', borderClass: 'border-gray-200', headerText: 'text-gray-700', bodyText: 'text-gray-600' };

    // Approved
    if (stats.is_verified || stats.verification_status === 'approved') {
      return {
        status: 'Verified',
        message: stats.verification_message || 'Your business is verified',
        icon: CheckCircle,
        colorClass: 'text-green-500',
        bgClass: 'bg-green-50',
        borderClass: 'border-green-100',
        headerText: 'text-green-700',
        bodyText: 'text-green-600'
      };
    }

    // Pending
    if (stats.pending_verification || stats.verification_status === 'pending') {
      return {
        status: 'Pending',
        message: stats.verification_message || 'Your business is under verification. This process typically takes 1–2 business days.',
        icon: Clock,
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-50',
        borderClass: 'border-blue-100',
        headerText: 'text-blue-700',
        bodyText: 'text-blue-600'
      };
    }

    // Rejected
    if (stats.verification_status === 'rejected') {
      const defaultMsg = `We carefully reviewed your submission but need a few adjustments before we can verify your business. This isn’t a final “no” – it’s a checkpoint. Most companies are approved after clarifying missing or unclear details (e.g. legal name consistency, VAT docs, or ownership evidence).`;
      return {
        status: 'Rejected',
        message: stats.verification_message || defaultMsg,
        icon: XCircle,
        colorClass: 'text-red-500',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-100',
        headerText: 'text-red-700',
        bodyText: 'text-red-600'
      };
    }

    // Not started / not verified default
    return {
      status: 'Not Verified',
      message: stats.verification_message || 'Please complete the verification process to unlock all features.',
      icon: XCircle,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-100',
      headerText: 'text-amber-700',
      bodyText: 'text-amber-600'
    };
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

      {/* Header with Greeting and Subscription Indicator */}
      <div className="mb-5 flex justify-between items-start">
        <div>
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
        
        {/* Compact subscription indicator */}
        {!isLoading && stats?.subscription && (
          <div className="flex items-center gap-2 text-sm">
            {stats.subscription.includes('Premium') ? (
              <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md">
                <Check size={14} className="mr-1" />
                <span className="font-medium">Premium</span>
              </div>
            ) : stats.subscription.includes('Standard') ? (
              <>
                <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                  <Check size={14} className="mr-1" />
                  <span className="font-medium">Standard</span>
                </div>
                <Link 
                  href="/dashboard/subscriptions" 
                  className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium hover:underline"
                >
                  Upgrade
                </Link>
              </>
            ) : (
              <>
                <div className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md">
                  <span className="font-medium">{stats.subscription}</span>
                </div>
                <Link 
                  href="/dashboard/subscriptions" 
                  className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium hover:underline"
                >
                  Upgrade
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

        {/* Contextual Subscription Display - Only show upgrade prompt for Free Plan users */}
        {(!isLoading && stats?.subscription && 
          !stats.subscription.includes('Premium') && 
          !stats.subscription.includes('Standard') && 
          stats.subscription.includes('Free')) && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-orange-500 mr-2">
                  <Check size={16} />
                </div>
                <h2 className="text-sm font-medium text-gray-700">Current Plan</h2>
              </div>
            </div>
            <div className="text-sm font-medium mb-2 text-gray-800">
              {stats?.subscription || 'Free Plan'}
            </div>
            <Link
              href="/dashboard/subscriptions"
              className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
            >
              Upgrade for more features <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Verification Status Alert */}
      {(!stats?.is_verified) && (
        <div className={`mb-6 ${verificationInfo.bgClass} border ${verificationInfo.borderClass} p-4 rounded-md`}> 
          <div className="flex">
            <div className="flex-shrink-0">
              <VerificationIcon size={16} className={verificationInfo.colorClass} />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${verificationInfo.headerText}`}>{verificationInfo.status}</h3>
              <div className={`mt-1 text-xs ${verificationInfo.bodyText}`}>
                {verificationInfo.status === 'Rejected' ? (
                  <div className="space-y-2">
                    <p className="leading-relaxed">{verificationInfo.message}</p>
                    <ul className="list-disc ml-5 mt-1 text-[11px] space-y-1">
                      <li>Double‑check that company legal name matches uploaded documents.</li>
                      <li>Ensure VAT / registration numbers are clear and readable.</li>
                      <li>Provide ownership / authorization proof if not the primary signatory.</li>
                    </ul>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href="/contact"
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#e67700] transition-colors shadow-sm"
                      >
                        Contact Support
                        <ArrowRight size={12} className="ml-1" />
                      </Link>
                      <Link
                        href="/dashboard/company/profile"
                        className="text-xs font-medium text-red-600 hover:text-red-700 underline"
                      >
                        Review Submission
                      </Link>
                    </div>
                    <p className="text-[11px] mt-1 italic">We&apos;re here to help you get verified quickly—most follow‑ups are resolved within one business day.</p>
                  </div>
                ) : (
                  <p>{verificationInfo.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
              <Box className="text-gray-300 mb-3" size={32} />
              <p className="text-sm text-gray-500 mb-3">You haven&apos;t placed any bids yet</p>
              <Link 
                href="/marketplace"
                className="inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white text-sm font-medium rounded-md hover:bg-[#e67e00] transition-colors"
              >
                Browse Marketplace
              </Link>
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
              <Package className="text-gray-300 mb-3" size={32} />
              <p className="text-sm text-gray-500 mb-3">You haven&apos;t created any auctions yet</p>
              <Link 
                href="/dashboard/auctions/create-alternative"
                className="inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white text-sm font-medium rounded-md hover:bg-[#e67e00] transition-colors"
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

        {/* Recent Notifications */}
        <NotificationWidget
          className="lg:col-span-1"
          maxItems={5}
          showViewAllLink={true}
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
