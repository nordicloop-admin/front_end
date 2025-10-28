"use client";

import React, { useState } from 'react';
import { 
  Clock, 
  MessageSquare, 
  Save, 
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AutoResponse {
  id: string;
  trigger: 'out_of_office' | 'after_hours' | 'weekend' | 'holiday' | 'custom';
  message: string;
  isActive: boolean;
  language: 'en' | 'sv' | 'both';
  startDate?: Date;
  endDate?: Date;
}

interface BusinessHours {
  monday: { start: string; end: string; isOpen: boolean };
  tuesday: { start: string; end: string; isOpen: boolean };
  wednesday: { start: string; end: string; isOpen: boolean };
  thursday: { start: string; end: string; isOpen: boolean };
  friday: { start: string; end: string; isOpen: boolean };
  saturday: { start: string; end: string; isOpen: boolean };
  sunday: { start: string; end: string; isOpen: boolean };
  timezone: string;
}

interface AutoResponseManagerProps {
  businessHours: BusinessHours;
  autoResponses: AutoResponse[];
  language?: 'en' | 'sv';
  onUpdateBusinessHours: (hours: BusinessHours) => void;
  onUpdateAutoResponses: (responses: AutoResponse[]) => void;
  onClose?: () => void;
}

const translations = {
  en: {
    autoResponses: "Auto Responses",
    businessHours: "Business Hours",
    outOfOffice: "Out of Office",
    afterHours: "After Hours",
    weekend: "Weekend",
    holiday: "Holiday",
    custom: "Custom",
    message: "Message",
    active: "Active",
    inactive: "Inactive",
    addResponse: "Add Response",
    editResponse: "Edit Response",
    deleteResponse: "Delete Response",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    startDate: "Start Date",
    endDate: "End Date",
    timezone: "Timezone",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    open: "Open",
    closed: "Closed",
    defaultOutOfOffice: "Thank you for your message. I'm currently out of office and will respond within 24 hours.",
    defaultAfterHours: "Thank you for your message. Our business hours are 9:00-17:00 CET. I'll respond during business hours.",
    defaultWeekend: "Thank you for your message. I'll respond on the next business day.",
    currentTime: "Current time",
    isOpen: "Currently open",
    isClosed: "Currently closed"
  },
  sv: {
    autoResponses: "Automatiska svar",
    businessHours: "Öppettider",
    outOfOffice: "Inte på kontoret",
    afterHours: "Efter arbetstid",
    weekend: "Helg",
    holiday: "Helgdag",
    custom: "Anpassad",
    message: "Meddelande",
    active: "Aktiv",
    inactive: "Inaktiv",
    addResponse: "Lägg till svar",
    editResponse: "Redigera svar",
    deleteResponse: "Ta bort svar",
    save: "Spara",
    cancel: "Avbryt",
    edit: "Redigera",
    delete: "Ta bort",
    startDate: "Startdatum",
    endDate: "Slutdatum",
    timezone: "Tidszon",
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag",
    open: "Öppen",
    closed: "Stängd",
    defaultOutOfOffice: "Tack för ditt meddelande. Jag är för närvarande inte på kontoret och kommer att svara inom 24 timmar.",
    defaultAfterHours: "Tack för ditt meddelande. Våra öppettider är 9:00-17:00 CET. Jag svarar under kontorstid.",
    defaultWeekend: "Tack för ditt meddelande. Jag svarar nästa arbetsdag.",
    currentTime: "Aktuell tid",
    isOpen: "För närvarande öppet",
    isClosed: "För närvarande stängt"
  }
};

export function AutoResponseManager({
  businessHours,
  autoResponses,
  language = 'en',
  onUpdateBusinessHours,
  onUpdateAutoResponses,
  onClose
}: AutoResponseManagerProps) {
  const [activeTab, setActiveTab] = useState<'hours' | 'responses'>('hours');
  const [editingHours, setEditingHours] = useState(businessHours);
  const [editingResponses, setEditingResponses] = useState(autoResponses);
  const [editingResponse, setEditingResponse] = useState<AutoResponse | null>(null);
  const [isAddingResponse, setIsAddingResponse] = useState(false);

  const t = translations[language];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString(language === 'sv' ? 'sv-SE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const isCurrentlyOpen = () => {
    const now = new Date();
    const currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Convert Sunday=0 to our format
    const dayHours = editingHours[currentDay];
    
    if (!dayHours.isOpen) return false;
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = dayHours.start.split(':').map(Number);
    const [endHour, endMin] = dayHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    return currentTime >= startTime && currentTime <= endTime;
  };

  const handleSaveHours = () => {
    onUpdateBusinessHours(editingHours);
  };

  const handleSaveResponses = () => {
    onUpdateAutoResponses(editingResponses);
  };

  const handleAddResponse = () => {
    const newResponse: AutoResponse = {
      id: Date.now().toString(),
      trigger: 'out_of_office',
      message: t.defaultOutOfOffice,
      isActive: true,
      language: 'both'
    };
    setEditingResponse(newResponse);
    setIsAddingResponse(true);
  };

  const handleSaveResponse = (response: AutoResponse) => {
    if (isAddingResponse) {
      setEditingResponses(prev => [...prev, response]);
    } else {
      setEditingResponses(prev => prev.map(r => r.id === response.id ? response : r));
    }
    setEditingResponse(null);
    setIsAddingResponse(false);
  };

  const handleDeleteResponse = (responseId: string) => {
    setEditingResponses(prev => prev.filter(r => r.id !== responseId));
  };

  const toggleResponseActive = (responseId: string) => {
    setEditingResponses(prev => prev.map(r => 
      r.id === responseId ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const updateDayHours = (day: keyof Omit<BusinessHours, 'timezone'>, field: 'start' | 'end' | 'isOpen', value: string | boolean) => {
    setEditingHours(prev => {
      const currentDay = prev[day as keyof BusinessHours];
      if (typeof currentDay === 'object' && currentDay !== null) {
        return {
          ...prev,
          [day]: {
            ...currentDay,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeTab === 'hours' ? t.businessHours : t.autoResponses}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('hours')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'hours' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Clock size={16} className="mr-2 inline" />
              {t.businessHours}
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'responses' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <MessageSquare size={16} className="mr-2 inline" />
              {t.autoResponses}
            </button>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'hours' ? (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.currentTime}</p>
                  <p className="text-lg font-semibold text-gray-900">{getCurrentTime()}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  isCurrentlyOpen() 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {isCurrentlyOpen() ? t.isOpen : t.isClosed}
                </div>
              </div>
            </div>

            {/* Business Hours Settings */}
            <div className="space-y-4">
              {days.map(day => (
                <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">
                      {t[day]}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingHours[day].isOpen}
                      onChange={(e) => updateDayHours(day, 'isOpen', e.target.checked)}
                      className="rounded border-gray-300 text-[#FF8A00] focus:ring-[#FF8A00]"
                    />
                    <span className="text-sm text-gray-600">
                      {editingHours[day].isOpen ? t.open : t.closed}
                    </span>
                  </div>

                  {editingHours[day].isOpen && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={editingHours[day].start}
                        onChange={(e) => updateDayHours(day, 'start', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={editingHours[day].end}
                        onChange={(e) => updateDayHours(day, 'end', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Timezone */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">{t.timezone}:</label>
              <select
                value={editingHours.timezone}
                onChange={(e) => setEditingHours(prev => ({ ...prev, timezone: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
              >
                <option value="CET">Central European Time (CET)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="EST">Eastern Standard Time (EST)</option>
                <option value="PST">Pacific Standard Time (PST)</option>
              </select>
            </div>

            <Button onClick={handleSaveHours} className="bg-[#FF8A00] hover:bg-[#e67700]">
              <Save size={16} className="mr-2" />
              {t.save}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Response Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">{t.autoResponses}</h3>
              <Button onClick={handleAddResponse} className="bg-[#FF8A00] hover:bg-[#e67700]">
                <Plus size={16} className="mr-2" />
                {t.addResponse}
              </Button>
            </div>

            {/* Responses List */}
            <div className="space-y-4">
              {editingResponses.map(response => (
                <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {t[response.trigger as keyof typeof t]}
                      </span>
                      <button
                        onClick={() => toggleResponseActive(response.id)}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          response.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {response.isActive ? t.active : t.inactive}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingResponse(response)}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResponse(response.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {response.message}
                  </p>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveResponses} className="bg-[#FF8A00] hover:bg-[#e67700]">
              <Save size={16} className="mr-2" />
              {t.save}
            </Button>
          </div>
        )}
      </div>

      {/* Edit Response Modal */}
      {editingResponse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingResponse ? t.addResponse : t.editResponse}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger
                </label>
                <select
                  value={editingResponse.trigger}
                  onChange={(e) => setEditingResponse(prev => prev ? { ...prev, trigger: e.target.value as AutoResponse['trigger'] } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                >
                  <option value="out_of_office">{t.outOfOffice}</option>
                  <option value="after_hours">{t.afterHours}</option>
                  <option value="weekend">{t.weekend}</option>
                  <option value="holiday">{t.holiday}</option>
                  <option value="custom">{t.custom}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.message}
                </label>
                <textarea
                  value={editingResponse.message}
                  onChange={(e) => setEditingResponse(prev => prev ? { ...prev, message: e.target.value } : null)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingResponse(null);
                    setIsAddingResponse(false);
                  }}
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={() => editingResponse && handleSaveResponse(editingResponse)}
                  className="bg-[#FF8A00] hover:bg-[#e67700]"
                >
                  {t.save}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
