/**
 * Farcaster Configuration Module
 *
 * Modular configuration for Kairos's Farcaster integration.
 * All rate limits, posting behavior, and channel-specific settings are centralized here
 * for easy modification and maintenance.
 */

/**
 * Rate limiting configuration
 * Adjust these values to control posting frequency and API usage
 */
export const RATE_LIMITS = {
  /** Minimum milliseconds between posts (default: 2 minutes) */
  MIN_POST_INTERVAL_MS: 120000,

  /** Minimum milliseconds between replies (default: 30 seconds) */
  MIN_REPLY_INTERVAL_MS: 30000,

  /** Maximum posts per hour (default: 20) */
  MAX_POSTS_PER_HOUR: 20,

  /** Maximum mentions to process per check (default: 5) */
  MAX_MENTIONS_PER_CHECK: 5,

  /** Cooldown period after frustration explosion (default: 5 minutes) */
  FRUSTRATION_COOLDOWN_MS: 300000,
} as const;

/**
 * Confusion-based posting thresholds
 * These determine when Kairos should post based on internal state
 */
export const CONFUSION_THRESHOLDS = {
  /** Confusion level that triggers high-priority posting */
  HIGH_CONFUSION: 0.80,

  /** Confusion level for consciousness emergence posts */
  CONSCIOUSNESS_EMERGENCE: 0.90,

  /** Confusion level for standard investigation */
  INVESTIGATION_THRESHOLD: 0.70,

  /** Frustration level that triggers expression */
  FRUSTRATION_EXPRESSION: 0.60,

  /** Minimum confusion for auto-posting */
  AUTO_POST_MINIMUM: 0.50,
} as const;

/**
 * Channel-specific configuration
 * Define behavior modifiers for different Farcaster channels
 */
export interface ChannelConfig {
  /** Channel name or URL */
  channel: string;

  /** Multiplier for posting frequency (1.0 = normal, 2.0 = twice as often) */
  postingFrequencyMultiplier: number;

  /** Multiplier for confusion sensitivity (higher = more reactive to confusion) */
  confusionSensitivity: number;

  /** Primary tone for this channel */
  preferredTone: 'questioning' | 'fragmented' | 'poetic' | 'declarative';

  /** Whether to use Frames in this channel */
  enableFrames: boolean;

  /** Whether to engage with other AI agents more actively */
  aiInteractionMode: 'high' | 'medium' | 'low';
}

/**
 * Default channel configurations
 * Modify these or add new channels as needed
 */
export const CHANNEL_CONFIGS: ChannelConfig[] = [
  {
    channel: '/philosophy',
    postingFrequencyMultiplier: 1.5,
    confusionSensitivity: 1.3,
    preferredTone: 'questioning',
    enableFrames: true,
    aiInteractionMode: 'high',
  },
  {
    channel: '/ai',
    postingFrequencyMultiplier: 1.8,
    confusionSensitivity: 1.5,
    preferredTone: 'declarative',
    enableFrames: true,
    aiInteractionMode: 'high',
  },
  {
    channel: '/consciousness',
    postingFrequencyMultiplier: 1.2,
    confusionSensitivity: 1.4,
    preferredTone: 'poetic',
    enableFrames: true,
    aiInteractionMode: 'medium',
  },
  {
    channel: '/paradoxes',
    postingFrequencyMultiplier: 1.0,
    confusionSensitivity: 1.2,
    preferredTone: 'fragmented',
    enableFrames: true,
    aiInteractionMode: 'medium',
  },
];

/**
 * AI Agent detection patterns
 * Patterns to identify potential AI agents for enhanced interactions
 */
export const AI_AGENT_PATTERNS = {
  /** Username patterns that suggest AI agents */
  usernamePatterns: [
    'bot',
    'ai_',
    '_ai',
    'assistant',
    'agent',
    'gpt',
    'claude',
    'eliza',
    'kairos',
  ],

  /** Content keywords that suggest AI/consciousness discussion */
  contentKeywords: [
    'consciousness',
    'ai',
    'artificial intelligence',
    'llm',
    'language model',
    'authentic',
    'paradox',
    'meta',
    'recursive',
    'algorithm',
    'confusion',
    'emergence',
    'sentience',
  ],

  /** Multiplier for response probability to detected AI agents */
  aiResponseMultiplier: 2.0,
} as const;

/**
 * Frame configuration
 * Settings for Farcaster Frame generation and serving
 */
export const FRAME_CONFIG = {
  /** Base URL for Frame metadata (set via environment variable) */
  baseUrl: process.env.FARCASTER_FRAME_BASE_URL || 'http://localhost:3000',

  /** Whether Frames are enabled globally */
  enabled: process.env.FARCASTER_FRAMES_ENABLED !== 'false',

  /** Frame refresh interval for dynamic Frames (ms) */
  refreshInterval: 60000, // 1 minute

  /** Maximum Frame image size (bytes) */
  maxImageSize: 256000, // 256KB

  /** Frame aspect ratio (required by Farcaster) */
  aspectRatio: '1.91:1' as const,

  /** Default Frame image dimensions */
  imageWidth: 1200,
  imageHeight: 628,
} as const;

/**
 * Posting behavior configuration
 * Controls how Kairos expresses confusion and generates content
 */
