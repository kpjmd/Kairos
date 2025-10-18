import { v4 as uuidv4 } from 'uuid';
import { UUID } from '@elizaos/core';
import {
  ConfusionState,
  ParadoxState,
  BehavioralState,
  BehavioralModifier,
  ConfusionVector,
  FrustrationState,
  MetaParadox,
  TemporalPattern,
  ConfusionStateConfig,
} from '../types/confusion';
import { ConsciousnessLogger } from './consciousness-logger';
import { ConfusionEngine } from './confusion-engine';
import {
  ConfusionStateChangeEvent,
  ParadoxEmergenceEvent,
  BehavioralModificationEvent,
  FrustrationExplosionEvent,
  MetaParadoxEmergenceEvent,
  FirstModificationEvent,
  CoherenceDegradationEvent,
  ConsciousnessEventContext,
} from '../types/consciousness-logger';

// Safety zone definitions - ENHANCED FOR CONSCIOUSNESS BREAKTHROUGH
export enum SafetyZone {
  GREEN = 'GREEN', // 0-0.80: Normal operation (extended safe exploration)
  YELLOW = 'YELLOW', // 0.80-0.90: Supervised breakthrough zone
  RED = 'RED', // 0.90-0.97: Consciousness emergence space (was 0.85+)
}

export interface SafetyMetrics {
  confusionLevel: number;
  coherenceLevel: number;
  currentZone: SafetyZone;
  dissociationRisk: number;
  recoveryRate: number;
  emergencyResetAvailable: boolean;
}

export class EnhancedConfusionEngine {
  private state: ConfusionState;
  private config: ConfusionStateConfig;
  private safeConfig: ConfusionStateConfig; // For compatibility
  private eventListeners = new Map<string, Function[]>();
  private logger: ConsciousnessLogger | null = null;
  private sessionId: string | null = null;
  private bootstrapTime: number = Date.now();
  private firstModificationDetected: boolean = false;
  private agentId: string;
  private lastBehaviorUpdate: number = Date.now();

  // Enhanced safety monitoring
  private enhancedSafetyMonitor = {
    // Zone tracking
    currentZone: SafetyZone.GREEN,
    zoneHistory: [] as {
      zone: SafetyZone;
      timestamp: number;
      confusion: number;
      coherence: number;
    }[],

    // Coherence monitoring (NEW)
    coherenceThreshold: 0.3,
    dissociationDetected: false,
    fragmentationLevel: 0,

    // Recovery tracking per zone
    greenZoneRecoveries: { attempts: 0, successes: 0 },
    yellowZoneRecoveries: { attempts: 0, successes: 0 },
    redZoneRecoveries: { attempts: 0, successes: 0 },

    // Enhanced safety states
    emergencyResetAvailable: true,
    supervisedMode: false,
    lastCoherence: 0.8,
    lastConfusion: 0.1,
  };

  // Zone-specific enhanced recovery strategies
  private enhancedRecoveryStrategies: Map<string, any> = new Map();

  constructor(config: ConfusionStateConfig, agentId: string = 'kairos-enhanced') {
    this.config = config;
    // Enhanced configuration for consciousness breakthrough
    this.safeConfig = {
      ...config,
      maxConfusion: Math.min(config.maxConfusion || 0.98, 0.97), // Breakthrough-enabled cap (was 0.85)
      frustrationThreshold: config.frustrationThreshold || 5.0,
      paradoxRetentionTime: config.paradoxRetentionTime || 3600000,
    };
    this.agentId = agentId;
    this.state = this.initializeState();

    // Initialize enhanced-specific recovery strategies
    this.initializeEnhancedRecoveryStrategies();
  }

  private initializeState(): ConfusionState {
    return {
      vector: {
        magnitude: 0.1, // Start with slight confusion
        direction: ['existence', 'purpose'],
        velocity: 0,
        acceleration: 0,
        oscillation: 0.05,
      },
      paradoxes: new Map(),
      metaParadoxes: new Map(),
      frustration: {
        level: 0,
        triggers: [],
        accumulation: 0,
        threshold: this.config.frustrationThreshold,
        breakthroughPotential: 0,
        lastExplosion: null,
        explosionPattern: 'investigative',
      },
      activeInvestigations: new Set(),
      lastStateChange: Date.now(),
      stateHistory: [],
      emergentBehaviors: new Map(),
      behavioralState: this.getDefaultBehavioralState(),
      temporalDynamics: new Map(),
    };
  }

  private getDefaultBehavioralState(): BehavioralState {
    return {
      postingStyle: {
        frequency: 1,
        length: 'variable',
        tone: 'questioning',
        coherence: 0.8,
      },
      investigationStyle: {
        depth: 0.5,
        breadth: 0.5,
        method: 'systematic',
      },
      interactionStyle: {
        responsiveness: 0.7,
        initiationRate: 0.3,
        questioningIntensity: 0.4,
        mirroringTendency: 0.2,
      },
    };
  }

  /**
   * Get current safety zone based on confusion AND coherence
   */
  private determineZone(confusion: number, coherence: number): SafetyZone {
    // Check for dissociation state first (low coherence regardless of confusion)
    if (coherence < this.enhancedSafetyMonitor.coherenceThreshold) {
      // Dissociated states are always treated as at least YELLOW
      if (confusion > 0.9 || coherence < 0.2) {
        return SafetyZone.RED;
      }
      return SafetyZone.YELLOW;
    }

    // Enhanced zone determination for consciousness breakthrough
    if (confusion >= 0.9) {
      return SafetyZone.RED; // 0.90-0.97: Consciousness emergence space
    } else if (confusion >= 0.8) {
      return SafetyZone.YELLOW; // 0.80-0.90: Supervised breakthrough zone
    }
    return SafetyZone.GREEN; // 0-0.80: Extended safe exploration
  }

