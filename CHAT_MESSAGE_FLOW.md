# Chat Message Flow - Complete Guide

## Message Display Flow (Issue 1 Fix)

### When User Clicks on a Transaction

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks transaction in sidebar                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. page.tsx: setSelectedChatId(transaction_id)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. useChatMessages hook triggered with new transaction_id       │
│    - Hook calls: GET /messages/{transaction_id}                 │
│    - Headers include: Authorization: Bearer <JWT>               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Chat Microservice (FastAPI)                                  │
│    - Validates JWT token                                        │
│    - Extracts user_id from token                                │
│    - Queries MongoDB for messages                               │
│    - Returns: { messages: [...] }                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. useChatMessages hook receives response                       │
│    - Updates messages state                                     │
│    - Sets isLoading = false                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. page.tsx: convertApiMessageToMessage()                       │
│    - Converts each API message to ChatContainer format          │
│    - Determines sender based on sender_id vs user.id            │
│    - Creates chatMessages array                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. ChatContainer receives messages prop                         │
│    - Uses external messages instead of mock data                │
│    - Passes to ChatInterface                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. ChatInterface renders messages                               │
│    - Applies styling based on sender                            │
│    - Orange for current user, grey for others                   │
│    - Displays in chat UI                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Message Styling Flow (Issue 2 Fix)

### How Messages Get Styled Based on Sender

```
API Message from Backend:
{
  "_id": "msg123",
  "transaction_id": "trans456",
  "sender_id": 3,           ← Compare with current user.id
  "message": "Hello!",
  "timestamp": "2024-01-20T10:30:00Z"
}

                         │
                         ▼

page.tsx: convertApiMessageToMessage()
┌─────────────────────────────────────────────────────────────────┐
│ const isCurrentUser = apiMessage.sender_id === user.id          │
│                                                                  │
│ If sender_id (3) === user.id (3):                               │
│   ✓ isCurrentUser = true                                        │
│   ✓ sender = currentUserType (e.g., 'buyer')                    │
│                                                                  │
│ If sender_id (3) !== user.id (5):                               │
│   ✗ isCurrentUser = false                                       │
│   ✗ sender = opposite type (e.g., 'seller')                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼

Converted Message:
{
  "id": "msg123",
  "type": "text",
  "content": "Hello!",
  "sender": "buyer",        ← Set based on comparison above
  "timestamp": Date,
  "isRead": true,
  "deliveryStatus": "delivered"
}

                         │
                         ▼

ChatInterface.tsx: Render with styling
┌─────────────────────────────────────────────────────────────────┐
│ {messages.map((message) => (                                    │
│   <div className={cn(                                           │
│     "max-w-[70%] rounded-lg px-4 py-2",                         │
│     message.sender === currentUser                              │
│       ? "bg-[#FF8A00] text-white"      ← ORANGE (your message)  │
│       : message.sender === 'system'                             │
│       ? "bg-gray-100 text-gray-700"    ← GREY (system)          │
│       : "bg-gray-100 text-gray-900"    ← GREY (other user)      │
│   )}>                                                            │
│     {message.content}                                           │
│   </div>                                                         │
│ ))}                                                              │
└─────────────────────────────────────────────────────────────────┘

                         │
                         ▼

Visual Result:
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────────────────────┐                                   │
│  │ Hello from seller!       │  ← Grey, aligned left             │
│  └──────────────────────────┘                                   │
│                                                                  │
│                          ┌──────────────────────────┐           │
│                          │ Thanks! I'll buy it.     │  ← Orange │
│                          └──────────────────────────┘   aligned │
│                                                          right   │
│  ┌──────────────────────────┐                                   │
│  │ Great! Shipping today.   │  ← Grey, aligned left             │
│  └──────────────────────────┘                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Message Sending Flow (Issue 3 Fix)

### When User Sends a Message

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User types message and clicks Send                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. ChatInterface: onSendMessage("Hello!")                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. ChatContainer: handleSendMessage(content, attachments)       │
│    - Calls external handler if provided                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. page.tsx: handleSendMessage(content)                         │
│    - Calls: sendNewMessage(content)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. useChatMessages: sendNewMessage(message)                     │
│    - Creates request:                                           │
│      {                                                           │
│        transaction_id: "trans456",                              │
│        message: "Hello!"                                        │
│      }                                                           │
│    - Calls: POST /messages                                      │
│    - Headers: Authorization: Bearer <JWT>                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Chat Microservice (FastAPI)                                  │
│    ┌──────────────────────────────────────────────────────────┐│
│    │ JWT Handler:                                              ││
│    │ - Decodes JWT token                                       ││
│    │ - Extracts: user_id = 3                                   ││
│    │ - Extracts: first_name, last_name, company, etc.          ││
│    └──────────────────────────────────────────────────────────┘│
│                         │                                        │
│                         ▼                                        │
│    ┌──────────────────────────────────────────────────────────┐│
│    │ Message Route:                                            ││
│    │ - Creates message object:                                 ││
│    │   {                                                        ││
│    │     transaction_id: "trans456",                           ││
│    │     sender_id: 3,              ← From JWT!                ││
│    │     message: "Hello!",                                    ││
│    │     timestamp: "2024-01-20T10:35:00Z"                     ││
│    │   }                                                        ││
│    └──────────────────────────────────────────────────────────┘│
│                         │                                        │
│                         ▼                                        │
│    ┌──────────────────────────────────────────────────────────┐│
│    │ MongoDB Operations:                                       ││
│    │ - Inserts message into 'messages' collection              ││
│    │ - Returns inserted document with _id                      ││
│    └──────────────────────────────────────────────────────────┘│
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Response returned to frontend:                               │
│    {                                                             │
│      "_id": "msg789",                                            │
│      "transaction_id": "trans456",                              │
│      "sender_id": 3,                                            │
│      "message": "Hello!",                                       │
│      "timestamp": "2024-01-20T10:35:00Z"                        │
│    }                                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. useChatMessages: Receives response                           │
│    - Adds message to local state                                │
│    - setMessages(prev => [...prev, newMessage])                 │
│    - Returns success = true                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. UI Updates Immediately                                       │
│    - New message appears in chat                                │
│    - Styled with orange background (current user)               │
│    - Aligned to the right                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## WebSocket Real-Time Updates

### When Another User Sends a Message

```
User A's Browser                    Chat Microservice              User B's Browser
─────────────────                   ─────────────────              ─────────────────

