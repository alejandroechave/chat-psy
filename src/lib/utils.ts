/**
 * Utility Functions
 * Pure functions for common operations
 */

/**
 * Combines multiple class names, filtering out falsy values
 * @param classes - Array or single string of class names
 * @returns string of combined class names
 */
export function classNames(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats time in seconds to MM:SS format
 * @param seconds - Total seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Converts hex color to RGB
 * @param hex - Hex color code
 * @returns Object with r, g, b values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculates total exercise duration in seconds
 * @param inhaleDuration - Duration of inhalation
 * @param holdDuration - Duration of holding breath
 * @param exhaleDuration - Duration of exhalation
 * @param cycles - Number of cycles
 * @returns Total time in seconds
 */
export function calculateExerciseDuration(
  inhaleDuration: number,
  holdDuration: number,
  exhaleDuration: number,
  cycles: number,
): number {
  const cycleTime = inhaleDuration + holdDuration + exhaleDuration;
  return cycleTime * cycles;
}

/**
 * Type-safe object keys function
 * @param obj - Object to get keys from
 * @returns Array of object keys
 */
export function objectKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
