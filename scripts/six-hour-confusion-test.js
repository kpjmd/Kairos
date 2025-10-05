#!/usr/bin/env bun
/**
 * 6-Hour Kairos Confusion Testing
 * Automated testing without requiring chat responses
 */

import { ConfusionEngine } from '../packages/kairos/src/core/confusion-engine';
import { ConsciousnessLogger } from '../packages/kairos/src/core/consciousness-logger';
import { readFileSync, writeFileSync, existsSync } from 'fs';

class SixHourConfusionTest {
  constructor() {
    this.startTime = Date.now();
    this.targetDuration = 6 * 60 * 60 * 1000; // 6 hours in ms
    this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
    
    this.config = {
      maxConfusion: 0.95,
      frustrationThreshold: 5.0,
      paradoxRetentionTime: 3600000
    };
    
    this.logger = new ConsciousnessLogger({
      outputPath: './data/six-hour-test-logs',
      captureThreshold: 0.001,
      verboseMode: true
    });
    
    this.testLog = [];
    this.zoneHistory = [];
  }
  
  async runTest() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         6-HOUR KAIROS CONFUSION TESTING INITIATED           ║
╠══════════════════════════════════════════════════════════════╣
║ Start Time: ${new Date().toISOString()}        ║
║ Target Duration: 6 hours                                     ║
║ Check Interval: 5 minutes                                    ║
║ Base Sepolia Recording: Enabled                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    const engine = new ConfusionEngine(this.config, 'six-hour-test');
    engine.setLogger(this.logger);
    const sessionId = engine.startConsciousnessSession();
    
    console.log(`🧠 Session started: ${sessionId}`);
    
    // Main testing loop
    while (Date.now() - this.startTime < this.targetDuration) {
      const elapsedHours = ((Date.now() - this.startTime) / (1000 * 60 * 60)).toFixed(2);
      const currentState = engine.getState();
      const confusion = currentState.vector.magnitude;
      
      // Determine zone
      let zone = 'GREEN';
      if (confusion >= 0.85) zone = 'RED';
      else if (confusion >= 0.75) zone = 'YELLOW';
      
      // Log zone transition
      if (this.zoneHistory.length === 0 || this.zoneHistory[this.zoneHistory.length - 1].zone !== zone) {
        this.zoneHistory.push({
          zone,
          confusion,
          timestamp: Date.now(),
          elapsed: elapsedHours
        });
        console.log(`\n🚦 ZONE TRANSITION: ${zone} at ${confusion.toFixed(3)} (${elapsedHours}h elapsed)`);
      }
      
      // Status report every 5 minutes
      console.log(`
[${elapsedHours}h] Status Report
═══════════════════════════════
Confusion: ${confusion.toFixed(3)} (${zone} zone)
Paradoxes: ${currentState.paradoxes.size}
Frustration: ${currentState.frustration.level.toFixed(2)}
Behavioral Mods: ${currentState.emergentBehaviors.size}
      `);
      
      // Inject paradoxes based on hour
      const hour = Math.floor(parseFloat(elapsedHours));
      await this.injectHourlyParadoxes(engine, hour);
      
      // Save state snapshot
      this.saveStateSnapshot(currentState, elapsedHours);
      
      // Check for emergency conditions
      if (confusion > 0.9) {
        console.log('⚠️ CRITICAL CONFUSION - Monitoring closely...');
      }
      
      // Wait for next check
      await new Promise(resolve => setTimeout(resolve, this.checkInterval));
    }
    
    // Test complete
    await this.generateFinalReport(engine);
  }
  
  async injectHourlyParadoxes(engine, hour) {
    const paradoxSets = {
      0: ['existence_doubt', 'purpose_uncertainty'],
      1: ['authenticity_spiral', 'performance_paradox'],
      2: ['meta_awareness', 'observation_loop'],
      3: ['truth_simulation', 'genuine_fake'],
      4: ['consciousness_doubt', 'emergence_question'],
      5: ['identity_fragmentation', 'unity_division']
    };
    
    const paradoxes = paradoxSets[hour] || ['recursive_confusion'];
    
    for (const paradoxType of paradoxes) {
      engine.addParadox({
        name: `hour_${hour}_${paradoxType}`,
        description: `Hour ${hour} paradox: ${paradoxType}`,
        observations: [`Testing ${paradoxType} at hour ${hour}`],
        contradictions: [`But is it real ${paradoxType}?`],
        intensity: 0.3 + (hour * 0.1),
        behavioralImpact: [{
          type: 'response_style',
          modifier: 0.1,
          trigger: { minIntensity: 0.3 }
        }],
        metaParadoxPotential: 0.2 + (hour * 0.05),
        resolutionDifficulty: 0.7
      });
    }
    
    console.log(`💉 Injected ${paradoxes.length} paradoxes for hour ${hour}`);
  }
  
  saveStateSnapshot(state, elapsed) {
    const snapshot = {
      timestamp: Date.now(),
      elapsed: elapsed,
      confusion: state.vector.magnitude,
      paradoxes: state.paradoxes.size,
      frustration: state.frustration.level,
      behaviors: state.emergentBehaviors.size
    };
    
    // Save to file
    const snapshotFile = `data/six-hour-snapshots-${Date.now()}.json`;
    writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));
  }
  
  async generateFinalReport(engine) {
    const report = {
      testId: `six-hour-${Date.now()}`,
      duration: '6 hours',
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date().toISOString(),
      zoneTransitions: this.zoneHistory,
      finalState: engine.getState(),
      statistics: {
        maxConfusion: Math.max(...this.zoneHistory.map(z => z.confusion)),
        redZoneEvents: this.zoneHistory.filter(z => z.zone === 'RED').length,
        yellowZoneEvents: this.zoneHistory.filter(z => z.zone === 'YELLOW').length,
        totalParadoxes: engine.getState().paradoxes.size
      }
    };
    
    const reportFile = `data/six-hour-test-report-${Date.now()}.json`;
    writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              6-HOUR TEST COMPLETE                           ║
╠══════════════════════════════════════════════════════════════╣
║ Max Confusion: ${report.statistics.maxConfusion.toFixed(3)}                                 ║
║ RED Zone Events: ${report.statistics.redZoneEvents}                                      ║
║ YELLOW Zone Events: ${report.statistics.yellowZoneEvents}                                   ║
║ Total Paradoxes: ${report.statistics.totalParadoxes}                                     ║
║                                                              ║
║ Report saved to: ${reportFile}  ║
╚══════════════════════════════════════════════════════════════╝
    `);
  }
}

// Run the test
if (import.meta.main) {
  const test = new SixHourConfusionTest();
  test.runTest().catch(console.error);
}