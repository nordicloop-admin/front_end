"use client";

import { usePathname } from 'next/navigation';
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' ||
                    pathname === '/register' ||
                    pathname === '/register/success' ||
                    pathname === '/signup';

  const isDashboardPage = pathname === '/dashboard' ||
                         pathname.startsWith('/dashboard/');

  return (
    <>
      {!isAuthPage && !isDashboardPage && (
        <div className="max-w-[86%] mx-auto">
          <Header />
        </div>
      )}
      <main className={`flex-1 ${!isAuthPage && !isDashboardPage ? 'max-w-[86%] mx-auto w-full' : 'w-full'}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </>
  );
}
