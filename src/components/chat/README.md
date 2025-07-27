# Nordic Loop Chat System

A comprehensive chat system designed for post-payment communication between buyers and sellers in the Nordic Loop marketplace. The system provides secure, feature-rich messaging with order context integration and professional business features.

## Features

### Core Features ✅
- **Automatic Chat Creation**: Triggered after successful escrow deposit
- **Multi-participant Support**: Buyer, seller, and optional platform moderator
- **Order Context Integration**: 
  - Order details header with material specifications
  - Shipping address and timeline milestones
  - Real-time status updates
- **Swedish/English Localization**: Full bilingual support
- **Mobile Responsive**: Optimized for mobile devices

### Communication Features ✅
- **Message Types**:
  - Text messages with rich formatting
  - Photo sharing (material condition, packaging)
  - Document sharing (quality certificates, shipping docs)
  - System notifications and updates
- **File Attachments**: Support for images, documents, and certificates
- **Delivery Confirmation**: Photo confirmation of received materials
- **Issue Reporting**: Flag quality or delivery problems
- **Read Receipts**: Message delivery and read status

### Professional Features ✅
- **Business Hours Display**: Show company operating hours
- **Auto-responses**: Out-of-office and after-hours messages
- **Email Notifications**: Message alerts via email
- **Export Capability**: Download conversation transcripts (PDF/Text)
- **Notification System**: Real-time alerts with priority levels

## Components

### ChatList
Displays a list of all chat conversations with search and filtering capabilities.

```tsx
import { ChatList } from '@/components/chat';

<ChatList
  chats={chatPreviews}
  currentUserId="user-123"
  language="en"
  onChatSelect={handleChatSelect}
  onArchiveChat={handleArchiveChat}
  onDeleteChat={handleDeleteChat}
/>
```

### ChatWidget
Compact widget showing recent chats for dashboard integration.

```tsx
import { ChatWidget, useRecentChats } from '@/components/chat';

const { recentChats } = useRecentChats();

<ChatWidget
  recentChats={recentChats}
  language="en"
  className="border-0 shadow-none"
/>
```

### ChatContainer
Main container component that manages the overall chat layout and state.

```tsx
import { ChatContainer } from '@/components/chat';

<ChatContainer
  orderContext={orderData}
  currentUser="buyer"
  language="en"
  onBack={() => navigate('/orders')}
/>
```

### ChatInterface
Core chat interface with message display and input functionality.

```tsx
import { ChatInterface } from '@/components/chat';

<ChatInterface
  orderContext={orderData}
  messages={messages}
  currentUser="buyer"
  businessHours={{ start: "09:00", end: "17:00", timezone: "CET" }}
  language="en"
  onSendMessage={handleSendMessage}
  onConfirmDelivery={handleConfirmDelivery}
/>
```

### MessageBubble
Individual message component with support for different message types.

```tsx
import { MessageBubble } from '@/components/chat';

<MessageBubble
  id="msg-1"
  type="text"
  content="Hello, thank you for your order!"
  sender="seller"
  timestamp={new Date()}
  isCurrentUser={false}
  language="en"
/>
```

### OrderDetailsPanel
Sidebar panel showing comprehensive order information.

```tsx
import { OrderDetailsPanel } from '@/components/chat';

<OrderDetailsPanel
  orderContext={orderData}
  language="en"
  onClose={() => setShowDetails(false)}
/>
```

### ChatNotifications
Notification system with real-time alerts and email integration.

```tsx
import { ChatNotifications, useNotifications } from '@/components/chat';

const { notifications, addNotification, markAsRead } = useNotifications();

<ChatNotifications
  notifications={notifications}
  language="en"
  onMarkAsRead={markAsRead}
  onNotificationClick={handleNotificationClick}
/>
```

### AutoResponseManager
Business hours and auto-response management interface.

```tsx
import { AutoResponseManager } from '@/components/chat';

<AutoResponseManager
  businessHours={businessHours}
  autoResponses={autoResponses}
  language="en"
  onUpdateBusinessHours={setBusinessHours}
  onUpdateAutoResponses={setAutoResponses}
/>
```

