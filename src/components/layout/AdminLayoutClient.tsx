"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col z-50",
          isMobile
            ? `fixed inset-y-0 left-0 w-[250px] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div className="bg-[#0F1A24] text-white flex items-center justify-center h-[60px]">
          <Image
            src="/nordic logo.png"
            alt="Nordic Loop"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Admin Panel
          </div>
          
          <Link
            href="/admin"
            className={`flex items-center px-4 py-3 ${pathname === '/admin' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/admin/companies"
            className={`flex items-center px-4 py-3 ${pathname === '/admin/companies' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Companies
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center px-4 py-3 ${pathname === '/admin/users' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </Link>

          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settings
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-[60px] flex items-center justify-between px-4 md:px-6">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex-1 flex justify-end items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                Admin
              </span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
