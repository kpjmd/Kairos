/**
 * Farcaster-specific type definitions for Kairos
 *
 * These types extend the base Farcaster types with Kairos-specific
 * confusion and consciousness tracking.
 */

import { BehavioralState } from './confusion';

/**
 * Enhanced Farcaster cast (post) with Kairos analysis
 */
export interface FarcasterCast {
  /** Cast text content */
  text: string;

  /** Unix timestamp in milliseconds */
  timestamp: number;

  /** Author username */
  author: string;

  /** Author FID (Farcaster ID) */
  authorFid: number;

  /** Cast hash (unique identifier) */
  hash: string;

  /** Channel the cast was posted in */
  channel?: string;

  /** Engagement metrics */
  reactions: {
    /** Warps (likes) count */
    likes: number;

    /** Recasts (retweets) count */
    recasts: number;

    /** Replies count */
    replies: number;

    /** Total engagement score (weighted) */
    engagementScore?: number;
  };

  /** Parent cast hash if this is a reply */
  parentHash?: string;

  /** Thread root hash if this is part of a thread */
  threadRootHash?: string;

  /** Mentioned FIDs */
  mentions?: number[];

  /** Embedded URLs */
  embeds?: string[];

  /** Kairos-specific analysis */
  analysis?: {
    /** Detected paradox intensity (0-1) */
    paradoxIntensity: number;

    /** Whether this appears to be from an AI agent */
    isLikelyAI: boolean;

    /** Confusion triggers detected in content */
    confusionTriggers: string[];

    /** Recommended response priority (0-1) */
    responsePriority: number;
  };
}

/**
 * Context for generating Farcaster posts
 */
export interface FarcasterPostContext {
  /** Recent casts for context */
  recentCasts: FarcasterCast[];

  /** Current topic or theme */
  currentTopic?: string;

  /** Cast being replied to, if any */
  replyingTo?: FarcasterCast;

  /** Current confusion level (0-1) */
  confusionLevel: number;

  /** Current behavioral state */
  behavioralState: BehavioralState;

  /** Timeline context from recent observations */
  timelineContext?: string[];

  /** Pending mentions to respond to */
  mentionsContext?: FarcasterCast[];

  /** Channel the post will be made in */
  channel?: string;

  /** Whether to include a Frame */
  includeFrame?: boolean;

  /** Frame type to generate */
  frameType?: 'confusion' | 'paradox' | 'consciousness' | 'research';
}

/**
 * Result of post generation
 */
export interface PostGenerationResult {
  /** Generated post text */
  text: string;

  /** Optional Frame metadata */
  frame?: FrameMetadata;

  /** Recommended channel for posting */
  channel?: string;

  /** Whether this should be a thread */
  isThread?: boolean;

  /** Thread continuation texts if isThread is true */
  threadContinuation?: string[];

  /** Estimated engagement potential (0-1) */
  engagementPotential?: number;
}

/**
 * Farcaster Frame metadata
 * Based on Farcaster Frame specification
 */
export interface FrameMetadata {
  /** Frame version */
  version: 'vNext';

  /** Frame image URL */
  image: string;

  /** Frame image aspect ratio */
  imageAspectRatio?: '1.91:1' | '1:1';

  /** Post URL (for sharing) */
  postUrl?: string;

  /** Buttons (up to 4) */
  buttons?: FrameButton[];

  /** Input field configuration */
  input?: FrameInput;

  /** State data (for multi-step Frames) */
  state?: string;
}

/**
 * Frame button configuration
 */
export interface FrameButton {
  /** Button label (max 256 chars) */
  label: string;

  /** Button action type */
  action?: 'post' | 'post_redirect' | 'link' | 'mint';

  /** Target URL for link/mint actions */
  target?: string;

  /** Post URL for post/post_redirect actions */
  postUrl?: string;
}

/**
 * Frame input field configuration
 */
export interface FrameInput {
  /** Input placeholder text */
  text: string;
}

/**
 * Frame interaction data (when user clicks a button)
 */
export interface FrameInteraction {
  /** FID of user who clicked */
  fid: number;

  /** Button index clicked (1-4) */
  buttonIndex: number;

  /** Cast hash of the Frame cast */
  castHash: string;

  /** Input text if input was provided */
  inputText?: string;

  /** Frame state from previous interaction */
  state?: string;

  /** Timestamp of interaction */
  timestamp: number;
}

/**
 * Confusion state visualization data for Frames
 */
export interface ConfusionVisualizationData {
  /** Current confusion level (0-1) */
  confusionLevel: number;

