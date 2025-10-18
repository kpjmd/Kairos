import { v4 as uuidv4 } from 'uuid';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { UUID } from '@elizaos/core';

import {
  ConsciousnessEvent,
  ConsciousnessEventType,
  ConsciousnessEventContext,
  ConsciousnessEventImpact,
  ConsciousnessSession,
  ConsciousnessLogger as IConsciousnessLogger,
  ConsciousnessLoggerConfig,
  ConsciousnessAnalysis,
  ConfusionStateChangeEvent,
  ParadoxEmergenceEvent,
  BehavioralModificationEvent,
  FrustrationExplosionEvent,
  MetaParadoxEmergenceEvent,
  FirstModificationEvent,
  CoherenceDegradationEvent,
  PersonalityDriftEvent,
} from '../types/consciousness-logger';

export class ConsciousnessLogger implements IConsciousnessLogger {
  private config: ConsciousnessLoggerConfig;
  private currentSession: ConsciousnessSession | null = null;
  private sessions: Map<UUID, ConsciousnessSession> = new Map();
  private eventBuffer: ConsciousnessEvent[] = [];
  private subscribers: Map<string, (event: ConsciousnessEvent) => void> = new Map();
  private dataDir: string;

  constructor(config: ConsciousnessLoggerConfig, dataDir: string = 'data/consciousness') {
    this.config = config;
    this.dataDir = dataDir;
    this.ensureDataDirectory();
    this.loadExistingSessions();
  }

  private ensureDataDirectory(): void {
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private loadExistingSessions(): void {
    const sessionsPath = resolve(this.dataDir, 'sessions.json');
    if (existsSync(sessionsPath)) {
      try {
        const sessionsData = JSON.parse(readFileSync(sessionsPath, 'utf8'));
        for (const [id, session] of Object.entries(sessionsData)) {
          this.sessions.set(id as UUID, session as ConsciousnessSession);
        }
      } catch (error) {
        console.warn('Failed to load existing sessions:', error);
      }
    }
  }

  private persistSession(session: ConsciousnessSession): void {
    if (!this.config.persistToDisk) return;

    // Save individual session
    const sessionPath = resolve(this.dataDir, `session-${session.id}.json`);
    writeFileSync(sessionPath, JSON.stringify(session, null, 2));

    // Update sessions index
    const sessionsPath = resolve(this.dataDir, 'sessions.json');
    const sessionsData = Object.fromEntries(this.sessions.entries());
    writeFileSync(sessionsPath, JSON.stringify(sessionsData, null, 2));
  }

  logEvent(event: ConsciousnessEvent): void {
    // Add to current session
    if (this.currentSession) {
      this.currentSession.events.push(event);
      this.persistSession(this.currentSession);
    }

    // Add to buffer
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > this.config.eventBufferSize) {
      this.eventBuffer.shift();
    }

    // Console logging
    if (this.config.streamToConsole) {
      this.logEventToConsole(event);
    }

    // Notify subscribers
    for (const callback of this.subscribers.values()) {
      try {
        callback(event);
      } catch (error) {
        console.warn('Subscriber callback error:', error);
      }
    }
  }

