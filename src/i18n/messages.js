/**
 * Internationalization messages for NINO Validator
 *
 * @fileoverview Localized error messages and suggestions for validation
 * @author Byron Thanopoulos <byron.thanopoulos@gmail.com>
 * @version 1.0.0
 */

const messages = {
  en: {
    // Input validation errors
    NULL_INPUT: {
      error: 'NINO cannot be null or undefined',
      suggestion: 'Provide a valid NINO string',
    },
    INVALID_TYPE: {
      error: 'Expected string, got {type}',
      suggestion: 'Convert the input to a string before validation',
    },
    EMPTY_INPUT: {
      error: 'NINO cannot be empty',
      suggestion: 'Provide a non-empty NINO string',
    },
    INPUT_TOO_LONG: {
      error: 'NINO input too long (maximum 20 characters)',
      suggestion: 'Ensure the input is a valid NINO, not a longer string',
    },

    // Character validation errors
    INVALID_CHARACTERS: {
      error:
        'NINO contains invalid characters. Only letters and numbers are allowed',
      suggestion: 'Remove any special characters, punctuation, or symbols',
    },
    SPACES_NOT_ALLOWED: {
      error: 'Spaces are not allowed in this context',
      suggestion: 'Remove all spaces from the NINO',
    },

    // Length validation errors
    TOO_SHORT: {
      error:
        'NINO too short ({length} characters). Minimum 8 characters required',
      suggestion:
        'Ensure the NINO has 2 letters, 6 digits, and optionally 1 letter',
    },
    TOO_LONG: {
      error:
        'NINO too long ({length} characters). Maximum 9 characters allowed',
      suggestion: 'Remove extra characters from the NINO',
    },

    // Format validation errors
    INVALID_PREFIX_FORMAT: {
      error: 'NINO must start with exactly 2 letters',
      suggestion:
        'Ensure the first 2 characters are letters (e.g., AB, CD, EF)',
    },
    INVALID_NUMBER_FORMAT: {
      error: 'NINO must have exactly 6 digits after the 2-letter prefix',
      suggestion: 'Ensure characters 3-8 are all numbers (e.g., 123456)',
    },
    MISSING_REQUIRED_SUFFIX: {
      error: 'Suffix letter is required in this context',
      suggestion: 'Add a valid suffix letter (A, B, C, E, G, H, etc.)',
    },
    INVALID_SUFFIX_FORMAT: {
      error: 'Suffix must be a single letter',
      suggestion: 'Ensure the last character is a letter',
    },
    INVALID_FORMAT: {
      error:
        'Invalid NINO format. Expected format: XX123456X (suffix optional)',
      suggestion:
        'Ensure the NINO has 2 letters, 6 digits, and optionally 1 letter',
    },

    // HMRC rule validation errors
    INVALID_PREFIX: {
      error: 'Invalid prefix "{prefix}". This prefix is not used by HMRC',
      suggestion: 'Use a valid prefix like AB, CD, EF, GH, JK, etc.',
    },
    INVALID_FIRST_LETTER: {
      error:
        'Invalid first letter "{letter}". Letters D, F, I, Q, U, V are not used as first letters',
      suggestion:
        'Use a valid first letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
    },
    INVALID_SECOND_LETTER: {
      error:
        'Invalid second letter "{letter}". Letters D, F, I, Q, U, V are not used as second letters',
      suggestion:
        'Use a valid second letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
    },
    INVALID_SUFFIX: {
      error:
        'Invalid suffix "{suffix}". Letters D, F, I, Q, U, V are not used as suffix letters',
      suggestion:
        'Use a valid suffix letter: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
    },
    INVALID_NUMBER_PATTERN: {
      error:
        'Invalid number pattern "{numbers}". All six digits cannot be the same',
      suggestion: 'Use a number sequence where not all digits are identical',
    },
  },

  el: {
    // Input validation errors
    NULL_INPUT: {
      error: 'Ο NINO δεν μπορεί να είναι null ή undefined',
      suggestion: 'Παρέχετε μια έγκυρη συμβολοσειρά NINO',
    },
    INVALID_TYPE: {
      error: 'Αναμενόταν string, δόθηκε {type}',
      suggestion: 'Μετατρέψτε την είσοδο σε string πριν από την επικύρωση',
    },
    EMPTY_INPUT: {
      error: 'Ο NINO δεν μπορεί να είναι κενός',
      suggestion: 'Παρέχετε μια μη-κενή συμβολοσειρά NINO',
    },
    INPUT_TOO_LONG: {
      error: 'Η είσοδος NINO είναι πολύ μεγάλη (μέγιστο 20 χαρακτήρες)',
      suggestion:
        'Βεβαιωθείτε ότι η είσοδος είναι έγκυρος NINO, όχι μεγαλύτερη συμβολοσειρά',
    },

    // Character validation errors
    INVALID_CHARACTERS: {
      error:
        'Ο NINO περιέχει μη έγκυρους χαρακτήρες. Επιτρέπονται μόνο γράμματα και αριθμοί',
      suggestion:
        'Αφαιρέστε τυχόν ειδικούς χαρακτήρες, σημεία στίξης ή σύμβολα',
    },
    SPACES_NOT_ALLOWED: {
      error: 'Τα κενά δεν επιτρέπονται σε αυτό το πλαίσιο',
      suggestion: 'Αφαιρέστε όλα τα κενά από τον NINO',
    },

    // Length validation errors
    TOO_SHORT: {
      error:
        'Ο NINO είναι πολύ μικρός ({length} χαρακτήρες). Απαιτούνται τουλάχιστον 8 χαρακτήρες',
      suggestion:
        'Βεβαιωθείτε ότι ο NINO έχει 2 γράμματα, 6 ψηφία και προαιρετικά 1 γράμμα',
    },
    TOO_LONG: {
      error:
        'Ο NINO είναι πολύ μεγάλος ({length} χαρακτήρες). Επιτρέπονται μέχρι 9 χαρακτήρες',
      suggestion: 'Αφαιρέστε τους επιπλέον χαρακτήρες από τον NINO',
    },

    // Format validation errors
    INVALID_PREFIX_FORMAT: {
      error: 'Ο NINO πρέπει να αρχίζει με ακριβώς 2 γράμματα',
      suggestion:
        'Βεβαιωθείτε ότι οι πρώτοι 2 χαρακτήρες είναι γράμματα (π.χ., AB, CD, EF)',
    },
    INVALID_NUMBER_FORMAT: {
      error:
        'Ο NINO πρέπει να έχει ακριβώς 6 ψηφία μετά το πρόθεμα 2 γραμμάτων',
      suggestion:
        'Βεβαιωθείτε ότι οι χαρακτήρες 3-8 είναι όλοι αριθμοί (π.χ., 123456)',
    },
    MISSING_REQUIRED_SUFFIX: {
      error: 'Το γράμμα επιθήματος είναι απαραίτητο σε αυτό το πλαίσιο',
      suggestion:
        'Προσθέστε ένα έγκυρο γράμμα επιθήματος (A, B, C, E, G, H, κλπ.)',
    },
    INVALID_SUFFIX_FORMAT: {
      error: 'Το επίθημα πρέπει να είναι ένα μόνο γράμμα',
      suggestion: 'Βεβαιωθείτε ότι ο τελευταίος χαρακτήρας είναι γράμμα',
    },
    INVALID_FORMAT: {
      error:
        'Μη έγκυρη μορφή NINO. Αναμενόμενη μορφή: XX123456X (το επίθημα είναι προαιρετικό)',
      suggestion:
        'Βεβαιωθείτε ότι ο NINO έχει 2 γράμματα, 6 ψηφία και προαιρετικά 1 γράμμα',
    },

    // HMRC rule validation errors
    INVALID_PREFIX: {
      error:
        'Μη έγκυρο πρόθεμα "{prefix}". Αυτό το πρόθεμα δεν χρησιμοποιείται από την HMRC',
      suggestion: 'Χρησιμοποιήστε έγκυρο πρόθεμα όπως AB, CD, EF, GH, JK, κλπ.',
    },
    INVALID_FIRST_LETTER: {
      error:
        'Μη έγκυρο πρώτο γράμμα "{letter}". Τα γράμματα D, F, I, Q, U, V δεν χρησιμοποιούνται ως πρώτα γράμματα',
      suggestion:
        'Χρησιμοποιήστε έγκυρο πρώτο γράμμα: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
    },
    INVALID_SECOND_LETTER: {
      error:
        'Μη έγκυρο δεύτερο γράμμα "{letter}". Τα γράμματα D, F, I, Q, U, V δεν χρησιμοποιούνται ως δεύτερα γράμματα',
      suggestion:
        'Χρησιμοποιήστε έγκυρο δεύτερο γράμμα: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
    },
    INVALID_SUFFIX: {
      error:
        'Μη έγκυρο επίθημα "{suffix}". Τα γράμματα D, F, I, Q, U, V δεν χρησιμοποιούνται ως γράμματα επιθήματος',
      suggestion:
        'Χρησιμοποιήστε έγκυρο γράμμα επιθήματος: A, B, C, E, G, H, J, K, L, M, N, O, P, R, S, T, W, X, Y, Z',
    },
    INVALID_NUMBER_PATTERN: {
      error:
        'Μη έγκυρο μοτίβο αριθμών "{numbers}". Όλα τα έξι ψηφία δεν μπορούν να είναι τα ίδια',
      suggestion:
        'Χρησιμοποιήστε μια ακολουθία αριθμών όπου δεν είναι όλα τα ψηφία πανομοιότυπα',
    },
  },
};

/**
 * Get localized message for error code
 * @param {string} errorCode - The error code
 * @param {string} language - Language code (default: 'en')
 * @param {Object} params - Parameters for message interpolation
 * @returns {Object} Object with error and suggestion
 */
function getMessage(errorCode, language = 'en', params = {}) {
  const lang = messages[language] || messages.en;
  const message = lang[errorCode] || messages.en[errorCode];

  if (!message) {
    return {
      error: `Unknown error code: ${errorCode}`,
      suggestion: 'Please check the error code and try again',
    };
  }

  // Simple template replacement
  let error = message.error;
  let suggestion = message.suggestion;

  Object.keys(params).forEach((key) => {
    const placeholder = `{${key}}`;
    error = error.replace(placeholder, params[key]);
    suggestion = suggestion.replace(placeholder, params[key]);
  });

  return { error, suggestion };
}

module.exports = {
  messages,
  getMessage,
};
