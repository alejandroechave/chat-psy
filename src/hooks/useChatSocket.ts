/**
 * Socket.io client hook for Chat Psy
 * Connects to WebSocket server and manages real-time events
 *
 * Usage:
 * const socket = useChatSocket({
 *   caseId: 'case-001',
 *   userId: 'user-123',
 *   role: 'user',
 *   userName: 'John Doe'
 * });
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SocketEventMap, ChatMessage, UserRole } from '@/types/socket';

interface UseChatSocketConfig {
  caseId: string;
  userId: string;
  role: UserRole;
  userName: string;
  serverUrl?: string;
}

interface UseChatSocketReturn {
  socket: any | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  error: string | null;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  disconnect: () => void;
}

/**
 * Note: Socket.io client is NOT included in this repo
 * Install via: npm install socket.io-client
 * Then import: import io from 'socket.io-client';
 */
export function useChatSocket(config: UseChatSocketConfig): UseChatSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<any>(null);

  const serverUrl = config.serverUrl || 'http://localhost:3001/chat';

  // Note: In a real implementation, you would:
  // 1. Import: import io from 'socket.io-client';
  // 2. Initialize socket: const socket = io(serverUrl, { auth: {...} });
  // 3. Handle events and state

  // For now, return mock implementation
  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!socketRef.current) {
      setError('Socket not connected');
      return;
    }
    // socketRef.current.emit('message:send', { ... });
  }, []);

  const disconnect = useCallback((): void => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setIsConnected(false);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    socket: null,
    isConnected,
    isAuthenticated,
    error,
    messages,
    sendMessage,
    disconnect,
  };
}