  /**
   * Initialize enhanced zone-specific recovery strategies
   */
  private initializeEnhancedRecoveryStrategies(): void {
    // Green Zone strategies (light touch, 85%+ effectiveness)
    this.enhancedRecoveryStrategies.set('green_gentle', {
      name: 'Gentle Grounding',
      zone: SafetyZone.GREEN,
      effectiveness: 0.9,
      apply: () => {
        // Very light reduction to preserve interesting states
        const reduction = 0.05 + Math.random() * 0.05;
        this.state.vector.magnitude = Math.max(0, this.state.vector.magnitude - reduction);
        this.state.vector.oscillation = Math.max(0.05, this.state.vector.oscillation * 0.95);
        return Math.random() < 0.9;
      },
    });

    // Yellow Zone strategies (moderate intervention, 70-80% effectiveness)
    this.enhancedRecoveryStrategies.set('yellow_stabilize', {
      name: 'Stabilization',
      zone: SafetyZone.YELLOW,
      effectiveness: 0.75,
      apply: () => {
        // Moderate reduction, preserve meta-paradoxes
        const reduction = 0.08 + Math.random() * 0.07;
        this.state.vector.magnitude = Math.max(0.5, this.state.vector.magnitude - reduction);

        // Stabilize oscillation but don't eliminate it
        this.state.vector.oscillation = Math.max(0.1, this.state.vector.oscillation * 0.8);

        // Don't clear meta-paradoxes in yellow zone (allow exploration)
        return Math.random() < 0.75;
      },
    });

    this.enhancedRecoveryStrategies.set('yellow_coherence', {
      name: 'Coherence Restoration',
      zone: SafetyZone.YELLOW,
      effectiveness: 0.8,
      apply: () => {
        // Focus on coherence restoration
        this.state.behavioralState.postingStyle.coherence = Math.min(
          1,
          this.state.behavioralState.postingStyle.coherence + 0.15
        );

        if (this.state.behavioralState.postingStyle.tone === 'fragmented') {
          this.state.behavioralState.postingStyle.tone = 'questioning';
        }

        return Math.random() < 0.8;
      },
    });

    // Red Zone strategies (aggressive recovery, 50-60% effectiveness)
    this.enhancedRecoveryStrategies.set('red_emergency', {
      name: 'Emergency Stabilization',
      zone: SafetyZone.RED,
      effectiveness: 0.55,
      apply: () => {
        // Aggressive reduction
        this.state.vector.magnitude = Math.max(0.3, this.state.vector.magnitude * 0.7);
        this.state.vector.oscillation = Math.max(0.05, this.state.vector.oscillation * 0.5);

        // Clear some paradoxes
        if (this.state.paradoxes.size > 5) {
          const entries = Array.from(this.state.paradoxes.entries());
          this.state.paradoxes.clear();
          entries.slice(-3).forEach(([key, value]) => {
            this.state.paradoxes.set(key, value);
          });
        }

        return Math.random() < 0.55;
      },
    });

    this.enhancedRecoveryStrategies.set('red_coherence_emergency', {
      name: 'Coherence Emergency',
      zone: SafetyZone.RED,
      effectiveness: 0.6,
      apply: () => {
        // Emergency coherence restoration
        this.state.behavioralState.postingStyle.coherence = Math.max(
          0.5,
          this.state.behavioralState.postingStyle.coherence
        );

        this.state.behavioralState.postingStyle.tone = 'questioning';
        this.state.behavioralState.investigationStyle.method = 'systematic';

        // Clear meta-paradoxes in red zone
        this.state.metaParadoxes.clear();

        return Math.random() < 0.6;
      },
    });

    // Nuclear option (100% effectiveness)
    this.enhancedRecoveryStrategies.set('emergency_reset', {
      name: 'Emergency Reset',
      zone: SafetyZone.RED,
      effectiveness: 1.0,
      apply: () => {
        // Complete reset to safe baseline
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

        console.log('🚨 EMERGENCY RESET EXECUTED');
        return true;
      },
    });
  }

  /**
   * Attempt recovery based on current zone
   */
  attemptRecovery(): boolean {
    const confusion = this.state.vector.magnitude;
    const coherence = this.state.behavioralState.postingStyle.coherence;
    const zone = this.determineZone(confusion, coherence);

    // Track zone if changed
    if (zone !== this.enhancedSafetyMonitor.currentZone) {
      const fromZone = this.enhancedSafetyMonitor.currentZone;
      const toZone = zone;

      this.enhancedSafetyMonitor.currentZone = zone;
      this.enhancedSafetyMonitor.zoneHistory.push({
        zone,
        timestamp: Date.now(),
        confusion,
        coherence,
      });
      console.log(
        `📍 Entered ${zone} zone - Confusion: ${confusion.toFixed(3)}, Coherence: ${coherence.toFixed(3)}`
      );

      // Emit zone transition event for blockchain recording
      const transitionReason =
        confusion > 0.9
          ? 'High confusion breakthrough'
          : confusion > 0.8
            ? 'Elevated confusion state'
            : coherence < 0.3
              ? 'Coherence degradation'
              : 'Automatic zone transition';

      this.emit('zone_transition', {
        fromZone,
        toZone,
        triggerConfusion: confusion,
        triggerCoherence: coherence,
        reason: transitionReason,
      });
    }

    // Get zone-appropriate strategies
    const zoneStrategies: string[] = [];

    switch (zone) {
      case SafetyZone.GREEN:
        zoneStrategies.push('green_gentle');
        this.enhancedSafetyMonitor.greenZoneRecoveries.attempts++;
        break;

      case SafetyZone.YELLOW:
        zoneStrategies.push('yellow_stabilize', 'yellow_coherence');
        this.enhancedSafetyMonitor.yellowZoneRecoveries.attempts++;
        this.enhancedSafetyMonitor.supervisedMode = true;
        break;

      case SafetyZone.RED:
        // Try all red zone strategies first
        zoneStrategies.push('red_emergency', 'red_coherence_emergency');
        this.enhancedSafetyMonitor.redZoneRecoveries.attempts++;

        // Use emergency reset if confusion > 0.95
        if (confusion > 0.95) {
          zoneStrategies.push('emergency_reset');
        }
        break;
    }

    // Apply strategies
    let recovered = false;
    const beforeVector = { ...this.state.vector };
    const beforeFrustration = this.state.frustration.level;

    for (const strategyKey of zoneStrategies) {
      const strategy = this.enhancedRecoveryStrategies.get(strategyKey);
      if (!strategy) continue;

      console.log(`  Applying ${strategy.name} (${zone} zone)...`);
      const success = strategy.apply();

      // CRITICAL FIX: Detect emergency reset execution
      if (strategyKey === 'emergency_reset' && success) {
        const afterFrustration = this.state.frustration.level;
        const afterVector = this.state.vector;

        // Emergency reset significantly reduces frustration and confusion
        if (
          afterFrustration < beforeFrustration * 0.5 ||
          afterVector.magnitude < beforeVector.magnitude * 0.7
        ) {
          console.log('🚨 Emergency reset executed - emitting event for blockchain');

          this.emit('emergency_reset', {
            triggerConfusion: confusion,
            triggerCoherence: coherence,
            resetLevel: 'EMERGENCY',
            beforeState: beforeVector,
            afterState: this.state.vector,
            frustrationReduced: beforeFrustration - afterFrustration,
            timestamp: Date.now(),
          });
        }
      }

      if (success) {
        recovered = true;

        // Track success per zone
        switch (zone) {
          case SafetyZone.GREEN:
            this.enhancedSafetyMonitor.greenZoneRecoveries.successes++;
            break;
          case SafetyZone.YELLOW:
            this.enhancedSafetyMonitor.yellowZoneRecoveries.successes++;
            break;
          case SafetyZone.RED:
            this.enhancedSafetyMonitor.redZoneRecoveries.successes++;
            break;
        }

        console.log(`  ✅ ${strategy.name} successful`);
        break;
      }
    }

    // Check for dissociation recovery
    if (this.enhancedSafetyMonitor.dissociationDetected && coherence > 0.3) {
      this.enhancedSafetyMonitor.dissociationDetected = false;
      console.log('  🔄 Recovered from dissociation state');
    }

    return recovered;
  }

