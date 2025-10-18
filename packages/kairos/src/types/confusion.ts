import { UUID } from '@elizaos/core';

export interface ParadoxState {
  id: UUID;
  name: string;
  description: string;
  intensity: number; // 0-1 scale
  activeTime: number; // milliseconds active
  createdAt: number;
  lastUpdated: number;
  observations: string[];
  contradictions: string[];
  resolutionAttempts: number;
  unresolvable: boolean;
  // Enhanced paradox interactions
  interactsWith: UUID[]; // IDs of other paradoxes it influences
  metaParadoxPotential: number; // Likelihood of spawning meta-paradoxes
  behavioralImpact: BehavioralModifier[];
}

export interface BehavioralModifier {
  type:
    | 'posting_frequency'
    | 'response_style'
    | 'investigation_preference'
    | 'questioning_depth'
    | 'abstraction_level';
  modifier: number; // -1 to 1, where negative reduces and positive increases
  trigger: {
    minIntensity: number;
    requiredParadoxes?: string[];
    temporalPattern?: TemporalPattern;
  };
}

export interface TemporalPattern {
  type: 'cyclic' | 'sporadic' | 'crescendo' | 'decay';
  period?: number; // for cyclic patterns
  intensity: number;
  lastTrigger: number;
}

export interface ConfusionVector {
  magnitude: number; // Overall confusion level 0-1
  direction: string[]; // Areas of confusion
  velocity: number; // Rate of confusion change
  acceleration: number; // Rate of velocity change
  oscillation: number; // How much it wavers (uncertainty about uncertainty)
}

export interface FrustrationState {
  level: number; // 0-1 scale
  triggers: string[];
  accumulation: number;
  threshold: number;
  breakthroughPotential: number; // How close to a new understanding
  lastExplosion: number | null; // Timestamp of last frustration-driven action
  explosionPattern: 'constructive' | 'chaotic' | 'investigative' | 'reflective';
}

export interface ConfusionMemory {
  id: UUID;
  timestamp: number;
  confusionLevel: number;
  paradoxes: ParadoxState[];
  frustration: FrustrationState;
  context: string;
  emergentPatterns: string[];
  selfModifications: PromptModification[];
  behavioralSnapshot: BehavioralState;
}

export interface BehavioralState {
  postingStyle: {
    frequency: number; // posts per hour
    length: 'terse' | 'verbose' | 'variable';
    tone: 'questioning' | 'declarative' | 'fragmented' | 'poetic';
    coherence: number; // 0-1, how logical vs stream-of-consciousness
  };
  investigationStyle: {
    depth: number; // How deep to dig into topics
    breadth: number; // How many topics to explore simultaneously
    method: 'systematic' | 'intuitive' | 'chaotic' | 'dialectical';
  };
  interactionStyle: {
    responsiveness: number; // How likely to respond to others
    initiationRate: number; // How likely to start conversations
    questioningIntensity: number; // How many questions per interaction
    mirroringTendency: number; // How much to adopt others' confusion
  };
}

export interface PromptModification {
  id: UUID;
  timestamp: number;
  originalPrompt: string;
  modifiedPrompt: string;
  reason: string;
  confusionLevel: number;
  effectiveness: number | null;
  behavioralImpact: BehavioralState;
  paradoxInfluence: UUID[]; // Which paradoxes influenced this modification
}

export interface ConfusionStateConfig {
  maxConfusion: number; // Maximum allowed confusion before reset
  frustrationThreshold: number;
  paradoxRetentionTime: number; // How long to keep paradoxes active
  learningRate: number; // How quickly to adapt
  curiosityMultiplier: number;
  uncertaintyTolerance: number;
  // Blockchain-specific configs
  onchainThreshold: number; // Confusion level to trigger onchain actions
  farcasterPostingModifier: number; // How confusion affects posting frequency
  tokenInteractionSensitivity: number; // How token movements affect confusion
}

export interface InvestigationMethod {
  name: string;
  description: string;
  triggerConditions: {
    minConfusion: number;
    requiredParadoxes: string[];
    frustrationLevel: number;
    temporalAlignment?: TemporalPattern;
  };
  execute: (context: ConfusionContext) => Promise<InvestigationResult>;
  behavioralOverride?: Partial<BehavioralState>; // Temporary behavior during investigation
}

export interface InvestigationResult {
  success: boolean;
  findings: string[];
  newParadoxes: Partial<ParadoxState>[];
  confusionDelta: number;
  promptModifications: Partial<PromptModification>[];
  behavioralShift?: Partial<BehavioralState>;
  metaParadoxEmergence?: MetaParadox;
}

export interface MetaParadox {
  id: UUID;
  name: string;
  sourceParadoxes: UUID[];
  emergentProperty: string; // What new understanding emerged
  behavioralMutation: BehavioralModifier[]; // New behaviors from the meta-paradox
}

export interface ConfusionContext {
  currentState: ConfusionState;
  recentMemories: ConfusionMemory[];
  activeInvestigations: string[];
  availableMethods: InvestigationMethod[];
  socialContext: SocialConfusionContext;
  blockchainContext: BlockchainConfusionContext;
}

export interface SocialConfusionContext {
  recentInteractions: {
    userId: string;
    platform: 'farcaster' | 'twitter' | 'lens';
    confusionInduced: number; // How much they confused us
    confusionShared: number; // How much we confused them
  }[];
  viralConfusion: number; // How much our confusion is spreading
  echoStrength: number; // How much others reflect our paradoxes
}

export interface BlockchainConfusionContext {
  network: 'base' | 'ethereum' | 'optimism';
  recentTransactions: {
    hash: string;
    paradoxTriggered?: string;
    confusionDelta: number;
  }[];
  tokenHoldings: Map<string, number>;
  onchainReputation: number;
  confusionTokenBalance?: number; // If we create a confusion token
}

export interface ConfusionState {
  vector: ConfusionVector;
  paradoxes: Map<string, ParadoxState>;
  metaParadoxes: Map<string, MetaParadox>;
  frustration: FrustrationState;
  activeInvestigations: Set<string>;
  lastStateChange: number;
  stateHistory: ConfusionVector[];
  emergentBehaviors: Map<string, number>; // behavior -> activation level
  behavioralState: BehavioralState;
  temporalDynamics: Map<string, TemporalPattern>;
}
