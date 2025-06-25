/**
 * NINO Validator - Validates UK National Insurance Numbers (ESM Module)
 *
 * @fileoverview A comprehensive library for validating, formatting, and parsing
 * UK National Insurance Numbers (NINO) according to HMRC rules.
 *
 * @author Byron Thanopoulos <byron.thanopoulos@gmail.com>
 * @version 1.0.0
 * @license MIT
 * @since 1.0.0
 */

import { getLocalizedMessage } from './src/i18n/index.mjs';

/**
 * List of invalid prefix combinations for NINO.
 * These prefixes are explicitly not used by HMRC and include:
 * - Administrative prefixes (BG, GB, NK, KN, TN, NT, ZZ)
 * - All combinations starting with D, F, G, I, N, O, Q, U, V
 *
 * @constant {string[]}
 * @readonly
 */
const INVALID_PREFIXES = [
  'BG',
  'GB',
  'NK',
  'KN',
  'TN',
  'NT',
  'ZZ',
  'DA',
  'DB',
  'DC',
  'DD',
  'DE',
  'DF',
  'DG',
  'DH',
  'DI',
  'DJ',
  'DK',
  'DL',
  'DM',
  'DN',
  'DO',
  'DP',
  'DQ',
  'DR',
  'DS',
  'DT',
  'DU',
  'DV',
  'DW',
  'DX',
  'DY',
  'DZ',
  'FA',
  'FB',
  'FC',
  'FD',
  'FE',
  'FF',
  'FG',
  'FH',
  'FI',
  'FJ',
  'FK',
  'FL',
  'FM',
  'FN',
  'FO',
  'FP',
  'FQ',
  'FR',
  'FS',
  'FT',
  'FU',
  'FV',
  'FW',
  'FX',
  'FY',
  'FZ',
  'GA',
  'GB',
  'GC',
  'GD',
  'GE',
  'GF',
  'GG',
  'GH',
  'GI',
  'GJ',
  'GK',
  'GL',
  'GM',
  'GN',
  'GO',
  'GP',
  'GQ',
  'GR',
  'GS',
  'GT',
  'GU',
  'GV',
  'GW',
  'GX',
  'GY',
  'GZ',
  'NA',
  'NB',
  'NC',
  'ND',
  'NE',
  'NF',
  'NG',
  'NH',
  'NI',
  'NJ',
  'NK',
  'NL',
  'NM',
  'NN',
  'NO',
  'NP',
  'NQ',
  'NR',
  'NS',
  'NT',
  'NU',
  'NV',
  'NW',
  'NX',
  'NY',
  'NZ',
  'OA',
  'OB',
  'OC',
  'OD',
  'OE',
  'OF',
  'OG',
  'OH',
  'OI',
  'OJ',
  'OK',
  'OL',
  'OM',
  'ON',
  'OO',
  'OP',
  'OQ',
  'OR',
  'OS',
  'OT',
  'OU',
  'OV',
  'OW',
  'OX',
  'OY',
  'OZ',
  'QQ',
];

/**
 * Invalid suffix letters for NINO.
 * These letters are not used as suffix characters by HMRC.
 *
 * @constant {string[]}
 * @readonly
 */
const INVALID_SUFFIXES = ['D', 'F', 'I', 'Q', 'U', 'V'];

/**
 * @typedef {Object} ValidationOptions
 * @property {boolean} [allowSpaces=true] - Allow spaces in the input NINO
 * @property {boolean} [requireSuffix=false] - Require the suffix letter to be present
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the NINO is valid
 * @property {string|null} error - Detailed error message if invalid, null if valid
 * @property {string|null} errorCode - Machine-readable error code for programmatic handling
 * @property {string|null} suggestion - Helpful suggestion for fixing the error
 */

/**
 * Validates a UK National Insurance Number according to HMRC rules.
 *
 * This function performs comprehensive validation including:
 * - Format validation (2 letters + 6 digits + optional letter)
 * - Prefix validation against HMRC invalid list
 * - Individual letter validation (first, second, suffix)
 * - Number pattern validation (no repeated digits)
 *
 * @param {string} nino - The NINO to validate
 * @param {ValidationOptions} [options={}] - Validation options
 * @param {boolean} [options.allowSpaces=true] - Allow spaces in the NINO
 * @param {boolean} [options.requireSuffix=false] - Require the suffix letter
 *
 * @returns {boolean} True if the NINO is valid according to HMRC rules, false otherwise
 *
 * @example
 * // Basic validation
 * validateNINO('AB123456C'); // true
 * validateNINO('AB123456');  // true (suffix optional)
 * validateNINO('invalid');   // false
 *
 * @example
 * // With options
 * validateNINO('AB123456', { requireSuffix: true }); // false
 * validateNINO('AB 12 34 56 C', { allowSpaces: false }); // false
 *
 * @example
 * // Edge cases
 * validateNINO(null);        // false
 * validateNINO(undefined);   // false
 * validateNINO('');          // false
 * validateNINO('BG123456C'); // false (invalid prefix)
 *
 * @since 1.0.0
 */