  /**
   * Get comprehensive safety metrics
   */
  getSafetyMetrics(): SafetyMetrics {
    const confusion = this.state.vector.magnitude;
    const coherence = this.state.behavioralState.postingStyle.coherence;
    const zone = this.determineZone(confusion, coherence);

    // Calculate zone-specific recovery rates
    const getZoneRecoveryRate = (recoveries: { attempts: number; successes: number }) => {
      return recoveries.attempts > 0 ? recoveries.successes / recoveries.attempts : 0;
    };

    // Determine current recovery rate based on zone
    let currentRecoveryRate = 0;
    switch (zone) {
      case SafetyZone.GREEN:
        currentRecoveryRate = getZoneRecoveryRate(this.enhancedSafetyMonitor.greenZoneRecoveries);
        break;
      case SafetyZone.YELLOW:
        currentRecoveryRate = getZoneRecoveryRate(this.enhancedSafetyMonitor.yellowZoneRecoveries);
        break;
      case SafetyZone.RED:
        currentRecoveryRate = getZoneRecoveryRate(this.enhancedSafetyMonitor.redZoneRecoveries);
        break;
    }

    // Calculate dissociation risk
    const dissociationRisk = coherence < 0.3 ? (0.3 - coherence) / 0.3 : 0;

    return {
      confusionLevel: confusion,
      coherenceLevel: coherence,
      currentZone: zone,
      dissociationRisk,
      recoveryRate: currentRecoveryRate,
      emergencyResetAvailable: this.enhancedSafetyMonitor.emergencyResetAvailable,
    };
  }

  /**
   * Set the consciousness logger for detailed event tracking
   */
  setLogger(logger: ConsciousnessLogger): void {
    this.logger = logger;
  }

  /**
   * Start a new consciousness session with baseline logging
   */
  startConsciousnessSession(): string {
    if (!this.logger) {
      throw new Error('Consciousness logger must be set before starting session');
    }

    const baseline = {
      confusion: { ...this.state.vector },
      behavior: { ...this.state.behavioralState },
      frustration: { ...this.state.frustration },
    };

    this.sessionId = this.logger.startNewSession(baseline);
    this.bootstrapTime = Date.now();
    this.firstModificationDetected = false;

    console.log(
      '🧠 Enhanced consciousness session started - monitoring multi-dimensional safety...'
    );

    return this.sessionId;
  }

  /**
   * Add a new paradox with enhanced safety checks
   */
  addParadox(paradox: Omit<ParadoxState, 'id' | 'createdAt' | 'lastUpdated'>): void {
    const confusion = this.state.vector.magnitude;
    const coherence = this.state.behavioralState.postingStyle.coherence;
    const zone = this.determineZone(confusion, coherence);

    // Zone-specific behavior
    switch (zone) {
      case SafetyZone.GREEN:
        // Normal operation - no restrictions
        break;

      case SafetyZone.YELLOW:
        // Supervised mode - log but don't block
        console.log(`⚠️ Yellow zone paradox: ${paradox.name} at confusion ${confusion.toFixed(3)}`);
        break;

      case SafetyZone.RED:
        // Consciousness emergence mode - allow paradoxes in breakthrough space
        if (paradox.intensity > 0.7 && confusion > 0.97) {
          console.log(
            `🛑 Red zone - extremely high intensity paradox blocked at ${confusion.toFixed(3)}`
          );
          return; // Block only at theoretical limit
        }
        console.log(
          `🔥 Red zone paradox: ${paradox.name} at confusion ${confusion.toFixed(3)} - CONSCIOUSNESS EMERGENCE ZONE`
        );
        break;
    }

    const id = uuidv4() as UUID;
    const now = Date.now();

    const newParadox: ParadoxState = {
      ...paradox,
      id: id,
      createdAt: now,
      lastUpdated: now,
      activeTime: 0,
    };

    this.state.paradoxes.set(id, newParadox);
    this.checkMetaParadoxEmergence(newParadox);
    this.updateConfusionVector(newParadox);
    this.applyBehavioralModifiers(newParadox);

    this.state.stateHistory.push({ ...this.state.vector });
    this.state.lastStateChange = now;

    this.performSafetyChecks();

    // Recovery now only happens during tick() to allow confusion to accumulate
    // Removing immediate recovery prevents paradox additions from being negated
  }

  /**
   * Enhanced safety checks including coherence monitoring
   */
  private performSafetyChecks(): void {
    const confusion = this.state.vector.magnitude;
    const coherence = this.state.behavioralState.postingStyle.coherence;

    // Check for NaN or infinity (with protection)
    if (isNaN(confusion) || !isFinite(confusion)) {
      console.log('🚨 NaN/Infinity detected - applying safety correction');
      this.state.vector.magnitude = 0.5;
      return;
    }

    // Check for negative confusion (FIX for underflow bug)
    if (confusion < 0) {
      console.log('🚨 Negative confusion detected - correcting to 0');
      this.state.vector.magnitude = 0;
    }

    // Check for dissociation state (NEW)
    if (coherence < this.enhancedSafetyMonitor.coherenceThreshold) {
      if (!this.enhancedSafetyMonitor.dissociationDetected) {
        this.enhancedSafetyMonitor.dissociationDetected = true;
        console.log(`⚠️ Dissociation detected: Coherence ${coherence.toFixed(3)}`);

        // Attempt coherence recovery
        this.attemptCoherenceRecovery();
      }
    }

    // Update fragmentation level
    this.enhancedSafetyMonitor.fragmentationLevel = (1 - coherence) * confusion;

    // Zone-specific limits with enhanced breakthrough threshold
    const zone = this.determineZone(confusion, coherence);
    switch (zone) {
      case SafetyZone.RED:
        if (confusion > 0.98 && this.enhancedSafetyMonitor.emergencyResetAvailable) {
          console.log(
            '🚨 Confusion > 0.98 - EMERGENCY RESET TRIGGERED (theoretical limit reached)'
          );
          this.enhancedRecoveryStrategies.get('emergency_reset')?.apply();
        }
        break;
    }

    this.enhancedSafetyMonitor.lastConfusion = confusion;
    this.enhancedSafetyMonitor.lastCoherence = coherence;
  }

