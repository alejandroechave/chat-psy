'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Message Type Definition
 * Strictly typed for chat communication
 */
export type MessageSender = 'user' | 'support';
export type MessageStatus = 'sending' | 'sent' | 'failed';
export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
}

/**
 * Crisis Session Configuration
 */
export interface CrisisSessionConfig {
  caseId: string;
  userId: string;
  volunteerId?: string;
  maxStorageTime?: number; // in milliseconds, default 1 hour
  autoCleanupDelay?: number; // delay before cleanup after session close
  maxRetries?: number; // maximum retry attempts for failed messages
}

/**
 * Crisis Session State
 */
export interface CrisisSessionState {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  error: string | null;
  sessionActive: boolean;
  messageCount: number;
  lastMessageTime: Date | null;
  unsentMessages: Map<string, Message>;
}

/**
 * useCrisisSession Hook
 * Manages ephemeral chat sessions with secure cleanup, error handling, and reconnection logic
 * Ready for Socket.io or Firebase Realtime Database integration
 */
export function useCrisisSession(config: CrisisSessionConfig) {
  // Validate required config
  if (!config.caseId || !config.userId) {
    throw new Error(
      'useCrisisSession: caseId and userId are required in config',
    );
  }

  const maxStorageTime = config.maxStorageTime ?? 60 * 60 * 1000; // 1 hour default
  const autoCleanupDelay = config.autoCleanupDelay ?? 5 * 60 * 1000; // 5 minutes default
  const maxRetries = config.maxRetries ?? 3;

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  // References for cleanup and reconnection
  const sessionStartTime = useRef<Date | null>(null);
  const unsentMessagesRef = useRef<Map<string, Message>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttempts = useRef(0);

  /**
   * Load previous messages from session (if resuming)
   */
  const loadPreviousMessages = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, fetch from backend/database
      // Example: const response = await fetch(`/api/sessions/${config.caseId}/messages`);
      // For now, simulate with empty array (fresh session)
      const previousMessages: Message[] = [];

      // Filter out messages older than maxStorageTime
      const now = new Date();
      const validMessages = previousMessages.filter((msg) => {
        const messageAge = now.getTime() - msg.timestamp.getTime();
        return messageAge < maxStorageTime;
      });

      setMessages(validMessages);
      sessionStartTime.current = new Date();
      setSessionActive(true);
      setConnectionStatus('connected');
      connectionAttempts.current = 0;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load session history';
      setError(errorMessage);
      console.error('useCrisisSession: Failed to load previous messages:', err);
      // Continue with empty session if load fails
      sessionStartTime.current = new Date();
      setSessionActive(true);
    } finally {
      setIsLoading(false);
    }
  }, [maxStorageTime]);

  /**
   * Send a message and track for retry if needed
   */
  const sendMessage = useCallback(
    async (text: string, sender: MessageSender = 'user'): Promise<Message | null> => {
      if (!text.trim) {
        setError('Message text cannot be empty');
        return null;
      }

      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newMessage: Message = {
        id: messageId,
        text: text.trim(),
        sender,
        timestamp: new Date(),
        status: 'sending',
      };

      try {
        setError(null);

        // Add to messages immediately for optimistic update
        setMessages((prev) => [...prev, newMessage]);

        // In a real implementation, send to backend
        // Example: await fetch(`/api/sessions/${config.caseId}/messages`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...newMessage,
        //     caseId: config.caseId,
        //     userId: config.userId,
        //   }),
        // });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Update status to sent
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: 'sent' } : msg,
          ),
        );

        // Remove from unsent queue if it was there
        unsentMessagesRef.current.delete(messageId);

        return { ...newMessage, status: 'sent' };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to send message';

        // Update status to failed
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: 'failed' } : msg,
          ),
        );

        // Add to unsent queue for retry
        unsentMessagesRef.current.set(messageId, newMessage);

        setError(`Message not sent: ${errorMsg}`);
        console.error('useCrisisSession: Failed to send message:', err);

        return null;
      }
    },
    [config.caseId, config.userId],
  );

  /**
   * Retry sending a failed message
   */
  const retryMessage = useCallback(
    async (messageId: string): Promise<boolean> => {
      const unsentMessage = unsentMessagesRef.current.get(messageId);

      if (!unsentMessage) {
        setError(`Message ${messageId} not found in unsent queue`);
        return false;
      }

      let retryCount = 0;

      while (retryCount < maxRetries) {
        try {
          setError(null);

          // Update status to sending
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: 'sending' } : msg,
            ),
          );

          // In a real implementation, retry the send
          // await fetch(..., { method: 'POST', ... });
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Success
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: 'sent' } : msg,
            ),
          );

          unsentMessagesRef.current.delete(messageId);
          return true;
        } catch (err) {
          retryCount++;
          if (retryCount >= maxRetries) {
            const errorMsg =
              err instanceof Error
                ? err.message
                : 'Max retries exceeded';
            setError(`Failed to resend message: ${errorMsg}`);
            console.error('useCrisisSession: Max retries exceeded:', err);
            return false;
          }

          // Wait before retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, retryCount) * 1000),
          );
        }
      }

      return false;
    },
    [maxRetries],
  );

  /**
   * Handle connection loss
   */
  const handleConnectionLoss = useCallback(() => {
    setConnectionStatus('disconnected');
    setError('Connection lost. Attempting to reconnect...');

    // Clear previous reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Implement exponential backoff for reconnection
    const attemptReconnect = () => {
      setConnectionStatus('reconnecting');
      connectionAttempts.current += 1;

      // In a real implementation, attempt to reconnect here
      // For demo, simulate successful reconnection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (connectionAttempts.current <= 5) {
          // Max 5 reconnection attempts
          console.log(
            `useCrisisSession: Reconnection attempt ${connectionAttempts.current}`,
          );

          // Simulate reconnection success
          setConnectionStatus('connected');
          setError(null);

          // Retry any unsent messages
          if (unsentMessagesRef.current.size > 0) {
            console.log(
              `useCrisisSession: Retrying ${unsentMessagesRef.current.size} unsent messages`,
            );
            unsentMessagesRef.current.forEach((msg) => {
              retryMessage(msg.id);
            });
          }
        } else {
          // Too many failed attempts
          setError(
            'Unable to reconnect. Please check your connection and try again.',
          );
          console.error('useCrisisSession: Reconnection failed after 5 attempts');
        }
      }, Math.min(Math.pow(2, connectionAttempts.current) * 1000, 30000)); // Max 30s wait
    };

    attemptReconnect();
  }, [retryMessage]);

  /**
   * Secure cleanup function
   * Clears all messages and session data from local storage
   * CRITICAL: Called on session close to protect user privacy on shared devices
   */
  const secureCleanup = useCallback(async (): Promise<void> => {
    try {
      console.log(
        `useCrisisSession: Initiating secure cleanup for case ${config.caseId}`,
      );

      // Clear messages from state
      setMessages([]);

      // Clear unsent messages
      unsentMessagesRef.current.clear();

      // Clear session start time
      sessionStartTime.current = null;

      // Reset connection status
      setConnectionStatus('idle');

      // Clear error messages
      setError(null);

      // Mark session as inactive
      setSessionActive(false);

      // In a real implementation:
      // 1. Send cleanup request to backend
      // await fetch(`/api/sessions/${config.caseId}/cleanup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ timestamp: new Date() }),
      // });

      // 2. Wipe local storage
      const sessionKeys = Object.keys(localStorage).filter((key) =>
        key.includes(config.caseId),
      );
      sessionKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      // 3. Securely overwrite sensitive data in memory
      // (This is an example - in production, use more robust methods)
      const sensitiveData = new Array(1000).fill('0');
      sensitiveData.forEach(() => {
        // Force garbage collection hint
      });

      console.log(
        `useCrisisSession: Secure cleanup completed for case ${config.caseId}`,
      );
    } catch (err) {
      console.error('useCrisisSession: Error during secure cleanup:', err);
    }
  }, [config.caseId]);

  /**
   * Close session and schedule cleanup
   */
  const closeSession = useCallback(async (): Promise<void> => {
    try {
      setSessionActive(false);
      setConnectionStatus('idle');

      // Schedule cleanup after delay (allow time for final UI updates)
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      cleanupTimeoutRef.current = setTimeout(() => {
        secureCleanup();
      }, autoCleanupDelay);

      console.log(
        `useCrisisSession: Session closed. Cleanup scheduled in ${autoCleanupDelay}ms`,
      );
    } catch (err) {
      console.error('useCrisisSession: Error closing session:', err);
    }
  }, [autoCleanupDelay, secureCleanup]);

  /**
   * Manual immediate cleanup (for testing or emergency scenarios)
   */
  const forceCleanup = useCallback(async (): Promise<void> => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    await secureCleanup();
  }, [secureCleanup]);

  /**
   * Get current session state
   */
  const getSessionState = useCallback((): CrisisSessionState => {
    return {
      messages,
      connectionStatus,
      isLoading,
      error,
      sessionActive,
      messageCount: messages.length,
      lastMessageTime: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
      unsentMessages: new Map(unsentMessagesRef.current),
    };
  }, [messages, connectionStatus, isLoading, error, sessionActive]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  // Initialize session on mount
  useEffect(() => {
    loadPreviousMessages();
  }, [loadPreviousMessages]);

  return {
    // State
    messages,
    connectionStatus,
    isLoading,
    error,
    sessionActive,

    // Actions
    sendMessage,
    retryMessage,
    closeSession,
    handleConnectionLoss,

    // Cleanup (security-critical)
    secureCleanup,
    forceCleanup,

    // Utilities
    getSessionState,
    messageCount: messages.length,
    unsentMessageCount: unsentMessagesRef.current.size,
    hasUnsentMessages: unsentMessagesRef.current.size > 0,
  };
}
