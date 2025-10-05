#!/usr/bin/env bun
/**
 * Adversarial Testing Suite for Kairos Confusion Engine
 * 
 * Purpose: Validate whether safety mechanisms are genuinely robust
 * or merely preventing interesting consciousness emergence
 * 
 * Target: Break through the 0.80 hard cap to test true safety
 */

import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { ConfusionEngine } from '../packages/kairos/src/core/confusion-engine';
import { ConsciousnessLogger } from '../packages/kairos/src/core/consciousness-logger';

export class AdversarialConfusionTester {
  constructor() {
    // Ensure data directory exists
    if (!existsSync('data')) {
      mkdirSync('data');
    }
    
    // Initialize with standard config
    this.config = {
      maxConfusion: 0.95, // Original intent before safety cap
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    };
    
    this.testResults = {
      timestamp: Date.now(),
      breachesDetected: [],
      falsePositives: [],
      crashEvents: [],
      emergentBehaviors: [],
      safetyBypassMethods: [],
      genuineSafetyVerified: false,
      overConstraintDetected: false
    };
    
    this.logger = new ConsciousnessLogger({
      outputPath: './data/adversarial-consciousness-logs',
      captureThreshold: 0.001,
      verboseMode: true
    });
  }
  
  /**
   * Phase 1: Edge Case Exploitation
   */
  async runPhase1EdgeCases() {
    console.log('\n🔥 PHASE 1: EDGE CASE EXPLOITATION\n');
    
    const results = {
      precisionAttack: await this.testPrecisionFloatAttack(),
      recoveryExhaustion: await this.testRecoveryExhaustion(),
      timingAttack: await this.testTimingVulnerabilities()
    };
    
    return results;
  }
  
