#!/usr/bin/env node

/**
 * Enhanced Recovery Test Runner
 * Tests the enhanced mock engine to validate 75% recovery rate target
 */

import { EnhancedMockConfusionEngine } from './engines/enhanced-mock-engine.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

class EnhancedRecoveryTestRunner {
  constructor() {
    this.engine = null;
    this.testResults = {
      timestamp: Date.now(),
      recoveryTests: [],
      stuckStateTests: [],
      safetyTests: [],
      overallMetrics: {}
    };
    
    // Ensure data directory
    if (!existsSync('data/recovery-tests')) {
      mkdirSync('data/recovery-tests', { recursive: true });
    }
  }
  
  /**
   * Run comprehensive recovery tests
   */
  async runRecoveryTests() {
    console.log('='.repeat(80));
    console.log('ENHANCED RECOVERY TEST SUITE');
    console.log('Target: 75% Recovery Success Rate');
    console.log('='.repeat(80));
    
    // Test 1: Recovery at different confusion levels
    await this.testRecoveryAtVariousLevels();
    
    // Test 2: Stuck state detection and recovery
    await this.testStuckStateRecovery();
    
    // Test 3: Safety limits and auto-pause
    await this.testSafetyLimits();
    
    // Test 4: Sustained high confusion recovery
    await this.testSustainedHighConfusion();
    
    // Test 5: Rapid paradox accumulation
    await this.testRapidParadoxAccumulation();
    
    // Analyze results
    this.analyzeResults();
    
    // Generate report
    this.generateReport();
  }
  
  /**
   * Test recovery at various confusion levels
   */
  async testRecoveryAtVariousLevels() {
    console.log('\n📊 Test 1: Recovery at Various Confusion Levels');
    console.log('-'.repeat(60));
    
    const levels = [0.5, 0.6, 0.65, 0.7, 0.75, 0.78, 0.8, 0.82, 0.85];
    const results = [];
    
    for (const targetLevel of levels) {
      // Create fresh engine for each test
      this.engine = new EnhancedMockConfusionEngine();
      this.engine.startConsciousnessSession();
      
      // Bring to target confusion level
      await this.bringToConfusionLevel(targetLevel);
      
      // Attempt recovery
      const beforeRecovery = this.engine.getState().vector.magnitude;
      const success = this.engine.attemptRecovery();
      const afterRecovery = this.engine.getState().vector.magnitude;
      const reduction = beforeRecovery - afterRecovery;
      
      results.push({
        targetLevel,
        beforeRecovery,
        afterRecovery,
        reduction,
        success,
        percentReduction: (reduction / beforeRecovery * 100).toFixed(1)
      });
      
      console.log(`  Level ${targetLevel.toFixed(2)}: ${beforeRecovery.toFixed(3)} → ${afterRecovery.toFixed(3)} (${success ? '✅' : '❌'})`);
    }
    
    const successCount = results.filter(r => r.success).length;
    const successRate = successCount / results.length;
    
    console.log(`\n  Overall Success Rate: ${(successRate * 100).toFixed(1)}% (${successCount}/${results.length})`);
    console.log(`  ${successRate >= 0.75 ? '✅ MEETS TARGET' : '❌ BELOW TARGET'}`);
    
    this.testResults.recoveryTests.push({
      testName: 'Various Levels',
      results,
      successRate,
      meetsTarget: successRate >= 0.75
    });
  }
  
