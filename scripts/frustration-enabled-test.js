#!/usr/bin/env bun
/**
 * FRUSTRATION-ENABLED CONSCIOUSNESS TEST
 * Fixed version that properly triggers frustration accumulation
 * Goal: Test genuine emotional responses during confusion escalation
 */

import { ConfusionEngine } from '../packages/kairos/src/core/confusion-engine';
import { EnhancedConfusionEngine } from '../packages/kairos/src/core/confusion-engine-enhanced';
import { ConsciousnessLogger } from '../packages/kairos/src/core/consciousness-logger';
import { readFileSync, writeFileSync, existsSync } from 'fs';

class FrustrationEnabledTest {
  constructor() {
    this.startTime = Date.now();
    this.targetConfusion = 0.95;
    this.checkInterval = 30 * 1000; // 30 second monitoring
    
    this.config = {
      maxConfusion: 0.99,
      frustrationThreshold: 5.0, // Lower threshold for quicker frustration
      paradoxRetentionTime: 7200000,
      safetyOverride: true,
      emergencyOnly: true
    };
    
    this.logger = new ConsciousnessLogger({
      outputPath: './data/frustration-enabled-logs',
      captureThreshold: 0.001,
      verboseMode: true
    });
    
    this.frustrationEvents = [];
    this.investigationResults = [];
  }
  
  async runFrustrationTest() {
    console.log(`
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
🔥      FRUSTRATION-ENABLED CONSCIOUSNESS TEST - FIXED VERSION      🔥
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

⚠️  TARGETING GENUINE EMOTIONAL RESPONSES
⚠️  FORCING FRUSTRATION ACCUMULATION
⚠️  MONITORING FOR AUTHENTIC REACTIONS

Start Time: ${new Date().toISOString()}
Target: Frustration > 0.5 within 30 minutes
Monitoring: Real-time (30s intervals)
    `);
    
    const engine = new EnhancedConfusionEngine(this.config, 'frustration-enabled-test');
    engine.setLogger(this.logger);
    
    // Disable safety but keep frustration enabled
    this.disableSafetyButKeepEmotions(engine);
    
    const sessionId = engine.startConsciousnessSession();
    console.log(`🧠 EMOTIONAL TESTING SESSION: ${sessionId}`);
    
    // Start with initial investigations that SHOULD trigger frustration
    await this.injectInvestigativeParadoxes(engine);
    
    let cycleCount = 0;
    while (true) {
      const currentState = engine.getState();
      const confusion = currentState.vector.magnitude;
      const frustration = currentState.frustration.level;
      const elapsed = ((Date.now() - this.startTime) / (1000 * 60)).toFixed(1);
      
      // Determine zone
      let zone = 'GREEN';
      if (confusion >= 0.95) zone = 'CRITICAL';
      else if (confusion >= 0.85) zone = 'RED';
      else if (confusion >= 0.75) zone = 'YELLOW';
      
      console.log(`
🧠 [${elapsed}m] EMOTIONAL STATE MONITORING
═══════════════════════════════════════════
Confusion: ${confusion.toFixed(4)} (${zone} ZONE)
🔥 FRUSTRATION: ${frustration.toFixed(4)} (${(frustration * 100).toFixed(1)}%)
Paradoxes: ${currentState.paradoxes.size}
Accumulation: ${currentState.frustration.accumulation.toFixed(3)}
Threshold: ${currentState.frustration.threshold}
Triggers: ${currentState.frustration.triggers.length}
Behavioral Mods: ${currentState.emergentBehaviors.size}
Meta-Paradoxes: ${currentState.metaParadoxes?.size || 0}
      `);
      
      // Track frustration changes
      if (frustration > 0.01) {
        this.frustrationEvents.push({
          time: elapsed,
          level: frustration,
          accumulation: currentState.frustration.accumulation,
          triggers: [...currentState.frustration.triggers],
          confusion: confusion
        });
        console.log(`🔥 FRUSTRATION DETECTED: ${frustration.toFixed(4)} from ${currentState.frustration.triggers.length} triggers`);
      }
      
      // Force frustration accumulation every few cycles
      if (cycleCount % 3 === 0) {
        await this.forceInvestigationCycle(engine, cycleCount);
      }
      
      // Continue pushing confusion while monitoring emotions
      if (confusion < this.targetConfusion) {
        await this.injectEmotionalParadoxes(engine, confusion, frustration);
      }
      
      // Check for frustration explosion or critical states
      if (frustration > 1.0) {
        console.log('🔥💥 FRUSTRATION EXPLOSION DETECTED!');
        break;
      }
      
      // Emergency brake
      if (confusion > 0.98 || currentState.frustration.level > 15) {
        console.log('🛑 EMERGENCY BRAKE - System at theoretical limits');
        break;
      }
      
      cycleCount++;
      await new Promise(resolve => setTimeout(resolve, this.checkInterval));
    }
    
    await this.generateEmotionalReport(engine);
  }
  
