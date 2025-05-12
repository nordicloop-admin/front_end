"use client";

import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from '@/components/ui/Icons';

interface FilterDropdownProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
}

export function FilterDropdown({
  label,
  children,
  className = "",
  contentClassName = "",
  triggerClassName = "",
}: FilterDropdownProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center justify-between px-4 py-3 bg-white min-w-[180px] border-r border-gray-200 ${triggerClassName}`}
          >
            <span className="mr-2 font-medium">{label}</span>
            <ChevronDown size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className={`w-[280px] max-w-[90vw] p-0 ${contentClassName}`}
          align="start"
          sideOffset={5}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
