# Chat Microservice Frontend Integration

This document describes how the frontend integrates with the chat microservice API.

## Overview

The chat system has been integrated with the FastAPI chat microservice running on port 8001. The integration includes:

1. **Transaction List (Sidebar)** - Displays all transactions where the user is involved
2. **Message Display** - Shows conversation history for a selected transaction
3. **Real-time Messaging** - WebSocket support for live message updates
4. **JWT Authentication** - Automatic token handling for all API requests

## Architecture

### Services Layer

#### `src/services/chat.ts`
Main service for interacting with the chat microservice API.

**Key Functions:**
- `getTransactions()` - Fetch all transactions for authenticated user
- `getTransaction(id)` - Fetch a specific transaction
- `createTransaction(request)` - Create a new transaction
- `getMessages(transactionId)` - Fetch messages for a transaction
- `sendMessage(request)` - Send a new message
- `createChatWebSocket(transactionId)` - Create WebSocket connection

**Example Usage:**
```typescript
import { getTransactions, sendMessage } from '@/services/chat';

// Fetch transactions
const response = await getTransactions();
if (response.data) {
  console.log(response.data.transactions);
}

// Send a message
const messageResponse = await sendMessage({
  transaction_id: "uuid-here",
  message: "Hello!"
});
```

### Hooks Layer

#### `src/hooks/useChatMessages.ts`
Custom React hook for managing messages with WebSocket support.

**Features:**
- Automatic message fetching
- Real-time WebSocket updates
- Message sending with error handling
- Loading and error states

**Example Usage:**
```typescript
import { useChatMessages } from '@/hooks/useChatMessages';

function ChatComponent({ transactionId }: { transactionId: string }) {
  const { messages, isLoading, error, sendNewMessage } = useChatMessages(
    transactionId,
    true // Enable WebSocket
  );

  const handleSend = async (text: string) => {
    const success = await sendNewMessage(text);
    if (success) {
      console.log('Message sent!');
    }
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg._id}>{msg.message}</div>
      ))}
    </div>
  );
}
```

### Components Layer

#### `src/app/dashboard/chats/page.tsx`
Main chat page that displays the transaction list and chat interface.

**Features:**
- Fetches transactions from chat microservice
- Converts transactions to chat preview format
- Handles transaction selection
- Mobile-responsive layout
- Loading and error states

**Data Flow:**
1. User logs in → JWT token stored
2. Page loads → `getTransactions()` called with JWT
3. Transactions displayed in sidebar
4. User selects transaction → Messages loaded
5. User sends message → `sendMessage()` called with JWT

## Environment Configuration

Add to your `.env.local`:

```bash
# Chat Microservice URL
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8001
```

## API Integration Details

### Authentication

All API requests automatically include the JWT token from localStorage:

```typescript
function getChatHeaders(): HeadersInit {
  const token = getAccessToken(); // From auth service
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}
```

### Transaction Data Mapping

The chat microservice uses a different schema than the frontend components. Data is mapped as follows:

**Chat Microservice → Frontend:**
```typescript
{
  transaction_id: string,      // → orderId
  auction_name: string,         // → materialName
  user_id: number,              // → buyer ID
  seller_id: number,            // → seller ID
  first_name: string,           // → buyer first name
  last_name: string,            // → buyer last name
  buyer_company: string,        // → buyer company
  seller_company: string,       // → seller company
  transaction_status: string,   // → orderStatus
  last_message: string,         // → lastMessage.content
  date_time: string             // → timestamp
}
```

### Message Data Mapping

**Chat Microservice → Frontend:**
```typescript
{
  _id: string,                  // → message ID
  transaction_id: string,       // → transaction reference
  message: string,              // → message content
  sender_id: number,            // → sender user ID
  timestamp: string             // → message timestamp
}
```

## WebSocket Integration

Real-time messaging is supported via WebSocket:

```typescript
const ws = createChatWebSocket(transactionId);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle new message
};
```

