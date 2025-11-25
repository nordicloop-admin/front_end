import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import RootLayoutClient from "../components/layout/RootLayoutClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from 'sonner';

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nordic Loop - The Marketplace Where Waste Becomes a Resource",
  description: "Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nordic Loop',
  },
  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nordicloop.onrender.com/',
    siteName: 'Nordic Loop',
    title: 'Nordic Loop - The Marketplace Where Waste Becomes a Resource',
    description: 'Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.',
    images: [
      {
        url: 'https://nordicloop.onrender.com/og.png',
        width: 512,
        height: 512,
        alt: 'Nordic Loop Logo',
      },
    ],
  },
  // Twitter card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Nordic Loop - The Marketplace Where Waste Becomes a Resource',
    description: 'Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.',
    images: ['https://nordicloop.onrender.com/og.png'],
    creator: '@nordicloop',
  },
  // Canonical URL
  alternates: {
    canonical: 'https://nordicloop.onrender.com/',
  },
};

export const viewport: Viewport = {
  themeColor: '#1E2A36',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon links for better compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon_io/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <meta name="theme-color" content="#1E2A36" />

        {/* Google Analytics */}
        {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-MMV2RE5J6S" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MMV2RE5J6S');
          `}
        </Script> */}

        {/* EmailJS */}
        <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" strategy="beforeInteractive" />
        <Script id="emailjs-init" strategy="afterInteractive">
          {`
            (function() {
              if (window.emailjs && '${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''}') {
                window.emailjs.init('${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''}');
              }
            })();
          `}
        </Script>
      </head>
      <body
        className={`${interTight.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <RootLayoutClient>
              <Toaster position="top-right" richColors />
              {children}
            </RootLayoutClient>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
