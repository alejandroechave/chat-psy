/**
 * Authentication middleware for Socket.io
 * Validates user roles and authentication tokens
 */

import type { Socket } from 'socket.io';
import type { SocketAuthData, UserRole, SocketEventMap } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Validates user role against required roles
 */
export const validateUserRole = (
  userRole: UserRole,
  requiredRoles: UserRole[],
): boolean => {
  return requiredRoles.includes(userRole);
};

/**
 * Middleware to authenticate socket connections
 * Validates required auth data and role
 */
export const authMiddleware = (requiredRoles: UserRole[] = ['user', 'volunteer']) => {
  return async (socket: Socket<SocketEventMap>, next: (_err?: Error) => void): Promise<void> => {
    try {
      // Get auth data from handshake query
      const authData = socket.handshake.auth as Partial<SocketAuthData> | undefined;

      // Validate required fields
      if (!authData?.userId || !authData.caseId || !authData.role) {
        logger.warn('Socket auth failed: Missing required fields', {
          socketId: socket.id,
          auth: authData,
        });
        return next(
          new Error(
            'Authentication failed: Missing required fields (userId, caseId, role)',
          ),
        );
      }

      // Validate role
      if (!validateUserRole(authData.role, requiredRoles)) {
        logger.warn('Socket auth failed: Invalid role', {
          socketId: socket.id,
          role: authData.role,
          required: requiredRoles,
        });
        return next(new Error(`Invalid role: ${authData.role}`));
      }

      // Validate userName
      if (!authData.userName || authData.userName.trim() === '') {
        logger.warn('Socket auth failed: Empty userName', {
          socketId: socket.id,
        });
        return next(new Error('Authentication failed: userName cannot be empty'));
      }

      // In a production app, validate token here
      // if (authData.token) {
      //   const decoded = verifyJWT(authData.token);
      //   if (!decoded) return next(new Error('Invalid token'));
      // }

      // Attach auth data to socket
      (socket.data as unknown as SocketAuthData) = authData as SocketAuthData;

      logger.info('Socket authenticated', {
        socketId: socket.id,
        userId: authData.userId,
        caseId: authData.caseId,
        role: authData.role,
      });

      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Socket auth middleware error', error);
      next(new Error(`Authentication error: ${errorMessage}`));
    }
  };
};

/**
 * Middleware to verify socket is authenticated
 */
export const verifyAuthenticated = (socket: Socket<SocketEventMap>, next: (err?: Error) => void): void => {
  const authData = socket.data as unknown as Partial<SocketAuthData> | undefined;

  if (!authData?.userId || !authData.caseId) {
    logger.warn('Socket verification failed: Not authenticated', {
      socketId: socket.id,
    });
    return next(new Error('Socket not authenticated'));
  }

  next();
};

/**
 * Middleware to verify user role
 */
export const verifyRole = (requiredRoles: UserRole[]) => {
  return (socket: Socket<SocketEventMap>, next: (_err?: Error) => void): void => {
    const authData = socket.data as unknown as Partial<SocketAuthData> | undefined;

    if (!authData?.role) {
      logger.warn('Socket role verification failed: No role', {
        socketId: socket.id,
      });
      return next(new Error('No role information'));
    }

    if (!validateUserRole(authData.role, requiredRoles)) {
      logger.warn('Socket role verification failed: Invalid role', {
        socketId: socket.id,
        role: authData.role,
        required: requiredRoles,
      });
      return next(new Error(`Insufficient role: ${authData.role}`));
    }

    next();
  };
};

/**
 * Helper to get auth data from socket
 */
export const getAuthData = (socket: Socket<SocketEventMap>): SocketAuthData | null => {
  const authData = socket.data as unknown as Partial<SocketAuthData> | undefined;

  if (authData?.userId && authData.caseId && authData.role && authData.userName) {
    return authData as SocketAuthData;
  }

  return null;
};
