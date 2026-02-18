'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import {
  Send,
  Phone,
  AlertTriangle,
  X,
  CheckCircle2,
  Loader,
} from 'lucide-react';
import PostCrisisForm from './PostCrisisForm';
import { useCrisisSession } from '@/hooks/useCrisisSession';
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
}

export interface ChatRoomProps {
  caseId: string;
  volunteerId?: string;
  userName: string;
  volunteerName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onMessageSent?: (message: string) => Promise<void> | void;
  className?: string;
  initialMessages?: Message[];
}

const EMERGENCY_NUMBERS = {
  suicide: '024 (prevención de suicidio)',
  crisis: '1457 (línea de crisis)',
  police: '911 (emergencias)',
  mental: 'IAPEM: 0800-222-4373',
};

/**
 * ChatRoom Component
 * Provides real-time communication interface between user and support volunteer
 * Features auto-scroll, typing indicators, emergency protocol, and error handling
 * Ready for Socket.io or Firebase integration
 */
export const ChatRoom = React.forwardRef<HTMLDivElement, ChatRoomProps>(
  (
    {
      caseId,
      volunteerId,
      userName,
      volunteerName = 'Equipo de Apoyo',
      isOpen = true,
      onClose,
      onMessageSent,
      className = '',
      initialMessages = [],
    },
    ref,
  ) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVolunteerTyping, setIsVolunteerTyping] = useState(false);
    const [showEmergencyMenu, setShowEmergencyMenu] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryQueue, setRetryQueue] = useState<Map<string, () => Promise<void>>>(
      new Map(),
    );

    const [showPostForm, setShowPostForm] = useState(false);
    const session = useCrisisSession({
      caseId,
      userId: userName, // Note: In production, pass actual userId
      volunteerId,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to newest message
    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input on mount
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    // Handle message sending
    const handleSendMessage = useCallback(async () => {
      if (!inputValue.trim()) {
        return;
      }

      const messageId = `msg-${Date.now()}`;
      const newMessage: Message = {
        id: messageId,
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
      };

      // Add message to UI immediately
      setMessages((prev) => [...prev, newMessage]);
      setInputValue('');
      setIsSending(true);
      setError(null);

      // Define retry function
      const sendMessageAsync = async () => {
        try {
          // Call parent handler if provided
          if (onMessageSent) {
            await onMessageSent(inputValue);
          }

          // Update message status to 'sent'
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: 'sent' } : msg,
            ),
          );

          // Remove from retry queue
          setRetryQueue((prev) => {
            const newQueue = new Map(prev);
            newQueue.delete(messageId);
            return newQueue;
          });
        } catch (err) {
          console.error('Failed to send message:', err);

          // Update message status to 'failed'
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: 'failed' } : msg,
            ),
          );

          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo enviar el mensaje. Intenta de nuevo.',
          );

          // Add to retry queue
          setRetryQueue((prev) => new Map(prev).set(messageId, sendMessageAsync));
        } finally {
          setIsSending(false);
        }
      };

      await sendMessageAsync();
    }, [inputValue, onMessageSent]);

    // Handle retry
    const handleRetry = useCallback(
      async (messageId: string) => {
        const retryFn = retryQueue.get(messageId);
        if (retryFn) {
          setIsSending(true);
          await retryFn();
        }
      },
      [retryQueue],
    );

    // Handle Enter to send (Shift+Enter for new line)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    // Send emergency protocol message
    const handleEmergencyProtocol = async () => {
      const emergencyMessage = `PROTOCOLO DE EMERGENCIA - NÚMEROS LOCALES:\n\n${Object.entries(EMERGENCY_NUMBERS)
        .map(([, number]) => `• ${number}`)
        .join('\n')}\n\nSi te encuentras en peligro inmediato, contacta al 911.`;

      const messageId = `msg-emergency-${Date.now()}`;
      const newMessage: Message = {
        id: messageId,
        content: emergencyMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, newMessage]);
      setShowEmergencyMenu(false);

      try {
        if (onMessageSent) {
          await onMessageSent(emergencyMessage);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: 'sent' } : msg,
          ),
        );
      } catch (err) {
        console.error('Failed to send emergency protocol:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: 'failed' } : msg,
          ),
        );
      }
    };

    // Simulate volunteer typing indicator (in real app, come from socket event)
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVolunteerTyping(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, [isVolunteerTyping]);

    if (!isOpen) {
      return null;
    }

    return (
      <Card
        ref={ref}
        className={`flex flex-col h-[600px] md:h-[500px] bg-white ${className}`}
      >
        {/* Header */}
        <CardHeader className="border-b-2 border-gray-200 flex flex-row items-center justify-between pb-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{volunteerName}</h2>
            <p className="text-xs text-gray-600">
              {isVolunteerTyping ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Escribiendo...
                </span>
              ) : (
                `Chat con ${userName}`
              )}
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar sesión de ayuda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </CardHeader>

        {/* Messages Container */}
        <CardBody
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white p-4 md:p-6"
       
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CheckCircle2 className="w-12 h-12 text-blue-500 mb-3" />
              <p className="text-gray-900 font-medium mb-1">Sesión iniciada</p>
              <p className="text-sm text-gray-600">
                {volunteerName} está aquí para apoyarte
              </p>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  {...message}
                  onRetry={() => handleRetry(message.id)}
                />
              ))}

              {/* Volunteer Typing Indicator */}
              {isVolunteerTyping && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-900">SF</span>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </CardBody>

        {/* Error Message */}
        {error && (
          <div className="px-4 md:px-6 py-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t-2 border-gray-200 bg-white p-4 md:p-6 space-y-3">
          {/* Emergency Menu */}
          {showEmergencyMenu && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Contactos de Emergencia
              </p>
              <div className="space-y-1 text-xs text-red-800">
                {Object.entries(EMERGENCY_NUMBERS).map(([key, number]) => (
                  <p key={key}>• {number}</p>
                ))}
              </div>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                onClick={handleEmergencyProtocol}
                className="flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Enviar Contactos
              </Button>
            </div>
          )}

          {/* Input Form */}
          <div className="flex gap-2 items-end">
            <button
              onClick={() => setShowEmergencyMenu(!showEmergencyMenu)}
              className="p-2.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex-shrink-0"
              aria-label="Abrir protocolo de emergencia"
              title="Protocolo de Emergencia"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>

            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje... (Shift + Enter para nueva línea)"
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 text-sm"
              rows={2}
              disabled={isSending}
              aria-label="Campo de entrada de mensaje"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-shrink-0 flex items-center justify-center"
              aria-label="Enviar mensaje"
            >
              {isSending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Keyboard Hint */}
          <p className="text-xs text-gray-500 px-2">
            📌 Presiona Enter para enviar, Shift + Enter para nueva línea
          </p>
        </div>

          {/* Post Crisis Form */}
          {showPostForm && (
            <div className="border-t border-gray-200 bg-white px-4 md:px-6 py-4">
              <PostCrisisForm session={session} />
            </div>
          )}

        {/* Session Info (footer) */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 md:px-6 py-2 text-xs text-gray-600 flex items-center justify-between">
          <span>ID de caso: {caseId}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPostForm((s) => !s)}
              className="flex items-center gap-1"
            >
              {showPostForm ? 'Ocultar formulario' : 'Formulario post-crisis'}
            </Button>
            {onClose && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  },
);

ChatRoom.displayName = 'ChatRoom';
