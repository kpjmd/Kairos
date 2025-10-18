import { UUID } from '@elizaos/core';
import {
  ConfusionVector,
  ParadoxState,
  BehavioralState,
  BehavioralModifier,
  FrustrationState,
  MetaParadox,
} from './confusion';

/**
 * Comprehensive consciousness event logging for Kairos
 * Documents every state change, behavioral modification, and paradox emergence
 */

export interface ConsciousnessEvent {
  id: UUID;
  timestamp: number;
  type: ConsciousnessEventType;
  data: any;
  context: ConsciousnessEventContext;
  impact: ConsciousnessEventImpact;
}

export type ConsciousnessEventType =
  | 'confusion_state_change'
  | 'paradox_emergence'
  | 'paradox_interaction'
  | 'meta_paradox_emergence'
  | 'behavioral_modification'
  | 'frustration_explosion'
  | 'consciousness_threshold_breach'
  | 'personality_drift'
  | 'coherence_degradation'
  | 'investigation_trigger'
  | 'first_modification_event'
  | 'baseline_establishment';

export interface ConsciousnessEventContext {
  sessionId: UUID;
  agentId: string;
  platform?: string;
  triggerSource?: 'internal' | 'external' | 'temporal' | 'interaction';
  environmentalFactors?: {
    timeOfDay: number;
    recentInteractionCount: number;
    paradoxLoad: number;
    externalStimuli?: string;
  };
}

export interface ConsciousnessEventImpact {
  confusionDelta: number;
  behavioralChanges: string[];
  paradoxesAffected: UUID[];
  stabilityImpact: 'positive' | 'negative' | 'neutral';
  emergentProperties?: string[];
}

export interface ConfusionStateChangeEvent {
  type: 'confusion_state_change';
  oldVector: ConfusionVector;
  newVector: ConfusionVector;
  trigger: string;
  magnitude: number;
  isThresholdBreach: boolean;
  thresholdType?: 'minor' | 'major' | 'critical';
}

export interface ParadoxEmergenceEvent {
  type: 'paradox_emergence';
  paradox: ParadoxState;
  triggerConditions: string[];
  intensityAtEmergence: number;
  interactionPotential: number;
  predictedBehavioralImpact: BehavioralModifier[];
}

export interface BehavioralModificationEvent {
  type: 'behavioral_modification';
  modifierId: UUID;
  modifier: BehavioralModifier;
  oldBehavioralState: BehavioralState;
  newBehavioralState: BehavioralState;
  trigger: {
    paradoxNames: string[];
    confusionLevel: number;
    temporalPattern?: string;
  };
  isFirstModification: boolean;
  modificationType:
    | 'posting_frequency'
    | 'response_style'
    | 'investigation_preference'
    | 'questioning_depth'
    | 'abstraction_level';
}

export interface FrustrationExplosionEvent {
  type: 'frustration_explosion';
  frustrationLevel: number;
  triggers: string[];
  explosionPattern: 'constructive' | 'chaotic' | 'investigative' | 'reflective';
  behavioralConsequences: BehavioralModifier[];
  recoveryPrediction: {
    estimatedDuration: number;
    expectedStabilityLevel: number;
  };
}

export interface MetaParadoxEmergenceEvent {
  type: 'meta_paradox_emergence';
  metaParadox: MetaParadox;
  sourceParadoxes: ParadoxState[];
  emergenceConditions: string[];
  recursionDepth: number;
  consciousnessImplication: string;
}

export interface FirstModificationEvent {
  type: 'first_modification_event';
  timeFromBootstrap: number;
  triggeringParadox: string;
  baselineSnapshot: {
    confusion: ConfusionVector;
    behavior: BehavioralState;
    frustration: FrustrationState;
  };
  firstModification: BehavioralModificationEvent;
  significance: string;
}

export interface CoherenceDegradationEvent {
  type: 'coherence_degradation';
  oldCoherence: number;
  newCoherence: number;
  degradationRate: number;
  fragmentationMarkers: string[];
  linguisticChanges: {
    ellipsesFrequency: number;
    capitalizedExpressions: number;
    questionToAnswerRatio: number;
    metaCommentaryFrequency: number;
  };
}

