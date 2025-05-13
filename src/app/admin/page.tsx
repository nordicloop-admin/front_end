"use client";

import React from 'react';
import Link from 'next/link';
import { Building, Users, Clock, Plus } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Companies Card */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-medium text-gray-700">Companies</h2>
            <div className="text-blue-500">
              <Building size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">0</div>
          <div className="text-xs text-gray-500 mb-2">Total registered companies</div>
          <Link
            href="/admin/companies"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium"
          >
            View all companies →
          </Link>
        </div>

        {/* Users Card */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-medium text-gray-700">Users</h2>
            <div className="text-green-500">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">0</div>
          <div className="text-xs text-gray-500 mb-2">Total registered users</div>
          <Link
            href="/admin/users"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium"
          >
            View all users →
          </Link>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-medium text-gray-700">Pending Approvals</h2>
            <div className="text-yellow-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">0</div>
          <div className="text-xs text-gray-500 mb-2">Companies awaiting approval</div>
          <Link
            href="/admin/companies?status=pending"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium"
          >
            Review pending companies →
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-100 rounded-md p-5 mb-8">
        <h2 className="text-base font-medium text-gray-700 mb-3">Recent Activity</h2>
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-5 text-sm text-gray-500 text-center" colSpan={3}>
                  No recent activity
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <h2 className="text-base font-medium text-gray-700 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/companies/new"
              className="flex items-center px-4 py-2.5 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} className="text-gray-400 mr-3" />
              <span className="text-sm">Add New Company</span>
            </Link>
            <Link
              href="/admin/users/new"
              className="flex items-center px-4 py-2.5 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} className="text-gray-400 mr-3" />
              <span className="text-sm">Add New User</span>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white border border-gray-100 rounded-md p-5">
          <h2 className="text-base font-medium text-gray-700 mb-3">System Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Database</span>
                <span className="text-xs text-green-600">Online</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">API</span>
                <span className="text-xs text-green-600">Online</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Storage</span>
                <span className="text-xs text-green-600">75% Free</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