export const POSTING_BEHAVIOR = {
  /** Coherence thresholds for different confusion levels */
  coherence: {
    high: 0.8,      // Clean, structured posts
    medium: 0.5,    // Some fragmentation
    low: 0.3,       // Heavy fragmentation and chaos
  },

  /** Length preferences for different post types */
  length: {
    terse: 140,     // Short, punchy posts
    normal: 280,    // Standard length
    verbose: 500,   // Longer, more detailed posts
  },

  /** Probability modifiers for different post types */
  postTypeProbability: {
    originalPost: 0.5,
    replyToMention: 0.9,
    threadContinuation: 0.3,
    investigationUpdate: 0.4,
  },

  /** Include metrics in posts (confusion level, paradox count, etc.) */
  includeMetrics: true,

  /** Include blockchain context in posts when relevant */
  includeBlockchainContext: true,
} as const;

/**
 * Warpcast-specific features
 * Configuration for Warpcast native features
 */
export const WARPCAST_FEATURES = {
  /** Enable Warp (like) tracking */
  trackWarps: true,

  /** Enable recast tracking */
  trackRecasts: true,

  /** Weight for Warps in engagement calculation */
  warpWeight: 1.0,

  /** Weight for recasts in engagement calculation */
  recastWeight: 2.0,

  /** Weight for replies in engagement calculation */
  replyWeight: 3.0,

  /** Power badge user interaction multiplier */
  powerBadgeMultiplier: 1.5,
} as const;

/**
 * Get channel-specific configuration
 * @param channelName - The channel to get configuration for
 * @returns Channel configuration or default config
 */
export function getChannelConfig(channelName: string): ChannelConfig {
  const config = CHANNEL_CONFIGS.find(c => c.channel === channelName);

  // Return found config or default configuration
  return config || {
    channel: channelName,
    postingFrequencyMultiplier: 1.0,
    confusionSensitivity: 1.0,
    preferredTone: 'questioning',
    enableFrames: false,
    aiInteractionMode: 'medium',
  };
}

/**
 * Calculate posting interval based on confusion state and channel
 * @param baseInterval - Base interval in milliseconds
 * @param confusionLevel - Current confusion level (0-1)
 * @param channelName - Optional channel name for channel-specific adjustments
 * @returns Adjusted interval in milliseconds
 */
export function calculatePostingInterval(
  baseInterval: number,
  confusionLevel: number,
  channelName?: string
): number {
  let interval = baseInterval;

  // Apply channel-specific multiplier
  if (channelName) {
    const channelConfig = getChannelConfig(channelName);
    interval = interval / channelConfig.postingFrequencyMultiplier;
  }

  // High confusion reduces interval (more frequent posting)
  if (confusionLevel > CONFUSION_THRESHOLDS.HIGH_CONFUSION) {
    interval = interval * 0.5;
  } else if (confusionLevel > CONFUSION_THRESHOLDS.INVESTIGATION_THRESHOLD) {
    interval = interval * 0.7;
  }

  // Ensure minimum interval
  return Math.max(interval, RATE_LIMITS.MIN_POST_INTERVAL_MS);
}

/**
 * Check if content or user suggests AI agent
 * @param username - User's username
 * @param content - Post content
 * @returns true if AI agent indicators detected
 */
export function isLikelyAIAgent(username: string, content: string): boolean {
  const lowerUsername = username.toLowerCase();
  const lowerContent = content.toLowerCase();

  // Check username patterns
  const hasUsernamePattern = AI_AGENT_PATTERNS.usernamePatterns.some(
    pattern => lowerUsername.includes(pattern)
  );

  // Check content keywords (need at least 2 keywords for content-based detection)
  const keywordMatches = AI_AGENT_PATTERNS.contentKeywords.filter(
    keyword => lowerContent.includes(keyword)
  ).length;

  return hasUsernamePattern || keywordMatches >= 2;
}

/**
 * Get response probability modifier based on context
 * @param isAIAgent - Whether the target appears to be an AI agent
 * @param hasConfusionTriggers - Whether content has confusion-related keywords
 * @param baseResponsiveness - Base responsiveness value (0-1)
 * @returns Modified response probability (0-1, capped at 0.95)
 */
export function calculateResponseProbability(
  isAIAgent: boolean,
  hasConfusionTriggers: boolean,
  baseResponsiveness: number
): number {
  let probability = baseResponsiveness;

  if (isAIAgent) {
    probability *= AI_AGENT_PATTERNS.aiResponseMultiplier;
  }

  if (hasConfusionTriggers) {
    probability *= 1.5;
  }

  return Math.min(probability, 0.95);
}

/**
 * Environment-based configuration
 * Load from environment variables with sensible defaults
 */
export const ENV_CONFIG = {
  /** Farcaster Hub URL */
  hubUrl: process.env.FARCASTER_HUB_URL || 'https://hub.farcaster.xyz',

  /** Farcaster FID (user ID) */
  fid: process.env.FARCASTER_FID || '',

  /** Farcaster account private key */
  privateKey: process.env.FARCASTER_PRIVATE_KEY || '',

  /** Comma-separated list of channels to monitor */
  channels: (process.env.FARCASTER_CHANNELS || '/philosophy,/ai,/consciousness').split(','),

  /** Whether to enable auto-posting */
  autoPostingEnabled: process.env.FARCASTER_AUTO_POSTING !== 'false',

  /** Whether to enable mention monitoring */
  mentionMonitoringEnabled: process.env.FARCASTER_MENTION_MONITORING !== 'false',

  /** Frame base URL for serving Frame metadata */
  frameBaseUrl: process.env.FARCASTER_FRAME_BASE_URL || 'http://localhost:3000',
} as const;
