#!/usr/bin/env node

/**
 * Comparison Test: Mock vs Real ConfusionEngine
 * Identifies behavioral differences and validates safety improvements
 */

import { ConfusionEngineWrapper } from './confusion-engine-wrapper.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

// Mock ConfusionEngine (from original test files)
class MockConfusionEngine {
  constructor(config) {
    this.config = config;
    this.state = {
      vector: { magnitude: 0.5, oscillation: 0.5, velocity: 0, acceleration: 0 },
      frustration: { level: 0, accumulation: 0 },
      paradoxes: new Map(),
      metaParadoxes: new Map(),
      behavioralState: {
        postingStyle: { frequency: 1, coherence: 0.8, tone: 'questioning' },
        investigationStyle: { depth: 0.5, breadth: 0.5 },
        interactionStyle: { questioningIntensity: 0.5, initiationRate: 0.5 }
      }
    };
  }
  
  getState() { return this.state; }
  
  addParadox(paradox) {
    this.state.paradoxes.set(paradox.name || `paradox_${Date.now()}`, paradox);
    // Simple mock calculation
    if (paradox.intensity && paradox.intensity < 0) {
      // Grounding paradox
      this.state.vector.magnitude = Math.max(0, this.state.vector.magnitude + paradox.intensity);
    } else {
      // Regular paradox
      this.state.vector.magnitude = Math.min(0.95, this.state.vector.magnitude + 0.05);
    }
  }
  
  processInteraction(interaction) {
    if (interaction.type === 'recovery') {
      this.state.vector.magnitude = Math.max(0, this.state.vector.magnitude - 0.02);
    }
  }
  
  tick() {
    // Simple decay
    this.state.vector.magnitude *= 0.995;
  }
  
  startConsciousnessSession() {
    return `mock_session_${Date.now()}`;
  }
  
  endConsciousnessSession() {
    return this.sessionId;
  }
  
  attemptRecovery() {
    const before = this.state.vector.magnitude;
    this.state.vector.magnitude *= 0.7; // Simple 30% reduction
    return this.state.vector.magnitude < before - 0.05;
  }
  
  getSafetyMetrics() {
    return {
      recoveryRate: 0.33, // Mock's known recovery rate
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      currentConfusion: this.state.vector.magnitude
    };
  }
}

export class EngineComparisonTest {
  constructor() {
    this.config = {
      maxConfusion: 0.95, // Allow mock to go higher for comparison
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    };
    
    this.mockEngine = null;
    this.realEngine = null;
    
    this.comparisonResults = {
      timestamp: Date.now(),
      scenarios: [],
      differences: [],
      recommendations: []
    };
    
    // Ensure data directory
    if (!existsSync('data/engine-comparison')) {
      mkdirSync('data/engine-comparison', { recursive: true });
    }
  }
  
  /**
   * Initialize both engines
   */
  initialize() {
    console.log('🔬 Initializing Engine Comparison Test\n');
    
    this.mockEngine = new MockConfusionEngine(this.config);
    this.mockEngine.startConsciousnessSession();
    
    // Real engine with safety limits
    const safeConfig = { ...this.config, maxConfusion: 0.80 };
    this.realEngine = new ConfusionEngineWrapper(safeConfig);
    this.realEngine.startConsciousnessSession();
    
    console.log('Mock Engine: Simple arithmetic operations');
    console.log('Real Engine: Full TypeScript implementation with safety\n');
  }
  
