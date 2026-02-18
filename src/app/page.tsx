'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Container, Button, Card, CardHeader, CardBody, CardFooter, BreathingCircle } from '@/components/ui';
import { EmergencyHeader, HeroSection, ProtocolGrid } from '@/components/sections';
import { useBreathingExercise } from '@/hooks';
import { BREATHING_EXERCISES, CALM_COLORS } from '@/lib/constants';
import { formatTime } from '@/lib/utils';

export default function Home() {
  const [selectedExercise, setSelectedExercise] = useState('BASIC');
  const exercisesRef = useRef<HTMLDivElement>(null);
  const exerciseConfig =
    BREATHING_EXERCISES[selectedExercise as keyof typeof BREATHING_EXERCISES];
  const { phase, isActive, startExercise, stopExercise } =
    useBreathingExercise(exerciseConfig);

  const handleHeroCtaClick = () => {
    if (exercisesRef.current) {
      exercisesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmergencyClick = () => {
    console.log('Emergency header interaction logged');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Header */}
      <EmergencyHeader onEmergencyClick={handleEmergencyClick} />

      {/* Hero Section */}
      <HeroSection onHelpClick={handleHeroCtaClick} scrollToId="exercises" />

      {/* Main Content */}
      <div ref={exercisesRef} id="exercises" className="scroll-mt-20">
        <Container size="lg" className="py-20">
          <div className="space-y-12">
            {/* Exercise Selector */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Elige tu Ejercicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(BREATHING_EXERCISES).map(([key, exercise]) => (
                  <button
                    key={key}
                    onClick={() => !isActive && setSelectedExercise(key)}
                    disabled={isActive}
                    className={`p-4 rounded-lg text-left transition-all duration-200 ${
                      selectedExercise === key
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-primary hover:shadow-md'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    aria-pressed={selectedExercise === key}
                    aria-label={`Select ${exercise.name} exercise`}
                  >
                    <h3 className="font-semibold mb-1">{exercise.name}</h3>
                    <p className="text-sm opacity-75">{exercise.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Breathing Circle 4-7-8 Section */}
            <section className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Técnica de Respiración 4-7-8
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Reduce tu ritmo cardíaco con esta técnica probada científicamente:
                  inhala durante 4 segundos, mantén durante 7, exhala durante 8.
                </p>
              </div>

              <Card variant="elevated" className="flex justify-center py-12">
                <BreathingCircle size={280} showDebug={false} />
              </Card>

              <p className="text-sm text-gray-500 text-center">
                El ejercicio se pausará automáticamente si cambias de pestaña.
              </p>
            </section>

            {/* PAP Protocol Grid Section */}
            <section className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Primeros Auxilios Psicológicos (PAP)
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Aprende los tres pasos fundamentales para apoyar a alguien en crisis: 
                  Escuchar, Proteger y Conectar. Busca los pasos o expande cada tarjeta para más detalles.
                </p>
              </div>
              <ProtocolGrid />
            </section>

            {/* Active Exercise Display */}
            <section className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-2xl font-bold">{exerciseConfig.name}</h3>
                  <p className="text-gray-600 mt-2">
                    {exerciseConfig.description}
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    {/* Status Display */}
                    <div className="text-center">
                      <div
                        className={`inline-block p-8 rounded-full transition-colors duration-300 ${
                          phase.phase === 'inhale'
                            ? 'bg-blue-100'
                            : phase.phase === 'hold'
                              ? 'bg-yellow-100'
                              : phase.phase === 'exhale'
                                ? 'bg-green-100'
                                : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-5xl font-bold text-primary mb-4">
                          {formatTime(phase.remainingTime)}
                        </p>
                        <div className="space-y-2">
                          <p className="text-xl font-semibold capitalize">
                            {phase.phase === 'ready'
                              ? 'Listo para comenzar'
                              : phase.phase === 'completed'
                                ? '¡Completado!'
                                : phase.phase === 'inhale'
                                  ? 'Respira Profundamente'
                                  : phase.phase === 'hold'
                                    ? 'Aguanta la Respiración'
                                    : 'Exhala Lentamente'}
                          </p>
                          {phase.phase !== 'ready' &&
                            phase.phase !== 'completed' && (
                              <p className="text-sm text-gray-600">
                                Ciclo {phase.currentCycle} de{' '}
                                {phase.totalCycles}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Exercise Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Inhalación</p>
                        <p className="text-2xl font-bold text-primary">
                          {exerciseConfig.inhaleCount}s
                        </p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm text-gray-600">Pausa</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {exerciseConfig.holdCount}s
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Exhalación</p>
                        <p className="text-2xl font-bold text-accent">
                          {exerciseConfig.exhaleCount}s
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  {!isActive ? (
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={startExercise}
                      aria-label={`Start ${exerciseConfig.name} exercise`}
                    >
                      Comenzar Ejercicio
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onClick={stopExercise}
                      aria-label="Stop breathing exercise"
                    >
                      Detener
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </section>

            {/* Color Palette Info */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Paleta de Colores Calm
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div
                    className="h-24 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: CALM_COLORS.primary }}
                  />
                  <p className="font-semibold">Primary</p>
                  <p className="text-sm text-gray-600">{CALM_COLORS.primary}</p>
                </div>
                <div className="space-y-2">
                  <div
                    className="h-24 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: CALM_COLORS.background }}
                  />
                  <p className="font-semibold">Background</p>
                  <p className="text-sm text-gray-600">
                    {CALM_COLORS.background}
                  </p>
                </div>
                <div className="space-y-2">
                  <div
                    className="h-24 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: CALM_COLORS.accent }}
                  />
                  <p className="font-semibold">Accent</p>
                  <p className="text-sm text-gray-600">{CALM_COLORS.accent}</p>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <Container size="lg" className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-center md:text-left text-gray-600">
              © 2025 Chat Psy. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/chat"
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors inline-flex items-center gap-2"
              >
                Demo Chat
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors inline-flex items-center gap-2"
              >
                Panel de Voluntarios
              </Link>
              <Link
                href="/docs"
                className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium transition-colors inline-flex items-center gap-2"
              >
                Frontend Docs
              </Link>
              <Link
                href="/server-docs"
                className="px-6 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium transition-colors inline-flex items-center gap-2"
              >
                Server Docs
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
