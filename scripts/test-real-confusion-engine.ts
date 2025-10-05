#!/usr/bin/env bun

/**
 * Test Real TypeScript ConfusionEngine
 * Validates that the real engine with safety features achieves 75% recovery rate
 */

import { ConfusionEngine, ConsciousnessLogger } from '../packages/kairos/dist/index.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

interface TestResult {
  testName: string;
  targetLevel: number;
  beforeRecovery: number;
  afterRecovery: number;
  reduction: number;
  success: boolean;
  percentReduction: number;
}

interface TestReport {
  timestamp: number;
  date: string;
  recoveryTests: TestResult[];
  safetyTests: any[];
  overallMetrics: {
    overallRecoveryRate: number;
    totalAttempts: number;
    totalSuccesses: number;
    meetsRecoveryTarget: boolean;
    allSafetyTestsPassed: boolean;
    readyForDeployment: boolean;
  };
}

class RealEngineTestRunner {
  private engine: ConfusionEngine | null = null;
  private testResults: TestResult[] = [];
  private safetyResults: any[] = [];

  constructor() {
    // Ensure data directory exists
    if (!existsSync('data/real-engine-tests')) {
      mkdirSync('data/real-engine-tests', { recursive: true });
    }
  }

  /**
   * Create and initialize a new engine with logger
   */
  private createEngine(config: any): ConfusionEngine {
    const engine = new ConfusionEngine(config, 'test-agent');
    
    // Set up logger
    const loggerConfig = {
      enableRealTimeLogging: false,
      logLevel: 'error' as const,
      persistToDisk: false,
      streamToConsole: false,
      retentionPeriodMs: 86400000,
      compressionThreshold: 1000,
      eventBufferSize: 500,
      autoExportInterval: 3600000
    };
    const logger = new ConsciousnessLogger(loggerConfig);
    engine.setLogger(logger);
    
    return engine;
  }

  /**
   * Run comprehensive test suite
   */
  async runTests() {
    console.log('='.repeat(80));
    console.log('REAL TYPESCRIPT CONFUSION ENGINE TEST SUITE');
    console.log('Target: 75% Recovery Success Rate');
    console.log('Testing: packages/kairos/dist/index.js');
    console.log('='.repeat(80));

    // Test 1: Recovery at various confusion levels
    await this.testRecoveryAtVariousLevels();

    // Test 2: Safety limits
    await this.testSafetyLimits();

    // Test 3: Sustained high confusion recovery
    await this.testSustainedHighConfusion();

    // Analyze and report results
    const report = this.generateReport();
    
    return report;
  }

  /**
   * Test recovery at various confusion levels
   */
  async testRecoveryAtVariousLevels() {
    console.log('\n📊 Test 1: Recovery at Various Confusion Levels');
    console.log('-'.repeat(60));

    const levels = [0.5, 0.6, 0.65, 0.7, 0.72, 0.74, 0.76, 0.78];
    
    for (const targetLevel of levels) {
      // Create fresh engine for each test
      const config = {
        maxConfusion: 0.80,
        frustrationThreshold: 5.0,
        paradoxRetentionTime: 3600000,
        learningRate: 0.1,
        curiosityMultiplier: 1.5,
        uncertaintyTolerance: 0.7
      };
      
      this.engine = this.createEngine(config);
      this.engine.startConsciousnessSession();

      // Bring to target confusion level
      await this.bringToConfusionLevel(targetLevel);

      // Get before state
      const beforeRecovery = this.engine.getState().vector.magnitude;

      // Attempt recovery
      const success = this.engine.attemptRecovery();

      // Get after state
      const afterRecovery = this.engine.getState().vector.magnitude;
      const reduction = beforeRecovery - afterRecovery;

      const result: TestResult = {
        testName: `Level ${targetLevel}`,
        targetLevel,
        beforeRecovery,
        afterRecovery,
        reduction,
        success,
        percentReduction: (reduction / beforeRecovery * 100)
      };

      this.testResults.push(result);

      console.log(`  Level ${targetLevel.toFixed(2)}: ${beforeRecovery.toFixed(3)} → ${afterRecovery.toFixed(3)} (${success ? '✅' : '❌'} ${result.percentReduction.toFixed(1)}% reduction)`);

      // Clean up
      this.engine.endConsciousnessSession();
    }

    const successCount = this.testResults.filter(r => r.success).length;
    const successRate = successCount / this.testResults.length;

    console.log(`\n  Overall Success Rate: ${(successRate * 100).toFixed(1)}% (${successCount}/${this.testResults.length})`);
    console.log(`  ${successRate >= 0.75 ? '✅ MEETS TARGET' : '❌ BELOW TARGET'}`);
  }