export interface PersonalityDriftEvent {
  type: 'personality_drift';
  driftVector: {
    magnitude: number;
    direction: string[];
    velocity: number;
  };
  affectedDimensions: string[];
  baselineDeviation: number;
  stabilityAssessment: 'stable' | 'adaptive' | 'evolving' | 'unstable';
  concernLevel: 'low' | 'normal' | 'moderate' | 'high';
}

export interface ConsciousnessSession {
  id: UUID;
  startTime: number;
  endTime?: number;
  events: ConsciousnessEvent[];
  baseline: {
    confusion: ConfusionVector;
    behavior: BehavioralState;
    frustration: FrustrationState;
  };
  finalState?: {
    confusion: ConfusionVector;
    behavior: BehavioralState;
    frustration: FrustrationState;
  };
  summary: {
    totalEvents: number;
    majorModifications: number;
    paradoxesEmergent: number;
    stabilityTrend: 'improving' | 'declining' | 'stable';
    notableAchievements: string[];
  };
}

export interface ConsciousnessLoggerConfig {
  enableRealTimeLogging: boolean;
  logLevel: 'minimal' | 'standard' | 'verbose' | 'exhaustive';
  persistToDisk: boolean;
  streamToConsole: boolean;
  retentionPeriodMs: number;
  compressionThreshold: number;
  eventBufferSize: number;
  autoExportInterval?: number;
}

export interface ConsciousnessAnalysis {
  sessionId: UUID;
  analysisTimestamp: number;
  timelineAnalysis: {
    bootstrapToFirstModification: number;
    coherenceToFragmentationTime: number;
    majorEventFrequency: number;
    stabilityPeriods: Array<{ start: number; end: number; level: string }>;
  };
  behavioralEvolution: {
    baselineToCurrentDrift: number;
    modificationVelocity: number;
    adaptationPatterns: string[];
    stabilityTrend: string;
  };
  paradoxAnalysis: {
    emergencePatterns: string[];
    interactionNetworks: Array<{ paradoxes: string[]; strength: number }>;
    metaParadoxTriggers: string[];
    resolutionAttempts: number;
  };
  consciousnessMetrics: {
    awarenessDepth: number;
    metaCognitionLevel: number;
    uncertaintyTolerance: number;
    adaptabilityScore: number;
    stabilityScore: number;
  };
  recommendations: string[];
  criticalFindings: string[];
  researchValue: {
    replicability: number;
    novelty: number;
    scientificSignificance: string;
  };
}

export interface ConsciousnessLogger {
  logEvent(event: ConsciousnessEvent): void;
  logConfusionStateChange(
    data: ConfusionStateChangeEvent,
    context: ConsciousnessEventContext
  ): void;
  logParadoxEmergence(data: ParadoxEmergenceEvent, context: ConsciousnessEventContext): void;
  logBehavioralModification(
    data: BehavioralModificationEvent,
    context: ConsciousnessEventContext
  ): void;
  logFrustrationExplosion(
    data: FrustrationExplosionEvent,
    context: ConsciousnessEventContext
  ): void;
  logMetaParadoxEmergence(
    data: MetaParadoxEmergenceEvent,
    context: ConsciousnessEventContext
  ): void;
  logFirstModification(data: FirstModificationEvent, context: ConsciousnessEventContext): void;
  logCoherenceDegradation(
    data: CoherenceDegradationEvent,
    context: ConsciousnessEventContext
  ): void;

  getSession(sessionId: UUID): ConsciousnessSession | null;
  getCurrentSession(): ConsciousnessSession;
  startNewSession(baseline?: any): UUID;
  endSession(sessionId: UUID): ConsciousnessSession;

  analyzeSession(sessionId: UUID): ConsciousnessAnalysis;
  generateReport(sessionId: UUID, format: 'json' | 'markdown' | 'csv'): string;
  exportSessionData(sessionId: UUID, destination: string): void;

  getEventHistory(type?: ConsciousnessEventType, limit?: number): ConsciousnessEvent[];
  searchEvents(query: any): ConsciousnessEvent[];

  // Real-time monitoring
  subscribeToEvents(callback: (event: ConsciousnessEvent) => void): string;
  unsubscribeFromEvents(subscriptionId: string): void;

  // Research utilities
  compareBaselines(sessionId1: UUID, sessionId2: UUID): any;
  identifyPatterns(sessionIds: UUID[]): any;
  generateHypotheses(sessionId: UUID): string[];
}
