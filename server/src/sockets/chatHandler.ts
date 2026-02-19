/**
 * Chat event handlers for crisis support
 * Manages room-based chat communication between users and volunteers
 *
 * Room Structure:
 * - Each user in crisis gets a room: `crisis-{userId}`
 * - Volunteers join the room to provide support
 * - Admins can monitor all rooms
 */

import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
  ChatMessage,
  SocketEventMap,
} from '../types/index.js';
import { logger } from '../utils/logger.js';
import { getAuthData } from '../middleware/auth.js';

/**
 * In-memory room tracking (maps user ID to room info)
 * NOTE: Messages are NOT persisted in memory - flows through WebSocket only
 */
const activeRooms = new Map<string, {
  userId: string;
  createdAt: Date;
  volunteerCount: number;
  lastActivity: Date;
}>();

/**
 * Track connected users per room
 */
const roomUsers = new Map<string, Set<string>>();

/**
 * Track admin subscriptions to emergency alerts
 */
const adminSubscriptions = new Set<string>();

/**
 * Get crisis room name from user ID
 */
const getCrisisRoomName = (userId: string): string => `crisis-${userId}`;

/**
 * Initialize chat handlers for a socket connection
 */
export const initializeChatHandlers = (
  socket: Socket<SocketEventMap>,
  io: Server<SocketEventMap>,
): void => {
  const authData = getAuthData(socket);

  if (!authData) {
    logger.error('Invalid auth data', { socketId: socket.id });
    socket.disconnect();
    return;
  }

  const { userId, caseId, role, userName } = authData;
  const typedSocket = socket as unknown as Socket<SocketEventMap>;
  const typedIo = io as unknown as Server<SocketEventMap>;

  logger.info('Socket connected', { userId, role, socketId: socket.id });

  // ==================== CRISIS ROOM MANAGEMENT ====================

  /**
   * User joins their own crisis room
   * Event: join-crisis-room
   * Fired when a user in crisis first connects
   */
  // @ts-expect-error - Socket.io type definition mismatch for custom events
  typedSocket.on('join-crisis-room', (callback?: (ack: any) => void) => {
    try {
      const roomName = getCrisisRoomName(userId);

      // Join this user to their personal crisis room
      socket.join(roomName);

      // Track this room
      if (!activeRooms.has(roomName)) {
        activeRooms.set(roomName, {
          userId,
          createdAt: new Date(),
          volunteerCount: 0,
          lastActivity: new Date(),
        });
      }

      // Track room users
      if (!roomUsers.has(roomName)) {
        roomUsers.set(roomName, new Set());
      }
      roomUsers.get(roomName)?.add(socket.id);

      logger.info('User joined crisis room', {
        userId,
        roomName,
        socketId: socket.id,
      });

      // Acknowledge with room info
      callback?.({
        success: true,
        roomName,
        message: `Crisis session started. Room: ${roomName}`,
      });

      // Notify others in room that user is online
      typedSocket.broadcast.to(roomName).emit('user:online', {
        userId,
        userName,
        role: 'user',
        timestamp: new Date(),
      });

    } catch (error) {
      logger.error('Error joining crisis room', { userId, error });
      callback?.({
        success: false,
        error: 'Failed to join crisis room',
      });
    }
  });

  /**
   * Volunteer joins an existing crisis room
   * Event: volunteer-join
   * Payload: { targetUserId: string (the user in crisis they want to help) }
   */
  typedSocket.on('volunteer-join', (payload: any, callback?: (ack: any) => void) => {
    try {
      if (role !== 'volunteer' && role !== 'admin') {
        throw new Error('Only volunteers and admins can join crisis rooms');
      }

      const { targetUserId } = payload;
      if (!targetUserId) {
        throw new Error('targetUserId is required');
      }

      const roomName = getCrisisRoomName(targetUserId);

      // Volunteer joins the room
      socket.join(roomName);

      // Update room volunteer count
      const room = activeRooms.get(roomName);
      if (room) {
        room.volunteerCount += 1;
        room.lastActivity = new Date();
      }

      // Track room users
      if (!roomUsers.has(roomName)) {
        roomUsers.set(roomName, new Set());
      }
      roomUsers.get(roomName)?.add(socket.id);

      logger.info('Volunteer joined crisis room', {
        volunteerId: userId,
        targetUserId,
        roomName,
        socketId: socket.id,
      });

      // Acknowledge volunteer
      callback?.({
        success: true,
        roomName,
        targetUserId,
        message: `You have joined the crisis session for user ${targetUserId}`,
      });

      // Notify room members that volunteer arrived
      typedIo.to(roomName).emit('volunteer:joined', {
        volunteerId: userId,
        volunteerName: userName,
        timestamp: new Date(),
      });

    } catch (error) {
      logger.error('Error volunteer joining crisis room', { userId, error });
      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room',
      });
    }
  });

  // ==================== MESSAGE HANDLING ====================

  /**
   * Send message to crisis room
   * Event: send-message
   * Only goes to members in the same room (not persisted in RAM)
   */
  typedSocket.on(
    'send-message',
    async (
      payload: { text: string; targetUserId?: string },
      callback?: (ack: { messageId: string; status: 'sent' | 'failed' }) => void,
    ): Promise<void> => {
      try {
        const { text } = payload;

        // Validate message
        if (!text || text.trim() === '') {
          logger.warn('Empty message attempted', { userId });
          callback?.({
            messageId: '',
            status: 'failed',
          });
          return;
        }

        const messageId = uuidv4();
        
        // Build message object (not stored)
        const message: ChatMessage = {
          id: messageId,
          caseId: caseId || payload.targetUserId || '',
          userId,
          text: text.trim(),
          sender: role === 'volunteer' ? 'support' : 'user',
          timestamp: new Date(),
          status: 'sent',
        };

        // Determine room to send to
        const roomName = payload.targetUserId
          ? getCrisisRoomName(payload.targetUserId)
          : getCrisisRoomName(userId);

        // Emit to room only
        typedIo.to(roomName).emit('message:receive', message);

        logger.debug('Message sent to room', {
          messageId,
          userId,
          roomName,
          textLength: text.length,
        });

        callback?.({ messageId, status: 'sent' });
      } catch (error) {
        logger.error('Error sending message', { userId, error });
        callback?.({ messageId: '', status: 'failed' });
      }
    }
  );

  // ==================== EMERGENCY HANDLING ====================

  /**
   * Emergency trigger (panic button)
   * Event: emergency-trigger
   * Notifies all admins immediately
   */
  typedSocket.on('emergency-trigger', (payload: any, callback?: (ack: any) => void) => {
    try {
      const emergencyId = uuidv4();
      const roomName = getCrisisRoomName(userId);

      const emergencyAlert = {
        id: emergencyId,
        userId,
        userName,
        severity: payload?.severity || 'high',
        description: payload?.description || 'Emergency triggered',
        timestamp: new Date(),
        roomName,
      };

      logger.error('EMERGENCY ALERT', {
        emergencyId,
        userId,
        userName,
        severity: emergencyAlert.severity,
      });

      // Notify all admins (admins should listen to 'emergency:alert')
      typedIo.emit('emergency:alert', emergencyAlert);

      // Notify room members
      typedIo.to(roomName).emit('emergency:triggered', {
        message: '🚨 EMERGENCY - Administrators have been notified',
        severity: emergencyAlert.severity,
        timestamp: new Date(),
      });

      // Send system message to room
      typedIo.to(roomName).emit('message:receive', {
        id: uuidv4(),
        caseId: roomName,
        userId: 'SYSTEM',
        text: '🚨 Pánico activado - Se ha notificado a los administradores',
        sender: 'support',
        timestamp: new Date(),
        status: 'sent',
      } as ChatMessage);

      logger.info('Emergency alert sent', {
        emergencyId,
        adminCount: adminSubscriptions.size,
      });

      callback?.({ success: true, emergencyId });
    } catch (error) {
      logger.error('Error triggering emergency', { userId, error });
      callback?.({ success: false, error: 'Failed to trigger emergency alert' });
    }
  });

  // ==================== ADMIN FEATURES ====================

  /**
   * Admin subscribes to emergency alerts
   * Event: admin:subscribe-emergencies
   */
  typedSocket.on('admin:subscribe-emergencies', (callback?: (ack: any) => void) => {
    try {
      if (role !== 'admin') throw new Error('Only admins can subscribe to emergencies');
      adminSubscriptions.add(socket.id);
      logger.info('Admin subscribed to emergency alerts', { adminId: userId, totalAdmins: adminSubscriptions.size });
      callback?.({ success: true, activeAdmins: adminSubscriptions.size });
    } catch (error) {
      logger.error('Error subscribing to emergencies', { userId, error });
      callback?.({ success: false, error: error instanceof Error ? error.message : 'Failed' });
    }
  });

  typedSocket.on('admin:unsubscribe-emergencies', (callback?: (ack: any) => void) => {
    try {
      adminSubscriptions.delete(socket.id);
      logger.info('Admin unsubscribed from emergency alerts', { adminId: userId, totalAdmins: adminSubscriptions.size });
      callback?.({ success: true });
    } catch (error) {
      logger.error('Error unsubscribing from emergencies', { userId, error });
      callback?.({ success: false, error: 'Failed to unsubscribe' });
    }
  });

  // ==================== TYPING INDICATORS ====================

  typedSocket.on('typing:start', (payload: SocketEventMap['typing:start']): void => {
    try {
      const roomName = getCrisisRoomName(userId);
      typedSocket.broadcast.to(roomName).emit('typing:start', { userId, userName, timestamp: new Date() });
      logger.debug('Typing indicator sent', { userId, roomName });
    } catch (error) {
      logger.error('Error sending typing indicator', { userId, error });
    }
  });

  typedSocket.on('typing:stop', (payload: SocketEventMap['typing:stop']): void => {
    try {
      const roomName = getCrisisRoomName(userId);
      typedSocket.broadcast.to(roomName).emit('typing:stop', { userId, timestamp: new Date() });
      logger.debug('Typing stopped', { userId, roomName });
    } catch (error) {
      logger.error('Error stopping typing', { userId, error });
    }
  });

  // ==================== DISCONNECT HANDLING ====================

  typedSocket.on('disconnect', (reason: string): void => {
    try {
      const userRooms = Array.from(roomUsers.entries()).filter(([_, users]) => users.has(socket.id)).map(([room]) => room);

      logger.info('Socket disconnect', { userId, socketId: socket.id, reason, affectedRooms: userRooms.length });

      // Send disconnect message to all affected rooms
      userRooms.forEach((roomName) => {
        typedIo.to(roomName).emit('message:receive', {
          id: uuidv4(),
          caseId: roomName,
          userId: 'SYSTEM',
          text: `La conexión se ha perdido. Intentando reestablecer...`,
          sender: 'support',
          timestamp: new Date(),
          status: 'sent',
        } as ChatMessage);

        // Remove user from room tracking
        roomUsers.get(roomName)?.delete(socket.id);

        // Notify others
        typedIo.to(roomName).emit('user:offline', { userId, userName, timestamp: new Date() });

        logger.debug('Disconnect notification sent', { roomName, reason });
      });

      // If user was in crisis, update room lastActivity
      if (role === 'user') {
        const crisisRoom = getCrisisRoomName(userId);
        const room = activeRooms.get(crisisRoom);
        if (room) room.lastActivity = new Date();
      }

      // Remove from admin subscriptions if applicable
      if (role === 'admin') adminSubscriptions.delete(socket.id);

      logger.info('Cleanup completed for disconnected user', { userId });
    } catch (error) {
      logger.error('Error handling disconnect', { userId, error });
    }
  });
};

