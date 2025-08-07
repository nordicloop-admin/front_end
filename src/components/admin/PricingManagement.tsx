"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, Edit2, Trash2, Save, X, DollarSign, 
  Settings, Tag, List, Loader2, AlertCircle 
} from 'lucide-react';
import {
  getPricingData,
  getPricingPlans,
  getBaseFeatures,
  getAdminPricingPlans,
  updatePricingPlan,
  createPricingPlan,
  deletePricingPlan,
  updatePricingPageContent,
  createBaseFeature,
  updateBaseFeature,
  deleteBaseFeature,
  PricingPlan,
  BaseFeature,
  PricingPageContent,
  CreatePricingPlanRequest,
  UpdatePricingPlanRequest,
  CreateBaseFeatureRequest,
  UpdateBaseFeatureRequest,
  UpdatePricingPageContentRequest
} from '@/services/pricing';

interface PricingManagementProps {
  className?: string;
}

const PricingManagement: React.FC<PricingManagementProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'features' | 'content'>('plans');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [baseFeatures, setBaseFeatures] = useState<BaseFeature[]>([]);
  const [pageContent, setPageContent] = useState<PricingPageContent | null>(null);

  // Edit states
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [editingFeature, setEditingFeature] = useState<BaseFeature | null>(null);
  const [editingContent, setEditingContent] = useState<PricingPageContent | null>(null);

  // Form states
  const [showCreatePlanForm, setShowCreatePlanForm] = useState(false);
  const [showCreateFeatureForm, setShowCreateFeatureForm] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, use public endpoints since admin auth might not be set up
      const [plansResponse, featuresResponse, contentResponse] = await Promise.all([
        getPricingPlans(), // Use public endpoint for now
        getBaseFeatures(),
        getPricingData()
      ]);

      if (plansResponse.error) {
        throw new Error(plansResponse.error);
      }
      if (featuresResponse.error) {
        throw new Error(featuresResponse.error);
      }
      if (contentResponse.error) {
        throw new Error(contentResponse.error);
      }

      // Handle paginated responses for both plans and features
      const plansData = plansResponse.data?.results || plansResponse.data;
      setPricingPlans(Array.isArray(plansData) ? plansData : []);

      const featuresData = featuresResponse.data?.results || featuresResponse.data;
      setBaseFeatures(Array.isArray(featuresData) ? featuresData : []);

      setPageContent(contentResponse.data?.data?.page_content || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing data');
    } finally {
      setIsLoading(false);
    }
  };

  // Plan management functions
  const handleCreatePlan = async (planData: CreatePricingPlanRequest) => {
    try {
      const response = await createPricingPlan(planData);
      if (response.error) {
        toast.error('Failed to create plan', { description: response.error });
        return;
      }
      
      toast.success('Plan created successfully');
      setShowCreatePlanForm(false);
      loadData();
    } catch (err) {
      toast.error('Failed to create plan');
    }
  };

  const handleUpdatePlan = async (planData: UpdatePricingPlanRequest) => {
    try {
      const response = await updatePricingPlan(planData);
      if (response.error) {
        toast.error('Failed to update plan', { description: response.error });
        return;
      }
      
      toast.success('Plan updated successfully');
      setEditingPlan(null);
      loadData();
    } catch (err) {
      toast.error('Failed to update plan');
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const response = await deletePricingPlan(planId);
      if (response.error) {
        toast.error('Failed to delete plan', { description: response.error });
        return;
      }
      
      toast.success('Plan deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete plan');
    }
  };

  // Feature management functions
  const handleCreateFeature = async (featureData: CreateBaseFeatureRequest) => {
    try {
      const response = await createBaseFeature(featureData);
      if (response.error) {
        toast.error('Failed to create feature', { description: response.error });
        return;
      }
      
      toast.success('Feature created successfully');
      setShowCreateFeatureForm(false);
      loadData();
    } catch (err) {
      toast.error('Failed to create feature');
    }
  };

  const handleUpdateFeature = async (featureData: UpdateBaseFeatureRequest) => {
    try {
      const response = await updateBaseFeature(featureData);
      if (response.error) {
        toast.error('Failed to update feature', { description: response.error });
        return;
      }
      
      toast.success('Feature updated successfully');
      setEditingFeature(null);
      loadData();
    } catch (err) {
      toast.error('Failed to update feature');
    }
  };

  const handleDeleteFeature = async (featureId: number) => {
    if (!confirm('Are you sure you want to delete this feature? This will affect all plans using it.')) return;
    
    try {
      const response = await deleteBaseFeature(featureId);
      if (response.error) {
        toast.error('Failed to delete feature', { description: response.error });
        return;
      }
      
      toast.success('Feature deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete feature');
    }
  };

  // Content management functions
  const handleUpdateContent = async (contentData: UpdatePricingPageContentRequest) => {
    try {
      const response = await updatePricingPageContent(contentData);
      if (response.error) {
        toast.error('Failed to update content', { description: response.error });
        return;
      }
      
      toast.success('Content updated successfully');
      setEditingContent(null);
      loadData();
    } catch (err) {
      toast.error('Failed to update content');
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#FF8A00] mr-2" size={24} />
          <span className="text-gray-600">Loading pricing management...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="text-red-500 mr-2" size={24} />
          <div className="text-center">
            <p className="text-red-600 font-medium">Failed to load pricing data</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing Management</h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'plans'
                ? 'bg-white text-[#FF8A00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign size={16} className="mr-2" />
            Pricing Plans
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'features'
                ? 'bg-white text-[#FF8A00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List size={16} className="mr-2" />
            Base Features
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-white text-[#FF8A00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings size={16} className="mr-2" />
            Page Content
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'plans' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Pricing Plans</h3>
              <button
                onClick={() => setShowCreatePlanForm(true)}
                className="flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Plan
              </button>
            </div>
            
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(pricingPlans) && pricingPlans.length > 0 ? pricingPlans.map((plan) => (
                <div key={plan.id} className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{plan.plan_type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="p-2 text-gray-400 hover:text-[#FF8A00] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-end mb-2">
                      <span className="text-2xl font-bold">
                        {plan.price === '0.00' ? 'Free' : `${plan.price} ${plan.currency}`}
                      </span>
                      {plan.price !== '0.00' && <span className="text-gray-500 ml-1">/ month</span>}
                    </div>
                    {plan.is_popular && (
                      <span className="inline-block bg-[#FF8A00] text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {plan.features.length} features configured
                    </p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className={`px-2 py-1 rounded ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500">Order: {plan.order}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No pricing plans found.</p>
                  <button
                    onClick={() => setShowCreatePlanForm(true)}
                    className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
                  >
                    Create First Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Base Features</h3>
              <button
                onClick={() => setShowCreateFeatureForm(true)}
                className="flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Feature
              </button>
            </div>
            
            {/* Features Table */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(baseFeatures) && baseFeatures.length > 0 ? baseFeatures.map((feature) => (
                    <tr key={feature.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                        <div className="text-sm text-gray-500">Order: {feature.order}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {feature.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {feature.base_description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feature.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {feature.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingFeature(feature)}
                            className="text-[#FF8A00] hover:text-[#e67e00]"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <p className="text-gray-500">No base features found.</p>
                        <button
                          onClick={() => setShowCreateFeatureForm(true)}
                          className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
                        >
                          Create First Feature
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Page Content</h3>
              <button
                onClick={() => setEditingContent(pageContent)}
                className="flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Content
              </button>
            </div>
            
            {/* Content Display */}
            {pageContent && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Section Label</h4>
                    <p className="text-sm text-gray-600 mb-4">{pageContent.section_label}</p>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">Title</h4>
                    <p className="text-sm text-gray-600 mb-4">{pageContent.title}</p>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">Subtitle</h4>
                    <p className="text-sm text-gray-600">{pageContent.subtitle}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Call to Action</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Text:</span> {pageContent.cta_text}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">URL:</span> {pageContent.cta_url}
                      </p>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                      <div className="border rounded-lg p-4 bg-white">
                        <div className="text-center">
                          <h3 className="text-[#FF8A00] font-medium mb-2">{pageContent.section_label}</h3>
                          <h1 className="text-lg font-bold mb-2">{pageContent.title}</h1>
                          <p className="text-gray-600 text-sm mb-4">{pageContent.subtitle}</p>
                          <button className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm">
                            {pageContent.cta_text}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingManagement;
