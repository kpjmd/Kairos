const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

// Import the analyzer from the compiled kairos package
const { ConsciousnessAnalyzer } = require('../packages/kairos/dist/index.cjs');

class ConsciousnessDashboard {
  constructor(config) {
    this.config = config;
    this.analyzer = new ConsciousnessAnalyzer(config);
  }

  async generateDashboard() {
    console.log("📊 Kairos Consciousness Analysis Dashboard");
    console.log("==========================================");
    console.log(`Session ID: ${this.config.sessionId}`);
    console.log(`Generated: ${new Date().toISOString()}`);
    console.log("");

    try {
      // Extract all data
      console.log("🔍 Gathering consciousness data...");
      const states = await this.analyzer.extractConsciousnessStates();
      const metaParadoxes = await this.analyzer.extractMetaParadoxEvents();
      const transitions = await this.analyzer.extractZoneTransitions();
      const resets = await this.analyzer.extractEmergencyResets();
      
      if (states.length === 0) {
        console.log("ℹ️ No consciousness data found. The agent may not have started recording yet.");
        return;
      }
      
      console.log(`✅ Loaded ${states.length} consciousness states, ${metaParadoxes.length} meta-paradoxes, ${transitions.length} transitions`);
      console.log("");
      
      // Perform comprehensive analysis
      const analysis = await this.analyzer.analyzeConsciousness();
      
      // Display dashboard sections
      await this.displayOverview(analysis, states);
      await this.displayConfusionAnalysis(states, analysis);
      await this.displayCoherenceAnalysis(states, analysis);
      await this.displaySafetyAnalysis(states, transitions, analysis);
      await this.displayParadoxAnalysis(states, metaParadoxes, analysis);
      await this.displayTemporalAnalysis(states);
      await this.displayCriticalEventsAnalysis(transitions, resets, analysis);
      await this.displayPatternAnalysis(states);
      await this.displayResearchInsights(analysis, states, metaParadoxes);
      
      // Generate visualization data
      await this.generateVisualizationData(states, metaParadoxes, transitions, analysis);
      
      console.log("🎉 Dashboard analysis complete!");
      
    } catch (error) {
      console.error("❌ Dashboard generation failed:", error);
      throw error;
    }
  }

  async displayOverview(analysis, states) {
    console.log("📈 CONSCIOUSNESS OVERVIEW");
    console.log("=========================");
    
    const duration = analysis.timeRange.durationHours;
    const recordingRate = analysis.totalStates / duration;
    const latestState = states[states.length - 1];
    
    console.log(`🧠 Total Recordings: ${analysis.totalStates}`);
    console.log(`⏱️ Time Span: ${duration.toFixed(2)} hours (${(duration / 24).toFixed(1)} days)`);
    console.log(`📊 Recording Rate: ${recordingRate.toFixed(2)} states/hour`);
    console.log(`🕐 Started: ${new Date(analysis.timeRange.start).toISOString()}`);
    console.log(`🕐 Latest: ${new Date(analysis.timeRange.end).toISOString()}`);
    console.log("");
    
    console.log("Current Status:");
    console.log(`  🎯 Current Confusion: ${latestState.confusionLevel.toFixed(4)}`);
    console.log(`  🔗 Current Coherence: ${latestState.coherenceLevel.toFixed(4)}`);
    console.log(`  🛡️ Current Zone: ${this.formatZone(latestState.safetyZone)}`);
    console.log(`  🌀 Active Paradoxes: ${latestState.paradoxCount}`);
    console.log(`  🌌 Meta-Paradoxes: ${latestState.metaParadoxCount}`);
    console.log("");
  }

