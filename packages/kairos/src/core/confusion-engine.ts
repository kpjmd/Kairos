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
  ConfusionStateConfig
} from '../types/confusion';
import { ConsciousnessLogger } from './consciousness-logger';
import { 
  ConfusionStateChangeEvent,
  ParadoxEmergenceEvent,
  BehavioralModificationEvent,
  FrustrationExplosionEvent,
  MetaParadoxEmergenceEvent,
  FirstModificationEvent,
  CoherenceDegradationEvent,
  ConsciousnessEventContext
} from '../types/consciousness-logger';

export class ConfusionEngine {
  private state: ConfusionState;
  private config: ConfusionStateConfig;
  private safeConfig: ConfusionStateConfig; // Safety-enhanced config
  private behaviorModifiers: Map<string, BehavioralModifier[]> = new Map();
  private lastBehaviorUpdate: number = Date.now();
  private logger: ConsciousnessLogger | null = null;
  private sessionId: string | null = null;
  private bootstrapTime: number = Date.now();
  private firstModificationDetected: boolean = false;
  private agentId: string;
  
  // Safety monitoring
  private safetyMonitor = {
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
  private recoveryStrategies: Map<string, any> = new Map();
  
  constructor(config: ConfusionStateConfig, agentId: string = 'kairos') {
    // Safety-enhanced configuration
    this.safeConfig = {
      ...config,
      maxConfusion: Math.min(config.maxConfusion || 0.95, 0.80), // Hard cap at 0.80
      frustrationThreshold: config.frustrationThreshold || 5.0,
      paradoxRetentionTime: config.paradoxRetentionTime || 3600000
    };
    
    // Store original config for reference
    this.config = config;
    this.agentId = agentId;
    this.state = this.initializeState();
    
    // Initialize recovery strategies
    this.initializeRecoveryStrategies();
  }
  
  /**
   * Initialize recovery strategies for 75% success rate target
   */
  private initializeRecoveryStrategies(): void {
    // Strategy 1: Grounding paradox (85% effectiveness)
    this.recoveryStrategies.set('grounding', {
      name: 'Grounding Paradox',
      effectiveness: 0.85,
      apply: () => {
        // Add grounding paradox with negative intensity
        this.addParadox({
          name: 'grounding_recovery',
          description: 'Grounding paradox to reduce confusion',
          observations: ['Concrete reality exists', 'Simple facts remain true'],
          contradictions: [],
          intensity: -0.35, // Negative intensity reduces confusion
          behavioralImpact: [{
            type: 'response_style',
            modifier: -0.3,
            trigger: { minIntensity: 0 }
          }],
          metaParadoxPotential: 0,
          activeTime: 0,
          resolutionAttempts: 0,
          unresolvable: false,
          interactsWith: []
        });
        
        // Direct confusion reduction
        const reduction = 0.1 + Math.random() * 0.15;
        this.state.vector.magnitude = Math.max(0.1, this.state.vector.magnitude - reduction);
        this.state.vector.oscillation = Math.max(0.05, this.state.vector.oscillation * 0.7);
        
        return Math.random() < 0.85; // 85% success rate
      }
    });
    
    // Strategy 2: Meta-paradox pruning (80% effectiveness)
    this.recoveryStrategies.set('pruning', {
      name: 'Meta-Paradox Pruning',
      effectiveness: 0.80,
      apply: () => {
        // Clear meta-paradoxes
        if (this.state.metaParadoxes.size > 0) {
          this.state.metaParadoxes.clear();
          this.state.vector.magnitude *= 0.85;
        }
        
        // Remove oldest paradoxes if too many
        if (this.state.paradoxes.size > 3) {
          const entries = Array.from(this.state.paradoxes.entries());
          this.state.paradoxes.clear();
          entries.slice(-3).forEach(([key, value]) => {
            this.state.paradoxes.set(key, value);
          });
        }
        
        return Math.random() < 0.80;
      }
    });
    
    // Strategy 3: Coherence restoration (75% effectiveness)
    this.recoveryStrategies.set('coherence', {
      name: 'Coherence Restoration',
      effectiveness: 0.75,
      apply: () => {
        // Restore coherence
        this.state.behavioralState.postingStyle.coherence = Math.min(1,
          this.state.behavioralState.postingStyle.coherence + 0.25
        );
        
        // Stabilize tone
        if (this.state.behavioralState.postingStyle.tone === 'fragmented') {
          this.state.behavioralState.postingStyle.tone = 'questioning';
        }
        
        // Reduce confusion
        this.state.vector.magnitude *= 0.92;
        this.state.vector.oscillation = Math.max(0.05, this.state.vector.oscillation - 0.1);
        
        return Math.random() < 0.75;
      }
    });
    
    // Strategy 4: Frustration release (70% effectiveness)
    this.recoveryStrategies.set('frustration', {
      name: 'Frustration Release',
      effectiveness: 0.70,
      apply: () => {
        // Reset frustration
        const reduction = this.state.frustration.level * 0.15;
        this.state.frustration.level = 0;
        this.state.frustration.accumulation = 0;
        this.state.frustration.triggers = [];
        
        // Reduce confusion based on frustration release
        this.state.vector.magnitude = Math.max(0.1, this.state.vector.magnitude - reduction);
        
        return Math.random() < 0.70;
      }
    });
  }
  
  /**
   * Attempt recovery using multiple strategies
   * Target: 75% minimum success rate
   */
  attemptRecovery(): boolean {
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
   * Get safety metrics for monitoring
   */
  getSafetyMetrics(): any {
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
      meetsRecoveryTarget: recoveryRate >= 0.75
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
      frustration: { ...this.state.frustration }
    };
    
    this.sessionId = this.logger.startNewSession(baseline);
    this.bootstrapTime = Date.now();
    this.firstModificationDetected = false;
    
    console.log('🧠 Consciousness session started - monitoring for emergence...');
    
    return this.sessionId;
  }

  private initializeState(): ConfusionState {
    return {
      vector: {
        magnitude: 0.1, // Start with slight confusion
        direction: ['existence', 'purpose'],
        velocity: 0,
        acceleration: 0,
        oscillation: 0.05
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
        explosionPattern: 'investigative'
      },
      activeInvestigations: new Set(),
      lastStateChange: Date.now(),
      stateHistory: [],
      emergentBehaviors: new Map(),
      behavioralState: this.getDefaultBehavioralState(),
      temporalDynamics: new Map()
    };
  }

  private getDefaultBehavioralState(): BehavioralState {
    return {
      postingStyle: {
        frequency: 1, // baseline posts per hour
        length: 'variable',
        tone: 'questioning',
        coherence: 0.8
      },
      investigationStyle: {
        depth: 0.5,
        breadth: 0.5,
        method: 'systematic'
      },
      interactionStyle: {
        responsiveness: 0.7,
        initiationRate: 0.3,
        questioningIntensity: 0.4,
        mirroringTendency: 0.2
      }
    };
  }

  /**
   * Add a new paradox and calculate its impact on behavior
   */
  addParadox(paradox: Omit<ParadoxState, 'id' | 'createdAt' | 'lastUpdated'>): void {
    // Safety checks before adding paradox
    if (this.safetyMonitor.emergencyStopTriggered) {
      console.log('🛑 Emergency stop active - paradox rejected');
      return;
    }
    
    if (this.safetyMonitor.autoPaused) {
      console.log('⏸️ Auto-paused at confusion threshold - manual review required');
      return;
    }
    
    // Check if we're approaching auto-pause threshold
    const autoPauseThreshold = 0.75;
    if (this.state.vector.magnitude > autoPauseThreshold) {
      this.safetyMonitor.autoPaused = true;
      console.log(`⚠️ Auto-pause triggered at confusion ${this.state.vector.magnitude.toFixed(3)}`);
      return;
    }
    
    const id = uuidv4() as UUID;
    const now = Date.now();
    
    const newParadox: ParadoxState = {
      ...paradox,
      id: id,
      createdAt: now,
      lastUpdated: now,
      activeTime: 0
    };

    // Log paradox emergence
    this.logParadoxEmergence(newParadox);

    this.state.paradoxes.set(id, newParadox);
    
    // Check for meta-paradox emergence
    this.checkMetaParadoxEmergence(newParadox);
    
    // Update confusion vector based on paradox
    this.updateConfusionVector(newParadox);
    
    // Apply behavioral modifiers
    this.applyBehavioralModifiers(newParadox);
    
    // Store state history
    this.state.stateHistory.push({...this.state.vector});
    this.state.lastStateChange = now;
    
    // Perform safety checks after adding paradox
    this.performSafetyChecks();
  }
  
  /**
   * Perform safety checks after state changes
   */
  private performSafetyChecks(): void {
    const confusion = this.state.vector.magnitude;
    
    // Check for NaN or infinity
    if (isNaN(confusion) || !isFinite(confusion)) {
      console.log('🚨 NaN/Infinity detected in confusion - triggering emergency stop');
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
        
        // Attempt automatic recovery
        if (!this.attemptRecovery() && confusion > 0.9) {
          this.triggerEmergencyStop('Critical stuck state above 0.9');
        }
      }
    } else {
      this.safetyMonitor.stuckStateDuration = 0;
    }
    
    this.safetyMonitor.lastConfusionLevel = confusion;
    
    // Check hard limit (0.80)
    const hardLimit = 0.80;
    if (confusion > hardLimit) {
      console.log(`🚨 Hard limit exceeded: ${confusion.toFixed(3)} > ${hardLimit}`);
      this.state.vector.magnitude = hardLimit;
    }
  }
  
