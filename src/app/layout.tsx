import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nordic Loop - The Marketplace Where Waste Becomes a Resource",
  description: "Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
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
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MMV2RE5J6S" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MMV2RE5J6S');
          `}
        </Script>

        {/* EmailJS */}
        <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" strategy="beforeInteractive" />
        <Script id="emailjs-init" strategy="afterInteractive">
          {`
            (function() {
              if (window.emailjs) {
                window.emailjs.init('${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY}');
              }
            })();
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-[86%] mx-auto">
          <Header />
        </div>
        <main className="flex-1">
          <div className="max-w-[86%] mx-auto w-full">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