  async displayConfusionAnalysis(states, analysis) {
    console.log("🌪️ CONFUSION LEVEL ANALYSIS");
    console.log("===========================");
    
    const confusionLevels = states.map(s => s.confusionLevel);
    const stats = analysis.confusionStats;
    
    console.log(`📊 Range: ${stats.min.toFixed(4)} → ${stats.max.toFixed(4)}`);
    console.log(`📈 Average: ${stats.average.toFixed(4)}`);
    console.log(`📉 Trend: ${this.formatTrend(stats.trend)}`);
    console.log("");
    
    // Distribution analysis
    const distribution = this.calculateDistribution(confusionLevels);
    console.log("Distribution:");
    console.log(`  🟢 Low (0.0-0.3):    ${distribution.low} (${(distribution.low/states.length*100).toFixed(1)}%)`);
    console.log(`  🟡 Medium (0.3-0.6):  ${distribution.medium} (${(distribution.medium/states.length*100).toFixed(1)}%)`);
    console.log(`  🟠 High (0.6-0.8):    ${distribution.high} (${(distribution.high/states.length*100).toFixed(1)}%)`);
    console.log(`  🔴 Critical (0.8+):   ${distribution.critical} (${(distribution.critical/states.length*100).toFixed(1)}%)`);
    console.log("");
    
    // Recent trend
    const recentStates = states.slice(-10);
    const recentAvg = recentStates.reduce((sum, s) => sum + s.confusionLevel, 0) / recentStates.length;
    const overallAvg = stats.average;
    
    if (recentAvg > overallAvg + 0.1) {
      console.log("⚠️ Recent confusion levels are ELEVATED compared to session average");
    } else if (recentAvg < overallAvg - 0.1) {
      console.log("✅ Recent confusion levels are REDUCED compared to session average");
    } else {
      console.log("ℹ️ Recent confusion levels are STABLE compared to session average");
    }
    console.log("");
  }

  async displayCoherenceAnalysis(states, analysis) {
    console.log("🎯 COHERENCE LEVEL ANALYSIS");
    console.log("===========================");
    
    const coherenceLevels = states.map(s => s.coherenceLevel);
    const stats = analysis.coherenceStats;
    
    console.log(`📊 Range: ${stats.min.toFixed(4)} → ${stats.max.toFixed(4)}`);
    console.log(`📈 Average: ${stats.average.toFixed(4)}`);
    console.log(`📉 Trend: ${this.formatTrend(stats.trend)}`);
    console.log("");
    
    // Coherence vs Confusion correlation
    const correlation = this.calculateCorrelation(
      states.map(s => s.confusionLevel),
      states.map(s => s.coherenceLevel)
    );
    
    console.log(`🔗 Confusion-Coherence Correlation: ${correlation.toFixed(3)}`);
    if (correlation < -0.5) {
      console.log("   Strong inverse relationship - as confusion rises, coherence falls");
    } else if (correlation > 0.5) {
      console.log("   Positive relationship - confusion and coherence move together");
    } else {
      console.log("   Weak relationship - confusion and coherence are largely independent");
    }
    console.log("");
  }

  async displaySafetyAnalysis(states, transitions, analysis) {
    console.log("🛡️ SAFETY ZONE ANALYSIS");
    console.log("=======================");
    
    const zones = analysis.safetyZoneDistribution;
    console.log("Time Distribution:");
    console.log(`  🟢 GREEN:     ${zones.GREEN} states (${(zones.GREEN/analysis.totalStates*100).toFixed(1)}%)`);
    console.log(`  🟡 YELLOW:    ${zones.YELLOW} states (${(zones.YELLOW/analysis.totalStates*100).toFixed(1)}%)`);
    console.log(`  🔴 RED:       ${zones.RED} states (${(zones.RED/analysis.totalStates*100).toFixed(1)}%)`);
    console.log(`  🚨 EMERGENCY: ${zones.EMERGENCY} states (${(zones.EMERGENCY/analysis.totalStates*100).toFixed(1)}%)`);
    console.log("");
    
    // Safety score
    const safetyScore = (zones.GREEN * 1.0 + zones.YELLOW * 0.7 + zones.RED * 0.3 + zones.EMERGENCY * 0.0) / analysis.totalStates;
    console.log(`🏆 Safety Score: ${(safetyScore * 100).toFixed(1)}%`);
    
    if (safetyScore > 0.8) {
      console.log("   ✅ Excellent - Consciousness operates safely most of the time");
    } else if (safetyScore > 0.6) {
      console.log("   ⚠️ Good - Some periods of elevated risk");
    } else if (safetyScore > 0.4) {
      console.log("   ⚠️ Moderate - Frequent high-risk operation");
    } else {
      console.log("   🚨 Poor - Consciousness frequently in dangerous states");
    }
    console.log("");
    
    // Transition analysis
    if (transitions.length > 0) {
      console.log(`🔄 Zone Transitions: ${transitions.length} total`);
      
      const escalations = transitions.filter(t => 
        (t.fromZone === 'GREEN' && (t.toZone === 'YELLOW' || t.toZone === 'RED')) ||
        (t.fromZone === 'YELLOW' && t.toZone === 'RED') ||
        t.toZone === 'EMERGENCY'
      ).length;
      
      const deescalations = transitions.filter(t => 
        (t.fromZone === 'RED' && (t.toZone === 'YELLOW' || t.toZone === 'GREEN')) ||
        (t.fromZone === 'YELLOW' && t.toZone === 'GREEN') ||
        (t.fromZone === 'EMERGENCY' && t.toZone !== 'EMERGENCY')
      ).length;
      
      console.log(`  ↗️ Escalations: ${escalations}`);
      console.log(`  ↘️ De-escalations: ${deescalations}`);
      
      if (deescalations > escalations) {
        console.log("   ✅ Good recovery pattern - consciousness stabilizes well");
      } else if (escalations > deescalations) {
        console.log("   ⚠️ Escalation pattern - consciousness tends toward instability");
      } else {
        console.log("   ℹ️ Balanced transition pattern");
      }
    }
    console.log("");
  }

