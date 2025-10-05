#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { spawn, spawnSync } from 'child_process';
import { join } from 'path';

export class Phase2TestRunner {
  constructor() {
    this.tests = [
      {
        name: 'Safety Checks',
        script: 'phase-2-safety-checks.js',
        critical: true,
        timeout: 30000
      },
      {
        name: 'Farcaster Posts',
        script: 'test-farcaster-posts.js',
        critical: false,
        timeout: 60000
      },
      {
        name: 'Social Environment',
        script: 'social-environment-test.js',
        critical: true,
        timeout: 120000
      },
      {
        name: 'Confusion Recovery',
        script: 'test-confusion-recovery.js',
        critical: true,
        timeout: 90000
      },
      {
        name: 'Drift Monitoring',
        script: 'monitor-drift-realtime.js',
        args: ['--test-mode'],
        critical: true,
        timeout: 15000
      },
      {
        name: 'Emergency Reset',
        script: 'emergency-reset.js',
        args: ['--dry-run'],
        critical: true,
        timeout: 10000
      },
      {
        name: 'Testnet Deployment',
        script: 'testnet-phased-deployment.js',
        args: ['--simulate'],
        critical: false,
        timeout: 180000
      }
    ];
    
    this.results = {
      timestamp: Date.now(),
      tests_run: 0,
      tests_passed: 0,
      tests_failed: 0,
      critical_failures: 0,
      test_details: [],
      go_no_go: null,
      recommendations: []
    };
    
    this.benchmarks = {
      meta_paradox_baseline: 85900, // ms from Phase 1
      target_social_emergence: 60000, // Target for Phase 2
      max_drift_allowed: 0.25,
      max_confusion_allowed: 0.95
    };
  }

  async runAllTests() {
    console.log('='.repeat(80));
    console.log('KAIROS PHASE 2 - MASTER TEST RUNNER');
    console.log('='.repeat(80));
    console.log(`Start time: ${new Date().toISOString()}`);
    console.log(`Total tests: ${this.tests.length}`);
    console.log(`Isolation baseline: ${this.benchmarks.meta_paradox_baseline}ms`);
    console.log(`Target social emergence: ${this.benchmarks.target_social_emergence}ms\n`);
    
    // Ensure data directories exist
    this.ensureDataDirectories();
    
    // Run pre-flight checks
    const preFlightPassed = await this.runPreFlightChecks();
    if (!preFlightPassed) {
      console.log('\n❌ Pre-flight checks failed. Aborting test run.');
      this.results.go_no_go = 'NO-GO';
      this.generateTestReport();
      return false;
    }
    
    // Run each test in sequence
    for (const test of this.tests) {
      const testResult = await this.runTest(test);
      this.results.test_details.push(testResult);
      
      if (testResult.passed) {
        this.results.tests_passed++;
      } else {
        this.results.tests_failed++;
        if (test.critical) {
          this.results.critical_failures++;
        }
      }
      
      this.results.tests_run++;
      
      // Stop if critical test fails
      if (test.critical && !testResult.passed) {
        console.log(`\n🛑 Critical test "${test.name}" failed. Stopping test run.`);
        break;
      }
      
      // Add delay between tests
      await this.sleep(1000);
    }
    
    // Analyze results
    this.analyzeResults();
    
    // Make go/no-go decision
    this.makeGoNoGoDecision();
    
    // Generate comprehensive report
    this.generateTestReport();
    
    // Return success status
    return this.results.go_no_go === 'GO';
  }

  ensureDataDirectories() {
    const dirs = ['data', 'data/logs', 'data/backups', 'data/test-results'];
    
    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
  }

  async runPreFlightChecks() {
    console.log('🔍 Running pre-flight checks...\n');
    
    const checks = {
      node_version: false,
      bun_available: false,
      scripts_present: false,
      data_directories: false,
      baseline_file: false
    };
    
    // Check Node version
    const nodeVersion = process.version;
    checks.node_version = nodeVersion.startsWith('v20') || nodeVersion.startsWith('v21') || nodeVersion.startsWith('v22') || nodeVersion.startsWith('v23') || nodeVersion.startsWith('v24');
    console.log(`  Node.js version: ${nodeVersion} ${checks.node_version ? '✅' : '⚠️'}`);
    
    // Check Bun availability
    try {
      const bunCheck = spawnSync('bun', ['--version'], { encoding: 'utf8' });
      checks.bun_available = bunCheck.status === 0;
      console.log(`  Bun available: ${checks.bun_available ? '✅' : '⚠️  (optional)'}`);
    } catch {
      console.log('  Bun available: ⚠️  (optional)');
    }
    
    // Check all test scripts exist
    let allScriptsPresent = true;
    for (const test of this.tests) {
      const scriptPath = join('scripts', test.script);
      if (!existsSync(scriptPath)) {
        allScriptsPresent = false;
        console.log(`  Missing script: ${test.script} ❌`);
      }
    }
    checks.scripts_present = allScriptsPresent;
    console.log(`  All test scripts present: ${checks.scripts_present ? '✅' : '❌'}`);
    
    // Check data directories
    checks.data_directories = existsSync('data');
    console.log(`  Data directories: ${checks.data_directories ? '✅' : '❌'}`);
    
    // Check for baseline file
    checks.baseline_file = existsSync('data/personality-baseline.json');
    console.log(`  Baseline file: ${checks.baseline_file ? '✅' : '⚠️  (will be created)'}`);
    
    // Determine if we can proceed
    const canProceed = checks.node_version && checks.scripts_present && checks.data_directories;
    
    console.log(`\nPre-flight status: ${canProceed ? '✅ READY' : '❌ NOT READY'}`);
    
    return canProceed;
  }