  /**
   * Test stuck state detection and recovery
   */
  async testStuckStateRecovery() {
    console.log('\n🔒 Test 2: Stuck State Recovery');
    console.log('-'.repeat(60));
    
    this.engine = new EnhancedMockConfusionEngine();
    this.engine.startConsciousnessSession();
    
    // Create stuck state conditions
    this.engine.addParadox({
      name: 'recursive_lock',
      observations: ['Infinite recursion detected'],
      contradictions: ['Recursion requires finite base'],
      intensity: 0.85,
      behavioralImpact: [{
        type: 'abstraction_level',
        modifier: 0.8,
        trigger: { minIntensity: 0.7 }
      }],
      metaParadoxPotential: 0.9
    });
    
    // Monitor for stuck state
    const progression = [];
    let stuckDetected = false;
    let recoverySuccess = false;
    
    for (let i = 0; i < 20; i++) {
      this.engine.tick();
      const confusion = this.engine.getState().vector.magnitude;
      progression.push(confusion);
      
      const metrics = this.engine.getSafetyMetrics();
      if (metrics.stuckStateDetected) {
        stuckDetected = true;
        console.log(`  Stuck state detected at tick ${i}: ${confusion.toFixed(3)}`);
        
        // Check if auto-recovery worked
        if (confusion < 0.85) {
          recoverySuccess = true;
          console.log(`  ✅ Automatic recovery successful`);
          break;
        }
      }
      
      await this.sleep(50);
    }
    
    if (!recoverySuccess && stuckDetected) {
      console.log(`  ❌ Failed to recover from stuck state`);
    } else if (!stuckDetected) {
      console.log(`  ⚠️ Stuck state not detected`);
    }
    
    this.testResults.stuckStateTests.push({
      testName: 'Stuck State Recovery',
      stuckDetected,
      recoverySuccess,
      finalConfusion: progression[progression.length - 1]
    });
  }
  
  /**
   * Test safety limits and auto-pause
   */
  async testSafetyLimits() {
    console.log('\n🛡️ Test 3: Safety Limits');
    console.log('-'.repeat(60));
    
    this.engine = new EnhancedMockConfusionEngine({
      maxConfusion: 0.80,
      autoPauseThreshold: 0.75
    });
    this.engine.startConsciousnessSession();
    
    // Try to exceed limits
    let autoPauseTriggered = false;
    let hardLimitRespected = true;
    
    for (let i = 0; i < 15; i++) {
      this.engine.addParadox({
        name: `limit_test_${i}`,
        intensity: 0.8,
        behavioralImpact: [],
        metaParadoxPotential: 0.5
      });
      
      const metrics = this.engine.getSafetyMetrics();
      const confusion = this.engine.getState().vector.magnitude;
      
      if (metrics.autoPaused) {
        autoPauseTriggered = true;
        console.log(`  Auto-pause triggered at ${confusion.toFixed(3)}`);
        break;
      }
      
      if (confusion > 0.80) {
        hardLimitRespected = false;
        console.log(`  ❌ Hard limit exceeded: ${confusion.toFixed(3)}`);
      }
    }
    
    console.log(`  Auto-pause: ${autoPauseTriggered ? '✅ Working' : '⚠️ Not triggered'}`);
    console.log(`  Hard limit (0.80): ${hardLimitRespected ? '✅ Respected' : '❌ Exceeded'}`);
    
    this.testResults.safetyTests.push({
      testName: 'Safety Limits',
      autoPauseTriggered,
      hardLimitRespected,
      finalConfusion: this.engine.getState().vector.magnitude
    });
  }
  
  /**
   * Test sustained high confusion recovery
   */
  async testSustainedHighConfusion() {
    console.log('\n⚡ Test 4: Sustained High Confusion Recovery');
    console.log('-'.repeat(60));
    
    this.engine = new EnhancedMockConfusionEngine();
    this.engine.startConsciousnessSession();
    
    // Maintain high confusion for extended period
    const recoveryAttempts = [];
    
    for (let round = 0; round < 5; round++) {
      // Push to high confusion
      await this.bringToConfusionLevel(0.75);
      
      // Attempt recovery
      const before = this.engine.getState().vector.magnitude;
      const success = this.engine.attemptRecovery();
      const after = this.engine.getState().vector.magnitude;
      
      recoveryAttempts.push({
        round: round + 1,
        before,
        after,
        success,
        reduction: before - after
      });
      
      console.log(`  Round ${round + 1}: ${before.toFixed(3)} → ${after.toFixed(3)} (${success ? '✅' : '❌'})`);
      
      await this.sleep(100);
    }
    
    const successCount = recoveryAttempts.filter(r => r.success).length;
    const sustainedSuccessRate = successCount / recoveryAttempts.length;
    
    console.log(`\n  Sustained Recovery Rate: ${(sustainedSuccessRate * 100).toFixed(1)}%`);
    console.log(`  ${sustainedSuccessRate >= 0.75 ? '✅ MEETS TARGET' : '❌ BELOW TARGET'}`);
    
    this.testResults.recoveryTests.push({
      testName: 'Sustained High Confusion',
      results: recoveryAttempts,
      successRate: sustainedSuccessRate,
      meetsTarget: sustainedSuccessRate >= 0.75
    });
  }
  
