'use client';

import { useState } from 'react';
import { Container } from '@/components/ui';
import { ChatRoom } from '@/components/chat';
import type { MessageBubble } from '@/components/chat';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MOCK_INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    content: '¡Hola! Soy el equipo de apoyo. ¿Cómo estás?',
    sender: 'support' as const,
    timestamp: new Date(Date.now() - 5 * 60000),
    status: 'sent' as const,
  },
  {
    id: 'msg-2',
    content: 'Hola, gracias por estar aquí. Me siento muy ansioso.',
    sender: 'user' as const,
    timestamp: new Date(Date.now() - 4 * 60000),
    status: 'sent' as const,
  },
  {
    id: 'msg-3',
    content:
      'Entiendo. La ansiedad puede ser muy difícil. Te voy a guiar con una técnica de respiración que puede ayudarte. ¿Estás en un lugar seguro?',
    sender: 'support' as const,
    timestamp: new Date(Date.now() - 3 * 60000),
    status: 'sent' as const,
  },
  {
    id: 'msg-4',
    content: 'Sí, estoy en casa. Mi corazón late muy rápido.',
    sender: 'user' as const,
    timestamp: new Date(Date.now() - 2 * 60000),
    status: 'sent' as const,
  },
];

export default function ChatDemoPage() {
  const [sessionActive, setSessionActive] = useState(true);
  const [messageLog, setMessageLog] = useState<string[]>([]);

  const handleMessageSent = async (message: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log message (in real app, send to backend)
    setMessageLog((prev) => [...prev, message]);
    console.log('Message sent:', message);

    // Simulate volunteer response after 2 seconds
    setTimeout(() => {
      if (messageLog.length > 0) {
        console.log('Volunteer is typing...');
      }
    }, 2000);
  };

  const handleCloseSession = () => {
    setSessionActive(false);
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
              <h1 className="text-xl font-bold text-gray-900">Demo de Chat</h1>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container size="xl" className="py-8">
        {!sessionActive ? (
          // Session Closed View
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center max-w-md mx-auto">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sesión Cerrada</h2>
            <p className="text-gray-600 mb-6">
              Gracias por usar nuestro servicio de apoyo. Esperamos haber ayudado.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Volver al Panel
            </Link>
          </div>
        ) : (
          // Chat View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Room */}
            <div className="lg:col-span-2">
              <ChatRoom
                caseId="CASE-004"
                userName="Juan R."
                volunteerName="Psic. Silva"
                isOpen={sessionActive}
                onClose={handleCloseSession}
                onMessageSent={handleMessageSent}
                initialMessages={MOCK_INITIAL_MESSAGES}
              />
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              {/* Case Info */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Información del Caso</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs">ID de Caso</p>
                    <p className="text-gray-900 font-semibold">CASE-004</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Usuario</p>
                    <p className="text-gray-900 font-semibold">Juan R.</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Voluntario</p>
                    <p className="text-gray-900 font-semibold">Psic. Silva</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Tipo de Crisis</p>
                    <p className="text-gray-900 font-semibold">Ansiedad</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Estado</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 text-xs font-semibold rounded-full">
                      En Proceso
                    </span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Características</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Scroll automático</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Indicador &quot;Escribiendo...&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Protocolo de Emergencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Manejo de errores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Botón Reintentar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Ready para Socket.io</span>
                  </li>
                </ul>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                  💡 Cómo Usar
                </h4>
                <ul className="text-xs text-blue-900 space-y-1">
                  <li>• Escribe un mensaje y presiona Enter</li>
                  <li>• Usa Shift + Enter para nueva línea</li>
                  <li>• Haz clic en el botón 🚨 para emergencia</li>
                  <li>• Cierra la sesión con el botón X</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
