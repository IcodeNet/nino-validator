/**
 * NINO Validator Internationalization Module (ESM)
 *
 * @fileoverview Main i18n module for managing language settings and providing
 * localized validation functions (ES Module version)
 * @author Byron Thanopoulos <byron.thanopoulos@gmail.com>
 * @version 1.0.0
 */

/* global window */

import { getMessage } from './messages.mjs';

/**
 * Supported languages
 * @constant {Object}
 */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  el: 'Ελληνικά (Greek)',
};

/**
 * Default language
 * @type {string}
 */
let currentLanguage = 'en';

/**
 * Set the current language for error messages
 * @param {string} language - Language code (e.g., 'en', 'el')
 * @throws {Error} If language is not supported
 */
export function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES[language]) {
    throw new Error(
      `Unsupported language: ${language}. Supported languages: ${Object.keys(
        SUPPORTED_LANGUAGES
      ).join(', ')}`
    );
  }
  currentLanguage = language;
}

/**
 * Get the current language
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Get list of supported languages
 * @returns {Object} Object with language codes as keys and display names as values
 */
export function getSupportedLanguages() {
  return { ...SUPPORTED_LANGUAGES };
}

/**
 * Check if a language is supported
 * @param {string} language - Language code to check
 * @returns {boolean} True if language is supported
 */
export function isLanguageSupported(language) {
  return !!SUPPORTED_LANGUAGES[language];
}

/**
 * Get localized error message for the current language
 * @param {string} errorCode - Error code
 * @param {Object} params - Parameters for message interpolation
 * @returns {Object} Object with localized error and suggestion
 */
export function getLocalizedMessage(errorCode, params = {}) {
  return getMessage(errorCode, currentLanguage, params);
}

/**
 * Get localized error message for a specific language
 * @param {string} errorCode - Error code
 * @param {string} language - Language code
 * @param {Object} params - Parameters for message interpolation
 * @returns {Object} Object with localized error and suggestion
 */
export function getMessageForLanguage(errorCode, language, params = {}) {
  return getMessage(errorCode, language, params);
}

/**
 * Auto-detect language from environment (Node.js) or browser
 * Sets the language automatically if supported
 * @returns {string} Detected language code
 */
export function detectLanguage() {
  let detectedLanguage = 'en'; // Default fallback

  try {
    // Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      const nodeLocale =
        process.env.LANG ||
        process.env.LANGUAGE ||
        process.env.LC_ALL ||
        process.env.LC_MESSAGES;
      if (nodeLocale) {
        const langCode = nodeLocale.split('_')[0].toLowerCase();
        if (SUPPORTED_LANGUAGES[langCode]) {
          detectedLanguage = langCode;
        }
      }
    }

    // Browser environment

    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang =
        window.navigator.language || window.navigator.userLanguage;
      if (browserLang) {
        const langCode = browserLang.split('-')[0].toLowerCase();
        if (SUPPORTED_LANGUAGES[langCode]) {
          detectedLanguage = langCode;
        }
      }
    }
  } catch {
    // Silently fall back to default if detection fails
    detectedLanguage = 'en';
  }

  return detectedLanguage;
}

/**
 * Initialize i18n with auto-detected language
 * @param {Object} options - Initialization options
 * @param {boolean} [options.autoDetect=false] - Whether to auto-detect language
 * @param {string} [options.fallbackLanguage='en'] - Fallback language
 * @returns {string} Set language code
 */
export function initializeI18n(options = {}) {
  const { autoDetect = false, fallbackLanguage = 'en' } = options;

  if (autoDetect) {
    const detected = detectLanguage();
    try {
      setLanguage(detected);
      return detected;
    } catch {
      // Fall back to fallback language if detection fails
      setLanguage(fallbackLanguage);
      return fallbackLanguage;
    }
  }

  return currentLanguage;
}