/**
 * Get active room information
 * For REST API integration or admin dashboard
 */
export const getActiveRoomInfo = (userId: string): any => {
  const roomName = getCrisisRoomName(userId);
  const room = activeRooms.get(roomName);
  const users = roomUsers.get(roomName);

  if (!room) return null;

  return {
    roomName,
    userId,
    createdAt: room.createdAt,
    volunteerCount: room.volunteerCount,
    totalMembers: users?.size || 0,
    lastActivity: room.lastActivity,
    isActive: users && users.size > 0,
  };
};

/**
 * Get all active rooms
 * For admin dashboard
 */
export const getAllActiveRooms = (): any[] => {
  return Array.from(activeRooms.entries()).map(([roomName, room]) => ({
    roomName,
    ...room,
    totalMembers: roomUsers.get(roomName)?.size || 0,
  }));
};

/**
 * Close room explicitly
 * Should be called after session ends
 */
export const closeRoom = (userId: string, reason?: string): void => {
  const roomName = getCrisisRoomName(userId);
  activeRooms.delete(roomName);
  roomUsers.delete(roomName);

  logger.info('Room closed', { userId, roomName, reason });
};

/**
 * Clean up stale rooms (no activity for X minutes)
 * Call this periodically from server
 */
export const cleanupStaleRooms = (maxInactiveMinutes: number = 30): number => {
  const now = new Date();
  const maxInactiveTime = maxInactiveMinutes * 60 * 1000;
  let cleanedCount = 0;

  activeRooms.forEach((room, roomName) => {
    const inactiveTime = now.getTime() - room.lastActivity.getTime();

    if (inactiveTime > maxInactiveTime) {
      // Only remove if empty
      if ((roomUsers.get(roomName)?.size || 0) === 0) {
        activeRooms.delete(roomName);
        roomUsers.delete(roomName);
        cleanedCount++;

        logger.debug('Stale room cleaned up', { roomName, inactiveMinutes: Math.floor(inactiveTime / 60000) });
      }
    }
  });

  if (cleanedCount > 0) logger.info('Room cleanup completed', { cleanedRooms: cleanedCount, activeRooms: activeRooms.size });

  return cleanedCount;
};

/**
 * Get admin subscription count
 */
export const getAdminSubscriptionCount = (): number => adminSubscriptions.size;
