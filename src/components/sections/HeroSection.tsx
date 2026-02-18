'use client';

import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui';

export interface HeroSectionProps {
  onHelpClick?: () => void;
  scrollToId?: string;
}

export function HeroSection({ onHelpClick, scrollToId = 'exercises' }: HeroSectionProps) {
  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick();
    }

    // Scroll to element if scrollToId is provided
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-background via-white to-accent-lighter overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Decorative background elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl -mr-48 -mt-48"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -ml-48 -mb-48"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-8 w-full">
          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              No estás{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                solo
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte a respirar. Con ejercicios simples y
              validación constante, puedes encontrar calma en momentos
              difíciles.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
              <span>Disponible 24/7</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
              <span>Completamente privado</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
              <span>Sin costo</span>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-4">
            <Button
              onClick={handleHelpClick}
              variant="primary"
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              aria-label="Acceder a ejercicios de respiración"
            >
              <span className="flex items-center justify-center gap-2">
                Necesito ayuda ahora
                <ArrowDown className="w-5 h-5 animate-bounce" aria-hidden="true" />
              </span>
            </Button>

            {/* Secondary CTA - Learn more */}
            <p className="mt-4 text-sm text-gray-600">
              Aprende sobre nuestros ejercicios de respiración
              <span
                className="ml-2 text-primary font-semibold cursor-pointer hover:text-primary-dark transition-colors"
                onClick={handleHelpClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleHelpClick();
                  }
                }}
                aria-label="Desplazarse a los ejercicios"
              >
                Explorar →
              </span>
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              Desplázate hacia abajo
            </span>
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