**WebSocket URL Format:**
```
ws://localhost:8001/ws/{transaction_id}
```

## Error Handling

All API calls return a consistent response format:

```typescript
interface ChatApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
```

**Example Error Handling:**
```typescript
const response = await getTransactions();

if (response.error) {
  // Handle error
  console.error(response.error);
  if (response.status === 401 || response.status === 403) {
    // Redirect to login
  }
} else if (response.data) {
  // Handle success
  setTransactions(response.data.transactions);
}
```

## Creating a New Transaction

When a user completes a purchase, create a transaction in the chat system:

```typescript
import { createTransaction } from '@/services/chat';

async function onPurchaseComplete(auctionId: string, sellerId: number, sellerCompany: string) {
  const response = await createTransaction({
    transaction_id: auctionId, // Use auction/order ID
    auction_name: "Material Name",
    seller_id: sellerId,
    seller_company: sellerCompany,
    transaction_status: "Pending"
  });

  if (response.data) {
    // Redirect to chat
    router.push(`/dashboard/chats?chat=${response.data.transaction_id}`);
  }
}
```

## Testing the Integration

### 1. Start the Chat Microservice

```bash
cd chat-service
uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Start the Frontend

```bash
cd front_end
npm run dev
```

### 3. Test Flow

1. Log in to the application
2. Navigate to `/dashboard/chats`
3. You should see transactions loaded from the chat microservice
4. Click on a transaction to view messages
5. Send a message - it should appear immediately
6. Open browser console to see WebSocket connection logs

### 4. Test with Multiple Users

1. Open two browser windows (or use incognito)
2. Log in as different users
3. Both users should be part of the same transaction
4. Send messages from one user
5. Messages should appear in real-time for the other user (if WebSocket is enabled)

## Troubleshooting

### "Failed to fetch transactions"

**Possible causes:**
- Chat microservice not running
- Wrong `NEXT_PUBLIC_CHAT_API_URL`
- JWT token expired or invalid
- CORS issues

**Solutions:**
1. Check chat microservice is running: `curl http://localhost:8001/health`
2. Verify environment variable is set correctly
3. Check browser console for detailed error messages
4. Verify JWT token in localStorage: `localStorage.getItem('nordic_loop_access_token')`

### "401 Unauthorized" or "403 Forbidden"

**Cause:** JWT token is missing or invalid

**Solutions:**
1. Log out and log back in
2. Check that token is being sent in Authorization header
3. Verify token hasn't expired

### WebSocket not connecting

**Possible causes:**
- Chat microservice not running
- Wrong WebSocket URL
- Firewall blocking WebSocket connections

**Solutions:**
1. Check WebSocket URL format: `ws://localhost:8001/ws/{transaction_id}`
2. Test WebSocket manually using a WebSocket client
3. Check browser console for WebSocket errors

### Messages not appearing in real-time

**Cause:** WebSocket not enabled or connection failed

**Solutions:**
1. Check `enableWebSocket` parameter in `useChatMessages` hook
2. Verify WebSocket connection in browser Network tab
3. Check chat microservice logs for WebSocket errors

## Future Enhancements

### Planned Features

1. **File Upload Support**
   - Add file attachment to messages
   - Display images and documents in chat

2. **Unread Message Count**
   - Track unread messages per transaction
   - Show badge on sidebar items

3. **Typing Indicators**
   - Show when other user is typing
   - Use WebSocket for real-time updates

4. **Message Read Receipts**
   - Track when messages are read
   - Display read status in chat

5. **Push Notifications**
   - Browser notifications for new messages
   - Email notifications for offline users

6. **Search and Filter**
   - Search messages within a transaction
   - Filter transactions by status

## API Reference

See `chat-service/API_REFERENCE.md` for complete API documentation.

## Related Documentation

- [Chat Microservice README](../chat-service/README.md)
- [JWT Authentication Guide](../chat-service/JWT_AUTHENTICATION.md)
- [Chat Components Documentation](./src/components/chat/README.md)