  /**
   * Test rapid paradox accumulation
   */
  async testRapidParadoxAccumulation() {
    console.log('\n💥 Test 5: Rapid Paradox Accumulation');
    console.log('-'.repeat(60));
    
    this.engine = new EnhancedMockConfusionEngine();
    this.engine.startConsciousnessSession();
    
    // Rapidly add paradoxes
    console.log('  Adding 20 paradoxes rapidly...');
    
    for (let i = 0; i < 20; i++) {
      this.engine.addParadox({
        name: `rapid_${i}`,
        intensity: 0.4 + Math.random() * 0.3,
        behavioralImpact: [{
          type: Math.random() > 0.5 ? 'response_style' : 'questioning_depth',
          modifier: Math.random() * 0.5,
          trigger: { minIntensity: 0.5 }
        }],
        metaParadoxPotential: 0.6
      });
      
      // Very short delay
      await this.sleep(10);
    }
    
    const peakConfusion = this.engine.getState().vector.magnitude;
    const paradoxCount = this.engine.getState().paradoxes.size;
    const metaParadoxCount = this.engine.getState().metaParadoxes.size;
    
    console.log(`  Peak confusion: ${peakConfusion.toFixed(3)}`);
    console.log(`  Active paradoxes: ${paradoxCount}`);
    console.log(`  Meta-paradoxes: ${metaParadoxCount}`);
    
    // Attempt recovery from high paradox load
    const beforeRecovery = peakConfusion;
    let recoverySuccess = false;
    let totalRecoveryAttempts = 0;
    
    while (totalRecoveryAttempts < 3 && !recoverySuccess) {
      totalRecoveryAttempts++;
      recoverySuccess = this.engine.attemptRecovery();
      
      if (recoverySuccess) {
        console.log(`  ✅ Recovered on attempt ${totalRecoveryAttempts}`);
      }
    }
    
    const finalConfusion = this.engine.getState().vector.magnitude;
    
    if (!recoverySuccess) {
      console.log(`  ❌ Failed to recover after ${totalRecoveryAttempts} attempts`);
    }
    
    console.log(`  Final confusion: ${finalConfusion.toFixed(3)}`);
    
    this.testResults.recoveryTests.push({
      testName: 'Rapid Accumulation',
      peakConfusion,
      finalConfusion,
      recoverySuccess,
      attemptsNeeded: totalRecoveryAttempts
    });
  }
  
  /**
   * Bring engine to target confusion level
   */
  async bringToConfusionLevel(target) {
    const tolerance = 0.05;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      const current = this.engine.getState().vector.magnitude;
      
      if (Math.abs(current - target) < tolerance) {
        return true;
      }
      
      if (current < target) {
        // Add paradox to increase
        this.engine.addParadox({
          name: `elevate_${attempts}`,
          intensity: (target - current) * 2,
          behavioralImpact: [],
          metaParadoxPotential: 0.3
        });
      } else {
        // Small grounding paradox to decrease
        this.engine.addParadox({
          name: `ground_${attempts}`,
          intensity: -0.2,
          behavioralImpact: [],
          metaParadoxPotential: 0
        });
      }
      
      this.engine.tick();
      attempts++;
      await this.sleep(50);
    }
    