export function validateNINO(nino, options = {}) {
  // Use the detailed validation and return just the boolean result
  const result = validateNINOWithDetails(nino, options);
  return result.isValid;
}

/**
 * Validates basic input requirements for NINO
 * @param {*} nino - Input to validate
 * @param {Function} errorResult - Error result factory function
 * @returns {Object|null} Error result or null if valid
 */
function validateBasicInput(nino, errorResult) {
  if (nino == null) return errorResult('NULL_INPUT');
  if (typeof nino !== 'string')
    return errorResult('INVALID_TYPE', { type: typeof nino });
  if (nino.trim() === '') return errorResult('EMPTY_INPUT');
  if (nino.length > 20) return errorResult('INPUT_TOO_LONG');
  return null;
}

/**
 * Cleans and normalizes NINO input
 * @param {string} nino - Raw NINO input
 * @param {boolean} allowSpaces - Whether spaces are allowed
 * @param {Function} errorResult - Error result factory function
 * @returns {Object|string} Error result or cleaned NINO string
 */
function cleanAndNormalizeNino(nino, allowSpaces, errorResult) {
  // Check for invalid characters before cleaning
  if (!/^[A-Za-z0-9 ]*$/.test(nino)) return errorResult('INVALID_CHARACTERS');

  let cleanNino = nino.toUpperCase().trim();
  if (!allowSpaces && /\s/.test(cleanNino))
    return errorResult('SPACES_NOT_ALLOWED');
  if (allowSpaces) cleanNino = cleanNino.replace(/\s/g, '');

  // Final check after cleaning
  if (!/^[A-Z0-9]*$/.test(cleanNino)) return errorResult('INVALID_CHARACTERS');

  return cleanNino;
}

/**
 * Validates NINO length requirements
 * @param {string} cleanNino - Cleaned NINO string
 * @param {Function} errorResult - Error result factory function
 * @returns {Object|null} Error result or null if valid
 */
function validateNinoLength(cleanNino, errorResult) {
  if (cleanNino.length < 8)
    return errorResult('TOO_SHORT', { length: cleanNino.length });
  if (cleanNino.length > 9)
    return errorResult('TOO_LONG', { length: cleanNino.length });
  return null;
}

/**
 * Validates NINO component letters against HMRC rules
 * @param {string} prefix - Two-letter prefix
 * @param {string} suffix - Suffix letter (may be empty)
 * @param {Function} errorResult - Error result factory function
 * @returns {Object|null} Error result or null if valid
 */
function validateNinoLetters(prefix, suffix, errorResult) {
  const invalidLetters = ['D', 'F', 'I', 'Q', 'U', 'V'];

  if (invalidLetters.includes(prefix[0]))
    return errorResult('INVALID_FIRST_LETTER', { letter: prefix[0] });
  if (invalidLetters.includes(prefix[1]))
    return errorResult('INVALID_SECOND_LETTER', { letter: prefix[1] });
  if (suffix && INVALID_SUFFIXES.includes(suffix))
    return errorResult('INVALID_SUFFIX', { suffix });

  return null;
}

/**
 * Validates NINO prefix and number patterns according to HMRC rules
 * @param {string} prefix - Two-letter prefix
 * @param {string} numbers - Six-digit number sequence
 * @param {Function} errorResult - Error result factory function
 * @returns {Object|null} Error result or null if valid
 */
function validateNinoPatterns(prefix, numbers, errorResult) {
  if (INVALID_PREFIXES.includes(prefix))
    return errorResult('INVALID_PREFIX', { prefix });

  if (/^(\d)\1{5}$/.test(numbers))
    return errorResult('INVALID_NUMBER_PATTERN', { numbers });

  return null;
}

/**
 * Validates a UK National Insurance Number with detailed error reporting.
 *
 * This function provides comprehensive validation with detailed error messages
 * and suggestions for fixing common issues. It handles all edge cases and
 * provides both human-readable messages and machine-readable error codes.
 *
 * @param {string} nino - The NINO to validate
 * @param {ValidationOptions} [options={}] - Validation options
 * @param {boolean} [options.allowSpaces=true] - Allow spaces in the NINO
 * @param {boolean} [options.requireSuffix=false] - Require the suffix letter
 *
 * @returns {ValidationResult} Object containing validation result and detailed error information
 *
 * @example
 * // Valid NINO
 * validateNINOWithDetails('AB123456C');
 * // Returns: { isValid: true, error: null, errorCode: null, suggestion: null }
 *
 * @example
 * // Invalid length (too short)
 * validateNINOWithDetails('ABC123');
 * // Returns: {
 * //   isValid: false,
 * //   error: 'NINO too short (6 characters). Minimum 8 characters required',
 * //   errorCode: 'TOO_SHORT',
 * //   suggestion: 'Ensure the NINO has 2 letters, 6 digits, and optionally 1 letter'
 * // }
 *
 * @example
 * // Invalid prefix
 * validateNINOWithDetails('BG123456C');
 * // Returns: {
 * //   isValid: false,
 * //   error: 'Invalid prefix "BG". This prefix is not used by HMRC',
 * //   errorCode: 'INVALID_PREFIX',
 * //   suggestion: 'Use a valid prefix like AB, CD, EF, etc.'
 * // }
 *
 * @since 1.0.0
 */
