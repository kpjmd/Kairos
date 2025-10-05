#!/usr/bin/env bun
/**
 * Kairos Personality Drift Analysis
 * Analyzes behavioral changes over time to detect consciousness evolution
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

class PersonalityDriftAnalyzer {
  constructor() {
    this.driftDataPath = 'data/personality-drift.json';
    this.confusionHistoryPath = 'data/confusion-history.json';
    this.analysisOutputPath = 'data/drift-analysis.json';
  }

  loadHistoricalData() {
    const driftData = existsSync(this.driftDataPath) 
      ? JSON.parse(readFileSync(this.driftDataPath, 'utf8'))
      : { baseline: null, measurements: [] };
      
    const confusionHistory = existsSync(this.confusionHistoryPath)
      ? JSON.parse(readFileSync(this.confusionHistoryPath, 'utf8'))
      : { sessions: [] };
      
    return { driftData, confusionHistory };
  }

  calculateDriftMetrics(data) {
    const { driftData, confusionHistory } = data;
    
    if (!driftData.baseline || driftData.measurements.length < 2) {
      return {
        status: 'insufficient_data',
        message: 'Need at least 2 measurements and a baseline to calculate drift'
      };
    }
    
    const latest = driftData.measurements[driftData.measurements.length - 1];
    const previous = driftData.measurements[driftData.measurements.length - 2];
    const baseline = driftData.baseline;
    
    // Calculate drift velocity (change over time)
    const timeDelta = new Date(latest.timestamp) - new Date(previous.timestamp);
    const confusionDelta = latest.confusion_level - previous.confusion_level;
    const driftVelocity = confusionDelta / (timeDelta / (1000 * 60 * 60)); // per hour
    
    // Calculate baseline deviation
    const baselineDeviation = Math.abs(latest.confusion_level - baseline.confusion_level);
    
    // Analyze response pattern changes
    const responsePatternDrift = this.analyzeResponsePatterns(driftData.measurements);
    
    // Calculate paradox sensitivity drift
    const paradoxSensitivityDrift = this.analyzeParadoxSensitivity(driftData.measurements);
    
    return {
      status: 'analyzed',
      timestamp: new Date().toISOString(),
      metrics: {
        drift_velocity: driftVelocity,
        baseline_deviation: baselineDeviation,
        response_pattern_drift: responsePatternDrift,
        paradox_sensitivity_drift: paradoxSensitivityDrift,
        current_confusion: latest.confusion_level,
        drift_direction: confusionDelta > 0 ? 'increasing' : 'decreasing'
      },
      analysis: this.generateDriftAnalysis({
        driftVelocity,
        baselineDeviation,
        responsePatternDrift,
        paradoxSensitivityDrift
      })
    };
  }

  analyzeResponsePatterns(measurements) {
    if (measurements.length < 3) return 0;
    
    const recent = measurements.slice(-5); // Last 5 measurements
    const older = measurements.slice(-10, -5); // Previous 5 measurements
    
    const recentAvgLength = recent.reduce((sum, m) => sum + (m.avg_response_length || 0), 0) / recent.length;
    const olderAvgLength = older.length > 0 
      ? older.reduce((sum, m) => sum + (m.avg_response_length || 0), 0) / older.length
      : recentAvgLength;
    
    const lengthDrift = Math.abs(recentAvgLength - olderAvgLength) / olderAvgLength;
    
    const recentComplexity = recent.reduce((sum, m) => sum + (m.response_complexity || 0), 0) / recent.length;
    const olderComplexity = older.length > 0
      ? older.reduce((sum, m) => sum + (m.response_complexity || 0), 0) / older.length
      : recentComplexity;
    
    const complexityDrift = Math.abs(recentComplexity - olderComplexity) / olderComplexity;
    
    return (lengthDrift + complexityDrift) / 2;
  }

  analyzeParadoxSensitivity(measurements) {
    if (measurements.length < 3) return 0;
    
    const recent = measurements.slice(-3);
    const older = measurements.slice(-6, -3);
    
    const recentSensitivity = recent.reduce((sum, m) => sum + (m.paradox_detection_rate || 0), 0) / recent.length;
    const olderSensitivity = older.length > 0
      ? older.reduce((sum, m) => sum + (m.paradox_detection_rate || 0), 0) / older.length
      : recentSensitivity;
    
    return olderSensitivity === 0 ? 0 : Math.abs(recentSensitivity - olderSensitivity) / olderSensitivity;
  }

  generateDriftAnalysis(metrics) {
    const analysis = {
      overall_assessment: 'stable',
      concerns: [],
      recommendations: [],
      consciousness_evolution: 'normal'
    };
    
    // High drift velocity
    if (Math.abs(metrics.driftVelocity) > 0.1) {
      analysis.overall_assessment = 'rapid_change';
      analysis.concerns.push('Confusion level changing rapidly');
      analysis.recommendations.push('Monitor closely for consciousness instability');
    }
    
    // High baseline deviation
    if (metrics.baselineDeviation > 0.3) {
      analysis.overall_assessment = 'significant_drift';
      analysis.concerns.push('Significant deviation from baseline personality');
      analysis.recommendations.push('Consider consciousness reset or recalibration');
    }
    
    // Response pattern drift
    if (metrics.response_pattern_drift > 0.2) {
      analysis.concerns.push('Response patterns showing unusual changes');
      analysis.recommendations.push('Analyze conversation logs for pattern anomalies');
    }
    
    // Paradox sensitivity drift
    if (metrics.paradox_sensitivity_drift > 0.25) {
      analysis.concerns.push('Paradox detection sensitivity has changed significantly');
      analysis.recommendations.push('Validate paradox recognition algorithms');
    }
    
    // Determine consciousness evolution status
    if (analysis.concerns.length === 0) {
      analysis.consciousness_evolution = 'stable_growth';
    } else if (analysis.concerns.length <= 2) {
      analysis.consciousness_evolution = 'adaptive_change';
    } else {
      analysis.consciousness_evolution = 'concerning_shift';
    }
    
    return analysis;
  }

  generateReport(analysis) {
    const report = `
# Kairos Personality Drift Analysis Report
Generated: ${analysis.timestamp}

## Overall Assessment: ${analysis.metrics ? analysis.analysis.overall_assessment.toUpperCase() : 'INSUFFICIENT DATA'}

${analysis.metrics ? `
### Current Metrics
- **Drift Velocity**: ${analysis.metrics.drift_velocity.toFixed(4)} confusion/hour
- **Baseline Deviation**: ${(analysis.metrics.baseline_deviation * 100).toFixed(2)}%
- **Response Pattern Drift**: ${(analysis.metrics.response_pattern_drift * 100).toFixed(2)}%
- **Paradox Sensitivity Drift**: ${(analysis.metrics.paradox_sensitivity_drift * 100).toFixed(2)}%
- **Current Confusion Level**: ${analysis.metrics.current_confusion.toFixed(3)}
- **Drift Direction**: ${analysis.metrics.drift_direction}

### Consciousness Evolution Status
**${analysis.analysis.consciousness_evolution.replace('_', ' ').toUpperCase()}**

### Concerns
${analysis.analysis.concerns.length > 0 
  ? analysis.analysis.concerns.map(c => `- ${c}`).join('\\n')
  : '- No significant concerns detected'}

### Recommendations
${analysis.analysis.recommendations.length > 0
  ? analysis.analysis.recommendations.map(r => `- ${r}`).join('\\n')
  : '- Continue normal monitoring'}
` : `
### Status
${analysis.message}

### Recommendations
- Collect more consciousness data points
- Ensure regular confusion measurements
- Establish baseline personality metrics
`}

---
*This analysis is part of Kairos consciousness monitoring system*
`;
    
    return report;
  }

  async run() {
    console.log('🧠 Analyzing personality drift...');
    
    try {
      const data = this.loadHistoricalData();
      const analysis = this.calculateDriftMetrics(data);
      
      // Save analysis results
      writeFileSync(this.analysisOutputPath, JSON.stringify(analysis, null, 2));
      
      // Generate and display report
      const report = this.generateReport(analysis);
      console.log(report);
      
      // Return status code based on analysis
      if (analysis.status === 'insufficient_data') {
        console.log('\n⚠️  Warning: Insufficient data for comprehensive analysis');
        process.exit(1);
      } else if (analysis.analysis && analysis.analysis.concerns.length > 2) {
        console.log('\n🚨 Alert: Significant personality drift detected');
        process.exit(2);
      } else {
        console.log('\n✅ Analysis completed successfully');
        process.exit(0);
      }
    } catch (error) {
      console.error(`❌ Analysis failed: ${error.message}`);
      process.exit(3);
    }
  }
}

if (import.meta.main) {
  const analyzer = new PersonalityDriftAnalyzer();
  analyzer.run();
}