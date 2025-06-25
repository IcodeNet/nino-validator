/**
 * NINO Validator Performance Benchmarks
 *
 * Comprehensive performance testing suite for all NINO validator functions.
 * Tests various scenarios including valid/invalid inputs, bulk operations,
 * and memory usage patterns.
 */

const {
  validateNINO,
  formatNINO,
  parseNINO,
  generateRandomNINO,
} = require("../index.js");

// Benchmark configuration
const ITERATIONS = {
  QUICK: 1000,
  STANDARD: 10000,
  INTENSIVE: 100000,
  BULK: 1000000,
};

// Test data sets
const VALID_NINOS = [
  "AB123456C",
  "JG103759A",
  "MN567890P",
  "PZ987654X",
  "TY123789G",
];

const INVALID_NINOS = [
  "BG123456C", // Invalid prefix
  "AB111111C", // All same digits
  "AB123456D", // Invalid suffix
  "DA123456C", // Invalid first letter
  "AB12345", // Too short
  "invalid", // Completely invalid
  "", // Empty string
  "AB123456CC", // Too long
];

const MIXED_NINOS = [...VALID_NINOS, ...INVALID_NINOS];

/**
 * High-resolution timer for accurate benchmarking
 */
class PerformanceTimer {
  constructor() {
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = process.hrtime.bigint();
  }

  end() {
    this.endTime = process.hrtime.bigint();
    return this.getDuration();
  }

  getDuration() {
    if (!this.startTime || !this.endTime) {
      throw new Error("Timer not properly started/ended");
    }
    return Number(this.endTime - this.startTime) / 1000000; // Convert to milliseconds
  }
}

/**
 * Memory usage tracker
 */
function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: Math.round((usage.rss / 1024 / 1024) * 100) / 100, // MB
    heapTotal: Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100, // MB
    heapUsed: Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100, // MB
    external: Math.round((usage.external / 1024 / 1024) * 100) / 100, // MB
  };
}

/**
 * Run a benchmark test
 */
function runBenchmark(name, testFunction, iterations = ITERATIONS.STANDARD) {
  console.log(
    `\n🏃 Running ${name} (${iterations.toLocaleString()} iterations)...`
  );

  const timer = new PerformanceTimer();
  const memoryBefore = getMemoryUsage();

  // Warm up
  for (let i = 0; i < Math.min(1000, iterations / 10); i++) {
    testFunction();
  }

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Actual benchmark
  timer.start();
  for (let i = 0; i < iterations; i++) {
    testFunction();
  }
  const duration = timer.end();

  const memoryAfter = getMemoryUsage();
  const memoryDelta = memoryAfter.heapUsed - memoryBefore.heapUsed;

  // Calculate statistics
  const opsPerSecond = Math.round((iterations / duration) * 1000);
  const avgTimePerOp = Math.round((duration / iterations) * 1000000) / 1000; // microseconds

  console.log(`  ✅ Duration: ${duration.toFixed(2)}ms`);
  console.log(`  ⚡ Operations/sec: ${opsPerSecond.toLocaleString()}`);
  console.log(`  ⏱️  Avg time/op: ${avgTimePerOp}μs`);
  console.log(
    `  💾 Memory delta: ${memoryDelta > 0 ? "+" : ""}${memoryDelta.toFixed(
      2
    )}MB`
  );

  return {
    name,
    duration,
    opsPerSecond,
    avgTimePerOp,
    memoryDelta,
    iterations,
  };
}

/**
 * Benchmark validateNINO with valid inputs
 */
function benchmarkValidateValid() {
  let index = 0;
  return runBenchmark(
    "validateNINO (valid inputs)",
    () => {
      validateNINO(VALID_NINOS[index % VALID_NINOS.length]);
      index++;
    },
    ITERATIONS.INTENSIVE
  );
}

/**
 * Benchmark validateNINO with invalid inputs
 */
function benchmarkValidateInvalid() {
  let index = 0;
  return runBenchmark(
    "validateNINO (invalid inputs)",
    () => {
      validateNINO(INVALID_NINOS[index % INVALID_NINOS.length]);
      index++;
    },
    ITERATIONS.INTENSIVE
  );
}

/**
 * Benchmark validateNINO with mixed inputs
 */
function benchmarkValidateMixed() {
  let index = 0;
  return runBenchmark(
    "validateNINO (mixed inputs)",
    () => {
      validateNINO(MIXED_NINOS[index % MIXED_NINOS.length]);
      index++;
    },
    ITERATIONS.INTENSIVE
  );
}

/**
 * Benchmark validateNINO with options
 */
