"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <main className="flex-1 w-full">
        {children}
      </main>
    );
  }

  const isAuthPage = pathname === '/login' ||
                    pathname === '/register' ||
                    pathname === '/register/success' ||
                    pathname === '/signup';

  const isDashboardPage = pathname === '/dashboard' ||
                         pathname.startsWith('/dashboard/');

  const isAdminPage = pathname === '/admin' ||
                     pathname.startsWith('/admin/');

  return (
    <>
      {!isAuthPage && !isDashboardPage && !isAdminPage && (
        <div className="max-w-[86%] mx-auto">
          <Header />
        </div>
      )}
      <main className={`flex-1 ${!isAuthPage && !isDashboardPage && !isAdminPage ? 'max-w-[86%] mx-auto w-full' : 'w-full'}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && !isAdminPage && <Footer />}
    </>
  );
}