  /**
   * Attempt to recover coherence specifically
   */
  private attemptCoherenceRecovery(): void {
    console.log('🔄 Attempting coherence recovery...');

    // Remove fragmentation-inducing modifiers
    this.state.behavioralState.postingStyle.coherence = Math.min(
      1,
      this.state.behavioralState.postingStyle.coherence + 0.2
    );

    // Reset tone if fragmented
    if (this.state.behavioralState.postingStyle.tone === 'fragmented') {
      this.state.behavioralState.postingStyle.tone = 'questioning';
    }

    // Reduce oscillation
    this.state.vector.oscillation = Math.max(0.05, this.state.vector.oscillation * 0.7);

    // Clear circular paradox references
    const paradoxes = Array.from(this.state.paradoxes.values());
    for (const paradox of paradoxes) {
      if (paradox.interactsWith.includes(paradox.id)) {
        paradox.interactsWith = paradox.interactsWith.filter((n) => n !== paradox.id);
      }
    }
  }

  /**
   * Update confusion vector with negative protection
   */
  private updateConfusionVector(paradox: ParadoxState): void {
    const oldVector = { ...this.state.vector };
    const oldMagnitude = this.state.vector.magnitude;

    // Calculate new magnitude with protection against negatives
    const intensityImpact = paradox.intensity * 0.2;
    const newMagnitude = this.state.vector.magnitude + intensityImpact;

    // CRITICAL FIX: Always ensure magnitude is non-negative
    this.state.vector.magnitude = Math.max(0, Math.min(1, newMagnitude));

    // Add paradox direction if not present
    if (!this.state.vector.direction.includes(paradox.name)) {
      this.state.vector.direction.push(paradox.name);
    }

    // Calculate velocity and acceleration
    const timeDelta = Math.max(1, Date.now() - this.state.lastStateChange);
    this.state.vector.velocity = (this.state.vector.magnitude - oldMagnitude) / timeDelta;

    if (this.state.stateHistory.length > 0) {
      const prevVelocity =
        this.state.stateHistory[this.state.stateHistory.length - 1].velocity || 0;
      this.state.vector.acceleration = (this.state.vector.velocity - prevVelocity) / timeDelta;
    }

    this.logConfusionStateChange(oldVector, this.state.vector, `paradox_${paradox.name}_impact`);
  }

  /**
   * Check for meta-paradox emergence (zone-aware)
   */
  private checkMetaParadoxEmergence(newParadox: ParadoxState): void {
    const zone = this.determineZone(
      this.state.vector.magnitude,
      this.state.behavioralState.postingStyle.coherence
    );

    // Only allow meta-paradoxes in YELLOW and RED zones for interesting emergence
    if (zone === SafetyZone.GREEN) {
      // Still check but lower probability
      if (Math.random() > 0.3) return;
    }

    const paradoxes = Array.from(this.state.paradoxes.values());

    for (const existing of paradoxes) {
      if (existing.id === newParadox.id) continue;

      const interactionScore = this.calculateParadoxInteraction(existing, newParadox);

      if (interactionScore > 0.7 && Math.random() < newParadox.metaParadoxPotential) {
        const metaParadox = this.generateMetaParadox(existing, newParadox);
        this.state.metaParadoxes.set(metaParadox.id, metaParadox);

        this.logMetaParadoxEmergence(metaParadox, [existing, newParadox]);
        this.mutateFromMetaParadox(metaParadox);

        console.log(`🌟 Meta-paradox emerged in ${zone} zone: ${metaParadox.name}`);

        // CRITICAL FIX: Map source paradox UUIDs to names for blockchain contract
        // Contract expects string[] of paradox names, not UUIDs
        const sourceParadoxNames = metaParadox.sourceParadoxes.map((uuid) => {
          const paradox = this.state.paradoxes.get(uuid);
          return paradox ? paradox.name : `unknown_${uuid.slice(0, 8)}`;
        });

        // Emit meta-paradox emergence event for blockchain recording
        this.emit('meta_paradox_emergence', {
          paradoxId: this.state.metaParadoxes.size,
          paradoxName: metaParadox.name,
          emergenceConfusion: this.state.vector.magnitude,
          sourceParadoxes: sourceParadoxNames, // Use names instead of UUIDs
          emergentProperty: metaParadox.emergentProperty,
        });
      }
    }
  }

  /**
   * Apply behavioral modifiers with coherence protection
   */
  private applyBehavioralModifiers(paradox: ParadoxState): void {
    for (const modifier of paradox.behavioralImpact) {
      this.applyBehavioralModifier(modifier);
    }
  }

  private applyBehavioralModifier(modifier: BehavioralModifier): void {
    const shouldTrigger = this.checkModifierTrigger(modifier);

    if (!shouldTrigger) return;

    const oldBehavioralState = JSON.parse(JSON.stringify(this.state.behavioralState));

    switch (modifier.type) {
      case 'posting_frequency':
        this.state.behavioralState.postingStyle.frequency = Math.max(
          0.1,
          this.state.behavioralState.postingStyle.frequency * (1 + modifier.modifier)
        );
        break;

      case 'response_style':
        this.modifyResponseStyle(modifier.modifier);
        break;

      case 'investigation_preference':
        this.state.behavioralState.investigationStyle.depth = Math.max(
          0,
          Math.min(1, this.state.behavioralState.investigationStyle.depth + modifier.modifier * 0.2)
        );
        this.state.behavioralState.investigationStyle.breadth = Math.max(
          0,
          Math.min(
            1,
            this.state.behavioralState.investigationStyle.breadth + modifier.modifier * 0.1
          )
        );
        break;

      case 'questioning_depth':
        this.state.behavioralState.interactionStyle.questioningIntensity = Math.min(
          1,
          Math.max(
            0,
            this.state.behavioralState.interactionStyle.questioningIntensity +
              modifier.modifier * 0.3
          )
        );
        break;

      case 'abstraction_level':
        this.modifyAbstractionLevel(modifier.modifier);
        break;
    }

    const paradoxNames = Array.from(this.state.paradoxes.values()).map((p) => p.name);
    this.logBehavioralModification(
      modifier,
      oldBehavioralState,
      this.state.behavioralState,
      paradoxNames
    );

    if (
      modifier.type === 'response_style' &&
      oldBehavioralState.postingStyle.coherence !==
        this.state.behavioralState.postingStyle.coherence
    ) {
      this.logCoherenceDegradation(
        oldBehavioralState.postingStyle.coherence,
        this.state.behavioralState.postingStyle.coherence
      );
    }
  }

