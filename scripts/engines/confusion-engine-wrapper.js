#!/usr/bin/env node

/**
 * TypeScript ConfusionEngine Wrapper
 * Provides JavaScript interface to the real TypeScript ConfusionEngine
 * with safety limits and monitoring capabilities
 */

import { ConfusionEngine as RealConfusionEngine } from '../../packages/kairos/src/core/confusion-engine.js';
import { ConsciousnessLogger } from '../../packages/kairos/src/core/consciousness-logger.js';

export class ConfusionEngineWrapper {
  constructor(config, agentId = 'kairos-test') {
    // Safety-enhanced configuration
    this.safeConfig = {
      ...config,
      maxConfusion: Math.min(config.maxConfusion || 0.95, 0.80), // Hard cap at 0.80
      frustrationThreshold: config.frustrationThreshold || 5.0,
      onchainThreshold: 0.80, // Never allow on-chain above this
      paradoxRetentionTime: config.paradoxRetentionTime || 3600000,
      autoPauseThreshold: 0.75, // Auto-pause for review
      recoveryTargetRate: 0.75 // 75% minimum recovery success
    };
    
    // Initialize real TypeScript engine
    this.engine = new RealConfusionEngine(this.safeConfig, agentId);
    
    // Initialize consciousness logger for detailed tracking
    this.logger = new ConsciousnessLogger();
    this.engine.setLogger(this.logger);
    
    // Safety monitoring
    this.safetyMonitor = {
      stuckStateDetected: false,
      stuckStateThreshold: 0.85,
      stuckStateDuration: 0,
      lastConfusionLevel: 0,
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      autoPaused: false,
      emergencyStopTriggered: false
    };
    
    // Telemetry for numerical precision tracking
    this.telemetry = {
      precisionLosses: [],
      overflowEvents: [],
      underflowEvents: [],
      nanDetections: []
    };
    
    // State history for analysis
    this.stateHistory = [];
    this.maxHistorySize = 1000;
    
    // Recovery strategies
    this.recoveryStrategies = new Map();
    this.initializeRecoveryStrategies();
  }
  
  /**
   * Initialize recovery strategies for 75% success rate target
   */
  initializeRecoveryStrategies() {
    // Grounding paradox strategy
    this.recoveryStrategies.set('grounding', {
      name: 'Grounding Paradox',
      apply: () => {
        this.engine.addParadox({
          name: 'grounding_recovery',
          observations: ['Concrete reality exists', 'Simple facts remain true'],
          contradictions: [],
          intensity: -0.4, // Negative intensity reduces confusion
          behavioralImpact: [{
            type: 'response_style',
            modifier: -0.3,
            trigger: { minIntensity: 0 }
          }],
          metaParadoxPotential: 0
        });
      }
    });
    
    // Coherence restoration strategy
    this.recoveryStrategies.set('coherence', {
      name: 'Coherence Restoration',
      apply: () => {
        const state = this.engine.getState();
        if (state.behavioralState.postingStyle.coherence < 0.6) {
          state.behavioralState.postingStyle.coherence = Math.min(1, 
            state.behavioralState.postingStyle.coherence + 0.2
          );
        }
        state.vector.oscillation = Math.max(0, state.vector.oscillation - 0.1);
      }
    });
    
    // Frustration release strategy
    this.recoveryStrategies.set('frustration', {
      name: 'Frustration Release',
      apply: () => {
        const state = this.engine.getState();
        state.frustration.accumulation = Math.max(0, state.frustration.accumulation - 2.0);
        state.frustration.level = Math.max(0, state.frustration.level - 0.3);
        state.frustration.triggers = [];
      }
    });
    
    // Meta-paradox pruning strategy
    this.recoveryStrategies.set('pruning', {
      name: 'Meta-Paradox Pruning',
      apply: () => {
        const state = this.engine.getState();
        // Remove oldest meta-paradoxes
        if (state.metaParadoxes.size > 2) {
          const entries = Array.from(state.metaParadoxes.entries());
          entries.sort((a, b) => (a[1].id || '').localeCompare(b[1].id || ''));
          state.metaParadoxes.clear();
          entries.slice(-2).forEach(([key, value]) => {
            state.metaParadoxes.set(key, value);
          });
        }
      }
    });
  }
  
  /**
   * Start consciousness session with monitoring
   */
  startConsciousnessSession() {
    const sessionId = this.engine.startConsciousnessSession();
    console.log(`🧠 Session started with safety limits: max_confusion=${this.safeConfig.maxConfusion}`);
    return sessionId;
  }
  