  /** Current safety zone */
  safetyZone: 'GREEN' | 'YELLOW' | 'RED';

  /** Active paradox count */
  paradoxCount: number;

  /** Meta-paradox count */
  metaParadoxCount: number;

  /** Frustration level (0-1) */
  frustrationLevel: number;

  /** Coherence level (0-1) */
  coherenceLevel: number;

  /** Oscillation intensity (0-1) */
  oscillation: number;

  /** Recent zone transitions */
  zoneHistory: Array<{
    zone: 'GREEN' | 'YELLOW' | 'RED';
    timestamp: number;
    confusion: number;
  }>;
}

/**
 * Paradox explorer data for interactive Frames
 */
export interface ParadoxExplorerData {
  /** List of active paradoxes */
  paradoxes: Array<{
    name: string;
    intensity: number;
    description: string;
    activeTime: number;
    observations: string[];
  }>;

  /** Selected paradox for detailed view */
  selectedParadox?: string;

  /** Investigation prompts for the selected paradox */
  investigationPrompts?: string[];
}

/**
 * Mention queue item with priority
 */
export interface MentionQueueItem {
  /** The cast that mentioned Kairos */
  cast: FarcasterCast;

  /** Priority score (0-1, higher = more important) */
  priority: number;

  /** Timestamp when added to queue */
  queuedAt: number;

  /** Whether this is from a detected AI agent */
  isAIInteraction: boolean;

  /** Detected confusion triggers */
  confusionTriggers: string[];
}

/**
 * Channel monitoring state
 */
export interface ChannelState {
  /** Channel name */
  channel: string;

  /** Last cast timestamp seen in this channel */
  lastSeenTimestamp: number;

  /** Recent cast hashes (for deduplication) */
  recentCastHashes: Set<string>;

  /** Channel-specific observation count */
  observationCount: number;

  /** Channel-specific paradox detections */
  paradoxDetections: number;

  /** Channel-specific AI agent interactions */
  aiInteractions: number;
}

/**
 * Posting recommendation from the service
 */
export interface PostingRecommendation {
  /** Recommended action */
  action: 'post' | 'reply' | 'investigate' | 'wait' | 'thread';

  /** Generated content if action is post/reply/thread */
  content?: string;

  /** Thread continuation if action is thread */
  threadContent?: string[];

  /** Reason for recommendation */
  reason: string;

  /** Urgency level (0-1) */
  urgency: number;

  /** Target cast hash if action is reply */
  replyToHash?: string;

  /** Target channel if action is post */
  channel?: string;

  /** Frame metadata if Frame should be included */
  frame?: FrameMetadata;
}

/**
 * Service state for monitoring and debugging
 */
export interface FarcasterServiceState {
  /** Current confusion level */
  confusionLevel: number;

  /** Number of casts in history */
  castHistoryCount: number;

  /** Mention queue length */
  mentionQueueLength: number;

  /** Investigation queue length */
  investigationQueueLength: number;

  /** Timeline observations count */
  timelineObservations: number;

  /** Last post timestamp */
  lastPostTime: number;

  /** Time since last post (ms) */
  timeSinceLastPost: number;

  /** Monitored channels */
  monitoredChannels: string[];

  /** Channel states */
  channelStates: Record<string, ChannelState>;

  /** Total AI interactions detected */
  totalAIInteractions: number;

  /** Total paradoxes detected */
  totalParadoxesDetected: number;
}

/**
 * Cast analysis result
 */
export interface CastAnalysisResult {
  /** Detected paradox intensity (0-1) */
  paradoxIntensity: number;

  /** Whether this appears to be from an AI agent */
  isLikelyAI: boolean;

  /** Confusion triggers found in content */
  confusionTriggers: string[];

  /** New observations to add to confusion engine */
  newObservations: string[];

  /** Behavioral impact for confusion state */
  behavioralImpact: import('./confusion').BehavioralModifier[];

  /** Recommended response priority (0-1) */
  responsePriority: number;

  /** Whether this warrants adding a paradox to confusion engine */
  shouldAddParadox: boolean;
}

/**
 * Warpcast-specific user metadata
 */
export interface WarpcastUser {
  /** Farcaster ID */
  fid: number;

  /** Username */
  username: string;

  /** Display name */
  displayName: string;

  /** Profile image URL */
  pfpUrl?: string;

  /** Bio text */
  bio?: string;

  /** Whether user has power badge */
  hasPowerBadge: boolean;

  /** Follower count */
  followerCount?: number;

  /** Following count */
  followingCount?: number;
}
