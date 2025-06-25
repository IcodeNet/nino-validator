/**
 * Greek Internationalization Demonstration
 *
 * This script demonstrates the Greek language support added to the NINO Validator.
 * It shows side-by-side comparison of English and Greek error messages.
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

console.log('🇬🇧🇬🇷 NINO Validator Greek Internationalization Demo');
console.log('='.repeat(60));

// Show supported languages
console.log('\n📋 Supported Languages:');
const languages = getSupportedLanguages();
Object.entries(languages).forEach(([code, name]) => {
  console.log(`  ${code}: ${name}`);
});

// Demonstration test cases
const testCases = [
  { input: null, description: 'Null input' },
  { input: 123, description: 'Invalid type (number)' },
  { input: '', description: 'Empty string' },
  { input: 'AB123', description: 'Too short' },
  { input: 'AB1234567890', description: 'Too long' },
  { input: 'AB123456@', description: 'Invalid characters' },
  { input: 'DB123456C', description: 'Invalid first letter' },
  { input: 'AD123456C', description: 'Invalid second letter' },
  { input: 'AB123456D', description: 'Invalid suffix' },
  { input: 'BG123456C', description: 'Invalid prefix' },
  { input: 'AB111111C', description: 'Invalid number pattern' },
  {
    input: 'AB 12 34 56 C',
    description: 'Spaces not allowed',
    options: { allowSpaces: false },
  },
  {
    input: 'AB123456',
    description: 'Missing required suffix',
    options: { requireSuffix: true },
  },
];

console.log('\n🔍 Error Message Comparison:');
console.log('='.repeat(60));

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.description}`);
  console.log('Input:', testCase.input);
  console.log('-'.repeat(40));

  // English version
  setLanguage('en');
  const englishResult = validateNINOWithDetails(
    testCase.input,
    testCase.options
  );
  console.log('🇬🇧 English:');
  console.log(`   Error: ${englishResult.error}`);
  console.log(`   Suggestion: ${englishResult.suggestion}`);
  console.log(`   Code: ${englishResult.errorCode}`);

  // Greek version
  setLanguage('el');
  const greekResult = validateNINOWithDetails(testCase.input, testCase.options);
  console.log('\n🇬🇷 Greek:');
  console.log(`   Error: ${greekResult.error}`);
  console.log(`   Suggestion: ${greekResult.suggestion}`);
  console.log(`   Code: ${greekResult.errorCode}`);

  // Verify error codes match
  if (englishResult.errorCode === greekResult.errorCode) {
    console.log('\n✅ Error codes match across languages');
  } else {
    console.log('\n❌ Error code mismatch!');
  }
});

// Demonstrate language management features
console.log('\n\n🛠️  Language Management Features:');
console.log('='.repeat(60));

console.log('\n📍 Current Language:');
console.log(`getCurrentLanguage(): ${getCurrentLanguage()}`);

console.log('\n🔍 Language Support Check:');
['en', 'el', 'fr', 'de'].forEach((lang) => {
  const supported = isLanguageSupported(lang);
  const status = supported ? '✅' : '❌';
  console.log(`${status} ${lang}: ${supported}`);
});

console.log('\n🌐 Auto-Detection:');
const detected = detectLanguage();
console.log(`detectLanguage(): ${detected}`);

console.log('\n⚙️  Initialization:');
const initialized = initializeI18n({ autoDetect: true });
console.log(`initializeI18n({ autoDetect: true }): ${initialized}`);

// Reset to English for clean finish
setLanguage('en');

console.log('\n\n🎉 Demo completed! Language reset to English.');
console.log('\n📚 Usage Examples:');
console.log('   setLanguage("el");  // Switch to Greek');
console.log('   setLanguage("en");  // Switch to English');
console.log('   const result = validateNINOWithDetails("invalid");');
console.log('   console.log(result.error); // Localized error message');

console.log('\n🔗 For more information, see the README.md file.');
console.log(
  '🐛 Report issues: https://github.com/icodenet/nino-validator/issues'
);
console.log(
  '💬 Discussions: https://github.com/icodenet/nino-validator/discussions'
);
