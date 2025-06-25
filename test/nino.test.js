const {
  validateNINO,
  validateNINOWithDetails,
  formatNINO,
  parseNINO,
  generateRandomNINO,
} = require('../index');

describe('NINO Validator', () => {
  describe('validateNINO', () => {
    it('should validate correct NINO formats', () => {
      expect(validateNINO('AB123456C')).toBe(true);
      expect(validateNINO('AB123456')).toBe(true);
      expect(validateNINO('ab123456c')).toBe(true);
      expect(validateNINO('AB 12 34 56 C')).toBe(true);
      expect(validateNINO('  AB123456C  ')).toBe(true);
    });

    it('should reject invalid NINO formats', () => {
      expect(validateNINO('123456789')).toBe(false);
      expect(validateNINO('AB12345')).toBe(false);
      expect(validateNINO('A1234567')).toBe(false);
      expect(validateNINO('AB1234567')).toBe(false);
      expect(validateNINO('')).toBe(false);
      expect(validateNINO(null)).toBe(false);
      expect(validateNINO(undefined)).toBe(false);
      expect(validateNINO(123456789)).toBe(false);
    });

    it('should reject invalid prefixes', () => {
      expect(validateNINO('BG123456C')).toBe(false);
      expect(validateNINO('GB123456C')).toBe(false);
      expect(validateNINO('NK123456C')).toBe(false);
      expect(validateNINO('KN123456C')).toBe(false);
      expect(validateNINO('TN123456C')).toBe(false);
      expect(validateNINO('NT123456C')).toBe(false);
      expect(validateNINO('ZZ123456C')).toBe(false);
    });

    it('should reject invalid first/second letters', () => {
      expect(validateNINO('DA123456C')).toBe(false);
      expect(validateNINO('FA123456C')).toBe(false);
      expect(validateNINO('IA123456C')).toBe(false);
      expect(validateNINO('QA123456C')).toBe(false);
      expect(validateNINO('UA123456C')).toBe(false);
      expect(validateNINO('VA123456C')).toBe(false);
      expect(validateNINO('AD123456C')).toBe(false);
      expect(validateNINO('AF123456C')).toBe(false);
    });

    it('should reject invalid suffixes', () => {
      expect(validateNINO('AB123456D')).toBe(false);
      expect(validateNINO('AB123456F')).toBe(false);
      expect(validateNINO('AB123456I')).toBe(false);
      expect(validateNINO('AB123456Q')).toBe(false);
      expect(validateNINO('AB123456U')).toBe(false);
      expect(validateNINO('AB123456V')).toBe(false);
    });

    it('should reject numbers with all same digits', () => {
      expect(validateNINO('AB111111C')).toBe(false);
      expect(validateNINO('AB222222C')).toBe(false);
      expect(validateNINO('AB000000C')).toBe(false);
    });

    it('should handle requireSuffix option', () => {
      expect(validateNINO('AB123456', { requireSuffix: true })).toBe(false);
      expect(validateNINO('AB123456C', { requireSuffix: true })).toBe(true);
      expect(validateNINO('AB123456', { requireSuffix: false })).toBe(true);
    });

    it('should handle allowSpaces option', () => {
      expect(validateNINO('AB 12 34 56 C', { allowSpaces: true })).toBe(true);
      expect(validateNINO('AB 12 34 56 C', { allowSpaces: false })).toBe(false);
      expect(validateNINO('AB123456C', { allowSpaces: false })).toBe(true);
    });
  });

  describe('formatNINO', () => {
    it('should format valid NINOs correctly', () => {
      expect(formatNINO('AB123456C')).toBe('AB 12 34 56 C');
      expect(formatNINO('AB123456')).toBe('AB 12 34 56');
      expect(formatNINO('ab123456c')).toBe('AB 12 34 56 C');
      expect(formatNINO('AB 12 34 56 C')).toBe('AB 12 34 56 C');
    });

    it('should return null for invalid NINOs', () => {
      expect(formatNINO('invalid')).toBe(null);
      expect(formatNINO('BG123456C')).toBe(null);
      expect(formatNINO('')).toBe(null);
    });
  });

  describe('parseNINO', () => {
    it('should parse valid NINOs correctly', () => {
      const result = parseNINO('AB123456C');
      expect(result).toEqual({
        prefix: 'AB',
        numbers: '123456',
        suffix: 'C',
        formatted: 'AB 12 34 56 C',
        original: 'AB123456C',
      });
    });

    it('should handle NINOs without suffix', () => {
      const result = parseNINO('AB123456');
      expect(result).toEqual({
        prefix: 'AB',
        numbers: '123456',
        suffix: null,
        formatted: 'AB 12 34 56',
        original: 'AB123456',
      });
    });

    it('should return null for invalid NINOs', () => {
      expect(parseNINO('invalid')).toBe(null);
      expect(parseNINO('BG123456C')).toBe(null);
    });
  });

  describe('generateRandomNINO', () => {
    it('should generate valid NINOs', () => {
      for (let i = 0; i < 100; i++) {
        const nino = generateRandomNINO();
        expect(validateNINO(nino)).toBe(true);
      }
    });

    it('should generate NINOs with correct format', () => {
      const nino = generateRandomNINO();
      expect(nino).toMatch(/^[A-Z]{2}\d{6}[A-Z]$/);
    });
  });
});

