# TanStack Query Integration - Chat Polling Optimization

## Problem
The chat page was refreshing every time it polled the backend for new messages or transactions, causing poor UX.

## Solution
Implemented **TanStack Query (React Query)** to handle background data fetching and updates without page refreshes.

## Changes Made

### 1. Installed TanStack Query
```bash
npm install @tanstack/react-query
```

### 2. Created QueryProvider (`src/providers/QueryProvider.tsx`)
- Wraps the entire app with QueryClientProvider
- Configures default query options (1-minute stale time, no refetch on window focus)

### 3. Created useTransactions Hook (`src/hooks/useTransactions.ts`)
- Uses `useQuery` to fetch transactions
- **Automatic polling every 30 seconds** without page refresh
- Handles errors and loading states automatically
- Data is cached and only refetched when stale

### 4. Updated useChatMessages Hook (`src/hooks/useChatMessages.ts`)
- Migrated from manual `useState` + `useEffect` to TanStack Query
- Uses `useQuery` for fetching messages
- Uses `useMutation` for sending messages
- **WebSocket messages update the query cache directly** (no refetch needed)
- No duplicate messages - WebSocket handles real-time updates

### 5. Updated Chats Page (`src/app/dashboard/chats/page.tsx`)
- Removed manual `useEffect` for fetching transactions
- Replaced with `useTransactions()` hook
- Chats are now a **computed value** using `useMemo`
- Removed local state updates (setChats) - everything is derived from the query cache
- Unread counts automatically re-compute when context updates

### 6. Updated Root Layout (`src/app/layout.tsx`)
- Added QueryProvider wrapper around the entire app

## Key Benefits

✅ **No Page Refreshes**: Background polling happens silently  
✅ **Automatic Caching**: Reduces unnecessary API calls  
✅ **Optimistic Updates**: WebSocket messages update UI instantly  
✅ **Better Performance**: Minimal re-renders with computed values  
✅ **Error Handling**: Built-in retry logic and error states  
✅ **KISS & DRY**: Minimal, reusable code following best practices  

## How It Works

1. **Initial Load**: `useTransactions()` fetches all transactions
2. **Background Polling**: Every 30 seconds, TanStack Query automatically refetches in the background
3. **WebSocket Updates**: Real-time messages update the cache directly via `queryClient.setQueryData()`
4. **Computed UI**: The `chats` array is computed from transactions + unread counts using `useMemo`
5. **No Refreshes**: All updates happen in the cache - React re-renders only what changed

## Polling Interval
Default is 30 seconds. To change:
```tsx
const { data } = useTransactions(60000); // 60 seconds
```

Set to `false` to disable polling:
```tsx
const { data } = useTransactions(false);
```
