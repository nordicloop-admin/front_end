"use client";

import React, { useState, useEffect } from 'react';
import { X, Bell, Loader2, AlertCircle, CheckCircle, Package, Calendar, Thermometer, Droplet } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<number[]>([]);

  // Fetch categories and user subscriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await getCategories();
        if (categoriesResponse.error) {
          setError(categoriesResponse.error);
        } else if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
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
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
  const formatAuctionDuration = (days: number): string => {
    if (days === 0) return 'Custom';
    return `${days} day${days > 1 ? 's' : ''}`;
  };
  
  // Format contamination level to be more readable
  const formatContamination = (contamination: string): string => {
    return contamination.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format storage conditions to be more readable
  const formatStorageConditions = (conditions: string): string => {
    return conditions.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format packaging to be more readable
  const formatPackaging = (packaging: string): string => {
    return packaging.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Subscribe to a category
  const handleSubscribeToCategory = async (categoryId: number) => {
    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);
      
      const response = await subscribeToCategoryOrSubcategory({ category_id: categoryId });
      
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
      setIsUpdating(false);
    }
  };

  // Subscribe to a subcategory
  const handleSubscribeToSubcategory = async (categoryId: number, subcategoryId: number) => {
    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);
      
      const response = await subscribeToCategoryOrSubcategory({ 
        category_id: categoryId,
        subcategory_id: subcategoryId
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
      setIsUpdating(false);
    }
  };

  // Unsubscribe from a category or subcategory
  const handleUnsubscribe = async (subscriptionId: number) => {
    try {
      setIsUpdating(true);
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
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-[#FF8A00]" />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Category Subscriptions</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to material categories to receive notifications when new auctions are posted.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <CheckCircle size={16} className="mr-2" />
              {success}
            </div>
          )}
          
          {/* Your Subscriptions Section */}
          {subscriptions.length > 0 && (
            <div className="border rounded-md mb-8">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium">Your Subscriptions</h3>
              </div>
              
              <div className="divide-y">
                {subscriptions.map(subscription => (
                  <div key={subscription.id} className="border-b last:border-b-0">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleSubscriptionExpansion(subscription.id)}
                    >
                      <div>
                        <div className="font-medium">{subscription.material_type}</div>
                        {subscription.subcategory_name && (
                          <div className="text-sm text-gray-500">Subcategory: {subscription.subcategory_name}</div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsubscribe(subscription.id);
                          }}
                          disabled={isUpdating}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center mr-3"
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin mr-1" />
                          ) : (
                            <X size={14} className="mr-1" />
                          )}
                          Unsubscribe
                        </button>
                        <span className="text-gray-400">
                          {expandedSubscriptions.includes(subscription.id) ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Related Ads */}
                    {expandedSubscriptions.includes(subscription.id) && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <h4 className="font-medium mb-3">Related Auctions</h4>
                        
                        {subscription.related_ads && subscription.related_ads.length > 0 ? (
                          <div className="space-y-4">
                            {subscription.related_ads.map(ad => (
                              <div key={ad.id} className="bg-white p-4 rounded-md border">
                                <h5 className="font-medium text-lg mb-2">{ad.title}</h5>
                                <p className="text-gray-600 mb-3 text-sm">{ad.description}</p>
                                
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center">
                                    <Package size={16} className="mr-2 text-gray-500" />
                                    <span className="text-gray-700">
                                      <span className="font-medium">Packaging:</span> {formatPackaging(ad.packaging)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Calendar size={16} className="mr-2 text-gray-500" />
                                    <span className="text-gray-700">
                                      <span className="font-medium">Duration:</span> {formatAuctionDuration(ad.auction_duration)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Thermometer size={16} className="mr-2 text-gray-500" />
                                    <span className="text-gray-700">
                                      <span className="font-medium">Storage:</span> {formatStorageConditions(ad.storage_conditions)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Droplet size={16} className="mr-2 text-gray-500" />
                                    <span className="text-gray-700">
                                      <span className="font-medium">Contamination:</span> {formatContamination(ad.contamination)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{ad.available_quantity} {ad.unit_of_measurement}</span>
                                  </div>
                                  <div className="text-[#FF8A00] font-medium">
                                    Starting bid: {ad.starting_bid_price} {ad.currency}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No related auctions available.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Available Categories Section */}
          <div className="border rounded-md">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium">Browse Categories</h3>
            </div>
            
            {categories.length > 0 ? (
              <div className="divide-y">
                {categories.map(category => (
                  <div key={category.id} className="border-b last:border-b-0">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleCategoryExpansion(category.id)}
                    >
                      <div className="font-medium">{category.name}</div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscribeToCategory(category.id);
                          }}
                          disabled={isUpdating}
                          className="text-[#FF8A00] hover:text-[#e67e00] text-sm flex items-center mr-3"
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin mr-1" />
                          ) : (
                            <Bell size={14} className="mr-1" />
                          )}
                          Subscribe
                        </button>
                        <span className="text-gray-400">
                          {expandedCategories.includes(category.id) ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && category.subcategories && category.subcategories.length > 0 && (
                      <div className="border-t border-gray-100 pl-6 py-2">
                        {category.subcategories.map(subcategory => (
                          <div 
                            key={subcategory.id}
                            className="flex items-center justify-between p-2"
                          >
                            <div className="text-sm text-gray-700">{subcategory.name}</div>
                            <button
                              onClick={() => handleSubscribeToSubcategory(category.id, subcategory.id)}
                              disabled={isUpdating}
                              className="text-[#FF8A00] hover:text-[#e67e00] text-xs flex items-center"
                            >
                              {isUpdating ? (
                                <Loader2 size={12} className="animate-spin mr-1" />
                              ) : (
                                <Bell size={12} className="mr-1" />
                              )}
                              Subscribe
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No categories available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
