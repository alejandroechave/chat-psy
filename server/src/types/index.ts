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
 * Callback types for Socket.io handlers
 */
export type MessageAckCallback = (_ack: { messageId: string; status: 'sent' | 'failed' }) => void;
export type RoomAckCallback = (_ack: { success: boolean; roomName: string; message?: string; error?: string }) => void;
export type VolunteerJoinCallback = (_ack: { success: boolean; roomName: string; targetUserId: string; message: string; error?: string }) => void;
export type EmergencyCallback = (_ack: { success: boolean; emergencyId?: string; error?: string }) => void;
export type AdminSubscribeCallback = (_ack?: { success: boolean; activeAdmins?: number; error?: string }) => void;

/**
 * Socket events - Strictly typed (non-array form)
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
    caseId?: string;
    userId?: string;
    userName?: string;
    timestamp?: Date;
  };
  'typing:stop': {
    caseId?: string;
    userId?: string;
    timestamp?: Date;
  };

  // Room management events
  'join-crisis-room': void;
  'volunteer-join': { targetUserId: string };
  'volunteer:joined': { volunteerId: string; volunteerName: string; timestamp: Date };

  // Message events
  'send-message': { text: string; targetUserId?: string };

  // Emergency events
  'emergency-trigger': { severity?: string; description?: string };
  'emergency:triggered': { message: string; severity: string; timestamp: Date };
  'emergency:alert': Record<string, unknown>;

  // Admin subscription events
  'admin:subscribe-emergencies': void;
  'admin:unsubscribe-emergencies': void;

  // Session events
  'session:created': CrisisSession;
  'session:closed': {
    caseId: string;
    reason?: string;
  };

  // User events
  'user:online': {
    caseId?: string;
    userId?: string;
    userName?: string;
    role?: UserRole;
    timestamp?: Date;
  };
  'user:offline': {
    caseId?: string;
    userId?: string;
    userName?: string;
    timestamp?: Date;
  };

  // Alert events
  'subscribe:alerts': void;
  'unsubscribe:alerts': void;

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
