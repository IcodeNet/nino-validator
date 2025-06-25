/**
 * ESM Module Tests
 *
 * Tests to verify that the ESM module exports work correctly
 */

import ninoValidator, {
  validateNINO,
  formatNINO,
  parseNINO,
  generateRandomNINO,
  validateNINOWithDetails,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
} from "../index.mjs";

// Test individual named exports
console.log("Testing ESM named exports...");

// Test validateNINO
const isValid = validateNINO("AB123456C");
console.log('validateNINO("AB123456C"):', isValid); // Should be true
console.assert(
  isValid === true,
  "validateNINO should return true for valid NINO"
);

// Test formatNINO
const formatted = formatNINO("AB123456C");
console.log('formatNINO("AB123456C"):', formatted); // Should be 'AB 12 34 56 C'
console.assert(
  formatted === "AB 12 34 56 C",
  "formatNINO should format correctly"
);

// Test parseNINO
const parsed = parseNINO("AB123456C");
console.log('parseNINO("AB123456C"):', parsed);
console.assert(
  parsed !== null,
  "parseNINO should return an object for valid NINO"
);
console.assert(
  parsed.prefix === "AB",
  "parseNINO should extract prefix correctly"
);
console.assert(
  parsed.numbers === "123456",
  "parseNINO should extract numbers correctly"
);
console.assert(
  parsed.suffix === "C",
  "parseNINO should extract suffix correctly"
);

// Test generateRandomNINO
const randomNINO = generateRandomNINO();
console.log("generateRandomNINO():", randomNINO);
console.assert(
  typeof randomNINO === "string",
  "generateRandomNINO should return a string"
);
console.assert(
  validateNINO(randomNINO) === true,
  "generateRandomNINO should generate valid NINO"
);

// Test default export
console.log("\nTesting ESM default export...");

const isValidDefault = ninoValidator.validateNINO("AB123456C");
console.log('ninoValidator.validateNINO("AB123456C"):', isValidDefault);
console.assert(
  isValidDefault === true,
  "Default export validateNINO should work"
);

const formattedDefault = ninoValidator.formatNINO("AB123456C");
console.log('ninoValidator.formatNINO("AB123456C"):', formattedDefault);
console.assert(
  formattedDefault === "AB 12 34 56 C",
  "Default export formatNINO should work"
);

// Test with validation options
const withOptions = validateNINO("AB123456", { requireSuffix: true });
console.log('validateNINO("AB123456", { requireSuffix: true }):', withOptions); // Should be false
console.assert(
  withOptions === false,
  "validateNINO with requireSuffix should return false for NINO without suffix"
);

// Test i18n functionality
console.log("\nTesting ESM i18n exports...");

// Test language management
console.log("getCurrentLanguage():", getCurrentLanguage());
console.assert(getCurrentLanguage() === "en", "Should default to English");

console.log("getSupportedLanguages():", getSupportedLanguages());
const supportedLangs = getSupportedLanguages();
console.assert(supportedLangs.en === "English", "Should support English");
console.assert(
  supportedLangs.el === "Ελληνικά (Greek)",
  "Should support Greek"
);

// Test language switching with validateNINOWithDetails
console.log("\nTesting language switching...");
setLanguage("en");
const englishResult = validateNINOWithDetails(null);
console.log("English error:", englishResult.error);
console.assert(
  englishResult.error === "NINO cannot be null or undefined",
  "Should return English error message"
);

setLanguage("el");
const greekResult = validateNINOWithDetails(null);
console.log("Greek error:", greekResult.error);
console.assert(
  greekResult.error === "Ο NINO δεν μπορεί να είναι null ή undefined",
  "Should return Greek error message"
);

// Test i18n with default export
console.log("\nTesting i18n with default export...");
ninoValidator.setLanguage("en");
console.assert(
  ninoValidator.getCurrentLanguage() === "en",
  "Default export i18n should work"
);

// Reset to English for clean state
setLanguage("en");

console.log("\n✅ All ESM tests passed (including i18n)!");
