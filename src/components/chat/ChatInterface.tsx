"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileUpload } from './FileUpload';
import { MessageBubble } from './MessageBubble';

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

interface Message {
  id: string;
  type: 'text' | 'image' | 'document' | 'file' | 'system' | 'delivery_confirmation' | 'quality_report' | 'shipping_update';
  content: string;
  sender: 'buyer' | 'seller' | 'moderator' | 'system';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document' | 'certificate';
    url: string;
    name: string;
    size?: number;
  }[];
  // New chat service attachments
  imageAttachment?: ImageAttachment;
  fileAttachment?: FileAttachment;
  isRead?: boolean;
  deliveryStatus?: 'sent' | 'delivered' | 'read';
}

interface OrderContext {
  orderId: string;
  materialName: string;
  quantity: string;
  price: string;
  shippingAddress: string;
  estimatedDelivery: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'completed';
}

interface ChatInterfaceProps {
  orderContext: OrderContext;
  messages: Message[];
  currentUser: 'buyer' | 'seller';
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  language?: 'en' | 'sv';
  onSendMessage: (message: string, attachments?: File[]) => void;
  onSendImageMessage?: (imageFile: File, message?: string) => Promise<void>;
  onSendFileMessage?: (file: File, message?: string) => Promise<void>;
  onConfirmDelivery?: () => void;
  onReportIssue?: () => void;
  onExportChat?: () => void;
}

const translations = {
  en: {
    typeMessage: "Type your message...",
    send: "Send",
    attachFile: "Attach file",
    addPhoto: "Add photo",
    businessHours: "Business Hours",
    orderDetails: "Order Details",
    confirmDelivery: "Confirm Delivery",
    reportIssue: "Report Issue",
    exportChat: "Export Chat",
    delivered: "Delivered",
    inTransit: "In Transit",
    pending: "Pending",
    completed: "Completed",
    estimatedDelivery: "Est. Delivery",
    quantity: "Quantity",
    price: "Price",
    shippingTo: "Shipping to"
  },
  sv: {
    typeMessage: "Skriv ditt meddelande...",
    send: "Skicka",
    attachFile: "Bifoga fil",
    addPhoto: "Lägg till foto",
    businessHours: "Öppettider",
    orderDetails: "Orderdetaljer",
    confirmDelivery: "Bekräfta leverans",
    reportIssue: "Rapportera problem",
    exportChat: "Exportera chatt",
    delivered: "Levererad",
    inTransit: "Under transport",
    pending: "Väntande",
    completed: "Slutförd",
    estimatedDelivery: "Beräknad leverans",
    quantity: "Kvantitet",
    price: "Pris",
    shippingTo: "Leverans till"
  }
};

export function ChatInterface({
  orderContext,
  messages,
  currentUser,
  businessHours,
  language = 'en',
  onSendMessage,
  onSendImageMessage: _onSendImageMessage,
  onSendFileMessage: _onSendFileMessage,
  onConfirmDelivery,
  onReportIssue,
  onExportChat
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (attachments.length > 0) {
      // Send each file with the message text (only for the first file)
      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i];
        // Only send the text message with the first attachment
        const messageToSend = i === 0 ? (messageInput.trim() || '') : '';
        onSendMessage(messageToSend, [file]);
      }
      setMessageInput('');
      setAttachments([]);
    } else if (messageInput.trim()) {
      // Send text only message
      onSendMessage(messageInput.trim(), []);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (files: FileList | null, _type: 'file' | 'image') => {
    if (files) {
      const fileArray = Array.from(files);
      // Add files to attachments array - they'll be sent when user clicks send
      setAttachments(prev => [...prev, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFilesSelected = async (files: File[]) => {
    // Add files to attachments array
    setAttachments(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'delivered': return 'text-blue-600';
      case 'in_transit': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header with Order Context */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{orderContext.materialName}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="font-medium">{t.quantity}:</span>
                <span className="ml-1">{orderContext.quantity}</span>
              </span>
              <span className="flex items-center">
                <span className="font-medium">{t.price}:</span>
                <span className="ml-1">{orderContext.price}</span>
              </span>
              <span className={cn("flex items-center font-medium", getStatusColor(orderContext.status))}>
                <CheckCircle2 size={14} className="mr-1" />
                {t[orderContext.status as keyof typeof t] || orderContext.status}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {orderContext.status === 'delivered' && currentUser === 'buyer' && (
                <DropdownMenuItem onClick={onConfirmDelivery}>
                  <CheckCircle2 size={16} className="mr-2" />
                  {t.confirmDelivery}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onReportIssue}>
                <AlertCircle size={16} className="mr-2" />
                {t.reportIssue}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportChat}>
                <Download size={16} className="mr-2" />
                {t.exportChat}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Business Hours */}
        {businessHours && (
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            <span>{t.businessHours}: {businessHours.start} - {businessHours.end} ({businessHours.timezone})</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          // Skip rendering system messages with MessageBubble - render them separately
          if (message.type === 'system' || message.sender === 'system') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gray-100 text-gray-700 text-center text-sm rounded-lg px-4 py-2 max-w-md">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <MessageBubble
              key={message.id}
              id={message.id}
              type={message.type}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              attachments={message.attachments}
              imageAttachment={message.imageAttachment}
              fileAttachment={message.fileAttachment}
              isRead={message.isRead}
              deliveryStatus={message.deliveryStatus}
              isCurrentUser={message.sender === currentUser}
              language={language}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 p-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded px-3 py-1">
                {file.type.startsWith('image/') ? (
                  <ImageIcon size={14} />
                ) : (
                  <FileText size={14} />
                )}
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {showFileUpload && (
          <div className="p-4 border-b bg-gray-50">
            <FileUpload
              onFilesSelected={handleFilesSelected}
              onImageSelected={(file) => handleFilesSelected([file])}
              maxFileSize={50} // 50MB
              multiple={true}
            />
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files, 'file')}
            />
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files, 'image')}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title={t.attachFile}
            >
              <Paperclip size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              title={t.addPhoto}
            >
              <ImageIcon size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFileUpload(!showFileUpload)}
              title="Advanced Upload"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.typeMessage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() && attachments.length === 0}
            className="bg-[#FF8A00] hover:bg-[#e67700]"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
