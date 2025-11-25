# TanStack Query - Quick Reference Guide

## Basic Usage Pattern

### 1. Fetching Data (GET)
```tsx
import { useQuery } from '@tanstack/react-query';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 60000, // Data is fresh for 1 minute
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });
}

// In your component
function MyComponent() {
  const { data, isLoading, error } = useUsers();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.map(user => ...)}</div>;
}
```

### 2. Mutating Data (POST/PUT/DELETE)
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// In your component
function CreateUserForm() {
  const createUser = useCreateUser();
  
  const handleSubmit = async (data) => {
    try {
      await createUser.mutateAsync(data);
      alert('User created!');
    } catch (error) {
      alert('Error creating user');
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Optimistic Updates
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId) => {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    },
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      
      // Snapshot previous value
      const previousPost = queryClient.getQueryData(['post', postId]);
      
      // Optimistically update
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        likes: old.likes + 1,
        isLiked: true,
      }));
      
      return { previousPost };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['post', postId], context.previousPost);
    },
    onSettled: (postId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
```

### 4. Dependent Queries
```tsx
function useUserPosts(userId) {
  // Only fetch posts if userId is available
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      return response.json();
    },
    enabled: !!userId, // Only run when userId exists
  });
}
```

### 5. Infinite Queries (Pagination)
```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/users?page=${pageParam}`);
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    initialPageParam: 0,
  });
}

// In your component
function InfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers();
  
  return (
    <div>
      {data?.pages.map((page) => (
        page.users.map(user => <div key={user.id}>{user.name}</div>)
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### 6. Manual Cache Updates
```tsx
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();
  
  // Get data from cache
  const cachedData = queryClient.getQueryData(['users']);
  
  // Set data in cache
  queryClient.setQueryData(['users'], (old) => [...old, newUser]);
  
  // Invalidate (mark as stale and refetch)
  queryClient.invalidateQueries({ queryKey: ['users'] });
  
  // Remove from cache
  queryClient.removeQueries({ queryKey: ['users'] });
  
  // Prefetch data
  queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
```

## Configuration Options

### Query Options
```tsx
useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
  
  // Caching
  staleTime: 60000,           // How long data is considered fresh
  gcTime: 300000,             // Garbage collection time (formerly cacheTime)
  
  // Refetching
  refetchInterval: 30000,     // Auto-refetch interval
  refetchOnMount: true,       // Refetch when component mounts
  refetchOnWindowFocus: false,// Refetch when window regains focus
  refetchOnReconnect: true,   // Refetch when internet reconnects
  
  // Retry
  retry: 3,                   // Number of retries on failure
  retryDelay: 1000,          // Delay between retries
  
  // Enabled
  enabled: true,              // Whether query should run
});
```

### Global Configuration
```tsx
// In QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

## Best Practices

### ✅ DO
- Use unique query keys: `['users', userId]` not `['users']`
- Use object query keys for complex queries: `['posts', { status: 'published', page: 1 }]`
- Invalidate related queries after mutations
- Use `enabled` option for dependent queries
- Leverage automatic refetching for real-time data
- Use WebSocket + `setQueryData` for instant updates

### ❌ DON'T
- Don't fetch inside `useEffect` - use `useQuery` instead
- Don't manually manage loading/error states - TanStack Query handles it
- Don't refetch entire data when you can update the cache
- Don't use short staleTime without good reason (causes too many requests)
- Don't ignore error handling

## Common Patterns

### Search with Debounce
```tsx
function useSearchUsers(searchTerm) {
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  return useQuery({
    queryKey: ['users', 'search', debouncedSearch],
    queryFn: () => fetch(`/api/users?q=${debouncedSearch}`),
    enabled: debouncedSearch.length > 2,
  });
}
```

### Polling Until Condition
```tsx
function useJobStatus(jobId) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetch(`/api/jobs/${jobId}`),
    refetchInterval: (data) => {
      // Stop polling when job is complete
      return data?.status === 'complete' ? false : 2000;
    },
  });
}
```

### Combining WebSocket + Query
```tsx
function useRealtimeMessages(chatId) {
  const queryClient = useQueryClient();
  
  // Fetch initial messages
  const query = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetchMessages(chatId),
  });
  
  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://.../${chatId}`);
    
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      
      // Update cache directly
      queryClient.setQueryData(['messages', chatId], (old) => {
        return [...old, newMessage];
      });
    };
    
    return () => ws.close();
  }, [chatId, queryClient]);
  
  return query;
}
```

## Resources
- [Official Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Key Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [Practical Examples](https://tanstack.com/query/latest/docs/react/examples/react/basic)