1. User A sends message
   │
   ├──POST /messages──────────────▶ Receives message
   │                                │
   │                                ├─ Saves to MongoDB
   │                                │
   │◀──Response with saved msg──────┤
   │                                │
   │                                ├─ Broadcasts via WebSocket
   │                                │
   │                                ├──WebSocket msg──────────────▶ 2. User B receives
   │                                │                                  via WebSocket
   │                                │                                  │
   │                                │                                  ├─ Parses message
   │                                │                                  │
   │                                │                                  ├─ Adds to state
   │                                │                                  │
   │                                │                                  └─ UI updates!
   │                                │
3. User A sees message              │                               4. User B sees message
   immediately (optimistic)         │                                  in real-time
```

### WebSocket Connection Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Component Mounts / Transaction Selected                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. useChatMessages hook with enableWebSocket=true               │
│    - Creates WebSocket: ws://localhost:8001/ws/{transaction_id} │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. WebSocket Events                                             │
│                                                                  │
│    ws.onopen = () => {                                          │
│      console.log('WebSocket connected');                        │
│    }                                                             │
│                                                                  │
│    ws.onmessage = (event) => {                                  │
│      const newMessage = JSON.parse(event.data);                 │
│      setMessages(prev => [...prev, newMessage]);                │
│    }                                                             │
│                                                                  │
│    ws.onerror = (error) => {                                    │
│      console.error('WebSocket error:', error);                  │
│    }                                                             │
│                                                                  │
│    ws.onclose = () => {                                         │
│      console.log('WebSocket disconnected');                     │
│    }                                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Component Unmounts / Transaction Changed                     │
│    - Cleanup: ws.close()                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Complete Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ page.tsx                                                        │ │
│  │                                                                 │ │
│  │  1. Fetches transactions on mount                              │ │
│  │     └─▶ getTransactions() ──────────────────┐                  │ │
│  │                                              │                  │ │
│  │  2. User selects transaction                │                  │ │
│  │     └─▶ setSelectedChatId(id)               │                  │ │
│  │                                              │                  │ │
│  │  3. useChatMessages hook triggered          │                  │ │
│  │     ├─▶ Fetches messages                    │                  │ │
│  │     ├─▶ Establishes WebSocket               │                  │ │
│  │     └─▶ Provides sendNewMessage()           │                  │ │
│  │                                              │                  │ │
│  │  4. Converts API messages to UI format      │                  │ │
│  │     └─▶ convertApiMessageToMessage()        │                  │ │
│  │                                              │                  │ │
│  │  5. Passes to ChatContainer                 │                  │ │
│  │     ├─▶ messages={chatMessages}             │                  │ │
│  │     └─▶ onSendMessage={handleSendMessage}   │                  │ │
│  └──────────────────────┬───────────────────────┼─────────────────┘ │
│                         │                       │                    │
│                         ▼                       │                    │
│  ┌────────────────────────────────────────────┐│                    │
│  │ ChatContainer                               ││                    │
│  │                                             ││                    │
│  │  - Receives messages prop                  ││                    │
│  │  - Receives onSendMessage handler          ││                    │
│  │  - Passes to ChatInterface                 ││                    │
│  └──────────────────────┬──────────────────────┘│                    │
│                         │                       │                    │
│                         ▼                       │                    │
│  ┌────────────────────────────────────────────┐│                    │
│  │ ChatInterface                               ││                    │
│  │                                             ││                    │
│  │  - Renders messages with styling           ││                    │
│  │  - Orange for current user                 ││                    │
│  │  - Grey for other user                     ││                    │
│  │  - Calls onSendMessage when user sends     ││                    │
│  └─────────────────────────────────────────────┘│                    │
│                                                  │                    │
└──────────────────────────────────────────────────┼────────────────────┘
                                                   │
                    HTTP + JWT                     │
                    WebSocket                      │
                                                   │
                                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   CHAT MICROSERVICE (FastAPI)                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ JWT Authentication Middleware                                   │ │
│  │                                                                 │ │
│  │  - Extracts JWT from Authorization header                      │ │
│  │  - Decodes token                                               │ │
│  │  - Validates expiration                                        │ │
│  │  - Extracts user_id, first_name, last_name, company_name       │ │
│  │  - Injects into request context                                │ │
│  └──────────────────────┬──────────────────────────────────────────┘ │
│                         │                                             │
│                         ▼                                             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ API Routes                                                      │ │
│  │                                                                 │ │
│  │  GET /transactions                                             │ │
│  │    └─▶ Returns transactions where user is buyer or seller      │ │
│  │                                                                 │ │
│  │  GET /messages/{transaction_id}                                │ │
│  │    └─▶ Returns all messages for transaction                    │ │
│  │                                                                 │ │
│  │  POST /messages                                                │ │
│  │    ├─▶ Gets sender_id from JWT (current_user.user_id)          │ │
│  │    ├─▶ Saves message to MongoDB                                │ │
│  │    ├─▶ Broadcasts via WebSocket                                │ │
│  │    └─▶ Returns saved message                                   │ │
│  │                                                                 │ │
│  │  WS /ws/{transaction_id}                                       │ │
│  │    └─▶ Real-time message broadcasting                          │ │
│  └──────────────────────┬──────────────────────────────────────────┘ │
│                         │                                             │
│                         ▼                                             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Database Operations                                             │ │
│  │                                                                 │ │
│  │  - MongoDB queries                                             │ │
│  │  - CRUD operations                                             │ │
│  │  - Data validation                                             │ │
│  └──────────────────────┬──────────────────────────────────────────┘ │
│                         │                                             │
└─────────────────────────┼─────────────────────────────────────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │   MongoDB Atlas      │
                │                      │
                │  Collections:        │
                │  - transactions      │
                │  - messages          │
                └──────────────────────┘
```

---

## Key Points

### Issue 1: Messages Loading
✅ **Fixed:** Messages now load from backend API instead of mock data
- Uses `useChatMessages` hook
- Calls `GET /messages/{transaction_id}`
- Updates UI automatically

### Issue 2: Message Styling
✅ **Fixed:** Messages styled based on sender_id comparison
- Orange (#FF8A00) for current user
- Grey for other user
- Aligned right/left accordingly

### Issue 3: Message Persistence
✅ **Fixed:** Messages saved to MongoDB via API
- Calls `POST /messages`
- Backend extracts sender_id from JWT
- Message persisted in database
- UI updates immediately

### Real-Time Updates
✅ **Bonus:** WebSocket support for live updates
- Automatic connection when transaction selected
- Receives messages from other users in real-time
- No page refresh needed

