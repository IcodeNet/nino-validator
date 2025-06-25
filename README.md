# NINO Validator

[![npm version](https://badge.fury.io/js/nino-validator.svg)](https://badge.fury.io/js/nino-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, fast, and comprehensive npm package for validating UK National Insurance Numbers (NINO) with full compliance to HMRC rules.

## Features

- ✅ **Complete HMRC compliance** - Validates against all official NINO rules
- 🚀 **Blazing fast** - 5M+ ops/sec, zero dependencies, all functions rated "Excellent"
- 🛡️ **Type safe** - Full JSDoc documentation with TypeScript-friendly types
- 🔧 **Flexible options** - Configurable validation behavior
- 🎯 **100% test coverage** - Thoroughly tested with comprehensive test suite
- 📱 **Cross-platform** - Works in Node.js and browsers
- 📦 **Dual package** - Supports both CommonJS and ES Modules (ESM)
- 🏷️ **TypeScript ready** - Includes TypeScript declaration files

## Installation

```bash
npm install nino-validator
```

## Quick Start

### CommonJS (Node.js)
```javascript
const { validateNINO } = require('nino-validator');

// Simple validation
console.log(validateNINO('AB123456C')); // true
console.log(validateNINO('invalid'));   // false
```

### ES Modules (ESM)
```javascript
import { validateNINO } from 'nino-validator';

// Simple validation
console.log(validateNINO('AB123456C')); // true
console.log(validateNINO('invalid'));   // false
```

### TypeScript
```typescript
import { validateNINO, ValidationOptions } from 'nino-validator';

const options: ValidationOptions = { requireSuffix: true };
const isValid: boolean = validateNINO('AB123456C', options);
```

## Complete Usage Guide

### Basic Validation

**CommonJS:**
```javascript
const { validateNINO, formatNINO, parseNINO, generateRandomNINO } = require('nino-validator');
```

**ES Modules:**
```javascript
import { validateNINO, formatNINO, parseNINO, generateRandomNINO } from 'nino-validator';
```

**Usage (same for both formats):**
```javascript
// Validate different NINO formats
validateNINO('AB123456C');        // true - standard format
validateNINO('AB123456');         // true - suffix optional by default
validateNINO('ab123456c');        // true - case insensitive
validateNINO('AB 12 34 56 C');    // true - spaces allowed by default
validateNINO('  AB123456C  ');    // true - whitespace trimmed
validateNINO('invalid-nino');     // false - invalid format
```

### Advanced Validation Options

```javascript
// Require suffix letter
validateNINO('AB123456', { requireSuffix: true });   // false - no suffix
validateNINO('AB123456C', { requireSuffix: true });  // true - has suffix

// Strict formatting (no spaces allowed)
validateNINO('AB 12 34 56 C', { allowSpaces: false }); // false - contains spaces
validateNINO('AB123456C', { allowSpaces: false });     // true - no spaces

// Combine options
validateNINO('AB123456C', { 
  requireSuffix: true, 
  allowSpaces: false 
}); // true
```

### Formatting NINOs

```javascript
// Standard formatting with spaces
formatNINO('AB123456C');    // 'AB 12 34 56 C'
formatNINO('ab123456c');    // 'AB 12 34 56 C' (normalized)
formatNINO('AB123456');     // 'AB 12 34 56' (no suffix)
formatNINO('invalid');      // null (invalid NINO)

// Clean up user input
const userInput = '  ab 12 34 56 c  ';
const formatted = formatNINO(userInput); // 'AB 12 34 56 C'
```

### Parsing NINO Components

```javascript
// Extract all components
const result = parseNINO('AB123456C');
console.log(result);
// Output:
// {
//   prefix: 'AB',
//   numbers: '123456', 
//   suffix: 'C',
//   formatted: 'AB 12 34 56 C',
//   original: 'AB123456C'
// }

// Handle NINOs without suffix
const noSuffix = parseNINO('AB123456');
console.log(noSuffix.suffix); // null

// Invalid NINOs return null
parseNINO('invalid'); // null
```

### Generate Test Data

```javascript
// Generate random valid NINOs for testing
const testNINO = generateRandomNINO(); 
console.log(testNINO);           // e.g., 'JG123789A'
console.log(validateNINO(testNINO)); // always true

// Generate multiple test cases
const testCases = Array.from({ length: 10 }, () => generateRandomNINO());
console.log(testCases);
// ['AB123456C', 'JK789012G', 'MN345678P', ...]
```

## API Reference

### `validateNINO(nino, options?)`

Validates a UK National Insurance Number against HMRC rules.

**Parameters:**
- `nino` (string): The NINO to validate
- `options` (object, optional):
  - `allowSpaces` (boolean, default: `true`): Allow spaces in the input
  - `requireSuffix` (boolean, default: `false`): Require the suffix letter

**Returns:** `boolean` - `true` if valid, `false` otherwise

**Example:**
```javascript
validateNINO('AB123456C');                        // true
validateNINO('AB123456', { requireSuffix: true }); // false
```

### `formatNINO(nino)`

Formats a NINO with standard UK government spacing (XX ## ## ## X).

**Parameters:**
- `nino` (string): The NINO to format

**Returns:** `string | null` - Formatted NINO or `null` if invalid

**Example:**
```javascript
formatNINO('AB123456C'); // 'AB 12 34 56 C'
formatNINO('invalid');   // null
```

### `parseNINO(nino)`

Extracts and validates components from a NINO.

**Parameters:**
- `nino` (string): The NINO to parse

**Returns:** `object | null` - Components object or `null` if invalid

**Return object structure:**
```typescript
{
  prefix: string;      // Two-letter prefix (e.g., 'AB')
  numbers: string;     // Six-digit number (e.g., '123456')
  suffix: string | null; // Single suffix letter or null
  formatted: string;   // Standardized format
  original: string;    // Original input
}
```

### `generateRandomNINO()`

Generates a random valid NINO for testing purposes.

**Returns:** `string` - A randomly generated valid NINO

**Example:**
```javascript
const testNINO = generateRandomNINO(); // 'JK789012M'
```

### `validateNINOWithDetails(nino, options?)`

Provides detailed validation with localized error messages.

**Parameters:**
- `nino` (string): The NINO to validate
- `options` (object, optional): Same as `validateNINO()`

**Returns:** `ValidationResult` - Detailed validation result

**Return object structure:**
```typescript
{
  isValid: boolean;
  error: string | null;       // Localized error message
  errorCode: string | null;   // Machine-readable error code
  suggestion: string | null;  // Localized suggestion
}
```

**Example:**
```javascript
const result = validateNINOWithDetails('AB123');
console.log(result);
// {
//   isValid: false,
//   error: 'NINO too short (5 characters). Minimum 8 characters required',
//   errorCode: 'TOO_SHORT',
//   suggestion: 'Ensure the NINO has 2 letters, 6 digits, and optionally 1 letter'
// }
```

## Internationalization (i18n)

The NINO Validator supports multiple languages for error messages. Currently supported languages are English (`en`) and Greek (`el`).

### Language Management

```javascript
const { 
  setLanguage, 
  getCurrentLanguage, 
  getSupportedLanguages,
  isLanguageSupported 
} = require('nino-validator');

// Check supported languages
console.log(getSupportedLanguages());
// { en: 'English', el: 'Ελληνικά (Greek)' }

// Switch to Greek
setLanguage('el');
console.log(getCurrentLanguage()); // 'el'

// Validate with Greek error messages
const result = validateNINOWithDetails('invalid');
console.log(result.error);
// 'Μη έγκυρη μορφή NINO. Αναμενόμενη μορφή: XX123456X (το επίθημα είναι προαιρετικό)'

// Switch back to English
setLanguage('en');
```

### Auto-Detection and Initialization

```javascript
const { detectLanguage, initializeI18n } = require('nino-validator');

// Auto-detect language from environment
const detected = detectLanguage();
console.log(detected); // 'el' if Greek locale detected

// Initialize with auto-detection
const language = initializeI18n({ autoDetect: true });
console.log(`Language set to: ${language}`);

// Initialize with fallback
initializeI18n({ 
  autoDetect: true, 
  fallbackLanguage: 'el' 
});
```

### Language Support Features

- **Consistent Error Codes**: Error codes remain the same across languages for programmatic handling
- **Parameter Interpolation**: Dynamic values (like lengths, invalid characters) are properly inserted into translated messages
- **Environment Detection**: Automatically detects language from Node.js environment variables or browser settings
- **Fallback Handling**: Gracefully falls back to English if requested language is not supported

### Adding New Languages

To add support for additional languages, error messages need to be translated in the internal message files. Contact the maintainer for language addition requests.

## NINO Validation Rules

This package validates against all official HMRC rules:

### ✅ Valid Format
- **Structure**: Two letters + Six digits + One optional letter
- **Example**: `AB123456C` or `AB123456`

### ❌ Invalid Patterns

1. **Invalid Prefixes**: BG, GB, NK, KN, TN, NT, ZZ, and all combinations starting with D, F, G, I, N, O, Q, U, V
2. **Invalid First Letters**: D, F, I, Q, U, V
3. **Invalid Second Letters**: D, F, I, Q, U, V  
4. **Invalid Suffixes**: D, F, I, Q, U, V
5. **Repeated Numbers**: All six digits cannot be identical (e.g., 111111)

### Examples

```javascript
// ✅ Valid NINOs
'AB123456C'    // Standard format
'AB123456'     // Without suffix
'JG103759A'    // Real-world example
'AB 12 34 56 C' // With spaces

// ❌ Invalid NINOs  
'BG123456C'    // Invalid prefix 'BG'
'AB111111C'    // All digits the same
'AB123456D'    // Invalid suffix 'D'
'DA123456C'    // Invalid first letter 'D'
'AB12345'      // Too few digits
'A1234567'     // Wrong format
```

## Error Handling

The package handles errors gracefully:

```javascript
// Type safety
validateNINO(null);        // false
validateNINO(undefined);   // false  
validateNINO(123456789);   // false
validateNINO('');          // false

// Invalid formats return null
formatNINO('invalid');     // null
parseNINO('invalid');      // null

// Options validation
validateNINO('AB123456C', { invalidOption: true }); // Works (ignores invalid options)
```

## Performance

NINO Validator is designed for high performance with comprehensive benchmarking:

- **Zero dependencies** - No external packages required
- **Fast validation** - Optimized regex and lookup operations  
- **Memory efficient** - Minimal memory footprint
- **Browser compatible** - Works in all modern browsers

### Performance Benchmarks

Run comprehensive performance tests:

```bash
# Full benchmark suite with detailed analysis
npm run benchmark

# Quick CI-friendly performance check  
npm run benchmark:ci

# Memory-focused benchmarks with GC control
npm run benchmark:memory
```

**Sample Benchmark Output:**
```
⚡ NINO Validator CI Benchmarks
===============================
✅ validateNINO (valid)           | 2,350,000 ops/sec |    0.4μs/op
✅ validateNINO (invalid)         | 5,150,000 ops/sec |    0.2μs/op  
✅ formatNINO                     |   915,000 ops/sec |    1.1μs/op
✅ parseNINO                      |   800,000 ops/sec |    1.2μs/op
✅ generateRandomNINO             |   575,000 ops/sec |    1.7μs/op
✅ Bulk validation                | 3,000,000 ops/sec |    0.3μs/op

🎯 Performance check: ✅ PASS
```

### Typical Performance Results

On modern hardware (Node.js v18+):

| Function | Operations/Second | Rating | Use Case |
|----------|------------------|--------|----------|
| `validateNINO` (valid) | 2,350,000+ | 🟢 Excellent | Form validation |
| `validateNINO` (invalid) | 5,150,000+ | 🟢 Excellent | Input filtering |
| `formatNINO` | 915,000+ | 🟢 Excellent | Display formatting |
| `parseNINO` | 800,000+ | 🟢 Excellent | Data extraction |
| `generateRandomNINO` | 575,000+ | 🟢 Excellent | Test data generation |
| **Bulk validation** | **3,000,000+** | 🟢 **Excellent** | **Batch processing** |

### Performance Ratings Scale

| Rating | Operations/Second | Description |
|--------|------------------|-------------|
| 🟢 Excellent | ≥100,000 | Outstanding performance |
| 🟡 Good | ≥10,000 | Acceptable performance |
| 🔴 Poor | <10,000 | May need optimization |

**Performance Insights:**
- Invalid inputs are validated ~2x faster than valid ones (short-circuit validation)
- Bulk operations can process over **3 million NINOs per second**
- Memory usage is minimal (~0.1MB for 10,000 operations)
- All functions consistently achieve "Excellent" performance ratings
- Zero performance degradation with large datasets

See [benchmark documentation](./benchmark/README.md) for detailed performance analysis and optimization tips.

## Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/nino-validator@latest/index.js"></script>
</head>
<body>
    <script>
        // Use the global ninoValidator object
        console.log(ninoValidator.validateNINO('AB123456C')); // true
    </script>
</body>
</html>
```

## TypeScript Support

While this package is written in JavaScript, it includes comprehensive JSDoc comments for TypeScript IntelliSense:

```typescript
import { validateNINO, formatNINO, parseNINO, generateRandomNINO } from 'nino-validator';

const isValid: boolean = validateNINO('AB123456C');
const formatted: string | null = formatNINO('AB123456C');
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## Real-World Examples

### Form Validation

```javascript
function validateNINOInput(input) {
  const nino = input.trim();
  
  if (!nino) {
    return { valid: false, error: 'NINO is required' };
  }
  
  if (!validateNINO(nino)) {
    return { valid: false, error: 'Invalid NINO format' };
  }
  
  return { valid: true, formatted: formatNINO(nino) };
}

// Usage
const result = validateNINOInput('  ab 12 34 56 c  ');
console.log(result); // { valid: true, formatted: 'AB 12 34 56 C' }
```

### Database Storage

```javascript
function normalizeNINO(input) {
  const parsed = parseNINO(input);
  if (!parsed) return null;
  
  return {
    prefix: parsed.prefix,
    numbers: parsed.numbers,
    suffix: parsed.suffix,
    display: parsed.formatted
  };
}
```

### Test Data Generation

```javascript
function createTestUser() {
  return {
    id: Math.random().toString(36),
    nino: generateRandomNINO(),
    name: 'Test User'
  };
}
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/icodenet/nino-validator.git
cd nino-validator
npm install
npm test
```

## License

MIT © [Byron Thanopoulos](https://github.com/icodenet)

## Support

- 📧 Email: byron.thanopoulos@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/icodenet/nino-validator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/icodenet/nino-validator/discussions)