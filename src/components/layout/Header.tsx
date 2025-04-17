import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-[#1E2A36] py-8 rounded-lg mt-4">
      <div className="mx-7 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-[120px] h-[32px]">
            <Image
              src="/nordic logo.png"
              alt="Nordic Loop Logo"
              fill
              sizes="120px"
              priority
              loading="eager"
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex space-x-8">
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              About Us
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Market Place
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <Link
            href="/coming-soon"
            className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors font-medium"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
