"use client";

import React, { useState, useEffect } from 'react';
import {
  Check,
  Bell,
  Loader2,
  AlertCircle,
  CheckCircle,
  Package,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Search,
  Filter
} from 'lucide-react';
import {
  getUserCategorySubscriptions,
  subscribeToCategoryOrSubcategory,
  unsubscribeFromCategory,
  CategorySubscription
} from '@/services/categorySubscription';
import { getCategories, Category } from '@/services/auction';

export default function CategorySubscriptionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptions, setSubscriptions] = useState<CategorySubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<number[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  // Individual loading states for better UX
  const [loadingCategories, setLoadingCategories] = useState<Set<number>>(new Set());
  const [loadingSubcategories, setLoadingSubcategories] = useState<Set<string>>(new Set());
  const [loadingSubscriptions, setLoadingSubscriptions] = useState<Set<number>>(new Set());

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribed, setShowSubscribed] = useState(false);

  // Fetch only user subscriptions on initial load
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user's category subscriptions
        const subscriptionsResponse = await getUserCategorySubscriptions();
        if (subscriptionsResponse.error) {
          setError(subscriptionsResponse.error);
          // Initialize with empty array if there's an error
          setSubscriptions([]);
        } else if (subscriptionsResponse.data) {
          // Ensure we always have an array, even if API returns null
          setSubscriptions(Array.isArray(subscriptionsResponse.data) ? subscriptionsResponse.data : []);
        } else {
          // Initialize with empty array if data is null or undefined
          setSubscriptions([]);
        }
      } catch (_err) {
        setError('Failed to load subscriptions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Function to load categories on demand
  const loadCategories = async () => {
    if (categories.length > 0) {
      // Categories already loaded, just show them
      setShowCategories(true);
      return;
    }

    try {
      setIsCategoriesLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await getCategories();
      if (categoriesResponse.error) {
        setError(categoriesResponse.error);
      } else if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
        setShowCategories(true);
      }
    } catch (_err) {
      setError('Failed to load categories');
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Helper function to check if user is subscribed to a category
  const isSubscribedToCategory = (categoryName: string) => {
    return subscriptions.some(sub => sub.material_type === categoryName && !sub.subcategory_name);
  };

  // Helper function to check if user is subscribed to a subcategory
  const isSubscribedToSubcategory = (categoryName: string, subcategoryName: string) => {
    return subscriptions.some(sub =>
      sub.material_type === categoryName && sub.subcategory_name === subcategoryName
    );
  };

  // Helper function to get subscription ID for unsubscribing
  const getSubscriptionId = (categoryName: string, subcategoryName?: string) => {
    const subscription = subscriptions.find(sub =>
      sub.material_type === categoryName &&
      (subcategoryName ? sub.subcategory_name === subcategoryName : !sub.subcategory_name)
    );
    return subscription?.id;
  };

  // Toggle subscription expansion to show related ads
  const toggleSubscriptionExpansion = (subscriptionId: number) => {
    setExpandedSubscriptions(prev =>
      prev.includes(subscriptionId)
        ? prev.filter(id => id !== subscriptionId)
        : [...prev, subscriptionId]
    );
  };

  // Format auction duration to human-readable format
  const formatAuctionDuration = (days: number | null | undefined): string => {
    if (days === null || days === undefined) return 'N/A';
    if (days === 0) return 'Custom';
    return `${days} day${days > 1 ? 's' : ''}`;
  };



  // Format packaging to be more readable
  const formatPackaging = (packaging: string | null | undefined): string => {
    if (packaging === null || packaging === undefined) return 'N/A';
    return packaging.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Subscribe to a category
  const handleSubscribeToCategory = async (categoryId: number) => {
    try {
      setLoadingCategories(prev => new Set(prev).add(categoryId));
      setError(null);
      setSuccess(null);

      const response = await subscribeToCategoryOrSubcategory({ category: categoryId });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Refresh subscriptions after subscribing
        const refreshResponse = await getUserCategorySubscriptions();
        if (refreshResponse.data) {
          setSubscriptions(refreshResponse.data);
        }
        setSuccess(`Successfully subscribed to category`);
      }
    } catch (_err) {
      setError('Failed to subscribe to category');
    } finally {
      setLoadingCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  // Subscribe to a subcategory
  const handleSubscribeToSubcategory = async (categoryId: number, subcategoryId: number) => {
    try {
      const subcategoryKey = `${categoryId}-${subcategoryId}`;
      setLoadingSubcategories(prev => new Set(prev).add(subcategoryKey));
      setError(null);
      setSuccess(null);

      const response = await subscribeToCategoryOrSubcategory({
        category: categoryId,
        subcategory: subcategoryId
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Refresh subscriptions after subscribing
        const refreshResponse = await getUserCategorySubscriptions();
        if (refreshResponse.data) {
          setSubscriptions(refreshResponse.data);
        }
        setSuccess(`Successfully subscribed to subcategory`);
      }
    } catch (_err) {
      setError('Failed to subscribe to subcategory');
    } finally {
      const subcategoryKey = `${categoryId}-${subcategoryId}`;
      setLoadingSubcategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(subcategoryKey);
        return newSet;
      });
    }
  };

  // Unsubscribe from a category or subcategory
  const handleUnsubscribe = async (subscriptionId: number) => {
    try {
      setLoadingSubscriptions(prev => new Set(prev).add(subscriptionId));
      setError(null);
      setSuccess(null);

      const response = await unsubscribeFromCategory(subscriptionId);

      if (response.error) {
        setError(response.error);
      } else {
        setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
        setSuccess(`Successfully unsubscribed`);
      }
    } catch (_err) {
      setError('Failed to unsubscribe');
    } finally {
      setLoadingSubscriptions(prev => {
        const newSet = new Set(prev);
        newSet.delete(subscriptionId);
        return newSet;
      });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Wishlist</h1>
        <p className="text-gray-600 mt-1">
          Get notified when new auctions are posted in your preferred categories
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-[#FF8A00]" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-md flex items-center">
              <AlertCircle size={14} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-r-md flex items-center">
              <CheckCircle size={14} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Your Active Alerts */}
          {subscriptions.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 text-[#FF8A00] mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Your Wishlist Items</h3>
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {subscriptions.length}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  You&apos;ll receive notifications for these categories
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {subscriptions.map(subscription => (
                  <div key={subscription.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSubscriptionExpansion(subscription.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{subscription.material_type}</div>
                          {subscription.subcategory_name && (
                            <div className="text-sm text-gray-500">{subscription.subcategory_name}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsubscribe(subscription.id);
                          }}
                          disabled={loadingSubscriptions.has(subscription.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remove from wishlist"
                        >
                          {loadingSubscriptions.has(subscription.id) ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Minus size={14} />
                          )}
                        </button>
                        {expandedSubscriptions.includes(subscription.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Related Ads */}
                    {expandedSubscriptions.includes(subscription.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Package className="w-4 h-4 text-[#FF8A00] mr-2" />
                          Recent Auctions ({subscription.related_ads?.length || 0})
                        </h4>

                        {subscription.related_ads && subscription.related_ads.length > 0 ? (
                          <div className="space-y-3">
                            {subscription.related_ads.slice(0, 3).map(ad => (
                              <div key={ad.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                <h5 className="font-medium text-gray-900 mb-1">{ad.title}</h5>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ad.description}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                      <Package size={12} className="mr-1" />
                                      {formatPackaging(ad.packaging)}
                                    </span>
                                    <span className="flex items-center">
                                      <Calendar size={12} className="mr-1" />
                                      {formatAuctionDuration(ad.auction_duration)}
                                    </span>
                                  </div>
                                  <span className="font-medium text-[#FF8A00]">
                                    {ad.starting_bid_price} {ad.currency}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {subscription.related_ads.length > 3 && (
                              <div className="text-center">
                                <button className="text-[#FF8A00] hover:text-[#e67e00] text-sm font-medium">
                                  View all {subscription.related_ads.length} auctions
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No recent auctions in this category
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                />
              </div>

              <button
                onClick={() => setShowSubscribed(!showSubscribed)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  showSubscribed
                    ? 'bg-[#FF8A00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{showSubscribed ? 'Show All' : 'Show Subscribed'}</span>
              </button>
            </div>
          </div>

          {/* Available Categories Section */}
          {showCategories && categories.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-[#FF8A00] mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Material Categories</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click the + icon to add categories to your wishlist
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {categories
                  .filter(category =>
                    !searchQuery ||
                    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    category.subcategories?.some(sub =>
                      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .filter(category =>
                    !showSubscribed ||
                    isSubscribedToCategory(category.name) ||
                    category.subcategories?.some(sub =>
                      isSubscribedToSubcategory(category.name, sub.name)
                    )
                  )
                  .map(category => {
                    const isMainCategorySubscribed = isSubscribedToCategory(category.name);
                    const subscribedSubcategories = category.subcategories?.filter(sub =>
                      isSubscribedToSubcategory(category.name, sub.name)
                    ) || [];

                    return (
                      <div key={category.id} className="hover:bg-gray-50 transition-colors">
                        <div
                          className="flex items-center justify-between px-6 py-4 cursor-pointer"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isMainCategorySubscribed
                                ? 'bg-green-100'
                                : 'bg-gray-100'
                            }`}>
                              {isMainCategorySubscribed ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{category.name}</div>
                              {subscribedSubcategories.length > 0 && (
                                <div className="text-xs text-[#FF8A00]">
                                  {subscribedSubcategories.length} subcategory item{subscribedSubcategories.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {isMainCategorySubscribed ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const subscriptionId = getSubscriptionId(category.name);
                                  if (subscriptionId) handleUnsubscribe(subscriptionId);
                                }}
                                disabled={loadingCategories.has(category.id)}
                                className="p-1 text-green-600 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Remove category from wishlist"
                              >
                                {loadingCategories.has(category.id) ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={14} />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubscribeToCategory(category.id);
                                }}
                                disabled={loadingCategories.has(category.id)}
                                className="p-1 text-gray-400 hover:text-[#FF8A00] hover:bg-orange-50 rounded transition-colors"
                                title="Add category to wishlist"
                              >
                                {loadingCategories.has(category.id) ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Plus size={14} />
                                )}
                              </button>
                            )}
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Subcategories */}
                        {expandedCategories.includes(category.id) && category.subcategories && category.subcategories.length > 0 && (
                          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                            <div className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <ChevronRight className="w-3 h-3 mr-2" />
                              Subcategories ({category.subcategories.length})
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {category.subcategories
                                .filter(subcategory =>
                                  !searchQuery ||
                                  subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map(subcategory => {
                                  const isSubcategorySubscribed = isSubscribedToSubcategory(category.name, subcategory.name);

                                  return (
                                    <div
                                      key={subcategory.id}
                                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                          isSubcategorySubscribed
                                            ? 'bg-green-100'
                                            : 'bg-gray-100'
                                        }`}>
                                          {isSubcategorySubscribed ? (
                                            <Check className="w-2.5 h-2.5 text-green-600" />
                                          ) : (
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                          )}
                                        </div>
                                        <span className="text-sm text-gray-700">{subcategory.name}</span>
                                      </div>
                                      {isSubcategorySubscribed ? (
                                        <button
                                          onClick={() => {
                                            const subscriptionId = getSubscriptionId(category.name, subcategory.name);
                                            if (subscriptionId) handleUnsubscribe(subscriptionId);
                                          }}
                                          disabled={loadingSubcategories.has(`${category.id}-${subcategory.id}`)}
                                          className="p-1 text-green-600 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                          title="Remove subcategory from wishlist"
                                        >
                                          {loadingSubcategories.has(`${category.id}-${subcategory.id}`) ? (
                                            <Loader2 size={12} className="animate-spin" />
                                          ) : (
                                            <Check size={12} />
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleSubscribeToSubcategory(category.id, subcategory.id)}
                                          disabled={loadingSubcategories.has(`${category.id}-${subcategory.id}`)}
                                          className="p-1 text-gray-400 hover:text-[#FF8A00] hover:bg-orange-50 rounded transition-colors"
                                          title="Add subcategory to wishlist"
                                        >
                                          {loadingSubcategories.has(`${category.id}-${subcategory.id}`) ? (
                                            <Loader2 size={12} className="animate-spin" />
                                          ) : (
                                            <Plus size={12} />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!showCategories && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Bell size={32} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Loaded</h3>
              <p className="text-gray-500 mb-6">
                Browse available categories to add to your wishlist
              </p>
              <button
                onClick={loadCategories}
                disabled={isCategoriesLoading}
                className="bg-[#FF8A00] text-white px-6 py-2 rounded-lg hover:bg-[#e67e00] transition-colors flex items-center space-x-2 mx-auto font-medium"
              >
                {isCategoriesLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                <span>Browse Categories</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}