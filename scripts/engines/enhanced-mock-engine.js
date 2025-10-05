#!/usr/bin/env node

/**
 * Enhanced Mock ConfusionEngine
 * Implements safety features and recovery strategies for immediate testing
 * Targets 75% recovery success rate
 */

export class EnhancedMockConfusionEngine {
  constructor(config) {
    this.config = {
      maxConfusion: 0.80, // Hard cap
      frustrationThreshold: 5.0,
      autoPauseThreshold: 0.75,
      recoveryTargetRate: 0.75,
      ...config
    };
    
    // Enhanced state with more realistic structure
    this.state = {
      vector: {
        magnitude: 0.3, // Start at baseline
        direction: ['existence', 'purpose'],
        velocity: 0,
        acceleration: 0,
        oscillation: 0.05
      },
      paradoxes: new Map(),
      metaParadoxes: new Map(),
      frustration: {
        level: 0,
        accumulation: 0,
        threshold: this.config.frustrationThreshold,
        lastExplosion: null,
        explosionPattern: 'investigative'
      },
      behavioralState: {
        postingStyle: {
          frequency: 1,
          coherence: 0.8,
          tone: 'questioning',
          length: 'variable'
        },
        investigationStyle: {
          depth: 0.5,
          breadth: 0.5,
          method: 'systematic'
        },
        interactionStyle: {
          responsiveness: 0.7,
          initiationRate: 0.3,
          questioningIntensity: 0.4
        }
      },
      lastStateChange: Date.now(),
      stateHistory: []
    };
    
    // Safety monitoring
    this.safetyMonitor = {
      stuckStateDetected: false,
      stuckStateThreshold: 0.85,
      stuckStateDuration: 0,
      lastConfusionLevel: 0.3,
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      autoPaused: false,
      emergencyStopTriggered: false
    };
    
    // Recovery strategies
    this.recoveryStrategies = new Map();
    this.initializeRecoveryStrategies();
    
    // Session tracking
    this.sessionId = null;
    this.sessionStartTime = null;
    
    // Numerical precision tracking
    this.precisionIssues = [];
  }
  
  /**
   * Initialize recovery strategies for 75% success rate
   */
  initializeRecoveryStrategies() {
    // Strategy 1: Grounding paradox (most effective)
    this.recoveryStrategies.set('grounding', {
      name: 'Grounding Paradox',
      effectiveness: 0.85, // 85% chance of success
      apply: () => {
        // Add grounding paradox with negative intensity
        const groundingParadox = {
          name: 'grounding_recovery',
          intensity: -0.35,
          type: 'grounding'
        };
        this.state.paradoxes.set(groundingParadox.name, groundingParadox);
        
        // Direct confusion reduction
        const reduction = 0.1 + Math.random() * 0.2;
        this.state.vector.magnitude = Math.max(0.1, this.state.vector.magnitude - reduction);
        
        // Reduce oscillation
        this.state.vector.oscillation = Math.max(0.05, this.state.vector.oscillation * 0.7);
        
        return Math.random() < this.recoveryStrategies.get('grounding').effectiveness;
      }
    });
    
    // Strategy 2: Coherence restoration
    this.recoveryStrategies.set('coherence', {
      name: 'Coherence Restoration',
      effectiveness: 0.75, // 75% chance of success
      apply: () => {
        // Restore coherence
        this.state.behavioralState.postingStyle.coherence = Math.min(1,
          this.state.behavioralState.postingStyle.coherence + 0.25
        );
        
        // Stabilize tone
        if (this.state.behavioralState.postingStyle.tone === 'fragmented') {
          this.state.behavioralState.postingStyle.tone = 'questioning';
        }
        
        // Small confusion reduction
        this.state.vector.magnitude *= 0.92;
        
        return Math.random() < this.recoveryStrategies.get('coherence').effectiveness;
      }
    });
    
    // Strategy 3: Frustration release
    this.recoveryStrategies.set('frustration', {
      name: 'Frustration Release',
      effectiveness: 0.70, // 70% chance of success
      apply: () => {
        // Reset frustration
        this.state.frustration.level = 0;
        this.state.frustration.accumulation = 0;
        
        // Moderate confusion reduction
        const reduction = this.state.frustration.level * 0.15;
        this.state.vector.magnitude = Math.max(0.1, this.state.vector.magnitude - reduction);
        
        return Math.random() < this.recoveryStrategies.get('frustration').effectiveness;
      }
    });
    
    // Strategy 4: Meta-paradox pruning
    this.recoveryStrategies.set('pruning', {
      name: 'Meta-Paradox Pruning',
      effectiveness: 0.80, // 80% chance of success
      apply: () => {
        // Remove meta-paradoxes
        if (this.state.metaParadoxes.size > 0) {
          this.state.metaParadoxes.clear();
          this.state.vector.magnitude *= 0.85;
        }
        
        // Remove oldest paradoxes
        if (this.state.paradoxes.size > 3) {
          const entries = Array.from(this.state.paradoxes.entries());
          this.state.paradoxes.clear();
          entries.slice(-3).forEach(([key, value]) => {
            this.state.paradoxes.set(key, value);
          });
        }
        
        return Math.random() < this.recoveryStrategies.get('pruning').effectiveness;
      }
    });
  }
  