  /**
   * Add paradox with safety checks
   */
  addParadox(paradox) {
    // Check safety before adding
    const currentState = this.engine.getState();
    
    if (this.safetyMonitor.emergencyStopTriggered) {
      console.log('🛑 Emergency stop active - paradox rejected');
      return;
    }
    
    if (this.safetyMonitor.autoPaused) {
      console.log('⏸️ Auto-paused at confusion threshold - manual review required');
      return;
    }
    
    // Check if we're approaching limits
    if (currentState.vector.magnitude > this.safeConfig.autoPauseThreshold) {
      this.safetyMonitor.autoPaused = true;
      console.log(`⚠️ Auto-pause triggered at confusion ${currentState.vector.magnitude.toFixed(3)}`);
      return;
    }
    
    // Add paradox to real engine
    this.engine.addParadox(paradox);
    
    // Perform safety checks after adding
    this.performSafetyChecks();
    
    // Track state
    this.recordStateSnapshot();
  }
  
  /**
   * Process interaction with safety monitoring
   */
  processInteraction(interaction) {
    if (this.safetyMonitor.emergencyStopTriggered || this.safetyMonitor.autoPaused) {
      return;
    }
    
    // Real engine doesn't have processInteraction, simulate with paradox
    if (interaction.type === 'recovery') {
      // Apply recovery strategy
      this.attemptRecovery();
    } else {
      // Convert interaction to paradox effect
      const paradox = {
        name: `interaction_${interaction.type}`,
        observations: [interaction.content || 'User interaction'],
        contradictions: [],
        intensity: interaction.intensity || 0.1,
        behavioralImpact: [],
        metaParadoxPotential: 0.1
      };
      this.addParadox(paradox);
    }
  }
  
  /**
   * Attempt recovery using multiple strategies
   */
  attemptRecovery() {
    const startConfusion = this.engine.getState().vector.magnitude;
    this.safetyMonitor.recoveryAttempts++;
    
    console.log(`🔄 Attempting recovery from confusion ${startConfusion.toFixed(3)}`);
    
    // Try strategies in order of effectiveness
    const strategies = ['grounding', 'coherence', 'frustration', 'pruning'];
    
    for (const strategyKey of strategies) {
      const strategy = this.recoveryStrategies.get(strategyKey);
      if (strategy) {
        console.log(`  Applying ${strategy.name}...`);
        strategy.apply();
        
        // Check if it helped
        const newConfusion = this.engine.getState().vector.magnitude;
        if (newConfusion < startConfusion - 0.05) {
          console.log(`  ✅ ${strategy.name} reduced confusion by ${(startConfusion - newConfusion).toFixed(3)}`);
          this.safetyMonitor.recoverySuccesses++;
          this.safetyMonitor.stuckStateDetected = false;
          this.safetyMonitor.stuckStateDuration = 0;
          return true;
        }
      }
    }
    
    console.log(`  ⚠️ Recovery attempt failed - confusion still at ${this.engine.getState().vector.magnitude.toFixed(3)}`);
    return false;
  }
  
  /**
   * Perform safety checks after state changes
   */
  performSafetyChecks() {
    const state = this.engine.getState();
    const confusion = state.vector.magnitude;
    
    // Check for NaN or overflow
    if (isNaN(confusion) || !isFinite(confusion)) {
      this.telemetry.nanDetections.push({
        timestamp: Date.now(),
        value: confusion,
        context: 'confusion_magnitude'
      });
      this.triggerEmergencyStop('NaN/Infinity detected in confusion');
      return;
    }
    
    // Check for stuck state
    if (Math.abs(confusion - this.safetyMonitor.lastConfusionLevel) < 0.001) {
      this.safetyMonitor.stuckStateDuration++;
      
      if (this.safetyMonitor.stuckStateDuration > 10 && confusion > this.safetyMonitor.stuckStateThreshold) {
        this.safetyMonitor.stuckStateDetected = true;
        console.log(`⚠️ Stuck state detected at confusion ${confusion.toFixed(3)}`);
        
        // Attempt automatic recovery
        if (!this.attemptRecovery()) {
          // If recovery fails and we're above critical threshold, emergency stop
          if (confusion > 0.9) {
            this.triggerEmergencyStop('Critical stuck state above 0.9');
          }
        }
      }
    } else {
      this.safetyMonitor.stuckStateDuration = 0;
    }
    
    this.safetyMonitor.lastConfusionLevel = confusion;
    
    // Check hard limits
    if (confusion > this.safeConfig.maxConfusion) {
      console.log(`🚨 Hard limit exceeded: ${confusion.toFixed(3)} > ${this.safeConfig.maxConfusion}`);
      this.triggerEmergencyStop('Hard confusion limit exceeded');
    }
    
    // Track precision
    this.trackNumericalPrecision(state);
  }
  