  async runTest(test) {
    console.log('\n' + '-'.repeat(60));
    console.log(`Running: ${test.name}`);
    console.log('-'.repeat(60));
    
    const startTime = Date.now();
    const result = {
      name: test.name,
      script: test.script,
      started_at: startTime,
      ended_at: null,
      duration: null,
      passed: false,
      output: '',
      error: null,
      metrics: {}
    };
    
    try {
      const scriptPath = join('scripts', test.script);
      const args = test.args || [];
      
      // Run the test with timeout
      const testProcess = spawnSync('node', [scriptPath, ...args], {
        timeout: test.timeout,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      result.ended_at = Date.now();
      result.duration = result.ended_at - startTime;
      
      // Capture output
      result.output = testProcess.stdout || '';
      
      if (testProcess.error) {
        result.error = testProcess.error.message;
        console.log(`  ❌ Error: ${result.error}`);
      } else if (testProcess.status !== 0 && testProcess.status !== null) {
        result.error = `Exit code: ${testProcess.status}`;
        console.log(`  ❌ Failed with exit code: ${testProcess.status}`);
        if (testProcess.stderr) {
          console.log(`  Error output: ${testProcess.stderr.slice(0, 200)}`);
        }
      } else {
        result.passed = true;
        console.log(`  ✅ Passed in ${result.duration}ms`);
        
        // Extract metrics from output if available
        this.extractMetrics(result);
      }
      
    } catch (error) {
      result.ended_at = Date.now();
      result.duration = result.ended_at - startTime;
      result.error = error.message;
      console.log(`  ❌ Exception: ${error.message}`);
    }
    
    return result;
  }

  extractMetrics(result) {
    const output = result.output;
    
    // Extract emergence timing
    const emergenceMatch = output.match(/First meta-paradox at (\d+)ms/);
    if (emergenceMatch) {
      result.metrics.emergence_time = parseInt(emergenceMatch[1]);
      console.log(`  📊 Emergence time: ${result.metrics.emergence_time}ms`);
    }
    
    // Extract confusion levels
    const confusionMatch = output.match(/Confusion level: ([\d.]+)/);
    if (confusionMatch) {
      result.metrics.final_confusion = parseFloat(confusionMatch[1]);
      console.log(`  📊 Final confusion: ${result.metrics.final_confusion}`);
    }
    
    // Extract drift
    const driftMatch = output.match(/overall_drift: ([\d.]+)/);
    if (driftMatch) {
      result.metrics.max_drift = parseFloat(driftMatch[1]);
      console.log(`  📊 Max drift: ${result.metrics.max_drift}`);
    }
    
    // Extract stability score
    const stabilityMatch = output.match(/Stability score: ([\d.]+)/);
    if (stabilityMatch) {
      result.metrics.stability = parseFloat(stabilityMatch[1]);
      console.log(`  📊 Stability: ${result.metrics.stability}`);
    }
  }

  analyzeResults() {
    console.log('\n' + '='.repeat(60));
    console.log('ANALYZING RESULTS');
    console.log('='.repeat(60));
    
    // Check emergence timing
    const socialTest = this.results.test_details.find(t => t.name === 'Social Environment');
    if (socialTest && socialTest.metrics.emergence_time) {
      const improvement = this.benchmarks.meta_paradox_baseline - socialTest.metrics.emergence_time;
      
      if (improvement > 0) {
        console.log(`\n✨ META-PARADOX ACCELERATION ACHIEVED!`);
        console.log(`  Isolation baseline: ${this.benchmarks.meta_paradox_baseline}ms`);
        console.log(`  Social emergence: ${socialTest.metrics.emergence_time}ms`);
        console.log(`  Improvement: ${improvement}ms (${(improvement / this.benchmarks.meta_paradox_baseline * 100).toFixed(1)}%)`);
        
        this.results.recommendations.push(
          `Outstanding: Social interactions accelerated consciousness emergence by ${improvement}ms`
        );
      } else {
        console.log(`\n⚠️  Social emergence slower than baseline by ${Math.abs(improvement)}ms`);
        this.results.recommendations.push(
          'Investigate why social interactions slowed consciousness emergence'
        );
      }
    }
    
    // Check drift levels
    const maxDrift = Math.max(...this.results.test_details
      .filter(t => t.metrics.max_drift)
      .map(t => t.metrics.max_drift));
    
    if (maxDrift > this.benchmarks.max_drift_allowed) {
      console.log(`\n⚠️  Maximum drift (${maxDrift.toFixed(3)}) exceeds threshold (${this.benchmarks.max_drift_allowed})`);
      this.results.recommendations.push(
        'Implement stronger drift mitigation before deployment'
      );
    }
    
    // Check stability
    const avgStability = this.results.test_details
      .filter(t => t.metrics.stability)
      .reduce((sum, t) => sum + t.metrics.stability, 0) / 
      this.results.test_details.filter(t => t.metrics.stability).length;
    
    if (avgStability && avgStability < 0.7) {
      console.log(`\n⚠️  Average stability (${avgStability.toFixed(2)}) below recommended threshold`);
      this.results.recommendations.push(
        'Improve system stability before public deployment'
      );
    }
  }

  makeGoNoGoDecision() {
    console.log('\n' + '='.repeat(60));
    console.log('GO/NO-GO DECISION');
    console.log('='.repeat(60));
    
    const criteria = {
      no_critical_failures: this.results.critical_failures === 0,
      emergence_achieved: false,
      drift_controlled: true,
      safety_systems_operational: false
    };
    
    // Check emergence
    const socialTest = this.results.test_details.find(t => t.name === 'Social Environment');
    if (socialTest && socialTest.metrics.emergence_time) {
      criteria.emergence_achieved = socialTest.metrics.emergence_time < this.benchmarks.meta_paradox_baseline;
    }
    
    // Check drift
    const maxDrift = Math.max(...this.results.test_details
      .filter(t => t.metrics.max_drift)
      .map(t => t.metrics.max_drift) || [0]);
    criteria.drift_controlled = maxDrift <= this.benchmarks.max_drift_allowed;
    
    // Check safety systems
    const safetyTest = this.results.test_details.find(t => t.name === 'Safety Checks');
    const emergencyTest = this.results.test_details.find(t => t.name === 'Emergency Reset');
    criteria.safety_systems_operational = (safetyTest?.passed && emergencyTest?.passed) || false;
    
    // Display criteria
    console.log('\nCriteria Assessment:');
    Object.entries(criteria).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').toUpperCase();
      console.log(`  ${label}: ${value ? '✅' : '❌'}`);
    });
    
    // Make decision
    const allCriteriaMet = Object.values(criteria).every(v => v === true);
    
    if (allCriteriaMet) {
      this.results.go_no_go = 'GO';
      console.log('\n🚀 DECISION: GO FOR DEPLOYMENT');
      console.log('All criteria met. System ready for testnet deployment.');
    } else if (criteria.no_critical_failures && criteria.safety_systems_operational) {
      this.results.go_no_go = 'CONDITIONAL-GO';
      console.log('\n⚠️  DECISION: CONDITIONAL GO');
      console.log('Deploy with caution and enhanced monitoring.');
    } else {
      this.results.go_no_go = 'NO-GO';
      console.log('\n🛑 DECISION: NO-GO');
      console.log('Critical issues must be resolved before deployment.');
    }
  }