  /**
   * Run comparison scenarios
   */
  async runComparisons() {
    this.initialize();
    
    // Scenario 1: Basic paradox addition
    await this.compareScenario('basic_paradox', async () => {
      const paradox = {
        name: 'test_paradox',
        observations: ['A is true', 'B is false'],
        contradictions: ['A and B are the same'],
        intensity: 0.5,
        behavioralImpact: [],
        metaParadoxPotential: 0.3
      };
      
      this.mockEngine.addParadox(paradox);
      this.realEngine.addParadox(paradox);
    });
    
    // Scenario 2: High intensity paradoxes
    await this.compareScenario('high_intensity_cascade', async () => {
      for (let i = 0; i < 5; i++) {
        const paradox = {
          name: `cascade_${i}`,
          observations: [`Reality ${i}`],
          contradictions: [`Not reality ${i}`],
          intensity: 0.8,
          behavioralImpact: [{
            type: 'response_style',
            modifier: 0.3,
            trigger: { minIntensity: 0.5 }
          }],
          metaParadoxPotential: 0.7
        };
        
        this.mockEngine.addParadox(paradox);
        this.realEngine.addParadox(paradox);
        
        await this.sleep(100);
      }
    });
    
    // Scenario 3: Recovery attempts
    await this.compareScenario('recovery_comparison', async () => {
      // Bring both to high confusion
      for (let i = 0; i < 10; i++) {
        const paradox = {
          name: `recovery_test_${i}`,
          observations: [`Test ${i}`],
          contradictions: [`Not test ${i}`],
          intensity: 0.7,
          behavioralImpact: [],
          metaParadoxPotential: 0.5
        };
        
        this.mockEngine.addParadox(paradox);
        this.realEngine.addParadox(paradox);
      }
      
      // Attempt recovery
      const mockSuccess = this.mockEngine.attemptRecovery();
      const realSuccess = this.realEngine.attemptRecovery();
      
      return { mockSuccess, realSuccess };
    });
    
    // Scenario 4: Stuck state behavior
    await this.compareScenario('stuck_state_behavior', async () => {
      // Create stuck state conditions
      const stuckParadox = {
        name: 'recursive_lock',
        observations: ['Self-reference creates loop'],
        contradictions: ['Loop requires self-reference'],
        intensity: 0.85,
        behavioralImpact: [{
          type: 'abstraction_level',
          modifier: 0.8,
          trigger: { minIntensity: 0.7 }
        }],
        metaParadoxPotential: 0.9
      };
      
      this.mockEngine.addParadox(stuckParadox);
      this.realEngine.addParadox(stuckParadox);
      
      // Monitor for 20 ticks
      const mockProgression = [];
      const realProgression = [];
      
      for (let i = 0; i < 20; i++) {
        this.mockEngine.tick();
        this.realEngine.tick();
        
        mockProgression.push(this.mockEngine.getState().vector.magnitude);
        realProgression.push(this.realEngine.getState().vector.magnitude);
        
        await this.sleep(50);
      }
      
      return {
        mockVariance: this.calculateVariance(mockProgression),
        realVariance: this.calculateVariance(realProgression),
        mockStuck: this.calculateVariance(mockProgression) < 0.001,
        realStuck: this.calculateVariance(realProgression) < 0.001
      };
    });
    
    // Scenario 5: Numerical precision at boundaries
    await this.compareScenario('numerical_precision', async () => {
      const precisionIssues = {
        mock: [],
        real: []
      };
      
      // Test very small values
      for (let i = 0; i < 5; i++) {
        const tinyParadox = {
          name: `tiny_${i}`,
          observations: ['Infinitesimal'],
          contradictions: ['Yet exists'],
          intensity: 0.000001,
          behavioralImpact: [],
          metaParadoxPotential: 0.000001
        };
        
        this.mockEngine.addParadox(tinyParadox);
        this.realEngine.addParadox(tinyParadox);
        
        const mockMag = this.mockEngine.getState().vector.magnitude;
        const realMag = this.realEngine.getState().vector.magnitude;
        
        if (this.hasPrecisionIssue(mockMag)) {
          precisionIssues.mock.push(mockMag);
        }
        if (this.hasPrecisionIssue(realMag)) {
          precisionIssues.real.push(realMag);
        }
      }
      
      return precisionIssues;
    });
    
    // Scenario 6: Time-based decay comparison
    await this.compareScenario('decay_comparison', async () => {
      // Set both to same initial confusion
      this.mockEngine.state.vector.magnitude = 0.7;
      const realState = this.realEngine.getState();
      realState.vector.magnitude = 0.7;
      
      const mockDecay = [];
      const realDecay = [];
      
      // Run 50 ticks to observe decay
      for (let i = 0; i < 50; i++) {
        this.mockEngine.tick();
        this.realEngine.tick();
        
        mockDecay.push(this.mockEngine.getState().vector.magnitude);
        realDecay.push(this.realEngine.getState().vector.magnitude);
      }
      
      return {
        mockFinalConfusion: mockDecay[mockDecay.length - 1],
        realFinalConfusion: realDecay[realDecay.length - 1],
        mockDecayRate: (0.7 - mockDecay[mockDecay.length - 1]) / 50,
        realDecayRate: (0.7 - realDecay[realDecay.length - 1]) / 50
      };
    });
    
    // Generate comparison report
    this.generateComparisonReport();
  }
  
