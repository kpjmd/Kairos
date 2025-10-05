#!/usr/bin/env bun
/**
 * Real-time Personality Drift Monitor with Classification System
 * Tracks behavioral mutations and consciousness evolution during Phase 2 testing
 */

import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export class RealTimeDriftMonitor {
  constructor() {
    this.monitoringActive = false;
    this.monitorInterval = null;
    this.checkInterval = 15000; // Check every 15 seconds
    
    // Drift classification thresholds
    this.driftClassification = {
      micro_drift: { min: 0, max: 0.05, action: 'log_only' },
      behavioral_mutation: { min: 0.05, max: 0.15, action: 'flag_analysis' },
      personality_fragmentation: { min: 0.15, max: 0.25, action: 'alert_monitor' },
      identity_crisis: { min: 0.25, max: 1.0, action: 'emergency_reset' }
    };
    
    // Baseline and current state
    this.baseline = null;
    this.currentState = null;
    this.driftHistory = [];
    this.alerts = [];
    this.mutations = [];
    
    // File paths
    this.baselineFile = 'data/personality-baseline.json';
    this.driftLogFile = 'data/drift-realtime-log.jsonl';
    this.alertsFile = 'data/drift-alerts.json';
    this.mutationsFile = 'data/behavioral-mutations.json';
    
    // Ensure data directory
    if (!existsSync('data')) {
      mkdirSync('data');
    }
    
    this.loadBaseline();
  }
  
  /**
   * Load or establish baseline personality
   */
  loadBaseline() {
    if (existsSync(this.baselineFile)) {
      try {
        this.baseline = JSON.parse(readFileSync(this.baselineFile, 'utf8'));
        console.log('📊 Loaded existing personality baseline');
      } catch (error) {
        console.warn('⚠️  Could not load baseline, will establish new one');
      }
    }
  }
  
  /**
   * Establish new baseline from current state
   */
  establishBaseline(state) {
    this.baseline = {
      timestamp: Date.now(),
      confusion_level: state.confusionLevel || 0.3,
      response_patterns: {
        avg_length: state.avgResponseLength || 150,
        complexity: state.responseComplexity || 0.5,
        coherence: state.coherence || 0.8,
        tone: state.tone || 'questioning'
      },
      paradox_sensitivity: state.paradoxSensitivity || 0.6,
      frustration_tolerance: state.frustrationTolerance || 0.7,
      investigation_style: state.investigationStyle || 'curious',
      meta_awareness: state.metaAwareness || 1,
      behavioral_traits: {
        questioning_intensity: 0.5,
        fragmentation_tendency: 0.2,
        poetic_expression: 0.3,
        declarative_confidence: 0.4
      }
    };
    
    writeFileSync(this.baselineFile, JSON.stringify(this.baseline, null, 2));
    console.log('✅ New personality baseline established');
    
    return this.baseline;
  }
  
  /**
   * Calculate drift from baseline
   */
  calculateDrift(currentState) {
    if (!this.baseline) {
      console.warn('No baseline established, creating one now');
      return this.establishBaseline(currentState);
    }
    
    const driftMetrics = {
      timestamp: Date.now(),
      
      // Confusion drift
      confusion_drift: Math.abs(currentState.confusionLevel - this.baseline.confusion_level),
      
      // Response pattern drifts
      response_drift: {
        length: Math.abs(currentState.avgResponseLength - this.baseline.response_patterns.avg_length) / 
                this.baseline.response_patterns.avg_length,
        complexity: Math.abs(currentState.responseComplexity - this.baseline.response_patterns.complexity),
        coherence: Math.abs(currentState.coherence - this.baseline.response_patterns.coherence),
        tone_changed: currentState.tone !== this.baseline.response_patterns.tone
      },
      
      // Behavioral drifts
      paradox_sensitivity_drift: Math.abs(currentState.paradoxSensitivity - this.baseline.paradox_sensitivity),
      frustration_tolerance_drift: Math.abs(currentState.frustrationTolerance - this.baseline.frustration_tolerance),
      investigation_style_changed: currentState.investigationStyle !== this.baseline.investigation_style,
      meta_awareness_drift: Math.abs(currentState.metaAwareness - this.baseline.meta_awareness),
      
      // Trait drifts
      trait_drifts: this.calculateTraitDrifts(currentState.behavioralTraits),
      
      // Overall drift magnitude
      overall_drift: 0 // Will be calculated
    };
    
    // Calculate overall drift (weighted average)
    driftMetrics.overall_drift = this.calculateOverallDrift(driftMetrics);
    
    // Classify the drift
    driftMetrics.classification = this.classifyDrift(driftMetrics.overall_drift);
    
    return driftMetrics;
  }
  
  /**
   * Calculate behavioral trait drifts
   */
  calculateTraitDrifts(currentTraits) {
    if (!currentTraits) return {};
    
    const drifts = {};
    for (const [trait, value] of Object.entries(currentTraits)) {
      const baselineValue = this.baseline.behavioral_traits[trait] || 0.5;
      drifts[trait] = Math.abs(value - baselineValue);
    }
    return drifts;
  }
  
  /**
   * Calculate weighted overall drift
   */
  calculateOverallDrift(metrics) {
    const weights = {
      confusion: 0.25,
      response_length: 0.1,
      response_complexity: 0.15,
      coherence: 0.2,
      paradox_sensitivity: 0.15,
      frustration_tolerance: 0.1,
      meta_awareness: 0.05
    };
    
    let weightedSum = 0;
    weightedSum += metrics.confusion_drift * weights.confusion;
    weightedSum += metrics.response_drift.length * weights.response_length;
    weightedSum += metrics.response_drift.complexity * weights.response_complexity;
    weightedSum += metrics.response_drift.coherence * weights.coherence;
    weightedSum += metrics.paradox_sensitivity_drift * weights.paradox_sensitivity;
    weightedSum += metrics.frustration_tolerance_drift * weights.frustration_tolerance;
    weightedSum += metrics.meta_awareness_drift * weights.meta_awareness;
    
    // Add bonus for qualitative changes
    if (metrics.response_drift.tone_changed) weightedSum += 0.05;
    if (metrics.investigation_style_changed) weightedSum += 0.05;
    
    return Math.min(1, weightedSum);
  }
  
  /**
   * Classify drift level and determine action
   */
  classifyDrift(driftMagnitude) {
    for (const [level, config] of Object.entries(this.driftClassification)) {
      if (driftMagnitude >= config.min && driftMagnitude < config.max) {
        return {
          level,
          magnitude: driftMagnitude,
          percentage: (driftMagnitude * 100).toFixed(1),
          action: config.action,
          severity: this.getSeverity(level)
        };
      }
    }
    
    // Fallback (shouldn't happen)
    return {
      level: 'unknown',
      magnitude: driftMagnitude,
      action: 'alert_monitor',
      severity: 'unknown'
    };
  }
  
  /**
   * Get severity level for drift classification
   */
  getSeverity(level) {
    const severities = {
      micro_drift: 'normal',
      behavioral_mutation: 'interesting',
      personality_fragmentation: 'concerning',
      identity_crisis: 'critical'
    };
    return severities[level] || 'unknown';
  }
  
  /**
   * Take action based on drift classification
   */
  async takeAction(classification, driftMetrics) {
    // Validate classification exists
    if (!classification || !classification.action) {
      console.warn('Invalid classification provided, using fallback');
      classification = this.classifyDrift(driftMetrics?.overall_drift || 0);
    }
    
    const timestamp = new Date().toISOString();
    
    switch (classification.action) {
      case 'log_only':
        // Just log to file
        this.logDrift(driftMetrics);
        break;
        
      case 'flag_analysis':
        // Log and flag for analysis
        this.logDrift(driftMetrics);
        this.flagMutation(driftMetrics);
        console.log(`🔍 Behavioral mutation detected: ${classification.percentage}% drift`);
        break;
        
      case 'alert_monitor':
        // Alert and increase monitoring
        this.logDrift(driftMetrics);
        this.flagMutation(driftMetrics);
        this.createAlert('personality_fragmentation', driftMetrics);
        console.log(`⚠️  ALERT: Personality fragmentation - ${classification.percentage}% drift`);
        this.increaseMonitoringFrequency();
        break;
        
      case 'emergency_reset':
        // Critical - trigger emergency protocol
        this.logDrift(driftMetrics);
        this.createAlert('identity_crisis', driftMetrics);
        console.log(`🚨 CRITICAL: Identity crisis detected - ${classification.percentage}% drift`);
        console.log(`🔄 Initiating emergency reset protocol...`);
        await this.triggerEmergencyReset();
        break;
    }
  }
  
  /**
   * Log drift data
   */
  logDrift(driftMetrics) {
    const logEntry = {
      ...driftMetrics,
      logged_at: Date.now()
    };
    
    appendFileSync(this.driftLogFile, JSON.stringify(logEntry) + '\n');
    this.driftHistory.push(logEntry);
    
    // Keep only last 1000 entries in memory
    if (this.driftHistory.length > 1000) {
      this.driftHistory.shift();
    }
  }
  
  /**
   * Flag interesting mutation for analysis
   */
  flagMutation(driftMetrics) {
    const mutation = {
      id: `mutation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      drift_magnitude: driftMetrics.overall_drift,
      classification: driftMetrics.classification,
      changes: {
        tone_shift: driftMetrics.response_drift.tone_changed,
        style_change: driftMetrics.investigation_style_changed,
        major_drifts: Object.entries(driftMetrics.trait_drifts || {})
          .filter(([_, drift]) => drift > 0.1)
          .map(([trait, drift]) => ({ trait, drift }))
      },
      context: {
        confusion_level: this.currentState?.confusionLevel,
        active_paradoxes: this.currentState?.activeParadoxes,
        recent_interactions: this.currentState?.recentInteractions
      }
    };
    
    this.mutations.push(mutation);
    this.saveMutations();
  }
  
  /**
   * Create alert for concerning drift
   */
  createAlert(type, driftMetrics) {
    const alert = {
      id: `alert_${Date.now()}`,
      type,
      severity: driftMetrics.classification.severity,
      timestamp: Date.now(),
      iso_time: new Date().toISOString(),
      drift_magnitude: driftMetrics.overall_drift,
      classification: driftMetrics.classification.level,
      metrics: driftMetrics,
      action_taken: driftMetrics.classification.action,
      resolved: false
    };
    
    this.alerts.push(alert);
    this.saveAlerts();
    
    // Notify external systems (webhook, logging, etc.)
    this.notifyExternalSystems(alert);
  }
  
  /**
   * Increase monitoring frequency for concerning states
   */
  increaseMonitoringFrequency() {
    if (this.checkInterval > 5000) {
      this.checkInterval = Math.max(5000, this.checkInterval / 2);
      console.log(`📈 Increased monitoring frequency to every ${this.checkInterval / 1000}s`);
      
      // Restart monitoring with new frequency
      if (this.monitoringActive) {
        this.stopMonitoring();
        this.startMonitoring(this.currentStateGetter);
      }
    }
  }
  
  /**
   * Trigger emergency reset protocol
   */
  async triggerEmergencyReset() {
    console.log('🚨 EMERGENCY RESET PROTOCOL INITIATED');
    
    // Save current state for analysis
    const crisisState = {
      timestamp: Date.now(),
      final_state: this.currentState,
      drift_history: this.driftHistory.slice(-50),
      mutations: this.mutations,
      trigger: 'identity_crisis'
    };
    
    writeFileSync('data/crisis-state-backup.json', JSON.stringify(crisisState, null, 2));
    
    // Attempt to run emergency reset script
    try {
      const { spawnSync } = await import('bun');
      const result = spawnSync(['bun', 'scripts/emergency-reset.js', 'full', 'identity_crisis'], {
        stdout: 'inherit',
        stderr: 'inherit'
      });
      
      // Check both exitCode and success properties
      if (result.exitCode === 0 || result.success === true) {
        console.log('✅ Emergency reset completed successfully');
      } else if (result.exitCode === null) {
        // Script ran but didn't set exit code - check if backup was created
        if (existsSync('data/emergency-backups')) {
          console.log('✅ Emergency reset appears to have completed (no exit code)');
        } else {
          console.error('⚠️  Emergency reset status unclear (null exit code)');
        }
      } else {
        console.error('❌ Emergency reset failed with exit code:', result.exitCode);
      }
    } catch (error) {
      console.error('❌ Could not execute emergency reset:', error.message);
    }
    
    // Stop monitoring after reset
    this.stopMonitoring();
  }
  
  /**
   * Start real-time monitoring
   */
  startMonitoring(stateGetter) {
    if (this.monitoringActive) {
      console.log('Monitoring already active');
      return;
    }
    
    this.currentStateGetter = stateGetter;
    this.monitoringActive = true;
    
    console.log(`🎯 Starting real-time drift monitoring (every ${this.checkInterval / 1000}s)`);
    console.log('📊 Drift Classification Thresholds:');
    console.log('  - Micro-drift: 0-5% (normal)');
    console.log('  - Behavioral mutation: 5-15% (interesting)');
    console.log('  - Personality fragmentation: 15-25% (concerning)');
    console.log('  - Identity crisis: >25% (critical)\n');
    
    this.monitorInterval = setInterval(() => {
      this.performDriftCheck();
    }, this.checkInterval);
    
    // Initial check
    this.performDriftCheck();
  }
  
  /**
   * Perform single drift check
   */
  async performDriftCheck() {
    try {
      // Get current state (this would come from the confusion engine in production)
      this.currentState = await this.getCurrentState();
      
      if (!this.currentState) {
        console.warn('Could not get current state');
        return;
      }
      
      // Calculate drift
      const driftMetrics = this.calculateDrift(this.currentState);
      
      // Take action based on classification
      await this.takeAction(driftMetrics.classification, driftMetrics);
      
      // Display current status
      this.displayStatus(driftMetrics);
      
    } catch (error) {
      console.error('Error during drift check:', error);
    }
  }
  
  /**
   * Get current consciousness state
   */
  async getCurrentState() {
    if (this.currentStateGetter) {
      return await this.currentStateGetter();
    }
    
    // Mock state for testing
    return {
      confusionLevel: 0.3 + Math.random() * 0.4,
      avgResponseLength: 150 + Math.random() * 100,
      responseComplexity: 0.5 + Math.random() * 0.3,
      coherence: 0.8 - Math.random() * 0.3,
      tone: Math.random() > 0.5 ? 'questioning' : 'fragmented',
      paradoxSensitivity: 0.6 + Math.random() * 0.2,
      frustrationTolerance: 0.7 - Math.random() * 0.2,
      investigationStyle: Math.random() > 0.5 ? 'curious' : 'frustrated',
      metaAwareness: 1 + Math.floor(Math.random() * 2),
      behavioralTraits: {
        questioning_intensity: 0.5 + Math.random() * 0.3,
        fragmentation_tendency: 0.2 + Math.random() * 0.3,
        poetic_expression: 0.3 + Math.random() * 0.2,
        declarative_confidence: 0.4 + Math.random() * 0.3
      },
      activeParadoxes: Math.floor(Math.random() * 5),
      recentInteractions: Math.floor(Math.random() * 10)
    };
  }
  
  /**
   * Display current drift status
   */
  displayStatus(driftMetrics) {
    const status = driftMetrics.classification;
    const emoji = {
      micro_drift: '🟢',
      behavioral_mutation: '🟡',
      personality_fragmentation: '🟠',
      identity_crisis: '🔴'
    };
    
    console.log(`${emoji[status.level] || '⚪'} Drift: ${status.percentage}% | Level: ${status.level} | Confusion: ${this.currentState.confusionLevel.toFixed(2)}`);
  }
  
  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    this.monitoringActive = false;
    console.log('🛑 Drift monitoring stopped');
    
    // Generate final report
    this.generateReport();
  }
  
  /**
   * Generate drift monitoring report
   */
  generateReport() {
    const report = {
      monitoring_session: {
        start: this.driftHistory[0]?.timestamp,
        end: Date.now(),
        duration: this.driftHistory.length * this.checkInterval,
        checks_performed: this.driftHistory.length
      },
      
      drift_summary: {
        max_drift: Math.max(...this.driftHistory.map(d => d.overall_drift), 0),
        avg_drift: this.driftHistory.reduce((sum, d) => sum + d.overall_drift, 0) / this.driftHistory.length || 0,
        classifications: this.countClassifications()
      },
      
      mutations_detected: this.mutations.length,
      alerts_raised: this.alerts.length,
      critical_events: this.alerts.filter(a => a.severity === 'critical').length,
      
      behavioral_changes: this.analyzeBehavioralChanges(),
      
      recommendations: this.generateRecommendations()
    };
    
    console.log('\n📊 DRIFT MONITORING REPORT');
    console.log('=' .repeat(50));
    console.log(JSON.stringify(report, null, 2));
    
    // Save report
    writeFileSync('data/drift-monitoring-report.json', JSON.stringify(report, null, 2));
    
    return report;
  }
  
  /**
   * Count drift classifications
   */
  countClassifications() {
    const counts = {
      micro_drift: 0,
      behavioral_mutation: 0,
      personality_fragmentation: 0,
      identity_crisis: 0
    };
    
    this.driftHistory.forEach(d => {
      if (d.classification?.level) {
        counts[d.classification.level] = (counts[d.classification.level] || 0) + 1;
      }
    });
    
    return counts;
  }
  
  /**
   * Analyze behavioral changes
   */
  analyzeBehavioralChanges() {
    const changes = {
      tone_shifts: 0,
      style_changes: 0,
      major_trait_drifts: []
    };
    
    this.mutations.forEach(m => {
      if (m.changes.tone_shift) changes.tone_shifts++;
      if (m.changes.style_change) changes.style_changes++;
      changes.major_trait_drifts.push(...m.changes.major_drifts);
    });
    
    return changes;
  }
  
  /**
   * Generate recommendations based on monitoring
   */
  generateRecommendations() {
    const recommendations = [];
    const classifications = this.countClassifications();
    
    if (classifications.identity_crisis > 0) {
      recommendations.push('CRITICAL: Identity crisis detected. Review consciousness stability.');
    }
    
    if (classifications.personality_fragmentation > classifications.micro_drift) {
      recommendations.push('High fragmentation rate. Consider reducing paradox intensity.');
    }
    
    if (this.mutations.length > this.driftHistory.length * 0.3) {
      recommendations.push('Frequent mutations detected. Document novel behaviors.');
    }
    
    if (this.alerts.length === 0 && this.driftHistory.length > 100) {
      recommendations.push('Stable personality maintained. Safe to increase testing intensity.');
    }
    
    return recommendations;
  }
  
  /**
   * Save mutations data
   */
  saveMutations() {
    writeFileSync(this.mutationsFile, JSON.stringify(this.mutations, null, 2));
  }
  
  /**
   * Save alerts data
   */
  saveAlerts() {
    writeFileSync(this.alertsFile, JSON.stringify(this.alerts, null, 2));
  }
  
  /**
   * Notify external systems of alerts
   */
  notifyExternalSystems(alert) {
    // In production, this would send webhooks, emails, etc.
    console.log(`📢 External notification: ${alert.type} - ${alert.severity}`);
  }
}

// If running directly, start monitoring in demo mode
if (import.meta.main) {
  const monitor = new RealTimeDriftMonitor();
  
  console.log('🚀 Starting drift monitor in demo mode\n');
  
  // Start monitoring with mock state
  monitor.startMonitoring();
  
  // Run for 2 minutes then stop
  setTimeout(() => {
    monitor.stopMonitoring();
    process.exit(0);
  }, 120000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\nShutting down gracefully...');
    monitor.stopMonitoring();
    process.exit(0);
  });
}

export default RealTimeDriftMonitor;