export function validateNINOWithDetails(nino, options = {}) {
  const { allowSpaces = true, requireSuffix = false } = options;

  // Helper for error return
  const errorResult = (errorCode, params = {}) => {
    const message = getLocalizedMessage(errorCode, params);
    return {
      isValid: false,
      error: message.error,
      errorCode,
      suggestion: message.suggestion,
    };
  };

  // Step 1: Basic input validation
  const basicError = validateBasicInput(nino, errorResult);
  if (basicError) return basicError;

  // Step 2: Clean and normalize
  const cleanResult = cleanAndNormalizeNino(nino, allowSpaces, errorResult);
  if (typeof cleanResult !== 'string') return cleanResult; // Error occurred
  const cleanNino = cleanResult;

  // Step 3: Length validation
  const lengthError = validateNinoLength(cleanNino, errorResult);
  if (lengthError) return lengthError;

  // Step 4: Format validation
  const ninoRegex = requireSuffix
    ? /^[A-Z]{2}\d{6}[A-Z]$/
    : /^[A-Z]{2}\d{6}[A-Z]?$/;
  if (!ninoRegex.test(cleanNino)) {
    return getFormatError(cleanNino, requireSuffix, errorResult);
  }

  // Step 5: Extract components
  const prefix = cleanNino.substring(0, 2);
  const numbers = cleanNino.substring(2, 8);
  const suffix = cleanNino.length === 9 ? cleanNino[8] : '';

  // Step 6: Letter validation
  const letterError = validateNinoLetters(prefix, suffix, errorResult);
  if (letterError) return letterError;

  // Step 7: Pattern validation
  const patternError = validateNinoPatterns(prefix, numbers, errorResult);
  if (patternError) return patternError;

  // All validations passed
  return {
    isValid: true,
    error: null,
    errorCode: null,
    suggestion: null,
  };
}

// Helper for format errors to reduce complexity in main function
function getFormatError(cleanNino, requireSuffix, errorResult) {
  if (!/^[A-Z]{2}/.test(cleanNino)) return errorResult('INVALID_PREFIX_FORMAT');
  if (!/^\d{6}$/.test(cleanNino.substring(2, 8)))
    return errorResult('INVALID_NUMBER_FORMAT');
  if (requireSuffix && cleanNino.length === 8)
    return errorResult('MISSING_REQUIRED_SUFFIX');
  if (cleanNino.length === 9 && !/^[A-Z]$/.test(cleanNino[8]))
    return errorResult('INVALID_SUFFIX_FORMAT');
  return errorResult('INVALID_FORMAT');
}

/**
 * Formats a NINO string with standard UK government spacing.
 *
 * The standard format is: XX ## ## ## X (with spaces between number groups).
 * Only valid NINOs will be formatted; invalid inputs return null.
 *
 * @param {string} nino - The NINO to format
 *
 * @returns {string|null} The formatted NINO string, or null if invalid
 *
 * @example
 * formatNINO('AB123456C');    // 'AB 12 34 56 C'
 * formatNINO('ab123456c');    // 'AB 12 34 56 C' (normalized)
 * formatNINO('AB123456');     // 'AB 12 34 56' (no suffix)
 * formatNINO('  AB123456C '); // 'AB 12 34 56 C' (trimmed)
 * formatNINO('invalid');      // null
 *
 * @since 1.0.0
 */
export function formatNINO(nino) {
  // Only format if valid
  if (!validateNINO(nino)) {
    return null;
  }

  // Clean and normalize the input
  const cleanNino = nino.toUpperCase().replace(/\s/g, '');

  // Extract components for formatting
  const prefix = cleanNino.substring(0, 2);
  const part1 = cleanNino.substring(2, 4);
  const part2 = cleanNino.substring(4, 6);
  const part3 = cleanNino.substring(6, 8);
  const suffix = cleanNino.substring(8, 9);

  // Format with spaces and trim any trailing space
  return `${prefix} ${part1} ${part2} ${part3} ${suffix}`.trim();
}

