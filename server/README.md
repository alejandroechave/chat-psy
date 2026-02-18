# Chat Psy WebSocket Server

Production-ready WebSocket server for real-time crisis support chat using Express, Socket.io, and TypeScript.

## Features

✅ **Real-time Communication**: Socket.io with WebSocket & Polling fallback  
✅ **Type-Safe**: 100% TypeScript strict mode  
✅ **Clean Architecture**: Middleware-based, separation of concerns  
✅ **Authentication**: Role-based access control (User/Volunteer/Admin)  
✅ **CORS Support**: Configured for Next.js frontend  
✅ **Graceful Shutdown**: Proper cleanup on process termination  
✅ **Comprehensive Logging**: Debug/Info/Warn/Error levels  
✅ **Session Management**: In-memory storage (upgradeable to DB)  
✅ **Error Handling**: Global error handlers with recovery  

## Quick Start

### Prerequisites

- Node.js ≥ 18.0.0
- npm or yarn

### Installation

```bash
cd server
npm install
```

### Configuration

Copy `.env.example` to `.env.local` (or `.env` for development):

```bash
cp .env.example .env.local
```

Update values as needed:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
server/
├── src/
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts    # Socket events, auth data, message types
│   ├── middleware/      # Express/Socket.io middleware
│   │   └── auth.ts     # Authentication & role validation
│   ├── sockets/         # Socket.io handlers
│   │   └── chatHandler.ts  # Chat events logic
│   ├── utils/           # Utility functions
│   │   └── logger.ts    # Logging service
│   └── server.ts        # Main server entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## API Endpoints

### REST Endpoints

- `GET /health` - Health check
- `GET /api/status` - Server status & connected clients

### WebSocket Events

#### Authentication

```typescript
// Client → Server
emit('auth:join', {
  caseId: string;
  userId: string;
  role: 'user' | 'volunteer';
  userName: string;
})

// Server → Client
emit('auth:authenticated', { success: boolean; message: string })
emit('auth:error', { code: string; message: string })
```

#### Messages

```typescript
// Client → Server
emit('message:send', {
  caseId: string;
  text: string;
  sender: 'user' | 'support';
})

// Server → Client (Broadcast)
emit('message:receive', ChatMessage)
```

#### Typing Indicator

```typescript
// Client → Server
emit('typing:start', { caseId: string; userName: string })
emit('typing:stop', { caseId: string })

// Server → Client (Broadcast to others)
emit('typing:start', { caseId: string; userName: string })
emit('typing:stop', { caseId: string })
```

#### User Presence

```typescript
// Server → Client (Broadcast)
emit('user:online', {
  caseId: string;
  userId: string;
  userName: string;
  role: 'user' | 'volunteer';
})
emit('user:offline', { caseId: string; userId: string })
```

#### Sessions

```typescript
// Client → Server
emit('session:closed', { caseId: string; reason?: string })

// Server → Client (Broadcast)
emit('session:closed', { caseId: string; reason?: string })
```

## Type Safety Reference

All Socket.io events are strictly typed via `SocketEventMap`:

```typescript
export type SocketEventMap = {
  'message:send': { ... }
  'message:receive': ChatMessage
  // ... all events
}
```

## Authentication & Authorization

The server uses multi-layer authentication:

1. **Connection Middleware**: Validates auth data on handshake
2. **Socket Middleware**: Verifies role and permissions
3. **Event Handlers**: Additional validation per operation

Required auth fields:
- `userId`: User identifier
- `caseId`: Crisis case ID
- `role`: User role (user/volunteer/admin)
- `userName`: Display name
- `token` (optional): JWT for advanced auth

## Session Management

### In-Memory (Current)

Sessions are stored in memory using `Map`:
- Perfect for development
- Auto-cleanup on server restart
- Messages lost on restart

### Production (Recommended)

Upgrade `chatHandler.ts` to use:
- MongoDB for persistence
- Redis for cache
- PostgreSQL with real-time triggers

## Logging

Four log levels controlled by `LOG_LEVEL`:

```env
LOG_LEVEL=debug  # All logs
LOG_LEVEL=info   # Info+, no debug
LOG_LEVEL=warn   # Warnings+
LOG_LEVEL=error  # Errors only
```

Logs include color-coded timestamps and structured data.

## Error Handling

Global error handling at:
- Socket connection level
- Event handler level
- Express middleware level
- Process level (uncaught exceptions)

## Graceful Shutdown

Server handles signals: SIGTERM, SIGINT

Graceful shutdown sequence:
1. Stop accepting new connections
2. Disconnect existing sockets
3. Close HTTP server
4. Exit process

Timeout: 10 seconds before forced exit

## CORS Configuration

Frontend URL (from `FRONTEND_URL` env):

```
Allowed Origins: http://localhost:3000
Allowed Methods: GET, POST, OPTIONS
Credentials: true
```

## Development Tips

### Enable Debug Logging

```env
LOG_LEVEL=debug
```

### Test WebSocket Connection

Use [Socket.io Client](https://socket.io/docs/v4/socket-io-client-api/) for testing:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001/chat', {
  auth: {
    userId: 'user-123',
    caseId: 'case-001',
    role: 'user',
    userName: 'John Doe'
  }
});

socket.on('auth:authenticated', (data) => {
  console.log('Connected:', data);
});
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure real database (MongoDB/PostgreSQL)
- [ ] Implement JWT authentication
- [ ] Setup message persistence
- [ ] Configure Redis for session cache
- [ ] Enable HTTPS/WSS
- [ ] Setup monitoring & alerts
- [ ] Rate limiting on events
- [ ] Message encryption
- [ ] Audit logging

## License

MIT