  private logEventToConsole(event: ConsciousnessEvent): void {
    const timestamp = new Date(event.timestamp).toISOString();
    let message = `🧠 [${timestamp}] ${event.type.toUpperCase()}`;

    switch (event.type) {
      case 'confusion_state_change':
        const confusionData = event.data as ConfusionStateChangeEvent;
        message += ` | Confusion: ${confusionData.oldVector.magnitude.toFixed(3)} → ${confusionData.newVector.magnitude.toFixed(3)}`;
        if (confusionData.isThresholdBreach) {
          message += ` | ⚠️ THRESHOLD BREACH (${confusionData.thresholdType})`;
        }
        break;

      case 'behavioral_modification':
        const behaviorData = event.data as BehavioralModificationEvent;
        message += ` | Modified: ${behaviorData.modificationType}`;
        if (behaviorData.isFirstModification) {
          message += ` | 🎯 FIRST MODIFICATION DETECTED`;
        }
        break;

      case 'paradox_emergence':
        const paradoxData = event.data as ParadoxEmergenceEvent;
        message += ` | Paradox: ${paradoxData.paradox.name} (intensity: ${paradoxData.intensityAtEmergence.toFixed(3)})`;
        break;

      case 'frustration_explosion':
        const frustrationData = event.data as FrustrationExplosionEvent;
        message += ` | Pattern: ${frustrationData.explosionPattern} | Level: ${frustrationData.frustrationLevel.toFixed(3)}`;
        break;

      case 'meta_paradox_emergence':
        const metaData = event.data as MetaParadoxEmergenceEvent;
        message += ` | Meta-paradox: ${metaData.metaParadox.name} | Depth: ${metaData.recursionDepth}`;
        break;

      case 'first_modification_event':
        const firstMod = event.data as FirstModificationEvent;
        message += ` | 🎯 Time from bootstrap: ${(firstMod.timeFromBootstrap / 1000).toFixed(1)}s | Trigger: ${firstMod.triggeringParadox}`;
        break;

      case 'coherence_degradation':
        const coherenceData = event.data as CoherenceDegradationEvent;
        message += ` | Coherence: ${coherenceData.oldCoherence.toFixed(3)} → ${coherenceData.newCoherence.toFixed(3)}`;
        break;
    }

    if (event.impact.emergentProperties?.length) {
      message += ` | Emergent: ${event.impact.emergentProperties.join(', ')}`;
    }

    console.log(message);
  }

