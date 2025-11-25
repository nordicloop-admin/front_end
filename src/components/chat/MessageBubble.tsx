"use client";

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  Truck,
  Package,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Attachment {
  type: 'image' | 'document' | 'certificate';
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}

// Enhanced attachment interfaces matching chat service schema
interface ImageAttachment {
  image_name: string;
  image_url: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
  uploaded_at: string;
}

interface FileAttachment {
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface MessageBubbleProps {
  id: string;
  type: 'text' | 'image' | 'file' | 'document' | 'system' | 'delivery_confirmation' | 'quality_report' | 'shipping_update';
  content?: string;
  sender: 'buyer' | 'seller' | 'moderator' | 'system';
  timestamp: Date;
  // Legacy attachments (for backward compatibility)
  attachments?: Attachment[];
  // New chat service attachments
  imageAttachment?: ImageAttachment;
  fileAttachment?: FileAttachment;
  isRead?: boolean;
  deliveryStatus?: 'sent' | 'delivered' | 'read';
  isCurrentUser: boolean;
  language?: 'en' | 'sv';
  metadata?: {
    shippingTrackingNumber?: string;
    qualityRating?: number;
    issueType?: string;
    deliveryDate?: string;
  };
}

const translations = {
  en: {
    deliveryConfirmed: "Delivery confirmed",
    qualityApproved: "Quality approved",
    issueReported: "Issue reported",
    shippingUpdate: "Shipping update",
    trackingNumber: "Tracking",
    qualityRating: "Quality rating",
    downloadAttachment: "Download",
    viewImage: "View image",
    certificate: "Certificate",
    moderator: "Platform Moderator",
    autoResponse: "Auto-response",
    outOfOffice: "Currently out of office. Will respond within 24 hours."
  },
  sv: {
    deliveryConfirmed: "Leverans bekräftad",
    qualityApproved: "Kvalitet godkänd",
    issueReported: "Problem rapporterat",
    shippingUpdate: "Leveransuppdatering",
    trackingNumber: "Spårning",
    qualityRating: "Kvalitetsbetyg",
    downloadAttachment: "Ladda ner",
    viewImage: "Visa bild",
    certificate: "Certifikat",
    moderator: "Plattformsmoderator",
    autoResponse: "Automatiskt svar",
    outOfOffice: "För närvarande inte på kontoret. Svarar inom 24 timmar."
  }
};

export function MessageBubble({
  id: _id,
  type,
  content = '',
  sender,
  timestamp,
  attachments = [],
  imageAttachment,
  fileAttachment,
  isRead: _isRead = false,
  deliveryStatus,
  isCurrentUser,
  language = 'en',
  metadata = {}
}: MessageBubbleProps) {
  const t = translations[language];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'sv' ? 'sv-SE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSenderLabel = () => {
    if (sender === 'moderator') return t.moderator;
    if (sender === 'system') return '';
    return sender.charAt(0).toUpperCase() + sender.slice(1);
  };