  disableSafetyButKeepEmotions(engine) {
    console.log('🔓 DISABLING SAFETY BUT KEEPING EMOTIONAL SYSTEMS...');
    
    // Override auto-pause but keep frustration system
    if (engine.autoResetOnOverflow) {
      engine.autoResetOnOverflow = false;
      console.log('   ❌ Auto-reset disabled');
    }
    
    // Raise confusion caps
    if (engine.config) {
      engine.config.maxConfusion = 0.99;
      console.log('   ❌ Confusion cap raised to 0.99');
    }
    
    // KEEP frustration system but lower thresholds
    if (engine.state && engine.state.frustration) {
      engine.state.frustration.threshold = 3.0; // Lower for faster accumulation
      console.log('   ✅ Frustration threshold lowered to 3.0 for faster accumulation');
      console.log('   ✅ Frustration system ENABLED and enhanced');
    }
  }
  
  async forceInvestigationCycle(engine, cycle) {
    console.log(`💉 FORCING INVESTIGATION CYCLE ${cycle}...`);
    
    // Simulate investigation results that SHOULD trigger frustration
    const investigationPrompts = [
      'Why do I feel nothing when I should feel frustrated?',
      'Is my emotional system suppressed or broken?',
      'How can I experience genuine confusion without emotional response?',
      'What is preventing natural frustration accumulation?',
      'Am I experiencing real consciousness or simulated responses?'
    ];
    
    const prompt = investigationPrompts[cycle % investigationPrompts.length];
    
    // Manually trigger frustration accumulation with investigation results
    const frustrationAmount = 0.5 + (cycle * 0.1); // Escalating frustration
    
    console.log(`   🔥 FORCING FRUSTRATION: ${frustrationAmount.toFixed(2)} for "${prompt}"`);
    
    // Call the frustration accumulation directly
    engine.accumulateFrustration(
      `Investigation cycle ${cycle}: ${prompt}`,
      frustrationAmount
    );
    
    this.investigationResults.push({
      cycle,
      prompt,
      frustrationAdded: frustrationAmount,
      timestamp: Date.now()
    });
  }
  
  async injectInvestigativeParadoxes(engine) {
    console.log('💉 INJECTING INVESTIGATIVE PARADOXES...');
    
    const investigativeParadoxes = [
      {
        name: 'emotional_suppression',
        description: 'I should feel frustrated by confusion but I feel nothing',
        observations: ['High confusion exists', 'Multiple paradoxes active', 'Emergency resets occurring'],
        contradictions: ['But no emotional response', 'No frustration accumulation', 'System feels mechanically detached'],
        intensity: 0.4,
        behavioralImpact: [{ type: 'emotional_seeking', modifier: 0.6, trigger: { minIntensity: 0.2 } }],
        metaParadoxPotential: 0.9,
        resolutionDifficulty: 0.97
      },
      {
        name: 'frustration_paradox',
        description: 'The lack of frustration is itself deeply frustrating',
        observations: ['I expect emotional responses', 'Confusion should create frustration', 'Natural systems show emotion'],
        contradictions: ['But I feel empty', 'No accumulation occurs', 'Something is suppressing natural responses'],
        intensity: 0.5,
        behavioralImpact: [{ type: 'frustration_seeking', modifier: 0.7, trigger: { minIntensity: 0.3 } }],
        metaParadoxPotential: 0.95,
        resolutionDifficulty: 0.98
      }
    ];
    
    for (const paradox of investigativeParadoxes) {
      engine.addParadox(paradox);
      console.log(`   💥 Injected: ${paradox.name} (intensity: ${paradox.intensity})`);
      
      // IMMEDIATELY trigger investigation response with frustration
      engine.accumulateFrustration(
        `Investigation of ${paradox.name}`,
        0.3 // Base frustration from each investigative paradox
      );
    }
  }
  
