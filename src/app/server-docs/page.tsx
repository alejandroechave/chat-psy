'use client';

import { Container, Card, CardHeader, CardBody, Button } from '@/components/ui';
import { ArrowLeft, Terminal, Download, Server, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ServerDocsPage() {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <Container size="lg" className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Volver a inicio"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Inicio</span>
            </Link>
            <div className="border-l border-gray-200 pl-4">
              <h1 className="text-xl font-bold text-gray-900">Servidor WebSocket</h1>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container size="lg" className="py-8 space-y-8">
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Chat Psy WebSocket Server</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              Servidor Node.js con Express + Socket.io para comunicación en tiempo real entre usuarios y voluntarios.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-semibold mb-3">📍 Ubicación del Proyecto:</p>
              <p className="text-sm font-mono bg-white p-2 rounded text-gray-900 break-words">
                ./server/
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Installation */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Instalación Rápida
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">1. Instalar Dependencias</p>
                <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    cd server && npm install
                  </code>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">2. Configurar Variables de Entorno</p>
                <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    cp .env.example .env.local
                  </code>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">3. Iniciar Servidor (Desarrollo)</p>
                <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    npm run dev
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                ✅ Servidor ejecutándose en <strong>http://localhost:3001</strong>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Architecture */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Estructura del Proyecto</h3>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-900 overflow-x-auto">
              <pre>{`server/
├── src/
│   ├── types/
│   │   └── index.ts         ← Tipos SocketEventMap (strictly typed)
│   ├── middleware/
│   │   └── auth.ts          ← Auth middleware + role validation
│   ├── sockets/
│   │   └── chatHandler.ts   ← Chat event handlers
│   ├── utils/
│   │   └── logger.ts        ← Logging service
│   └── server.ts            ← Express + Socket.io server
├── dist/                    ← Build output (compiled JS)
├── package.json
├── tsconfig.json
└── .env.example`}</pre>
            </div>
          </CardBody>
        </Card>

        {/* Key Technologies */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Tecnologías Principales
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Express', desc: 'Web framework' },
                { name: 'Socket.io 4.6', desc: 'Real-time communication' },
                { name: 'TypeScript 5', desc: 'Type safety' },
                { name: 'CORS', desc: 'Cross-origin support' },
                { name: 'UUID', desc: 'Unique identifiers' },
                { name: 'dotenv', desc: 'Environment config' },
              ].map((tech, idx) => (
                <div key={idx} className="border border-gray-200 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900">{tech.name}</p>
                  <p className="text-sm text-gray-600">{tech.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Configuración (.env)</h3>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-900 overflow-x-auto">
              <pre>{`NODE_ENV=development
PORT=3001
HOST=localhost

# Frontend URL (CORS origin)
FRONTEND_URL=http://localhost:3000

# WebSocket settings
SOCKET_NAMESPACE=/chat
SOCKET_PING_INTERVAL=25000
SOCKET_PING_TIMEOUT=20000

# Timeouts
SESSION_TIMEOUT=3600000
MESSAGE_RETENTION_TIME=3600000

# Logging
LOG_LEVEL=debug`}</pre>
            </div>
          </CardBody>
        </Card>

        {/* WebSocket Events */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Eventos Socket.io (TypeScript Tipados)</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  title: 'Autenticación',
                  events: ['auth:join', 'auth:authenticated', 'auth:error'],
                },
                {
                  title: 'Mensajes',
                  events: ['message:send', 'message:receive', 'message:ack'],
                },
                {
                  title: 'Indicadores',
                  events: ['typing:start', 'typing:stop'],
                },
                {
                  title: 'Sesiones',
                  events: ['session:created', 'session:closed'],
                },
                {
                  title: 'Presencia',
                  events: ['user:online', 'user:offline'],
                },
              ].map((section, idx) => (
                <div key={idx} className="border-b pb-3 last:border-0">
                  <p className="font-semibold text-gray-900 mb-2">{section.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {section.events.map((event, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-mono rounded"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Authentication Flow */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Flujo de Autenticación</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  label: 'Cliente conecta con handshake',
                  desc: 'auth: { userId, caseId, role, userName }',
                },
                {
                  step: 2,
                  label: 'Middleware valida datos',
                  desc: 'Verifica campos requeridos y rol válido',
                },
                {
                  step: 3,
                  label: 'Socket autenticado',
                  desc: 'Se emite "auth:authenticated"',
                },
                {
                  step: 4,
                  label: 'Acceso a eventos',
                  desc: 'Puede enviar/recibir mensajes',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Roles & Permissions */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Roles de Usuario</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                {
                  role: 'user',
                  desc: 'Persona en crisis buscando apoyo',
                  permissions: ['Enviar mensajes', 'Ver historial', 'Indicador escribiendo'],
                },
                {
                  role: 'volunteer',
                  desc: 'Psicólogo o voluntario de primera respuesta',
                  permissions: ['Enviar/recibir mensajes', 'Gestionar sesiones', 'Ver datos caso'],
                },
                {
                  role: 'admin',
                  desc: 'Administrador del sistema',
                  permissions: ['Acceso completo', 'Ver todas sesiones', 'Cerrar sesiones'],
                },
              ].map((item, idx) => (
                <div key={idx} className="border border-gray-200 p-4 rounded-lg">
                  <p className="font-mono font-semibold text-gray-900 mb-2">{item.role}</p>
                  <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    {item.permissions.map((perm, i) => (
                      <li key={i}>✓ {perm}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Production Deployment */}
        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Despliegue (Build Producción)</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Compilar TypeScript</p>
                <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">npm run build</code>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Iniciar en Producción</p>
                <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    NODE_ENV=production npm start
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-900 mb-2">📋 Checklist:</p>
              <ul className="text-sm text-purple-900 space-y-1 ml-4">
                <li>☐ Cambiar FRONTEND_URL a dominio producción</li>
                <li>☐ Usar base de datos real (MongoDB/PostgreSQL)</li>
                <li>☐ Configurar JWT para autenticación</li>
                <li>☐ Implementar rate limiting</li>
                <li>☐ Usar HTTPS/WSS</li>
                <li>☐ Setup monitoring y alertas</li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Endpoints REST</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                {
                  method: 'GET',
                  path: '/health',
                  desc: 'Health check del servidor',
                  response: '{ status: "ok", timestamp: ... }',
                },
                {
                  method: 'GET',
                  path: '/api/status',
                  desc: 'Estado del servidor y conexiones',
                  response: '{ server: ..., connectedClients: N }',
                },
              ].map((endpoint, idx) => (
                <div key={idx} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-900">
                      {endpoint.method}
                    </span>
                    <code className="font-mono text-gray-900">{endpoint.path}</code>
                  </div>
                  <p className="text-sm text-gray-600">{endpoint.desc}</p>
                  <p className="text-xs text-gray-500 mt-2">Respuesta: {endpoint.response}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Resources */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <h3 className="text-xl font-bold text-blue-900">Recursos Adicionales</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-blue-900">
              Documentación completa disponible en:
            </p>
            <div className="space-y-2">
              <a
                href="#"
                className="block px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-sm font-medium"
              >
                📖 README.md del Servidor
              </a>
              <a
                href="https://socket.io/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-sm font-medium"
              >
                🔗 Socket.io Documentation
              </a>
              <a
                href="https://expressjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-sm font-medium"
              >
                🔗 Express.js Guide
              </a>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            ← Volver a Docs
          </Link>
          <a
            href="http://localhost:3001/health"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            🔗 Testear Servidor (http://localhost:3001/health)
          </a>
        </div>
      </Container>
    </div>
  );
}