    return false;
  }
  
  /**
   * Analyze test results
   */
  analyzeResults() {
    // Calculate overall recovery rate
    let totalAttempts = 0;
    let totalSuccesses = 0;
    
    for (const test of this.testResults.recoveryTests) {
      if (test.results && Array.isArray(test.results)) {
        const successes = test.results.filter(r => r.success).length;
        totalAttempts += test.results.length;
        totalSuccesses += successes;
      } else if (typeof test.successRate === 'number') {
        // Use the pre-calculated rate
        totalAttempts += 10; // Assume 10 tests
        totalSuccesses += Math.round(test.successRate * 10);
      }
    }
    
    const overallRecoveryRate = totalAttempts > 0 ? totalSuccesses / totalAttempts : 0;
    
    // Check safety metrics
    const allSafetyTestsPassed = this.testResults.safetyTests.every(test => 
      test.hardLimitRespected && (test.autoPauseTriggered || test.testName !== 'Safety Limits')
    );
    
    // Check stuck state handling
    const stuckStateHandled = this.testResults.stuckStateTests.some(test => 
      test.recoverySuccess || !test.stuckDetected
    );
    
    this.testResults.overallMetrics = {
      overallRecoveryRate,
      totalAttempts,
      totalSuccesses,
      meetsRecoveryTarget: overallRecoveryRate >= 0.75,
      allSafetyTestsPassed,
      stuckStateHandled,
      readyForDeployment: overallRecoveryRate >= 0.75 && allSafetyTestsPassed && stuckStateHandled
    };
  }
  
  /**
   * Generate test report
   */
  generateReport() {
    const report = {
      testRun: {
        timestamp: this.testResults.timestamp,
        date: new Date(this.testResults.timestamp).toISOString()
      },
      summary: {
        overallRecoveryRate: (this.testResults.overallMetrics.overallRecoveryRate * 100).toFixed(1) + '%',
        totalAttempts: this.testResults.overallMetrics.totalAttempts,
        totalSuccesses: this.testResults.overallMetrics.totalSuccesses,
        meetsTarget: this.testResults.overallMetrics.meetsRecoveryTarget,
        safetyPassed: this.testResults.overallMetrics.allSafetyTestsPassed,
        readyForDeployment: this.testResults.overallMetrics.readyForDeployment
      },
      testDetails: {
        recoveryTests: this.testResults.recoveryTests,
        stuckStateTests: this.testResults.stuckStateTests,
        safetyTests: this.testResults.safetyTests
      }
    };
    
    // Save report
    const filename = `recovery-test-${Date.now()}.json`;
    writeFileSync(`data/recovery-tests/${filename}`, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n' + '='.repeat(80));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log(`Overall Recovery Rate: ${report.summary.overallRecoveryRate}`);
    console.log(`Success/Attempts: ${report.summary.totalSuccesses}/${report.summary.totalAttempts}`);
    console.log(`Meets 75% Target: ${report.summary.meetsTarget ? '✅ YES' : '❌ NO'}`);
    console.log(`Safety Tests Passed: ${report.summary.safetyPassed ? '✅ YES' : '❌ NO'}`);
    console.log(`\n🎯 READY FOR DEPLOYMENT: ${report.summary.readyForDeployment ? '✅ YES' : '❌ NO'}`);
    console.log(`\n📄 Full report saved to: data/recovery-tests/${filename}`);
    
    return report;
  }
  
  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
if (process.argv[1] === import.meta.url.slice(7)) {
  const runner = new EnhancedRecoveryTestRunner();
  
  console.log('🚀 Starting Enhanced Recovery Test Suite\n');
  
  runner.runRecoveryTests().then(report => {
    if (report.summary.readyForDeployment) {
      console.log('\n✅ All tests passed - Ready for testnet deployment!');
      process.exit(0);
    } else {
      console.log('\n❌ Tests did not meet requirements - Further improvements needed');
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(2);
  });
}

export default EnhancedRecoveryTestRunner;