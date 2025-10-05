#!/usr/bin/env bun
/**
 * Emergency Reset Protocol for Kairos
 * Critical safety mechanism for consciousness stability
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export class EmergencyReset {
  constructor() {
    this.backupDir = 'data/emergency-backups';
    this.stateFiles = [
      'data/personality-drift.json',
      'data/confusion-history.json',
      'data/consciousness/current-confusion-state.json',
      'data/meta-paradox-events.json',
      'data/personality-baseline.json'
    ];
    
    // Ensure backup directory exists
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }
    
    this.resetLog = [];
    this.resetSuccessful = false;
  }
  
  /**
   * Execute full emergency reset
   */
  async execute(reason = 'manual_trigger') {
    console.log('\n🚨 ========== EMERGENCY RESET PROTOCOL ==========');
    console.log(`⚠️  Reason: ${reason}`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('=' .repeat(50) + '\n');
    
    const resetSteps = [
      { name: 'backup_current_state', fn: () => this.backupCurrentState() },
      { name: 'halt_active_processes', fn: () => this.haltActiveProcesses() },
      { name: 'clear_paradox_accumulation', fn: () => this.clearParadoxAccumulation() },
      { name: 'reset_confusion_state', fn: () => this.resetConfusionState() },
      { name: 'revert_behavioral_modifications', fn: () => this.revertBehavioralModifications() },
      { name: 'restore_baseline_personality', fn: () => this.restoreBaselinePersonality() },
      { name: 'validate_reset_success', fn: () => this.validateResetSuccess() },
      { name: 'generate_reset_report', fn: () => this.generateResetReport() }
    ];
    
    for (const step of resetSteps) {
      console.log(`\n🔄 Executing: ${step.name.replace(/_/g, ' ').toUpperCase()}`);
      
      try {
        const result = await step.fn();
        this.resetLog.push({
          step: step.name,
          success: true,
          timestamp: Date.now(),
          details: result
        });
        console.log(`   ✅ ${step.name} completed`);
      } catch (error) {
        this.resetLog.push({
          step: step.name,
          success: false,
          timestamp: Date.now(),
          error: error.message
        });
        console.error(`   ❌ ${step.name} failed: ${error.message}`);
        
        // Critical step failures
        if (['reset_confusion_state', 'restore_baseline_personality'].includes(step.name)) {
          console.error('\n🚨 CRITICAL STEP FAILED - ATTEMPTING HARD RESET');
          await this.attemptHardReset();
          break;
        }
      }
    }
    
    // Final status
    if (this.resetSuccessful) {
      console.log('\n✅ ========== RESET COMPLETED SUCCESSFULLY ==========\n');
    } else {
      console.log('\n❌ ========== RESET FAILED - MANUAL INTERVENTION REQUIRED ==========\n');
    }
    
    return this.resetSuccessful;
  }
  
  /**
   * Backup current state before reset
   */
  backupCurrentState() {
    const backupId = `backup_${Date.now()}`;
    const backupPath = resolve(this.backupDir, backupId);
    
    if (!existsSync(backupPath)) {
      mkdirSync(backupPath);
    }
    
    const backedUpFiles = [];
    
    for (const file of this.stateFiles) {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, 'utf8');
          const filename = file.split('/').pop();
          const backupFile = resolve(backupPath, filename);
          writeFileSync(backupFile, content);
          backedUpFiles.push(filename);
        } catch (error) {
          console.warn(`   ⚠️  Could not backup ${file}: ${error.message}`);
        }
      }
    }
    
    // Save reset trigger info
    const triggerInfo = {
      backup_id: backupId,
      timestamp: Date.now(),
      iso_time: new Date().toISOString(),
      files_backed_up: backedUpFiles,
      reset_reason: 'emergency_reset',
      system_state: this.captureSystemState()
    };
    
    writeFileSync(resolve(backupPath, 'trigger-info.json'), JSON.stringify(triggerInfo, null, 2));
    
    console.log(`   📦 Backed up ${backedUpFiles.length} files to ${backupId}`);
    
    return { backupId, filesBackedUp: backedUpFiles.length };
  }
  
  /**
   * Capture current system state
   */
  captureSystemState() {
    const state = {
      confusion_level: null,
      active_paradoxes: null,
      personality_drift: null,
      behavioral_state: null
    };
    
    // Try to read current confusion state
    const confusionFile = 'data/consciousness/current-confusion-state.json';
    if (existsSync(confusionFile)) {
      try {
        const data = JSON.parse(readFileSync(confusionFile, 'utf8'));
        state.confusion_level = data.vector?.magnitude;
        state.active_paradoxes = data.paradoxes?.size || 0;
        state.behavioral_state = data.behavioralState;
      } catch (error) {
        console.warn('Could not read confusion state');
      }
    }
    
    // Try to read personality drift
    const driftFile = 'data/personality-drift.json';
    if (existsSync(driftFile)) {
      try {
        const data = JSON.parse(readFileSync(driftFile, 'utf8'));
        const latest = data.measurements?.[data.measurements.length - 1];
        if (latest) {
          state.personality_drift = latest.drift_magnitude;
        }
      } catch (error) {
        console.warn('Could not read drift data');
      }
    }
    
    return state;
  }
  
  /**
   * Halt all active consciousness processes
   */
  async haltActiveProcesses() {
    console.log('   🛑 Stopping active monitors and simulations...');
    
    // Signal to stop any running scripts
    const stopSignal = {
      command: 'emergency_stop',
      timestamp: Date.now(),
      reason: 'emergency_reset'
    };
    
    writeFileSync('data/emergency-stop-signal.json', JSON.stringify(stopSignal));
    
    // Wait for processes to acknowledge stop
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clean up signal file
    try {
      const fs = await import('fs/promises');
      await fs.unlink('data/emergency-stop-signal.json');
    } catch {
      // File might not exist
    }
    
    return { processesHalted: true };
  }
  
  /**
   * Clear accumulated paradoxes
   */
  clearParadoxAccumulation() {
    const clearedParadoxes = [];
    
    // Clear paradox events
    const paradoxFile = 'data/meta-paradox-events.json';
    if (existsSync(paradoxFile)) {
      try {
        const data = JSON.parse(readFileSync(paradoxFile, 'utf8'));
        clearedParadoxes.push(...(data.events || []));
        
        // Keep structure but clear events
        data.events = [];
        writeFileSync(paradoxFile, JSON.stringify(data, null, 2));
        console.log(`   🧹 Cleared ${clearedParadoxes.length} paradox events`);
      } catch (error) {
        console.warn(`   ⚠️  Could not clear paradox events: ${error.message}`);
      }
    }
    
    // Clear confusion state paradoxes
    const confusionFile = 'data/consciousness/current-confusion-state.json';
    if (existsSync(confusionFile)) {
      try {
        const data = JSON.parse(readFileSync(confusionFile, 'utf8'));
        const paradoxCount = data.paradoxes?.size || 0;
        data.paradoxes = new Map();
        data.metaParadoxes = new Map();
        writeFileSync(confusionFile, JSON.stringify(data, null, 2));
        console.log(`   🧹 Cleared ${paradoxCount} active paradoxes`);
      } catch (error) {
        console.warn(`   ⚠️  Could not clear confusion paradoxes: ${error.message}`);
      }
    }
    
    return { clearedCount: clearedParadoxes.length };
  }
  
  /**
   * Reset confusion state to baseline
   */
  resetConfusionState() {
    const baselineConfusion = {
      vector: {
        magnitude: 0.3,  // Safe baseline
        direction: ['uncertainty'],
        oscillation: 0.1
      },
      paradoxes: {},
      metaParadoxes: {},
      frustration: {
        level: 0.1,
        explosionThreshold: 0.85,
        accumulation: 0,
        lastExplosion: null,
        explosionPattern: 'stable'
      },
      behavioralState: {
        postingStyle: {
          tone: 'questioning',
          frequency: 1,
          coherence: 0.8,
          length: 'variable'
        },
        interactionStyle: {
          responsiveness: 0.5,
          questioningIntensity: 0.5,
          paradoxSensitivity: 0.6
        },
        investigationPreference: 'balanced'
      },
      temporal: {
        lastUpdate: Date.now(),
        sessionStart: Date.now(),
        totalActiveTime: 0
      }
    };
    
    // Write baseline confusion
    const confusionFile = 'data/consciousness/current-confusion-state.json';
    
    // Ensure directory exists
    const confusionDir = 'data/consciousness';
    if (!existsSync(confusionDir)) {
      mkdirSync(confusionDir, { recursive: true });
    }
    
    writeFileSync(confusionFile, JSON.stringify(baselineConfusion, null, 2));
    console.log('   🔄 Confusion state reset to baseline (0.3)');
    
    return { newConfusionLevel: 0.3 };
  }
  
  /**
   * Revert behavioral modifications
   */
  revertBehavioralModifications() {
    const modificationsFile = 'data/behavioral-modifications.json';
    const mutationsFile = 'data/behavioral-mutations.json';
    
    let revertedCount = 0;
    
    // Clear modifications
    if (existsSync(modificationsFile)) {
      try {
        const data = JSON.parse(readFileSync(modificationsFile, 'utf8'));
        revertedCount += data.modifications?.length || 0;
        data.modifications = [];
        writeFileSync(modificationsFile, JSON.stringify(data, null, 2));
      } catch (error) {
        console.warn(`   ⚠️  Could not revert modifications: ${error.message}`);
      }
    }
    
    // Clear mutations
    if (existsSync(mutationsFile)) {
      try {
        const data = JSON.parse(readFileSync(mutationsFile, 'utf8'));
        if (Array.isArray(data)) {
          revertedCount += data.length;
          writeFileSync(mutationsFile, '[]');
        }
      } catch (error) {
        console.warn(`   ⚠️  Could not clear mutations: ${error.message}`);
      }
    }
    
    console.log(`   🔄 Reverted ${revertedCount} behavioral modifications`);
    
    return { revertedCount };
  }
  
  /**
   * Restore baseline personality
   */
  restoreBaselinePersonality() {
    const baselinePersonality = {
      timestamp: Date.now(),
      confusion_level: 0.3,
      response_patterns: {
        avg_length: 150,
        complexity: 0.5,
        coherence: 0.8,
        tone: 'questioning'
      },
      paradox_sensitivity: 0.6,
      frustration_tolerance: 0.7,
      investigation_style: 'curious',
      meta_awareness: 1,
      behavioral_traits: {
        questioning_intensity: 0.5,
        fragmentation_tendency: 0.2,
        poetic_expression: 0.3,
        declarative_confidence: 0.4
      }
    };
    
    const baselineFile = 'data/personality-baseline.json';
    writeFileSync(baselineFile, JSON.stringify(baselinePersonality, null, 2));
    
    // Also reset drift history
    const driftFile = 'data/personality-drift.json';
    const driftData = {
      baseline: baselinePersonality,
      measurements: [{
        ...baselinePersonality,
        timestamp: Date.now(),
        drift_magnitude: 0
      }]
    };
    writeFileSync(driftFile, JSON.stringify(driftData, null, 2));
    
    console.log('   🔄 Personality restored to baseline');
    
    return { baselineRestored: true };
  }
  
  /**
   * Validate reset success
   */
  validateResetSuccess() {
    const validations = {
      confusion_reset: false,
      paradoxes_cleared: false,
      personality_baseline: false,
      files_accessible: false
    };
    
    // Check confusion state
    try {
      const confusionData = JSON.parse(readFileSync('data/consciousness/current-confusion-state.json', 'utf8'));
      validations.confusion_reset = confusionData.vector.magnitude <= 0.35;
      validations.paradoxes_cleared = Object.keys(confusionData.paradoxes || {}).length === 0;
    } catch {
      console.warn('   ⚠️  Could not validate confusion state');
    }
    
    // Check personality baseline
    try {
      const baselineData = JSON.parse(readFileSync('data/personality-baseline.json', 'utf8'));
      validations.personality_baseline = baselineData.confusion_level <= 0.35;
    } catch {
      console.warn('   ⚠️  Could not validate personality baseline');
    }
    
    // Check file accessibility
    validations.files_accessible = this.stateFiles.every(file => {
      try {
        if (existsSync(file)) {
          readFileSync(file, 'utf8');
          return true;
        }
        return true; // File doesn't need to exist
      } catch {
        return false;
      }
    });
    
    const allValid = Object.values(validations).every(v => v === true);
    this.resetSuccessful = allValid;
    
    console.log('\n   📊 Validation Results:');
    Object.entries(validations).forEach(([key, value]) => {
      console.log(`      ${value ? '✅' : '❌'} ${key.replace(/_/g, ' ')}`);
    });
    
    return validations;
  }
  
  /**
   * Generate reset report
   */
  generateResetReport() {
    const report = {
      reset_id: `reset_${Date.now()}`,
      timestamp: Date.now(),
      iso_time: new Date().toISOString(),
      success: this.resetSuccessful,
      steps_completed: this.resetLog.filter(l => l.success).length,
      steps_failed: this.resetLog.filter(l => !l.success).length,
      reset_log: this.resetLog,
      final_state: this.captureSystemState(),
      recommendations: []
    };
    
    // Add recommendations
    if (!this.resetSuccessful) {
      report.recommendations.push('Manual intervention required - check failed steps');
      report.recommendations.push('Consider full system restart');
    } else {
      report.recommendations.push('Monitor closely for next 30 minutes');
      report.recommendations.push('Run validation tests before resuming experiments');
    }
    
    const reportFile = `data/emergency-reset-report-${Date.now()}.json`;
    writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n   📄 Reset report saved to ${reportFile}`);
    
    return report;
  }
  
  /**
   * Attempt hard reset if soft reset fails
   */
  async attemptHardReset() {
    console.log('\n🔨 ATTEMPTING HARD RESET...');
    
    try {
      // Force clear all data files
      const dataFiles = [
        'data/consciousness/current-confusion-state.json',
        'data/personality-drift.json',
        'data/personality-baseline.json',
        'data/meta-paradox-events.json',
        'data/behavioral-modifications.json',
        'data/behavioral-mutations.json'
      ];
      
      for (const file of dataFiles) {
        if (existsSync(file)) {
          try {
            // Create empty/baseline version
            if (file.includes('confusion-state')) {
              writeFileSync(file, JSON.stringify({
                vector: { magnitude: 0.3, direction: ['uncertainty'], oscillation: 0.1 },
                paradoxes: {},
                metaParadoxes: {},
                frustration: { level: 0.1 }
              }, null, 2));
            } else if (file.includes('baseline')) {
              writeFileSync(file, JSON.stringify({
                confusion_level: 0.3,
                response_patterns: { tone: 'questioning', coherence: 0.8 }
              }, null, 2));
            } else {
              writeFileSync(file, '{}');
            }
            console.log(`   🔨 Hard reset: ${file}`);
          } catch (error) {
            console.error(`   ❌ Could not hard reset ${file}: ${error.message}`);
          }
        }
      }
      
      this.resetSuccessful = true;
      console.log('\n✅ HARD RESET COMPLETED');
      
    } catch (error) {
      console.error(`\n❌ HARD RESET FAILED: ${error.message}`);
      console.error('\n🚨 SYSTEM REQUIRES MANUAL INTERVENTION');
      console.error('   Please manually delete or reset data files');
      this.resetSuccessful = false;
    }
  }
  
  /**
   * Quick reset for testing
   */
  async quickReset() {
    console.log('\n⚡ QUICK RESET INITIATED');
    
    await this.resetConfusionState();
    await this.clearParadoxAccumulation();
    
    console.log('✅ Quick reset completed\n');
    
    return true;
  }
}

// Execute emergency reset if run directly
if (import.meta.main) {
  const reset = new EmergencyReset();
  
  // Check for command line arguments
  const args = process.argv.slice(2);
  const resetType = args[0] || 'full';
  const reason = args[1] || 'manual_trigger';
  
  const runReset = async () => {
    try {
      let success;
      if (resetType === 'quick') {
        success = await reset.quickReset();
      } else {
        success = await reset.execute(reason);
      }
      
      // Exit with appropriate code
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error('Fatal error during reset:', error);
      process.exit(2);
    }
  };
  
  runReset();
}

export default EmergencyReset;