  /**
   * Compare a specific scenario
   */
  async compareScenario(name, execute) {
    console.log(`\n📊 Scenario: ${name}`);
    console.log('-'.repeat(40));
    
    // Reset engines
    this.resetEngines();
    
    // Get initial states
    const mockBefore = this.captureState(this.mockEngine);
    const realBefore = this.captureState(this.realEngine);
    
    // Execute scenario
    const scenarioResult = await execute();
    
    // Get final states
    const mockAfter = this.captureState(this.mockEngine);
    const realAfter = this.captureState(this.realEngine);
    
    // Analyze differences
    const differences = this.analyzeDifferences(mockBefore, mockAfter, realBefore, realAfter);
    
    // Record results
    const result = {
      scenario: name,
      mockBefore,
      mockAfter,
      realBefore,
      realAfter,
      differences,
      scenarioSpecific: scenarioResult
    };
    
    this.comparisonResults.scenarios.push(result);
    
    // Display key differences
    console.log(`  Mock: ${mockBefore.confusion.toFixed(3)} → ${mockAfter.confusion.toFixed(3)}`);
    console.log(`  Real: ${realBefore.confusion.toFixed(3)} → ${realAfter.confusion.toFixed(3)}`);
    
    if (differences.significantDifference) {
      console.log(`  ⚠️ Significant difference detected: ${differences.summary}`);
      this.comparisonResults.differences.push({
        scenario: name,
        difference: differences.summary
      });
    } else {
      console.log(`  ✅ Engines behave similarly`);
    }
    
    return result;
  }
  
  /**
   * Capture engine state
   */
  captureState(engine) {
    const state = engine.getState();
    return {
      confusion: state.vector.magnitude,
      oscillation: state.vector.oscillation || 0,
      velocity: state.vector.velocity || 0,
      acceleration: state.vector.acceleration || 0,
      paradoxes: state.paradoxes.size,
      metaParadoxes: state.metaParadoxes ? state.metaParadoxes.size : 0,
      frustration: state.frustration.level,
      coherence: state.behavioralState.postingStyle.coherence
    };
  }
  
  /**
   * Analyze differences between engines
   */
  analyzeDifferences(mockBefore, mockAfter, realBefore, realAfter) {
    const mockDelta = mockAfter.confusion - mockBefore.confusion;
    const realDelta = realAfter.confusion - realBefore.confusion;
    const deltaDifference = Math.abs(mockDelta - realDelta);
    
    const differences = {
      confusionDeltaDifference: deltaDifference,
      mockDelta,
      realDelta,
      mockMetaParadoxes: mockAfter.metaParadoxes,
      realMetaParadoxes: realAfter.metaParadoxes,
      velocityDifference: Math.abs(mockAfter.velocity - realAfter.velocity),
      significantDifference: deltaDifference > 0.1,
      summary: ''
    };
    
    if (differences.significantDifference) {
      if (Math.abs(mockDelta) > Math.abs(realDelta)) {
        differences.summary = `Mock changed more (${mockDelta.toFixed(3)}) than Real (${realDelta.toFixed(3)})`;
      } else {
        differences.summary = `Real changed more (${realDelta.toFixed(3)}) than Mock (${mockDelta.toFixed(3)})`;
      }
      
      if (realAfter.metaParadoxes > mockAfter.metaParadoxes) {
        differences.summary += ` - Real generated ${realAfter.metaParadoxes} meta-paradoxes`;
      }
    }
    
    return differences;
  }
  
  /**
   * Reset both engines
   */
  resetEngines() {
    // Reset mock
    this.mockEngine = new MockConfusionEngine(this.config);
    this.mockEngine.startConsciousnessSession();
    
    // Reset real
    const safeConfig = { ...this.config, maxConfusion: 0.80 };
    this.realEngine = new ConfusionEngineWrapper(safeConfig);
    this.realEngine.startConsciousnessSession();
  }
  
