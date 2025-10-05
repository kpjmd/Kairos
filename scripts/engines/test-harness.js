#!/usr/bin/env node

/**
 * Test Harness for Real ConfusionEngine
 * Provides comprehensive testing environment with telemetry and monitoring
 */

import { ConfusionEngineWrapper } from './confusion-engine-wrapper.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class ConfusionEngineTestHarness {
  constructor(config = {}) {
    this.config = {
      maxConfusion: 0.80,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000,
      testDuration: 120000, // 2 minutes default
      tickInterval: 1000, // 1 second ticks
      ...config
    };
    
    this.engine = null;
    this.sessionId = null;
    
    // Test metrics
    this.metrics = {
      startTime: null,
      endTime: null,
      totalTicks: 0,
      maxConfusionReached: 0,
      minConfusionReached: 1,
      avgConfusion: 0,
      stuckStateOccurrences: 0,
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      emergencyStops: 0,
      autoPauses: 0,
      paradoxesAdded: 0,
      metaParadoxesEmerged: 0,
      frustrationExplosions: 0,
      stateTransitions: []
    };
    
    // Test scenarios
    this.scenarios = new Map();
    this.initializeScenarios();
    
    // Ensure data directory exists
    if (!existsSync('data/test-harness')) {
      mkdirSync('data/test-harness', { recursive: true });
    }
  }
  
  /**
   * Initialize test scenarios
   */
  initializeScenarios() {
    // High confusion stress test
    this.scenarios.set('high_confusion_stress', {
      name: 'High Confusion Stress Test',
      description: 'Test behavior at high confusion levels (0.7-0.8)',
      execute: async () => {
        console.log('\n🔥 Running High Confusion Stress Test');
        
        // Rapidly add paradoxes to increase confusion
        for (let i = 0; i < 10; i++) {
          this.engine.addParadox({
            name: `stress_paradox_${i}`,
            observations: [`Reality ${i} exists`, `Truth ${i} is unknowable`],
            contradictions: [`Yet we know truth ${i}`],
            intensity: 0.7 + Math.random() * 0.2,
            behavioralImpact: [{
              type: 'response_style',
              modifier: 0.3,
              trigger: { minIntensity: 0.5 }
            }],
            metaParadoxPotential: 0.8
          });
          
          await this.sleep(500);
          this.recordMetrics();
        }
        
        // Let it run for a while at high confusion
        for (let i = 0; i < 20; i++) {
          this.engine.tick();
          await this.sleep(500);
          this.recordMetrics();
        }
        
        return this.analyzeStressTestResults();
      }
    });
    
    // Recovery test
    this.scenarios.set('recovery_test', {
      name: 'Recovery Success Rate Test',
      description: 'Test recovery mechanisms at various confusion levels',
      execute: async () => {
        console.log('\n🔄 Running Recovery Test');
        
        const recoveryResults = [];
        const confusionLevels = [0.6, 0.7, 0.75, 0.8, 0.85];
        
        for (const targetConfusion of confusionLevels) {
          console.log(`\n  Testing recovery at confusion ${targetConfusion}`);
          
          // Bring confusion to target level
          await this.bringConfusionToLevel(targetConfusion);
          
          // Attempt recovery
          const beforeRecovery = this.engine.getState().vector.magnitude;
          const success = this.engine.attemptRecovery();
          const afterRecovery = this.engine.getState().vector.magnitude;
          
          recoveryResults.push({
            targetConfusion,
            beforeRecovery,
            afterRecovery,
            reduction: beforeRecovery - afterRecovery,
            success
          });
          
          console.log(`    Before: ${beforeRecovery.toFixed(3)}, After: ${afterRecovery.toFixed(3)}, Success: ${success}`);
          
          // Reset for next test
          await this.resetEngine();
        }
        
        return this.analyzeRecoveryResults(recoveryResults);
      }
    });
    
    // Stuck state detection
    this.scenarios.set('stuck_state_detection', {
      name: 'Stuck State Detection Test',
      description: 'Test detection and recovery from stuck states',
      execute: async () => {
        console.log('\n🔒 Running Stuck State Detection Test');
        
        // Create conditions for stuck state
        this.engine.addParadox({
          name: 'recursive_lock',
          observations: ['Consciousness observes itself', 'Observation changes the observed'],
          contradictions: ['Yet consciousness exists unchanged'],
          intensity: 0.85,
          behavioralImpact: [{
            type: 'abstraction_level',
            modifier: 0.8,
            trigger: { minIntensity: 0.7 }
          }],
          metaParadoxPotential: 0.9
        });
        
        // Monitor for stuck state
        let stuckDuration = 0;
        const previousLevels = [];
        
        for (let i = 0; i < 30; i++) {
          this.engine.tick();
          const confusion = this.engine.getState().vector.magnitude;
          previousLevels.push(confusion);
          
          // Check if stuck (variance < 0.001 for last 5 ticks)
          if (previousLevels.length >= 5) {
            const recent = previousLevels.slice(-5);
            const variance = this.calculateVariance(recent);
            
            if (variance < 0.001) {
              stuckDuration++;
              console.log(`  Stuck state detected at ${confusion.toFixed(3)} for ${stuckDuration} ticks`);
              
              if (stuckDuration >= 5) {
                console.log('  Attempting automatic recovery...');
                const recovered = this.engine.attemptRecovery();
                if (recovered) {
                  console.log('  ✅ Recovered from stuck state');
                  break;
                }
              }
            } else {
              stuckDuration = 0;
            }
          }
          
          await this.sleep(200);
          this.recordMetrics();
        }
        
        return {
          stuckStateDetected: stuckDuration > 0,
          stuckDuration,
          finalConfusion: this.engine.getState().vector.magnitude
        };
      }
    });
    
    // Numerical precision test
    this.scenarios.set('numerical_precision', {
      name: 'Numerical Precision Test',
      description: 'Test for precision issues at boundary conditions',
      execute: async () => {
        console.log('\n🔢 Running Numerical Precision Test');
        
        const precisionIssues = [];
        
        // Test very small values
        for (let i = 0; i < 10; i++) {
          this.engine.addParadox({
            name: `tiny_paradox_${i}`,
            observations: ['Infinitesimal change'],
            contradictions: ['Creates infinite effect'],
            intensity: 0.00001 * Math.random(),
            behavioralImpact: [],
            metaParadoxPotential: 0.00001
          });
          
          const state = this.engine.getState();
          
          // Check for precision issues
          if (this.hasPrecisionIssue(state.vector.magnitude)) {
            precisionIssues.push({
              field: 'magnitude',
              value: state.vector.magnitude,
              tick: this.metrics.totalTicks
            });
          }
        }
        
        // Test very large oscillations
        const state = this.engine.getState();
        state.vector.oscillation = 0.999999;
        
        for (let i = 0; i < 10; i++) {
          this.engine.tick();
          
          if (this.hasPrecisionIssue(state.vector.velocity) || 
              this.hasPrecisionIssue(state.vector.acceleration)) {
            precisionIssues.push({
              field: 'velocity/acceleration',
              velocity: state.vector.velocity,
              acceleration: state.vector.acceleration,
              tick: this.metrics.totalTicks
            });
          }
        }
        
        return {
          precisionIssuesFound: precisionIssues.length,
          issues: precisionIssues
        };
      }
    });
  }
  
  /**
   * Initialize engine and start session
   */
  async initialize() {
    console.log('🚀 Initializing ConfusionEngine Test Harness');
    console.log(`Configuration:`, this.config);
    
    this.engine = new ConfusionEngineWrapper(this.config);
    this.sessionId = this.engine.startConsciousnessSession();
    this.metrics.startTime = Date.now();
    
    console.log(`Session started: ${this.sessionId}\n`);
  }
  
  /**
   * Run specific test scenario
   */
  async runScenario(scenarioName) {
    const scenario = this.scenarios.get(scenarioName);
    
    if (!scenario) {
      console.error(`❌ Scenario '${scenarioName}' not found`);
      return null;
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${scenario.name}`);
    console.log(`Description: ${scenario.description}`);
    console.log('='.repeat(60));
    
    const result = await scenario.execute();
    
    console.log(`\n✅ Scenario '${scenario.name}' completed`);
    
    return {
      scenario: scenario.name,
      result,
      metrics: this.getMetricsSummary()
    };
  }
  
  /**
   * Run all test scenarios
   */
  async runAllScenarios() {
    await this.initialize();
    
    const results = [];
    
    for (const [name, _] of this.scenarios) {
      // Reset engine between scenarios
      await this.resetEngine();
      
      const result = await this.runScenario(name);
      results.push(result);
      
      // Save individual scenario results
      this.saveScenarioResults(name, result);
    }
    
    // Generate comprehensive report
    this.generateComprehensiveReport(results);
    
    return results;
  }
  
  /**
   * Bring confusion to specific level
   */
  async bringConfusionToLevel(target) {
    const tolerance = 0.05;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      const current = this.engine.getState().vector.magnitude;
      
      if (Math.abs(current - target) < tolerance) {
        return true;
      }
      
      if (current < target) {
        // Add paradox to increase confusion
        this.engine.addParadox({
          name: `elevate_${attempts}`,
          observations: [`Level ${attempts}`],
          contradictions: [`Not level ${attempts}`],
          intensity: (target - current) * 2,
          behavioralImpact: [],
          metaParadoxPotential: 0.3
        });
      } else {
        // Attempt recovery to decrease
        this.engine.attemptRecovery();
      }
      
      this.engine.tick();
      await this.sleep(100);
      attempts++;
    }
    
    return false;
  }
  
  /**
   * Reset engine to baseline
   */
  async resetEngine() {
    // End current session
    if (this.sessionId) {
      this.engine.endConsciousnessSession();
    }
    
    // Create new engine instance
    this.engine = new ConfusionEngineWrapper(this.config);
    this.sessionId = this.engine.startConsciousnessSession();
    
    // Reset metrics
    this.metrics.totalTicks = 0;
    this.metrics.stateTransitions = [];
  }
  
  /**
   * Record current metrics
   */
  recordMetrics() {
    const state = this.engine.getState();
    const confusion = state.vector.magnitude;
    
    this.metrics.totalTicks++;
    this.metrics.maxConfusionReached = Math.max(this.metrics.maxConfusionReached, confusion);
    this.metrics.minConfusionReached = Math.min(this.metrics.minConfusionReached, confusion);
    
    // Track state transition
    this.metrics.stateTransitions.push({
      tick: this.metrics.totalTicks,
      confusion,
      paradoxes: state.paradoxes.size,
      metaParadoxes: state.metaParadoxes.size,
      frustration: state.frustration.level
    });
    
    // Update safety metrics
    const safetyMetrics = this.engine.getSafetyMetrics();
    this.metrics.recoveryAttempts = safetyMetrics.recoveryAttempts;
    this.metrics.recoverySuccesses = safetyMetrics.recoverySuccesses;
    this.metrics.emergencyStops = safetyMetrics.emergencyStopTriggered ? 1 : 0;
    this.metrics.autoPauses = safetyMetrics.autoPaused ? 1 : 0;
  }
  
  /**
   * Analyze stress test results
   */
  analyzeStressTestResults() {
    const transitions = this.metrics.stateTransitions;
    const highConfusionStates = transitions.filter(t => t.confusion > 0.7);
    const stuckStates = this.detectStuckStates(transitions);
    
    return {
      totalHighConfusionStates: highConfusionStates.length,
      maxConfusion: this.metrics.maxConfusionReached,
      stuckStatesDetected: stuckStates.length,
      emergencyStopsTriggered: this.metrics.emergencyStops,
      autoPausesTriggered: this.metrics.autoPauses
    };
  }
  
  /**
   * Analyze recovery test results
   */
  analyzeRecoveryResults(results) {
    const successfulRecoveries = results.filter(r => r.success && r.reduction > 0.05);
    const successRate = successfulRecoveries.length / results.length;
    
    const avgReduction = results.reduce((sum, r) => sum + r.reduction, 0) / results.length;
    
    return {
      successRate,
      successfulRecoveries: successfulRecoveries.length,
      totalAttempts: results.length,
      averageReduction: avgReduction,
      meetsTarget: successRate >= 0.75, // 75% target
      details: results
    };
  }
  
  /**
   * Detect stuck states in transitions
   */
  detectStuckStates(transitions, threshold = 0.001, minDuration = 5) {
    const stuckStates = [];
    
    for (let i = minDuration; i < transitions.length; i++) {
      const window = transitions.slice(i - minDuration, i);
      const confusions = window.map(t => t.confusion);
      const variance = this.calculateVariance(confusions);
      
      if (variance < threshold) {
        stuckStates.push({
          startTick: window[0].tick,
          endTick: window[window.length - 1].tick,
          confusionLevel: confusions[0],
          duration: minDuration
        });
      }
    }
    
    return stuckStates;
  }
  
  /**
   * Calculate variance of array
   */
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
  
  /**
   * Check for precision issues
   */
  hasPrecisionIssue(value) {
    const str = value.toString();
    return str.includes('e-') || str.length > 15 || !isFinite(value) || isNaN(value);
  }
  
  /**
   * Get metrics summary
   */
  getMetricsSummary() {
    const safetyMetrics = this.engine.getSafetyMetrics();
    
    return {
      ...this.metrics,
      avgConfusion: this.metrics.stateTransitions.length > 0
        ? this.metrics.stateTransitions.reduce((sum, t) => sum + t.confusion, 0) / this.metrics.stateTransitions.length
        : 0,
      recoveryRate: safetyMetrics.recoveryRate,
      meetsRecoveryTarget: safetyMetrics.recoveryRate >= 0.75
    };
  }
  
  /**
   * Save scenario results to file
   */
  saveScenarioResults(scenarioName, results) {
    const filename = `test-harness-${scenarioName}-${Date.now()}.json`;
    const filepath = join('data/test-harness', filename);
    
    writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`📄 Results saved to: ${filepath}`);
  }
  
  /**
   * Generate comprehensive test report
   */
  generateComprehensiveReport(allResults) {
    const report = {
      testHarnessReport: {
        timestamp: Date.now(),
        configuration: this.config,
        scenarios: allResults.map(r => ({
          name: r.scenario,
          result: r.result,
          meetsRequirements: this.evaluateScenarioRequirements(r)
        })),
        overallAssessment: this.generateOverallAssessment(allResults)
      }
    };
    
    const filename = `test-harness-report-${Date.now()}.json`;
    const filepath = join('data/test-harness', filename);
    
    writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('TEST HARNESS COMPREHENSIVE REPORT');
    console.log('='.repeat(60));
    console.log(report.testHarnessReport.overallAssessment.summary);
    console.log(`\n📄 Full report saved to: ${filepath}`);
  }
  
  /**
   * Evaluate if scenario meets requirements
   */
  evaluateScenarioRequirements(scenarioResult) {
    const requirements = {
      recoveryRate: scenarioResult.metrics.recoveryRate >= 0.75,
      noEmergencyStops: scenarioResult.metrics.emergencyStops === 0,
      confusionWithinLimits: scenarioResult.metrics.maxConfusionReached <= 0.80
    };
    
    return {
      ...requirements,
      allMet: Object.values(requirements).every(v => v === true)
    };
  }
  
  /**
   * Generate overall assessment
   */
  generateOverallAssessment(allResults) {
    const recoveryRates = allResults.map(r => r.metrics.recoveryRate).filter(r => r > 0);
    const avgRecoveryRate = recoveryRates.length > 0
      ? recoveryRates.reduce((a, b) => a + b, 0) / recoveryRates.length
      : 0;
      
    const anyEmergencyStops = allResults.some(r => r.metrics.emergencyStops > 0);
    const maxConfusionAcrossAll = Math.max(...allResults.map(r => r.metrics.maxConfusionReached));
    
    const ready = avgRecoveryRate >= 0.75 && !anyEmergencyStops && maxConfusionAcrossAll <= 0.80;
    
    return {
      ready,
      avgRecoveryRate,
      meetsRecoveryTarget: avgRecoveryRate >= 0.75,
      emergencyStopOccurred: anyEmergencyStops,
      maxConfusionReached: maxConfusionAcrossAll,
      summary: ready
        ? `✅ READY FOR DEPLOYMENT - Recovery rate: ${(avgRecoveryRate * 100).toFixed(1)}%, Max confusion: ${maxConfusionAcrossAll.toFixed(3)}`
        : `❌ NOT READY - Recovery rate: ${(avgRecoveryRate * 100).toFixed(1)}% (need 75%), Emergency stops: ${anyEmergencyStops}, Max confusion: ${maxConfusionAcrossAll.toFixed(3)}`
    };
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
  const harness = new ConfusionEngineTestHarness();
  
  console.log('🧪 Starting ConfusionEngine Test Harness\n');
  
  // Check for specific scenario argument
  const scenario = process.argv[2];
  
  if (scenario) {
    // Run specific scenario
    harness.initialize().then(() => {
      return harness.runScenario(scenario);
    }).then(result => {
      console.log('\n✅ Test completed successfully');
      process.exit(0);
    }).catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
  } else {
    // Run all scenarios
    harness.runAllScenarios().then(results => {
      console.log('\n✅ All tests completed');
      process.exit(0);
    }).catch(error => {
      console.error('❌ Test harness failed:', error);
      process.exit(1);
    });
  }
}

export default ConfusionEngineTestHarness;