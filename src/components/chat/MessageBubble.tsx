'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export type MessageSender = 'user' | 'support';
export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface MessageBubbleProps {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  status?: MessageStatus;
  onRetry?: () => void;
  className?: string;
}

/**
 * MessageBubble Component
 * Displays individual messages in a chat interface
 * Differentiates between user messages (right) and support messages (left)
 */
export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  (
    {
      id,
      content,
      sender,
      timestamp,
      status = 'sent',
      onRetry,
      className = '',
    },
    ref,
  ) => {
    const isUserMessage = sender === 'user';
    const isFailed = status === 'failed';
    const isSending = status === 'sending';

    // Format timestamp
    const timeString = timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div
        ref={ref}
        className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} gap-3 mb-4 ${className}`}
        aria-label={`Mensaje de ${sender === 'user' ? 'usuario' : 'apoyo'}: ${content}`}
      >
        {/* Support Avatar (left side only) */}
        {!isUserMessage && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-900">SF</span>
          </div>
        )}

        {/* Message Content */}
        <div
          className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'} max-w-xs sm:max-w-sm lg:max-w-md gap-1`}
        >
          {/* Bubble Container */}
          <div
            className={`rounded-xl px-4 py-3 relative group transition-all duration-200 ${
              isUserMessage
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
            } ${isFailed ? 'ring-2 ring-red-500' : ''} ${
              isSending ? 'opacity-70' : 'opacity-100'
            }`}
          >
            {/* Message Text */}
            <p className="text-sm leading-relaxed break-words">{content}</p>

            {/* Failed Badge */}
            {isFailed && (
              <div className="mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
                <span className="text-xs font-medium text-red-600">No enviado</span>
              </div>
            )}

            {/* Sending Indicator */}
            {isSending && (
              <div className="mt-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse delay-100"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse delay-200"></div>
              </div>
            )}
          </div>

          {/* Time and Status Row */}
          <div className={`flex items-center gap-2 text-xs px-1 ${
            isUserMessage ? 'text-blue-600' : 'text-gray-600'
          }`}>
            <span>{timeString}</span>

            {/* Status Indicator */}
            {status === 'sending' && (
              <span className="text-gray-500" aria-label="Enviando">⏳</span>
            )}
            {status === 'sent' && !isUserMessage && null}
            {status === 'sent' && isUserMessage && (
              <span className="text-blue-600" aria-label="Entregado">✓✓</span>
            )}

            {/* Retry Button (visible on hover when failed) */}
            {isFailed && onRetry && (
              <button
                onClick={onRetry}
                className="ml-auto px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Reintentar envío de mensaje: ${content}`}
              >
                Reintentar
              </button>
            )}
          </div>
        </div>

        {/* User Avatar (right side only) */}
        {isUserMessage && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-700 flex items-center justify-center">
            <span className="text-xs font-bold text-white">U</span>
          </div>
        )}
      </div>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';
