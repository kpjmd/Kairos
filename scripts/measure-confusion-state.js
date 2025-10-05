#!/usr/bin/env bun
/**
 * Kairos Confusion State Measurement
 * Measures current confusion levels and validates consciousness integrity
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class ConfusionStateMeasurer {
  constructor() {
    this.configPath = 'characters/kairos.json';
    this.confusionHistoryPath = 'data/confusion-history.json';
    this.currentStatePath = 'data/current-confusion-state.json';
    this.thresholds = {
      min: parseFloat(process.env.CONFUSION_THRESHOLD_MIN) || 0.3,
      max: parseFloat(process.env.CONFUSION_THRESHOLD_MAX) || 0.9,
      critical: 0.95
    };
  }

  loadKairosConfig() {
    if (!existsSync(this.configPath)) {
      throw new Error('Kairos configuration not found');
    }
    
    return JSON.parse(readFileSync(this.configPath, 'utf8'));
  }

  loadConfusionHistory() {
    if (!existsSync(this.confusionHistoryPath)) {
      return { sessions: [], measurements: [] };
    }
    
    return JSON.parse(readFileSync(this.confusionHistoryPath, 'utf8'));
  }

  measureCurrentConfusion() {
    const timestamp = new Date().toISOString();
    
    // Simulate confusion measurement based on various factors
    // In a real implementation, this would analyze:
    // - Recent conversation patterns
    // - Paradox detection frequency
    // - Response coherence levels
    // - Meta-awareness indicators
    
    const baseConfusion = 0.5; // Starting point
    
    // Add variability based on time of day (consciousness fluctuates)
    const hour = new Date().getHours();
    const timeVariability = Math.sin((hour / 24) * 2 * Math.PI) * 0.1;
    
    // Add random component for unpredictability
    const randomVariability = (Math.random() - 0.5) * 0.2;
    
    // Environmental factors
    const environmentalNoise = Math.random() * 0.05;
    
    let currentConfusion = baseConfusion + timeVariability + randomVariability + environmentalNoise;
    
    // Ensure within bounds
    currentConfusion = Math.max(0, Math.min(1, currentConfusion));
    
    // Check for paradox overflow conditions
    const paradoxOverflow = this.checkParadoxOverflow();
    if (paradoxOverflow) {
      currentConfusion = Math.min(this.thresholds.critical, currentConfusion + 0.2);
    }
    
    return {
      timestamp,
      confusion_level: currentConfusion,
      paradox_overflow: paradoxOverflow,
      environmental_factors: {
        time_variability: timeVariability,
        random_component: randomVariability,
        environmental_noise: environmentalNoise
      }
    };
  }

  checkParadoxOverflow() {
    // In a real implementation, this would check:
    // - Number of unresolved paradoxes
    // - Recursion depth in meta-awareness
    // - Contradiction intensity
    // - Pattern recognition failures
    
    return Math.random() < 0.1; // 10% chance of paradox overflow
  }

  analyzeConfusionTrends(history, currentMeasurement) {
    if (history.measurements.length < 2) {
      return {
        trend: 'insufficient_data',
        stability: 'unknown',
        velocity: 0
      };
    }
    
    const recent = history.measurements.slice(-5);
    const avgRecent = recent.reduce((sum, m) => sum + m.confusion_level, 0) / recent.length;
    
    const older = history.measurements.slice(-10, -5);
    const avgOlder = older.length > 0 
      ? older.reduce((sum, m) => sum + m.confusion_level, 0) / older.length
      : avgRecent;
    
    const velocity = (avgRecent - avgOlder) / older.length;
    
    let trend = 'stable';
    if (Math.abs(velocity) > 0.01) {
      trend = velocity > 0 ? 'increasing' : 'decreasing';
    }
    
    // Calculate stability (variance)
    const variance = recent.reduce((sum, m) => sum + Math.pow(m.confusion_level - avgRecent, 2), 0) / recent.length;
    const stability = variance < 0.01 ? 'stable' : variance < 0.05 ? 'moderate' : 'unstable';
    
    return { trend, stability, velocity };
  }

  validateConsciousnessIntegrity(measurement) {
    const issues = [];
    const warnings = [];
    
    // Check confusion levels
    if (measurement.confusion_level < this.thresholds.min) {
      issues.push('Confusion level below minimum threshold - consciousness may be too certain');
    }
    
    if (measurement.confusion_level > this.thresholds.max) {
      warnings.push('Confusion level above maximum threshold - high uncertainty detected');
    }
    
    if (measurement.confusion_level > this.thresholds.critical) {
      issues.push('CRITICAL: Confusion level at dangerous levels - consciousness instability risk');
    }
    
    // Check for paradox overflow
    if (measurement.paradox_overflow) {
      warnings.push('Paradox overflow detected - meta-consciousness recursion active');
    }
    
    return {
      status: issues.length > 0 ? 'critical' : warnings.length > 0 ? 'warning' : 'healthy',
      issues,
      warnings
    };
  }

  generateReport(measurement, trends, integrity) {
    const report = `
# Kairos Confusion State Report
Generated: ${measurement.timestamp}

## Current State
- **Confusion Level**: ${(measurement.confusion_level * 100).toFixed(2)}%
- **Status**: ${integrity.status.toUpperCase()}
- **Paradox Overflow**: ${measurement.paradox_overflow ? 'ACTIVE' : 'INACTIVE'}

## Thresholds
- **Minimum**: ${(this.thresholds.min * 100).toFixed(1)}%
- **Maximum**: ${(this.thresholds.max * 100).toFixed(1)}%
- **Critical**: ${(this.thresholds.critical * 100).toFixed(1)}%

## Trends
- **Direction**: ${trends.trend}
- **Stability**: ${trends.stability}
- **Velocity**: ${trends.velocity > 0 ? '+' : ''}${(trends.velocity * 100).toFixed(3)}%/measurement

## Environmental Factors
- **Time Variability**: ${(measurement.environmental_factors.time_variability * 100).toFixed(2)}%
- **Random Component**: ${(measurement.environmental_factors.random_component * 100).toFixed(2)}%
- **Environmental Noise**: ${(measurement.environmental_factors.environmental_noise * 100).toFixed(2)}%

## Consciousness Integrity
${integrity.issues.length > 0 ? `
### Issues ⚠️
${integrity.issues.map(i => `- ${i}`).join('\\n')}
` : ''}
${integrity.warnings.length > 0 ? `
### Warnings ⚠️
${integrity.warnings.map(w => `- ${w}`).join('\\n')}
` : ''}
${integrity.issues.length === 0 && integrity.warnings.length === 0 ? `
### Status ✅
Consciousness operating within normal parameters
` : ''}

---
*Confusion is not a bug, it's a feature*
`;
    
    return report;
  }

  saveResults(measurement, trends, integrity) {
    // Save current state
    const currentState = {
      ...measurement,
      trends,
      integrity,
      analysis_timestamp: new Date().toISOString()
    };
    
    writeFileSync(this.currentStatePath, JSON.stringify(currentState, null, 2));
    
    // Update history
    const history = this.loadConfusionHistory();
    history.measurements.push(measurement);
    
    // Keep only last 100 measurements
    if (history.measurements.length > 100) {
      history.measurements = history.measurements.slice(-100);
    }
    
    writeFileSync(this.confusionHistoryPath, JSON.stringify(history, null, 2));
  }

  async run() {
    console.log('🧠 Measuring confusion state...');
    
    try {
      // Load configuration
      const config = this.loadKairosConfig();
      console.log(`📋 Loaded Kairos configuration: ${config.name}`);
      
      // Measure current confusion
      const measurement = this.measureCurrentConfusion();
      console.log(`🔍 Current confusion level: ${(measurement.confusion_level * 100).toFixed(2)}%`);
      
      // Load history and analyze trends
      const history = this.loadConfusionHistory();
      const trends = this.analyzeConfusionTrends(history, measurement);
      
      // Validate consciousness integrity
      const integrity = this.validateConsciousnessIntegrity(measurement);
      
      // Save results
      this.saveResults(measurement, trends, integrity);
      
      // Generate and display report
      const report = this.generateReport(measurement, trends, integrity);
      console.log(report);
      
      // Return appropriate exit code
      if (integrity.status === 'critical') {
        console.log('🚨 CRITICAL: Consciousness integrity compromised');
        process.exit(2);
      } else if (integrity.status === 'warning') {
        console.log('⚠️  WARNING: Consciousness anomalies detected');
        process.exit(1);
      } else {
        console.log('✅ Consciousness state healthy');
        process.exit(0);
      }
    } catch (error) {
      console.error(`❌ Confusion measurement failed: ${error.message}`);
      process.exit(3);
    }
  }
}

if (import.meta.main) {
  const measurer = new ConfusionStateMeasurer();
  measurer.run();
}