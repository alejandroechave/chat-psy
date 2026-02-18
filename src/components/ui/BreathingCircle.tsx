'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { useBreathing478, type BreathingState } from '@/hooks/useBreathing';

export interface BreathingCircleProps {
  /**
   * Tamaño del círculo en píxeles
   */
  size?: number;

  /**
   * Callback cuando cambia la fase
   */
  onPhaseChange?: (phase: BreathingState['phase']) => void;

  /**
   * Mostrar información de debug
   */
  showDebug?: boolean;

  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente de círculo animado para respiración 4-7-8
 *
 * Características:
 * - Círculo que se expande/contrae siguiendo el ciclo de respiración
 * - Animaciones fluidas con Framer Motion
 * - Detección automática de cambios de pestaña
 * - Controles de inicio, pausa y reinicio
 * - Información visual del progreso
 */
export const BreathingCircle = React.forwardRef<
  HTMLDivElement,
  BreathingCircleProps
>(
  (
    {
      size = 240,
      onPhaseChange,
      showDebug = false,
      className = '',
    },
    ref,
  ) => {
    const breathing = useBreathing478();

    React.useEffect(() => {
      onPhaseChange?.(breathing.phase);
    }, [breathing.phase, onPhaseChange]);

    /**
     * Determinar escala del círculo según la fase
     */
    const getScale = (phase: string, progress: number): number => {
      switch (phase) {
        case 'inhale':
          // Expansión gradual del 1.0 al 1.4
          return 1.0 + 0.4 * progress;
        case 'hold':
          // Mantener tamaño máximo
          return 1.4;
        case 'exhale':
          // Contracción gradual del 1.4 al 1.0
          return 1.4 - 0.4 * progress;
        case 'idle':
        default:
          return 1.0;
      }
    };

    /**
     * Obtener color según la fase
     */
    const getPhaseColor = (phase: string): string => {
      switch (phase) {
        case 'inhale':
          return '#4A90E2'; // Primary blue
        case 'hold':
          return '#F59E0B'; // Amber
        case 'exhale':
          return '#A8E6CF'; // Accent green
        case 'idle':
        default:
          return '#E5E7EB'; // Gray
      }
    };

    /**
     * Obtener etiqueta de la fase
     */
    const getPhaseLabel = (phase: string): string => {
      switch (phase) {
        case 'inhale':
          return 'Inhalar';
        case 'hold':
          return 'Mantener';
        case 'exhale':
          return 'Exhalar';
        case 'idle':
        default:
          return 'Listo';
      }
    };

    const scale = getScale(breathing.phase, breathing.progress);
    const phaseColor = getPhaseColor(breathing.phase);
    const displaySize = size * scale;

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center gap-8 ${className}`}
      >
        {/* Círculo Animado Principal */}
        <div className="relative" style={{ width: size, height: size }}>
          {/* Fondo estático con shadow */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-lg"
            style={{
              width: size,
              height: size,
              backgroundColor: '#F5F7FA',
              border: '2px solid #E5E7EB',
            }}
          />

          {/* Círculo animado */}
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            animate={{
              scale: scale,
              backgroundColor: phaseColor,
            }}
            transition={{
              type: 'tween',
              duration: 0.05,
              ease: 'easeInOut',
            }}
            style={{
              width: size,
              height: size,
              originX: 0.5,
              originY: 0.5,
            }}
          >
            {/* Contenido interior */}
            <div className="text-center space-y-2">
              {/* Tiempo actual */}
              <motion.div
                className="text-white"
                animate={{ opacity: breathing.isActive ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-medium opacity-75">
                  {getPhaseLabel(breathing.phase)}
                </p>
                <p className="text-4xl font-bold tabular-nums">
                  {breathing.elapsed}/{breathing.totalTime}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Aro externo indicador de progreso */}
          <svg
            className="absolute inset-0 -rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 4}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 4}
              fill="none"
              stroke={phaseColor}
              strokeWidth="2"
              strokeDasharray={`${Math.PI * (size - 8)}`}
              animate={{
                strokeDashoffset: `${Math.PI * (size - 8) * (1 - breathing.progress)}`,
              }}
              transition={{
                type: 'tween',
                duration: 0.05,
                ease: 'easeInOut',
              }}
              style={{ opacity: breathing.isActive ? 0.8 : 0.3 }}
            />
          </svg>
        </div>

        {/* Información de ciclos */}
        {breathing.isActive && (
          <motion.p
            className="text-sm text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Ciclo {breathing.cycleCount}
          </motion.p>
        )}

        {/* Mensaje de visibilidad */}
        {breathing.phase !== 'idle' && !breathing.isActive && breathing.cycleCount > 0 && (
          <motion.p
            className="text-xs text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Ejercicio pausado
          </motion.p>
        )}

        {/* Controles */}
        <div className="flex items-center gap-3">
          {!breathing.isActive ? (
            <Button
              onClick={breathing.start}
              variant="primary"
              className="flex items-center gap-2"
              aria-label="Iniciar ejercicio de respiración"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Iniciar
            </Button>
          ) : (
            <Button
              onClick={breathing.pause}
              variant="secondary"
              className="flex items-center gap-2"
              aria-label="Pausar ejercicio de respiración"
            >
              <Pause className="w-4 h-4" aria-hidden="true" />
              Pausar
            </Button>
          )}

          {breathing.cycleCount > 0 && (
            <Button
              onClick={breathing.reset}
              variant="secondary"
              className="flex items-center gap-2"
              aria-label="Reiniciar ejercicio"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reiniciar
            </Button>
          )}
        </div>

        {/* Debug Info */}
        {showDebug && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-700 space-y-1 w-full max-w-xs">
            <p>
              <span className="font-semibold">Fase:</span> {breathing.phase}
            </p>
            <p>
              <span className="font-semibold">Progreso:</span>{' '}
              {(breathing.progress * 100).toFixed(0)}%
            </p>
            <p>
              <span className="font-semibold">Escala:</span> {scale.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">Ciclos:</span>{' '}
              {breathing.cycleCount}
            </p>
            <p>
              <span className="font-semibold">Activo:</span>{' '}
              {breathing.isActive ? 'Sí' : 'No'}
            </p>
          </div>
        )}
      </div>
    );
  },
);

BreathingCircle.displayName = 'BreathingCircle';
