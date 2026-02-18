'use client';

import { useState, useCallback, useEffect } from 'react';

export interface BreathingExerciseConfig {
  inhaleCount: number;
  holdCount: number;
  exhaleCount: number;
  cycles: number;
}

export interface BreathingPhase {
  phase: 'inhale' | 'hold' | 'exhale' | 'ready' | 'completed';
  remainingTime: number;
  totalTime: number;
  currentCycle: number;
  totalCycles: number;
}

export function useBreathingExercise(config: BreathingExerciseConfig) {
  const [phase, setPhase] = useState<BreathingPhase>({
    phase: 'ready',
    remainingTime: 0,
    totalTime: 0,
    currentCycle: 0,
    totalCycles: config.cycles,
  });

  const [isActive, setIsActive] = useState(false);

  const totalTimePerCycle =
    config.inhaleCount + config.holdCount + config.exhaleCount;

  const startExercise = useCallback(() => {
    setIsActive(true);
    setPhase({
      phase: 'inhale',
      remainingTime: config.inhaleCount,
      totalTime: config.inhaleCount,
      currentCycle: 1,
      totalCycles: config.cycles,
    });
  }, [config]);

  const stopExercise = useCallback(() => {
    setIsActive(false);
    setPhase({
      phase: 'ready',
      remainingTime: 0,
      totalTime: 0,
      currentCycle: 0,
      totalCycles: config.cycles,
    });
  }, [config.cycles]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhase((prev) => {
        const newRemainingTime = prev.remainingTime - 1;

        if (newRemainingTime > 0) {
          return { ...prev, remainingTime: newRemainingTime };
        }

        // Transition to next phase
        switch (prev.phase) {
          case 'inhale':
            return {
              ...prev,
              phase: 'hold',
              remainingTime: config.holdCount,
              totalTime: config.holdCount,
            };

          case 'hold':
            return {
              ...prev,
              phase: 'exhale',
              remainingTime: config.exhaleCount,
              totalTime: config.exhaleCount,
            };

          case 'exhale': {
            const nextCycle = prev.currentCycle + 1;
            if (nextCycle <= config.cycles) {
              return {
                ...prev,
                phase: 'inhale',
                remainingTime: config.inhaleCount,
                totalTime: config.inhaleCount,
                currentCycle: nextCycle,
              };
            } else {
              setIsActive(false);
              return {
                ...prev,
                phase: 'completed',
                remainingTime: 0,
                totalTime: 0,
              };
            }
          }

          default:
            return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, config]);

  return {
    phase,
    isActive,
    startExercise,
    stopExercise,
    totalTimePerCycle,
  };
}
