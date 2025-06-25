# NINO Validator Performance Benchmarks

This directory contains comprehensive performance benchmarks for the NINO validator package.

## Available Benchmarks

### 1. Full Performance Suite (`performance.js`)
```bash
npm run benchmark
```

Comprehensive benchmarking that includes:
- ✅ **Function Performance**: All core functions (validate, format, parse, generate)
- 📊 **Input Pattern Analysis**: Performance comparison across different input types
- 💾 **Memory Usage**: Memory consumption and leak detection
- 🔄 **Bulk Operations**: Realistic usage scenarios with large datasets
- 📈 **Statistical Analysis**: Detailed performance metrics and ratings

**Features:**
- High-resolution timing using `process.hrtime.bigint()`
- Memory usage tracking and delta calculation
- Warm-up iterations to ensure accurate measurements
- Performance ratings (Excellent/Good/Poor)
- Comprehensive reporting with insights

### 2. CI Benchmark Suite (`ci-benchmark.js`)
```bash
npm run benchmark:ci
```

Lightweight benchmarks suitable for CI/CD pipelines:
- ⚡ **Fast Execution**: Reduced iteration counts for quick feedback
- 🎯 **Performance Gates**: Automatic pass/fail based on thresholds
- 📋 **Essential Metrics**: Core performance indicators only
- 🚀 **CI-Friendly**: Exits with error codes for automated testing

**Thresholds:**
- Minimum acceptable: 1,000 operations/second
- Warning threshold: 10,000 operations/second
- Excellent threshold: 100,000 operations/second

### 3. Memory-Focused Benchmarks
```bash
npm run benchmark:memory
```

Enhanced benchmarks with garbage collection control:
- 🧠 **Memory Profiling**: Detailed memory usage analysis
- 🗑️ **GC Control**: Manual garbage collection for accurate measurements
- 📊 **Memory Leak Detection**: Identifies potential memory issues

## Understanding the Results

### Performance Metrics

- **Operations/second**: How many function calls can be executed per second
- **Time per operation**: Average time taken for a single function call (in microseconds)
- **Memory delta**: Memory usage change during benchmark execution

### Performance Ratings

| Rating | Operations/Second | Description |
|--------|------------------|-------------|
| 🟢 Excellent | ≥100,000 | Outstanding performance |
| 🟡 Good | ≥10,000 | Acceptable performance |
| 🔴 Poor | <10,000 | May need optimization |

### Typical Performance Expectations

Based on modern Node.js environments:

| Function | Expected Ops/Sec | Notes |
|----------|------------------|-------|
| `validateNINO` (valid) | 100,000+ | Fast path validation |
| `validateNINO` (invalid) | 80,000+ | May be slower due to error paths |
| `formatNINO` | 50,000+ | String manipulation overhead |
| `parseNINO` | 50,000+ | Object creation overhead |
| `generateRandomNINO` | 1,000+ | Crypto operations are slower |

## Running Benchmarks

### Local Development
```bash
# Run comprehensive benchmarks
npm run benchmark

# Quick CI-style check
npm run benchmark:ci

# Memory-focused analysis
npm run benchmark:memory
```

### Continuous Integration
The `benchmark:ci` script is automatically included in the `validate` npm script and will run during:
- Pre-publish checks
- CI/CD pipeline validation
- Local validation with `npm run validate`

## Interpreting Results

### Performance Insights
The benchmark suite provides automatic insights such as:
- Comparison between valid vs invalid input performance
- Memory efficiency analysis
- Performance consistency across different input patterns

### When to Investigate
Consider performance investigation if:
- Any function performs below 1,000 ops/sec
- Memory usage grows unexpectedly
- Performance degrades significantly between versions
- CI benchmarks fail consistently

### Optimization Tips
- Valid inputs typically perform faster than invalid ones
- Short-circuit validation can improve invalid input performance
- String operations may be optimized with different approaches
- Random generation performance depends on crypto operations

## Benchmark Architecture

### High-Resolution Timing
Uses `process.hrtime.bigint()` for nanosecond precision timing, ensuring accurate measurements even for very fast operations.

### Memory Tracking
Monitors `process.memoryUsage()` before and after operations to detect memory leaks and usage patterns.

### Statistical Accuracy
- Includes warm-up iterations to eliminate JIT compilation effects
- Uses large iteration counts for statistical significance
- Provides multiple metrics (ops/sec, time/op, memory usage)

### Realistic Testing
- Tests various input patterns (valid, invalid, edge cases)
- Includes bulk operations that mirror real-world usage
- Tests string processing scenarios with messy inputs

## Contributing

When adding new benchmarks:
1. Follow the existing pattern for function naming (`benchmark[FunctionName]`)
2. Include appropriate iteration counts for the test type
3. Add both individual and summary reporting
4. Consider memory implications of your tests
5. Update this README with new benchmark descriptions

## Troubleshooting

### Common Issues

**Benchmarks running slowly:**
- Reduce iteration counts in `ITERATIONS` configuration
- Check for background processes consuming CPU
- Ensure adequate system memory

**Inconsistent results:**
- Run multiple times and average results
- Check for system load during testing
- Consider using `--expose-gc` flag for memory tests

**CI failures:**
- Review performance thresholds in `ci-benchmark.js`
- Check for environment-specific performance characteristics
- Consider adjusting thresholds for slower CI environments 