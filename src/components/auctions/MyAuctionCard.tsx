"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, ArrowUpRight } from 'lucide-react';

interface MyAuctionCardProps {
  id: string;
  name: string;
  category: string;
  volume: string;
  basePrice: string;
  timeLeft: string | null | undefined;
  image: string;
  status?: string;            // raw status (maybe from parent)
  auctionStatus?: string;     // human readable status (badge)
  isComplete?: boolean;       // indicates form completion (eligibility to publish)
  /** Layout variant */
  variant?: 'default' | 'compact' | 'horizontal';
  onEditClick?: () => void;
  onPublishClick?: (id: string) => void;
  onUnpublishClick?: (id: string) => void;
}

export default function MyAuctionCard(props: MyAuctionCardProps) {
  const {
    id,
    name,
    category,
    volume,
    basePrice,
    timeLeft,
    image,
    status,
    auctionStatus,
    isComplete,
    variant = 'default',
    onPublishClick,
    onUnpublishClick,
  } = props;

  // Derived status flags
  const normalizedStatus = (status || auctionStatus || 'draft').toLowerCase();
  const isLive = normalizedStatus === 'active';
  const isFinal = ['completed', 'won', 'closed', 'ended'].includes(normalizedStatus);
  const isSuspended = normalizedStatus === 'suspended';
  const canToggle = !!isComplete && !isFinal && !isSuspended;

  // Sizing tokens
  const cardPadding = variant === 'compact' ? 'p-3' : 'p-4';
  const mediaHeight = variant === 'compact' ? 'h-28' : 'h-32';

  const StatusBadges = (
    <div className="absolute top-2 left-2 flex flex-wrap gap-2">
      {auctionStatus && (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/85 px-2 py-0.5 text-[10px] font-medium text-gray-600 shadow-sm"
          aria-label={`Status: ${auctionStatus}`}
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isLive
                ? 'bg-emerald-500'
                : isSuspended
                  ? 'bg-red-500'
                  : isFinal
                    ? 'bg-blue-500'
                    : !isComplete
                      ? 'bg-gray-400'
                      : 'bg-amber-500'
            }`}
          />
          {auctionStatus}
        </span>
      )}
      {!isComplete && !isFinal && (
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-gray-500" aria-label="Incomplete setup">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" /> Incomplete
        </span>
      )}
    </div>
  );

  const ActionButtons = (
    <>
      {canToggle && !isLive && (
        <button
          onClick={() => onPublishClick && onPublishClick(id)}
          className="publish-attract flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#FF8A00] bg-[#FF8A00] px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)] hover:bg-[#e67800] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00]/50 active:scale-[0.985] transition-all"
          aria-label="Publish auction"
        >
          <Play className="h-4 w-4 transition-transform duration-300" />
          <span className="tracking-wide">Publish</span>
        </button>
      )}
      {canToggle && isLive && (
        <button
          onClick={() => onUnpublishClick && onUnpublishClick(id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300/40 active:scale-[0.98] transition"
          aria-label="Unpublish auction"
        >
          <Pause className="h-3.5 w-3.5" /> Unpublish
        </button>
      )}
      {/* View button with label */}
      <Link
        href={`/dashboard/my-auctions/${id}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300/40 transition"
        aria-label="View auction"
      >
        View <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </>
  );

  const MetaGrid = (
    <div className="grid grid-cols-3 gap-2 text-[11px]">
      <div className="flex flex-col">
        <span className="text-gray-400 uppercase tracking-wide">Category</span>
        <span className="font-medium text-gray-700 truncate">{category}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-400 uppercase tracking-wide">Volume</span>
        <span className="font-medium text-gray-700 truncate">{volume}</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-400 uppercase tracking-wide">{timeLeft ? 'Time left' : 'State'}</span>
        <span className={`font-medium ${isLive ? 'text-emerald-600' : 'text-gray-600'}`}>{timeLeft ? timeLeft : 'Draft'}</span>
      </div>
    </div>
  );

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div
        className="group relative flex flex-col md:flex-row rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors duration-200 overflow-hidden"
        role="article"
        aria-labelledby={`auction-title-${id}`}
        data-status={normalizedStatus}
      >
        <div className="relative w-full md:w-56 h-40 md:h-auto shrink-0 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 224px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          {StatusBadges}
        </div>
        <div className="flex flex-col md:flex-row flex-1 min-w-0">
          <div className="flex-1 px-4 py-4 md:py-5 flex flex-col gap-4">
            <div>
              <h3 id={`auction-title-${id}`} className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2 mb-2">{name}</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="flex flex-col">
                  <span className="text-gray-400 uppercase tracking-wide">Category</span>
                  <span className="font-medium text-gray-700 truncate">{category}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 uppercase tracking-wide">Volume</span>
                  <span className="font-medium text-gray-700 truncate">{volume}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 uppercase tracking-wide">{timeLeft ? 'Time left' : 'State'}</span>
                  <span className={`font-medium ${isLive ? 'text-emerald-600' : 'text-gray-600'}`}>{timeLeft ? timeLeft : 'Draft'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 uppercase tracking-wide">Price</span>
                  <span className="font-semibold text-[#d26f00] truncate">{basePrice}</span>
                </div>
              </div>
            </div>
            {!isComplete && !isFinal && (
              <div className="flex items-center gap-2">
                <div className="h-1 w-full bg-gray-200 rounded">
                  <div className="h-1 bg-gray-400 rounded w-1/4" />
                </div>
                <span className="text-[10px] text-gray-500">Setup</span>
              </div>
            )}
          </div>
          <div className="md:w-56 border-t md:border-t-0 md:border-l border-gray-200 flex md:flex-col items-stretch gap-2 p-3 md:p-4 bg-gray-50 md:bg-white">
            {ActionButtons}
          </div>
        </div>
        <style jsx>{`
          @keyframes attractPulse { 0% { box-shadow:0 0 0 0 rgba(255,138,0,.42);} 70% { box-shadow:0 0 0 11px rgba(255,138,0,0);} 100% { box-shadow:0 0 0 0 rgba(255,138,0,0);} }
          .publish-attract { position:relative; }
          .publish-attract:not(:hover):not(:active){ animation:attractPulse 3.6s ease-in-out infinite; }
          .publish-attract:hover svg { transform:translateX(3px); }
          @media (prefers-reduced-motion: reduce){ .publish-attract:not(:hover):not(:active){ animation:none; } }
        `}</style>
      </div>
    );
  }

  // Default vertical variants (default / compact share structure)
  return (
    <div
      className="relative group rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200 overflow-hidden flex flex-col"
      role="article"
      aria-labelledby={`auction-title-${id}`}
      data-status={normalizedStatus}
    >
      <div className={`relative ${mediaHeight} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="384px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        {StatusBadges}
      </div>
      <div className={`flex flex-col gap-3 ${cardPadding} flex-1`}>
        <h3 id={`auction-title-${id}`} className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2">{name}</h3>
        {MetaGrid}
        <div>
          <span className="text-[11px] uppercase tracking-wide text-gray-400">Starting price</span>
          <div className="text-lg font-semibold text-[#d26f00] leading-tight mt-0.5">{basePrice}</div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-white px-3 py-2 flex items-center gap-2">
        {ActionButtons}
      </div>
      <style jsx>{`
        @keyframes attractPulse { 0% { box-shadow:0 0 0 0 rgba(255,138,0,.42);} 70% { box-shadow:0 0 0 11px rgba(255,138,0,0);} 100% { box-shadow:0 0 0 0 rgba(255,138,0,0);} }
        .publish-attract { position:relative; }
        .publish-attract:not(:hover):not(:active){ animation:attractPulse 3.6s ease-in-out infinite; }
        .publish-attract:hover svg { transform:translateX(3px); }
        @media (prefers-reduced-motion: reduce){ .publish-attract:not(:hover):not(:active){ animation:none; } }
      `}</style>
    </div>
  );
}