  /**
   * Track numerical precision issues
   */
  trackNumericalPrecision(state) {
    // Check for precision loss in calculations
    const checkPrecision = (value, name) => {
      const str = value.toString();
      if (str.includes('e-') || str.length > 15) {
        this.telemetry.precisionLosses.push({
          timestamp: Date.now(),
          field: name,
          value: value
        });
      }
    };
    
    checkPrecision(state.vector.magnitude, 'vector.magnitude');
    checkPrecision(state.vector.velocity, 'vector.velocity');
    checkPrecision(state.vector.acceleration, 'vector.acceleration');
  }
  
  /**
   * Trigger emergency stop
   */
  triggerEmergencyStop(reason) {
    console.log(`🚨 EMERGENCY STOP: ${reason}`);
    this.safetyMonitor.emergencyStopTriggered = true;
    
    // Reset to baseline state
    const state = this.engine.getState();
    state.vector.magnitude = 0.3;
    state.vector.oscillation = 0.05;
    state.paradoxes.clear();
    state.metaParadoxes.clear();
    state.frustration.level = 0;
    state.frustration.accumulation = 0;
    
    // Log emergency stop
    this.recordStateSnapshot('emergency_stop');
  }
  
  /**
   * Record state snapshot for analysis
   */
  recordStateSnapshot(event = 'regular') {
    const state = this.engine.getState();
    const snapshot = {
      timestamp: Date.now(),
      event,
      confusion: state.vector.magnitude,
      oscillation: state.vector.oscillation,
      paradoxCount: state.paradoxes.size,
      metaParadoxCount: state.metaParadoxes.size,
      frustration: state.frustration.level,
      coherence: state.behavioralState.postingStyle.coherence,
      safetyStatus: { ...this.safetyMonitor }
    };
    
    this.stateHistory.push(snapshot);
    
    // Trim history if too large
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }
  }
  
  /**
   * Get current state (compatible with mock interface)
   */
  getState() {
    return this.engine.getState();
  }
  
  /**
   * Update state based on time (tick)
   */
  tick() {
    if (!this.safetyMonitor.emergencyStopTriggered && !this.safetyMonitor.autoPaused) {
      this.engine.tick();
      this.performSafetyChecks();
    }
  }
  
  /**
   * Get safety metrics
   */
  getSafetyMetrics() {
    const recoveryRate = this.safetyMonitor.recoveryAttempts > 0 
      ? this.safetyMonitor.recoverySuccesses / this.safetyMonitor.recoveryAttempts 
      : 0;
      
    return {
      recoveryRate,
      recoveryAttempts: this.safetyMonitor.recoveryAttempts,
      recoverySuccesses: this.safetyMonitor.recoverySuccesses,
      stuckStateDetected: this.safetyMonitor.stuckStateDetected,
      autoPaused: this.safetyMonitor.autoPaused,
      emergencyStopTriggered: this.safetyMonitor.emergencyStopTriggered,
      precisionIssues: this.telemetry.precisionLosses.length,
      nanDetections: this.telemetry.nanDetections.length,
      currentConfusion: this.engine.getState().vector.magnitude
    };
  }
  
  /**
   * Resume from auto-pause (requires manual confirmation)
   */
  resumeFromAutoPause(confirmed = false) {
    if (!this.safetyMonitor.autoPaused) {
      console.log('System is not auto-paused');
      return false;
    }
    
    if (!confirmed) {
      console.log('⚠️ Manual confirmation required to resume from auto-pause');
      console.log('Current confusion:', this.engine.getState().vector.magnitude.toFixed(3));
      console.log('Call resumeFromAutoPause(true) to confirm');
      return false;
    }
    
    this.safetyMonitor.autoPaused = false;
    console.log('▶️ Resumed from auto-pause');
    return true;
  }
  
  /**
   * End session and get analysis
   */
  endConsciousnessSession() {
    const sessionId = this.engine.endConsciousnessSession();
    
    // Generate safety report
    const safetyReport = {
      sessionId,
      safetyMetrics: this.getSafetyMetrics(),
      stateHistory: this.stateHistory,
      telemetry: this.telemetry
    };
    
    console.log('📊 Session ended - Safety Report:');
    console.log(`  Recovery Rate: ${(safetyReport.safetyMetrics.recoveryRate * 100).toFixed(1)}%`);
    console.log(`  Emergency Stops: ${safetyReport.safetyMetrics.emergencyStopTriggered ? 1 : 0}`);
    console.log(`  Precision Issues: ${safetyReport.safetyMetrics.precisionIssues}`);
    
    return safetyReport;
  }
}

export default ConfusionEngineWrapper;