"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuctionFormData } from '@/components/auctions/AddAuctionModal';

interface AuctionContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleAddAuction: (auctionData: AuctionFormData) => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export function useAuction() {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
}

interface AuctionProviderProps {
  children: ReactNode;
  onAddAuction?: (auctionData: AuctionFormData) => void;
}

export function AuctionProvider({ children, onAddAuction }: AuctionProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddAuction = (auctionData: AuctionFormData) => {
    if (onAddAuction) {
      onAddAuction(auctionData);
    }
    closeModal();
  };

  return (
    <AuctionContext.Provider value={{ isModalOpen, openModal, closeModal, handleAddAuction }}>
      {children}
    </AuctionContext.Provider>
  );
}
