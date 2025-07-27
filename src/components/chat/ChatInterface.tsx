"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Phone, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  type: 'text' | 'image' | 'document' | 'system' | 'delivery_confirmation';
  content: string;
  sender: 'buyer' | 'seller' | 'moderator' | 'system';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
    size?: number;
  }[];
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
  onConfirmDelivery,
  onReportIssue,
  onExportChat
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
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

  const handleSendMessage = () => {
    if (messageInput.trim() || attachments.length > 0) {
      onSendMessage(messageInput.trim(), attachments);
      setMessageInput('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'file' | 'image') => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'delivered': return 'text-blue-600';
      case 'in_transit': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === currentUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                message.sender === currentUser
                  ? "bg-[#FF8A00] text-white"
                  : message.sender === 'system'
                  ? "bg-gray-100 text-gray-700 text-center text-sm"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              {message.type === 'text' && (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              
              {message.type === 'delivery_confirmation' && (
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>{message.content}</span>
                </div>
              )}

              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-white/10 rounded">
                      {attachment.type === 'image' ? (
                        <ImageIcon size={16} />
                      ) : (
                        <FileText size={16} />
                      )}
                      <span className="text-sm">{attachment.name}</span>
                      {attachment.size && (
                        <span className="text-xs opacity-75">({formatFileSize(attachment.size)})</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-75">
                  {formatTime(message.timestamp)}
                </span>
                {message.sender === currentUser && message.deliveryStatus && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 
                      size={12} 
                      className={cn(
                        message.deliveryStatus === 'read' ? 'text-blue-300' : 'text-white/50'
                      )} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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
