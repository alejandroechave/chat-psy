/**
 * Socket.io event types for client integration
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

export type SocketEventMap = {
  'connection': void;
  'disconnect': string | undefined;
  'auth:join': SocketAuthData;
  'auth:authenticated': { success: boolean; message: string };
  'auth:error': { code: string; message: string };
  'message:send': { caseId: string; text: string; sender: MessageSender };
  'message:receive': ChatMessage;
  'message:ack': { messageId: string; status: MessageStatus };
  'typing:start': { caseId: string; userName: string };
  'typing:stop': { caseId: string };
  'session:created': { id: string; caseId: string };
  'session:closed': { caseId: string; reason?: string };
  'user:online': { caseId: string; userId: string; userName: string; role: UserRole };
  'user:offline': { caseId: string; userId: string };
  'error:message': { code: string; message: string; details?: Record<string, unknown> };
  'join-crisis-room': void;
  'volunteer-join': { targetUserId: string };
  'send-message': { text: string };
  'subscribe:alerts': void;
  'unsubscribe:alerts': void;
  [event: string]: unknown;
};
