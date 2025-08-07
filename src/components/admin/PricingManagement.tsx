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

            {/* Edit Plan Modal */}
            {editingPlan && (
              <EditPlanModal
                plan={editingPlan}
                onSave={handleUpdatePlan}
                onCancel={() => setEditingPlan(null)}
              />
            )}

            {/* Create Plan Modal */}
            {showCreatePlanForm && (
              <CreatePlanModal
                onSave={handleCreatePlan}
                onCancel={() => setShowCreatePlanForm(false)}
              />
            )}
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

            {/* Edit Feature Modal */}
            {editingFeature && (
              <EditFeatureModal
                feature={editingFeature}
                onSave={handleUpdateFeature}
                onCancel={() => setEditingFeature(null)}
              />
            )}

            {/* Create Feature Modal */}
            {showCreateFeatureForm && (
              <CreateFeatureModal
                onSave={handleCreateFeature}
                onCancel={() => setShowCreateFeatureForm(false)}
              />
            )}
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

            {/* Edit Content Modal */}
            {editingContent && (
              <EditContentModal
                content={editingContent}
                onSave={handleUpdateContent}
                onCancel={() => setEditingContent(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal Components
interface EditPlanModalProps {
  plan: PricingPlan;
  onSave: (plan: UpdatePricingPlanRequest) => void;
  onCancel: () => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: plan.id,
    name: plan.name,
    plan_type: plan.plan_type,
    price: parseFloat(plan.price.toString()),
    currency: plan.currency,
    color: plan.color,
    is_popular: plan.is_popular,
    is_active: plan.is_active,
    order: plan.order
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit Pricing Plan</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
            <select
              value={formData.plan_type}
              onChange={(e) => setFormData({ ...formData, plan_type: e.target.value as 'free' | 'standard' | 'premium' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
            >
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Popular Plan</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreatePlanModalProps {
  onSave: (plan: CreatePricingPlanRequest) => void;
  onCancel: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    plan_type: 'free' as 'free' | 'standard' | 'premium',
    price: 0,
    currency: 'SEK',
    color: '#008066',
    is_popular: false,
    is_active: true,
    order: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Create New Pricing Plan</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
            <select
              value={formData.plan_type}
              onChange={(e) => setFormData({ ...formData, plan_type: e.target.value as 'free' | 'standard' | 'premium' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
            >
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Popular Plan</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00]"
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Feature Modal Components
interface EditFeatureModalProps {
  feature: BaseFeature;
  onSave: (feature: UpdateBaseFeatureRequest) => void;
  onCancel: () => void;
}

const EditFeatureModal: React.FC<EditFeatureModalProps> = ({ feature, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: feature.id,
    name: feature.name,
    category: feature.category,
    base_description: feature.base_description,
    is_active: feature.is_active,
    order: feature.order
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = [
    'marketplace', 'auctions', 'reporting', 'support',
    'commission', 'verification', 'access', 'community'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit Base Feature</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feature Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description Template</label>
            <textarea
              value={formData.base_description}
              onChange={(e) => setFormData({ ...formData, base_description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              rows={3}
              placeholder="Use {value} for dynamic values"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use {'{value}'} as placeholder for plan-specific values</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreateFeatureModalProps {
  onSave: (feature: CreateBaseFeatureRequest) => void;
  onCancel: () => void;
}

const CreateFeatureModal: React.FC<CreateFeatureModalProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'marketplace',
    base_description: '',
    is_active: true,
    order: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = [
    'marketplace', 'auctions', 'reporting', 'support',
    'commission', 'verification', 'access', 'community'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Create New Base Feature</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feature Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              placeholder="e.g., marketplace_listings"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description Template</label>
            <textarea
              value={formData.base_description}
              onChange={(e) => setFormData({ ...formData, base_description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              rows={3}
              placeholder="e.g., {value} marketplace listings"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use {'{value}'} as placeholder for plan-specific values</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00]"
            >
              Create Feature
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Content Edit Modal Component
interface EditContentModalProps {
  content: PricingPageContent;
  onSave: (content: UpdatePricingPageContentRequest) => void;
  onCancel: () => void;
}

const EditContentModal: React.FC<EditContentModalProps> = ({ content, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: content.title,
    subtitle: content.subtitle,
    section_label: content.section_label,
    cta_text: content.cta_text,
    cta_url: content.cta_url
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-medium mb-4">Edit Pricing Page Content</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Label</label>
            <input
              type="text"
              value={formData.section_label}
              onChange={(e) => setFormData({ ...formData, section_label: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action Text</label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action URL</label>
            <input
              type="text"
              value={formData.cta_url}
              onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
            <div className="text-center">
              <h3 className="text-[#FF8A00] font-medium mb-1 text-sm">{formData.section_label}</h3>
              <h1 className="text-base font-bold mb-1">{formData.title}</h1>
              <p className="text-gray-600 text-xs mb-2">{formData.subtitle}</p>
              <button className="px-3 py-1 bg-[#FF8A00] text-white rounded text-xs">
                {formData.cta_text}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingManagement;
