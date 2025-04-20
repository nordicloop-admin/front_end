/**
 * Logger utility to handle console logging in a way that can be easily disabled in production
 * This helps avoid ESLint warnings about console statements in production
 */

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

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
    if (!isProduction) {
      console.log(message, ...optionalParams);
    }
  },

  /**
   * Log warning messages
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  warn: (message?: any, ...optionalParams: any[]): void => {
    if (!isProduction) {
      console.warn(message, ...optionalParams);
    }
  },

  /**
   * Log error messages
   * @param message - The message to log
   * @param optionalParams - Additional parameters to log
   */
  error: (message?: any, ...optionalParams: any[]): void => {
    // We still log errors in production, but could disable if needed
    console.error(message, ...optionalParams);
  }
};

export default logger;
