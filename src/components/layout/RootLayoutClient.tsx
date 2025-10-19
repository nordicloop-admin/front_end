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

  // Pages that should NOT display the global Header/Footer (auth-like isolated layout)
  const isAuthPage = pathname === '/login' ||
                    pathname === '/register' ||
                    pathname === '/register/success' ||
                    pathname === '/signup' ||
                    pathname.startsWith('/activate'); // account activation flow (verify & set-password)

  const isDashboardPage = pathname === '/dashboard' ||
                         pathname.startsWith('/dashboard/');

  const isAdminPage = pathname === '/admin' ||
                     pathname.startsWith('/admin/');

  const isHomePage = pathname === '/';

  return (
    <>
      {!isAuthPage && !isDashboardPage && !isAdminPage && !isHomePage && (
        <div className="max-w-[86%] mx-auto">
          <Header />
        </div>
      )}
      <main className={`flex-1 ${!isAuthPage && !isDashboardPage && !isAdminPage && !isHomePage ? 'max-w-[86%] mx-auto w-full' : 'w-full'}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && !isAdminPage && !isHomePage && <Footer />}
    </>
  );
}
