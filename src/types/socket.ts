/**
 * Socket.io event types for client and server integration
 */

export type UserRole = 'user' | 'volunteer' | 'admin';

export interface SocketAuthData {
  userId: string;
  caseId: string;
  role: UserRole;
  userName: string;
  token?: string;
}

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

// Event callback types
export interface MessageAckCallback {
  messageId: string;
  status: 'sent' | 'failed';
}

export interface RoomAckCallback {
  success: boolean;
  roomName: string;
  message?: string;
  error?: string;
}

export interface VolunteerJoinCallback {
  success: boolean;
  roomName: string;
  targetUserId: string;
  message: string;
  error?: string;
}

export interface EmergencyCallback {
  success: boolean;
  emergencyId?: string;
  error?: string;
}

// Socket event map for proper typing
export type SocketEventMap = {
  'connection': void;
  'disconnect': string | undefined;
  'auth:join': SocketAuthData;
  'auth:authenticated': { success: boolean; message: string };
  'auth:error': { code: string; message: string };
  'message:send': { caseId: string; text: string; sender: MessageSender };
  'message:receive': ChatMessage;
  'message:ack': { messageId: string; status: MessageStatus };
  'typing:start': { caseId?: string; userId?: string; userName?: string; timestamp?: Date };
  'typing:stop': { caseId?: string; userId?: string; timestamp?: Date };
  'session:created': { id: string; caseId: string };
  'session:closed': { caseId: string; reason?: string };
  'user:online': { caseId?: string; userId?: string; userName?: string; role?: UserRole; timestamp?: Date };
  'user:offline': { caseId?: string; userId?: string; userName?: string; timestamp?: Date };
  'volunteer:joined': { volunteerId: string; volunteerName: string; timestamp: Date };
  'emergency:triggered': { message: string; severity: string; timestamp: Date };
  'emergency:alert': Record<string, unknown>;
  'error:message': { code: string; message: string; details?: Record<string, unknown> };
  'join-crisis-room': void;
  'volunteer-join': { targetUserId: string };
  'send-message': { text: string; targetUserId?: string };
  'emergency-trigger': { severity?: string; description?: string };
  'admin:subscribe-emergencies': void;
  'admin:unsubscribe-emergencies': void;
  'subscribe:alerts': void;
  'unsubscribe:alerts': void;
};
