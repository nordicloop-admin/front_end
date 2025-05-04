"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface DesignToggleProps {
  originalPath: string;
  alternativePath: string;
}

const DesignToggle: React.FC<DesignToggleProps> = ({ originalPath, alternativePath }) => {
  const pathname = usePathname();

  const isAlternative = pathname === alternativePath;

  return (
    <div className="fixed top-24 right-8 z-50 bg-white rounded-lg shadow-lg p-4">
      <div className="text-sm font-medium mb-2 text-[#1E2A36]">Design Version:</div>
      <div className="flex space-x-2">
        <Link
          href={originalPath}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            !isAlternative
              ? 'bg-[#1E2A36] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Original
        </Link>
        <Link
          href={alternativePath}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isAlternative
              ? 'bg-[#1E2A36] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Alternative
        </Link>
      </div>
    </div>
  );
};

export default DesignToggle;