### ChatExport
Export functionality for conversation transcripts.

```tsx
import { ChatExport } from '@/components/chat';

<ChatExport
  messages={messages}
  orderContext={orderData}
  language="en"
  onClose={() => setShowExport(false)}
/>
```

## Usage

### Basic Setup

1. Import the required components:
```tsx
import { ChatContainer, OrderContext } from '@/components/chat';
```

2. Prepare your order context data:
```tsx
const orderContext: OrderContext = {
  orderId: "NL-2024-001234",
  materialName: "HDPE Pellets",
  quantity: "2.5 tons",
  price: "€3,750",
  status: "delivered",
  seller: { name: "Erik", company: "Nordic Recycling AB", isOnline: true },
  buyer: { name: "Maria", company: "Sustainable Plastics Ltd", isOnline: false },
  // ... other properties
};
```

3. Render the chat:
```tsx
<ChatContainer
  orderContext={orderContext}
  currentUser="buyer"
  language="en"
/>
```

### Advanced Features

#### Custom Message Types
```tsx
const customMessage = {
  id: "msg-1",
  type: "quality_report",
  content: "Quality inspection completed",
  sender: "buyer",
  timestamp: new Date(),
  metadata: {
    qualityRating: 5,
    deliveryDate: "2024-02-15"
  }
};
```

#### Business Hours Configuration
```tsx
const businessHours = {
  monday: { start: "09:00", end: "17:00", isOpen: true },
  tuesday: { start: "09:00", end: "17:00", isOpen: true },
  // ... other days
  timezone: "CET"
};
```

#### Auto-response Setup
```tsx
const autoResponses = [
  {
    id: "1",
    trigger: "out_of_office",
    message: "Currently out of office. Will respond within 24 hours.",
    isActive: true,
    language: "both"
  }
];
```

## Styling

The chat system uses your existing design system with:
- **Primary Color**: `#1E2A36` (Nordic blue)
- **Accent Color**: `#FF8A00` (Orange)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Shadcn/ui with Radix primitives
- **Responsive**: Mobile-first design approach

## Navigation Integration

The chat system is fully integrated into the dashboard:

### Dashboard Sidebar
- **Chat Navigation**: Added to sidebar with unread message count
- **Easy Access**: Direct link to `/dashboard/chats`
- **Visual Indicators**: Orange badge shows unread messages

### Dashboard Overview
- **Recent Chats Widget**: Shows latest conversations
- **Quick Access**: Click to jump directly to specific chats
- **Status Indicators**: Online/offline status and user types

### Chat Management
- **Chat List**: View all conversations with search and filters
- **Mobile Responsive**: Optimized layout for mobile devices
- **Real-time Updates**: Live status and message updates

## Demo

Visit `/chat-demo` to see the chat system in action with:
- Sample order data and messages
- Buyer/seller view switching
- Language toggle (English/Swedish)
- All features demonstrated
- Interactive components

Visit `/dashboard/chats` to see the integrated chat system:
- Full chat list with multiple conversations
- Search and filter functionality
- Mobile-responsive design
- Integration with dashboard navigation

## Integration

### Backend Integration
The chat system is designed to work with your existing backend APIs:

```tsx
// Message sending
const handleSendMessage = async (content: string, attachments?: File[]) => {
  const response = await fetch('/api/chat/messages', {
    method: 'POST',
    body: JSON.stringify({ content, attachments, orderId })
  });
  // Handle response
};

// Real-time updates
const socket = new WebSocket('/ws/chat');
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  setMessages(prev => [...prev, message]);
};
```

### Notification Integration
```tsx
// Email notifications
const sendEmailNotification = async (userId: string, message: string) => {
  await fetch('/api/notifications/email', {
    method: 'POST',
    body: JSON.stringify({ userId, message })
  });
};
```

## Security Considerations

- All file uploads should be validated and scanned
- Messages should be sanitized to prevent XSS
- Access control based on order participation
- Audit trail for all chat activities
- Secure file storage for attachments

## Future Enhancements

- Video call integration
- Voice messages
- Message translation
- Advanced search and filtering
- Integration with BankID for verification
- Automated quality assessment
- Smart contract integration for escrow
