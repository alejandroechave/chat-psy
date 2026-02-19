/**
 * Chat Psy WebSocket Server
 * Express + Socket.io server for real-time crisis support chat
 *
 * Architecture:
 * - Clean Architecture principles
 * - Strict TypeScript typing
 * - Middleware-based authentication
 * - Event-driven communication
 */

import 'dotenv/config.js';
import express, { Express, Request, Response } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import cors from 'cors';
import { logger } from './utils/logger.js';
import { authMiddleware, getAuthData } from './middleware/auth.js';
import { initializeChatHandlers } from './sockets/chatHandler.js';
import { SocketEventMap } from './types/index.js';

/**
 * Configuration from environment variables
 */
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  SOCKET_NAMESPACE: process.env.SOCKET_NAMESPACE || '/chat',
  SOCKET_PING_INTERVAL: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10),
  SOCKET_PING_TIMEOUT: parseInt(process.env.SOCKET_PING_TIMEOUT || '20000', 10),
};

/**
 * Initialize Express app
 */
const app: Express = express();

/**
 * Configure CORS middleware
 */
app.use(
  cors({
    origin: config.FRONTEND_URL.split(',').map((url) => url.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

/**
 * Body parser middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

/**
 * API Status endpoint
 */
app.get('/api/status', (req: Request, res: Response) => {
  const io = (req.app.get('io') as IOServer<SocketEventMap>) || null;

  res.status(200).json({
    server: 'Chat Psy WebSocket Server',
    version: '1.0.0',
    status: 'running',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    socket: {
      namespace: config.SOCKET_NAMESPACE,
      connectedClients: io?.engine.clientsCount || 0,
    },
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

/**
 * Error handler middleware
 */
app.use((err: Error, _req: Request, res: Response) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

/**
 * Create HTTP server
 */
const httpServer: HTTPServer = createServer(app);

/**
 * Initialize Socket.io
 */
const io = new IOServer<SocketEventMap>(httpServer, {
  cors: {
    origin: config.FRONTEND_URL.split(',').map((url) => url.trim()),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: config.SOCKET_PING_INTERVAL,
  pingTimeout: config.SOCKET_PING_TIMEOUT,
  maxHttpBufferSize: 1e6, // 1MB max message size
});

/**
 * Socket.io middleware
 */
io.use(authMiddleware(['user', 'volunteer', 'admin']));

/**
 * Socket.io connection handler (default namespace)
 */
io.on('connection', (socket: Socket<SocketEventMap>) => {
  try {
    const authData = getAuthData(socket);

    logger.info('New socket connection', {
      socketId: socket.id,
      userId: authData?.userId,
      caseId: authData?.caseId,
      role: authData?.role,
    });

    // Initialize chat handlers for this socket
    initializeChatHandlers(socket, io);

    // Global error handler for this socket
    socket.on('error', (error: Error) => {
      logger.error('Socket error', {
        socketId: socket.id,
        error: error.message,
      });

      (socket as unknown as Socket).emit('error:message', {
        code: 'SOCKET_ERROR',
        message: error.message,
      });
    });
  } catch (error) {
    logger.error('Error in socket connection handler', error);
    socket.disconnect();
  }
});

/**
 * Store io instance for access in routes
 */
app.set('io', io);

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = (): void => {
  logger.info('Shutting down server gracefully...');

  // Close Socket.io connections
  io.disconnectSockets();

  // Close HTTP server
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

/**
 * Handle process termination signals
 */
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  gracefulShutdown();
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason);
  gracefulShutdown();
});

/**
 * Start server
 */
const startServer = async (): Promise<void> => {
  try {
    httpServer.listen(config.PORT, config.HOST, () => {
      logger.info(`🚀 Chat Psy WebSocket Server started`, {
        environment: config.NODE_ENV,
        host: config.HOST,
        port: config.PORT,
        socketNamespace: config.SOCKET_NAMESPACE,
        frontendUrl: config.FRONTEND_URL,
      });

      logger.info('Available endpoints:');
      logger.info(`  Health: http://${config.HOST}:${config.PORT}/health`);
      logger.info(`  Status: http://${config.HOST}:${config.PORT}/api/status`);
      logger.info(`  WebSocket: ws://${config.HOST}:${config.PORT}${config.SOCKET_NAMESPACE}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

/**
 * Initialize and start
 */
startServer();

export { app, httpServer, io };
