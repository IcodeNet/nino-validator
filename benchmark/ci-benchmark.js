/**
 * Lightweight NINO Validator Benchmarks for CI
 *
 * Faster benchmark suite suitable for CI/CD environments.
 * Focuses on essential performance metrics with reduced iteration counts.
 */

const {
  validateNINO,
  formatNINO,
  parseNINO,
  generateRandomNINO,
} = require("../index.js");

// Lightweight benchmark configuration
const CI_ITERATIONS = {
  QUICK: 100,
  STANDARD: 1000,
  INTENSIVE: 10000,
};

const TEST_NINOS = [
  "AB123456C", // Valid
  "BG123456C", // Invalid prefix
  "AB111111C", // Invalid (same digits)
  "invalid", // Invalid format
  "", // Empty
];

/**
 * Simple performance timer
 */
function timeFunction(fn, iterations = 1000) {
  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  const opsPerSecond = Math.round((iterations / duration) * 1000);

  return {
    duration,
    opsPerSecond,
    avgTimePerOp: Math.round((duration / iterations) * 1000000) / 1000, // microseconds
  };
}

/**
 * Run lightweight benchmarks
 */
function runCIBenchmarks() {
  console.log("⚡ NINO Validator CI Benchmarks");
  console.log("===============================");
  console.log(`Node.js: ${process.version}`);

  const results = [];

  // Test validateNINO with different inputs
  console.log("\n🧪 Testing validateNINO performance...");

  const validTest = timeFunction(() => {
    validateNINO("AB123456C");
  }, CI_ITERATIONS.INTENSIVE);
  results.push({ name: "validateNINO (valid)", ...validTest });

  const invalidTest = timeFunction(() => {
    validateNINO("BG123456C");
  }, CI_ITERATIONS.INTENSIVE);
  results.push({ name: "validateNINO (invalid)", ...invalidTest });

  // Test other functions
  console.log("🔧 Testing other functions...");

  const formatTest = timeFunction(() => {
    formatNINO("AB123456C");
  }, CI_ITERATIONS.STANDARD);
  results.push({ name: "formatNINO", ...formatTest });

  const parseTest = timeFunction(() => {
    parseNINO("AB123456C");
  }, CI_ITERATIONS.STANDARD);
  results.push({ name: "parseNINO", ...parseTest });

  const generateTest = timeFunction(() => {
    generateRandomNINO();
  }, CI_ITERATIONS.QUICK);
  results.push({ name: "generateRandomNINO", ...generateTest });

  // Bulk test
  console.log("📦 Testing bulk operations...");
  const bulkTest = timeFunction(() => {
    TEST_NINOS.forEach((nino) => validateNINO(nino));
  }, CI_ITERATIONS.STANDARD);
  results.push({ name: "Bulk validation (5 NINOs)", ...bulkTest });

  // Display results
  console.log("\n📊 Results:");
  console.log("============");

  results.forEach((result) => {
    let status;
    if (result.opsPerSecond >= 10000) {
      status = "✅";
    } else if (result.opsPerSecond >= 1000) {
      status = "⚠️";
    } else {
      status = "❌";
    }
    console.log(
      `${status} ${result.name.padEnd(30)} | ${result.opsPerSecond
        .toLocaleString()
        .padStart(8)} ops/sec | ${result.avgTimePerOp
        .toFixed(1)
        .padStart(6)}μs/op`
    );
  });

  // Performance check
  const minAcceptable = 1000;
  const allPassing = results.every((r) => r.opsPerSecond >= minAcceptable);

  console.log(`\n🎯 Performance check: ${allPassing ? "✅ PASS" : "❌ FAIL"}`);
  console.log(
    `   Minimum acceptable: ${minAcceptable.toLocaleString()} ops/sec`
  );

  if (!allPassing) {
    const failing = results.filter((r) => r.opsPerSecond < minAcceptable);
    console.log("   Failing tests:");
    failing.forEach((r) => {
      console.log(`   - ${r.name}: ${r.opsPerSecond.toLocaleString()} ops/sec`);
    });
    process.exit(1);
  }

  return results;
}

// Export for programmatic usage
module.exports = {
  runCIBenchmarks,
  timeFunction,
  CI_ITERATIONS,
};

// Run if executed directly
if (require.main === module) {
  runCIBenchmarks();
}