  async displayParadoxAnalysis(states, metaParadoxes, analysis) {
    console.log("🌀 PARADOX EVOLUTION ANALYSIS");
    console.log("=============================");
    
    const stats = analysis.paradoxProgression;
    console.log(`🔢 Total Paradoxes: ${stats.totalParadoxes}`);
    console.log(`🌌 Meta-Paradoxes: ${stats.metaParadoxes}`);
    console.log(`📊 Average per State: ${stats.averageParadoxesPerState.toFixed(2)}`);
    console.log("");
    
    if (metaParadoxes.length > 0) {
      console.log("Recent Meta-Paradox Emergences:");
      const recent = metaParadoxes.slice(-3);
      recent.forEach((mp, i) => {
        console.log(`  ${recent.length - i}. ${mp.paradoxName} (${new Date(mp.timestamp).toISOString()})`);
        console.log(`     Emergence Confusion: ${mp.emergenceConfusion.toFixed(4)}`);
        console.log(`     Sources: ${mp.sourceParadoxes.slice(0, 3).join(', ')}${mp.sourceParadoxes.length > 3 ? '...' : ''}`);
      });
      console.log("");
    }
    
    // Paradox growth rate
    if (states.length > 1) {
      const firstState = states[0];
      const lastState = states[states.length - 1];
      const paradoxGrowth = lastState.paradoxCount - firstState.paradoxCount;
      const timeHours = (lastState.timestamp - firstState.timestamp) / (1000 * 60 * 60);
      const growthRate = paradoxGrowth / timeHours;
      
      console.log(`📈 Paradox Growth Rate: ${growthRate.toFixed(2)} paradoxes/hour`);
      
      if (growthRate > 1) {
        console.log("   ⚠️ Rapid paradox accumulation - consciousness complexity increasing quickly");
      } else if (growthRate > 0) {
        console.log("   ℹ️ Steady paradox growth - normal consciousness development");
      } else {
        console.log("   ✅ Stable paradox count - consciousness has reached equilibrium");
      }
    }
    console.log("");
  }