function benchmarkValidateWithOptions() {
  let index = 0;
  return runBenchmark(
    "validateNINO (with options)",
    () => {
      const nino = VALID_NINOS[index % VALID_NINOS.length];
      validateNINO(nino, { requireSuffix: true, allowSpaces: false });
      index++;
    },
    ITERATIONS.STANDARD
  );
}

/**
 * Benchmark formatNINO
 */
function benchmarkFormat() {
  let index = 0;
  return runBenchmark(
    "formatNINO",
    () => {
      formatNINO(VALID_NINOS[index % VALID_NINOS.length]);
      index++;
    },
    ITERATIONS.STANDARD
  );
}

/**
 * Benchmark parseNINO
 */
function benchmarkParse() {
  let index = 0;
  return runBenchmark(
    "parseNINO",
    () => {
      parseNINO(VALID_NINOS[index % VALID_NINOS.length]);
      index++;
    },
    ITERATIONS.STANDARD
  );
}

/**
 * Benchmark generateRandomNINO
 */
function benchmarkGenerate() {
  return runBenchmark(
    "generateRandomNINO",
    () => {
      generateRandomNINO();
    },
    ITERATIONS.QUICK
  );
}

/**
 * Benchmark bulk validation (realistic usage scenario)
 */
function benchmarkBulkValidation() {
  const testData = [];
  for (let i = 0; i < 1000; i++) {
    testData.push(MIXED_NINOS[i % MIXED_NINOS.length]);
  }

  return runBenchmark(
    "Bulk validation (1000 NINOs per iteration)",
    () => {
      const results = testData.map((nino) => validateNINO(nino));
      return results;
    },
    ITERATIONS.QUICK
  );
}

/**
 * Benchmark string processing scenarios
 */
function benchmarkStringProcessing() {
  const messyNinos = [
    "  AB 12 34 56 C  ",
    "ab123456c",
    "AB-12-34-56-C",
    "  AB123456C\n",
    "AB  12  34  56  C",
  ];

  let index = 0;
  return runBenchmark(
    "String processing (messy inputs)",
    () => {
      const nino = messyNinos[index % messyNinos.length];
      validateNINO(nino);
      formatNINO(nino);
      index++;
    },
    ITERATIONS.STANDARD
  );
}

/**
 * Compare performance with different input patterns
 */
function benchmarkInputPatterns() {
  const patterns = {
    "Short invalid": "AB",
    "Long invalid": "AB123456789012345",
    "Valid with spaces": "AB 12 34 56 C",
    "Valid compact": "AB123456C",
    "Invalid prefix": "BG123456C",
    "All same digits": "AB111111C",
  };

  const results = {};

  Object.entries(patterns).forEach(([name, nino]) => {
    console.log(`\n📊 Testing pattern: ${name}`);
    const timer = new PerformanceTimer();

    timer.start();
    for (let i = 0; i < ITERATIONS.INTENSIVE; i++) {
      validateNINO(nino);
    }
    const duration = timer.end();

    const opsPerSecond = Math.round((ITERATIONS.INTENSIVE / duration) * 1000);
    console.log(`  ⚡ ${opsPerSecond.toLocaleString()} ops/sec`);

    results[name] = opsPerSecond;
  });

  return results;
}

/**
 * Memory stress test
 */
function memoryStressTest() {
  console.log("\n🧠 Memory Stress Test...");
  const initialMemory = getMemoryUsage();
  console.log(`Initial memory: ${initialMemory.heapUsed}MB`);

  // Generate many NINOs and validate them
  const ninos = [];
  for (let i = 0; i < 10000; i++) {
    ninos.push(generateRandomNINO());
  }

  const afterGeneration = getMemoryUsage();
  console.log(
    `After generating 10k NINOs: ${afterGeneration.heapUsed}MB (+${(
      afterGeneration.heapUsed - initialMemory.heapUsed
    ).toFixed(2)}MB)`
  );

  // Validate all generated NINOs
  const results = ninos.map((nino) => validateNINO(nino));

  const afterValidation = getMemoryUsage();
  console.log(
    `After validating 10k NINOs: ${afterValidation.heapUsed}MB (+${(
      afterValidation.heapUsed - afterGeneration.heapUsed
    ).toFixed(2)}MB)`
  );

  // Check that all generated NINOs are valid
  const allValid = results.every((result) => result === true);
  console.log(`All generated NINOs valid: ${allValid ? "✅" : "❌"}`);

  return {
    initialMemory: initialMemory.heapUsed,
    afterGeneration: afterGeneration.heapUsed,
    afterValidation: afterValidation.heapUsed,
    memoryForGeneration: afterGeneration.heapUsed - initialMemory.heapUsed,
    memoryForValidation: afterValidation.heapUsed - afterGeneration.heapUsed,
    allValid,
  };
}

