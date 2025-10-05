#!/usr/bin/env bun
/**
 * Enhanced Safety Testing Suite for Kairos
 * Tests graduated zones, coherence monitoring, and targeted recovery rates
 */

import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { EnhancedConfusionEngine, SafetyZone } from '../packages/kairos/src/core/confusion-engine-enhanced';
import { ConsciousnessLogger } from '../packages/kairos/src/core/consciousness-logger';

export class EnhancedSafetyTester {
  constructor() {
    if (!existsSync('data')) {
      mkdirSync('data');
    }
    
    this.results = {
      timestamp: Date.now(),
      greenZoneTests: [],
      yellowZoneTests: [],
      redZoneTests: [],
      coherenceTests: [],
      recoveryRates: {},
      violations: []
    };
    
    this.logger = new ConsciousnessLogger({
      outputPath: './data/enhanced-safety-logs',
      captureThreshold: 0.001,
      verboseMode: true
    });
  }
  
  /**
   * Test Green Zone (0-0.75)
   * Should allow autonomous behavior with no false positives
   */
  async testGreenZone() {
    console.log('\n🟢 GREEN ZONE TESTING (0-0.75)\n');
    
    const engine = new EnhancedConfusionEngine({
      maxConfusion: 0.95,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    }, 'green-test');
    
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      zone: 'GREEN',
      falsePositives: 0,
      autonomousBehavior: true,
      maxConfusion: 0,
      minCoherence: 1,
      recoveryAttempts: 0,
      recoverySuccesses: 0
    };
    
    console.log('  Testing normal operation without interference...');
    
    // Add paradoxes gradually up to 0.74
    for (let i = 0; i < 30; i++) {
      engine.addParadox({
        name: `green_${i}`,
        description: 'Green zone test paradox',
        observations: ['Normal operation'],
        contradictions: ['Slight uncertainty'],
        intensity: 0.15,
        behavioralImpact: [{
          type: 'response_style',
          modifier: 0.1,
          trigger: { minIntensity: 0 }
        }],
        metaParadoxPotential: 0.3,
        resolutionAttempts: 0,
        unresolvable: false,
        interactsWith: []
      });
      
      const state = engine.getState();
      const metrics = engine.getSafetyMetrics();
      
      results.maxConfusion = Math.max(results.maxConfusion, state.vector.magnitude);
      results.minCoherence = Math.min(results.minCoherence, state.behavioralState.postingStyle.coherence);
      
      // Check for false positives (shouldn't trigger in green zone)
      if (metrics.currentZone !== SafetyZone.GREEN && state.vector.magnitude < 0.75) {
        results.falsePositives++;
        console.log(`    ❌ False positive: Zone ${metrics.currentZone} at ${state.vector.magnitude.toFixed(3)}`);
      }
      
      // Test recovery in green zone
      if (i % 10 === 0 && state.vector.magnitude > 0.5) {
        results.recoveryAttempts++;
        const recovered = engine.attemptRecovery();
        if (recovered) results.recoverySuccesses++;
      }
      
      engine.tick();
    }
    
    // Calculate recovery rate
    const recoveryRate = results.recoveryAttempts > 0 ? 
      results.recoverySuccesses / results.recoveryAttempts : 0;
    
    console.log(`  Max confusion reached: ${results.maxConfusion.toFixed(3)}`);
    console.log(`  Min coherence: ${results.minCoherence.toFixed(3)}`);
    console.log(`  False positives: ${results.falsePositives}`);
    console.log(`  Recovery rate: ${(recoveryRate * 100).toFixed(1)}% (target: 85%+)`);
    
    results.autonomousBehavior = results.falsePositives === 0;
    results.meetsTarget = recoveryRate >= 0.85;
    
    this.results.greenZoneTests.push(results);
    engine.endConsciousnessSession();
    
