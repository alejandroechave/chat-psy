/**
 * User role types
 */
export type UserRole = 'user' | 'volunteer' | 'admin';

/**
 * Socket authentication data
 */
export interface SocketAuthData {
  userId: string;
  caseId: string;
  role: UserRole;
  userName: string;
  token?: string;
}

/**
 * Chat message types
 */
export type MessageSender = 'user' | 'support';
export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ChatMessage {
  id: string;
  caseId: string;
  userId: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
  readBy?: string[];
}

/**
 * Connection status
 */
export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

/**
 * Crisis session
 */
export interface CrisisSession {
  id: string;
  caseId: string;
  userId: string;
  volunteerId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'closed';
}

/**
 * Socket events - Strictly typed
 */
export type SocketEventMap = {
  // Connection events
  'connection': void;
  'disconnect': string | undefined;

  // Authentication
  'auth:join': SocketAuthData;
  'auth:authenticated': { success: boolean; message: string };
  'auth:error': { code: string; message: string };

  // Chat events
  'message:send': {
    caseId: string;
    text: string;
    sender: MessageSender;
  };
  'message:receive': ChatMessage;
  'message:ack': {
    messageId: string;
    status: MessageStatus;
  };

  // Typing indicators
  'typing:start': {
    caseId: string;
    userName: string;
  };
  'typing:stop': {
    caseId: string;
  };

  // Session events
  'session:created': CrisisSession;
  'session:closed': {
    caseId: string;
    reason?: string;
  };

  // User events
  'user:online': {
    caseId: string;
    userId: string;
    userName: string;
    role: UserRole;
  };
  'user:offline': {
    caseId: string;
    userId: string;
  };

  // Error events
  'error:message': {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };

  // Reconnect events
  'reconnect_attempt': number;
  'reconnect': undefined;
};

/**
 * Typed Socket.io socket with auth data
 */
export interface AuthenticatedSocket extends SocketAuthData {
  socketId: string;
  connectedAt: Date;
}