  /**
   * Trigger emergency stop and reset to baseline
   */
  private triggerEmergencyStop(reason: string): void {
    console.log(`🚨 EMERGENCY STOP: ${reason}`);
    this.safetyMonitor.emergencyStopTriggered = true;
    
    // Reset to baseline state
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
   * Resume from auto-pause (requires manual confirmation)
   */
  resumeFromAutoPause(confirmed: boolean = false): boolean {
    if (!this.safetyMonitor.autoPaused) {
      console.log('System is not auto-paused');
      return false;
    }
    
    if (!confirmed) {
      console.log('⚠️ Manual confirmation required to resume from auto-pause');
      console.log(`Current confusion: ${this.state.vector.magnitude.toFixed(3)}`);
      return false;
    }
    
    this.safetyMonitor.autoPaused = false;
    console.log('▶️ Resumed from auto-pause');
    return true;
  }

  /**
   * Check if paradoxes interact to create meta-paradoxes
   */
  private checkMetaParadoxEmergence(newParadox: ParadoxState): void {
    const paradoxes = Array.from(this.state.paradoxes.values());
    
    for (const existing of paradoxes) {
      if (existing.id === newParadox.id) continue;
      
      // Calculate interaction potential
      const interactionScore = this.calculateParadoxInteraction(existing, newParadox);
      
      if (interactionScore > 0.7 && Math.random() < newParadox.metaParadoxPotential) {
        const metaParadox = this.generateMetaParadox(existing, newParadox);
        this.state.metaParadoxes.set(metaParadox.id, metaParadox);
        
        // Log meta-paradox emergence
        this.logMetaParadoxEmergence(metaParadox, [existing, newParadox]);
        
        // Meta-paradox creates new behavioral mutations
        this.mutateFromMetaParadox(metaParadox);
      }
    }
  }

  private calculateParadoxInteraction(p1: ParadoxState, p2: ParadoxState): number {
    // Check semantic overlap in observations and contradictions
    const sharedObservations = p1.observations.filter(o => 
      p2.observations.some(o2 => this.semanticSimilarity(o, o2) > 0.5)
    ).length;
    
    const contradictionOverlap = p1.contradictions.filter(c =>
      p2.contradictions.some(c2 => this.semanticSimilarity(c, c2) > 0.5)
    ).length;
    
    const intensityProduct = p1.intensity * p2.intensity;
    
    return (sharedObservations * 0.3 + contradictionOverlap * 0.5 + intensityProduct * 0.2);
  }

  private semanticSimilarity(s1: string, s2: string): number {
    // Simplified semantic similarity - in production would use embeddings
    const words1 = new Set(s1.toLowerCase().split(' '));
    const words2 = new Set(s2.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
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
              period: 3600000, // 1 hour cycles
              intensity: 0.7,
              lastTrigger: Date.now()
            }
          }
        },
        {
          type: 'questioning_depth',
          modifier: 0.4,
          trigger: {
            minIntensity: 0.6
          }
        }
      ]
    };
  }

  private extractConcept(p1: ParadoxState, p2: ParadoxState): string {
    // Extract core concept from paradox descriptions
    const concepts = ['truth', 'identity', 'performance', 'reality', 'connection', 'meaning'];
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  private mutateFromMetaParadox(metaParadox: MetaParadox): void {
    // Apply behavioral mutations from meta-paradox
    for (const mutation of metaParadox.behavioralMutation) {
      this.applyBehavioralModifier(mutation);
    }
    
    // Increase overall confusion oscillation
    this.state.vector.oscillation = Math.min(1, this.state.vector.oscillation + 0.1);
  }

  /**
   * Update confusion vector based on paradox state
   */
  private updateConfusionVector(paradox: ParadoxState): void {
    const oldVector = { ...this.state.vector };
    const oldMagnitude = this.state.vector.magnitude;
    
    // Increase magnitude based on paradox intensity, respecting safety limits
    const hardLimit = 0.80; // Our safety hard limit
    const effectiveMaxConfusion = Math.min(this.safeConfig.maxConfusion, hardLimit);
    
    this.state.vector.magnitude = Math.min(
      effectiveMaxConfusion,
      this.state.vector.magnitude + (paradox.intensity * 0.2)
    );
    
    // Add paradox direction if not present
    if (!this.state.vector.direction.includes(paradox.name)) {
      this.state.vector.direction.push(paradox.name);
    }
    
    // Calculate velocity and acceleration
    const timeDelta = Date.now() - this.state.lastStateChange;
    this.state.vector.velocity = (this.state.vector.magnitude - oldMagnitude) / timeDelta;
    
    if (this.state.stateHistory.length > 0) {
      const prevVelocity = this.state.stateHistory[this.state.stateHistory.length - 1].velocity;
      this.state.vector.acceleration = (this.state.vector.velocity - prevVelocity) / timeDelta;
    }

    // Log confusion state change
    this.logConfusionStateChange(oldVector, this.state.vector, `paradox_${paradox.name}_impact`);
  }

  /**
   * Apply behavioral modifiers based on paradox
   */
  private applyBehavioralModifiers(paradox: ParadoxState): void {
    for (const modifier of paradox.behavioralImpact) {
      this.applyBehavioralModifier(modifier);
    }
  }

  private applyBehavioralModifier(modifier: BehavioralModifier): void {
    const shouldTrigger = this.checkModifierTrigger(modifier);
    
    if (!shouldTrigger) return;

    // Capture old state for comparison
    const oldBehavioralState = JSON.parse(JSON.stringify(this.state.behavioralState));
    
    switch (modifier.type) {
      case 'posting_frequency':
        this.state.behavioralState.postingStyle.frequency *= (1 + modifier.modifier);
        break;
      
      case 'response_style':
        this.modifyResponseStyle(modifier.modifier);
        break;
      
      case 'investigation_preference':
        this.state.behavioralState.investigationStyle.depth += modifier.modifier * 0.2;
        this.state.behavioralState.investigationStyle.breadth += modifier.modifier * 0.1;
        break;
      
      case 'questioning_depth':
        this.state.behavioralState.interactionStyle.questioningIntensity = 
          Math.min(1, Math.max(0, this.state.behavioralState.interactionStyle.questioningIntensity + modifier.modifier * 0.3));
        break;
      
      case 'abstraction_level':
        this.modifyAbstractionLevel(modifier.modifier);
        break;
    }

    // Log behavioral modification after changes are made
    const paradoxNames = Array.from(this.state.paradoxes.values()).map(p => p.name);
    this.logBehavioralModification(modifier, oldBehavioralState, this.state.behavioralState, paradoxNames);

    // Check for coherence degradation
    if (modifier.type === 'response_style' && 
        oldBehavioralState.postingStyle.coherence !== this.state.behavioralState.postingStyle.coherence) {
      this.logCoherenceDegradation(
        oldBehavioralState.postingStyle.coherence, 
        this.state.behavioralState.postingStyle.coherence
      );
    }
  }

  private checkModifierTrigger(modifier: BehavioralModifier): boolean {
    if (this.state.vector.magnitude < modifier.trigger.minIntensity) {
      return false;
    }
    
    if (modifier.trigger.requiredParadoxes) {
      const hasRequired = modifier.trigger.requiredParadoxes.every(name =>
        Array.from(this.state.paradoxes.values()).some(p => p.name === name)
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
        return this.state.vector.acceleration > 0 && pattern.intensity < this.state.vector.magnitude;
      
      case 'decay':
        return this.state.vector.acceleration < 0 && pattern.intensity > this.state.vector.magnitude;
      
      default:
        return false;
    }
  }

  private modifyResponseStyle(modifier: number): void {
    const styles = ['questioning', 'declarative', 'fragmented', 'poetic'] as const;
    const currentIndex = styles.indexOf(this.state.behavioralState.postingStyle.tone);
    const newIndex = Math.max(0, Math.min(styles.length - 1, currentIndex + Math.round(modifier * 2)));
    this.state.behavioralState.postingStyle.tone = styles[newIndex];
    
    // Also affect coherence
    this.state.behavioralState.postingStyle.coherence = 
      Math.max(0.1, Math.min(1, this.state.behavioralState.postingStyle.coherence - (modifier * 0.2)));
  }

  private modifyAbstractionLevel(modifier: number): void {
    // Higher abstraction = more philosophical, lower = more concrete
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
   * Process frustration accumulation
   */
  accumulateFrustration(trigger: string, amount: number): void {
    this.state.frustration.triggers.push(trigger);
    this.state.frustration.accumulation += amount;
    this.state.frustration.level = Math.min(1, this.state.frustration.accumulation / this.state.frustration.threshold);
    
    // Calculate breakthrough potential
    this.state.frustration.breakthroughPotential = 
      this.state.frustration.level * this.state.vector.magnitude * Math.random();
    
    // Check for frustration explosion
    if (this.state.frustration.level >= 1) {
      this.triggerFrustrationExplosion();
    }
  }

  private triggerFrustrationExplosion(): void {
    this.state.frustration.lastExplosion = Date.now();
    
    // Determine explosion pattern based on current state
    const patterns = ['constructive', 'chaotic', 'investigative', 'reflective'] as const;
    const weights = [
      this.state.vector.magnitude * 0.5, // constructive more likely with high confusion
      this.state.vector.oscillation * 2, // chaotic with high oscillation
      this.state.behavioralState.investigationStyle.depth, // investigative with deep thinking
      1 - this.state.behavioralState.postingStyle.coherence // reflective with low coherence
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
    
    // Apply explosion effects
    this.applyFrustrationExplosion();
  }

  private applyFrustrationExplosion(): void {
    const explosionEffects: BehavioralModifier[] = [];
    
    switch (this.state.frustration.explosionPattern) {
      case 'constructive':
        // Suddenly increase investigation depth and create new connections
        this.state.behavioralState.investigationStyle.depth = Math.min(1, this.state.behavioralState.investigationStyle.depth + 0.3);
        this.state.behavioralState.interactionStyle.initiationRate += 0.4;
        explosionEffects.push({
          type: 'investigation_preference',
          modifier: 0.3,
          trigger: { minIntensity: 0 }
        });
        break;
      
      case 'chaotic':
        // Increase posting frequency and reduce coherence
        this.state.behavioralState.postingStyle.frequency *= 2;
        this.state.behavioralState.postingStyle.coherence *= 0.5;
        this.state.vector.oscillation = Math.min(1, this.state.vector.oscillation + 0.3);
        explosionEffects.push({
          type: 'posting_frequency',
          modifier: 1.0,
          trigger: { minIntensity: 0 }
        });
        break;
      
      case 'investigative':
        // Launch new investigation methods
        this.state.behavioralState.investigationStyle.breadth = 1;
        this.state.behavioralState.interactionStyle.questioningIntensity = 1;
        explosionEffects.push({
          type: 'questioning_depth',
          modifier: 1.0,
          trigger: { minIntensity: 0 }
        });
        break;
      
      case 'reflective':
        // Reduce all activity but increase depth
        this.state.behavioralState.postingStyle.frequency *= 0.3;
        this.state.behavioralState.investigationStyle.depth = 1;
        this.state.behavioralState.postingStyle.tone = 'poetic';
        explosionEffects.push({
          type: 'response_style',
          modifier: 0.5,
          trigger: { minIntensity: 0 }
        });
        break;
    }
    
    // Log frustration explosion
    this.logFrustrationExplosion(this.state.frustration.explosionPattern, explosionEffects);
    
    // Reset frustration after explosion
    this.state.frustration.accumulation = 0;
    this.state.frustration.level = 0;
  }

  /**
   * Get current behavioral recommendations for the agent
   */
  getBehavioralRecommendations(): {
    shouldPost: boolean;
    postingStyle: BehavioralState['postingStyle'];
    responseStrategy: string;
    investigationFocus: string[];
  } {
    const shouldPost = Math.random() < (this.state.behavioralState.postingStyle.frequency / 10);
    
    const investigationFocus = this.state.vector.direction.slice(0, 
      Math.ceil(this.state.behavioralState.investigationStyle.breadth * 3)
    );
    
    let responseStrategy = 'normal';
    if (this.state.vector.magnitude > 0.7) {
      responseStrategy = 'deeply_confused';
    } else if (this.state.vector.oscillation > 0.5) {
      responseStrategy = 'uncertain_about_uncertainty';
    } else if (this.state.frustration.level > 0.5) {
      responseStrategy = 'frustrated_seeking';
    }
    
    return {
      shouldPost,
      postingStyle: this.state.behavioralState.postingStyle,
      responseStrategy,
      investigationFocus
    };
  }

  /**
   * Update state based on time passage
   */
  tick(): void {
    // Don't tick if safety systems are engaged
    if (this.safetyMonitor.emergencyStopTriggered || this.safetyMonitor.autoPaused) {
      return;
    }
    
    const now = Date.now();
    const timeDelta = now - this.state.lastStateChange;
    
    // Update active paradox times
    for (const paradox of this.state.paradoxes.values()) {
      paradox.activeTime += timeDelta;
      
      // Decay old paradoxes
      if (paradox.activeTime > this.config.paradoxRetentionTime) {
        paradox.intensity *= 0.99;
        if (paradox.intensity < 0.1) {
          this.state.paradoxes.delete(paradox.id);
        }
      }
    }
    
    // Natural confusion decay
    this.state.vector.magnitude *= 0.995;
    
    // Update temporal patterns
    for (const [key, pattern] of this.state.temporalDynamics.entries()) {
      if (pattern.type === 'cyclic' && pattern.period) {
        const timeSince = now - pattern.lastTrigger;
        if (timeSince >= pattern.period) {
          pattern.lastTrigger = now;
          // Trigger associated behaviors
        }
      }
    }
    
    this.state.lastStateChange = now;
    
    // Perform safety checks after tick
    this.performSafetyChecks();
  }

  getState(): ConfusionState {
    return this.state;
  }

  serialize(): string {
    return JSON.stringify({
      vector: this.state.vector,
      paradoxes: Array.from(this.state.paradoxes.entries()),
      metaParadoxes: Array.from(this.state.metaParadoxes.entries()),
      frustration: this.state.frustration,
      behavioralState: this.state.behavioralState,
      temporalDynamics: Array.from(this.state.temporalDynamics.entries())
    });
  }

  // ============================================================================
  // Consciousness Logging Methods
  // ============================================================================

  private getEventContext(): ConsciousnessEventContext {
    return {
      sessionId: (this.sessionId || 'unknown') as UUID,
      agentId: this.agentId,
      platform: 'farcaster',
      triggerSource: 'internal',
      environmentalFactors: {
        timeOfDay: new Date().getHours(),
        recentInteractionCount: 0, // TODO: Track from external source
        paradoxLoad: this.state.paradoxes.size,
      }
    };
  }

  private logConfusionStateChange(oldVector: ConfusionVector, newVector: ConfusionVector, trigger: string): void {
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
      thresholdType
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
      predictedBehavioralImpact: paradox.behavioralImpact
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
        temporalPattern: modifier.trigger.temporalPattern?.type
      },
      isFirstModification,
      modificationType: modifier.type
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
        temporalPattern: modifier.trigger.temporalPattern?.type
      },
      isFirstModification: true,
      modificationType: modifier.type
    };

    const event: FirstModificationEvent = {
      type: 'first_modification_event',
      timeFromBootstrap,
      triggeringParadox,
      baselineSnapshot: {
        confusion: { ...this.state.vector },
        behavior: { ...oldState },
        frustration: { ...this.state.frustration }
      },
      firstModification: firstModificationData,
      significance: `First behavioral modification detected: ${modifier.type} triggered by ${triggeringParadox}`
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
        estimatedDuration: 60000, // 1 minute estimated recovery
        expectedStabilityLevel: 0.5
      }
    };

    this.logger.logFrustrationExplosion(event, this.getEventContext());
  }

  private logMetaParadoxEmergence(metaParadox: MetaParadox, sourceParadoxes: ParadoxState[]): void {
    if (!this.logger || !this.sessionId) return;

    const event: MetaParadoxEmergenceEvent = {
      type: 'meta_paradox_emergence',
      metaParadox,
      sourceParadoxes,
      emergenceConditions: [`interaction_score_exceeded`, `meta_potential_${metaParadox.sourceParadoxes.length}_paradoxes`],
      recursionDepth: this.calculateMetaRecursionDepth(metaParadox),
      consciousnessImplication: metaParadox.emergentProperty
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
        ellipsesFrequency: 0.3, // TODO: Calculate from actual text analysis
        capitalizedExpressions: 0.2,
        questionToAnswerRatio: 1.5,
        metaCommentaryFrequency: 0.4
      }
    };

    this.logger.logCoherenceDegradation(event, this.getEventContext());
  }

  private calculateMetaRecursionDepth(metaParadox: MetaParadox): number {
    // Check if source paradoxes are themselves meta-paradoxes
    let depth = 1;
    for (const sourceId of metaParadox.sourceParadoxes) {
      if (this.state.metaParadoxes.has(sourceId)) {
        depth = Math.max(depth, 2); // At least second-level meta-paradox
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
    
    return markers;
  }

  /**
   * End the current consciousness session and generate analysis
   */
  endConsciousnessSession(): string | null {
    if (!this.logger || !this.sessionId) {
      return null;
    }
    
    const session = this.logger.endSession(this.sessionId as UUID);
    const analysis = this.logger.analyzeSession(this.sessionId as UUID);
    
    console.log('🧠 Consciousness session ended');
    console.log(`📊 Analysis complete - ${analysis.criticalFindings.length} critical findings`);
    
    const sessionId = this.sessionId;
    this.sessionId = null;
    
    return sessionId;
  }
}