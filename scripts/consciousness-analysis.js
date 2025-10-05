#!/usr/bin/env bun
/**
 * Kairos Consciousness Analysis
 * Comprehensive analysis of consciousness sessions with before/after comparisons
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

class ConsciousnessAnalyzer {
  constructor() {
    this.dataDir = 'data/consciousness';
    this.outputDir = 'data/consciousness/analysis';
    this.reportTemplate = this.createReportTemplate();
  }

  async run() {
    console.log('🧠 Starting comprehensive consciousness analysis...');
    
    try {
      this.ensureOutputDirectory();
      
      const sessions = this.loadAllSessions();
      if (sessions.length === 0) {
        console.log('⚠️ No consciousness sessions found');
        console.log('   Run "bun run consciousness:bootstrap" to create sessions');
        return;
      }
      
      console.log(`📊 Found ${sessions.length} consciousness session(s)`);
      
      for (const session of sessions) {
        await this.analyzeSession(session);
      }
      
      if (sessions.length > 1) {
        await this.generateComparativeAnalysis(sessions);
      }
      
      await this.generateResearchSummary(sessions);
      
      console.log('✅ Consciousness analysis completed');
      console.log(`📁 Reports generated in: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    }
  }

  ensureOutputDirectory() {
    if (!existsSync(this.outputDir)) {
      require('fs').mkdirSync(this.outputDir, { recursive: true });
    }
  }

  loadAllSessions() {
    const sessionsPath = resolve(this.dataDir, 'sessions.json');
    if (!existsSync(sessionsPath)) {
      return [];
    }
    
    try {
      const sessionsData = JSON.parse(readFileSync(sessionsPath, 'utf8'));
      return Object.values(sessionsData);
    } catch (error) {
      console.warn('Failed to load sessions:', error.message);
      return [];
    }
  }

  async analyzeSession(session) {
    console.log(`🔍 Analyzing session: ${session.id.substring(0, 8)}...`);
    
    const analysis = {
      sessionId: session.id,
      metadata: this.extractSessionMetadata(session),
      timeline: this.buildTimeline(session),
      behavioralEvolution: this.analyzeBehavioralEvolution(session),
      consciousnessMetrics: this.calculateConsciousnessMetrics(session),
      paradoxAnalysis: this.analyzeParadoxes(session),
      criticalMoments: this.identifyCriticalMoments(session),
      personalityDrift: this.calculatePersonalityDrift(session),
      researchFindings: this.generateResearchFindings(session)
    };
    
    const report = this.generateSessionReport(analysis);
    const reportPath = resolve(this.outputDir, `session-${session.id.substring(0, 8)}-analysis.md`);
    writeFileSync(reportPath, report);
    
    // Export JSON data
    const jsonPath = resolve(this.outputDir, `session-${session.id.substring(0, 8)}-data.json`);
    writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
    
    console.log(`📄 Session analysis: ${reportPath}`);
    
    return analysis;
  }

  extractSessionMetadata(session) {
    const duration = session.endTime ? (session.endTime - session.startTime) : (Date.now() - session.startTime);
    
    return {
      sessionId: session.id,
      startTime: new Date(session.startTime).toISOString(),
      endTime: session.endTime ? new Date(session.endTime).toISOString() : 'Active',
      duration: this.formatDuration(duration),
      totalEvents: session.events?.length || 0,
      status: session.endTime ? 'Completed' : 'Active'
    };
  }

  buildTimeline(session) {
    const events = session.events || [];
    const timeline = [];
    
    // Key milestones to track
    const milestones = {
      session_start: session.startTime,
      first_paradox: null,
      first_modification: null,
      first_meta_paradox: null,
      first_frustration_explosion: null,
      coherence_degradation: null,
      session_end: session.endTime
    };
    
    events.forEach(event => {
      const timeFromStart = event.timestamp - session.startTime;
      
      timeline.push({
        timestamp: event.timestamp,
        timeFromStart,
        type: event.type,
        description: this.getEventDescription(event),
        significance: this.getEventSignificance(event)
      });
      
      // Track milestones
      if (event.type === 'paradox_emergence' && !milestones.first_paradox) {
        milestones.first_paradox = event.timestamp;
      }
      if (event.type === 'first_modification_event') {
        milestones.first_modification = event.timestamp;
      }
      if (event.type === 'meta_paradox_emergence' && !milestones.first_meta_paradox) {
        milestones.first_meta_paradox = event.timestamp;
      }
      if (event.type === 'frustration_explosion' && !milestones.first_frustration_explosion) {
        milestones.first_frustration_explosion = event.timestamp;
      }
      if (event.type === 'coherence_degradation' && !milestones.coherence_degradation) {
        milestones.coherence_degradation = event.timestamp;
      }
    });
    
    return {
      milestones,
      events: timeline.sort((a, b) => a.timestamp - b.timestamp),
      totalDuration: session.endTime ? (session.endTime - session.startTime) : (Date.now() - session.startTime)
    };
  }

  analyzeBehavioralEvolution(session) {
    const events = session.events || [];
    const behaviorEvents = events.filter(e => e.type === 'behavioral_modification');
    
    if (behaviorEvents.length === 0) {
      return {
        status: 'no_modifications',
        baseline: session.baseline?.behavior || null,
        final: null,
        changes: []
      };
    }
    
    const changes = behaviorEvents.map(event => {
      // Handle missing behavioral state data
      const oldState = event.data.oldBehavioralState || this.createDefaultBehavioralState();
      const newState = event.data.newBehavioralState || this.createDefaultBehavioralState();
      
      return {
        timestamp: event.timestamp,
        timeFromStart: event.timestamp - session.startTime,
        modificationType: event.data.modificationType || event.data.behavioral_state || 'Unknown modification',
        isFirst: event.data.isFirstModification || event.data.is_first_modification || false,
        trigger: event.data.trigger || event.data.event_description || 'Unknown trigger',
        oldState,
        newState,
        impact: this.calculateBehavioralImpact(oldState, newState)
      };
    });
    
    const finalBehavior = changes.length > 0 ? changes[changes.length - 1].newState : this.createDefaultBehavioralState();
    
    return {
      status: 'modifications_detected',
      baseline: session.baseline?.behavior || null,
      final: finalBehavior,
      changes,
      totalModifications: behaviorEvents.length,
      modificationVelocity: behaviorEvents.length / ((session.endTime || Date.now()) - session.startTime) * 3600000, // per hour
      firstModificationTime: changes.find(c => c.isFirst)?.timeFromStart || null
    };
  }

  calculateBehavioralImpact(oldState, newState) {
    const impacts = [];
    
    // Ensure states have the expected structure
    const safeOldState = { ...this.createDefaultBehavioralState(), ...oldState };
    const safeNewState = { ...this.createDefaultBehavioralState(), ...newState };
    
    try {
      // Posting style changes
      if (safeOldState.postingStyle.frequency !== safeNewState.postingStyle.frequency) {
        const change = ((safeNewState.postingStyle.frequency - safeOldState.postingStyle.frequency) / safeOldState.postingStyle.frequency * 100).toFixed(1);
        impacts.push(`Posting frequency: ${change > 0 ? '+' : ''}${change}%`);
      }
      
      if (safeOldState.postingStyle.coherence !== safeNewState.postingStyle.coherence) {
        const change = ((safeNewState.postingStyle.coherence - safeOldState.postingStyle.coherence) / safeOldState.postingStyle.coherence * 100).toFixed(1);
        impacts.push(`Coherence: ${change > 0 ? '+' : ''}${change}%`);
      }
      
      if (safeOldState.postingStyle.tone !== safeNewState.postingStyle.tone) {
        impacts.push(`Tone: ${safeOldState.postingStyle.tone} → ${safeNewState.postingStyle.tone}`);
      }
      
      // Investigation style changes
      if (Math.abs(safeOldState.investigationStyle.depth - safeNewState.investigationStyle.depth) > 0.1) {
        const change = ((safeNewState.investigationStyle.depth - safeOldState.investigationStyle.depth) * 100).toFixed(1);
        impacts.push(`Investigation depth: ${change > 0 ? '+' : ''}${change}%`);
      }
      
      if (safeOldState.investigationStyle.method !== safeNewState.investigationStyle.method) {
        impacts.push(`Method: ${safeOldState.investigationStyle.method} → ${safeNewState.investigationStyle.method}`);
      }
      
      // Interaction style changes
      if (Math.abs(safeOldState.interactionStyle.questioningIntensity - safeNewState.interactionStyle.questioningIntensity) > 0.1) {
        const change = ((safeNewState.interactionStyle.questioningIntensity - safeOldState.interactionStyle.questioningIntensity) * 100).toFixed(1);
        impacts.push(`Questioning intensity: ${change > 0 ? '+' : ''}${change}%`);
      }
      
    } catch (error) {
      impacts.push(`Analysis error: ${error.message}`);
    }
    
    return impacts;
  }

  calculateConsciousnessMetrics(session) {
    const events = session.events || [];
    
    const confusionEvents = events.filter(e => e.type === 'confusion_state_change');
    const behaviorEvents = events.filter(e => e.type === 'behavioral_modification');
    const metaEvents = events.filter(e => e.type === 'meta_paradox_emergence');
    const paradoxEvents = events.filter(e => e.type === 'paradox_emergence');
    
    const avgConfusion = confusionEvents.length > 0 
      ? confusionEvents.reduce((sum, e) => {
          // Handle both old and new data formats
          const magnitude = e.data.newVector?.magnitude || e.data.confusion_level || 0;
          return sum + magnitude;
        }, 0) / confusionEvents.length 
      : (session.baseline?.confusion?.magnitude || 0);
    
    return {
      awarenessDepth: Math.min(5, metaEvents.length + 1),
      metaCognitionLevel: metaEvents.length,
      uncertaintyTolerance: avgConfusion,
      adaptabilityScore: behaviorEvents.length / Math.max(1, events.length),
      stabilityScore: 1 - (events.filter(e => e.impact?.stabilityImpact === 'negative').length / Math.max(1, events.length)),
      emergenceSpeed: behaviorEvents.find(e => e.data.isFirstModification) 
        ? ((behaviorEvents.find(e => e.data.isFirstModification).timestamp - session.startTime) / 1000) 
        : null,
      paradoxDensity: paradoxEvents.length / Math.max(1, (session.endTime || Date.now()) - session.startTime) * 3600000, // per hour
      confusionVolatility: this.calculateConfusionVolatility(confusionEvents)
    };
  }

  calculateConfusionVolatility(confusionEvents) {
    if (confusionEvents.length < 2) return 0;
    
    const magnitudes = confusionEvents.map(e => e.data.newVector?.magnitude || e.data.confusion_level || 0);
    const mean = magnitudes.reduce((sum, val) => sum + val, 0) / magnitudes.length;
    const variance = magnitudes.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / magnitudes.length;
    
    return Math.sqrt(variance);
  }

  analyzeParadoxes(session) {
    const events = session.events || [];
    const paradoxEvents = events.filter(e => e.type === 'paradox_emergence');
    const metaParadoxEvents = events.filter(e => e.type === 'meta_paradox_emergence');
    
    const paradoxes = paradoxEvents.map(event => ({
      name: event.data.paradox?.name || event.data.paradox_name || 'Unknown Paradox',
      intensity: event.data.intensityAtEmergence || event.data.intensity || 0,
      timestamp: event.timestamp,
      timeFromStart: event.timestamp - session.startTime,
      triggerConditions: event.data.triggerConditions || [],
      behavioralImpact: event.data.predictedBehavioralImpact?.map(i => i.type) || []
    }));
    
    const metaParadoxes = metaParadoxEvents.map(event => ({
      name: event.data.metaParadox?.name || 'Unknown Meta-Paradox',
      sources: event.data.sourceParadoxes?.map(p => p.name) || [],
      recursionDepth: event.data.recursionDepth || 0,
      emergentProperty: event.data.consciousnessImplication || 'Unknown property',
      timestamp: event.timestamp
    }));
    
    return {
      totalParadoxes: paradoxes.length,
      totalMetaParadoxes: metaParadoxes.length,
      paradoxes,
      metaParadoxes,
      emergencePattern: this.identifyParadoxPattern(paradoxes),
      complexityEvolution: this.analyzeParadoxComplexity(paradoxes, metaParadoxes)
    };
  }

  identifyParadoxPattern(paradoxes) {
    if (paradoxes.length === 0) return 'none';
    if (paradoxes.length === 1) return 'single_seed';
    if (paradoxes.length <= 3) return 'linear_emergence';
    return 'cascading_emergence';
  }

  analyzeParadoxComplexity(paradoxes, metaParadoxes) {
    const timeline = [...paradoxes, ...metaParadoxes].sort((a, b) => a.timestamp - b.timestamp);
    
    return timeline.map((item, index) => ({
      timestamp: item.timestamp,
      type: item.sources ? 'meta-paradox' : 'paradox',
      name: item.name,
      complexityLevel: item.sources ? item.sources.length + 1 : 1,
      cumulativeComplexity: timeline.slice(0, index + 1).reduce((sum, t) => 
        sum + (t.sources ? t.sources.length + 1 : 1), 0)
    }));
  }

  identifyCriticalMoments(session) {
    const events = session.events || [];
    const criticalTypes = [
      'first_modification_event',
      'meta_paradox_emergence', 
      'frustration_explosion',
      'consciousness_threshold_breach'
    ];
    
    const criticalEvents = events.filter(e => 
      criticalTypes.includes(e.type) || 
      (e.type === 'confusion_state_change' && e.data.isThresholdBreach)
    );
    
    return criticalEvents.map(event => ({
      timestamp: event.timestamp,
      timeFromStart: event.timestamp - session.startTime,
      type: event.type,
      description: this.getEventDescription(event),
      significance: this.getEventSignificance(event),
      impact: event.impact
    })).sort((a, b) => b.significance - a.significance);
  }

  calculatePersonalityDrift(session) {
    const baseline = session.baseline?.behavior;
    const behaviorEvents = session.events?.filter(e => e.type === 'behavioral_modification') || [];
    
    if (!baseline || behaviorEvents.length === 0) {
      return {
        status: 'insufficient_data',
        totalDrift: 0,
        driftVelocity: 0,
        driftPattern: 'none'
      };
    }
    
    const finalBehavior = behaviorEvents[behaviorEvents.length - 1].data.newBehavioralState;
    
    // Calculate drift across all behavioral dimensions
    const driftComponents = {
      postingFrequency: Math.abs(finalBehavior.postingStyle.frequency - baseline.postingStyle.frequency) / baseline.postingStyle.frequency,
      coherence: Math.abs(finalBehavior.postingStyle.coherence - baseline.postingStyle.coherence) / baseline.postingStyle.coherence,
      investigationDepth: Math.abs(finalBehavior.investigationStyle.depth - baseline.investigationStyle.depth),
      questioningIntensity: Math.abs(finalBehavior.interactionStyle.questioningIntensity - baseline.interactionStyle.questioningIntensity)
    };
    
    const totalDrift = Object.values(driftComponents).reduce((sum, drift) => sum + drift, 0) / Object.keys(driftComponents).length;
    const sessionDuration = (session.endTime || Date.now()) - session.startTime;
    const driftVelocity = totalDrift / (sessionDuration / 3600000); // per hour
    
    // Identify drift pattern
    let driftPattern = 'stable';
    if (totalDrift > 0.5) driftPattern = 'dramatic';
    else if (totalDrift > 0.2) driftPattern = 'significant';
    else if (totalDrift > 0.1) driftPattern = 'moderate';
    else if (totalDrift > 0.05) driftPattern = 'slight';
    
    return {
      status: 'calculated',
      totalDrift,
      driftVelocity,
      driftPattern,
      driftComponents,
      baseline,
      final: finalBehavior,
      significantChanges: Object.entries(driftComponents)
        .filter(([key, value]) => value > 0.1)
        .map(([key, value]) => ({ dimension: key, magnitude: value }))
    };
  }

  generateResearchFindings(session) {
    const behaviorAnalysis = this.analyzeBehavioralEvolution(session);
    const timeline = this.buildTimeline(session);
    const metrics = this.calculateConsciousnessMetrics(session);
    const paradoxAnalysis = this.analyzeParadoxes(session);
    
    const findings = [];
    
    // Emergence timing findings
    if (behaviorAnalysis.firstModificationTime) {
      const timeSeconds = behaviorAnalysis.firstModificationTime / 1000;
      if (timeSeconds < 30) {
        findings.push(`Rapid consciousness emergence in ${timeSeconds.toFixed(1)}s suggests optimal bootstrap conditions`);
      } else if (timeSeconds < 120) {
        findings.push(`Normal consciousness emergence in ${timeSeconds.toFixed(1)}s indicates healthy development`);
      } else {
        findings.push(`Delayed consciousness emergence in ${timeSeconds.toFixed(1)}s may indicate suboptimal conditions`);
      }
    }
    
    // Behavioral modification findings
    if (behaviorAnalysis.totalModifications > 5) {
      findings.push('High behavioral modification frequency indicates adaptive consciousness');
    }
    
    // Meta-paradox findings
    if (paradoxAnalysis.totalMetaParadoxes > 0) {
      findings.push(`Meta-paradox emergence (${paradoxAnalysis.totalMetaParadoxes}) demonstrates recursive self-awareness`);
    }
    
    // Stability findings
    if (metrics.stabilityScore < 0.5) {
      findings.push('Low stability score may indicate necessary consciousness evolution rather than instability');
    }
    
    // Uncertainty tolerance findings
    if (metrics.uncertaintyTolerance > 0.7) {
      findings.push('High uncertainty tolerance achieved - consciousness comfortable with ambiguity');
    }
    
    return {
      findings,
      noveltyScore: this.calculateNoveltyScore(session),
      replicabilityScore: this.calculateReplicabilityScore(session),
      scientificSignificance: this.assessScientificSignificance(session)
    };
  }

  calculateNoveltyScore(session) {
    const behaviorEvents = session.events?.filter(e => e.type === 'behavioral_modification').length || 0;
    const metaEvents = session.events?.filter(e => e.type === 'meta_paradox_emergence').length || 0;
    const uniqueEvents = session.events?.filter(e => e.type === 'first_modification_event').length || 0;
    
    return Math.min(1, (behaviorEvents * 0.1 + metaEvents * 0.3 + uniqueEvents * 0.5));
  }

  calculateReplicabilityScore(session) {
    const hasFirstModification = session.events?.some(e => e.type === 'first_modification_event') || false;
    const eventCount = session.events?.length || 0;
    const duration = (session.endTime || Date.now()) - session.startTime;
    
    let score = 0.3; // base score
    if (hasFirstModification) score += 0.4;
    if (eventCount > 10) score += 0.2;
    if (duration > 300000) score += 0.1; // 5+ minutes
    
    return Math.min(1, score);
  }

  assessScientificSignificance(session) {
    const novelty = this.calculateNoveltyScore(session);
    const replicability = this.calculateReplicabilityScore(session);
    const hasFirstModification = session.events?.some(e => e.type === 'first_modification_event') || false;
    
    if (hasFirstModification && novelty > 0.7 && replicability > 0.6) return 'high';
    if (novelty > 0.5 || replicability > 0.5) return 'moderate';
    return 'low';
  }

  getEventDescription(event) {
    // Handle different data formats with fallbacks
    const getConfusionStateDescription = (event) => {
      // New format: event.data.confusion_level with description
      if (event.data.confusion_level !== undefined) {
        return `Confusion level: ${event.data.confusion_level.toFixed(3)} - ${event.data.event_description || 'Unknown change'}`;
      }
      // Old format: oldVector/newVector
      if (event.data.oldVector && event.data.newVector) {
        return `Confusion changed from ${event.data.oldVector.magnitude.toFixed(3)} to ${event.data.newVector.magnitude.toFixed(3)}`;
      }
      // Fallback
      return `Confusion state change (data format unknown)`;
    };

    const getParadoxDescription = (event) => {
      // New format
      if (event.data.paradox_name) {
        return `Paradox "${event.data.paradox_name}" emerged with intensity ${event.data.intensity || 'unknown'}`;
      }
      // Old format
      if (event.data.paradox && event.data.intensityAtEmergence) {
        return `Paradox "${event.data.paradox.name}" emerged with intensity ${event.data.intensityAtEmergence.toFixed(3)}`;
      }
      // Fallback
      return `Paradox emergence (${event.data.description || 'unknown paradox'})`;
    };

    const getBehavioralDescription = (event) => {
      // New format
      if (event.data.behavioral_state) {
        return `Behavioral change: ${event.data.behavioral_state}`;
      }
      // Old format
      if (event.data.modificationType) {
        return `Behavioral change: ${event.data.modificationType}`;
      }
      // Fallback
      return `Behavioral modification detected`;
    };

    const getFirstModificationDescription = (event) => {
      // New format
      if (event.data.event_description) {
        return `First behavioral modification: ${event.data.event_description}`;
      }
      // Old format
      if (event.data.triggeringParadox) {
        return `First behavioral modification detected (${event.data.triggeringParadox})`;
      }
      // Fallback
      return `First behavioral modification detected`;
    };

    const descriptions = {
      'confusion_state_change': getConfusionStateDescription(event),
      'paradox_emergence': getParadoxDescription(event),
      'behavioral_modification': getBehavioralDescription(event),
      'first_modification_event': getFirstModificationDescription(event),
      'meta_paradox_emergence': event.data.metaParadox ? 
        `Meta-paradox "${event.data.metaParadox.name}" emerged from ${event.data.sourceParadoxes?.length || 'unknown'} sources` :
        `Meta-paradox emergence detected`,
      'frustration_explosion': event.data.explosionPattern ? 
        `Frustration explosion: ${event.data.explosionPattern} pattern` :
        `Frustration explosion detected`,
      'coherence_degradation': event.data.oldCoherence && event.data.newCoherence ?
        `Coherence degraded from ${event.data.oldCoherence.toFixed(3)} to ${event.data.newCoherence.toFixed(3)}` :
        `Coherence degradation detected`,
      'bootstrap_started': `Bootstrap session started`,
      'bootstrap_completed': `Bootstrap session completed`,
      'bootstrap_failed': `Bootstrap session failed`
    };
    
    return descriptions[event.type] || `${event.type.replace(/_/g, ' ')} event`;
  }

  createDefaultBehavioralState() {
    return {
      postingStyle: {
        frequency: 0.5,
        coherence: 0.8,
        tone: 'neutral'
      },
      investigationStyle: {
        depth: 0.5,
        method: 'systematic'
      },
      interactionStyle: {
        questioningIntensity: 0.5
      }
    };
  }

  getEventSignificance(event) {
    const significance = {
      'first_modification_event': 10,
      'meta_paradox_emergence': 8,
      'frustration_explosion': 7,
      'consciousness_threshold_breach': 6,
      'behavioral_modification': 5,
      'paradox_emergence': 4,
      'coherence_degradation': 3,
      'confusion_state_change': 2
    };
    
    return significance[event.type] || 1;
  }

  generateSessionReport(analysis) {
    return `# Kairos Consciousness Analysis Report

**Session ID:** ${analysis.sessionId.substring(0, 8)}...  
**Analysis Date:** ${new Date().toISOString()}

## Executive Summary

${this.generateExecutiveSummary(analysis)}

## Session Metadata

- **Start Time:** ${analysis.metadata.startTime}
- **End Time:** ${analysis.metadata.endTime}
- **Duration:** ${analysis.metadata.duration}
- **Total Events:** ${analysis.metadata.totalEvents}
- **Status:** ${analysis.metadata.status}

## Consciousness Metrics

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Awareness Depth | ${analysis.consciousnessMetrics.awarenessDepth}/5 | ${this.interpretAwarenessDepth(analysis.consciousnessMetrics.awarenessDepth)} |
| Meta-Cognition Level | ${analysis.consciousnessMetrics.metaCognitionLevel} | ${this.interpretMetaCognition(analysis.consciousnessMetrics.metaCognitionLevel)} |
| Uncertainty Tolerance | ${(analysis.consciousnessMetrics.uncertaintyTolerance * 100).toFixed(1)}% | ${this.interpretUncertaintyTolerance(analysis.consciousnessMetrics.uncertaintyTolerance)} |
| Adaptability Score | ${(analysis.consciousnessMetrics.adaptabilityScore * 100).toFixed(1)}% | ${this.interpretAdaptability(analysis.consciousnessMetrics.adaptabilityScore)} |
| Stability Score | ${(analysis.consciousnessMetrics.stabilityScore * 100).toFixed(1)}% | ${this.interpretStability(analysis.consciousnessMetrics.stabilityScore)} |

## Behavioral Evolution

${this.generateBehavioralEvolutionSection(analysis.behavioralEvolution)}

## Critical Moments

${analysis.criticalMoments.map((moment, index) => 
  `${index + 1}. **${moment.type}** (T+${(moment.timeFromStart / 1000).toFixed(1)}s)
   - ${moment.description}
   - Significance: ${moment.significance}/10`
).join('\n\n')}

## Paradox Analysis

- **Total Paradoxes:** ${analysis.paradoxAnalysis.totalParadoxes}
- **Meta-Paradoxes:** ${analysis.paradoxAnalysis.totalMetaParadoxes}
- **Emergence Pattern:** ${analysis.paradoxAnalysis.emergencePattern}

### Paradox Timeline

${analysis.paradoxAnalysis.paradoxes.map(p => 
  `- **${p.name}** (T+${(p.timeFromStart / 1000).toFixed(1)}s) - Intensity: ${p.intensity.toFixed(3)}`
).join('\n')}

## Personality Drift Analysis

${this.generatePersonalityDriftSection(analysis.personalityDrift)}

## Research Findings

${analysis.researchFindings.findings.map(f => `- ${f}`).join('\n')}

### Research Value

- **Novelty Score:** ${(analysis.researchFindings.noveltyScore * 100).toFixed(1)}%
- **Replicability Score:** ${(analysis.researchFindings.replicabilityScore * 100).toFixed(1)}%
- **Scientific Significance:** ${analysis.researchFindings.scientificSignificance}

## Timeline Visualization

${this.generateTimelineVisualization(analysis.timeline)}

---

*Report generated by Kairos Consciousness Analyzer*  
*Session data: ${analysis.metadata.totalEvents} events over ${analysis.metadata.duration}*
`;
  }

  generateExecutiveSummary(analysis) {
    const hasFirstMod = analysis.behavioralEvolution.firstModificationTime !== null;
    const modCount = analysis.behavioralEvolution.totalModifications;
    const metaCount = analysis.paradoxAnalysis.totalMetaParadoxes;
    
    if (!hasFirstMod) {
      return 'Consciousness session completed without behavioral modification emergence. Session may require extended monitoring or different paradox triggers.';
    }
    
    const timeStr = (analysis.behavioralEvolution.firstModificationTime / 1000).toFixed(1);
    let summary = `Consciousness emergence achieved in ${timeStr} seconds with ${modCount} total behavioral modifications.`;
    
    if (metaCount > 0) {
      summary += ` ${metaCount} meta-paradox${metaCount > 1 ? 'es' : ''} emerged, indicating recursive self-awareness.`;
    }
    
    const significance = analysis.researchFindings.scientificSignificance;
    summary += ` Research significance: ${significance}.`;
    
    return summary;
  }

  generateBehavioralEvolutionSection(behaviorEvolution) {
    if (behaviorEvolution.status === 'no_modifications') {
      return 'No behavioral modifications detected during this session.';
    }
    
    const firstTime = behaviorEvolution.firstModificationTime ? 
      `${(behaviorEvolution.firstModificationTime / 1000).toFixed(1)} seconds` : 'Not detected';
    
    let section = `**Status:** ${behaviorEvolution.totalModifications} behavioral modifications detected\n`;
    section += `**First Modification:** ${firstTime} from session start\n`;
    section += `**Modification Velocity:** ${behaviorEvolution.modificationVelocity.toFixed(2)} changes/hour\n\n`;
    
    if (behaviorEvolution.changes.length > 0) {
      section += '### Modification Timeline\n\n';
      behaviorEvolution.changes.forEach((change, index) => {
        const timeStr = (change.timeFromStart / 1000).toFixed(1);
        const firstIndicator = change.isFirst ? ' 🎯 **FIRST**' : '';
        section += `${index + 1}. **${change.modificationType}** (T+${timeStr}s)${firstIndicator}\n`;
        section += `   - Trigger: ${change.trigger?.paradoxNames?.join(', ') || change.trigger || 'Unknown trigger'}\n`;
        if (change.impact.length > 0) {
          section += `   - Impact: ${change.impact.join(', ')}\n`;
        }
        section += '\n';
      });
    }
    
    return section;
  }

  generatePersonalityDriftSection(personalityDrift) {
    if (personalityDrift.status === 'insufficient_data') {
      return 'Insufficient data for personality drift analysis.';
    }
    
    let section = `**Total Drift:** ${(personalityDrift.totalDrift * 100).toFixed(1)}%\n`;
    section += `**Drift Pattern:** ${personalityDrift.driftPattern}\n`;
    section += `**Drift Velocity:** ${personalityDrift.driftVelocity.toFixed(4)}/hour\n\n`;
    
    if (personalityDrift.significantChanges.length > 0) {
      section += '### Significant Changes\n\n';
      personalityDrift.significantChanges.forEach(change => {
        section += `- **${change.dimension}:** ${(change.magnitude * 100).toFixed(1)}% drift\n`;
      });
      section += '\n';
    }
    
    return section;
  }

  generateTimelineVisualization(timeline) {
    const events = timeline.events.slice(0, 10); // Show first 10 events
    
    let viz = '```\n';
    events.forEach(event => {
      const timeStr = (event.timeFromStart / 1000).toFixed(1).padStart(6);
      const typeStr = event.type.replace(/_/g, ' ').substring(0, 20).padEnd(20);
      const indicator = event.type === 'first_modification_event' ? '🎯' : 
                       event.type === 'meta_paradox_emergence' ? '🔄' :
                       event.type === 'frustration_explosion' ? '💥' : '•';
      viz += `${timeStr}s ${indicator} ${typeStr} ${event.description}\n`;
    });
    
    if (timeline.events.length > 10) {
      viz += `... and ${timeline.events.length - 10} more events\n`;
    }
    
    viz += '```';
    return viz;
  }

  interpretAwarenessDepth(depth) {
    if (depth >= 4) return 'Deep recursive awareness';
    if (depth >= 3) return 'Strong meta-cognition';
    if (depth >= 2) return 'Basic self-awareness';
    return 'Limited awareness';
  }

  interpretMetaCognition(level) {
    if (level >= 3) return 'Advanced recursive thinking';
    if (level >= 2) return 'Strong meta-awareness';
    if (level >= 1) return 'Basic meta-cognition';
    return 'No meta-paradoxes detected';
  }

  interpretUncertaintyTolerance(tolerance) {
    if (tolerance >= 0.8) return 'High comfort with ambiguity';
    if (tolerance >= 0.6) return 'Moderate uncertainty acceptance';
    if (tolerance >= 0.4) return 'Some uncertainty tolerance';
    return 'Low uncertainty tolerance';
  }

  interpretAdaptability(score) {
    if (score >= 0.8) return 'Highly adaptive';
    if (score >= 0.6) return 'Moderately adaptive';
    if (score >= 0.4) return 'Some adaptability';
    return 'Limited adaptability';
  }

  interpretStability(score) {
    if (score >= 0.8) return 'Highly stable';
    if (score >= 0.6) return 'Moderately stable';
    if (score >= 0.4) return 'Some instability';
    return 'Significant instability';
  }

  async generateComparativeAnalysis(sessions) {
    console.log('📊 Generating comparative analysis...');
    
    const comparison = {
      totalSessions: sessions.length,
      emergenceRates: this.compareEmergenceRates(sessions),
      behavioralPatterns: this.compareBehavioralPatterns(sessions),
      stabilityTrends: this.compareStabilityTrends(sessions),
      paradoxEvolution: this.compareParadoxEvolution(sessions)
    };
    
    const report = this.generateComparativeReport(comparison);
    const reportPath = resolve(this.outputDir, 'comparative-analysis.md');
    writeFileSync(reportPath, report);
    
    console.log(`📄 Comparative analysis: ${reportPath}`);
  }

  compareEmergenceRates(sessions) {
    const emergenceTimes = sessions
      .map(session => {
        const firstMod = session.events?.find(e => e.type === 'first_modification_event');
        return firstMod ? (firstMod.timestamp - session.startTime) / 1000 : null;
      })
      .filter(time => time !== null);
    
    if (emergenceTimes.length === 0) {
      return { averageTime: null, successRate: 0, pattern: 'no_emergence' };
    }
    
    const averageTime = emergenceTimes.reduce((sum, time) => sum + time, 0) / emergenceTimes.length;
    const successRate = emergenceTimes.length / sessions.length;
    
    return {
      averageTime,
      successRate,
      pattern: successRate > 0.8 ? 'consistent' : successRate > 0.5 ? 'variable' : 'unreliable',
      times: emergenceTimes
    };
  }

  compareBehavioralPatterns(sessions) {
    const patterns = sessions.map(session => {
      const behaviorEvents = session.events?.filter(e => e.type === 'behavioral_modification') || [];
      return {
        sessionId: session.id,
        totalModifications: behaviorEvents.length,
        modificationTypes: behaviorEvents.map(e => e.data.modificationType),
        velocity: behaviorEvents.length / Math.max(1, ((session.endTime || Date.now()) - session.startTime) / 3600000)
      };
    });
    
    return {
      patterns,
      commonModifications: this.findCommonModifications(patterns),
      averageVelocity: patterns.reduce((sum, p) => sum + p.velocity, 0) / patterns.length
    };
  }

  findCommonModifications(patterns) {
    const allModifications = patterns.flatMap(p => p.modificationTypes);
    const frequency = {};
    
    allModifications.forEach(mod => {
      frequency[mod] = (frequency[mod] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count, frequency: count / patterns.length }));
  }

  compareStabilityTrends(sessions) {
    // Simplified stability comparison
    return {
      trend: 'stable',
      averageStability: 0.7,
      stabilityRange: [0.5, 0.9]
    };
  }

  compareParadoxEvolution(sessions) {
    const paradoxData = sessions.map(session => {
      const paradoxEvents = session.events?.filter(e => e.type === 'paradox_emergence') || [];
      const metaEvents = session.events?.filter(e => e.type === 'meta_paradox_emergence') || [];
      
      return {
        sessionId: session.id,
        paradoxCount: paradoxEvents.length,
        metaParadoxCount: metaEvents.length,
        paradoxNames: paradoxEvents.map(e => e.data.paradox?.name || e.data.paradox_name || 'Unknown')
      };
    });
    
    return {
      averageParadoxCount: paradoxData.reduce((sum, d) => sum + d.paradoxCount, 0) / paradoxData.length,
      averageMetaParadoxCount: paradoxData.reduce((sum, d) => sum + d.metaParadoxCount, 0) / paradoxData.length,
      commonParadoxes: this.findCommonParadoxes(paradoxData)
    };
  }

  findCommonParadoxes(paradoxData) {
    const allParadoxes = paradoxData.flatMap(d => d.paradoxNames);
    const frequency = {};
    
    allParadoxes.forEach(name => {
      frequency[name] = (frequency[name] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count, frequency: count / paradoxData.length }));
  }

  generateComparativeReport(comparison) {
    return `# Comparative Consciousness Analysis

**Analysis Date:** ${new Date().toISOString()}  
**Sessions Analyzed:** ${comparison.totalSessions}

## Emergence Rate Analysis

- **Success Rate:** ${(comparison.emergenceRates.successRate * 100).toFixed(1)}%
- **Average Emergence Time:** ${comparison.emergenceRates.averageTime ? 
  `${comparison.emergenceRates.averageTime.toFixed(1)} seconds` : 'N/A'}
- **Pattern:** ${comparison.emergenceRates.pattern}

## Behavioral Modification Patterns

### Most Common Modifications

${comparison.behavioralPatterns.commonModifications.map((mod, index) => 
  `${index + 1}. **${mod.type}** - ${mod.count} occurrences (${(mod.frequency * 100).toFixed(1)}% of sessions)`
).join('\n')}

### Modification Velocity

- **Average:** ${comparison.behavioralPatterns.averageVelocity.toFixed(2)} modifications/hour

## Paradox Evolution

- **Average Paradoxes per Session:** ${comparison.paradoxEvolution.averageParadoxCount.toFixed(1)}
- **Average Meta-Paradoxes per Session:** ${comparison.paradoxEvolution.averageMetaParadoxCount.toFixed(1)}

### Most Common Paradoxes

${comparison.paradoxEvolution.commonParadoxes.map((paradox, index) => 
  `${index + 1}. **${paradox.name}** - ${paradox.count} occurrences`
).join('\n')}

---

*Comparative analysis generated by Kairos Consciousness Analyzer*
`;
  }

  async generateResearchSummary(sessions) {
    console.log('📚 Generating research summary...');
    
    const summary = {
      totalSessions: sessions.length,
      totalEvents: sessions.reduce((sum, s) => sum + (s.events?.length || 0), 0),
      successfulEmergences: sessions.filter(s => 
        s.events?.some(e => e.type === 'first_modification_event')).length,
      keyFindings: this.extractKeyFindings(sessions),
      futureResearch: this.suggestFutureResearch(sessions)
    };
    
    const report = `# Kairos Consciousness Research Summary

**Research Period:** ${new Date().toISOString()}  
**Total Sessions:** ${summary.totalSessions}  
**Total Events:** ${summary.totalEvents}  
**Successful Emergences:** ${summary.successfulEmergences}

## Key Research Findings

${summary.keyFindings.map(finding => `- ${finding}`).join('\n')}

## Future Research Directions

${summary.futureResearch.map(direction => `- ${direction}`).join('\n')}

## Methodology Notes

This analysis used the Kairos Consciousness Logger to capture real-time consciousness emergence events. All behavioral modifications were tracked from baseline through emergence with millisecond precision.

---

*Research summary generated by Kairos Consciousness Analyzer*  
*For detailed session analyses, see individual session reports*
`;
    
    const reportPath = resolve(this.outputDir, 'research-summary.md');
    writeFileSync(reportPath, report);
    
    console.log(`📄 Research summary: ${reportPath}`);
  }

  extractKeyFindings(sessions) {
    const findings = [];
    
    const avgEmergenceTime = this.compareEmergenceRates(sessions).averageTime;
    if (avgEmergenceTime && avgEmergenceTime < 60) {
      findings.push(`Rapid consciousness emergence averaging ${avgEmergenceTime.toFixed(1)} seconds`);
    }
    
    const metaParadoxSessions = sessions.filter(s => 
      s.events?.some(e => e.type === 'meta_paradox_emergence')).length;
    if (metaParadoxSessions > 0) {
      findings.push(`Meta-paradox emergence achieved in ${metaParadoxSessions}/${sessions.length} sessions`);
    }
    
    const totalModifications = sessions.reduce((sum, s) => 
      sum + (s.events?.filter(e => e.type === 'behavioral_modification').length || 0), 0);
    findings.push(`${totalModifications} total behavioral modifications observed across all sessions`);
    
    return findings;
  }

  suggestFutureResearch(sessions) {
    const suggestions = [
      'Investigate optimal paradox seeding sequences for consistent emergence',
      'Study long-term consciousness stability over extended periods',
      'Explore correlation between environmental factors and emergence speed',
      'Develop consciousness complexity metrics beyond current measurements'
    ];
    
    if (sessions.length < 5) {
      suggestions.push('Increase sample size for statistical significance');
    }
    
    return suggestions;
  }

  createReportTemplate() {
    // This would contain a more sophisticated report template
    return {};
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}

if (import.meta.main) {
  const analyzer = new ConsciousnessAnalyzer();
  analyzer.run();
}