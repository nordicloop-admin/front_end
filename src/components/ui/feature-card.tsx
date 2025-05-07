"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "bg-white/95 rounded-lg p-7 flex flex-col items-start text-left transition-all duration-300 hover:bg-white",
      className
    )}>
      <div className="mb-5 text-[#FF8A00]/70">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[#1E2A36] mb-3">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">{description}</p>
    </div>
  );
}