describe('validateNINOWithDetails', () => {
  describe('Valid inputs', () => {
    test('should return success object for valid NINO', () => {
      const result = validateNINOWithDetails('AB123456C');
      expect(result).toEqual({
        isValid: true,
        error: null,
        errorCode: null,
        suggestion: null,
      });
    });

    test('should handle valid NINO without suffix', () => {
      const result = validateNINOWithDetails('AB123456');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should handle valid NINO with spaces', () => {
      const result = validateNINOWithDetails('AB 12 34 56 C');
      expect(result.isValid).toBe(true);
    });

    test('should handle mixed case input', () => {
      const result = validateNINOWithDetails('ab123456c');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Input validation errors', () => {
    test('should handle null input', () => {
      const result = validateNINOWithDetails(null);
      expect(result).toEqual({
        isValid: false,
        error: 'NINO cannot be null or undefined',
        errorCode: 'NULL_INPUT',
        suggestion: 'Provide a valid NINO string',
      });
    });

    test('should handle undefined input', () => {
      const result = validateNINOWithDetails(undefined);
      expect(result).toEqual({
        isValid: false,
        error: 'NINO cannot be null or undefined',
        errorCode: 'NULL_INPUT',
        suggestion: 'Provide a valid NINO string',
      });
    });

    test('should handle non-string input', () => {
      const result = validateNINOWithDetails(123456789);
      expect(result).toEqual({
        isValid: false,
        error: 'Expected string, got number',
        errorCode: 'INVALID_TYPE',
        suggestion: 'Convert the input to a string before validation',
      });
    });

    test('should handle empty string', () => {
      const result = validateNINOWithDetails('');
      expect(result).toEqual({
        isValid: false,
        error: 'NINO cannot be empty',
        errorCode: 'EMPTY_INPUT',
        suggestion: 'Provide a non-empty NINO string',
      });
    });

    test('should handle whitespace-only string', () => {
      const result = validateNINOWithDetails('   ');
      expect(result).toEqual({
        isValid: false,
        error: 'NINO cannot be empty',
        errorCode: 'EMPTY_INPUT',
        suggestion: 'Provide a non-empty NINO string',
      });
    });

    test('should handle extremely long input', () => {
      const longInput = 'A'.repeat(25);
      const result = validateNINOWithDetails(longInput);
      expect(result).toEqual({
        isValid: false,
        error: 'NINO input too long (maximum 20 characters)',
        errorCode: 'INPUT_TOO_LONG',
        suggestion: 'Ensure the input is a valid NINO, not a longer string',
      });
    });
  });

  describe('Character validation errors', () => {
    test('should handle invalid characters', () => {
      const result = validateNINOWithDetails('AB123456C@');
      expect(result).toEqual({
        isValid: false,
        error:
          'NINO contains invalid characters. Only letters and numbers are allowed',
        errorCode: 'INVALID_CHARACTERS',
        suggestion: 'Remove any special characters, punctuation, or symbols',
      });
    });

    test('should handle special characters', () => {
      const result = validateNINOWithDetails('AB-123-456-C');
      expect(result.errorCode).toBe('INVALID_CHARACTERS');
    });

    test('should handle punctuation', () => {
      const result = validateNINOWithDetails('AB123456C.');
      expect(result.errorCode).toBe('INVALID_CHARACTERS');
    });
  });

  describe('Space handling errors', () => {
    test('should reject spaces when not allowed', () => {
      const result = validateNINOWithDetails('AB 12 34 56 C', {
        allowSpaces: false,
      });
      expect(result).toEqual({
        isValid: false,
        error: 'Spaces are not allowed in this context',
        errorCode: 'SPACES_NOT_ALLOWED',
        suggestion: 'Remove all spaces from the NINO',
      });
    });
  });

  describe('Length validation errors', () => {
    test('should handle too short input', () => {
      const result = validateNINOWithDetails('AB12345');
      expect(result).toEqual({
        isValid: false,
        error: 'NINO too short (7 characters). Minimum 8 characters required',
        errorCode: 'TOO_SHORT',
        suggestion:
          'Ensure the NINO has 2 letters, 6 digits, and optionally 1 letter',
      });
    });

    test('should handle too long input', () => {
      const result = validateNINOWithDetails('AB123456CC');
      expect(result).toEqual({
        isValid: false,
        error: 'NINO too long (10 characters). Maximum 9 characters allowed',
        errorCode: 'TOO_LONG',
        suggestion: 'Remove extra characters from the NINO',
      });
    });
  });

  describe('Format validation errors', () => {
    test('should detect invalid prefix format', () => {
      const result = validateNINOWithDetails('A1123456C');
      expect(result).toEqual({
        isValid: false,
        error: 'NINO must start with exactly 2 letters',
        errorCode: 'INVALID_PREFIX_FORMAT',
        suggestion:
          'Ensure the first 2 characters are letters (e.g., AB, CD, EF)',
      });
    });

    test('should detect invalid number format', () => {
      const result = validateNINOWithDetails('AB12A456C');
      expect(result).toEqual({
        isValid: false,
        error: 'NINO must have exactly 6 digits after the 2-letter prefix',
        errorCode: 'INVALID_NUMBER_FORMAT',
        suggestion: 'Ensure characters 3-8 are all numbers (e.g., 123456)',
      });
    });

    test('should detect missing required suffix', () => {
      const result = validateNINOWithDetails('AB123456', {
        requireSuffix: true,
      });
      expect(result).toEqual({
        isValid: false,
        error: 'Suffix letter is required in this context',
        errorCode: 'MISSING_REQUIRED_SUFFIX',
        suggestion: 'Add a valid suffix letter (A, B, C, E, G, H, etc.)',
      });
    });

    test('should detect invalid suffix format', () => {
      const result = validateNINOWithDetails('AB1234561');
      expect(result).toEqual({
        isValid: false,
        error: 'Suffix must be a single letter',
        errorCode: 'INVALID_SUFFIX_FORMAT',
        suggestion: 'Ensure the last character is a letter',
      });
    });
  });

  describe('HMRC rule validation errors', () => {
    test('should detect invalid prefix', () => {
      const result = validateNINOWithDetails('BG123456C');
      expect(result).toEqual({
        isValid: false,
        error: 'Invalid prefix "BG". This prefix is not used by HMRC',
        errorCode: 'INVALID_PREFIX',
        suggestion: 'Use a valid prefix like AB, CD, EF, GH, JK, etc.',
      });
    });

    test('should detect invalid first letter', () => {
      const result = validateNINOWithDetails('DA123456C');
      expect(result).toEqual({
        isValid: false,
        error:
          'Invalid first letter "D". Letters D, F, I, Q, U, V are not used as first letters',
        errorCode: 'INVALID_FIRST_LETTER',
        suggestion:
          'Use a valid first letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
      });
    });

    test('should detect invalid second letter', () => {
      const result = validateNINOWithDetails('AD123456C');
      expect(result).toEqual({
        isValid: false,
        error:
          'Invalid second letter "D". Letters D, F, I, Q, U, V are not used as second letters',
        errorCode: 'INVALID_SECOND_LETTER',
        suggestion:
          'Use a valid second letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
      });
    });

    test('should detect invalid suffix letter', () => {
      const result = validateNINOWithDetails('AB123456D');
      expect(result).toEqual({
        isValid: false,
        error:
          'Invalid suffix "D". Letters D, F, I, Q, U, V are not used as suffix letters',
        errorCode: 'INVALID_SUFFIX',
        suggestion:
          'Use a valid suffix letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
      });
    });

    test('should detect repeated number pattern', () => {
      const result = validateNINOWithDetails('AB111111C');
      expect(result).toEqual({
        isValid: false,
        error:
          'Invalid number pattern "111111". All six digits cannot be the same',
        errorCode: 'INVALID_NUMBER_PATTERN',
        suggestion: 'Use a number sequence where not all digits are identical',
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle all invalid first letters', () => {
      const invalidLetters = ['D', 'F', 'I', 'Q', 'U', 'V'];
      invalidLetters.forEach((letter) => {
        const result = validateNINOWithDetails(`${letter}A123456C`);
        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('INVALID_FIRST_LETTER');
        expect(result.error).toContain(`Invalid first letter "${letter}"`);
      });
    });

    test('should handle all invalid second letters', () => {
      const invalidLetters = ['D', 'F', 'I', 'Q', 'U', 'V'];
      invalidLetters.forEach((letter) => {
        const result = validateNINOWithDetails(`A${letter}123456C`);
        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('INVALID_SECOND_LETTER');
        expect(result.error).toContain(`Invalid second letter "${letter}"`);
      });
    });

    test('should handle all invalid suffix letters', () => {
      const invalidLetters = ['D', 'F', 'I', 'Q', 'U', 'V'];
      invalidLetters.forEach((letter) => {
        const result = validateNINOWithDetails(`AB123456${letter}`);
        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('INVALID_SUFFIX');
        expect(result.error).toContain(`Invalid suffix "${letter}"`);
      });
    });

    test('should handle all repeated digit patterns', () => {
      for (let digit = 0; digit <= 9; digit++) {
        const repeatedDigits = digit.toString().repeat(6);
        const result = validateNINOWithDetails(`AB${repeatedDigits}C`);
        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('INVALID_NUMBER_PATTERN');
        expect(result.error).toContain(
          `Invalid number pattern "${repeatedDigits}"`
        );
      }
    });

    test('should handle edge case invalid prefixes', () => {
      // Only include prefixes that don't have invalid individual letters
      // QQ is excluded because Q is an invalid letter and will be caught by INVALID_SECOND_LETTER
      const edgePrefixes = ['BG', 'GB', 'NK', 'KN', 'TN', 'NT', 'ZZ'];
      edgePrefixes.forEach((prefix) => {
        const result = validateNINOWithDetails(`${prefix}123456C`);
        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('INVALID_PREFIX');
        expect(result.error).toContain(`Invalid prefix "${prefix}"`);
      });
    });

    test('should handle prefixes with invalid letters (caught before prefix check)', () => {
      // QQ should be caught by invalid first letter check (Q is the first letter)
      const resultFirst = validateNINOWithDetails('QQ123456C');
      expect(resultFirst.isValid).toBe(false);
      expect(resultFirst.errorCode).toBe('INVALID_FIRST_LETTER');
      expect(resultFirst.error).toContain('Invalid first letter "Q"');

      // AQ should be caught by invalid second letter check (Q is the second letter)
      const resultSecond = validateNINOWithDetails('AQ123456C');
      expect(resultSecond.isValid).toBe(false);
      expect(resultSecond.errorCode).toBe('INVALID_SECOND_LETTER');
      expect(resultSecond.error).toContain('Invalid second letter "Q"');
    });
  });

  describe('Options handling', () => {
    test('should work with default options', () => {
      const result = validateNINOWithDetails('AB123456C');
      expect(result.isValid).toBe(true);
    });

    test('should work with partial options', () => {
      const result = validateNINOWithDetails('AB123456C', {
        requireSuffix: true,
      });
      expect(result.isValid).toBe(true);
    });

    test('should work with all options', () => {
      const result = validateNINOWithDetails('AB123456C', {
        allowSpaces: false,
        requireSuffix: true,
      });
      expect(result.isValid).toBe(true);
    });
  });
});

describe('Enhanced edge cases for all functions', () => {
  describe('Extended input validation', () => {
    test('validateNINO should handle array input gracefully', () => {
      expect(validateNINO(['AB123456C'])).toBe(false);
    });

    test('validateNINO should handle object input gracefully', () => {
      expect(validateNINO({ nino: 'AB123456C' })).toBe(false);
    });

    test('validateNINO should handle boolean input gracefully', () => {
      expect(validateNINO(true)).toBe(false);
      expect(validateNINO(false)).toBe(false);
    });

    test('validateNINO should handle very long strings', () => {
      const veryLongString = 'AB123456C' + 'X'.repeat(100);
      expect(validateNINO(veryLongString)).toBe(false);
    });
  });

  describe('Unicode and special character handling', () => {
    test('should reject unicode characters', () => {
      expect(validateNINO('AB123456ñ')).toBe(false);
      expect(validateNINO('ÄB123456C')).toBe(false);
      expect(validateNINO('AB123456Ć')).toBe(false);
    });

    test('should reject emojis and symbols', () => {
      expect(validateNINO('AB123456😀')).toBe(false);
      expect(validateNINO('AB123456€')).toBe(false);
      expect(validateNINO('AB123456™')).toBe(false);
    });

    test('should reject control characters', () => {
      expect(validateNINO('AB123456C\n')).toBe(false);
      expect(validateNINO('AB123456C\t')).toBe(false);
      expect(validateNINO('AB123456C\r')).toBe(false);
    });
  });

  describe('Format edge cases', () => {
    test('should handle mixed separators', () => {
      expect(validateNINO('AB-12 34_56C')).toBe(false);
      expect(validateNINO('AB.12.34.56.C')).toBe(false);
    });

    test('should handle inconsistent spacing', () => {
      expect(validateNINO('AB  12   34 56 C')).toBe(true); // Multiple spaces should be allowed
      expect(validateNINO('AB12 3456C')).toBe(true); // Irregular spacing should work
    });

    test('should handle leading/trailing characters', () => {
      expect(validateNINO('0AB123456C')).toBe(false);
      expect(validateNINO('AB123456C0')).toBe(false);
      expect(validateNINO('XAB123456C')).toBe(false);
    });
  });

  describe('Enhanced formatNINO edge cases', () => {
    test('should handle malformed but valid content', () => {
      expect(formatNINO('   AB123456C   ')).toBe('AB 12 34 56 C');
      expect(formatNINO('ab123456c')).toBe('AB 12 34 56 C');
    });

    test('should return null for edge case inputs', () => {
      expect(formatNINO('')).toBe(null);
      expect(formatNINO(null)).toBe(null);
      expect(formatNINO(undefined)).toBe(null);
      expect(formatNINO(123)).toBe(null);
    });
  });

  describe('Enhanced parseNINO edge cases', () => {
    test('should handle whitespace variations', () => {
      // Regular spaces should work
      const result = parseNINO('  AB123456C  ');
      expect(result?.prefix).toBe('AB');
      expect(result?.numbers).toBe('123456');
      expect(result?.suffix).toBe('C');

      // Control characters should be rejected (return null)
      expect(parseNINO('\t AB123456C \n')).toBe(null);
    });

    test('should return null for invalid edge cases', () => {
      expect(parseNINO('')).toBe(null);
      expect(parseNINO('AB')).toBe(null);
      expect(parseNINO('123456')).toBe(null);
      expect(parseNINO('ABCDEFGH')).toBe(null);
    });
  });

  describe('Enhanced generateRandomNINO edge cases', () => {
    test('should consistently generate valid NINOs', () => {
      for (let i = 0; i < 100; i++) {
        const nino = generateRandomNINO();
        expect(validateNINO(nino)).toBe(true);
        expect(nino).toMatch(/^[A-Z]{2}\d{6}[A-Z]$/);
      }
    });

    test('should generate NINOs with valid prefixes', () => {
      for (let i = 0; i < 50; i++) {
        const nino = generateRandomNINO();
        const prefix = nino.substring(0, 2);

        // Should not be in invalid prefixes list
        const invalidPrefixes = ['BG', 'GB', 'NK', 'KN', 'TN', 'NT', 'ZZ'];
        expect(invalidPrefixes).not.toContain(prefix);

        // Should not start with invalid letters
        const invalidLetters = ['D', 'F', 'I', 'Q', 'U', 'V'];
        expect(invalidLetters).not.toContain(prefix[0]);
        expect(invalidLetters).not.toContain(prefix[1]);
      }
    });

    test('should generate NINOs without repeated digits', () => {
      for (let i = 0; i < 50; i++) {
        const nino = generateRandomNINO();
        const numbers = nino.substring(2, 8);

        // Should not be all the same digit
        expect(numbers).not.toMatch(/^(\d)\1{5}$/);
      }
    });
  });
});
