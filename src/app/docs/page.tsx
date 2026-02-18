'use client';

import { useState } from 'react';
import { Container, Card, CardHeader, CardBody, Button } from '@/components/ui';
import { useCrisisSession } from '@/hooks';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Demo hook instance
  const session = useCrisisSession({
    caseId: 'CASE-DOC-001',
    userId: 'USR-DOC-001',
    volunteerId: 'VOL-001',
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const USAGE_EXAMPLE = `'use client';

import { useCrisisSession } from '@/hooks';

export default function ChatDemo() {
  const session = useCrisisSession({
    caseId: 'CASE-001',
    userId: 'USR-123',
    maxStorageTime: 60 * 60 * 1000, // 1 hour
    maxRetries: 3,
  });

  const handleSendMessage = async (text: string) => {
    const result = await session.sendMessage(text, 'user');
    if (result) {
      console.log('Message sent:', result);
    }
  };

  return (
    <div>
      <div className="messages">
        {session.messages.map((msg) => (
          <div key={msg.id}>
            <p>{msg.text}</p>
            <span>{msg.status}</span>
          </div>
        ))}
      </div>

      {session.error && (
        <p className="error">{session.error}</p>
      )}

      <textarea
        placeholder="Type message..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
}`;

  const SECURITY_EXAMPLE = `// Secure cleanup on session close
const handleCloseSession = async () => {
  // Close session
  await session.closeSession();
  
  // Or force immediate cleanup (for testing)
  // await session.forceCleanup();
  
  // After destruction, all messages and sensitive data
  // are cleared from memory and localStorage
};`;

  const ERROR_HANDLING = `// Handle connection loss
if (session.connectionStatus === 'disconnected') {
  <div className="notification">
    <p>Connection lost. Reconecting...</p>
    {session.unsentMessageCount > 0 && (
      <p>{session.unsentMessageCount} messages waiting to send</p>
    )}
  </div>
}

// Retry failed messages
if (session.hasUnsentMessages) {
  <button onClick={() => {
    session.unsentMessages.forEach((msg) => {
      session.retryMessage(msg.id);
    });
  }}>
    Retry ({session.unsentMessageCount})
  </button>
}`;

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
              <h1 className="text-xl font-bold text-gray-900">
                Documentación: useCrisisSession
              </h1>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container size="lg" className="py-8 space-y-8">
        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs"
            className="border-2 border-blue-600 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <p className="font-bold text-blue-900">← Frontend Documentation</p>
            <p className="text-sm text-blue-700">useCrisisSession Hook</p>
          </Link>
          <Link
            href="/server-docs"
            className="border-2 border-purple-600 bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <p className="font-bold text-purple-900">Backend Documentation →</p>
            <p className="text-sm text-purple-700">WebSocket Server Setup</p>
          </Link>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Hook useCrisisSession</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              Hook personalizado para manejar sesiones de chat efímeras con soporte para:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>✅ Gestión de mensajes (envío, retries, estado)</li>
              <li>✅ Historial de sesiones previas</li>
              <li>✅ Manejo de desconexiones con "Reconectando..."</li>
              <li>✅ <strong>Borrado Seguro</strong>: Limpieza completa de datos al cerrar sesión</li>
              <li>✅ Reintentos con backoff exponencial</li>
              <li>✅ TypeScript 100% tipado</li>
              <li>✅ Ready para Socket.io o Firebase Realtime DB</li>
            </ul>
          </CardBody>
        </Card>

        {/* Type Definition */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Tipos Definidos</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-gray-900 whitespace-pre-wrap break-words">
                {`interface Message {
  id: string;              // Identificador único
  text: string;            // Contenido del mensaje
  sender: 'user'|'support'; // Quién envía
  timestamp: Date;         // Cuándo se envió
  status: 'sending'|'sent'|'failed'; // Estado actual
}

type ConnectionStatus = 
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting';`}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Configuración</h3>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-gray-900 whitespace-pre-wrap break-words">
                {`interface CrisisSessionConfig {
  caseId: string;           // Requerido: ID del caso
  userId: string;           // Requerido: ID del usuario
  volunteerId?: string;     // Opcional: ID del voluntario
  maxStorageTime?: number;  // Default: 1 hora (milisegundos)
  autoCleanupDelay?: number; // Default: 5 minutos
  maxRetries?: number;      // Default: 3 intentos
}`}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
              Ejemplo de Uso
              <button
                onClick={() => handleCopyCode(USAGE_EXAMPLE)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-900 rounded hover:bg-blue-200"
              >
                {copiedCode === USAGE_EXAMPLE ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copiar
              </button>
            </h3>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {USAGE_EXAMPLE}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Handle Disconnection */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Manejo de Desconexión</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              Cuando se pierde la conexión, la interfaz muestra "Reconectando..." de forma no intrusiva
              mientras el hook intenta restaurar la conexión con backoff exponencial (máx. 30 segundos).
            </p>
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {ERROR_HANDLING}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Secure Cleanup */}
        <Card className="border-l-4 border-red-500">
          <CardHeader>
            <h3 className="text-xl font-bold text-red-900">🔒 Borrado Seguro (Critical)</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              <strong>Función crítica de seguridad:</strong> Al finalizar la sesión, todos los datos
              sensibles se limpian automáticamente para proteger la privacidad del usuario en dispositivos compartidos.
            </p>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-red-900">Qué se limpia:</h4>
              <ul className="text-sm text-red-900 space-y-2 ml-4">
                <li>❌ Todos los mensajes de la sesión (estado)</li>
                <li>❌ Mensajes no enviados / fallos</li>
                <li>❌ Datos de sesión en localStorage</li>
                <li>❌ Timestamps y referencias de usuario</li>
                <li>❌ Estado de conexión y errores</li>
              </ul>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {SECURITY_EXAMPLE}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* API Reference */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">API Reference</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                {
                  name: 'sendMessage(text, sender?)',
                  desc: 'Envía un mensaje. Retorna Promise<Message | null>',
                },
                {
                  name: 'retryMessage(messageId)',
                  desc: 'Reintenta enviar un mensaje fallido',
                },
                {
                  name: 'closeSession()',
                  desc: 'Cierra la sesión y programa limpieza',
                },
                {
                  name: 'forceCleanup()',
                  desc: 'Fuerza limpieza inmediata (testing)',
                },
                {
                  name: 'handleConnectionLoss()',
                  desc: 'Maneja pérdida de conexión',
                },
                {
                  name: 'getSessionState()',
                  desc: 'Retorna snapshot del estado actual',
                },
              ].map((api, idx) => (
                <div key={idx} className="border-b pb-3">
                  <p className="font-mono font-semibold text-blue-900">{api.name}</p>
                  <p className="text-sm text-gray-700">{api.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Live Demo */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Demo en Vivo</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">Estado Conexión</p>
                <p className="text-lg font-bold text-blue-900">
                  {session.connectionStatus}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-xs text-green-700 font-medium">Mensajes</p>
                <p className="text-lg font-bold text-green-900">
                  {session.messageCount}
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">No Enviados</p>
                <p className="text-lg font-bold text-amber-900">
                  {session.unsentMessageCount}
                </p>
              </div>

              {session.error && (
                <div className="col-span-2 md:col-span-3 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-xs text-red-700 font-medium mb-1">Error</p>
                  <p className="text-sm text-red-900">{session.error}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => session.sendMessage('Test message from demo', 'support')}
                disabled={!session.sessionActive}
              >
                Enviar Mensaje Test
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => session.handleConnectionLoss()}
              >
                Simular Desconexión
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => session.forceCleanup()}
              >
                Forzar Limpieza
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Socket.io Integration */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Integración con Socket.io</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 mb-4">
              El hook está diseñado para integrar fácilmente con Socket.io:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {`useEffect(() => {
  const socket = io(SOCKET_URL);

  socket.on('connect', () => {
    session.handleConnectionRestored?.();
  });

  socket.on('disconnect', () => {
    session.handleConnectionLoss();
  });

  socket.on('message:received', (msg) => {
    setMessages(prev => [...prev, msg]);
  });

  return () => socket.disconnect();
}, []);`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="border-t pt-8 text-center">
          <Link
            href="/chat"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Ver Chat Demo
          </Link>
        </div>
      </Container>
    </div>
  );
}