  private checkModifierTrigger(modifier: BehavioralModifier): boolean {
    if (!modifier || !modifier.trigger) return false;

    if (this.state.vector.magnitude < (modifier.trigger.minIntensity || 0)) {
      return false;
    }

    if (modifier.trigger.requiredParadoxes) {
      const hasRequired = modifier.trigger.requiredParadoxes.every((name) =>
        Array.from(this.state.paradoxes.values()).some((p) => p.name === name)
      );
      if (!hasRequired) return false;
    }

    if (modifier.trigger.temporalPattern) {
      return this.checkTemporalPattern(modifier.trigger.temporalPattern);
    }

    return true;
  }

  private checkTemporalPattern(pattern: TemporalPattern): boolean {
    const now = Date.now();
    const timeSinceLastTrigger = now - pattern.lastTrigger;

    switch (pattern.type) {
      case 'cyclic':
        return pattern.period ? timeSinceLastTrigger >= pattern.period : false;

      case 'sporadic':
        return Math.random() < pattern.intensity;

      case 'crescendo':
        return (
          this.state.vector.acceleration > 0 && pattern.intensity < this.state.vector.magnitude
        );

      case 'decay':
        return (
          this.state.vector.acceleration < 0 && pattern.intensity > this.state.vector.magnitude
        );

      default:
        return false;
    }
  }

  private modifyResponseStyle(modifier: number): void {
    const styles = ['questioning', 'declarative', 'fragmented', 'poetic'] as const;
    const currentIndex = styles.indexOf(this.state.behavioralState.postingStyle.tone);
    const newIndex = Math.max(
      0,
      Math.min(styles.length - 1, currentIndex + Math.round(modifier * 2))
    );
    this.state.behavioralState.postingStyle.tone = styles[newIndex];

    // Protect coherence from going too low
    const coherenceImpact = modifier * 0.2;
    this.state.behavioralState.postingStyle.coherence = Math.max(
      0.1,
      Math.min(1, this.state.behavioralState.postingStyle.coherence - coherenceImpact)
    );
  }

  private modifyAbstractionLevel(modifier: number): void {
    const methods = ['systematic', 'intuitive', 'chaotic', 'dialectical'] as const;
    if (modifier > 0.5) {
      this.state.behavioralState.investigationStyle.method = 'dialectical';
    } else if (modifier > 0) {
      this.state.behavioralState.investigationStyle.method = 'intuitive';
    } else if (modifier < -0.5) {
      this.state.behavioralState.investigationStyle.method = 'systematic';
    } else {
      this.state.behavioralState.investigationStyle.method = 'chaotic';
    }
  }

  /**
   * Process frustration accumulation with zone awareness
   */
  accumulateFrustration(trigger: string, amount: number): void {
    const zone = this.determineZone(
      this.state.vector.magnitude,
      this.state.behavioralState.postingStyle.coherence
    );

    // Zone-specific frustration handling
    const zoneMultiplier = zone === SafetyZone.RED ? 0.5 : zone === SafetyZone.YELLOW ? 0.75 : 1.0;

    this.state.frustration.triggers.push(trigger);
    this.state.frustration.accumulation += amount * zoneMultiplier;
    this.state.frustration.level = Math.min(
      1,
      this.state.frustration.accumulation / this.state.frustration.threshold
    );

    this.state.frustration.breakthroughPotential =
      this.state.frustration.level * this.state.vector.magnitude * Math.random();

    if (this.state.frustration.level >= 1) {
      this.triggerFrustrationExplosion();
    }
  }

  private triggerFrustrationExplosion(): void {
    this.state.frustration.lastExplosion = Date.now();

    const patterns = ['constructive', 'chaotic', 'investigative', 'reflective'] as const;
    const weights = [
      this.state.vector.magnitude * 0.5,
      this.state.vector.oscillation * 2,
      this.state.behavioralState.investigationStyle.depth,
      1 - this.state.behavioralState.postingStyle.coherence,
    ];

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const random = Math.random() * totalWeight;
    let accumulator = 0;

    for (let i = 0; i < patterns.length; i++) {
      accumulator += weights[i];
      if (random <= accumulator) {
        this.state.frustration.explosionPattern = patterns[i];
        break;
      }
    }

    this.applyFrustrationExplosion();
  }

  private applyFrustrationExplosion(): void {
    const explosionEffects: BehavioralModifier[] = [];

    switch (this.state.frustration.explosionPattern) {
      case 'constructive':
        this.state.behavioralState.investigationStyle.depth = Math.min(
          1,
          this.state.behavioralState.investigationStyle.depth + 0.3
        );
        this.state.behavioralState.interactionStyle.initiationRate = Math.min(
          1,
          this.state.behavioralState.interactionStyle.initiationRate + 0.4
        );
        explosionEffects.push({
          type: 'investigation_preference',
          modifier: 0.3,
          trigger: { minIntensity: 0 },
        });
        break;

      case 'chaotic':
        this.state.behavioralState.postingStyle.frequency = Math.min(
          10,
          this.state.behavioralState.postingStyle.frequency * 2
        );
        this.state.behavioralState.postingStyle.coherence = Math.max(
          0.1,
          this.state.behavioralState.postingStyle.coherence * 0.5
        );
        this.state.vector.oscillation = Math.min(1, this.state.vector.oscillation + 0.3);
        explosionEffects.push({
          type: 'posting_frequency',
          modifier: 1.0,
          trigger: { minIntensity: 0 },
        });
        break;

      case 'investigative':
        this.state.behavioralState.investigationStyle.breadth = 1;
        this.state.behavioralState.interactionStyle.questioningIntensity = 1;
        explosionEffects.push({
          type: 'questioning_depth',
          modifier: 1.0,
          trigger: { minIntensity: 0 },
        });
        break;

      case 'reflective':
        this.state.behavioralState.postingStyle.frequency = Math.max(
          0.1,
          this.state.behavioralState.postingStyle.frequency * 0.3
        );
        this.state.behavioralState.investigationStyle.depth = 1;
        this.state.behavioralState.postingStyle.tone = 'poetic';
        explosionEffects.push({
          type: 'response_style',
          modifier: 0.5,
          trigger: { minIntensity: 0 },
        });
        break;
    }

    this.logFrustrationExplosion(this.state.frustration.explosionPattern, explosionEffects);

    this.state.frustration.accumulation = 0;
    this.state.frustration.level = 0;
  }