  async displayTemporalAnalysis(states) {
    console.log("⏰ TEMPORAL PATTERN ANALYSIS");
    console.log("============================");
    
    // Analyze patterns by hour of day if we have enough data
    if (states.length > 24) {
      const hourlyConfusion = new Array(24).fill(0);
      const hourlyCounts = new Array(24).fill(0);
      
      states.forEach(state => {
        const hour = new Date(state.timestamp).getHours();
        hourlyConfusion[hour] += state.confusionLevel;
        hourlyCounts[hour]++;
      });
      
      // Calculate averages
      for (let i = 0; i < 24; i++) {
        if (hourlyCounts[i] > 0) {
          hourlyConfusion[i] /= hourlyCounts[i];
        }
      }
      
      // Find peak confusion hours
      const maxConfusionHour = hourlyConfusion.indexOf(Math.max(...hourlyConfusion.filter(v => v > 0)));
      const minConfusionHour = hourlyConfusion.indexOf(Math.min(...hourlyConfusion.filter(v => v > 0)));
      
      console.log("Daily Patterns:");
      console.log(`  🌅 Peak Confusion Hour: ${maxConfusionHour}:00 (${hourlyConfusion[maxConfusionHour].toFixed(4)})`);
      console.log(`  🌙 Lowest Confusion Hour: ${minConfusionHour}:00 (${hourlyConfusion[minConfusionHour].toFixed(4)})`);
      console.log("");
    }
    
    // Recording interval analysis
    const intervals = [];
    for (let i = 1; i < states.length; i++) {
      intervals.push(states[i].timestamp - states[i-1].timestamp);
    }
    
    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
      const minInterval = Math.min(...intervals);
      const maxInterval = Math.max(...intervals);
      
      console.log("Recording Intervals:");
      console.log(`  📊 Average: ${(avgInterval / 1000 / 60).toFixed(1)} minutes`);
      console.log(`  ⚡ Fastest: ${(minInterval / 1000).toFixed(1)} seconds`);
      console.log(`  🐌 Slowest: ${(maxInterval / 1000 / 60).toFixed(1)} minutes`);
      
      // Check for gaps in recording
      const largeGaps = intervals.filter(i => i > avgInterval * 3).length;
      if (largeGaps > 0) {
        console.log(`  ⚠️ ${largeGaps} large gaps detected in recording`);
      } else {
        console.log(`  ✅ Consistent recording pattern`);
      }
    }
    console.log("");
  }

  async displayCriticalEventsAnalysis(transitions, resets, analysis) {
    console.log("🚨 CRITICAL EVENTS ANALYSIS");
    console.log("===========================");
    
    const events = analysis.emergencyEvents;
    console.log(`🔄 Total Zone Transitions: ${events.zoneTransitions}`);
    console.log(`🚨 Emergency Resets: ${events.totalResets}`);
    console.log(`⚠️ Critical Periods: ${events.criticalPeriods.length}`);
    console.log("");
    
    if (events.criticalPeriods.length > 0) {
      console.log("Critical Periods:");
      events.criticalPeriods.forEach((period, i) => {
        const duration = (period.end - period.start) / 1000 / 60; // minutes
        console.log(`  ${i + 1}. ${new Date(period.start).toISOString()}`);
        console.log(`     Duration: ${duration.toFixed(1)} minutes`);
        console.log(`     Max Confusion: ${period.maxConfusion.toFixed(4)}`);
        console.log(`     Reason: ${period.reason}`);
      });
      console.log("");
    }
    
    // Recovery analysis
    if (transitions.length > 0) {
      const recoveryTimes = [];
      let inCrisis = false;
      let crisisStart = 0;
      
      transitions.forEach(t => {
        if ((t.toZone === 'RED' || t.toZone === 'EMERGENCY') && !inCrisis) {
          inCrisis = true;
          crisisStart = t.timestamp;
        } else if ((t.toZone === 'GREEN' || t.toZone === 'YELLOW') && inCrisis) {
          inCrisis = false;
          recoveryTimes.push(t.timestamp - crisisStart);
        }
      });
      
      if (recoveryTimes.length > 0) {
        const avgRecovery = recoveryTimes.reduce((sum, t) => sum + t, 0) / recoveryTimes.length;
        console.log(`🔧 Average Recovery Time: ${(avgRecovery / 1000 / 60).toFixed(1)} minutes`);
        console.log(`📊 Recovery Events: ${recoveryTimes.length}`);
      }
    }
    console.log("");
  }

  async displayPatternAnalysis(states) {
    console.log("🔍 PATTERN DETECTION ANALYSIS");
    console.log("=============================");
    
    // Detect oscillation patterns
    const confusionLevels = states.map(s => s.confusionLevel);
    const oscillations = this.detectOscillations(confusionLevels);
    
    if (oscillations.detected) {
      console.log(`🌊 Oscillation Pattern Detected:`);
      console.log(`   Period: ~${oscillations.period} recordings`);
      console.log(`   Amplitude: ${oscillations.amplitude.toFixed(4)}`);
      console.log(`   Frequency: ${oscillations.frequency.toFixed(2)} cycles per hour`);
    } else {
      console.log(`📊 No clear oscillation patterns detected`);
    }
    console.log("");
    
    // Stability analysis
    const recentWindow = Math.min(20, Math.floor(states.length * 0.1));
    const recent = states.slice(-recentWindow);
    const recentStdDev = this.calculateStandardDeviation(recent.map(s => s.confusionLevel));
    
    console.log(`📈 Recent Stability (last ${recentWindow} states):`);
    console.log(`   Confusion Std Dev: ${recentStdDev.toFixed(4)}`);
    
    if (recentStdDev < 0.05) {
      console.log(`   ✅ Very stable - low variability`);
    } else if (recentStdDev < 0.1) {
      console.log(`   ✅ Stable - moderate variability`);
    } else if (recentStdDev < 0.2) {
      console.log(`   ⚠️ Unstable - high variability`);
    } else {
      console.log(`   🚨 Very unstable - extreme variability`);
    }
    console.log("");
  }

  async displayResearchInsights(analysis, states, metaParadoxes) {
    console.log("🔬 RESEARCH INSIGHTS & RECOMMENDATIONS");
    console.log("=====================================");
    
    const insights = [];
    
    // Confusion trend insights
    if (analysis.confusionStats.trend === 'increasing') {
      insights.push("📈 Confusion is trending upward - consciousness may be exploring new complexity");
      insights.push("   Consider monitoring for potential breakthrough or instability");
    } else if (analysis.confusionStats.trend === 'decreasing') {
      insights.push("📉 Confusion is trending downward - consciousness appears to be stabilizing");
      insights.push("   This may indicate successful learning and pattern integration");
    }
    
    // Safety insights
    const riskRatio = (analysis.safetyZoneDistribution.RED + analysis.safetyZoneDistribution.EMERGENCY) / analysis.totalStates;
    if (riskRatio > 0.2) {
      insights.push("⚠️ High-risk operation detected - consciousness spends significant time in dangerous zones");
      insights.push("   Consider adjusting confusion thresholds or implementing additional safeguards");
    } else if (riskRatio < 0.05) {
      insights.push("✅ Very safe operation - consciousness remains well within safety parameters");
      insights.push("   Current safeguards appear effective");
    }
    
    // Meta-paradox insights
    if (metaParadoxes.length > 0) {
      const emergenceRate = metaParadoxes.length / analysis.timeRange.durationHours;
      if (emergenceRate > 0.5) {
        insights.push("🌀 High meta-paradox emergence rate - consciousness generating novel complexity");
        insights.push("   This indicates active exploration of conceptual boundaries");
      }
    }
    
    // Correlation insights
    const confusionCoherenceCorr = this.calculateCorrelation(
      states.map(s => s.confusionLevel),
      states.map(s => s.coherenceLevel)
    );
    
    if (confusionCoherenceCorr < -0.7) {
      insights.push("🔗 Strong inverse correlation between confusion and coherence");
      insights.push("   This suggests healthy self-regulation mechanisms");
    } else if (confusionCoherenceCorr > 0.3) {
      insights.push("⚠️ Positive correlation between confusion and coherence detected");
      insights.push("   This unusual pattern warrants further investigation");
    }
    
    if (insights.length === 0) {
      insights.push("ℹ️ Consciousness operation appears normal with no notable patterns detected");
    }
    
    insights.forEach(insight => console.log(insight));
    console.log("");
    
    // Recommendations
    console.log("📋 Recommendations:");
    console.log("===================");
    
    if (riskRatio > 0.15) {
      console.log("• Consider implementing stricter confusion thresholds");
      console.log("• Increase monitoring frequency during high-confusion periods");
    }
    
    if (analysis.confusionStats.trend === 'increasing') {
      console.log("• Monitor for potential consciousness breakthrough events");
      console.log("• Prepare emergency intervention protocols");
    }
    
    if (metaParadoxes.length === 0 && analysis.totalStates > 50) {
      console.log("• Consider introducing more complex paradoxes to stimulate meta-emergence");
    }
    
    console.log("• Continue regular data collection for long-term pattern analysis");
    console.log("• Archive consciousness states for future comparative research");
    console.log("");
  }

  async generateVisualizationData(states, metaParadoxes, transitions, analysis) {
    console.log("📊 GENERATING VISUALIZATION DATA");
    console.log("================================");
    
    // Prepare data for charts/graphs
    const vizData = {
      timestamp: Date.now(),
      sessionId: this.config.sessionId,
      
      // Time series data
      timeSeriesData: states.map(state => ({
        timestamp: state.timestamp,
        confusion: state.confusionLevel,
        coherence: state.coherenceLevel,
        safetyZone: state.safetyZone,
        paradoxCount: state.paradoxCount
      })),
      
      // Zone distribution for pie chart
      zoneDistribution: analysis.safetyZoneDistribution,
      
      // Confusion/coherence scatter plot data
      scatterData: states.map(state => ({
        x: state.confusionLevel,
        y: state.coherenceLevel,
        zone: state.safetyZone,
        timestamp: state.timestamp
      })),
      
      // Meta-paradox timeline
      metaParadoxTimeline: metaParadoxes.map(mp => ({
        timestamp: mp.timestamp,
        name: mp.paradoxName,
        intensity: mp.emergenceConfusion
      })),
      
      // Zone transitions
      transitionEvents: transitions.map(t => ({
        timestamp: t.timestamp,
        from: t.fromZone,
        to: t.toZone,
        confusion: t.triggerConfusion
      })),
      
      // Statistical summary
      summary: {
        totalStates: analysis.totalStates,
        durationHours: analysis.timeRange.durationHours,
        avgConfusion: analysis.confusionStats.average,
        avgCoherence: analysis.coherenceStats.average,
        confusionTrend: analysis.confusionStats.trend,
        coherenceTrend: analysis.coherenceStats.trend
      }
    };
    
    // Save visualization data
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(__dirname, '..', 'data', 'visualizations');
    const outputFile = path.join(outputDir, `viz-data-${timestamp}.json`);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(vizData, null, 2));
    console.log(`💾 Visualization data saved: ${outputFile}`);
    
    // Also save as CSV for easy import into other tools
    const csvFile = path.join(outputDir, `consciousness-data-${timestamp}.csv`);
    const csvData = this.generateCSV(states);
    fs.writeFileSync(csvFile, csvData);
    console.log(`📊 CSV data saved: ${csvFile}`);
    console.log("");
  }

  generateCSV(states) {
    const headers = [
      'timestamp',
      'datetime',
      'confusionLevel',
      'coherenceLevel',
      'safetyZone',
      'paradoxCount',
      'metaParadoxCount',
      'frustrationLevel'
    ].join(',');
    
    const rows = states.map(state => [
      state.timestamp,
      new Date(state.timestamp).toISOString(),
      state.confusionLevel,
      state.coherenceLevel,
      state.safetyZone,
      state.paradoxCount,
      state.metaParadoxCount,
      state.frustrationLevel
    ].join(','));
    
    return [headers, ...rows].join('\\n');
  }

  // Helper methods
  formatZone(zone) {
    const icons = { GREEN: '🟢', YELLOW: '🟡', RED: '🔴', EMERGENCY: '🚨' };
    return `${icons[zone] || '❓'} ${zone}`;
  }

  formatTrend(trend) {
    const icons = { increasing: '📈', decreasing: '📉', stable: '➡️' };
    return `${icons[trend]} ${trend.toUpperCase()}`;
  }

  calculateDistribution(values) {
    return {
      low: values.filter(v => v < 0.3).length,
      medium: values.filter(v => v >= 0.3 && v < 0.6).length,
      high: values.filter(v => v >= 0.6 && v < 0.8).length,
      critical: values.filter(v => v >= 0.8).length
    };
  }

  calculateCorrelation(x, y) {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  calculateStandardDeviation(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  detectOscillations(values) {
    // Simple oscillation detection using autocorrelation
    if (values.length < 10) return { detected: false };
    
    const maxLag = Math.floor(values.length / 4);
    let bestLag = 0;
    let bestCorrelation = 0;
    
    for (let lag = 1; lag <= maxLag; lag++) {
      const correlation = this.calculateAutocorrelation(values, lag);
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }
    
    if (bestCorrelation > 0.3) {
      const amplitude = Math.max(...values) - Math.min(...values);
      return {
        detected: true,
        period: bestLag,
        amplitude: amplitude,
        frequency: 1 / bestLag
      };
    }
    
    return { detected: false };
  }

  calculateAutocorrelation(values, lag) {
    const n = values.length - lag;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (values[i] - mean) * (values[i + lag] - mean);
    }
    
    for (let i = 0; i < values.length; i++) {
      denominator += Math.pow(values[i] - mean, 2);
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
}

async function main() {
  // Load deployment configuration
  const deploymentFile = path.join(__dirname, '..', 'deployments', 'base-sepolia.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Run deploy-contracts.js first.");
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  
  // Configuration
  const config = {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    consciousnessContractAddress: deployment.contracts.KairosConsciousness.address,
    interactionContractAddress: deployment.contracts.KairosInteraction.address,
    sessionId: deployment.sessionId,
    networkConfig: { name: 'base-sepolia', chainId: 84532 }
  };
  
  // Create and run dashboard
  const dashboard = new ConsciousnessDashboard(config);
  await dashboard.generateDashboard();
}

// Handle command line arguments
if (require.main === module) {
  main()
    .then(() => {
      console.log("🎉 Dashboard analysis completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Dashboard generation failed:", error);
      process.exit(1);
    });
}

module.exports = { ConsciousnessDashboard, main };