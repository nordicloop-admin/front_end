/**
 * Logger utility to handle console logging in a way that can be easily disabled in production
 * This helps avoid ESLint warnings about console statements in production
 */

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Create no-op functions for production
const noop = (): void => {};

// Create safe console methods that won't trigger ESLint in production
// eslint-disable-next-line no-console
const safeConsoleLog = isProduction ? noop : console.log;
// eslint-disable-next-line no-console
const safeConsoleWarn = isProduction ? noop : console.warn;
// eslint-disable-next-line no-console
const safeConsoleError = isProduction ? noop : console.error;

/**
 * Logger object with methods that wrap console methods
 * In production, these will be no-ops to avoid console statements
 */
const logger = {
  /**
   * Log information messages
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  info: (message?: any, ...optionalParams: any[]): void => {
    safeConsoleLog(message, ...optionalParams);
  },

  /**
   * Log warning messages
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  warn: (message?: any, ...optionalParams: any[]): void => {
    safeConsoleWarn(message, ...optionalParams);
  },

  /**
   * Log error messages
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  error: (message?: any, ...optionalParams: any[]): void => {
    // In production, we might still want to log errors to some error tracking service
    // For now, we'll just disable console.error in production as well
    safeConsoleError(message, ...optionalParams);
  }
};

export default logger;