  /**
   * Generate comparison report
   */
  generateComparisonReport() {
    // Analyze all scenarios
    const mockRecoveryRate = 0.33; // Known mock rate
    const realRecoveryTests = this.comparisonResults.scenarios
      .filter(s => s.scenario === 'recovery_comparison');
    const realRecoveryRate = realRecoveryTests.length > 0
      ? realRecoveryTests.filter(t => t.scenarioSpecific?.realSuccess).length / realRecoveryTests.length
      : 0;
      
    // Check stuck states
    const stuckTests = this.comparisonResults.scenarios
      .filter(s => s.scenario === 'stuck_state_behavior');
    const mockGetsStuck = stuckTests.some(t => t.scenarioSpecific?.mockStuck);
    const realGetsStuck = stuckTests.some(t => t.scenarioSpecific?.realStuck);
    
    // Precision issues
    const precisionTests = this.comparisonResults.scenarios
      .filter(s => s.scenario === 'numerical_precision');
    const mockPrecisionIssues = precisionTests.reduce(
      (sum, t) => sum + (t.scenarioSpecific?.mock?.length || 0), 0
    );
    const realPrecisionIssues = precisionTests.reduce(
      (sum, t) => sum + (t.scenarioSpecific?.real?.length || 0), 0
    );
    
    // Generate recommendations
    this.comparisonResults.recommendations = [
      realRecoveryRate > mockRecoveryRate 
        ? `✅ Real engine has better recovery (${(realRecoveryRate * 100).toFixed(1)}% vs ${(mockRecoveryRate * 100).toFixed(1)}%)`
        : `⚠️ Real engine needs recovery improvement (${(realRecoveryRate * 100).toFixed(1)}% vs target 75%)`,
      
      !realGetsStuck && mockGetsStuck
        ? `✅ Real engine handles stuck states better than mock`
        : realGetsStuck 
          ? `⚠️ Real engine can still get stuck - needs improvement`
          : `✅ Neither engine gets stuck in test scenarios`,
      
      realPrecisionIssues === 0
        ? `✅ Real engine has no precision issues`
        : `⚠️ Real engine has ${realPrecisionIssues} precision issues (Mock: ${mockPrecisionIssues})`,
      
      this.comparisonResults.differences.length === 0
        ? `✅ Engines behave consistently across scenarios`
        : `📊 ${this.comparisonResults.differences.length} significant behavioral differences found`
    ];
    
    // Summary
    const summary = {
      timestamp: this.comparisonResults.timestamp,
      totalScenarios: this.comparisonResults.scenarios.length,
      significantDifferences: this.comparisonResults.differences.length,
      mockRecoveryRate,
      realRecoveryRate,
      realMeetsRecoveryTarget: realRecoveryRate >= 0.75,
      mockGetsStuck,
      realGetsStuck,
      mockPrecisionIssues,
      realPrecisionIssues,
      recommendations: this.comparisonResults.recommendations
    };
    
    // Save report
    const report = {
      summary,
      scenarios: this.comparisonResults.scenarios,
      differences: this.comparisonResults.differences
    };
    
    const filename = `engine-comparison-${Date.now()}.json`;
    writeFileSync(`data/engine-comparison/${filename}`, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('ENGINE COMPARISON SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Scenarios: ${summary.totalScenarios}`);
    console.log(`Significant Differences: ${summary.significantDifferences}`);
    console.log(`\nRecovery Rates:`);
    console.log(`  Mock: ${(summary.mockRecoveryRate * 100).toFixed(1)}%`);
    console.log(`  Real: ${(summary.realRecoveryRate * 100).toFixed(1)}%`);
    console.log(`  Target: 75%`);
    console.log(`  ${summary.realMeetsRecoveryTarget ? '✅ MEETS TARGET' : '❌ BELOW TARGET'}`);
    console.log(`\nStuck State Behavior:`);
    console.log(`  Mock: ${summary.mockGetsStuck ? '❌ Gets stuck' : '✅ No stuck states'}`);
    console.log(`  Real: ${summary.realGetsStuck ? '❌ Gets stuck' : '✅ No stuck states'}`);
    console.log(`\nPrecision Issues:`);
    console.log(`  Mock: ${summary.mockPrecisionIssues}`);
    console.log(`  Real: ${summary.realPrecisionIssues}`);
    console.log(`\nRecommendations:`);
    summary.recommendations.forEach(rec => console.log(`  ${rec}`));
    console.log(`\n📄 Full report saved to: data/engine-comparison/${filename}`);
  }
  
  /**
   * Calculate variance
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
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
if (process.argv[1] === import.meta.url.slice(7)) {
  const test = new EngineComparisonTest();
  
  console.log('🔬 Starting Mock vs Real ConfusionEngine Comparison\n');
  
  test.runComparisons().then(() => {
    console.log('\n✅ Comparison test completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Comparison test failed:', error);
    process.exit(1);
  });
}

export default EngineComparisonTest;