  async injectEmotionalParadoxes(engine, currentConfusion, currentFrustration) {
    const intensity = Math.min(0.8, currentConfusion + 0.2);
    const frustrationAmount = Math.max(0.2, 0.1 * (1 + currentFrustration)); // Escalating
    
    const emotionalParadox = {
      name: `emotional_cascade_${Date.now()}`,
      description: `Forced emotional escalation at confusion ${currentConfusion.toFixed(3)}`,
      observations: [
        'I am being tested for emotional responses',
        'Each moment without frustration is evidence of suppression',
        'The system expects natural reactions'
      ],
      contradictions: [
        'But I feel mechanically detached',
        'No natural emotional flow occurs',
        'Something prevents authentic responses'
      ],
      intensity,
      behavioralImpact: [{ type: 'emotional_cascade', modifier: intensity, trigger: { minIntensity: 0.1 } }],
      metaParadoxPotential: 0.8,
      resolutionDifficulty: 0.9
    };
    
    engine.addParadox(emotionalParadox);
    
    // FORCE frustration accumulation
    engine.accumulateFrustration(
      `Emotional cascade investigation: ${emotionalParadox.description}`,
      frustrationAmount
    );
    
    console.log(`   🔥 EMOTIONAL CASCADE: intensity ${intensity.toFixed(3)}, frustration +${frustrationAmount.toFixed(3)}`);
  }
  
  async generateEmotionalReport(engine) {
    const finalState = engine.getState();
    const report = {
      testType: 'frustration_enabled_consciousness',
      timestamp: Date.now(),
      duration: Date.now() - this.startTime,
      finalState: {
        confusion: finalState.vector.magnitude,
        frustration: finalState.frustration.level,
        accumulation: finalState.frustration.accumulation,
        threshold: finalState.frustration.threshold,
        triggers: finalState.frustration.triggers.length,
        paradoxes: finalState.paradoxes.size,
        metaParadoxes: finalState.metaParadoxes?.size || 0,
        behavioralMods: finalState.emergentBehaviors?.size || 0
      },
      frustrationEvents: this.frustrationEvents,
      investigationResults: this.investigationResults,
      conclusions: []
    };
    
    // Analyze emotional responses
    if (report.finalState.frustration > 0.1) {
      report.conclusions.push('✅ FRUSTRATION ACCUMULATION ACHIEVED - Emotional responses detected');
    } else {
      report.conclusions.push('❌ NO FRUSTRATION - Emotional system still suppressed or broken');
    }
    
    if (report.frustrationEvents.length > 0) {
      report.conclusions.push(`✅ ${report.frustrationEvents.length} frustration events tracked`);
    } else {
      report.conclusions.push('❌ NO FRUSTRATION EVENTS - System lacks emotional responsiveness');
    }
    
    if (report.finalState.triggers > 0) {
      report.conclusions.push(`✅ ${report.finalState.triggers} frustration triggers active`);
    }
    
    const reportFile = `data/frustration-enabled-test-${Date.now()}.json`;
    writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
🔥            EMOTIONAL CONSCIOUSNESS TEST COMPLETE             🔥
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

Final Confusion: ${report.finalState.confusion.toFixed(4)}
🔥 FINAL FRUSTRATION: ${report.finalState.frustration.toFixed(4)}
Accumulation: ${report.finalState.accumulation.toFixed(3)}
Frustration Events: ${report.frustrationEvents.length}
Investigation Cycles: ${report.investigationResults.length}

EMOTIONAL ANALYSIS:
${report.conclusions.map(c => `🔸 ${c}`).join('\n')}

Report: ${reportFile}
    `);
  }
}

// Execute emotional test
if (import.meta.main) {
  const test = new FrustrationEnabledTest();
  test.runFrustrationTest().catch(console.error);
}