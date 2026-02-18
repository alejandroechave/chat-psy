'use client';

import { useState } from 'react';
import { Container } from '@/components/ui';
import { VolunteerDashboard } from '@/components/sections';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [selectedCase, setSelectedCase] = useState<{
    caseId: string;
    userId: string;
  } | null>(null);

  const handleCaseSelect = (caseId: string, userId: string) => {
    setSelectedCase({ caseId, userId });
    // In a real app, this would navigate to a chat room or case details page
    console.log(`Attending case: ${caseId} (User: ${userId})`);
    alert(`Abriendo sala de chat para el caso ${caseId}`);
  };

  const handleBack = () => {
    setSelectedCase(null);
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
              <h1 className="text-xl font-bold text-gray-900">Panel de Voluntarios</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="text-xs text-gray-600">Usuario:</p>
              <p className="text-sm font-semibold text-gray-900">Psic. Silva</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 font-medium text-sm transition-colors">
              Salir
            </button>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container size="xl" className="py-8">
        {selectedCase ? (
          // Case Details View
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
              <div>
                <p className="text-sm text-gray-600">Caso atendiendo:</p>
                <p className="text-xl font-bold text-gray-900">{selectedCase.caseId}</p>
              </div>
            </div>

            {/* Chat Room Placeholder */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
              <p className="text-gray-600 mb-4">
                Sala de chat para el caso {selectedCase.caseId}
              </p>
              <p className="text-sm text-gray-500">
                IntegRAción de chat en desarrollo
              </p>
            </div>
          </div>
        ) : (
          // Dashboard View
          <VolunteerDashboard onCaseSelect={handleCaseSelect} />
        )}
      </Container>
    </div>
  );
}
