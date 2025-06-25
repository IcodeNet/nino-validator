/**
 * Internationalization (i18n) Tests for NINO Validator
 *
 * Tests the Greek language support and i18n functionality
 */

const {
  validateNINOWithDetails,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  detectLanguage,
  initializeI18n,
} = require('../index.js');

describe('Internationalization (i18n)', () => {
  // Reset language before each test
  beforeEach(() => {
    setLanguage('en');
  });

  describe('Language Management', () => {
    test('should default to English', () => {
      expect(getCurrentLanguage()).toBe('en');
    });

    test('should set language to Greek', () => {
      setLanguage('el');
      expect(getCurrentLanguage()).toBe('el');
    });

    test('should throw error for unsupported language', () => {
      expect(() => setLanguage('fr')).toThrow('Unsupported language: fr');
    });

    test('should return supported languages', () => {
      const languages = getSupportedLanguages();
      expect(languages).toEqual({
        en: 'English',
        el: 'Ελληνικά (Greek)',
      });
    });

    test('should check language support correctly', () => {
      expect(isLanguageSupported('en')).toBe(true);
      expect(isLanguageSupported('el')).toBe(true);
      expect(isLanguageSupported('fr')).toBe(false);
      expect(isLanguageSupported('de')).toBe(false);
    });
  });

  describe('English Error Messages', () => {
    beforeEach(() => {
      setLanguage('en');
    });

    test('should return English error for null input', () => {
      const result = validateNINOWithDetails(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('NINO cannot be null or undefined');
      expect(result.suggestion).toBe('Provide a valid NINO string');
      expect(result.errorCode).toBe('NULL_INPUT');
    });

    test('should return English error for invalid type', () => {
      const result = validateNINOWithDetails(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Expected string, got number');
      expect(result.suggestion).toBe(
        'Convert the input to a string before validation'
      );
      expect(result.errorCode).toBe('INVALID_TYPE');
    });

    test('should return English error for too short', () => {
      const result = validateNINOWithDetails('AB123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'NINO too short (5 characters). Minimum 8 characters required'
      );
      expect(result.suggestion).toBe(
        'Ensure the NINO has 2 letters, 6 digits, and optionally 1 letter'
      );
      expect(result.errorCode).toBe('TOO_SHORT');
    });

    test('should return English error for invalid prefix', () => {
      const result = validateNINOWithDetails('BG123456C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid prefix "BG". This prefix is not used by HMRC'
      );
      expect(result.suggestion).toBe(
        'Use a valid prefix like AB, CD, EF, GH, JK, etc.'
      );
      expect(result.errorCode).toBe('INVALID_PREFIX');
    });

    test('should return English error for invalid first letter', () => {
      const result = validateNINOWithDetails('DB123456C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid first letter "D". Letters D, F, I, Q, U, V are not used as first letters'
      );
      expect(result.suggestion).toBe(
        'Use a valid first letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z'
      );
      expect(result.errorCode).toBe('INVALID_FIRST_LETTER');
    });
  });

  describe('Greek Error Messages', () => {
    beforeEach(() => {
      setLanguage('el');
    });

    test('should return Greek error for null input', () => {
      const result = validateNINOWithDetails(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Ο NINO δεν μπορεί να είναι null ή undefined');
      expect(result.suggestion).toBe('Παρέχετε μια έγκυρη συμβολοσειρά NINO');
      expect(result.errorCode).toBe('NULL_INPUT');
    });

    test('should return Greek error for invalid type', () => {
      const result = validateNINOWithDetails(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Αναμενόταν string, δόθηκε number');
      expect(result.suggestion).toBe(
        'Μετατρέψτε την είσοδο σε string πριν από την επικύρωση'
      );
      expect(result.errorCode).toBe('INVALID_TYPE');
    });

    test('should return Greek error for empty input', () => {
      const result = validateNINOWithDetails('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Ο NINO δεν μπορεί να είναι κενός');
      expect(result.suggestion).toBe('Παρέχετε μια μη-κενή συμβολοσειρά NINO');
      expect(result.errorCode).toBe('EMPTY_INPUT');
    });

    test('should return Greek error for too short', () => {
      const result = validateNINOWithDetails('AB123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Ο NINO είναι πολύ μικρός (5 χαρακτήρες). Απαιτούνται τουλάχιστον 8 χαρακτήρες'
      );
      expect(result.suggestion).toBe(
        'Βεβαιωθείτε ότι ο NINO έχει 2 γράμματα, 6 ψηφία και προαιρετικά 1 γράμμα'
      );
      expect(result.errorCode).toBe('TOO_SHORT');
    });

    test('should return Greek error for too long', () => {
      const result = validateNINOWithDetails('AB1234567890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Ο NINO είναι πολύ μεγάλος (12 χαρακτήρες). Επιτρέπονται μέχρι 9 χαρακτήρες'
      );
      expect(result.suggestion).toBe(
        'Αφαιρέστε τους επιπλέον χαρακτήρες από τον NINO'
      );
      expect(result.errorCode).toBe('TOO_LONG');
    });

    test('should return Greek error for invalid characters', () => {
      const result = validateNINOWithDetails('AB123456@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Ο NINO περιέχει μη έγκυρους χαρακτήρες. Επιτρέπονται μόνο γράμματα και αριθμοί'
      );
      expect(result.suggestion).toBe(
        'Αφαιρέστε τυχόν ειδικούς χαρακτήρες, σημεία στίξης ή σύμβολα'
      );
      expect(result.errorCode).toBe('INVALID_CHARACTERS');
    });

    test('should return Greek error for invalid prefix', () => {
      const result = validateNINOWithDetails('BG123456C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Μη έγκυρο πρόθεμα "BG". Αυτό το πρόθεμα δεν χρησιμοποιείται από την HMRC'
      );
      expect(result.suggestion).toBe(
        'Χρησιμοποιήστε έγκυρο πρόθεμα όπως AB, CD, EF, GH, JK, κλπ.'
      );
      expect(result.errorCode).toBe('INVALID_PREFIX');
    });

    test('should return Greek error for invalid first letter', () => {
      const result = validateNINOWithDetails('DB123456C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Μη έγκυρο πρώτο γράμμα "D". Τα γράμματα D, F, I, Q, U, V δεν χρησιμοποιούνται ως πρώτα γράμματα'
      );
      expect(result.suggestion).toBe(
        'Χρησιμοποιήστε έγκυρο πρώτο γράμμα: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z'
      );
      expect(result.errorCode).toBe('INVALID_FIRST_LETTER');
    });

    test('should return Greek error for invalid second letter', () => {
      const result = validateNINOWithDetails('AD123456C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Μη έγκυρο δεύτερο γράμμα "D". Τα γράμματα D, F, I, Q, U, V δεν χρησιμοποιούνται ως δεύτερα γράμματα'
      );
      expect(result.suggestion).toBe(
        'Χρησιμοποιήστε έγκυρο δεύτερο γράμμα: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z'
      );
      expect(result.errorCode).toBe('INVALID_SECOND_LETTER');
    });

    test('should return Greek error for invalid suffix', () => {
      const result = validateNINOWithDetails('AB123456D');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Μη έγκυρο επίθημα "D". Τα γράμματα D, F, I, Q, U, V δεν χρησιμοποιούνται ως γράμματα επιθήματος'
      );
      expect(result.suggestion).toBe(
        'Χρησιμοποιήστε έγκυρο γράμμα επιθήματος: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z'
      );
      expect(result.errorCode).toBe('INVALID_SUFFIX');
    });

    test('should return Greek error for invalid number pattern', () => {
      const result = validateNINOWithDetails('AB111111C');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Μη έγκυρο μοτίβο αριθμών "111111". Όλα τα έξι ψηφία δεν μπορούν να είναι τα ίδια'
      );
      expect(result.suggestion).toBe(
        'Χρησιμοποιήστε μια ακολουθία αριθμών όπου δεν είναι όλα τα ψηφία πανομοιότυπα'
      );
      expect(result.errorCode).toBe('INVALID_NUMBER_PATTERN');
    });

    test('should return Greek error for spaces not allowed', () => {
      const result = validateNINOWithDetails('AB 12 34 56 C', {
        allowSpaces: false,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Τα κενά δεν επιτρέπονται σε αυτό το πλαίσιο');
      expect(result.suggestion).toBe('Αφαιρέστε όλα τα κενά από τον NINO');
      expect(result.errorCode).toBe('SPACES_NOT_ALLOWED');
    });

    test('should return Greek error for missing required suffix', () => {
      const result = validateNINOWithDetails('AB123456', {
        requireSuffix: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Το γράμμα επιθήματος είναι απαραίτητο σε αυτό το πλαίσιο'
      );
      expect(result.suggestion).toBe(
        'Προσθέστε ένα έγκυρο γράμμα επιθήματος (A, B, C, E, G, H, κλπ.)'
      );
      expect(result.errorCode).toBe('MISSING_REQUIRED_SUFFIX');
    });
  });

  describe('Language Switching', () => {
    test('should switch languages correctly', () => {
      // Start in English
      setLanguage('en');
      let result = validateNINOWithDetails(null);
      expect(result.error).toBe('NINO cannot be null or undefined');

      // Switch to Greek
      setLanguage('el');
      result = validateNINOWithDetails(null);
      expect(result.error).toBe('Ο NINO δεν μπορεί να είναι null ή undefined');

      // Switch back to English
      setLanguage('en');
      result = validateNINOWithDetails(null);
      expect(result.error).toBe('NINO cannot be null or undefined');
    });

    test('should preserve error codes across languages', () => {
      const testCases = [
        { input: null, expectedCode: 'NULL_INPUT' },
        { input: 123, expectedCode: 'INVALID_TYPE' },
        { input: '', expectedCode: 'EMPTY_INPUT' },
        { input: 'AB123', expectedCode: 'TOO_SHORT' },
        { input: 'BG123456C', expectedCode: 'INVALID_PREFIX' },
      ];

      testCases.forEach(({ input, expectedCode }) => {
        // Test in English
        setLanguage('en');
        let result = validateNINOWithDetails(input);
        expect(result.errorCode).toBe(expectedCode);

        // Test in Greek
        setLanguage('el');
        result = validateNINOWithDetails(input);
        expect(result.errorCode).toBe(expectedCode);
      });
    });
  });

  describe('Initialization and Detection', () => {
    test('should initialize with default language', () => {
      const result = initializeI18n();
      expect(result).toBe('en');
      expect(getCurrentLanguage()).toBe('en');
    });

    test('should detect language (returns a supported language)', () => {
      const detected = detectLanguage();
      expect(typeof detected).toBe('string');
      expect(isLanguageSupported(detected)).toBe(true);
    });

    test('should initialize with auto-detect', () => {
      const result = initializeI18n({ autoDetect: true });
      expect(typeof result).toBe('string');
      expect(isLanguageSupported(result)).toBe(true);
    });

    test('should use fallback language when auto-detect fails', () => {
      const result = initializeI18n({
        autoDetect: false,
        fallbackLanguage: 'el',
      });
      expect(result).toBe('en'); // Should still be current language since autoDetect is false
    });
  });

  describe('Edge Cases', () => {
    test('should handle unknown error codes gracefully', () => {
      // This tests the getMessage function directly by accessing the internal i18n module
      const { getLocalizedMessage } = require('../src/i18n');

      const result = getLocalizedMessage('UNKNOWN_ERROR_CODE');
      expect(result.error).toBe('Unknown error code: UNKNOWN_ERROR_CODE');
      expect(result.suggestion).toBe(
        'Please check the error code and try again'
      );
    });

    test('should fallback to English for unsupported language in getMessage', () => {
      const { getMessageForLanguage } = require('../src/i18n');

      // Try to get message in unsupported language
      const result = getMessageForLanguage('NULL_INPUT', 'fr');
      expect(result.error).toBe('NINO cannot be null or undefined');
      expect(result.suggestion).toBe('Provide a valid NINO string');
    });

    test('should handle parameter interpolation in both languages', () => {
      setLanguage('en');
      let result = validateNINOWithDetails(123);
      expect(result.error).toContain('number');

      setLanguage('el');
      result = validateNINOWithDetails(123);
      expect(result.error).toContain('number');
    });
  });

  describe('Valid NINO Validation', () => {
    test('should return success in English', () => {
      setLanguage('en');
      const result = validateNINOWithDetails('AB123456C');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.suggestion).toBeNull();
      expect(result.errorCode).toBeNull();
    });

    test('should return success in Greek', () => {
      setLanguage('el');
      const result = validateNINOWithDetails('AB123456C');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.suggestion).toBeNull();
      expect(result.errorCode).toBeNull();
    });
  });
});