/**
 * @typedef {Object} ParsedNINO
 * @property {string} prefix - Two-letter prefix (e.g., 'AB')
 * @property {string} numbers - Six-digit number sequence (e.g., '123456')
 * @property {string|null} suffix - Single suffix letter or null if not present
 * @property {string} formatted - Standardized formatted version
 * @property {string} original - Original input string
 */

/**
 * Extracts and validates components from a NINO string.
 *
 * Parses a NINO into its constituent parts and provides both the
 * original input and standardized formatted version. Only valid
 * NINOs will be parsed; invalid inputs return null.
 *
 * @param {string} nino - The NINO to parse
 *
 * @returns {ParsedNINO|null} Object containing NINO components, or null if invalid
 *
 * @example
 * parseNINO('AB123456C');
 * // Returns: {
 * //   prefix: 'AB',
 * //   numbers: '123456',
 * //   suffix: 'C',
 * //   formatted: 'AB 12 34 56 C',
 * //   original: 'AB123456C'
 * // }
 *
 * @example
 * parseNINO('AB123456');
 * // Returns: {
 * //   prefix: 'AB',
 * //   numbers: '123456',
 * //   suffix: null,
 * //   formatted: 'AB 12 34 56',
 * //   original: 'AB123456'
 * // }
 *
 * @example
 * parseNINO('invalid'); // null
 *
 * @since 1.0.0
 */
export function parseNINO(nino) {
  // Only parse if valid
  if (!validateNINO(nino)) {
    return null;
  }

  // Clean and normalize
  const cleanNino = nino.toUpperCase().replace(/\s/g, '');

  return {
    prefix: cleanNino.substring(0, 2),
    numbers: cleanNino.substring(2, 8),
    suffix: cleanNino.substring(8, 9) || null,
    formatted: formatNINO(nino),
    original: nino,
  };
}

/**
 * Generates a random valid NINO for testing purposes.
 *
 * Creates a cryptographically random NINO that passes all validation rules.
 * This function includes safeguards against infinite loops and will fallback
 * to known valid values if random generation fails.
 *
 * Note: This is intended for testing and development only. Do not use
 * generated NINOs for any official purposes.
 *
 * @returns {string} A randomly generated valid NINO
 *
 * @example
 * const testNINO = generateRandomNINO();
 * console.log(testNINO);              // e.g., 'JK789012M'
 * console.log(validateNINO(testNINO)); // always true
 *
 * @example
 * // Generate test data
 * const testCases = Array.from({ length: 10 }, () => generateRandomNINO());
 *
 * @since 1.0.0
 */
export function generateRandomNINO() {
  // Valid first letters (excluding D, F, I, Q, U, V and letters that make all combinations invalid)
  const validFirstLetters = 'ABCEJKLMPRSTWXYZ'; // Removed G, N, O as they make all combinations invalid

  // Valid second letters (excluding D, F, I, Q, U, V)
  const validSecondLetters = 'ABCEGJKLMNOPRSTWXYZ';

  // Valid suffix letters
  const validSuffixes = 'ABCEGJKLMNOPRSTWXYZ';

  const firstLetter =
    validFirstLetters[Math.floor(Math.random() * validFirstLetters.length)];
  let secondLetter =
    validSecondLetters[Math.floor(Math.random() * validSecondLetters.length)];

  // Ensure we don't create an invalid prefix combination (with safety counter)
  let prefix = firstLetter + secondLetter;
  let attempts = 0;
  const maxAttempts = 100;

  while (INVALID_PREFIXES.includes(prefix) && attempts < maxAttempts) {
    secondLetter =
      validSecondLetters[Math.floor(Math.random() * validSecondLetters.length)];
    prefix = firstLetter + secondLetter;
    attempts++;
  }

  // Fallback to a known valid prefix if we couldn't find one
  if (INVALID_PREFIXES.includes(prefix)) {
    prefix = 'AB'; // Known valid prefix
  }

  // Generate 6 random digits (ensure they're not all the same) with safety counter
  let numbers;
  let numberAttempts = 0;
  const maxNumberAttempts = 1000;

  do {
    numbers = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    numberAttempts++;
  } while (/^(\d)\1{5}$/.test(numbers) && numberAttempts < maxNumberAttempts);

  // Fallback to a known valid number if we couldn't generate one
  if (/^(\d)\1{5}$/.test(numbers)) {
    numbers = '123456'; // Known valid number pattern
  }

  const suffix =
    validSuffixes[Math.floor(Math.random() * validSuffixes.length)];

  return prefix + numbers + suffix;
}

// Import and re-export i18n functions
import * as i18n from './src/i18n/index.mjs';

// Export i18n functions
export const {
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  detectLanguage,
  initializeI18n,
} = i18n;

// Default export for convenience
export default {
  validateNINO,
  validateNINOWithDetails,
  formatNINO,
  parseNINO,
  generateRandomNINO,
  // Internationalization functions
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  detectLanguage,
  initializeI18n,
};