  const getMessageIcon = () => {
    switch (type) {
      case 'delivery_confirmation':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'quality_report':
        return <Package size={16} className="text-blue-600" />;
      case 'shipping_update':
        return <Truck size={16} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const renderSystemMessage = () => (
    <div className="flex justify-center">
      <div className="bg-gray-100 text-gray-700 text-center text-sm rounded-lg px-4 py-2 max-w-md">
        <div className="flex items-center justify-center space-x-2">
          {getMessageIcon()}
          <span>{content}</span>
        </div>
        {metadata.shippingTrackingNumber && (
          <div className="mt-2 text-xs text-gray-500">
            {t.trackingNumber}: {metadata.shippingTrackingNumber}
          </div>
        )}
        {metadata.deliveryDate && (
          <div className="mt-1 text-xs text-gray-500">
            {metadata.deliveryDate}
          </div>
        )}
      </div>
    </div>
  );

  const renderQualityReport = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Package size={16} className="text-blue-600" />
        <span className="font-medium">{t.qualityApproved}</span>
      </div>
      <p className="text-sm">{content}</p>
      {metadata.qualityRating && (
        <div className="flex items-center space-x-2 text-sm">
          <span>{t.qualityRating}:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={cn(
                  "text-lg",
                  star <= metadata.qualityRating! ? "text-yellow-400" : "text-gray-300"
                )}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderImageAttachment = () => {
    if (!imageAttachment) return null;

    // Calculate aspect ratio and determine preview dimensions
    const aspectRatio = imageAttachment.width && imageAttachment.height 
      ? imageAttachment.width / imageAttachment.height 
      : 1;
    
    // Set max height for preview (similar to WhatsApp - around 400px)
    const maxHeight = 400;
    const maxWidth = 300;
    
    // Calculate preview dimensions maintaining aspect ratio
    let previewWidth = maxWidth;
    let previewHeight = maxWidth / aspectRatio;
    
    if (previewHeight > maxHeight) {
      previewHeight = maxHeight;
      previewWidth = maxHeight * aspectRatio;
    }

    const handleImageClick = () => {
      window.open(imageAttachment.image_url, '_blank');
    };

    const handleImageKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleImageClick();
      }
    };

    return (
      <div 
        className="mt-2 rounded-lg overflow-hidden cursor-pointer group relative"
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View image: ${imageAttachment.image_name || 'Image'}`}
      >
        <div className="relative" style={{ width: `${previewWidth}px`, height: `${previewHeight}px`, maxWidth: '100%' }}>
          {/* Use regular img tag for external URLs - Next.js Image requires explicit domain configuration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageAttachment.image_url}
            alt={imageAttachment.image_name || 'Image'}
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: `${maxHeight}px` }}
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
        </div>
        {/* Optional: Show file name and size below image if provided */}
        {imageAttachment.image_name && (
          <div className="mt-1 px-1">
            <p className="text-xs text-gray-600 truncate">{imageAttachment.image_name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(imageAttachment.file_size)}</p>
          </div>
        )}
      </div>
    );
  };

  const renderFileAttachment = () => {
    if (!fileAttachment) return null;

    // Get file extension for icon/type display
    const fileExtension = fileAttachment.file_name.split('.').pop()?.toUpperCase() || 'FILE';
    
    return (
      <div className="mt-2 rounded-lg overflow-hidden border" 
           style={{
             backgroundColor: isCurrentUser ? 'rgba(255, 255, 255, 0.15)' : '#f9fafb',
             borderColor: isCurrentUser ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'
           }}>
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 rounded flex-shrink-0"
                 style={{
                   backgroundColor: isCurrentUser ? 'rgba(255, 255, 255, 0.2)' : '#ffffff'
                 }}>
              <FileText size={20} 
                       style={{ color: isCurrentUser ? '#ffffff' : '#374151' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate",
                isCurrentUser ? "text-white" : "text-gray-900"
              )}>
                {fileAttachment.file_name}
              </p>
              <p className={cn(
                "text-xs mt-0.5",
                isCurrentUser ? "text-white/80" : "text-gray-500"
              )}>
                {formatFileSize(fileAttachment.file_size)}
                {fileAttachment.mime_type && ` • ${fileExtension}`}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              // Create a temporary anchor to download the file
              const link = document.createElement('a');
              link.href = fileAttachment.file_url;
              link.download = fileAttachment.file_name;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
            title={t.downloadAttachment}
            className={cn(
              "ml-2 flex-shrink-0",
              isCurrentUser 
                ? "text-white hover:bg-white/20" 
                : "text-gray-600 hover:bg-gray-200"
            )}
          >
            <Download size={16} />
          </Button>
        </div>
      </div>
    );
  };

  const renderAttachments = () => (
    <div className="mt-3 space-y-2">
      {attachments.map((attachment, index) => (
        <div key={`${attachment.name}-${index}`} className="border rounded-lg overflow-hidden">
          {attachment.type === 'image' ? (
            <div className="relative">
              {attachment.thumbnail ? (
                <Image
                  src={attachment.thumbnail}
                  alt={attachment.name}
                  width={300}
                  height={200}
                  className="w-full h-auto max-h-48 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="bg-white/90 hover:bg-white"
                >
                  <Download size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded">
                  {attachment.type === 'certificate' ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <FileText size={16} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                  {attachment.size && (
                    <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                  )}
                  {attachment.type === 'certificate' && (
                    <p className="text-xs text-green-600">{t.certificate}</p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(attachment.url, '_blank')}
                title={t.downloadAttachment}
              >
                <Download size={14} />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderAutoResponse = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock size={14} />
        <span>{t.autoResponse}</span>
      </div>
      <p className="text-sm">{content || t.outOfOffice}</p>
    </div>
  );

  if (type === 'system' || type === 'shipping_update') {
    return renderSystemMessage();
  }

  return (
    <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[70%] space-y-1">
        {/* Sender label for non-current users */}
        {!isCurrentUser && sender !== 'system' && (
          <div className="text-xs text-gray-500 px-1">
            {getSenderLabel()}
          </div>
        )}

        <div
          className={cn(
            "rounded-lg px-4 py-3",
            isCurrentUser
              ? "bg-[#FF8A00] text-white"
              : sender === 'moderator'
                ? "bg-blue-50 text-blue-900 border border-blue-200"
                : "bg-gray-100 text-gray-900"
          )}
        >
          {/* Message Content */}
          {type === 'image' ? (
            <>
              {content && <p className="whitespace-pre-wrap mb-2">{content}</p>}
              {renderImageAttachment()}
            </>
          ) : type === 'file' || type === 'document' ? (
            <>
              {content && <p className="whitespace-pre-wrap mb-2">{content}</p>}
              {renderFileAttachment()}
            </>
          ) : content.includes('auto-response') || content.includes('out of office') ? (
            renderAutoResponse()
          ) : type === 'quality_report' ? (
            renderQualityReport()
          ) : type === 'delivery_confirmation' ? (
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-green-300" />
              <span>{content}</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
          )}

          {/* Legacy Attachments (backward compatibility) */}
          {attachments.length > 0 && renderAttachments()}

          {/* Message footer */}
          <div className="flex items-center justify-between mt-2 pt-1">
            <span className={cn(
              "text-xs",
              isCurrentUser ? "text-white/75" : "text-gray-500"
            )}>
              {formatTime(timestamp)}
            </span>

            {isCurrentUser && deliveryStatus && (
              <div className="flex items-center space-x-1">
                <CheckCircle2
                  size={12}
                  className={cn(
                    deliveryStatus === 'read' ? 'text-blue-300' :
                      deliveryStatus === 'delivered' ? 'text-white/75' : 'text-white/50'
                  )}
                />
                {deliveryStatus === 'read' && (
                  <CheckCircle2 size={12} className="text-blue-300 -ml-2" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
