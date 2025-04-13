import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-[#1E2A36] py-4 px-8 rounded-lg mx-4 mt-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-[150px] h-[40px]">
            <Image
              src="/logo.png"
              alt="Nordic Loop Logo"
              fill
              priority
              className="invert object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              About Us
            </Link>
            <Link href="/marketplace" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Market Place
            </Link>
            <Link href="/pricing" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <Link
            href="/login"
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