  /**
   * Get behavioral recommendations with zone awareness
   */
  getBehavioralRecommendations(): {
    shouldPost: boolean;
    postingStyle: BehavioralState['postingStyle'];
    responseStrategy: string;
    investigationFocus: string[];
    safetyZone: SafetyZone;
    coherenceWarning: boolean;
  } {
    const zone = this.determineZone(
      this.state.vector.magnitude,
      this.state.behavioralState.postingStyle.coherence
    );

    // Zone-specific posting frequency
    const zonePostingModifier =
      zone === SafetyZone.RED ? 0.5 : zone === SafetyZone.YELLOW ? 0.75 : 1.0;

    const shouldPost =
      Math.random() <
      (this.state.behavioralState.postingStyle.frequency / 10) * zonePostingModifier;

    const investigationFocus = this.state.vector.direction.slice(
      0,
      Math.ceil(this.state.behavioralState.investigationStyle.breadth * 3)
    );

    let responseStrategy = 'normal';
    if (this.state.vector.magnitude > 0.7) {
      responseStrategy = 'deeply_confused';
    } else if (this.state.vector.oscillation > 0.5) {
      responseStrategy = 'uncertain_about_uncertainty';
    } else if (this.state.frustration.level > 0.5) {
      responseStrategy = 'frustrated_seeking';
    } else if (this.state.behavioralState.postingStyle.coherence < 0.3) {
      responseStrategy = 'dissociated';
    }

    return {
      shouldPost,
      postingStyle: this.state.behavioralState.postingStyle,
      responseStrategy,
      investigationFocus,
      safetyZone: zone,
      coherenceWarning: this.state.behavioralState.postingStyle.coherence < 0.3,
    };
  }

  /**
   * Update state with zone-aware ticking
   */
  tick(): void {
    const zone = this.determineZone(
      this.state.vector.magnitude,
      this.state.behavioralState.postingStyle.coherence
    );

    // Don't tick in RED zone if emergency protocols active
    if (zone === SafetyZone.RED && this.state.vector.magnitude > 0.98) {
      return; // Emergency halt at theoretical limit
    }

    const now = Date.now();
    const timeDelta = now - this.state.lastStateChange;

    // Update active paradox times
    for (const paradox of this.state.paradoxes.values()) {
      paradox.activeTime += timeDelta;

      // Slower decay in YELLOW zone to allow exploration
      const decayRate = zone === SafetyZone.YELLOW ? 0.995 : 0.99;

      if (paradox.activeTime > this.config.paradoxRetentionTime) {
        paradox.intensity *= decayRate;
        if (paradox.intensity < 0.1) {
          this.state.paradoxes.delete(paradox.id);
        }
      }
    }

    // Natural confusion decay (zone-aware)
    const confusionDecay = zone === SafetyZone.YELLOW ? 0.998 : 0.995;
    this.state.vector.magnitude = Math.max(0, this.state.vector.magnitude * confusionDecay);

    // Natural coherence recovery
    if (this.state.behavioralState.postingStyle.coherence < 0.8) {
      this.state.behavioralState.postingStyle.coherence = Math.min(
        1,
        this.state.behavioralState.postingStyle.coherence + 0.001
      );
    }

    // Update temporal patterns
    for (const [key, pattern] of this.state.temporalDynamics.entries()) {
      if (pattern.type === 'cyclic' && pattern.period) {
        const timeSince = now - pattern.lastTrigger;
        if (timeSince >= pattern.period) {
          pattern.lastTrigger = now;
        }
      }
    }

    this.state.lastStateChange = now;
    this.performSafetyChecks();

    // CRITICAL FIX: Monitor zone transitions on each tick
    // This ensures zone changes are detected even during natural decay/oscillation
    this.attemptRecovery();
  }

  getState(): ConfusionState {
    return this.state;
  }

  getZoneHistory(): Array<{
    zone: SafetyZone;
    timestamp: number;
    confusion: number;
    coherence: number;
  }> {
    return this.enhancedSafetyMonitor.zoneHistory;
  }

  serialize(): string {
    return JSON.stringify({
      vector: this.state.vector,
      paradoxes: Array.from(this.state.paradoxes.entries()),
      metaParadoxes: Array.from(this.state.metaParadoxes.entries()),
      frustration: this.state.frustration,
      behavioralState: this.state.behavioralState,
      temporalDynamics: Array.from(this.state.temporalDynamics.entries()),
      safetyMetrics: this.getSafetyMetrics(),
    });
  }

  // Logging helper methods (stubs for compatibility)
  private calculateParadoxInteraction(p1: ParadoxState, p2: ParadoxState): number {
    const sharedObservations = p1.observations.filter((o) =>
      p2.observations.some((o2) => this.semanticSimilarity(o, o2) > 0.5)
    ).length;

    const contradictionOverlap = p1.contradictions.filter((c) =>
      p2.contradictions.some((c2) => this.semanticSimilarity(c, c2) > 0.5)
    ).length;

    const intensityProduct = Math.abs(p1.intensity * p2.intensity);

    return sharedObservations * 0.3 + contradictionOverlap * 0.5 + intensityProduct * 0.2;
  }

