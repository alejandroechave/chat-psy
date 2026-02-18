/**
 * Chat Psy WebSocket Server
 * Real-time communication for crisis support chat
 *
 * Usage: node index.js (or npm start)
 * Port: 4000 (default)
 * Health Check: GET /health
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.WEB_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// Health Check Endpoint
// ============================================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================================
// Metrics Endpoint
// ============================================================================
app.get('/metrics', (req, res) => {
  const metrics = {
    server: {
      status: 'running',
      environment: NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
    socket: {
      connectedClients: io.engine.clientsCount,
      rooms: io.sockets.adapter.rooms.size,
    },
  };
  res.json(metrics);
});

// ============================================================================
// Socket.IO Event Handlers
// ============================================================================

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Join a crisis session room
  socket.on('join-session', (sessionId) => {
    socket.join(`session:${sessionId}`);
    console.log(`[Socket] User ${socket.id} joined session ${sessionId}`);

    // Notify others in the room
    socket.to(`session:${sessionId}`).emit('user-joined', {
      userId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  // Receive and broadcast chat message
  socket.on('send-message', (data) => {
    const { sessionId, message, senderId, senderName } = data;

    const broadcastData = {
      id: Math.random().toString(36).substring(7),
      sessionId,
      senderId,
      senderName,
      message,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all users in the session room
    io.to(`session:${sessionId}`).emit('receive-message', broadcastData);
    console.log(`[Socket] Message in session ${sessionId}: ${senderId}`);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { sessionId, userId, isTyping } = data;
    socket.to(`session:${sessionId}`).emit('user-typing', {
      userId,
      isTyping,
      timestamp: new Date().toISOString(),
    });
  });

  // User status update
  socket.on('status-update', (data) => {
    const { sessionId, userId, status } = data;
    socket.to(`session:${sessionId}`).emit('user-status', {
      userId,
      status, // online, away, offline, etc.
      timestamp: new Date().toISOString(),
    });
  });

  // Leave session
  socket.on('leave-session', (sessionId) => {
    socket.leave(`session:${sessionId}`);
    socket.to(`session:${sessionId}`).emit('user-left', {
      userId: socket.id,
      timestamp: new Date().toISOString(),
    });
    console.log(`[Socket] User ${socket.id} left session ${sessionId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`[Socket] Error from ${socket.id}:`, error);
  });
});

// ============================================================================
// HTTP Server Error Handling
// ============================================================================

httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    io.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    io.close();
    process.exit(0);
  });
});

// ============================================================================
// Start Server
// ============================================================================

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Chat Psy - WebSocket Server (Socket.IO)         ║
╚════════════════════════════════════════════════════╝

📡 Server running on port ${PORT}
🌍 Environment: ${NODE_ENV}
🔗 CORS Origin: ${process.env.WEB_URL || 'http://localhost:3000'}
✓ Ready for WebSocket connections

Health Check: GET http://localhost:${PORT}/health
Metrics: GET http://localhost:${PORT}/metrics
  `);
});

export default io;