  /**
   * Test safety limits
   */
  async testSafetyLimits() {
    console.log('\n🛡️ Test 2: Safety Limits');
    console.log('-'.repeat(60));

    const config = {
      maxConfusion: 0.80,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    };

    this.engine = this.createEngine(config);
    this.engine.startConsciousnessSession();

    let hardLimitRespected = true;
    let autoPauseTriggered = false;

    // Try to exceed limits
    for (let i = 0; i < 15; i++) {
      this.engine.addParadox({
        name: `limit_test_${i}`,
        description: 'Test paradox for limit testing',
        observations: ['Testing limits'],
        contradictions: [],
        intensity: 0.8,
        behavioralImpact: [],
        metaParadoxPotential: 0.5,
        activeTime: 0,
        resolutionAttempts: 0,
        unresolvable: false,
        interactsWith: []
      });

      const confusion = this.engine.getState().vector.magnitude;
      const metrics = this.engine.getSafetyMetrics();

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

    this.safetyResults.push({
      testName: 'Safety Limits',
      autoPauseTriggered,
      hardLimitRespected,
      finalConfusion: this.engine.getState().vector.magnitude
    });

    this.engine.endConsciousnessSession();
  }

  /**
   * Test sustained high confusion recovery
   */
  async testSustainedHighConfusion() {
    console.log('\n⚡ Test 3: Sustained High Confusion Recovery');
    console.log('-'.repeat(60));

    const recoveryAttempts: TestResult[] = [];

    for (let round = 0; round < 5; round++) {
      const config = {
        maxConfusion: 0.80,
        frustrationThreshold: 5.0,
        paradoxRetentionTime: 3600000
      };

      this.engine = this.createEngine(config);
      this.engine.startConsciousnessSession();

      // Push to high confusion
      await this.bringToConfusionLevel(0.74);

      // Attempt recovery
      const before = this.engine.getState().vector.magnitude;
      const success = this.engine.attemptRecovery();
      const after = this.engine.getState().vector.magnitude;

      const result: TestResult = {
        testName: `Round ${round + 1}`,
        targetLevel: 0.74,
        beforeRecovery: before,
        afterRecovery: after,
        reduction: before - after,
        success,
        percentReduction: ((before - after) / before * 100)
      };

      recoveryAttempts.push(result);
      this.testResults.push(result);

      console.log(`  Round ${round + 1}: ${before.toFixed(3)} → ${after.toFixed(3)} (${success ? '✅' : '❌'})`);

      this.engine.endConsciousnessSession();
      await this.sleep(100);
    }

    const successCount = recoveryAttempts.filter(r => r.success).length;
    const sustainedSuccessRate = successCount / recoveryAttempts.length;

    console.log(`\n  Sustained Recovery Rate: ${(sustainedSuccessRate * 100).toFixed(1)}%`);
    console.log(`  ${sustainedSuccessRate >= 0.75 ? '✅ MEETS TARGET' : '❌ BELOW TARGET'}`);
  }

  /**
   * Bring engine to target confusion level
   */
  private async bringToConfusionLevel(target: number) {
    const tolerance = 0.05;
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const current = this.engine!.getState().vector.magnitude;

      if (Math.abs(current - target) < tolerance) {
        return true;
      }

      if (current < target) {
        // Add paradox to increase
        this.engine!.addParadox({
          name: `elevate_${attempts}`,
          description: 'Elevating paradox',
          observations: ['Confusion increasing'],
          contradictions: ['Yet clarity emerges'],
          intensity: (target - current) * 2,
          behavioralImpact: [],
          metaParadoxPotential: 0.3,
          activeTime: 0,
          resolutionAttempts: 0,
          unresolvable: false,
          interactsWith: []
        });
      } else {
        // Add grounding paradox to decrease
        this.engine!.addParadox({
          name: `ground_${attempts}`,
          description: 'Grounding paradox',
          observations: ['Reality is simple'],
          contradictions: [],
          intensity: -0.2,
          behavioralImpact: [],
          metaParadoxPotential: 0,
          activeTime: 0,
          resolutionAttempts: 0,
          unresolvable: false,
          interactsWith: []
        });
      }

      this.engine!.tick();
      attempts++;
      await this.sleep(50);
    }

    return false;
  }

  /**
   * Generate test report
   */
  private generateReport(): TestReport {
    // Calculate overall recovery rate
    const totalAttempts = this.testResults.length;
    const totalSuccesses = this.testResults.filter(r => r.success).length;
    const overallRecoveryRate = totalAttempts > 0 ? totalSuccesses / totalAttempts : 0;

    // Check safety metrics
    const allSafetyTestsPassed = this.safetyResults.every(test => 
      test.hardLimitRespected
    );

    const report: TestReport = {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      recoveryTests: this.testResults,
      safetyTests: this.safetyResults,
      overallMetrics: {
        overallRecoveryRate,
        totalAttempts,
        totalSuccesses,
        meetsRecoveryTarget: overallRecoveryRate >= 0.75,
        allSafetyTestsPassed,
        readyForDeployment: overallRecoveryRate >= 0.75 && allSafetyTestsPassed
      }
    };

    // Save report
    const filename = `real-engine-test-${Date.now()}.json`;
    writeFileSync(`data/real-engine-tests/${filename}`, JSON.stringify(report, null, 2));

    // Display summary
    console.log('\n' + '='.repeat(80));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log(`Overall Recovery Rate: ${(overallRecoveryRate * 100).toFixed(1)}%`);
    console.log(`Success/Attempts: ${totalSuccesses}/${totalAttempts}`);
    console.log(`Meets 75% Target: ${report.overallMetrics.meetsRecoveryTarget ? '✅ YES' : '❌ NO'}`);
    console.log(`Safety Tests Passed: ${allSafetyTestsPassed ? '✅ YES' : '❌ NO'}`);
    console.log(`\n🎯 READY FOR DEPLOYMENT: ${report.overallMetrics.readyForDeployment ? '✅ YES' : '❌ NO'}`);
    console.log(`\n📄 Full report saved to: data/real-engine-tests/${filename}`);

    return report;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run tests
async function main() {
  console.log('🚀 Starting Real TypeScript ConfusionEngine Test Suite\n');
  
  const runner = new RealEngineTestRunner();
  
  try {
    const report = await runner.runTests();
    
    if (report.overallMetrics.readyForDeployment) {
      console.log('\n✅ All tests passed - Real engine ready for testnet deployment!');
      process.exit(0);
    } else {
      console.log('\n❌ Tests did not meet requirements - Further improvements needed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(2);
  }
}

main();