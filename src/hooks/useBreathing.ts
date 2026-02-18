'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Estados del ciclo de respiración 4-7-8
 */
export type BreathingPhaseType = 'inhale' | 'hold' | 'exhale' | 'idle';

/**
 * Configuración del ciclo de respiración 4-7-8
 */
export interface BreathingCycleConfig {
  inhaleTime: number; // 4 segundos
  holdTime: number; // 7 segundos
  exhaleTime: number; // 8 segundos
}

/**
 * Estado del hook de respiración
 */
export interface BreathingState {
  phase: BreathingPhaseType;
  elapsed: number;
  totalTime: number;
  progress: number; // 0-1 porcentaje de avance
  cycleCount: number;
  isActive: boolean;
}

/**
 * Custom hook para técnica de respiración 4-7-8
 * Maneja tiempos, fases y detección de cambios de pestaña
 */
export function useBreathing(config: BreathingCycleConfig = {
  inhaleTime: 4,
  holdTime: 7,
  exhaleTime: 8,
}) {
  const [state, setState] = useState<BreathingState>({
    phase: 'idle',
    elapsed: 0,
    totalTime: 0,
    progress: 0,
    cycleCount: 0,
    isActive: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pageVisibilityRef = useRef<Boolean>(true);

  /**
   * Detectar cambios de visibilidad de la pestaña
   * Si el usuario sale, pausar automáticamente
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      pageVisibilityRef.current = !document.hidden;
      // Si la página se oculta, pausar
      if (document.hidden) {
        setState((prev) => ({ ...prev, isActive: false }));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * Lógica principal del ciclo de respiración
   */
  useEffect(() => {
    if (!state.isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Validar que la página siga siendo visible
    if (document.hidden) {
      setState((prev) => ({ ...prev, isActive: false }));
      return;
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase === 'idle') {
          // Inicio - pasar a inhalar
          return {
            ...prev,
            phase: 'inhale',
            elapsed: 1,
            totalTime: config.inhaleTime,
            progress: 1 / config.inhaleTime,
            cycleCount: prev.cycleCount + 1,
          };
        }

        const newElapsed = prev.elapsed + 1;

        // Determinar la próxima fase
        if (prev.phase === 'inhale' && newElapsed >= config.inhaleTime) {
          return {
            ...prev,
            phase: 'hold',
            elapsed: 1,
            totalTime: config.holdTime,
            progress: 1 / config.holdTime,
          };
        }

        if (prev.phase === 'hold' && newElapsed >= config.holdTime) {
          return {
            ...prev,
            phase: 'exhale',
            elapsed: 1,
            totalTime: config.exhaleTime,
            progress: 1 / config.exhaleTime,
          };
        }

        if (prev.phase === 'exhale' && newElapsed >= config.exhaleTime) {
          // Ciclo completado, volver al idle
          return {
            ...prev,
            phase: 'idle',
            elapsed: 0,
            totalTime: 0,
            progress: 0,
          };
        }

        // Actualizar progreso dentro de la fase actual
        return {
          ...prev,
          elapsed: newElapsed,
          progress: newElapsed / prev.totalTime,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, config.inhaleTime, config.holdTime, config.exhaleTime]);

  /**
   * Iniciar el ejercicio de respiración
   */
  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      phase: 'idle',
      elapsed: 0,
      progress: 0,
    }));
  }, []);

  /**
   * Pausar el ejercicio
   */
  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  /**
   * Reiniciar completamente
   */
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState({
      phase: 'idle',
      elapsed: 0,
      totalTime: 0,
      progress: 0,
      cycleCount: 0,
      isActive: false,
    });
  }, []);

  /**
   * Alternar entre pausa e inicio
   */
  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  }, []);

  return {
    // Estado
    state,
    phase: state.phase,
    elapsed: state.elapsed,
    totalTime: state.totalTime,
    progress: state.progress,
    cycleCount: state.cycleCount,
    isActive: state.isActive,

    // Métodos
    start,
    pause,
    reset,
    toggle,

    // Configuración
    config,
  };
}

/**
 * Hook predefinido para la técnica 4-7-8
 * Inhalar 4s, Mantener 7s, Exhalar 8s
 */
export function useBreathing478() {
  return useBreathing({
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
  });
}
