"use client";

import React from 'react';
import { 
  X, 
  Package, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Clock,
  FileText,
  Award,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OrderContext {
  orderId: string;
  materialName: string;
  materialType: string;
  quantity: string;
  price: string;
  shippingAddress: string;
  estimatedDelivery: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'completed';
  seller: {
    name: string;
    company: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
  buyer: {
    name: string;
    company: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
  specifications: {
    grade?: string;
    color?: string;
    origin?: string;
    certifications?: string[];
  };
  timeline: {
    orderPlaced: Date;
    paymentConfirmed: Date;
    shippingStarted?: Date;
    delivered?: Date;
    completed?: Date;
  };
}

interface OrderDetailsPanelProps {
  orderContext: OrderContext;
  language?: 'en' | 'sv';
  onClose: () => void;
}

const translations = {
  en: {
    orderDetails: "Order Details",
    orderNumber: "Order Number",
    material: "Material",
    quantity: "Quantity",
    price: "Price",
    status: "Status",
    shippingAddress: "Shipping Address",
    estimatedDelivery: "Estimated Delivery",
    specifications: "Specifications",
    grade: "Grade",
    color: "Color",
    origin: "Origin",
    certifications: "Certifications",
    timeline: "Timeline",
    orderPlaced: "Order Placed",
    paymentConfirmed: "Payment Confirmed",
    shippingStarted: "Shipping Started",
    delivered: "Delivered",
    completed: "Completed",
    pending: "Pending",
    inTransit: "In Transit",
    seller: "Seller",
    buyer: "Buyer",
    company: "Company",
    contactInfo: "Contact Information"
  },
  sv: {
    orderDetails: "Orderdetaljer",
    orderNumber: "Ordernummer",
    material: "Material",
    quantity: "Kvantitet",
    price: "Pris",
    status: "Status",
    shippingAddress: "Leveransadress",
    estimatedDelivery: "Beräknad leverans",
    specifications: "Specifikationer",
    grade: "Kvalitet",
    color: "Färg",
    origin: "Ursprung",
    certifications: "Certifieringar",
    timeline: "Tidslinje",
    orderPlaced: "Order lagd",
    paymentConfirmed: "Betalning bekräftad",
    shippingStarted: "Leverans påbörjad",
    delivered: "Levererad",
    completed: "Slutförd",
    pending: "Väntande",
    inTransit: "Under transport",
    seller: "Säljare",
    buyer: "Köpare",
    company: "Företag",
    contactInfo: "Kontaktinformation"
  }
};

export function OrderDetailsPanel({
  orderContext,
  language = 'en',
  onClose
}: OrderDetailsPanelProps) {
  const t = translations[language];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'delivered': return 'text-blue-600 bg-blue-50';
      case 'in_transit': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'delivered': return <Package size={16} className="text-blue-600" />;
      case 'in_transit': return <Truck size={16} className="text-orange-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const timelineItems = [
    {
      key: 'orderPlaced',
      label: t.orderPlaced,
      date: orderContext.timeline.orderPlaced,
      completed: true
    },
    {
      key: 'paymentConfirmed',
      label: t.paymentConfirmed,
      date: orderContext.timeline.paymentConfirmed,
      completed: true
    },
    {
      key: 'shippingStarted',
      label: t.shippingStarted,
      date: orderContext.timeline.shippingStarted,
      completed: !!orderContext.timeline.shippingStarted
    },
    {
      key: 'delivered',
      label: t.delivered,
      date: orderContext.timeline.delivered,
      completed: !!orderContext.timeline.delivered
    },
    {
      key: 'completed',
      label: t.completed,
      date: orderContext.timeline.completed,
      completed: !!orderContext.timeline.completed
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{t.orderDetails}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{t.orderNumber}</span>
            <span className="text-sm text-gray-900 font-mono">#{orderContext.orderId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{t.status}</span>
            <div className={cn("flex items-center space-x-2 px-2 py-1 rounded-full text-sm", getStatusColor(orderContext.status))}>
              {getStatusIcon(orderContext.status)}
              <span className="capitalize">{t[orderContext.status as keyof typeof t] || orderContext.status}</span>
            </div>
          </div>
        </div>

        {/* Material Information */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Package size={16} className="mr-2" />
            {t.material}
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">{orderContext.materialName}</span>
              <p className="text-xs text-gray-500">{orderContext.materialType}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t.quantity}</span>
              <span className="text-sm font-medium">{orderContext.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t.price}</span>
              <span className="text-sm font-medium">{orderContext.price}</span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {orderContext.specifications && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <FileText size={16} className="mr-2" />
              {t.specifications}
            </h4>
            <div className="space-y-2">
              {orderContext.specifications.grade && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.grade}</span>
                  <span className="text-sm font-medium">{orderContext.specifications.grade}</span>
                </div>
              )}
              {orderContext.specifications.color && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.color}</span>
                  <span className="text-sm font-medium">{orderContext.specifications.color}</span>
                </div>
              )}
              {orderContext.specifications.origin && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.origin}</span>
                  <span className="text-sm font-medium">{orderContext.specifications.origin}</span>
                </div>
              )}
              {orderContext.specifications.certifications && orderContext.specifications.certifications.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">{t.certifications}</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {orderContext.specifications.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                        <Award size={10} className="mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipping Information */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Truck size={16} className="mr-2" />
            Shipping
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">{t.shippingAddress}</span>
              <p className="text-sm text-gray-600 mt-1">{orderContext.shippingAddress}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t.estimatedDelivery}</span>
              <span className="text-sm font-medium">{orderContext.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar size={16} className="mr-2" />
            {t.timeline}
          </h4>
          <div className="space-y-3">
            {timelineItems.map((item, _index) => (
              <div key={item.key} className="flex items-start space-x-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  item.completed ? "bg-green-500" : "bg-gray-300"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm",
                    item.completed ? "text-gray-900 font-medium" : "text-gray-500"
                  )}>
                    {item.label}
                  </p>
                  {item.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(item.date)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Building size={16} className="mr-2" />
            {t.contactInfo}
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">{t.seller}</p>
              <p className="text-sm text-gray-600">{orderContext.seller.name}</p>
              <p className="text-xs text-gray-500">{orderContext.seller.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{t.buyer}</p>
              <p className="text-sm text-gray-600">{orderContext.buyer.name}</p>
              <p className="text-xs text-gray-500">{orderContext.buyer.company}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
