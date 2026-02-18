/**
 * Utility functions for logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const getLogLevelColor = (level: LogLevel): string => {
  const colors: Record<LogLevel, string> = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m', // Green
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
  };
  return colors[level];
};

const resetColor = '\x1b[0m';

export const logger = {
  debug: (message: string, data?: unknown): void => {
    if (LOG_LEVELS.debug >= LOG_LEVELS[currentLogLevel]) {
      const color = getLogLevelColor('debug');
      console.log(
        `${color}[${getTimestamp()}] [DEBUG]${resetColor} ${message}`,
        data ? JSON.stringify(data, null, 2) : '',
      );
    }
  },

  info: (message: string, data?: unknown): void => {
    if (LOG_LEVELS.info >= LOG_LEVELS[currentLogLevel]) {
      const color = getLogLevelColor('info');
      console.log(
        `${color}[${getTimestamp()}] [INFO]${resetColor} ${message}`,
        data ? JSON.stringify(data, null, 2) : '',
      );
    }
  },

  warn: (message: string, data?: unknown): void => {
    if (LOG_LEVELS.warn >= LOG_LEVELS[currentLogLevel]) {
      const color = getLogLevelColor('warn');
      console.warn(
        `${color}[${getTimestamp()}] [WARN]${resetColor} ${message}`,
        data ? JSON.stringify(data, null, 2) : '',
      );
    }
  },

  error: (message: string, error?: unknown): void => {
    if (LOG_LEVELS.error >= LOG_LEVELS[currentLogLevel]) {
      const color = getLogLevelColor('error');
      if (error instanceof Error) {
        console.error(
          `${color}[${getTimestamp()}] [ERROR]${resetColor} ${message}`,
          error.message,
          error.stack,
        );
      } else {
        console.error(
          `${color}[${getTimestamp()}] [ERROR]${resetColor} ${message}`,
          error ? JSON.stringify(error, null, 2) : '',
        );
      }
    }
  },
};
