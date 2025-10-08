```javascript
// src/context/socketContext.jsx – thin wrapper that reuses AuthContext socket

import { useAuth } from "./AuthContext";

/**
 * useSocket – backward-compatible hook that returns the socket instance from AuthContext.
 * Designed to prevent direct use of useAuth everywhere, and to maintain an existing API.
 */
export function useSocket() {
  const { socket } = useAuth();
  return socket;
}
```