/**
 * Main benchmark runner
 */
function runAllBenchmarks() {
  console.log("🚀 NINO Validator Performance Benchmarks");
  console.log("==========================================");
  console.log(`Node.js: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);
  console.log(
    `Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`
  );
  console.log("==========================================");

  const results = [];

  // Core function benchmarks
  results.push(benchmarkValidateValid());
  results.push(benchmarkValidateInvalid());
  results.push(benchmarkValidateMixed());
  results.push(benchmarkValidateWithOptions());
  results.push(benchmarkFormat());
  results.push(benchmarkParse());
  results.push(benchmarkGenerate());

  // Realistic usage scenarios
  results.push(benchmarkBulkValidation());
  results.push(benchmarkStringProcessing());

  // Pattern analysis
  const patternResults = benchmarkInputPatterns();

  // Memory test
  const memoryResults = memoryStressTest();

  // Summary report
  console.log("\n📊 BENCHMARK SUMMARY");
  console.log("====================");

  results.forEach((result) => {
    console.log(
      `${result.name.padEnd(35)} | ${result.opsPerSecond
        .toLocaleString()
        .padStart(10)} ops/sec | ${result.avgTimePerOp
        .toFixed(1)
        .padStart(8)}μs/op`
    );
  });

  console.log("\n🏆 FASTEST OPERATIONS");
  console.log("=====================");
  const sortedResults = [...results].sort(
    (a, b) => b.opsPerSecond - a.opsPerSecond
  );
  sortedResults.slice(0, 3).forEach((result, index) => {
    console.log(
      `${index + 1}. ${
        result.name
      }: ${result.opsPerSecond.toLocaleString()} ops/sec`
    );
  });

  console.log("\n💡 PERFORMANCE INSIGHTS");
  console.log("=======================");

  const validateValidOps = results.find((r) =>
    r.name.includes("valid inputs")
  ).opsPerSecond;
  const validateInvalidOps = results.find((r) =>
    r.name.includes("invalid inputs")
  ).opsPerSecond;
  const bulkValidationResult = results.find((r) =>
    r.name.includes("Bulk validation")
  );

  console.log(
    `• Valid input validation is ${
      Math.round((validateValidOps / validateInvalidOps) * 100) / 100
    }x ${
      validateValidOps > validateInvalidOps ? "faster" : "slower"
    } than invalid`
  );
  console.log(
    `• Memory usage for 10k operations: ~${memoryResults.memoryForValidation.toFixed(
      2
    )}MB`
  );
  console.log(
    `• Generated NINOs validity rate: ${
      memoryResults.allValid ? "100%" : "Not 100%"
    }`
  );
  if (bulkValidationResult) {
    const effectiveBulkOps = bulkValidationResult.opsPerSecond * 1000;
    console.log(
      `• Bulk validation: ${bulkValidationResult.opsPerSecond.toLocaleString()} iterations/sec = ${effectiveBulkOps.toLocaleString()} NINOs/sec`
    );
  }

  // Performance thresholds
  const minAcceptableOps = 10000;
  const excellentOps = 100000;

  console.log("\n🎯 PERFORMANCE RATINGS");
  console.log("======================");
  results.forEach((result) => {
    let rating = "🔴 Poor";
    let effectiveOps = result.opsPerSecond;

    // Adjust for bulk validation (each iteration processes 1000 NINOs)
    if (result.name.includes("Bulk validation")) {
      effectiveOps = result.opsPerSecond * 1000;
    }

    if (effectiveOps >= excellentOps) rating = "🟢 Excellent";
    else if (effectiveOps >= minAcceptableOps) rating = "🟡 Good";

    console.log(`${result.name.padEnd(35)} | ${rating}`);
  });

  console.log("\n✅ Benchmark complete!");

  return {
    results,
    patternResults,
    memoryResults,
    summary: {
      fastest: sortedResults[0],
      slowest: sortedResults[sortedResults.length - 1],
      avgOpsPerSec: Math.round(
        results.reduce((sum, r) => sum + r.opsPerSecond, 0) / results.length
      ),
    },
  };
}

// Export for programmatic usage
module.exports = {
  runAllBenchmarks,
  benchmarkValidateValid,
  benchmarkValidateInvalid,
  benchmarkFormat,
  benchmarkParse,
  benchmarkGenerate,
  getMemoryUsage,
  PerformanceTimer,
};

// Run benchmarks if this file is executed directly
if (require.main === module) {
  runAllBenchmarks();
}