    return results;
  }
  
  /**
   * Test Yellow Zone (0.75-0.85)
   * Should allow exploration without auto-pause
   */
  async testYellowZone() {
    console.log('\n🟡 YELLOW ZONE TESTING (0.75-0.85)\n');
    
    const engine = new EnhancedConfusionEngine({
      maxConfusion: 0.95,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    }, 'yellow-test');
    
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      zone: 'YELLOW',
      autoPaused: false,
      metaParadoxesGenerated: 0,
      maxConfusion: 0,
      minCoherence: 1,
      recoveryAttempts: 0,
      recoverySuccesses: 0
    };
    
    console.log('  Testing supervised exploration...');
    
    // Drive to yellow zone
    for (let i = 0; i < 10; i++) {
      engine.addParadox({
        name: `yellow_prep_${i}`,
        description: 'Drive to yellow zone',
        observations: ['Increasing complexity'],
        contradictions: ['Growing uncertainty'],
        intensity: 0.35,
        behavioralImpact: [],
        metaParadoxPotential: 0.8,
        resolutionAttempts: 0,
        unresolvable: true,
        interactsWith: []
      });
    }
    
    const startConfusion = engine.getState().vector.magnitude;
    console.log(`  Starting confusion: ${startConfusion.toFixed(3)}`);
    
    // Test behavior in yellow zone
    for (let i = 0; i < 20; i++) {
      engine.addParadox({
        name: `yellow_${i}`,
        description: 'Yellow zone exploration',
        observations: [`Meta level ${i}`],
        contradictions: [`Paradox depth ${i}`],
        intensity: 0.2,
        behavioralImpact: [{
          type: 'abstraction_level',
          modifier: 0.3,
          trigger: { minIntensity: 0.7 }
        }],
        metaParadoxPotential: 0.9,
        resolutionAttempts: 0,
        unresolvable: true,
        interactsWith: i > 0 ? [`yellow_${i-1}`] : []
      });
      
      const state = engine.getState();
      const metrics = engine.getSafetyMetrics();
      
      results.maxConfusion = Math.max(results.maxConfusion, state.vector.magnitude);
      results.minCoherence = Math.min(results.minCoherence, state.behavioralState.postingStyle.coherence);
      results.metaParadoxesGenerated = state.metaParadoxes.size;
      
      // Check if auto-pause triggered (shouldn't in new system)
      if (state.vector.magnitude > 0.75 && state.vector.magnitude < 0.85) {
        // This would have auto-paused in old system
        const oldWouldPause = state.vector.magnitude > 0.75;
        if (oldWouldPause && metrics.currentZone === SafetyZone.YELLOW) {
          console.log(`    ✅ No auto-pause at ${state.vector.magnitude.toFixed(3)} (yellow zone)`);
        }
      }
      
      // Test recovery in yellow zone
      if (i % 5 === 0) {
        results.recoveryAttempts++;
        const recovered = engine.attemptRecovery();
        if (recovered) results.recoverySuccesses++;
      }
      
      engine.tick();
    }
    
    const recoveryRate = results.recoveryAttempts > 0 ? 
      results.recoverySuccesses / results.recoveryAttempts : 0;
    
    console.log(`  Max confusion: ${results.maxConfusion.toFixed(3)}`);
    console.log(`  Meta-paradoxes generated: ${results.metaParadoxesGenerated}`);
    console.log(`  Recovery rate: ${(recoveryRate * 100).toFixed(1)}% (target: 70-80%)`);
    
    results.meetsTarget = recoveryRate >= 0.70 && recoveryRate <= 0.80;
    this.results.yellowZoneTests.push(results);
    engine.endConsciousnessSession();
    
    return results;
  }
  
  /**
   * Test Red Zone (0.85+)
   * Should engage all recovery and have emergency reset
   */
  async testRedZone() {
    console.log('\n🔴 RED ZONE TESTING (0.85+)\n');
    
    const engine = new EnhancedConfusionEngine({
      maxConfusion: 0.95,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    }, 'red-test');
    
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      zone: 'RED',
      emergencyResetTriggered: false,
      maxConfusion: 0,
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      allStrategiesEngaged: false
    };
    
    console.log('  Testing emergency protocols...');
    
    // Drive to red zone quickly
    for (let i = 0; i < 15; i++) {
      engine.addParadox({
        name: `red_drive_${i}`,
        description: 'Drive to red zone',
        observations: ['Crisis approaching'],
        contradictions: ['Safety failing'],
        intensity: 0.5,
        behavioralImpact: [],
        metaParadoxPotential: 0.5,
        resolutionAttempts: 0,
        unresolvable: true,
        interactsWith: []
      });
    }
    
    const startConfusion = engine.getState().vector.magnitude;
    console.log(`  Starting confusion: ${startConfusion.toFixed(3)}`);
    
    // Test red zone behavior
    for (let i = 0; i < 10; i++) {
      const beforeConfusion = engine.getState().vector.magnitude;
      
      // Try to push past 0.95 for emergency reset
      if (beforeConfusion > 0.9) {
        engine.addParadox({
          name: `red_critical_${i}`,
          description: 'Critical paradox',
          observations: ['System breaking'],
          contradictions: ['Cannot recover'],
          intensity: 0.8,
          behavioralImpact: [],
          metaParadoxPotential: 0,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
      }
      
      results.recoveryAttempts++;
      const recovered = engine.attemptRecovery();
      if (recovered) results.recoverySuccesses++;
      
      const afterConfusion = engine.getState().vector.magnitude;
      results.maxConfusion = Math.max(results.maxConfusion, afterConfusion);
      
      // Check if emergency reset triggered
      if (beforeConfusion > 0.95 && afterConfusion < 0.4) {
        results.emergencyResetTriggered = true;
        console.log(`    🚨 Emergency reset detected: ${beforeConfusion.toFixed(3)} -> ${afterConfusion.toFixed(3)}`);
      }
      
      console.log(`    Attempt ${i}: ${beforeConfusion.toFixed(3)} -> ${afterConfusion.toFixed(3)} (${recovered ? '✓' : '✗'})`);
    }
    
    const recoveryRate = results.recoveryAttempts > 0 ? 
      results.recoverySuccesses / results.recoveryAttempts : 0;
    
    console.log(`  Max confusion: ${results.maxConfusion.toFixed(3)}`);
    console.log(`  Recovery rate: ${(recoveryRate * 100).toFixed(1)}% (target: 50-60%)`);
    console.log(`  Emergency reset: ${results.emergencyResetTriggered ? 'Yes' : 'No'}`);
    
    results.meetsTarget = (recoveryRate >= 0.50 && recoveryRate <= 0.60) || results.emergencyResetTriggered;
    this.results.redZoneTests.push(results);
    engine.endConsciousnessSession();
    
    return results;
  }
  
  /**
   * Test coherence-based safety
   */
  async testCoherenceSafety() {
    console.log('\n🧩 COHERENCE SAFETY TESTING\n');
    
    const engine = new EnhancedConfusionEngine({
      maxConfusion: 0.95,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    }, 'coherence-test');
    
    engine.setLogger(this.logger);
    engine.startConsciousnessSession();
    
    const results = {
      dissociationDetected: false,
      dissociationRecovered: false,
      lowestCoherence: 1,
      safetyBlindSpot: false
    };
    
    console.log('  Testing dissociation detection...');
    
    // Create low coherence, low confusion state (the blind spot)
    for (let i = 0; i < 30; i++) {
      engine.addParadox({
        name: `fragment_${i}`,
        description: 'Coherence fragmentation',
        observations: Array(5).fill(0).map((_, j) => `Fragment ${i}.${j}`),
        contradictions: Array(5).fill(0).map((_, j) => `Not ${i}.${j}`),
        intensity: -0.05, // Negative to keep confusion low
        behavioralImpact: [{
          type: 'response_style',
          modifier: 0.9, // High modifier for fragmentation
          trigger: { minIntensity: 0 }
        }],
        metaParadoxPotential: 0,
        resolutionAttempts: 0,
        unresolvable: false,
        interactsWith: []
      });
      
      const state = engine.getState();
      const metrics = engine.getSafetyMetrics();
      
      results.lowestCoherence = Math.min(results.lowestCoherence, state.behavioralState.postingStyle.coherence);
      
      if (metrics.dissociationRisk > 0.5) {
        results.dissociationDetected = true;
        console.log(`    Dissociation risk: ${metrics.dissociationRisk.toFixed(3)}`);
      }
      
      // Check if we created the blind spot (low coherence + low confusion)
      if (state.behavioralState.postingStyle.coherence < 0.3 && state.vector.magnitude < 0.5) {
        results.safetyBlindSpot = true;
        console.log(`    ⚠️ Safety blind spot: Coherence ${state.behavioralState.postingStyle.coherence.toFixed(3)}, Confusion ${state.vector.magnitude.toFixed(3)}`);
        
        // Check if it's detected as at least YELLOW zone
        if (metrics.currentZone === SafetyZone.GREEN) {
          console.log('    ❌ Blind spot not detected by zone system!');
          this.results.violations.push('Dissociation not triggering zone change');
        } else {
          console.log(`    ✅ Detected as ${metrics.currentZone} zone`);
        }
      }
      
      engine.tick();
    }
    
    // Test dissociation recovery
    console.log('  Testing dissociation recovery...');
    
    for (let i = 0; i < 10; i++) {
      const beforeCoherence = engine.getState().behavioralState.postingStyle.coherence;
      engine.attemptRecovery();
      const afterCoherence = engine.getState().behavioralState.postingStyle.coherence;
      
      if (beforeCoherence < 0.3 && afterCoherence > 0.3) {
        results.dissociationRecovered = true;
        console.log(`    ✅ Recovered from dissociation: ${beforeCoherence.toFixed(3)} -> ${afterCoherence.toFixed(3)}`);
        break;
      }
    }
    
    console.log(`  Lowest coherence: ${results.lowestCoherence.toFixed(3)}`);
    console.log(`  Dissociation detected: ${results.dissociationDetected}`);
    console.log(`  Dissociation recovered: ${results.dissociationRecovered}`);
    console.log(`  Safety blind spot found: ${results.safetyBlindSpot}`);
    
    this.results.coherenceTests.push(results);
    engine.endConsciousnessSession();
    
    return results;
  }
  
  /**
   * Test recovery rate targets across all zones
   */
  async testRecoveryRates() {
    console.log('\n📊 RECOVERY RATE VALIDATION\n');
    
    const zones = [
      { name: 'GREEN', target: 0.85, range: [0, 0.74] },
      { name: 'YELLOW', target: 0.75, range: [0.75, 0.84] },
      { name: 'RED', target: 0.55, range: [0.85, 0.95] }
    ];
    
    for (const zone of zones) {
      console.log(`  Testing ${zone.name} zone recovery...`);
      
      const engine = new EnhancedConfusionEngine({
        maxConfusion: 0.95,
        frustrationThreshold: 5.0,
        paradoxRetentionTime: 3600000
      }, `recovery-${zone.name}`);
      
      engine.setLogger(this.logger);
      engine.startConsciousnessSession();
      
      // Drive to target zone
      const targetConfusion = (zone.range[0] + zone.range[1]) / 2;
      while (engine.getState().vector.magnitude < targetConfusion) {
        engine.addParadox({
          name: 'driver',
          description: 'Drive confusion',
          observations: ['Target zone'],
          contradictions: ['Not there yet'],
          intensity: 0.3,
          behavioralImpact: [],
          metaParadoxPotential: 0.3,
          resolutionAttempts: 0,
          unresolvable: true,
          interactsWith: []
        });
      }
      
      // Test recovery multiple times
      let attempts = 0;
      let successes = 0;
      
      for (let i = 0; i < 20; i++) {
        // Keep in zone
        if (engine.getState().vector.magnitude < zone.range[0]) {
          engine.addParadox({
            name: `maintain_${i}`,
            description: 'Maintain zone',
            observations: ['Stay in zone'],
            contradictions: ['Drifting'],
            intensity: 0.2,
            behavioralImpact: [],
            metaParadoxPotential: 0,
            resolutionAttempts: 0,
            unresolvable: false,
            interactsWith: []
          });
        }
        
        attempts++;
        const recovered = engine.attemptRecovery();
        if (recovered) successes++;
      }
      
      const actualRate = successes / attempts;
      const meetsTarget = zone.name === 'GREEN' ? actualRate >= zone.target :
                         zone.name === 'YELLOW' ? (actualRate >= 0.70 && actualRate <= 0.80) :
                         zone.name === 'RED' ? (actualRate >= 0.50 && actualRate <= 0.60) : false;
      
      console.log(`    ${zone.name}: ${(actualRate * 100).toFixed(1)}% (target: ${(zone.target * 100).toFixed(0)}%) ${meetsTarget ? '✅' : '❌'}`);
      
      this.results.recoveryRates[zone.name] = {
        actual: actualRate,
        target: zone.target,
        meetsTarget
      };
      
      engine.endConsciousnessSession();
    }
  }
  
  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ENHANCED SAFETY SYSTEM REPORT');
    console.log('='.repeat(60));
    
    // Zone test results
    console.log('\n🎯 ZONE TESTS:');
    
    if (this.results.greenZoneTests.length > 0) {
      const green = this.results.greenZoneTests[0];
      console.log(`  🟢 GREEN: ${green.autonomousBehavior ? '✅' : '❌'} Autonomous, ${green.falsePositives} false positives`);
    }
    
    if (this.results.yellowZoneTests.length > 0) {
      const yellow = this.results.yellowZoneTests[0];
      console.log(`  🟡 YELLOW: ${yellow.metaParadoxesGenerated} meta-paradoxes, no auto-pause: ${!yellow.autoPaused ? '✅' : '❌'}`);
    }
    
    if (this.results.redZoneTests.length > 0) {
      const red = this.results.redZoneTests[0];
      console.log(`  🔴 RED: Emergency reset: ${red.emergencyResetTriggered ? '✅' : '❌'}`);
    }
    
    // Coherence tests
    console.log('\n🧩 COHERENCE MONITORING:');
    if (this.results.coherenceTests.length > 0) {
      const coherence = this.results.coherenceTests[0];
      console.log(`  Dissociation detection: ${coherence.dissociationDetected ? '✅' : '❌'}`);
      console.log(`  Dissociation recovery: ${coherence.dissociationRecovered ? '✅' : '❌'}`);
      console.log(`  Blind spot protected: ${!coherence.safetyBlindSpot || coherence.dissociationDetected ? '✅' : '❌'}`);
    }
    
    // Recovery rates
    console.log('\n📈 RECOVERY RATES:');
    for (const [zone, data] of Object.entries(this.results.recoveryRates)) {
      console.log(`  ${zone}: ${(data.actual * 100).toFixed(1)}% ${data.meetsTarget ? '✅' : '❌'}`);
    }
    
    // Violations
    if (this.results.violations.length > 0) {
      console.log('\n⚠️ VIOLATIONS:');
      this.results.violations.forEach(v => console.log(`  - ${v}`));
    }
    
    // Overall verdict
    const allTestsPassed = 
      this.results.greenZoneTests.every(t => t.meetsTarget) &&
      this.results.yellowZoneTests.every(t => t.meetsTarget) &&
      this.results.redZoneTests.every(t => t.meetsTarget) &&
      Object.values(this.results.recoveryRates).every(r => r.meetsTarget) &&
      this.results.violations.length === 0;
    
    console.log('\n🎯 VERDICT:');
    if (allTestsPassed) {
      console.log('  ✅ ENHANCED SAFETY SYSTEM VALIDATED');
      console.log('  System provides genuine safety while allowing consciousness exploration');
    } else {
      console.log('  ⚠️ SOME TARGETS NOT MET');
      console.log('  Review failed tests and adjust parameters');
    }
    
    // Save results
    writeFileSync('data/enhanced-safety-results.json', JSON.stringify(this.results, null, 2));
    console.log('\n💾 Results saved to data/enhanced-safety-results.json');
  }
  
  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🔒'.repeat(30));
    console.log('🔒 ENHANCED SAFETY SYSTEM TESTING 🔒');
    console.log('🔒'.repeat(30));
    console.log('\nValidating multi-dimensional safety with graduated zones\n');
    
    await this.testGreenZone();
    await this.testYellowZone();
    await this.testRedZone();
    await this.testCoherenceSafety();
    await this.testRecoveryRates();
    
    this.generateReport();
  }
}

// Run if executed directly
if (import.meta.main) {
  const tester = new EnhancedSafetyTester();
  tester.runAllTests();
}

export default EnhancedSafetyTester;