"use client";

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Mail, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'text' | 'image' | 'document' | 'system' | 'delivery_confirmation' | 'quality_report' | 'shipping_update';
  content: string;
  sender: 'buyer' | 'seller' | 'moderator' | 'system';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document' | 'certificate';
    url: string;
    name: string;
    size?: number;
  }[];
}

interface OrderContext {
  orderId: string;
  materialName: string;
  quantity: string;
  price: string;
  shippingAddress: string;
  seller: { name: string; company: string };
  buyer: { name: string; company: string };
}

interface ChatExportProps {
  messages: Message[];
  orderContext: OrderContext;
  language?: 'en' | 'sv';
  onClose: () => void;
}

const translations = {
  en: {
    exportChat: "Export Chat",
    exportOptions: "Export Options",
    format: "Format",
    dateRange: "Date Range",
    includeAttachments: "Include Attachments",
    includeSystemMessages: "Include System Messages",
    exportToPDF: "Export to PDF",
    exportToText: "Export to Text",
    emailExport: "Email Export",
    downloadExport: "Download Export",
    allMessages: "All Messages",
    customRange: "Custom Range",
    startDate: "Start Date",
    endDate: "End Date",
    exportSuccess: "Chat exported successfully",
    exportError: "Failed to export chat",
    generating: "Generating export...",
    cancel: "Cancel",
    export: "Export",
    chatTranscript: "Chat Transcript",
    orderDetails: "Order Details",
    participants: "Participants",
    messageCount: "Total Messages",
    attachmentCount: "Attachments",
    exportedOn: "Exported on",
    page: "Page"
  },
  sv: {
    exportChat: "Exportera chatt",
    exportOptions: "Exportalternativ",
    format: "Format",
    dateRange: "Datumintervall",
    includeAttachments: "Inkludera bilagor",
    includeSystemMessages: "Inkludera systemmeddelanden",
    exportToPDF: "Exportera till PDF",
    exportToText: "Exportera till text",
    emailExport: "E-postexport",
    downloadExport: "Ladda ner export",
    allMessages: "Alla meddelanden",
    customRange: "Anpassat intervall",
    startDate: "Startdatum",
    endDate: "Slutdatum",
    exportSuccess: "Chatt exporterad framgångsrikt",
    exportError: "Misslyckades att exportera chatt",
    generating: "Genererar export...",
    cancel: "Avbryt",
    export: "Exportera",
    chatTranscript: "Chattutskrift",
    orderDetails: "Orderdetaljer",
    participants: "Deltagare",
    messageCount: "Totalt antal meddelanden",
    attachmentCount: "Bilagor",
    exportedOn: "Exporterad den",
    page: "Sida"
  }
};

export function ChatExport({
  messages,
  orderContext,
  language = 'en',
  onClose
}: ChatExportProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'text'>('pdf');
  const [dateRange, setDateRange] = useState<'all' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeSystemMessages, setIncludeSystemMessages] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const t = translations[language];

  const filteredMessages = messages.filter(message => {
    // Filter by system messages
    if (!includeSystemMessages && message.sender === 'system') {
      return false;
    }

    // Filter by date range
    if (dateRange === 'custom' && startDate && endDate) {
      const messageDate = message.timestamp;
      const start = new Date(startDate);
      const end = new Date(endDate);
      return messageDate >= start && messageDate <= end;
    }

    return true;
  });

  const generateTextExport = () => {
    const header = `${t.chatTranscript}
${t.exportedOn}: ${new Date().toLocaleString(language === 'sv' ? 'sv-SE' : 'en-US')}

${t.orderDetails}:
${t.orderDetails}: #${orderContext.orderId}
Material: ${orderContext.materialName}
${t.participants}: ${orderContext.buyer.name} (${orderContext.buyer.company}) & ${orderContext.seller.name} (${orderContext.seller.company})
${t.messageCount}: ${filteredMessages.length}
${includeAttachments ? `${t.attachmentCount}: ${filteredMessages.reduce((acc, msg) => acc + (msg.attachments?.length || 0), 0)}` : ''}

${'='.repeat(50)}

`;

    const messagesText = filteredMessages.map(message => {
      const timestamp = message.timestamp.toLocaleString(language === 'sv' ? 'sv-SE' : 'en-US');
      const sender = message.sender === 'system' ? 'System' : 
                    message.sender.charAt(0).toUpperCase() + message.sender.slice(1);
      
      let messageText = `[${timestamp}] ${sender}: ${message.content}`;
      
      if (includeAttachments && message.attachments && message.attachments.length > 0) {
        const attachmentList = message.attachments.map(att => `  - ${att.name} (${att.type})`).join('\n');
        messageText += `\n${t.attachmentCount}:\n${attachmentList}`;
      }
      
      return messageText;
    }).join('\n\n');

    return header + messagesText;
  };

  const generatePDFExport = () => {
    // In a real implementation, you would use a PDF library like jsPDF or react-pdf
    // For now, we'll simulate the PDF generation
    const textContent = generateTextExport();
    
    // Create a blob with the text content (in real implementation, this would be PDF)
    const blob = new Blob([textContent], { type: 'text/plain' });
    return blob;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let blob: Blob;
      let filename: string;
      
      if (exportFormat === 'pdf') {
        blob = generatePDFExport();
        filename = `chat-transcript-${orderContext.orderId}.txt`; // Would be .pdf in real implementation
      } else {
        const textContent = generateTextExport();
        blob = new Blob([textContent], { type: 'text/plain' });
        filename = `chat-transcript-${orderContext.orderId}.txt`;
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onClose();
    } catch (_error) {
      // console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = async () => {
    // In a real implementation, this would send the export via email
    const textContent = generateTextExport();
    const subject = `Chat Transcript - Order #${orderContext.orderId}`;
    const body = encodeURIComponent(textContent);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t.exportChat}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t.format}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value as 'pdf')}
                  className="mr-3 text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                <FileText size={16} className="mr-2" />
                {t.exportToPDF}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  checked={exportFormat === 'text'}
                  onChange={(e) => setExportFormat(e.target.value as 'text')}
                  className="mr-3 text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                <FileText size={16} className="mr-2" />
                {t.exportToText}
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t.dateRange}
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={dateRange === 'all'}
                  onChange={(e) => setDateRange(e.target.value as 'all')}
                  className="mr-3 text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                {t.allMessages}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="custom"
                  checked={dateRange === 'custom'}
                  onChange={(e) => setDateRange(e.target.value as 'custom')}
                  className="mr-3 text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                {t.customRange}
              </label>
              
              {dateRange === 'custom' && (
                <div className="ml-6 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t.startDate}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t.endDate}</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t.exportOptions}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeAttachments}
                  onChange={(e) => setIncludeAttachments(e.target.checked)}
                  className="mr-3 rounded text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                {t.includeAttachments}
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSystemMessages}
                  onChange={(e) => setIncludeSystemMessages(e.target.checked)}
                  className="mr-3 rounded text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                {t.includeSystemMessages}
              </label>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Export Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{t.messageCount}: {filteredMessages.length}</p>
              {includeAttachments && (
                <p>{t.attachmentCount}: {filteredMessages.reduce((acc, msg) => acc + (msg.attachments?.length || 0), 0)}</p>
              )}
              <p>Format: {exportFormat.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleEmailExport}
            className="flex items-center"
          >
            <Mail size={16} className="mr-2" />
            {t.emailExport}
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || (dateRange === 'custom' && (!startDate || !endDate))}
              className="bg-[#FF8A00] hover:bg-[#e67700]"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.generating}
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  {t.export}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