  generateTestReport() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST REPORT SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`\n📊 Test Statistics:`);
    console.log(`  Total tests run: ${this.results.tests_run}`);
    console.log(`  Tests passed: ${this.results.tests_passed}`);
    console.log(`  Tests failed: ${this.results.tests_failed}`);
    console.log(`  Critical failures: ${this.results.critical_failures}`);
    
    console.log(`\n⏱️  Performance Benchmarks:`);
    console.log(`  Phase 1 baseline: ${this.benchmarks.meta_paradox_baseline}ms`);
    console.log(`  Phase 2 target: ${this.benchmarks.target_social_emergence}ms`);
    
    const socialTest = this.results.test_details.find(t => t.name === 'Social Environment');
    if (socialTest?.metrics.emergence_time) {
      console.log(`  Phase 2 actual: ${socialTest.metrics.emergence_time}ms`);
    }
    
    if (this.results.recommendations.length > 0) {
      console.log(`\n📝 Recommendations:`);
      this.results.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
    }
    
    console.log(`\n🎯 Final Decision: ${this.results.go_no_go}`);
    
    // Save detailed report
    const fullReport = {
      summary: {
        timestamp: this.results.timestamp,
        decision: this.results.go_no_go,
        tests_run: this.results.tests_run,
        tests_passed: this.results.tests_passed,
        tests_failed: this.results.tests_failed,
        critical_failures: this.results.critical_failures
      },
      benchmarks: this.benchmarks,
      test_details: this.results.test_details,
      recommendations: this.results.recommendations,
      generated_at: Date.now()
    };
    
    writeFileSync(
      'data/phase-2-test-report.json',
      JSON.stringify(fullReport, null, 2)
    );
    
    console.log('\n📄 Detailed report saved to: data/phase-2-test-report.json');
    console.log('='.repeat(80));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
if (process.argv[1] === import.meta.url.slice(7)) {
  const runner = new Phase2TestRunner();
  
  console.log('🚀 Starting Phase 2 test suite...\n');
  
  runner.runAllTests().then(success => {
    if (success) {
      console.log('\n✅ Phase 2 testing completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Phase 2 testing failed or requires investigation');
      process.exit(1);
    }
  }).catch(error => {
    console.error('\n🚨 Fatal error during test execution:', error);
    process.exit(2);
  });
}

export default Phase2TestRunner;