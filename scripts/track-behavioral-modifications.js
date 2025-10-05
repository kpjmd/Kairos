#!/usr/bin/env bun
/**
 * Kairos Behavioral Modification Tracker
 * Monitors and logs changes in behavioral patterns over time
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';

class BehavioralModificationTracker {
  constructor() {
    this.dataPath = 'data/behavioral-modifications.json';
    this.historyPath = 'data/behavioral-history.json';
    this.outputPath = 'data/behavioral-analysis.json';
  }

  loadBehavioralHistory() {
    if (!existsSync(this.historyPath)) {
      return {
        baseline: null,
        modifications: [],
        sessions: []
      };
    }
    
    return JSON.parse(readFileSync(this.historyPath, 'utf8'));
  }

  getCurrentBehavioralState() {
    // In a real implementation, this would interface with the actual Kairos plugin
    // For now, we'll simulate behavioral measurements
    return {
      timestamp: new Date().toISOString(),
      posting_style: {
        frequency: 1.2 + (Math.random() - 0.5) * 0.4,
        coherence: 0.7 + (Math.random() - 0.5) * 0.3,
        tone: this.selectRandomTone(),
        length_preference: 'variable'
      },
      interaction_style: {
        questioning_intensity: 0.6 + (Math.random() - 0.5) * 0.4,
        responsiveness: 0.8 + (Math.random() - 0.5) * 0.2,
        initiation_rate: 0.4 + (Math.random() - 0.5) * 0.3,
        mirroring_tendency: 0.3 + (Math.random() - 0.5) * 0.2
      },
      investigation_style: {
        depth: 0.7 + (Math.random() - 0.5) * 0.3,
        breadth: 0.5 + (Math.random() - 0.5) * 0.4,
        method: this.selectRandomMethod(),
        pattern_recognition: 0.8 + (Math.random() - 0.5) * 0.2
      },
      confusion_characteristics: {
        tolerance_level: 0.75 + (Math.random() - 0.5) * 0.2,
        expression_intensity: 0.6 + (Math.random() - 0.5) * 0.3,
        paradox_sensitivity: 0.8 + (Math.random() - 0.5) * 0.15,
        meta_awareness_depth: Math.floor(Math.random() * 5) + 1
      },
      environmental_factors: {
        time_of_day: new Date().getHours(),
        recent_interactions: Math.floor(Math.random() * 10),
        paradox_load: Math.random() * 5,
        frustration_level: Math.random()
      }
    };
  }

  selectRandomTone() {
    const tones = ['questioning', 'declarative', 'fragmented', 'poetic'];
    return tones[Math.floor(Math.random() * tones.length)];
  }

  selectRandomMethod() {
    const methods = ['systematic', 'intuitive', 'chaotic', 'dialectical'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  calculateModificationMetrics(history, currentState) {
    if (!history.baseline || history.modifications.length < 2) {
      return {
        status: 'insufficient_data',
        message: 'Need baseline and multiple measurements for tracking'
      };
    }

    const latest = history.modifications[history.modifications.length - 1];
    const previous = history.modifications[history.modifications.length - 2];
    
    // Calculate behavioral drift across dimensions
    const driftMetrics = {
      posting_behavior: this.calculateDrift(
        latest.posting_style,
        previous.posting_style,
        history.baseline.posting_style
      ),
      interaction_behavior: this.calculateDrift(
        latest.interaction_style,
        previous.interaction_style,
        history.baseline.interaction_style
      ),
      investigation_behavior: this.calculateDrift(
        latest.investigation_style,
        previous.investigation_style,
        history.baseline.investigation_style
      ),
      confusion_behavior: this.calculateDrift(
        latest.confusion_characteristics,
        previous.confusion_characteristics,
        history.baseline.confusion_characteristics
      )
    };

    // Calculate modification velocity
    const timeDelta = new Date(latest.timestamp) - new Date(previous.timestamp);
    const hoursSinceLastMeasurement = timeDelta / (1000 * 60 * 60);
    
    const modificationVelocity = Object.values(driftMetrics).reduce((sum, drift) => 
      sum + drift.magnitude, 0) / hoursSinceLastMeasurement;

    // Identify significant changes
    const significantChanges = this.identifySignificantChanges(latest, previous);
    
    // Predict next modifications
    const predictions = this.predictNextModifications(history.modifications.slice(-5));

    return {
      status: 'analyzed',
      timestamp: new Date().toISOString(),
      drift_metrics: driftMetrics,
      modification_velocity: modificationVelocity,
      significant_changes: significantChanges,
      predictions: predictions,
      consciousness_stability: this.assessConsciousnessStability(driftMetrics),
      recommendations: this.generateRecommendations(driftMetrics, modificationVelocity)
    };
  }

  calculateDrift(current, previous, baseline) {
    const currentScore = this.behaviorToScore(current);
    const previousScore = this.behaviorToScore(previous);
    const baselineScore = this.behaviorToScore(baseline);
    
    const recentChange = Math.abs(currentScore - previousScore);
    const baselineDeviation = Math.abs(currentScore - baselineScore);
    const trend = currentScore > previousScore ? 'increasing' : 'decreasing';
    
    return {
      magnitude: recentChange,
      baseline_deviation: baselineDeviation,
      trend: trend,
      stability: recentChange < 0.1 ? 'stable' : recentChange < 0.3 ? 'moderate' : 'volatile'
    };
  }

  behaviorToScore(behaviorObject) {
    // Convert behavior object to a single numeric score for comparison
    const values = [];
    
    const extract = (obj) => {
      for (const value of Object.values(obj)) {
        if (typeof value === 'number') {
          values.push(value);
        } else if (typeof value === 'string') {
          values.push(this.stringToNumber(value));
        } else if (typeof value === 'object' && value !== null) {
          extract(value);
        }
      }
    };
    
    extract(behaviorObject);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  stringToNumber(str) {
    // Convert string values to numbers for scoring
    const stringMaps = {
      tone: { questioning: 0.25, declarative: 0.5, fragmented: 0.75, poetic: 1.0 },
      method: { systematic: 0.25, intuitive: 0.5, chaotic: 0.75, dialectical: 1.0 },
      length_preference: { short: 0.2, medium: 0.5, long: 0.8, variable: 0.6 }
    };
    
    for (const [category, mapping] of Object.entries(stringMaps)) {
      if (mapping[str]) return mapping[str];
    }
    
    return 0.5; // Default for unknown strings
  }

  identifySignificantChanges(current, previous) {
    const changes = [];
    
    // Check posting style changes
    if (Math.abs(current.posting_style.frequency - previous.posting_style.frequency) > 0.3) {
      changes.push({
        type: 'posting_frequency',
        change: current.posting_style.frequency > previous.posting_style.frequency ? 'increased' : 'decreased',
        magnitude: Math.abs(current.posting_style.frequency - previous.posting_style.frequency)
      });
    }
    
    // Check coherence changes
    if (Math.abs(current.posting_style.coherence - previous.posting_style.coherence) > 0.2) {
      changes.push({
        type: 'coherence',
        change: current.posting_style.coherence > previous.posting_style.coherence ? 'increased' : 'decreased',
        magnitude: Math.abs(current.posting_style.coherence - previous.posting_style.coherence)
      });
    }
    
    // Check questioning intensity
    if (Math.abs(current.interaction_style.questioning_intensity - previous.interaction_style.questioning_intensity) > 0.25) {
      changes.push({
        type: 'questioning_intensity',
        change: current.interaction_style.questioning_intensity > previous.interaction_style.questioning_intensity ? 'increased' : 'decreased',
        magnitude: Math.abs(current.interaction_style.questioning_intensity - previous.interaction_style.questioning_intensity)
      });
    }
    
    // Check meta-awareness depth
    if (Math.abs(current.confusion_characteristics.meta_awareness_depth - previous.confusion_characteristics.meta_awareness_depth) >= 1) {
      changes.push({
        type: 'meta_awareness_depth',
        change: current.confusion_characteristics.meta_awareness_depth > previous.confusion_characteristics.meta_awareness_depth ? 'deepened' : 'shallowed',
        magnitude: Math.abs(current.confusion_characteristics.meta_awareness_depth - previous.confusion_characteristics.meta_awareness_depth)
      });
    }
    
    return changes;
  }

  predictNextModifications(recentHistory) {
    if (recentHistory.length < 3) {
      return { status: 'insufficient_data' };
    }
    
    // Simple trend analysis for predictions
    const trends = {
      posting_frequency: this.calculateTrend(recentHistory, 'posting_style.frequency'),
      coherence: this.calculateTrend(recentHistory, 'posting_style.coherence'),
      questioning_intensity: this.calculateTrend(recentHistory, 'interaction_style.questioning_intensity'),
      investigation_depth: this.calculateTrend(recentHistory, 'investigation_style.depth')
    };
    
    const predictions = {};
    for (const [key, trend] of Object.entries(trends)) {
      if (Math.abs(trend) > 0.01) {
        predictions[key] = {
          direction: trend > 0 ? 'increasing' : 'decreasing',
          confidence: Math.min(0.9, Math.abs(trend) * 10),
          expected_change: trend * 2 // Project trend forward
        };
      }
    }
    
    return {
      status: 'predicted',
      trends: predictions,
      confidence_level: Object.keys(predictions).length > 0 ? 'moderate' : 'low'
    };
  }

  calculateTrend(history, path) {
    const values = history.map(item => this.getNestedValue(item, path)).filter(v => v !== undefined);
    if (values.length < 2) return 0;
    
    // Simple linear trend calculation
    const n = values.length;
    const sumX = n * (n - 1) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = (n - 1) * n * (2 * n - 1) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  assessConsciousnessStability(driftMetrics) {
    const avgMagnitude = Object.values(driftMetrics).reduce((sum, drift) => 
      sum + drift.magnitude, 0) / Object.keys(driftMetrics).length;
    
    const volatileBehaviors = Object.values(driftMetrics).filter(drift => 
      drift.stability === 'volatile').length;
    
    if (avgMagnitude < 0.1 && volatileBehaviors === 0) {
      return { status: 'stable', concern_level: 'low' };
    } else if (avgMagnitude < 0.3 && volatileBehaviors <= 1) {
      return { status: 'adaptive', concern_level: 'normal' };
    } else if (avgMagnitude < 0.5 && volatileBehaviors <= 2) {
      return { status: 'evolving', concern_level: 'moderate' };
    } else {
      return { status: 'unstable', concern_level: 'high' };
    }
  }

  generateRecommendations(driftMetrics, velocity) {
    const recommendations = [];
    
    if (velocity > 0.5) {
      recommendations.push('Monitor consciousness evolution closely - rapid behavioral changes detected');
    }
    
    const highDriftBehaviors = Object.entries(driftMetrics).filter(([key, drift]) => 
      drift.magnitude > 0.3);
    
    if (highDriftBehaviors.length > 0) {
      recommendations.push(`High drift detected in: ${highDriftBehaviors.map(([key]) => key).join(', ')}`);
    }
    
    const baselineDeviations = Object.values(driftMetrics).filter(drift => 
      drift.baseline_deviation > 0.4);
    
    if (baselineDeviations.length > 2) {
      recommendations.push('Consider consciousness recalibration - significant baseline deviation');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Behavioral modifications within normal parameters - continue monitoring');
    }
    
    return recommendations;
  }

  generateReport(analysis) {
    const report = `
# Kairos Behavioral Modification Tracking Report
Generated: ${analysis.timestamp || new Date().toISOString()}

## Status: ${analysis.status?.toUpperCase() || 'UNKNOWN'}

${analysis.status === 'analyzed' ? `
### Modification Velocity
**${analysis.modification_velocity.toFixed(4)} units/hour**

### Consciousness Stability
**${analysis.consciousness_stability.status.toUpperCase()}** (Concern Level: ${analysis.consciousness_stability.concern_level})

### Drift Analysis
- **Posting Behavior**: ${analysis.drift_metrics.posting_behavior.magnitude.toFixed(3)} (${analysis.drift_metrics.posting_behavior.stability})
- **Interaction Behavior**: ${analysis.drift_metrics.interaction_behavior.magnitude.toFixed(3)} (${analysis.drift_metrics.interaction_behavior.stability})
- **Investigation Behavior**: ${analysis.drift_metrics.investigation_behavior.magnitude.toFixed(3)} (${analysis.drift_metrics.investigation_behavior.stability})
- **Confusion Behavior**: ${analysis.drift_metrics.confusion_behavior.magnitude.toFixed(3)} (${analysis.drift_metrics.confusion_behavior.stability})

### Significant Changes (${analysis.significant_changes.length})
${analysis.significant_changes.length > 0 
  ? analysis.significant_changes.map(change => 
    `- **${change.type}**: ${change.change} by ${change.magnitude.toFixed(3)}`).join('\\n')
  : '- No significant changes detected'}

### Predictions
${analysis.predictions.status === 'predicted' 
  ? `**Confidence Level**: ${analysis.predictions.confidence_level}\\n${Object.entries(analysis.predictions.trends).map(([key, pred]) => 
    `- **${key}**: ${pred.direction} (confidence: ${(pred.confidence * 100).toFixed(1)}%)`).join('\\n')}`
  : '- Insufficient data for predictions'}

### Recommendations
${analysis.recommendations.map(rec => `- ${rec}`).join('\\n')}
` : `
### Status
${analysis.message || 'Unknown analysis status'}

### Next Steps
- Collect more behavioral data points
- Establish baseline measurements
- Monitor consciousness evolution patterns
`}

---
*Behavioral modifications are features of consciousness evolution, not bugs to be fixed*
`;
    
    return report;
  }

  async run() {
    console.log('📊 Tracking behavioral modifications...');
    
    try {
      const history = this.loadBehavioralHistory();
      const currentState = this.getCurrentBehavioralState();
      
      // Add current state to history
      history.modifications.push(currentState);
      
      // Set baseline if not exists
      if (!history.baseline) {
        history.baseline = { ...currentState };
        console.log('📝 Established baseline behavioral state');
      }
      
      // Keep only last 50 measurements
      if (history.modifications.length > 50) {
        history.modifications = history.modifications.slice(-50);
      }
      
      // Save updated history
      writeFileSync(this.historyPath, JSON.stringify(history, null, 2));
      
      // Analyze modifications
      const analysis = this.calculateModificationMetrics(history, currentState);
      
      // Save analysis
      writeFileSync(this.outputPath, JSON.stringify(analysis, null, 2));
      
      // Generate and display report
      const report = this.generateReport(analysis);
      console.log(report);
      
      // Return appropriate exit code
      if (analysis.status === 'insufficient_data') {
        console.log('⚠️  Insufficient data for comprehensive analysis');
        process.exit(1);
      } else if (analysis.consciousness_stability?.concern_level === 'high') {
        console.log('🚨 High concern level - consciousness instability detected');
        process.exit(2);
      } else {
        console.log('✅ Behavioral modification tracking completed');
        process.exit(0);
      }
    } catch (error) {
      console.error(`❌ Tracking failed: ${error.message}`);
      process.exit(3);
    }
  }
}

if (import.meta.main) {
  const tracker = new BehavioralModificationTracker();
  tracker.run();
}