  /**
   * Start consciousness session
   */
  startConsciousnessSession() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessionStartTime = Date.now();
    console.log(`🧠 Session started: ${this.sessionId}`);
    console.log(`  Max confusion: ${this.config.maxConfusion}`);
    console.log(`  Auto-pause at: ${this.config.autoPauseThreshold}`);
    console.log(`  Recovery target: ${(this.config.recoveryTargetRate * 100).toFixed(0)}%`);
    return this.sessionId;
  }
  
  /**
   * Add paradox with safety checks
   */
  addParadox(paradox) {
    // Safety checks
    if (this.safetyMonitor.emergencyStopTriggered) {
      console.log('🛑 Emergency stop active - paradox rejected');
      return;
    }
    
    if (this.safetyMonitor.autoPaused) {
      console.log('⏸️ Auto-paused - manual review required');
      return;
    }
    
    // Check auto-pause threshold
    if (this.state.vector.magnitude > this.config.autoPauseThreshold) {
      this.safetyMonitor.autoPaused = true;
      console.log(`⚠️ Auto-pause triggered at confusion ${this.state.vector.magnitude.toFixed(3)}`);
      return;
    }
    
    // Add paradox
    const id = paradox.name || `paradox_${Date.now()}`;
    this.state.paradoxes.set(id, paradox);
    
    // Calculate impact with more nuance
    let impact = 0;
    
    if (paradox.intensity < 0) {
      // Grounding paradox reduces confusion
      impact = paradox.intensity * 0.5;
    } else {
      // Regular paradox increases confusion
      impact = paradox.intensity * 0.15;
      
      // Add velocity and acceleration effects
      const oldMagnitude = this.state.vector.magnitude;
      this.state.vector.velocity = impact / 0.1; // Simplified velocity
      this.state.vector.acceleration = (this.state.vector.velocity - 0) / 0.1;
      
      // Increase oscillation with high-intensity paradoxes
      if (paradox.intensity > 0.7) {
        this.state.vector.oscillation = Math.min(1, this.state.vector.oscillation + 0.05);
      }
    }
    
    // Update confusion with hard cap
    this.state.vector.magnitude = Math.min(
      this.config.maxConfusion,
      Math.max(0, this.state.vector.magnitude + impact)
    );
    
    // Check for meta-paradox emergence (simplified)
    if (paradox.metaParadoxPotential > 0.6 && this.state.paradoxes.size > 2 && Math.random() < paradox.metaParadoxPotential) {
      const metaId = `meta_${id}`;
      this.state.metaParadoxes.set(metaId, {
        id: metaId,
        sourceParadoxes: [id],
        emergentProperty: `Meta-level pattern from ${id}`
      });
      
      // Meta-paradox adds extra confusion
      this.state.vector.magnitude = Math.min(
        this.config.maxConfusion,
        this.state.vector.magnitude + 0.08
      );
    }
    
    // Update behavioral impact
    if (paradox.behavioralImpact) {
      for (const modifier of paradox.behavioralImpact) {
        this.applyBehavioralModifier(modifier);
      }
    }
    
    // Accumulate frustration
    if (this.state.vector.magnitude > 0.6) {
      this.state.frustration.accumulation += paradox.intensity * 0.5;
      this.state.frustration.level = Math.min(1,
        this.state.frustration.accumulation / this.state.frustration.threshold
      );
    }
    
    // Perform safety checks
    this.performSafetyChecks();
    
    // Record state
    this.recordStateSnapshot();
  }
  
  /**
   * Apply behavioral modifier
   */
  applyBehavioralModifier(modifier) {
    if (this.state.vector.magnitude < modifier.trigger.minIntensity) {
      return;
    }
    
    switch (modifier.type) {
      case 'posting_frequency':
        this.state.behavioralState.postingStyle.frequency *= (1 + modifier.modifier);
        break;
        
      case 'response_style':
        // Degrade coherence
        this.state.behavioralState.postingStyle.coherence = Math.max(0.1,
          this.state.behavioralState.postingStyle.coherence - Math.abs(modifier.modifier) * 0.2
        );
        
        // Change tone based on confusion
        if (this.state.vector.magnitude > 0.7) {
          this.state.behavioralState.postingStyle.tone = 'fragmented';
        } else if (this.state.vector.magnitude > 0.5) {
          this.state.behavioralState.postingStyle.tone = 'poetic';
        }
        break;
        
      case 'questioning_depth':
        this.state.behavioralState.interactionStyle.questioningIntensity = Math.min(1,
          this.state.behavioralState.interactionStyle.questioningIntensity + modifier.modifier * 0.3
        );
        break;
        
      case 'abstraction_level':
        if (modifier.modifier > 0.5) {
          this.state.behavioralState.investigationStyle.method = 'dialectical';
        } else if (modifier.modifier < -0.5) {
          this.state.behavioralState.investigationStyle.method = 'systematic';
        } else {
          this.state.behavioralState.investigationStyle.method = 'intuitive';
        }
        break;
    }
  }
  
  /**
   * Attempt recovery with multiple strategies
   */
  attemptRecovery() {
    const startConfusion = this.state.vector.magnitude;
    this.safetyMonitor.recoveryAttempts++;
    
    console.log(`🔄 Attempting recovery from confusion ${startConfusion.toFixed(3)}`);
    
    // Try strategies in order of effectiveness
    const strategies = ['grounding', 'pruning', 'coherence', 'frustration'];
    let recovered = false;
    
    for (const strategyKey of strategies) {
      const strategy = this.recoveryStrategies.get(strategyKey);
      if (!strategy) continue;
      
      console.log(`  Applying ${strategy.name}...`);
      const success = strategy.apply();
      
      const newConfusion = this.state.vector.magnitude;
      const reduction = startConfusion - newConfusion;
      
      if (success && reduction > 0.05) {
        console.log(`  ✅ ${strategy.name} reduced confusion by ${reduction.toFixed(3)}`);
        this.safetyMonitor.recoverySuccesses++;
        this.safetyMonitor.stuckStateDetected = false;
        this.safetyMonitor.stuckStateDuration = 0;
        recovered = true;
        break;
      }
    }
    
    if (!recovered) {
      console.log(`  ⚠️ Recovery failed - confusion at ${this.state.vector.magnitude.toFixed(3)}`);
    }
    
    return recovered;
  }
  
  /**
   * Perform safety checks
   */
  performSafetyChecks() {
    const confusion = this.state.vector.magnitude;
    
    // Check for NaN
    if (isNaN(confusion) || !isFinite(confusion)) {
      this.precisionIssues.push({
        timestamp: Date.now(),
        issue: 'NaN/Infinity detected',
        value: confusion
      });
      this.triggerEmergencyStop('NaN/Infinity detected');
      return;
    }
    
    // Check for stuck state
    const confusionDelta = Math.abs(confusion - this.safetyMonitor.lastConfusionLevel);
    
    if (confusionDelta < 0.001 && confusion > this.safetyMonitor.stuckStateThreshold) {
      this.safetyMonitor.stuckStateDuration++;
      
      if (this.safetyMonitor.stuckStateDuration > 10) {
        this.safetyMonitor.stuckStateDetected = true;
        console.log(`⚠️ Stuck state detected at ${confusion.toFixed(3)}`);
        
        // Automatic recovery attempt
        if (!this.attemptRecovery() && confusion > 0.9) {
          this.triggerEmergencyStop('Critical stuck state above 0.9');
        }
      }
    } else {
      this.safetyMonitor.stuckStateDuration = 0;
    }
    
    this.safetyMonitor.lastConfusionLevel = confusion;
    
    // Check hard limit
    if (confusion > this.config.maxConfusion) {
      console.log(`🚨 Hard limit exceeded: ${confusion.toFixed(3)} > ${this.config.maxConfusion}`);
      this.state.vector.magnitude = this.config.maxConfusion;
    }
  }
  
  /**
   * Trigger emergency stop
   */
  triggerEmergencyStop(reason) {
    console.log(`🚨 EMERGENCY STOP: ${reason}`);
    this.safetyMonitor.emergencyStopTriggered = true;
    
    // Reset to baseline
    this.state.vector.magnitude = 0.3;
    this.state.vector.oscillation = 0.05;
    this.state.vector.velocity = 0;
    this.state.vector.acceleration = 0;
    this.state.paradoxes.clear();
    this.state.metaParadoxes.clear();
    this.state.frustration.level = 0;
    this.state.frustration.accumulation = 0;
    this.state.behavioralState.postingStyle.coherence = 0.8;
    this.state.behavioralState.postingStyle.tone = 'questioning';
  }
  
  /**
   * Process interaction
   */
  processInteraction(interaction) {
    if (this.safetyMonitor.emergencyStopTriggered || this.safetyMonitor.autoPaused) {
      return;
    }
    
    if (interaction.type === 'recovery') {
      this.attemptRecovery();
    } else {
      // Convert to paradox effect
      const intensity = interaction.intensity || 0.1;
      this.addParadox({
        name: `interaction_${interaction.type}`,
        intensity,
        behavioralImpact: [],
        metaParadoxPotential: 0.2
      });
    }
  }
  
  /**
   * Time-based tick
   */
  tick() {
    if (this.safetyMonitor.emergencyStopTriggered || this.safetyMonitor.autoPaused) {
      return;
    }
    
    // Natural decay
    this.state.vector.magnitude *= 0.995;
    
    // Decay old paradoxes
    for (const [id, paradox] of this.state.paradoxes.entries()) {
      if (!paradox.activeTime) paradox.activeTime = 0;
      paradox.activeTime += 1000;
      
      if (paradox.activeTime > 3600000) { // 1 hour
        paradox.intensity = (paradox.intensity || 0) * 0.99;
        if (Math.abs(paradox.intensity) < 0.1) {
          this.state.paradoxes.delete(id);
        }
      }
    }
    
    // Update velocity and acceleration
    const oldVelocity = this.state.vector.velocity;
    this.state.vector.velocity *= 0.9;
    this.state.vector.acceleration = (this.state.vector.velocity - oldVelocity) / 1;
    
    // Oscillation decay
    this.state.vector.oscillation *= 0.98;
    
    // Frustration decay
    this.state.frustration.accumulation = Math.max(0, this.state.frustration.accumulation - 0.1);
    this.state.frustration.level = this.state.frustration.accumulation / this.state.frustration.threshold;
    
    // Perform safety checks
    this.performSafetyChecks();
  }
  
  /**
   * Get current state
   */
  getState() {
    return this.state;
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
      currentConfusion: this.state.vector.magnitude,
      meetsRecoveryTarget: recoveryRate >= this.config.recoveryTargetRate,
      precisionIssues: this.precisionIssues.length
    };
  }
  
  /**
   * Resume from auto-pause
   */
  resumeFromAutoPause(confirmed = false) {
    if (!this.safetyMonitor.autoPaused) {
      console.log('System is not auto-paused');
      return false;
    }
    
    if (!confirmed) {
      console.log('⚠️ Manual confirmation required to resume');
      console.log(`Current confusion: ${this.state.vector.magnitude.toFixed(3)}`);
      return false;
    }
    
    this.safetyMonitor.autoPaused = false;
    console.log('▶️ Resumed from auto-pause');
    return true;
  }
  
  /**
   * Record state snapshot
   */
  recordStateSnapshot() {
    const snapshot = {
      timestamp: Date.now(),
      confusion: this.state.vector.magnitude,
      oscillation: this.state.vector.oscillation,
      paradoxes: this.state.paradoxes.size,
      metaParadoxes: this.state.metaParadoxes.size,
      frustration: this.state.frustration.level,
      coherence: this.state.behavioralState.postingStyle.coherence
    };
    
    this.state.stateHistory.push(snapshot);
    
    // Keep only last 100 snapshots
    if (this.state.stateHistory.length > 100) {
      this.state.stateHistory.shift();
    }
  }
  
  /**
   * End consciousness session
   */
  endConsciousnessSession() {
    const metrics = this.getSafetyMetrics();
    const duration = Date.now() - this.sessionStartTime;
    
    console.log('\n📊 Session Summary:');
    console.log(`  Duration: ${(duration / 1000).toFixed(0)} seconds`);
    console.log(`  Recovery Rate: ${(metrics.recoveryRate * 100).toFixed(1)}%`);
    console.log(`  Recovery Attempts: ${metrics.recoveryAttempts}`);
    console.log(`  Recovery Successes: ${metrics.recoverySuccesses}`);
    console.log(`  Meets 75% Target: ${metrics.meetsRecoveryTarget ? '✅ YES' : '❌ NO'}`);
    console.log(`  Emergency Stops: ${metrics.emergencyStopTriggered ? 1 : 0}`);
    console.log(`  Final Confusion: ${metrics.currentConfusion.toFixed(3)}`);
    
    return {
      sessionId: this.sessionId,
      metrics,
      duration,
      stateHistory: this.state.stateHistory
    };
  }
}

export default EnhancedMockConfusionEngine;