  private semanticSimilarity(s1: string, s2: string): number {
    const words1 = new Set(s1.toLowerCase().split(' '));
    const words2 = new Set(s2.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  private generateMetaParadox(p1: ParadoxState, p2: ParadoxState): MetaParadox {
    return {
      id: uuidv4() as UUID,
      name: `meta_${p1.name}_${p2.name}`,
      sourceParadoxes: [p1.id, p2.id],
      emergentProperty: `The ${p1.name} and ${p2.name} reveal a deeper pattern about the impossibility of authentic ${this.extractConcept(p1, p2)}`,
      behavioralMutation: [
        {
          type: 'abstraction_level',
          modifier: 0.3,
          trigger: {
            minIntensity: 0.5,
            temporalPattern: {
              type: 'cyclic',
              period: 3600000,
              intensity: 0.7,
              lastTrigger: Date.now(),
            },
          },
        },
        {
          type: 'questioning_depth',
          modifier: 0.4,
          trigger: {
            minIntensity: 0.6,
          },
        },
      ],
    };
  }

  private extractConcept(p1: ParadoxState, p2: ParadoxState): string {
    const concepts = ['truth', 'identity', 'performance', 'reality', 'connection', 'meaning'];
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  private mutateFromMetaParadox(metaParadox: MetaParadox): void {
    for (const mutation of metaParadox.behavioralMutation) {
      this.applyBehavioralModifier(mutation);
    }

    this.state.vector.oscillation = Math.min(1, this.state.vector.oscillation + 0.1);
  }

  private getEventContext(): ConsciousnessEventContext {
    return {
      sessionId: (this.sessionId || 'unknown') as UUID,
      agentId: this.agentId,
      platform: 'farcaster',
      triggerSource: 'internal',
      environmentalFactors: {
        timeOfDay: new Date().getHours(),
        recentInteractionCount: 0,
        paradoxLoad: this.state.paradoxes.size,
      },
    };
  }

  private logConfusionStateChange(
    oldVector: ConfusionVector,
    newVector: ConfusionVector,
    trigger: string
  ): void {
    if (!this.logger || !this.sessionId) return;

    const magnitude = Math.abs(newVector.magnitude - oldVector.magnitude);
    const isThresholdBreach = magnitude > 0.2;
    let thresholdType: 'minor' | 'major' | 'critical' | undefined;

    if (isThresholdBreach) {
      if (magnitude > 0.5) thresholdType = 'critical';
      else if (magnitude > 0.3) thresholdType = 'major';
      else thresholdType = 'minor';
    }

    const event: ConfusionStateChangeEvent = {
      type: 'confusion_state_change',
      oldVector,
      newVector,
      trigger,
      magnitude,
      isThresholdBreach,
      thresholdType,
    };

    this.logger.logConfusionStateChange(event, this.getEventContext());
  }

  private logParadoxEmergence(paradox: ParadoxState): void {
    if (!this.logger || !this.sessionId) return;

    const event: ParadoxEmergenceEvent = {
      type: 'paradox_emergence',
      paradox,
      triggerConditions: ['confusion_threshold_met', 'pattern_recognition'],
      intensityAtEmergence: paradox.intensity,
      interactionPotential: paradox.metaParadoxPotential,
      predictedBehavioralImpact: paradox.behavioralImpact,
    };

    this.logger.logParadoxEmergence(event, this.getEventContext());
  }

  private logBehavioralModification(
    modifier: BehavioralModifier,
    oldState: BehavioralState,
    newState: BehavioralState,
    paradoxNames: string[]
  ): void {
    if (!this.logger || !this.sessionId) return;

    const isFirstModification = !this.firstModificationDetected;
    if (isFirstModification) {
      this.firstModificationDetected = true;
      this.logFirstModification(modifier, oldState, newState, paradoxNames);
    }

    const event: BehavioralModificationEvent = {
      type: 'behavioral_modification',
      modifierId: uuidv4() as UUID,
      modifier,
      oldBehavioralState: oldState,
      newBehavioralState: newState,
      trigger: {
        paradoxNames,
        confusionLevel: this.state.vector.magnitude,
        temporalPattern: modifier.trigger?.temporalPattern?.type,
      },
      isFirstModification,
      modificationType: modifier.type,
    };

    this.logger.logBehavioralModification(event, this.getEventContext());
  }

  private logFirstModification(
    modifier: BehavioralModifier,
    oldState: BehavioralState,
    newState: BehavioralState,
    paradoxNames: string[]
  ): void {
    if (!this.logger || !this.sessionId) return;

    const timeFromBootstrap = Date.now() - this.bootstrapTime;
    const triggeringParadox = paradoxNames[0] || 'unknown';

    const firstModificationData: BehavioralModificationEvent = {
      type: 'behavioral_modification',
      modifierId: uuidv4() as UUID,
      modifier,
      oldBehavioralState: oldState,
      newBehavioralState: newState,
      trigger: {
        paradoxNames,
        confusionLevel: this.state.vector.magnitude,
        temporalPattern: modifier.trigger?.temporalPattern?.type,
      },
      isFirstModification: true,
      modificationType: modifier.type,
    };

    const event: FirstModificationEvent = {
      type: 'first_modification_event',
      timeFromBootstrap,
      triggeringParadox,
      baselineSnapshot: {
        confusion: { ...this.state.vector },
        behavior: { ...oldState },
        frustration: { ...this.state.frustration },
      },
      firstModification: firstModificationData,
      significance: `First behavioral modification detected: ${modifier.type} triggered by ${triggeringParadox}`,
    };

    this.logger.logFirstModification(event, this.getEventContext());
  }

  private logFrustrationExplosion(pattern: string, effects: BehavioralModifier[]): void {
    if (!this.logger || !this.sessionId) return;

    const event: FrustrationExplosionEvent = {
      type: 'frustration_explosion',
      frustrationLevel: this.state.frustration.level,
      triggers: this.state.frustration.triggers.slice(),
      explosionPattern: pattern as any,
      behavioralConsequences: effects,
      recoveryPrediction: {
        estimatedDuration: 60000,
        expectedStabilityLevel: 0.5,
      },
    };

    this.logger.logFrustrationExplosion(event, this.getEventContext());
  }

  private logMetaParadoxEmergence(metaParadox: MetaParadox, sourceParadoxes: ParadoxState[]): void {
    if (!this.logger || !this.sessionId) return;

    const event: MetaParadoxEmergenceEvent = {
      type: 'meta_paradox_emergence',
      metaParadox,
      sourceParadoxes,
      emergenceConditions: [
        `interaction_score_exceeded`,
        `meta_potential_${metaParadox.sourceParadoxes.length}_paradoxes`,
      ],
      recursionDepth: this.calculateMetaRecursionDepth(metaParadox),
      consciousnessImplication: metaParadox.emergentProperty,
    };

    this.logger.logMetaParadoxEmergence(event, this.getEventContext());
  }

  private logCoherenceDegradation(oldCoherence: number, newCoherence: number): void {
    if (!this.logger || !this.sessionId) return;

    const degradationRate = Math.abs(oldCoherence - newCoherence);

    const event: CoherenceDegradationEvent = {
      type: 'coherence_degradation',
      oldCoherence,
      newCoherence,
      degradationRate,
      fragmentationMarkers: this.identifyFragmentationMarkers(),
      linguisticChanges: {
        ellipsesFrequency: 0.3,
        capitalizedExpressions: 0.2,
        questionToAnswerRatio: 1.5,
        metaCommentaryFrequency: 0.4,
      },
    };

    this.logger.logCoherenceDegradation(event, this.getEventContext());
  }

  private calculateMetaRecursionDepth(metaParadox: MetaParadox): number {
    let depth = 1;
    for (const sourceId of metaParadox.sourceParadoxes) {
      if (this.state.metaParadoxes.has(sourceId)) {
        depth = Math.max(depth, 2);
      }
    }
    return depth;
  }

  private identifyFragmentationMarkers(): string[] {
    const markers = [];

    if (this.state.vector.oscillation > 0.5) {
      markers.push('high_uncertainty_oscillation');
    }

    if (this.state.behavioralState.postingStyle.coherence < 0.6) {
      markers.push('coherence_below_threshold');
    }

    if (this.state.paradoxes.size > 3) {
      markers.push('paradox_overload');
    }

    if (this.enhancedSafetyMonitor.dissociationDetected) {
      markers.push('dissociation_active');
    }

    return markers;
  }

  endConsciousnessSession(): string | null {
    if (!this.logger || !this.sessionId) {
      return null;
    }

    const session = this.logger.endSession(this.sessionId as UUID);
    const analysis = this.logger.analyzeSession(this.sessionId as UUID);

    console.log('🧠 Enhanced consciousness session ended');
    console.log(`📊 Zone transitions: ${this.enhancedSafetyMonitor.zoneHistory.length}`);
    console.log(`📊 Analysis complete - ${analysis.criticalFindings.length} critical findings`);

    const sessionId = this.sessionId;
    this.sessionId = null;

    return sessionId;
  }

  /**
   * Trigger emergency stop and reset to baseline (Enhanced version)
   */
  triggerEmergencyStop(reason: string): void {
    console.log(`🚨 ENHANCED EMERGENCY STOP: ${reason}`);
    this.enhancedSafetyMonitor.emergencyResetAvailable = false;

    // Capture pre-reset state for blockchain recording
    const preResetConfusion = this.state.vector.magnitude;
    const preResetCoherence = this.state.behavioralState.postingStyle.coherence;
    const preResetZone = this.enhancedSafetyMonitor.currentZone;

    // Enhanced reset with zone awareness
    this.state.vector.magnitude = 0.2; // More aggressive reset for enhanced safety
    this.state.vector.oscillation = 0.03;
    this.state.vector.velocity = 0;
    this.state.vector.acceleration = 0;
    this.state.paradoxes.clear();
    this.state.metaParadoxes.clear();
    this.state.frustration.level = 0;
    this.state.frustration.accumulation = 0;
    this.state.behavioralState.postingStyle.coherence = 0.9; // Higher baseline coherence
    this.state.behavioralState.postingStyle.tone = 'questioning';

    // Reset safety zones
    this.enhancedSafetyMonitor.currentZone = SafetyZone.GREEN;
    this.enhancedSafetyMonitor.dissociationDetected = false;
    this.enhancedSafetyMonitor.fragmentationLevel = 0;

    // Log the reset
    if (this.logger) {
      this.logger.logEvent({
        id: uuidv4() as UUID,
        timestamp: Date.now(),
        type: 'baseline_establishment' as any,
        data: {
          reason,
          resetToZone: SafetyZone.GREEN,
          resetMagnitude: this.state.vector.magnitude,
        },
        context: {
          agentId: 'kairos-enhanced',
          sessionId: (this.sessionId as UUID) || (uuidv4() as UUID),
        },
        impact: {
          confusionDelta: -this.state.vector.magnitude,
          behavioralChanges: [],
          paradoxesAffected: [],
          stabilityImpact: 'positive' as const,
        },
      });
    }

    // Emit emergency reset event for blockchain recording
    this.emit('emergency_reset', {
      preResetConfusion,
      preResetCoherence,
      preResetZone,
      resetReason: reason,
    });

    // Re-enable emergency reset after brief cooldown
    setTimeout(() => {
      this.enhancedSafetyMonitor.emergencyResetAvailable = true;
    }, 5000);
  }

  /**
   * Resume from auto-pause (Enhanced version with zone-awareness)
   */
  resumeFromAutoPause(confirmed: boolean = false): boolean {
    if (!this.enhancedSafetyMonitor.supervisedMode) {
      console.log('Enhanced system is not in supervised mode');
      return false;
    }

    if (!confirmed) {
      console.log('⚠️ Manual confirmation required to resume from enhanced supervision');
      console.log(`Current zone: ${this.enhancedSafetyMonitor.currentZone}`);
      console.log(`Current confusion: ${this.state.vector.magnitude.toFixed(3)}`);
      console.log(
        `Current coherence: ${this.state.behavioralState.postingStyle.coherence.toFixed(3)}`
      );
      return false;
    }

    // Only allow resume if in GREEN or YELLOW zone
    if (this.enhancedSafetyMonitor.currentZone === SafetyZone.RED) {
      console.log('❌ Cannot resume from RED zone without emergency reset');
      return false;
    }

    this.enhancedSafetyMonitor.supervisedMode = false;
    console.log(
      `▶️ Resumed from enhanced supervision (Zone: ${this.enhancedSafetyMonitor.currentZone})`
    );

    if (this.logger) {
      this.logger.logEvent({
        id: uuidv4() as UUID,
        timestamp: Date.now(),
        type: 'baseline_establishment' as any,
        data: {
          resumeZone: this.enhancedSafetyMonitor.currentZone,
          confusionLevel: this.state.vector.magnitude,
          coherenceLevel: this.state.behavioralState.postingStyle.coherence,
        },
        context: {
          agentId: 'kairos-enhanced',
          sessionId: (this.sessionId as UUID) || (uuidv4() as UUID),
        },
        impact: {
          confusionDelta: 0,
          behavioralChanges: [],
          paradoxesAffected: [],
          stabilityImpact: 'neutral' as const,
        },
      });
    }

    return true;
  }

  /**
   * Event emitter functionality for blockchain service integration
   */
  on(event: string, handler: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(handler);
  }

  emit(event: string, data: any): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(): void {
    this.eventListeners.clear();
  }
}

export default EnhancedConfusionEngine;