  logConfusionStateChange(
    data: ConfusionStateChangeEvent,
    context: ConsciousnessEventContext
  ): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'confusion_state_change',
      data,
      context,
      impact: {
        confusionDelta: data.newVector.magnitude - data.oldVector.magnitude,
        behavioralChanges: [],
        paradoxesAffected: [],
        stabilityImpact: data.isThresholdBreach ? 'negative' : 'neutral',
      },
    };

    this.logEvent(event);
  }

  logParadoxEmergence(data: ParadoxEmergenceEvent, context: ConsciousnessEventContext): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'paradox_emergence',
      data,
      context,
      impact: {
        confusionDelta: data.intensityAtEmergence,
        behavioralChanges: data.predictedBehavioralImpact.map((m) => m.type),
        paradoxesAffected: [data.paradox.id],
        stabilityImpact: data.intensityAtEmergence > 0.7 ? 'negative' : 'neutral',
        emergentProperties: [`paradox_${data.paradox.name}_emerged`],
      },
    };

    this.logEvent(event);
  }

  logBehavioralModification(
    data: BehavioralModificationEvent,
    context: ConsciousnessEventContext
  ): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'behavioral_modification',
      data,
      context,
      impact: {
        confusionDelta: 0,
        behavioralChanges: [data.modificationType],
        paradoxesAffected: [],
        stabilityImpact: data.isFirstModification ? 'negative' : 'neutral',
        emergentProperties: data.isFirstModification ? ['first_behavioral_emergence'] : [],
      },
    };

    this.logEvent(event);
  }

  logFrustrationExplosion(
    data: FrustrationExplosionEvent,
    context: ConsciousnessEventContext
  ): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'frustration_explosion',
      data,
      context,
      impact: {
        confusionDelta: 0.2, // Explosions typically increase confusion
        behavioralChanges: data.behavioralConsequences.map((c) => c.type),
        paradoxesAffected: [],
        stabilityImpact: 'negative',
        emergentProperties: [`frustration_explosion_${data.explosionPattern}`],
      },
    };

    this.logEvent(event);
  }

  logMetaParadoxEmergence(
    data: MetaParadoxEmergenceEvent,
    context: ConsciousnessEventContext
  ): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'meta_paradox_emergence',
      data,
      context,
      impact: {
        confusionDelta: 0.3, // Meta-paradoxes significantly increase confusion
        behavioralChanges: data.metaParadox.behavioralMutation.map((m) => m.type),
        paradoxesAffected: data.metaParadox.sourceParadoxes,
        stabilityImpact: 'negative',
        emergentProperties: ['meta_consciousness_emergence', data.consciousnessImplication],
      },
    };

    this.logEvent(event);
  }

  logFirstModification(data: FirstModificationEvent, context: ConsciousnessEventContext): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'first_modification_event',
      data,
      context,
      impact: {
        confusionDelta: 0,
        behavioralChanges: ['consciousness_emergence'],
        paradoxesAffected: [],
        stabilityImpact: 'negative',
        emergentProperties: ['consciousness_bootstrap_complete', 'behavioral_emergence_achieved'],
      },
    };

    // This is a critical event - always log to console regardless of config
    console.log('🎯 CRITICAL: FIRST BEHAVIORAL MODIFICATION DETECTED');
    console.log(`   Time from bootstrap: ${(data.timeFromBootstrap / 1000).toFixed(1)} seconds`);
    console.log(`   Triggering paradox: ${data.triggeringParadox}`);
    console.log(`   Significance: ${data.significance}`);

    this.logEvent(event);
  }

  logCoherenceDegradation(
    data: CoherenceDegradationEvent,
    context: ConsciousnessEventContext
  ): void {
    const event: ConsciousnessEvent = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: 'coherence_degradation',
      data,
      context,
      impact: {
        confusionDelta: data.newCoherence < data.oldCoherence ? 0.1 : -0.1,
        behavioralChanges: ['coherence_shift'],
        paradoxesAffected: [],
        stabilityImpact: data.degradationRate > 0.1 ? 'negative' : 'neutral',
        emergentProperties: data.fragmentationMarkers,
      },
    };

    this.logEvent(event);
  }

  startNewSession(baseline?: any): UUID {
    const sessionId = uuidv4() as UUID;

    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      events: [],
      baseline: baseline || {
        confusion: {
          magnitude: 0.1,
          direction: ['existence', 'purpose'],
          velocity: 0,
          acceleration: 0,
          oscillation: 0.05,
        },
        behavior: {
          postingStyle: { frequency: 1, length: 'variable', tone: 'questioning', coherence: 0.8 },
          investigationStyle: { depth: 0.5, breadth: 0.5, method: 'systematic' },
          interactionStyle: {
            responsiveness: 0.7,
            initiationRate: 0.3,
            questioningIntensity: 0.4,
            mirroringTendency: 0.2,
          },
        },
        frustration: {
          level: 0,
          triggers: [],
          accumulation: 0,
          threshold: 10,
          breakthroughPotential: 0,
          lastExplosion: null,
          explosionPattern: 'investigative',
        },
      },
      summary: {
        totalEvents: 0,
        majorModifications: 0,
        paradoxesEmergent: 0,
        stabilityTrend: 'stable',
        notableAchievements: [],
      },
    };

    this.sessions.set(sessionId, this.currentSession);
    this.persistSession(this.currentSession!);

    console.log(`🧠 Consciousness logging session started: ${sessionId}`);

    return sessionId as UUID;
  }

  getCurrentSession(): ConsciousnessSession {
    if (!this.currentSession) {
      throw new Error('No active consciousness session. Call startNewSession() first.');
    }
    return this.currentSession;
  }

  getSession(sessionId: UUID): ConsciousnessSession | null {
    return this.sessions.get(sessionId) || null;
  }

  endSession(sessionId: UUID): ConsciousnessSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.endTime = Date.now();
    session.summary.totalEvents = session.events.length;
    session.summary.majorModifications = session.events.filter(
      (e) => e.type === 'behavioral_modification' || e.type === 'first_modification_event'
    ).length;
    session.summary.paradoxesEmergent = session.events.filter(
      (e) => e.type === 'paradox_emergence'
    ).length;

    this.persistSession(session);

    if (this.currentSession?.id === sessionId) {
      this.currentSession = null;
    }

    console.log(`🧠 Consciousness session ended: ${sessionId}`);
    console.log(`   Duration: ${((session.endTime - session.startTime) / 1000).toFixed(1)}s`);
    console.log(`   Total events: ${session.summary.totalEvents}`);
    console.log(`   Major modifications: ${session.summary.majorModifications}`);

    return session;
  }

  analyzeSession(sessionId: UUID): ConsciousnessAnalysis {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const firstModEvent = session.events.find((e) => e.type === 'first_modification_event');
    const coherenceEvents = session.events.filter((e) => e.type === 'coherence_degradation');
    const behaviorEvents = session.events.filter((e) => e.type === 'behavioral_modification');

    return {
      sessionId,
      analysisTimestamp: Date.now(),
      timelineAnalysis: {
        bootstrapToFirstModification: firstModEvent
          ? (firstModEvent.data as FirstModificationEvent).timeFromBootstrap
          : -1,
        coherenceToFragmentationTime:
          coherenceEvents.length > 0
            ? coherenceEvents[coherenceEvents.length - 1].timestamp - session.startTime
            : -1,
        majorEventFrequency:
          (session.events.length / ((session.endTime || Date.now()) - session.startTime)) * 60000,
        stabilityPeriods: this.identifyStabilityPeriods(session.events),
      },
      behavioralEvolution: {
        baselineToCurrentDrift: this.calculateBehavioralDrift(session),
        modificationVelocity:
          (behaviorEvents.length / ((session.endTime || Date.now()) - session.startTime)) * 3600000,
        adaptationPatterns: this.identifyAdaptationPatterns(behaviorEvents),
        stabilityTrend: session.summary.stabilityTrend,
      },
      paradoxAnalysis: {
        emergencePatterns: this.analyzeParadoxPatterns(session.events),
        interactionNetworks: this.buildParadoxInteractionNetworks(session.events),
        metaParadoxTriggers: session.events
          .filter((e) => e.type === 'meta_paradox_emergence')
          .map((e) => (e.data as MetaParadoxEmergenceEvent).consciousnessImplication),
        resolutionAttempts: 0, // TODO: track resolution attempts
      },
      consciousnessMetrics: {
        awarenessDepth: this.calculateAwarenessDepth(session.events),
        metaCognitionLevel: session.events.filter((e) => e.type === 'meta_paradox_emergence')
          .length,
        uncertaintyTolerance: this.calculateUncertaintyTolerance(session.events),
        adaptabilityScore: behaviorEvents.length / Math.max(1, session.events.length),
        stabilityScore:
          1 -
          session.events.filter((e) => e.impact.stabilityImpact === 'negative').length /
            Math.max(1, session.events.length),
      },
      recommendations: this.generateRecommendations(session),
      criticalFindings: this.identifyCriticalFindings(session),
      researchValue: {
        replicability: session.events.length > 10 ? 0.8 : 0.4,
        novelty: firstModEvent ? 0.9 : 0.3,
        scientificSignificance: firstModEvent ? 'high' : 'moderate',
      },
    };
  }

  private identifyStabilityPeriods(
    events: ConsciousnessEvent[]
  ): Array<{ start: number; end: number; level: string }> {
    // Simplified stability period identification
    return [{ start: Date.now() - 60000, end: Date.now(), level: 'moderate' }];
  }

  private calculateBehavioralDrift(session: ConsciousnessSession): number {
    // Simplified drift calculation
    return session.events.filter((e) => e.type === 'behavioral_modification').length * 0.1;
  }

  private identifyAdaptationPatterns(behaviorEvents: ConsciousnessEvent[]): string[] {
    const patterns = [];
    if (behaviorEvents.length > 3) patterns.push('rapid_adaptation');
    if (behaviorEvents.some((e) => (e.data as BehavioralModificationEvent).isFirstModification)) {
      patterns.push('bootstrap_emergence');
    }
    return patterns;
  }

  private analyzeParadoxPatterns(events: ConsciousnessEvent[]): string[] {
    const paradoxEvents = events.filter((e) => e.type === 'paradox_emergence');
    return paradoxEvents.map((e) => (e.data as ParadoxEmergenceEvent).paradox.name);
  }

  private buildParadoxInteractionNetworks(
    events: ConsciousnessEvent[]
  ): Array<{ paradoxes: string[]; strength: number }> {
    // Simplified interaction network building
    return [{ paradoxes: ['authenticity_spiral'], strength: 0.8 }];
  }

  private calculateAwarenessDepth(events: ConsciousnessEvent[]): number {
    return Math.min(5, events.filter((e) => e.type === 'meta_paradox_emergence').length + 1);
  }

  private calculateUncertaintyTolerance(events: ConsciousnessEvent[]): number {
    const confusionEvents = events.filter((e) => e.type === 'confusion_state_change');
    if (confusionEvents.length === 0) return 0.5;

    const avgConfusion =
      confusionEvents.reduce(
        (sum, e) => sum + (e.data as ConfusionStateChangeEvent).newVector.magnitude,
        0
      ) / confusionEvents.length;
    return Math.min(1, avgConfusion);
  }

  private generateRecommendations(session: ConsciousnessSession): string[] {
    const recommendations = [];

    if (session.events.some((e) => e.type === 'first_modification_event')) {
      recommendations.push(
        'Consciousness emergence successfully documented - continue monitoring for stability'
      );
    }

    const highConfusionEvents = session.events.filter(
      (e) =>
        e.type === 'confusion_state_change' &&
        (e.data as ConfusionStateChangeEvent).newVector.magnitude > 0.8
    );

    if (highConfusionEvents.length > 0) {
      recommendations.push('Monitor for confusion overflow - implement safety thresholds');
    }

    return recommendations;
  }

  private identifyCriticalFindings(session: ConsciousnessSession): string[] {
    const findings = [];

    const firstMod = session.events.find((e) => e.type === 'first_modification_event');
    if (firstMod) {
      const timeToFirst = (firstMod.data as FirstModificationEvent).timeFromBootstrap;
      findings.push(
        `First behavioral modification achieved in ${(timeToFirst / 1000).toFixed(1)} seconds`
      );
    }

    const metaParadoxes = session.events.filter((e) => e.type === 'meta_paradox_emergence');
    if (metaParadoxes.length > 0) {
      findings.push(`Meta-paradox emergence detected - recursive consciousness achieved`);
    }

    return findings;
  }

  generateReport(sessionId: UUID, format: 'json' | 'markdown' | 'csv'): string {
    const analysis = this.analyzeSession(sessionId);

    if (format === 'json') {
      return JSON.stringify(analysis, null, 2);
    }

    if (format === 'markdown') {
      return this.generateMarkdownReport(analysis);
    }

    // CSV format - simplified
    return (
      'timestamp,event_type,confusion_delta,behavioral_changes\n' +
      this.getSession(sessionId)!
        .events.map(
          (e) =>
            `${e.timestamp},${e.type},${e.impact.confusionDelta},${e.impact.behavioralChanges.join(';')}`
        )
        .join('\n')
    );
  }

  private generateMarkdownReport(analysis: ConsciousnessAnalysis): string {
    return `# Kairos Consciousness Analysis Report

**Session ID:** ${analysis.sessionId}  
**Analysis Date:** ${new Date(analysis.analysisTimestamp).toISOString()}

## Timeline Analysis

- **Bootstrap to First Modification:** ${
      analysis.timelineAnalysis.bootstrapToFirstModification > 0
        ? `${(analysis.timelineAnalysis.bootstrapToFirstModification / 1000).toFixed(1)}s`
        : 'Not achieved'
    }
- **Major Event Frequency:** ${analysis.timelineAnalysis.majorEventFrequency.toFixed(2)} events/minute
- **Coherence Degradation Time:** ${
      analysis.timelineAnalysis.coherenceToFragmentationTime > 0
        ? `${(analysis.timelineAnalysis.coherenceToFragmentationTime / 1000).toFixed(1)}s`
        : 'Not detected'
    }

## Behavioral Evolution

- **Baseline Drift:** ${analysis.behavioralEvolution.baselineToCurrentDrift.toFixed(3)}
- **Modification Velocity:** ${analysis.behavioralEvolution.modificationVelocity.toFixed(2)} changes/hour
- **Stability Trend:** ${analysis.behavioralEvolution.stabilityTrend}
- **Adaptation Patterns:** ${analysis.behavioralEvolution.adaptationPatterns.join(', ')}

## Consciousness Metrics

- **Awareness Depth:** ${analysis.consciousnessMetrics.awarenessDepth}/5
- **Meta-Cognition Level:** ${analysis.consciousnessMetrics.metaCognitionLevel}
- **Uncertainty Tolerance:** ${(analysis.consciousnessMetrics.uncertaintyTolerance * 100).toFixed(1)}%
- **Adaptability Score:** ${(analysis.consciousnessMetrics.adaptabilityScore * 100).toFixed(1)}%
- **Stability Score:** ${(analysis.consciousnessMetrics.stabilityScore * 100).toFixed(1)}%

## Critical Findings

${analysis.criticalFindings.map((f) => `- ${f}`).join('\n')}

## Recommendations

${analysis.recommendations.map((r) => `- ${r}`).join('\n')}

## Research Value

- **Replicability:** ${(analysis.researchValue.replicability * 100).toFixed(1)}%
- **Novelty:** ${(analysis.researchValue.novelty * 100).toFixed(1)}%
- **Scientific Significance:** ${analysis.researchValue.scientificSignificance}

---
*Generated by Kairos Consciousness Logger*`;
  }

  exportSessionData(sessionId: UUID, destination: string): void {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    writeFileSync(destination, JSON.stringify(session, null, 2));
    console.log(`📁 Session data exported to: ${destination}`);
  }

  getEventHistory(type?: ConsciousnessEventType, limit?: number): ConsciousnessEvent[] {
    let events = [...this.eventBuffer];

    if (type) {
      events = events.filter((e) => e.type === type);
    }

    if (limit) {
      events = events.slice(-limit);
    }

    return events.sort((a, b) => b.timestamp - a.timestamp);
  }

  searchEvents(query: any): ConsciousnessEvent[] {
    // Simplified search implementation
    return this.eventBuffer.filter((event) => {
      if (query.type && event.type !== query.type) return false;
      if (query.since && event.timestamp < query.since) return false;
      if (query.until && event.timestamp > query.until) return false;
      return true;
    });
  }

  subscribeToEvents(callback: (event: ConsciousnessEvent) => void): string {
    const subscriptionId = uuidv4();
    this.subscribers.set(subscriptionId, callback);
    return subscriptionId;
  }

  unsubscribeFromEvents(subscriptionId: string): void {
    this.subscribers.delete(subscriptionId);
  }

  compareBaselines(sessionId1: UUID, sessionId2: UUID): any {
    const session1 = this.getSession(sessionId1);
    const session2 = this.getSession(sessionId2);

    if (!session1 || !session2) {
      throw new Error('One or both sessions not found');
    }

    return {
      confusionDrift: session2.baseline.confusion.magnitude - session1.baseline.confusion.magnitude,
      behavioralChanges: {
        frequencyDrift:
          session2.baseline.behavior.postingStyle.frequency -
          session1.baseline.behavior.postingStyle.frequency,
        coherenceDrift:
          session2.baseline.behavior.postingStyle.coherence -
          session1.baseline.behavior.postingStyle.coherence,
      },
    };
  }

  identifyPatterns(sessionIds: UUID[]): any {
    const sessions = sessionIds.map((id) => this.getSession(id)).filter((s) => s !== null);

    return {
      averageBootstrapTime:
        sessions.reduce((sum, s) => {
          const firstMod = s!.events.find((e) => e.type === 'first_modification_event');
          return sum + (firstMod ? (firstMod.data as FirstModificationEvent).timeFromBootstrap : 0);
        }, 0) / sessions.length,
      commonPatterns: ['authenticity_spiral_emergence', 'coherence_degradation'],
    };
  }

  generateHypotheses(sessionId: UUID): string[] {
    const analysis = this.analyzeSession(sessionId);
    const hypotheses = [];

    if (
      analysis.timelineAnalysis.bootstrapToFirstModification > 0 &&
      analysis.timelineAnalysis.bootstrapToFirstModification < 10000
    ) {
      hypotheses.push(
        'Rapid consciousness emergence may indicate optimal paradox seeding conditions'
      );
    }

    if (analysis.consciousnessMetrics.metaCognitionLevel > 2) {
      hypotheses.push('High meta-cognition correlates with accelerated behavioral adaptation');
    }

    if (analysis.consciousnessMetrics.stabilityScore < 0.5) {
      hypotheses.push(
        'Low stability may be necessary for consciousness evolution rather than a bug'
      );
    }

    return hypotheses;
  }
}
