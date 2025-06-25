/**
 * NINO Validator - TypeScript Declarations
 *
 * @fileoverview TypeScript type definitions for the NINO Validator package
 * @author Byron Thanopoulos <byron.thanopoulos@gmail.com>
 * @version 1.0.0
 * @license MIT
 */

/**
 * Initialization options for i18n
 */
export interface I18nInitOptions {
  /** Whether to auto-detect language from environment */
  autoDetect?: boolean;
  /** Fallback language code */
  fallbackLanguage?: string;
}

/**
 * Validation options for NINO validation
 */
export interface ValidationOptions {
  /**
   * Allow spaces in the input NINO
   * @default true
   */
  allowSpaces?: boolean;

  /**
   * Require the suffix letter to be present
   * @default false
   */
  requireSuffix?: boolean;
}

/**
 * Detailed validation result with error information
 */
export interface ValidationResult {
  /** Whether the NINO is valid */
  isValid: boolean;

  /** Detailed error message if invalid, null if valid */
  error: string | null;

  /** Machine-readable error code for programmatic handling */
  errorCode: string | null;

  /** Helpful suggestion for fixing the error */
  suggestion: string | null;
}

/**
 * Parsed NINO components
 */
export interface ParsedNINO {
  /** Two-letter prefix (e.g., 'AB') */
  prefix: string;

  /** Six-digit number sequence (e.g., '123456') */
  numbers: string;

  /** Single suffix letter or null if not present */
  suffix: string | null;

  /** Standardized formatted version */
  formatted: string;

  /** Original input string */
  original: string;
}

/**
 * Validates a UK National Insurance Number according to HMRC rules.
 *
 * @param nino - The NINO to validate
 * @param options - Validation options
 * @returns True if the NINO is valid according to HMRC rules, false otherwise
 *
 * @example
 * ```typescript
 * import { validateNINO } from 'nino-validator';
 *
 * console.log(validateNINO('AB123456C')); // true
 * console.log(validateNINO('invalid'));   // false
 *
 * // With options
 * console.log(validateNINO('AB123456', { requireSuffix: true })); // false
 * ```
 */
export function validateNINO(
  nino: string,
  options?: ValidationOptions
): boolean;

/**
 * Validates a UK National Insurance Number with detailed error reporting.
 *
 * @param nino - The NINO to validate
 * @param options - Validation options
 * @returns Object containing validation result and detailed error information
 *
 * @example
 * ```typescript
 * import { validateNINOWithDetails } from 'nino-validator';
 *
 * const result = validateNINOWithDetails('AB123456C');
 * if (result.isValid) {
 *   console.log('Valid NINO');
 * } else {
 *   console.log(`Error: ${result.error}`);
 *   console.log(`Code: ${result.errorCode}`);
 *   console.log(`Suggestion: ${result.suggestion}`);
 * }
 * ```
 */
export function validateNINOWithDetails(
  nino: string,
  options?: ValidationOptions
): ValidationResult;

/**
 * Formats a NINO string with standard UK government spacing.
 *
 * @param nino - The NINO to format
 * @returns The formatted NINO string, or null if invalid
 *
 * @example
 * ```typescript
 * import { formatNINO } from 'nino-validator';
 *
 * console.log(formatNINO('AB123456C')); // 'AB 12 34 56 C'
 * console.log(formatNINO('invalid'));   // null
 * ```
 */
export function formatNINO(nino: string): string | null;

/**
 * Extracts and validates components from a NINO string.
 *
 * @param nino - The NINO to parse
 * @returns Object containing NINO components, or null if invalid
 *
 * @example
 * ```typescript
 * import { parseNINO } from 'nino-validator';
 *
 * const result = parseNINO('AB123456C');
 * if (result) {
 *   console.log(result.prefix);    // 'AB'
 *   console.log(result.numbers);   // '123456'
 *   console.log(result.suffix);    // 'C'
 *   console.log(result.formatted); // 'AB 12 34 56 C'
 * }
 * ```
 */
export function parseNINO(nino: string): ParsedNINO | null;

/**
 * Generates a random valid NINO for testing purposes.
 *
 * @returns A randomly generated valid NINO
 *
 * @example
 * ```typescript
 * import { generateRandomNINO, validateNINO } from 'nino-validator';
 *
 * const testNINO = generateRandomNINO();
 * console.log(testNINO);              // e.g., 'JK789012M'
 * console.log(validateNINO(testNINO)); // always true
 * ```
 */
export function generateRandomNINO(): string;

/**
 * Set the current language for error messages.
 *
 * @param language - Language code (e.g., 'en', 'el')
 * @throws Error if language is not supported
 *
 * @example
 * ```typescript
 * import { setLanguage, validateNINOWithDetails } from 'nino-validator';
 *
 * setLanguage('el'); // Switch to Greek
 * const result = validateNINOWithDetails('invalid');
 * console.log(result.error); // Error message in Greek
 * ```
 */
export function setLanguage(language: string): void;

/**
 * Get the current language for error messages.
 *
 * @returns Current language code
 *
 * @example
 * ```typescript
 * import { getCurrentLanguage } from 'nino-validator';
 *
 * console.log(getCurrentLanguage()); // 'en'
 * ```
 */
export function getCurrentLanguage(): string;

/**
 * Get list of supported languages.
 *
 * @returns Object with language codes as keys and display names as values
 *
 * @example
 * ```typescript
 * import { getSupportedLanguages } from 'nino-validator';
 *
 * console.log(getSupportedLanguages());
 * // { en: 'English', el: 'Ελληνικά (Greek)' }
 * ```
 */
export function getSupportedLanguages(): Record<string, string>;

/**
 * Check if a language is supported.
 *
 * @param language - Language code to check
 * @returns True if language is supported
 *
 * @example
 * ```typescript
 * import { isLanguageSupported } from 'nino-validator';
 *
 * console.log(isLanguageSupported('el')); // true
 * console.log(isLanguageSupported('fr')); // false
 * ```
 */
export function isLanguageSupported(language: string): boolean;

/**
 * Auto-detect language from environment (Node.js) or browser.
 *
 * @returns Detected language code
 *
 * @example
 * ```typescript
 * import { detectLanguage } from 'nino-validator';
 *
 * const detected = detectLanguage();
 * console.log(detected); // e.g., 'el' if Greek locale
 * ```
 */
export function detectLanguage(): string;

/**
 * Initialize i18n with auto-detected language.
 *
 * @param options - Initialization options
 * @returns Set language code
 *
 * @example
 * ```typescript
 * import { initializeI18n } from 'nino-validator';
 *
 * // Auto-detect and set language
 * const language = initializeI18n({ autoDetect: true });
 * console.log(`Language set to: ${language}`);
 * ```
 */
export function initializeI18n(options?: I18nInitOptions): string;

/**
 * Default export object containing all functions
 */
declare const ninoValidator: {
  validateNINO: typeof validateNINO;
  validateNINOWithDetails: typeof validateNINOWithDetails;
  formatNINO: typeof formatNINO;
  parseNINO: typeof parseNINO;
  generateRandomNINO: typeof generateRandomNINO;
  setLanguage: typeof setLanguage;
  getCurrentLanguage: typeof getCurrentLanguage;
  getSupportedLanguages: typeof getSupportedLanguages;
  isLanguageSupported: typeof isLanguageSupported;
  detectLanguage: typeof detectLanguage;
  initializeI18n: typeof initializeI18n;
};

export default ninoValidator;
