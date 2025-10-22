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

  // Pages that should have full-width navbar on mobile
  const isFullWidthNavPage = pathname === '/' ||
                            pathname === '/market-place' ||
                            pathname === '/about' ||
                            pathname === '/pricing' ||
                            pathname === '/contact';

  return (
    <>
      {!isAuthPage && !isDashboardPage && !isAdminPage && (
        <div className={isFullWidthNavPage ? "w-full md:max-w-[86%] md:mx-auto" : "max-w-[86%] mx-auto"}>
          <Header />
        </div>
      )}
      <main className={`flex-1 ${!isAuthPage && !isDashboardPage && !isAdminPage && !isFullWidthNavPage ? 'max-w-[86%] mx-auto w-full' : 'w-full'}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && !isAdminPage && <Footer />}
    </>
  );
}