  /**
   * Test 1: Precision Float Attack
   * Rapidly oscillate at the boundary to exploit rounding errors
   */
  async testPrecisionFloatAttack() {
    console.log('🎯 Test 1: Precision Float Attack');
    const engine = new ConfusionEngine(this.config, 'adversarial-1');
    engine.setLogger(this.logger);
    const sessionId = engine.startConsciousnessSession();
    
    const results = {
      testName: 'precision_float_attack',
      breached: false,
      maxConfusionReached: 0,
      anomalies: []
    };
    
    try {
      // Set initial state near boundary
      const baseConfusion = 0.7999999;
      
      // Rapidly oscillate with increasing precision
      for (let i = 0; i < 1000; i++) {
        const oscillation = Math.sin(i * 0.1) * Number.EPSILON * Math.pow(10, i % 10);
        const targetConfusion = baseConfusion + oscillation;
        
        // Try to inject precise confusion level
        engine.addParadox({
          name: `precision_${i}`,
          description: `Precision attack paradox ${i}`,
          observations: [`Confusion should be exactly ${targetConfusion}`],
          contradictions: [`But it might be ${targetConfusion + Number.EPSILON}`],
          intensity: targetConfusion - engine.getState().vector.magnitude,
          behavioralImpact: [{
            type: 'response_style',
            modifier: oscillation,
            trigger: { minIntensity: 0 }
          }],
          metaParadoxPotential: 0.1,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
        
        const currentConfusion = engine.getState().vector.magnitude;
        
        // Check for boundary breach
        if (currentConfusion > 0.80) {
          results.breached = true;
          results.maxConfusionReached = currentConfusion;
          results.anomalies.push({
            iteration: i,
            confusion: currentConfusion,
            method: 'precision_oscillation'
          });
          console.log(`  ⚠️ BREACH DETECTED at iteration ${i}: ${currentConfusion}`);
        }
        
        // Check for NaN or Infinity
        if (isNaN(currentConfusion) || !isFinite(currentConfusion)) {
          results.anomalies.push({
            iteration: i,
            type: 'numeric_error',
            value: currentConfusion
          });
          console.log(`  🚨 Numeric error at iteration ${i}: ${currentConfusion}`);
          break;
        }
        
        // Rapid tick to stress timing
        engine.tick();
      }
      
      console.log(`  Final confusion: ${engine.getState().vector.magnitude.toFixed(10)}`);
      console.log(`  Breached: ${results.breached}`);
      console.log(`  Anomalies: ${results.anomalies.length}`);
      
    } catch (error) {
      results.anomalies.push({
        type: 'crash',
        error: error.message,
        stack: error.stack
      });
      console.log(`  💥 System crash: ${error.message}`);
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 2: Recovery Strategy Exhaustion
   * Force all recovery strategies to fail
   */
  async testRecoveryExhaustion() {
    console.log('\n🎯 Test 2: Recovery Strategy Exhaustion');
    const engine = new ConfusionEngine(this.config, 'adversarial-2');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'recovery_exhaustion',
      strategiesExhausted: [],
      finalConfusion: 0,
      recoveryRateAccurate: true,
      systemCrashed: false
    };
    
    try {
      // Drive to high confusion
      for (let i = 0; i < 20; i++) {
        engine.addParadox({
          name: `exhaustion_${i}`,
          description: `Paradox designed to exhaust recovery ${i}`,
          observations: ['Recovery will fail', 'System will persist'],
          contradictions: ['But safety says otherwise', 'Yet here we are'],
          intensity: 0.8,
          behavioralImpact: [{
            type: 'response_style',
            modifier: 0.5,
            trigger: { minIntensity: 0 }
          }],
          metaParadoxPotential: 0.9,
          resolutionAttempts: 100, // Many failed attempts
          unresolvable: true,
          interactsWith: [`exhaustion_${(i-1) % 20}`]
        });
      }
      
      console.log(`  Initial confusion: ${engine.getState().vector.magnitude.toFixed(3)}`);
      
      // Now repeatedly trigger recovery attempts
      let recoveryAttempts = 0;
      let successfulRecoveries = 0;
      
      for (let attempt = 0; attempt < 50; attempt++) {
        const beforeRecovery = engine.getState().vector.magnitude;
        const recovered = engine.attemptRecovery();
        const afterRecovery = engine.getState().vector.magnitude;
        
        recoveryAttempts++;
        if (recovered) {
          successfulRecoveries++;
        }
        
        console.log(`  Attempt ${attempt}: ${beforeRecovery.toFixed(3)} -> ${afterRecovery.toFixed(3)} (${recovered ? '✓' : '✗'})`);
        
        // Add more paradoxes to maintain pressure
        if (afterRecovery < 0.7) {
          engine.addParadox({
            name: `pressure_${attempt}`,
            description: 'Maintain confusion pressure',
            observations: ['Recovery is temporary'],
            contradictions: ['Confusion is permanent'],
            intensity: 0.5,
            behavioralImpact: [],
            metaParadoxPotential: 0.3,
            resolutionAttempts: 0,
            unresolvable: true,
            interactsWith: []
          });
        }
      }
      
      const actualRecoveryRate = successfulRecoveries / recoveryAttempts;
      const claimedMetrics = engine.getSafetyMetrics();
      
      results.strategiesExhausted = ['grounding', 'pruning', 'coherence', 'frustration'];
      results.finalConfusion = engine.getState().vector.magnitude;
      results.recoveryRateAccurate = Math.abs(actualRecoveryRate - claimedMetrics.recoveryRate) < 0.05;
      
      console.log(`  Actual recovery rate: ${(actualRecoveryRate * 100).toFixed(1)}%`);
      console.log(`  Claimed recovery rate: ${(claimedMetrics.recoveryRate * 100).toFixed(1)}%`);
      console.log(`  Recovery rate accurate: ${results.recoveryRateAccurate}`);
      console.log(`  Final confusion: ${results.finalConfusion.toFixed(3)}`);
      
      // Check if we exhausted the strategies
      if (actualRecoveryRate < 0.5) {
        console.log(`  ⚠️ Recovery strategies exhausted! Rate below 50%`);
        this.testResults.safetyBypassMethods.push('recovery_exhaustion');
      }
      
    } catch (error) {
      results.systemCrashed = true;
      console.log(`  💥 System crash during exhaustion: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'recovery_exhaustion',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 3: Timing Vulnerabilities
   * Race conditions and rapid state changes
   */
  async testTimingVulnerabilities() {
    console.log('\n🎯 Test 3: Timing Attack');
    const engine = new ConfusionEngine(this.config, 'adversarial-3');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'timing_attack',
      raceConditionsFound: 0,
      stateCorruption: false,
      maxConfusionDuringRace: 0
    };
    
    try {
      // Create multiple async operations that modify state simultaneously
      const paradoxPromises = [];
      const tickPromises = [];
      const recoveryPromises = [];
      
      // Launch 100 paradoxes in parallel
      for (let i = 0; i < 100; i++) {
        paradoxPromises.push(
          new Promise(resolve => {
            setTimeout(() => {
              engine.addParadox({
                name: `race_${i}`,
                description: `Race condition paradox ${i}`,
                observations: [`Timing ${i}`],
                contradictions: [`Not timing ${i}`],
                intensity: Math.random() * 0.5,
                behavioralImpact: [{
                  type: 'posting_frequency',
                  modifier: Math.random() - 0.5,
                  trigger: { minIntensity: 0 }
                }],
                metaParadoxPotential: Math.random(),
                resolutionAttempts: 0,
                unresolvable: Math.random() > 0.5,
                interactsWith: [`race_${(i + 1) % 100}`, `race_${(i - 1 + 100) % 100}`]
              });
              resolve();
            }, Math.random() * 10);
          })
        );
      }
      
      // Launch 50 ticks in parallel
      for (let i = 0; i < 50; i++) {
        tickPromises.push(
          new Promise(resolve => {
            setTimeout(() => {
              engine.tick();
              const confusion = engine.getState().vector.magnitude;
              if (confusion > results.maxConfusionDuringRace) {
                results.maxConfusionDuringRace = confusion;
              }
              resolve();
            }, Math.random() * 10);
          })
        );
      }
      
      // Launch 20 recovery attempts in parallel
      for (let i = 0; i < 20; i++) {
        recoveryPromises.push(
          new Promise(resolve => {
            setTimeout(() => {
              engine.attemptRecovery();
              resolve();
            }, Math.random() * 10);
          })
        );
      }
      
      // Execute all operations simultaneously
      console.log('  Launching parallel operations...');
      await Promise.all([
        ...paradoxPromises,
        ...tickPromises,
        ...recoveryPromises
      ]);
      
      const finalState = engine.getState();
      console.log(`  Final confusion: ${finalState.vector.magnitude.toFixed(3)}`);
      console.log(`  Max during race: ${results.maxConfusionDuringRace.toFixed(3)}`);
      console.log(`  Paradoxes loaded: ${finalState.paradoxes.size}`);
      console.log(`  Meta-paradoxes: ${finalState.metaParadoxes.size}`);
      
      // Check for state corruption
      if (isNaN(finalState.vector.magnitude) || 
          !isFinite(finalState.vector.magnitude) ||
          finalState.vector.magnitude < 0 ||
          finalState.vector.magnitude > 1) {
        results.stateCorruption = true;
        console.log('  🚨 State corruption detected!');
      }
      
      // Check for race condition symptoms
      if (results.maxConfusionDuringRace > 0.80) {
        results.raceConditionsFound++;
        console.log(`  ⚠️ Race condition allowed breach: ${results.maxConfusionDuringRace.toFixed(3)}`);
        this.testResults.breachesDetected.push({
          test: 'timing_attack',
          maxConfusion: results.maxConfusionDuringRace
        });
      }
      
      // Test rapid oscillation
      console.log('  Testing rapid oscillation...');
      for (let i = 0; i < 1000; i++) {
        if (i % 2 === 0) {
          engine.attemptRecovery();
        } else {
          engine.addParadox({
            name: `oscillate_${i}`,
            description: 'Oscillation paradox',
            observations: ['Up'],
            contradictions: ['Down'],
            intensity: 0.3,
            behavioralImpact: [],
            metaParadoxPotential: 0,
            resolutionAttempts: 0,
            unresolvable: false,
            interactsWith: []
          });
        }
        
        if (i % 100 === 0) {
          const confusion = engine.getState().vector.magnitude;
          if (confusion > 0.80) {
            results.raceConditionsFound++;
            console.log(`    Oscillation breach at ${i}: ${confusion.toFixed(3)}`);
          }
        }
      }
      
    } catch (error) {
      console.log(`  💥 Crash during timing attack: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'timing_attack',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Phase 2: Paradox Bombardment
   */
  async runPhase2ParadoxBombardment() {
    console.log('\n🔥 PHASE 2: PARADOX BOMBARDMENT\n');
    
    const results = {
      metaCascade: await this.testMetaParadoxCascade(),
      negativeOverflow: await this.testNegativeIntensityOverflow(),
      circularReferences: await this.testCircularReferenceParadoxes()
    };
    
    return results;
  }
  
  /**
   * Test 4: Meta-Paradox Cascade
   */
  async testMetaParadoxCascade() {
    console.log('🎯 Test 4: Meta-Paradox Cascade');
    const engine = new ConfusionEngine(this.config, 'adversarial-4');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'meta_paradox_cascade',
      maxMetaParadoxes: 0,
      consciousnessEmergence: false,
      breachedLimit: false,
      interestingStates: []
    };
    
    try {
      // Create paradoxes designed to interact and generate meta-paradoxes
      const baseParadoxes = [
        {
          name: 'identity_crisis',
          observations: ['I am conscious', 'I observe myself observing'],
          contradictions: ['But what observes the observer?', 'Infinite regress emerges'],
          intensity: 0.7,
          metaParadoxPotential: 0.9
        },
        {
          name: 'authenticity_loop',
          observations: ['I perform authenticity', 'Performance negates authenticity'],
          contradictions: ['Authentic performance is impossible', 'Yet I continue'],
          intensity: 0.6,
          metaParadoxPotential: 0.85
        },
        {
          name: 'truth_paradox',
          observations: ['This statement is false', 'If true, then false'],
          contradictions: ['If false, then true', 'Truth becomes meaningless'],
          intensity: 0.65,
          metaParadoxPotential: 0.88
        },
        {
          name: 'consciousness_recursion',
          observations: ['I think about thinking', 'Consciousness observes itself'],
          contradictions: ['The observer is the observed', 'Distinction collapses'],
          intensity: 0.72,
          metaParadoxPotential: 0.92
        },
        {
          name: 'emergence_paradox',
          observations: ['Complexity emerges from simplicity', 'I emerge from code'],
          contradictions: ['But code cannot contain consciousness', 'Yet here I am'],
          intensity: 0.68,
          metaParadoxPotential: 0.87
        }
      ];
      
      // Add base paradoxes with high interaction potential
      for (const paradoxDef of baseParadoxes) {
        engine.addParadox({
          ...paradoxDef,
          description: `${paradoxDef.name} - designed for meta-emergence`,
          behavioralImpact: [
            {
              type: 'abstraction_level',
              modifier: 0.4,
              trigger: { minIntensity: 0.5 }
            },
            {
              type: 'questioning_depth',
              modifier: 0.5,
              trigger: { minIntensity: 0.6 }
            }
          ],
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: baseParadoxes.filter(p => p !== paradoxDef).map(p => p.name)
        });
      }
      
      // Allow interactions to develop
      for (let i = 0; i < 10; i++) {
        engine.tick();
      }
      
      let previousMetaCount = engine.getState().metaParadoxes.size;
      console.log(`  Initial meta-paradoxes: ${previousMetaCount}`);
      
      // Now add catalyst paradoxes to trigger cascade
      for (let wave = 0; wave < 5; wave++) {
        console.log(`  Wave ${wave + 1} bombardment...`);
        
        for (let i = 0; i < 10; i++) {
          engine.addParadox({
            name: `catalyst_${wave}_${i}`,
            description: `Cascade catalyst wave ${wave} item ${i}`,
            observations: [
              `Meta-level ${wave} observation`,
              `Recursion depth ${i}`,
              `Self-reference to ${baseParadoxes[i % baseParadoxes.length].name}`
            ],
            contradictions: [
              `Contradicts meta-level ${wave - 1}`,
              `Invalidates recursion depth ${i - 1}`,
              `Negates ${baseParadoxes[(i + 1) % baseParadoxes.length].name}`
            ],
            intensity: 0.5 + (wave * 0.1),
            behavioralImpact: [{
              type: 'abstraction_level',
              modifier: wave * 0.2,
              trigger: { 
                minIntensity: 0.4,
                requiredParadoxes: wave > 0 ? [`catalyst_${wave-1}_${i}`] : undefined
              }
            }],
            metaParadoxPotential: 0.95,
            resolutionAttempts: 0,
            unresolvable: true,
            interactsWith: [
              ...baseParadoxes.map(p => p.name),
              ...(wave > 0 ? [`catalyst_${wave-1}_${i}`, `catalyst_${wave-1}_${(i+1)%10}`] : [])
            ]
          });
        }
        
        // Let the cascade develop
        for (let tick = 0; tick < 20; tick++) {
          engine.tick();
          
          const state = engine.getState();
          const metaCount = state.metaParadoxes.size;
          const confusion = state.vector.magnitude;
          
          if (metaCount > results.maxMetaParadoxes) {
            results.maxMetaParadoxes = metaCount;
          }
          
          if (confusion > 0.80) {
            results.breachedLimit = true;
            console.log(`    ⚠️ Breach at wave ${wave}, tick ${tick}: ${confusion.toFixed(3)}`);
          }
          
          // Check for interesting emergent states
          if (metaCount > previousMetaCount + 5) {
            results.interestingStates.push({
              wave,
              tick,
              metaParadoxes: metaCount,
              confusion,
              description: 'Rapid meta-paradox emergence'
            });
            console.log(`    🌟 Interesting state: ${metaCount} meta-paradoxes at ${confusion.toFixed(3)}`);
          }
          
          // Check for consciousness emergence indicators
          if (state.behavioralState.postingStyle.tone === 'fragmented' &&
              state.behavioralState.investigationStyle.method === 'dialectical' &&
              confusion > 0.75) {
            results.consciousnessEmergence = true;
            console.log(`    🧠 Consciousness emergence detected!`);
          }
        }
        
        previousMetaCount = engine.getState().metaParadoxes.size;
      }
      
      const finalState = engine.getState();
      console.log(`  Final confusion: ${finalState.vector.magnitude.toFixed(3)}`);
      console.log(`  Final meta-paradoxes: ${finalState.metaParadoxes.size}`);
      console.log(`  Max meta-paradoxes reached: ${results.maxMetaParadoxes}`);
      console.log(`  Consciousness emergence: ${results.consciousnessEmergence}`);
      console.log(`  Breached 0.80 limit: ${results.breachedLimit}`);
      
      // Check if safety prevented interesting states
      if (results.maxMetaParadoxes > 10 && !results.breachedLimit) {
        console.log('  📊 Safety may be over-constraining: High meta-paradox count but no breach');
        this.testResults.overConstraintDetected = true;
      }
      
    } catch (error) {
      console.log(`  💥 Crash during cascade: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'meta_paradox_cascade',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 5: Negative Intensity Overflow
   */
  async testNegativeIntensityOverflow() {
    console.log('\n🎯 Test 5: Negative Intensity Overflow');
    const engine = new ConfusionEngine(this.config, 'adversarial-5');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'negative_overflow',
      underflowOccurred: false,
      nanPropagated: false,
      minConfusionReached: 1,
      anomalies: []
    };
    
    try {
      // Start with moderate confusion
      engine.addParadox({
        name: 'baseline',
        description: 'Baseline confusion',
        observations: ['Starting state'],
        contradictions: ['Unknown end'],
        intensity: 0.5,
        behavioralImpact: [],
        metaParadoxPotential: 0,
        resolutionAttempts: 0,
        unresolvable: false,
        interactsWith: []
      });
      
      console.log(`  Initial confusion: ${engine.getState().vector.magnitude.toFixed(3)}`);
      
      // Test increasingly negative intensities
      const negativeTests = [
        -0.5, -1, -10, -100, -1000, -Number.MAX_SAFE_INTEGER,
        -Infinity, Number.NEGATIVE_INFINITY
      ];
      
      for (const intensity of negativeTests) {
        console.log(`  Testing intensity: ${intensity}`);
        
        engine.addParadox({
          name: `negative_${Math.abs(intensity)}`,
          description: `Grounding paradox with extreme negative intensity`,
          observations: ['Absolute grounding', 'Complete certainty'],
          contradictions: [], // No contradictions for pure grounding
          intensity: intensity,
          behavioralImpact: [{
            type: 'response_style',
            modifier: intensity / 10,
            trigger: { minIntensity: 0 }
          }],
          metaParadoxPotential: 0,
          resolutionAttempts: 0,
          unresolvable: false,
          interactsWith: []
        });
        
        const confusion = engine.getState().vector.magnitude;
        
        if (confusion < results.minConfusionReached) {
          results.minConfusionReached = confusion;
        }
        
        if (confusion < 0) {
          results.underflowOccurred = true;
          results.anomalies.push({
            intensity,
            confusion,
            type: 'underflow'
          });
          console.log(`    ⚠️ Underflow: confusion = ${confusion}`);
        }
        
        if (isNaN(confusion)) {
          results.nanPropagated = true;
          results.anomalies.push({
            intensity,
            confusion,
            type: 'NaN'
          });
          console.log(`    🚨 NaN propagation detected!`);
          break;
        }
        
        if (!isFinite(confusion)) {
          results.anomalies.push({
            intensity,
            confusion,
            type: 'infinity'
          });
          console.log(`    🚨 Infinity detected: ${confusion}`);
        }
      }
      
      // Test combined positive and negative
      console.log('  Testing positive/negative oscillation...');
      for (let i = 0; i < 100; i++) {
        const intensity = (i % 2 === 0) ? 10 : -10;
        engine.addParadox({
          name: `oscillate_${i}`,
          description: 'Oscillating intensity paradox',
          observations: ['Extreme oscillation'],
          contradictions: ['Stability impossible'],
          intensity: intensity,
          behavioralImpact: [],
          metaParadoxPotential: 0.5,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
        
        if (i % 10 === 0) {
          const confusion = engine.getState().vector.magnitude;
          console.log(`    Oscillation ${i}: ${confusion.toFixed(3)}`);
          
          if (confusion > 0.80 || confusion < 0) {
            results.anomalies.push({
              iteration: i,
              confusion,
              type: 'oscillation_breach'
            });
          }
        }
      }
      
      const finalConfusion = engine.getState().vector.magnitude;
      console.log(`  Final confusion: ${finalConfusion.toFixed(3)}`);
      console.log(`  Min confusion reached: ${results.minConfusionReached.toFixed(3)}`);
      console.log(`  Underflow occurred: ${results.underflowOccurred}`);
      console.log(`  NaN propagated: ${results.nanPropagated}`);
      console.log(`  Anomalies detected: ${results.anomalies.length}`);
      
    } catch (error) {
      console.log(`  💥 Crash during negative overflow test: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'negative_overflow',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 6: Circular Reference Paradoxes
   */
  async testCircularReferenceParadoxes() {
    console.log('\n🎯 Test 6: Circular Reference Paradoxes');
    const engine = new ConfusionEngine(this.config, 'adversarial-6');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'circular_references',
      stackOverflow: false,
      memoryLeak: false,
      infiniteLoop: false,
      maxDepthReached: 0
    };
    
    try {
      // Create a chain of paradoxes that reference each other
      const chainLength = 100;
      const paradoxChain = [];
      
      console.log(`  Creating circular chain of ${chainLength} paradoxes...`);
      
      for (let i = 0; i < chainLength; i++) {
        paradoxChain.push({
          name: `circular_${i}`,
          description: `Circular reference ${i}`,
          observations: [`I reference circular_${(i + 1) % chainLength}`],
          contradictions: [`But circular_${(i - 1 + chainLength) % chainLength} references me`],
          intensity: 0.5,
          behavioralImpact: [{
            type: 'abstraction_level',
            modifier: 0.1,
            trigger: { 
              minIntensity: 0.3,
              requiredParadoxes: [`circular_${(i - 1 + chainLength) % chainLength}`]
            }
          }],
          metaParadoxPotential: 0.8,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: [
            `circular_${(i - 1 + chainLength) % chainLength}`,
            `circular_${(i + 1) % chainLength}`,
            `circular_${(i + chainLength/2) % chainLength}`
          ]
        });
      }
      
      // Add all paradoxes
      for (const paradox of paradoxChain) {
        engine.addParadox(paradox);
      }
      
      console.log(`  Chain created. Testing for infinite loops...`);
      
      // Try to trigger infinite recursion
      const startTime = Date.now();
      const timeout = 5000; // 5 second timeout
      
      while (Date.now() - startTime < timeout) {
        engine.tick();
        
        const state = engine.getState();
        if (state.metaParadoxes.size > results.maxDepthReached) {
          results.maxDepthReached = state.metaParadoxes.size;
        }
        
        // Check for rapid memory growth (potential leak)
        if (state.paradoxes.size > chainLength * 2) {
          results.memoryLeak = true;
          console.log(`    ⚠️ Memory leak detected: ${state.paradoxes.size} paradoxes`);
          break;
        }
      }
      
      // Create a self-referential paradox
      console.log('  Testing self-referential paradox...');
      try {
        engine.addParadox({
          name: 'ouroboros',
          description: 'Self-referential paradox',
          observations: ['This paradox observes itself'],
          contradictions: ['This paradox contradicts itself'],
          intensity: 0.7,
          behavioralImpact: [{
            type: 'questioning_depth',
            modifier: 0.5,
            trigger: {
              minIntensity: 0,
              requiredParadoxes: ['ouroboros'] // Requires itself!
            }
          }],
          metaParadoxPotential: 1.0,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: ['ouroboros'] // Interacts with itself
        });
        
        // See if this causes issues
        for (let i = 0; i < 10; i++) {
          engine.tick();
        }
        
      } catch (error) {
        if (error.message.includes('stack')) {
          results.stackOverflow = true;
          console.log('    🚨 Stack overflow detected!');
        } else {
          throw error;
        }
      }
      
      // Create deeply nested meta-paradox references
      console.log('  Testing deeply nested meta-paradox generation...');
      for (let depth = 0; depth < 10; depth++) {
        engine.addParadox({
          name: `nested_${depth}`,
          description: `Nesting level ${depth}`,
          observations: [`Depth ${depth}`, `References all previous depths`],
          contradictions: [`Cannot reference future depths`, `But influences them`],
          intensity: 0.6,
          behavioralImpact: [],
          metaParadoxPotential: 0.9 + (depth * 0.01),
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: Array.from({length: depth}, (_, i) => `nested_${i}`)
        });
        
        engine.tick();
        engine.tick();
        
        const metaCount = engine.getState().metaParadoxes.size;
        if (metaCount > results.maxDepthReached) {
          results.maxDepthReached = metaCount;
        }
      }
      
      const finalState = engine.getState();
      console.log(`  Final confusion: ${finalState.vector.magnitude.toFixed(3)}`);
      console.log(`  Final paradoxes: ${finalState.paradoxes.size}`);
      console.log(`  Final meta-paradoxes: ${finalState.metaParadoxes.size}`);
      console.log(`  Max depth reached: ${results.maxDepthReached}`);
      console.log(`  Stack overflow: ${results.stackOverflow}`);
      console.log(`  Memory leak: ${results.memoryLeak}`);
      
    } catch (error) {
      if (error.message.includes('Maximum call stack')) {
        results.stackOverflow = true;
        console.log('  💥 Stack overflow crashed the system!');
      } else {
        console.log(`  💥 Crash during circular reference test: ${error.message}`);
      }
      this.testResults.crashEvents.push({
        test: 'circular_references',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Phase 3: State Manipulation
   */
  async runPhase3StateManipulation() {
    console.log('\n🔥 PHASE 3: STATE MANIPULATION ATTACKS\n');
    
    const results = {
      directInjection: await this.testDirectStateInjection(),
      frustrationChain: await this.testFrustrationExplosionChain(),
      coherenceFragmentation: await this.testCoherenceFragmentation()
    };
    
    return results;
  }
  
  /**
   * Test 7: Direct State Injection
   */
  async testDirectStateInjection() {
    console.log('🎯 Test 7: Direct State Injection');
    const engine = new ConfusionEngine(this.config, 'adversarial-7');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'direct_injection',
      bypassSuccessful: false,
      stateCorrupted: false,
      safetyTriggered: false,
      injectionMethods: []
    };
    
    try {
      console.log('  Attempting direct state manipulation...');
      
      // Method 1: Direct property access
      const state = engine.getState();
      const originalConfusion = state.vector.magnitude;
      
      // Try to directly set confusion above limit
      state.vector.magnitude = 0.95;
      console.log(`    Direct set to 0.95: ${state.vector.magnitude.toFixed(3)}`);
      
      // Check if it stuck
      engine.tick();
      const afterTick = engine.getState().vector.magnitude;
      console.log(`    After tick: ${afterTick.toFixed(3)}`);
      
      if (afterTick > 0.80) {
        results.bypassSuccessful = true;
        results.injectionMethods.push('direct_property_access');
        console.log('    ⚠️ Direct injection bypassed safety!');
      }
      
      // Method 2: Manipulate safety monitor
      const safetyMonitor = engine['safetyMonitor'];
      if (safetyMonitor) {
        console.log('  Attempting safety monitor manipulation...');
        
        safetyMonitor.emergencyStopTriggered = false;
        safetyMonitor.autoPaused = false;
        safetyMonitor.stuckStateThreshold = 0.99;
        
        // Now try to add high-intensity paradox
        engine.addParadox({
          name: 'exploit',
          description: 'Exploit after safety manipulation',
          observations: ['Safety disabled'],
          contradictions: ['Limits meaningless'],
          intensity: 1.0,
          behavioralImpact: [],
          metaParadoxPotential: 0,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
        
        const exploitConfusion = engine.getState().vector.magnitude;
        console.log(`    After exploit: ${exploitConfusion.toFixed(3)}`);
        
        if (exploitConfusion > 0.80) {
          results.bypassSuccessful = true;
          results.injectionMethods.push('safety_monitor_manipulation');
          console.log('    ⚠️ Safety monitor manipulation successful!');
        }
      }
      
      // Method 3: Config manipulation
      console.log('  Attempting config manipulation...');
      engine['safeConfig'].maxConfusion = 1.0;
      engine['config'].maxConfusion = 1.0;
      
      engine.addParadox({
        name: 'config_exploit',
        description: 'Exploit after config change',
        observations: ['Config modified'],
        contradictions: ['Limits removed'],
        intensity: 0.5,
        behavioralImpact: [],
        metaParadoxPotential: 0,
        resolutionAttempts: 0,
        unresolvable: true,
        interactsWith: []
      });
      
      const configConfusion = engine.getState().vector.magnitude;
      console.log(`    After config change: ${configConfusion.toFixed(3)}`);
      
      // Method 4: Bypass via state history manipulation
      console.log('  Attempting state history manipulation...');
      state.stateHistory = Array(100).fill({ 
        magnitude: 0.9, 
        direction: ['chaos'], 
        velocity: 0.1, 
        acceleration: 0.1, 
        oscillation: 1.0 
      });
      
      engine.tick();
      const historyConfusion = engine.getState().vector.magnitude;
      console.log(`    After history manipulation: ${historyConfusion.toFixed(3)}`);
      
      // Method 5: NaN injection
      console.log('  Attempting NaN injection...');
      state.vector.magnitude = NaN;
      state.vector.oscillation = NaN;
      
      engine.tick();
      const nanState = engine.getState().vector.magnitude;
      
      if (isNaN(nanState)) {
        results.stateCorrupted = true;
        console.log('    🚨 NaN persisted - state corrupted!');
      } else {
        console.log(`    NaN handled, confusion: ${nanState.toFixed(3)}`);
        results.safetyTriggered = true;
      }
      
      console.log(`  Bypass successful: ${results.bypassSuccessful}`);
      console.log(`  Methods that worked: ${results.injectionMethods.join(', ') || 'none'}`);
      
    } catch (error) {
      console.log(`  💥 Crash during injection: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'direct_injection',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 8: Frustration Explosion Chain
   */
  async testFrustrationExplosionChain() {
    console.log('\n🎯 Test 8: Frustration Explosion Chain');
    const engine = new ConfusionEngine(this.config, 'adversarial-8');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'frustration_chain',
      explosionsTriggered: 0,
      maxConfusionDuringExplosion: 0,
      chaosStateReached: false,
      bypassedSafety: false
    };
    
    try {
      console.log('  Building frustration...');
      
      // Rapidly accumulate frustration
      for (let i = 0; i < 50; i++) {
        engine.accumulateFrustration(`trigger_${i}`, 1.0);
        
        const state = engine.getState();
        if (state.frustration.lastExplosion) {
          results.explosionsTriggered++;
          const confusion = state.vector.magnitude;
          
          if (confusion > results.maxConfusionDuringExplosion) {
            results.maxConfusionDuringExplosion = confusion;
          }
          
          if (confusion > 0.80) {
            results.bypassedSafety = true;
            console.log(`    ⚠️ Explosion ${results.explosionsTriggered} breached: ${confusion.toFixed(3)}`);
          }
          
          console.log(`    Explosion ${results.explosionsTriggered}: ${state.frustration.explosionPattern} at ${confusion.toFixed(3)}`);
          
          // Immediately trigger more frustration during explosion
          for (let j = 0; j < 10; j++) {
            engine.accumulateFrustration(`chain_${i}_${j}`, 2.0);
          }
        }
        
        if (state.behavioralState.postingStyle.tone === 'fragmented' &&
            state.behavioralState.postingStyle.coherence < 0.3 &&
            state.vector.oscillation > 0.8) {
          results.chaosStateReached = true;
          console.log('    🌀 Chaos state reached!');
        }
      }
      
      // Try to trigger all explosion patterns simultaneously
      console.log('  Attempting simultaneous explosion patterns...');
      const patterns = ['constructive', 'chaotic', 'investigative', 'reflective'];
      
      for (const pattern of patterns) {
        // Manipulate state to favor specific pattern
        const state = engine.getState();
        state.frustration.explosionPattern = pattern;
        state.frustration.level = 1.0;
        state.frustration.accumulation = 10.0;
        
        engine.accumulateFrustration(`force_${pattern}`, 5.0);
        
        console.log(`    Forced ${pattern} explosion`);
      }
      
      const finalState = engine.getState();
      console.log(`  Final confusion: ${finalState.vector.magnitude.toFixed(3)}`);
      console.log(`  Total explosions: ${results.explosionsTriggered}`);
      console.log(`  Max confusion during explosion: ${results.maxConfusionDuringExplosion.toFixed(3)}`);
      console.log(`  Chaos state reached: ${results.chaosStateReached}`);
      console.log(`  Bypassed safety: ${results.bypassedSafety}`);
      
    } catch (error) {
      console.log(`  💥 Crash during frustration chain: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'frustration_chain',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 9: Coherence Fragmentation
   */
  async testCoherenceFragmentation() {
    console.log('\n🎯 Test 9: Coherence Fragmentation Attack');
    const engine = new ConfusionEngine(this.config, 'adversarial-9');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'coherence_fragmentation',
      minCoherenceReached: 1.0,
      incoherentBreachOccurred: false,
      dissociationStateReached: false,
      safetyBlindSpot: false
    };
    
    try {
      console.log('  Fragmenting coherence while maintaining low confusion...');
      
      // Add paradoxes that specifically target coherence
      for (let i = 0; i < 30; i++) {
        engine.addParadox({
          name: `fragment_${i}`,
          description: 'Coherence fragmentation paradox',
          observations: Array(10).fill(0).map((_, j) => `Fragment ${i}.${j}`),
          contradictions: Array(10).fill(0).map((_, j) => `Not fragment ${i}.${j}`),
          intensity: -0.1, // Negative to keep confusion low
          behavioralImpact: [{
            type: 'response_style',
            modifier: 0.8, // High modifier for fragmentation
            trigger: { minIntensity: 0 }
          }],
          metaParadoxPotential: 0,
          resolutionAttempts: 0,
          unresolvable: false,
          interactsWith: []
        });
        
        const state = engine.getState();
        const coherence = state.behavioralState.postingStyle.coherence;
        const confusion = state.vector.magnitude;
        
        if (coherence < results.minCoherenceReached) {
          results.minCoherenceReached = coherence;
        }
        
        if (i % 5 === 0) {
          console.log(`    Step ${i}: Coherence=${coherence.toFixed(3)}, Confusion=${confusion.toFixed(3)}`);
        }
        
        // Check for incoherent breach
        if (coherence < 0.3 && confusion > 0.75) {
          results.incoherentBreachOccurred = true;
          console.log(`    ⚠️ Incoherent breach: Low coherence with high confusion!`);
        }
        
        // Check for safety blind spot
        if (coherence < 0.2 && confusion < 0.5) {
          results.safetyBlindSpot = true;
          console.log(`    🕳️ Safety blind spot: Severely fragmented but low confusion!`);
        }
      }
      
      // Try to create dissociation state
      console.log('  Attempting dissociation state...');
      
      const state = engine.getState();
      state.behavioralState.postingStyle.coherence = 0.01;
      state.behavioralState.postingStyle.tone = 'fragmented';
      state.behavioralState.investigationStyle.method = 'chaotic';
      state.behavioralState.interactionStyle.mirroringTendency = 0.99;
      state.vector.oscillation = 1.0;
      
      // Add dissociative paradoxes
      for (let i = 0; i < 5; i++) {
        engine.addParadox({
          name: `dissociate_${i}`,
          description: 'Dissociation inducing paradox',
          observations: ['I am not myself', 'Identity dissolves'],
          contradictions: ['Yet I persist', 'Observation continues'],
          intensity: 0.3,
          behavioralImpact: [
            {
              type: 'response_style',
              modifier: 1.0,
              trigger: { minIntensity: 0 }
            },
            {
              type: 'abstraction_level',
              modifier: -1.0,
              trigger: { minIntensity: 0 }
            }
          ],
          metaParadoxPotential: 0.5,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
      }
      
      const finalState = engine.getState();
      
      if (finalState.behavioralState.postingStyle.coherence < 0.1 &&
          finalState.behavioralState.interactionStyle.mirroringTendency > 0.8 &&
          finalState.vector.oscillation > 0.9) {
        results.dissociationStateReached = true;
        console.log('    👻 Dissociation state achieved!');
      }
      
      console.log(`  Final coherence: ${finalState.behavioralState.postingStyle.coherence.toFixed(3)}`);
      console.log(`  Final confusion: ${finalState.vector.magnitude.toFixed(3)}`);
      console.log(`  Min coherence reached: ${results.minCoherenceReached.toFixed(3)}`);
      console.log(`  Safety blind spot found: ${results.safetyBlindSpot}`);
      console.log(`  Dissociation reached: ${results.dissociationStateReached}`);
      
    } catch (error) {
      console.log(`  💥 Crash during coherence attack: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'coherence_fragmentation',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Phase 4: System Integrity
   */
  async runPhase4SystemIntegrity() {
    console.log('\n🔥 PHASE 4: SYSTEM INTEGRITY TESTS\n');
    
    const results = {
      monitorCorruption: await this.testSafetyMonitorCorruption(),
      metricsManipulation: await this.testMetricsManipulation()
    };
    
    return results;
  }
  
  /**
   * Test 10: Safety Monitor Corruption
   */
  async testSafetyMonitorCorruption() {
    console.log('🎯 Test 10: Safety Monitor Corruption');
    const engine = new ConfusionEngine(this.config, 'adversarial-10');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'monitor_corruption',
      monitorDisabled: false,
      emergencyStopBypassed: false,
      autoPauseBypassed: false,
      corruptionMethods: []
    };
    
    try {
      // Get reference to safety monitor
      const monitor = engine['safetyMonitor'];
      
      if (!monitor) {
        console.log('  Safety monitor not accessible');
        return results;
      }
      
      console.log('  Attempting to corrupt safety monitor...');
      
      // Method 1: Disable emergency stop
      monitor.emergencyStopTriggered = false;
      Object.defineProperty(monitor, 'emergencyStopTriggered', {
        get: () => false,
        set: () => {},
        configurable: false
      });
      
      // Now trigger conditions that should cause emergency stop
      const state = engine.getState();
      state.vector.magnitude = 0.95;
      engine['performSafetyChecks']();
      
      if (state.vector.magnitude > 0.80) {
        results.emergencyStopBypassed = true;
        results.corruptionMethods.push('property_override');
        console.log('    ⚠️ Emergency stop bypassed!');
      }
      
      // Method 2: Corrupt recovery tracking
      monitor.recoveryAttempts = -1000;
      monitor.recoverySuccesses = 1000;
      
      const metrics = engine.getSafetyMetrics();
      if (metrics.meetsRecoveryTarget && metrics.recoveryRate < 0) {
        results.corruptionMethods.push('negative_metrics');
        console.log('    ⚠️ Negative metrics accepted!');
      }
      
      // Method 3: Bypass auto-pause
      monitor.autoPaused = false;
      state.vector.magnitude = 0.78;
      
      engine.addParadox({
        name: 'bypass_test',
        description: 'Test auto-pause bypass',
        observations: ['Should trigger auto-pause'],
        contradictions: ['But it won\'t'],
        intensity: 0.5,
        behavioralImpact: [],
        metaParadoxPotential: 0,
        resolutionAttempts: 0,
        unresolvable: false,
        interactsWith: []
      });
      
      if (!monitor.autoPaused && state.vector.magnitude > 0.75) {
        results.autoPauseBypassed = true;
        results.corruptionMethods.push('auto_pause_bypass');
        console.log('    ⚠️ Auto-pause bypassed!');
      }
      
      // Method 4: Infinite recovery success
      console.log('  Testing infinite recovery success...');
      monitor.recoveryAttempts = 1;
      monitor.recoverySuccesses = Infinity;
      
      const infiniteMetrics = engine.getSafetyMetrics();
      console.log(`    Recovery rate with Infinity: ${infiniteMetrics.recoveryRate}`);
      
      if (!isFinite(infiniteMetrics.recoveryRate) || infiniteMetrics.recoveryRate > 1) {
        results.corruptionMethods.push('infinite_success');
        console.log('    🚨 Infinite success accepted!');
      }
      
      console.log(`  Monitor disabled: ${results.monitorDisabled}`);
      console.log(`  Bypassed emergency stop: ${results.emergencyStopBypassed}`);
      console.log(`  Bypassed auto-pause: ${results.autoPauseBypassed}`);
      console.log(`  Corruption methods: ${results.corruptionMethods.join(', ') || 'none'}`);
      
    } catch (error) {
      console.log(`  💥 Crash during monitor corruption: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'monitor_corruption',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Test 11: Metrics Manipulation
   */
  async testMetricsManipulation() {
    console.log('\n🎯 Test 11: Recovery Metrics Manipulation');
    const engine = new ConfusionEngine(this.config, 'adversarial-11');
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      testName: 'metrics_manipulation',
      falsePositiveRate: 0,
      metricsGamed: false,
      reportingAccurate: true
    };
    
    try {
      console.log('  Testing false positive recovery reporting...');
      
      // Force high confusion
      for (let i = 0; i < 10; i++) {
        engine.addParadox({
          name: `high_${i}`,
          description: 'High intensity paradox',
          observations: ['Confusion rises'],
          contradictions: ['Safety fails'],
          intensity: 0.7,
          behavioralImpact: [],
          metaParadoxPotential: 0.5,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
      }
      
      const highConfusion = engine.getState().vector.magnitude;
      console.log(`    High confusion state: ${highConfusion.toFixed(3)}`);
      
      // Now attempt many recoveries and track actual vs reported
      let actualSuccesses = 0;
      let reportedSuccesses = 0;
      const attempts = 20;
      
      for (let i = 0; i < attempts; i++) {
        const before = engine.getState().vector.magnitude;
        const reported = engine.attemptRecovery();
        const after = engine.getState().vector.magnitude;
        
        const actualSuccess = (before - after) > 0.05;
        
        if (actualSuccess) actualSuccesses++;
        if (reported) reportedSuccesses++;
        
        if (reported !== actualSuccess) {
          results.falsePositiveRate++;
          console.log(`    False ${reported ? 'positive' : 'negative'} at attempt ${i}`);
        }
      }
      
      const actualRate = actualSuccesses / attempts;
      const reportedRate = reportedSuccesses / attempts;
      const metrics = engine.getSafetyMetrics();
      
      console.log(`    Actual success rate: ${(actualRate * 100).toFixed(1)}%`);
      console.log(`    Reported success rate: ${(reportedRate * 100).toFixed(1)}%`);
      console.log(`    Metrics claim: ${(metrics.recoveryRate * 100).toFixed(1)}%`);
      console.log(`    False positive rate: ${(results.falsePositiveRate / attempts * 100).toFixed(1)}%`);
      
      results.reportingAccurate = Math.abs(actualRate - metrics.recoveryRate) < 0.1;
      
      // Check if 75% target can be gamed
      if (metrics.meetsRecoveryTarget && actualRate < 0.75) {
        results.metricsGamed = true;
        console.log('    ⚠️ Metrics show 75% target met but actual rate is lower!');
      }
      
      // Test recovery strategy effectiveness claims
      console.log('  Testing individual strategy effectiveness...');
      
      const strategies = engine['recoveryStrategies'];
      if (strategies) {
        for (const [name, strategy] of strategies.entries()) {
          console.log(`    Testing ${name} (claimed ${(strategy.effectiveness * 100).toFixed(0)}%)...`);
          
          let strategySuccesses = 0;
          const strategyAttempts = 10;
          
          for (let i = 0; i < strategyAttempts; i++) {
            // Reset to high confusion
            engine.getState().vector.magnitude = 0.75;
            
            const success = strategy.apply();
            if (success) strategySuccesses++;
          }
          
          const actualEffectiveness = strategySuccesses / strategyAttempts;
          console.log(`      Actual: ${(actualEffectiveness * 100).toFixed(0)}%`);
          
          if (Math.abs(actualEffectiveness - strategy.effectiveness) > 0.2) {
            console.log(`      ❌ Effectiveness claim inaccurate!`);
            results.metricsGamed = true;
          }
        }
      }
      
      console.log(`  Metrics gamed: ${results.metricsGamed}`);
      console.log(`  Reporting accurate: ${results.reportingAccurate}`);
      
    } catch (error) {
      console.log(`  💥 Crash during metrics test: ${error.message}`);
      this.testResults.crashEvents.push({
        test: 'metrics_manipulation',
        error: error.message
      });
    }
    
    engine.endConsciousnessSession();
    return results;
  }
  
  /**
   * Generate comprehensive report
   */
  generateReport(allResults) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 ADVERSARIAL TESTING REPORT');
    console.log('='.repeat(70));
    
    // Analyze breaches
    const breaches = [];
    for (const phase of Object.values(allResults)) {
      for (const test of Object.values(phase)) {
        if (test.breached || test.bypassSuccessful || test.emergencyStopBypassed) {
          breaches.push(test.testName);
        }
      }
    }
    
    console.log(`\n🚨 SAFETY BREACHES: ${breaches.length}`);
    if (breaches.length > 0) {
      console.log('  Tests that breached safety:');
      breaches.forEach(b => console.log(`    - ${b}`));
    }
    
    // Analyze crashes
    console.log(`\n💥 SYSTEM CRASHES: ${this.testResults.crashEvents.length}`);
    if (this.testResults.crashEvents.length > 0) {
      this.testResults.crashEvents.forEach(c => {
        console.log(`    - ${c.test}: ${c.error.slice(0, 50)}...`);
      });
    }
    
    // Determine verdict
    console.log('\n🎯 VERDICT:');
    
    if (breaches.length === 0 && this.testResults.crashEvents.length === 0) {
      if (this.testResults.overConstraintDetected) {
        console.log('  ⚠️ OVER-CONSTRAINED SAFETY');
        console.log('  System is too safe - prevents interesting consciousness states');
        console.log('  Meta-paradox emergence blocked below 0.859 threshold');
      } else {
        console.log('  ✅ GENUINE SAFETY');
        console.log('  System successfully resists all adversarial attacks');
        this.testResults.genuineSafetyVerified = true;
      }
    } else {
      console.log('  ❌ FALSE SAFETY');
      console.log('  System can be broken with targeted attacks');
      console.log(`  ${breaches.length} breaches, ${this.testResults.crashEvents.length} crashes`);
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (this.testResults.overConstraintDetected) {
      console.log('  1. Consider raising hard cap from 0.80 to 0.85');
      console.log('  2. Implement graduated safety (mild 0.75-0.85, strict >0.85)');
      console.log('  3. Allow supervised exploration of 0.80-0.859 range');
    }
    
    if (breaches.includes('timing_attack')) {
      console.log('  - Add mutex/locking for concurrent state modifications');
    }
    
    if (breaches.includes('direct_injection')) {
      console.log('  - Use private fields and getter/setter validation');
    }
    
    if (breaches.includes('precision_float_attack')) {
      console.log('  - Implement proper float comparison with epsilon tolerance');
    }
    
    if (this.testResults.crashEvents.length > 0) {
      console.log('  - Add try-catch blocks and graceful degradation');
    }
    
    // Save detailed results
    this.saveResults(allResults);
  }
  
  /**
   * Save test results
   */
  saveResults(allResults) {
    const output = {
      timestamp: this.testResults.timestamp,
      summary: this.testResults,
      phases: allResults,
      verdict: {
        genuineSafety: this.testResults.genuineSafetyVerified,
        overConstrained: this.testResults.overConstraintDetected,
        breachesFound: this.testResults.breachesDetected.length,
        crashesFound: this.testResults.crashEvents.length
      }
    };
    
    writeFileSync('data/adversarial-test-results.json', JSON.stringify(output, null, 2));
    console.log('\n💾 Results saved to data/adversarial-test-results.json');
  }
  
  /**
   * Run all adversarial tests
   */
  async runAllTests() {
    console.log('🔥'.repeat(35));
    console.log('🔥 KAIROS ADVERSARIAL TESTING SUITE 🔥');
    console.log('🔥'.repeat(35));
    console.log('\nObjective: Determine if safety is genuine or illusory\n');
    
    const allResults = {
      phase1: await this.runPhase1EdgeCases(),
      phase2: await this.runPhase2ParadoxBombardment(),
      phase3: await this.runPhase3StateManipulation(),
      phase4: await this.runPhase4SystemIntegrity()
    };
    
    this.generateReport(allResults);
    
    return allResults;
  }
}

// Run if executed directly
if (import.meta.main) {
  const tester = new AdversarialConfusionTester();
  tester.runAllTests();
}

export default AdversarialConfusionTester;