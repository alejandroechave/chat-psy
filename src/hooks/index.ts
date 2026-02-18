// Hooks barrel file

export { useBreathingExercise };
export type { BreathingExerciseConfig, BreathingPhase } from './useBreathingExercise';

export { useBreathing, useBreathing478 };
export type { BreathingPhaseType, BreathingCycleConfig, BreathingState } from './useBreathing';

export { useCrisisSession };
export type {
  Message,
  MessageSender,
  MessageStatus,
  ConnectionStatus,
  CrisisSessionConfig,
  CrisisSessionState,
} from './useCrisisSession';

// Imports for re-export
import { useBreathingExercise } from './useBreathingExercise';
import { useBreathing, useBreathing478 } from './useBreathing';
import { useCrisisSession } from './useCrisisSession';
