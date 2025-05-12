"use client";

import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from '@/components/ui/Icons';

interface SortDropdownProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

export function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  const sortOptions = [
    'Recently',
    'Price: Low to High',
    'Price: High to Low',
    'Alphabetical'
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-gray-100 rounded-md"
        >
          <span>{sortOption}</span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option}
            onClick={() => setSortOption(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
