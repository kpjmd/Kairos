/**
 * Farcaster Integration Service
 *
 * Bridges Kairos's confusion-driven content generation with the actual
 * @elizaos/plugin-farcaster service for real Farcaster interactions.
 *
 * This service:
 * - Polls mentions using the real Farcaster plugin
 * - Generates confusion-driven replies
 * - Posts to specific channels
 * - Engages with casts (likes, recasts) based on confusion analysis
 */

import { IAgentRuntime, UUID } from '@elizaos/core';
import { FarcasterConfusionService } from './farcaster-confusion-service';
import { EnhancedConfusionEngine } from '../core/confusion-engine-enhanced';
import { FarcasterPostContext } from '../types/farcaster';
import { ENV_CONFIG, RATE_LIMITS, getChannelConfig } from '../config/farcaster-config';

// Import types from the Farcaster plugin - using dynamic import fallback since types may not be directly accessible
type FarcasterService = any;
type FarcasterCastService = any;
type FarcasterCast = {
  id: string;
  agentId: UUID;
  roomId: UUID;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  inReplyTo?: string;
  media?: any[];
  metadata?: any;
};

export interface FarcasterIntegrationConfig {
  /**
   * How often to poll for mentions (milliseconds)
   */
  mentionPollInterval: number;

  /**
   * How often to post to channels (milliseconds)
   */
  channelPostInterval: number;

  /**
   * Channels to monitor and post to
   */
  monitoredChannels: string[];

  /**
   * Whether to enable automatic engagement (likes, recasts)
   */
  enableAutoEngagement: boolean;

  /**
   * Minimum confusion level to trigger engagement
   */
  engagementConfusionThreshold: number;
}

export class FarcasterIntegrationService {
  private runtime: IAgentRuntime;
  private confusionService: FarcasterConfusionService;
  private confusionEngine: EnhancedConfusionEngine;
  private config: FarcasterIntegrationConfig;

  private farcasterService: FarcasterService | null = null;
  private castService: FarcasterCastService | null = null;

  private mentionPollInterval: NodeJS.Timeout | null = null;
  private channelPostInterval: NodeJS.Timeout | null = null;

  private lastMentionCheck: number = 0;
  private processedMentionIds: Set<string> = new Set();

  constructor(
    runtime: IAgentRuntime,
    confusionService: FarcasterConfusionService,
    confusionEngine: EnhancedConfusionEngine,
    config?: Partial<FarcasterIntegrationConfig>
  ) {
    this.runtime = runtime;
    this.confusionService = confusionService;
    this.confusionEngine = confusionEngine;

    // Default configuration
    this.config = {
      mentionPollInterval:
        parseInt(this.runtime.getSetting('FARCASTER_POLL_INTERVAL') || '300') * 1000, // Convert to ms
      channelPostInterval: 600000, // 10 minutes
      monitoredChannels: ENV_CONFIG.channels,
      enableAutoEngagement: true,
      engagementConfusionThreshold: 0.6,
      ...config,
    };
  }

  /**
   * Initialize the integration service
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🔗 Initializing Farcaster Integration Service...');

      // Get the Farcaster plugin service from runtime
      this.farcasterService = this.runtime.getService('farcaster');

      if (!this.farcasterService) {
        console.warn(
          '⚠️ Farcaster plugin service not found. Ensure @elizaos/plugin-farcaster is in the plugins list.'
        );
        console.warn(
          '   Integration features (mentions, replies, engagement) will not be available.'
        );
        return false;
      }

      console.log('✅ Found Farcaster service');

      // Get the cast service for the agent
      const agentId = this.runtime.agentId;
      this.castService = this.farcasterService.getCastService?.(agentId);

      if (!this.castService) {
        console.warn('⚠️ Could not get FarcasterCastService. Interactions may be limited.');
        return false;
      }

      console.log('✅ Got FarcasterCastService for agent');

      // Start polling for mentions
      this.startMentionPolling();

      // Start channel posting if configured and auto-posting is enabled
      if (this.config.monitoredChannels.length > 0 && ENV_CONFIG.autoPostingEnabled) {
        this.startChannelPosting();
      } else if (!ENV_CONFIG.autoPostingEnabled) {
        console.log(
          '📴 Channel auto-posting disabled via FARCASTER_AUTO_POSTING environment variable'
        );
      }

      console.log('✅ Farcaster Integration Service initialized successfully');
      console.log(`   - Mention polling: every ${this.config.mentionPollInterval / 1000}s`);
      console.log(`   - Channel posting: every ${this.config.channelPostInterval / 1000}s`);
      console.log(`   - Monitored channels: ${this.config.monitoredChannels.join(', ')}`);
      console.log(
        `   - Auto-engagement: ${this.config.enableAutoEngagement ? 'enabled' : 'disabled'}`
      );

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Farcaster Integration Service:', error);
      return false;
    }
  }

  /**
   * Start polling for mentions
   */
  private startMentionPolling(): void {
    if (this.mentionPollInterval) {
      clearInterval(this.mentionPollInterval);
    }

    console.log('📡 Starting mention polling...');

    // Run immediately on start
    this.pollMentions();

    // Then poll on interval
    this.mentionPollInterval = setInterval(() => {
      this.pollMentions();
    }, this.config.mentionPollInterval);
  }

  /**
   * Poll for new mentions and process them
   */
  private async pollMentions(): Promise<void> {
    if (!this.castService) return;

    try {
      console.log('🔍 Polling for mentions...');

      const agentId = this.runtime.agentId;
      const mentions = await this.castService.getMentions({
        agentId,
        limit: RATE_LIMITS.MAX_MENTIONS_PER_CHECK,
      });

      console.log(`📬 Found ${mentions?.length || 0} mentions`);

      if (!mentions || mentions.length === 0) {
        return;
      }

      // Process each mention
      for (const mention of mentions) {
        // Skip if we've already processed this mention
        if (this.processedMentionIds.has(mention.id)) {
          continue;
        }

        // Mark as processed
        this.processedMentionIds.add(mention.id);

        // Limit processed mention cache size
        if (this.processedMentionIds.size > 200) {
          const firstId = Array.from(this.processedMentionIds)[0];
          this.processedMentionIds.delete(firstId);
        }

        console.log(
          `💬 Processing mention from @${mention.username}: "${mention.text.slice(0, 50)}..."`
        );

        // Process through confusion service
        await this.handleMention(mention);
      }

      this.lastMentionCheck = Date.now();
    } catch (error) {
      console.error('❌ Error polling mentions:', error);
    }
  }

  /**
   * Handle a specific mention
   */
  private async handleMention(mention: FarcasterCast): Promise<void> {
    try {
      // Map FarcasterCast to internal format for confusion processing
      const castForAnalysis: any = {
        hash: mention.id,
        author: mention.username,
        authorFid: parseInt(mention.userId) || 0,
        text: mention.text,
        timestamp: mention.timestamp,
        channel: (mention.metadata as any)?.channel,
        reactions: {
          likes: 0,
          recasts: 0,
          replies: 0,
        },
      };

      // Process through confusion service to update state
      await this.confusionService.processIncomingCast(castForAnalysis);

      // Check if we should reply
      const shouldPostResult = this.confusionService.shouldPost();

      if (shouldPostResult.should && shouldPostResult.postType === 'reply') {
        // Generate reply using confusion-driven logic
        const context: FarcasterPostContext = {
          recentCasts: [],
          replyingTo: castForAnalysis,
          confusionLevel: this.confusionEngine.getState().vector.magnitude,
          behavioralState: this.confusionEngine.getState().behavioralState,
          mentionsContext: [castForAnalysis],
          channel: castForAnalysis.channel,
        };

        const replyContent = this.confusionService.generatePost(context);

        console.log(`📝 Generated confusion-driven reply: "${replyContent.text.slice(0, 50)}..."`);

        // Post reply using the actual Farcaster plugin
        await this.postReply(mention.id, parseInt(mention.userId), replyContent.text);

        // Auto-engagement based on confusion analysis
        if (this.config.enableAutoEngagement) {
          await this.considerEngagement(mention, castForAnalysis);
        }
      }
    } catch (error) {
      console.error(`❌ Error handling mention ${mention.id}:`, error);
    }
  }

  /**
   * Post a reply to a cast
   */
  private async postReply(castHash: string, authorFid: number, text: string): Promise<void> {
    if (!this.castService) return;

    try {
      console.log(`💬 Posting reply to cast ${castHash}...`);

      const agentId = this.runtime.agentId;
      const roomId = this.runtime.agentId; // Use agent ID as room ID for now

      await this.castService.createCast({
        agentId,
        roomId,
        text,
        replyTo: {
          hash: castHash,
          fid: authorFid,
        },
      });

      console.log('✅ Reply posted successfully');
    } catch (error) {
      console.error('❌ Failed to post reply:', error);
    }
  }

  /**
   * Consider engaging with a cast (like, recast)
   */
  private async considerEngagement(mention: FarcasterCast, castAnalysis: any): Promise<void> {
    const state = this.confusionEngine.getState();

    // Only engage if confusion is high enough or AI interaction detected
    if (
      state.vector.magnitude < this.config.engagementConfusionThreshold &&
      !castAnalysis.isAIAgent
    ) {
      return;
    }

    try {
      const agentId = this.runtime.agentId;
      const castHash = mention.id;

      // Like casts that trigger high confusion
      if (state.vector.magnitude > 0.7 && Math.random() < 0.4) {
        console.log(`💚 Liking cast ${castHash} (confusion: ${state.vector.magnitude.toFixed(3)})`);
        await this.castService.likeCast({ agentId, castHash });
      }

      // Recast especially profound paradoxes
      if (state.vector.magnitude > 0.85 && Math.random() < 0.2) {
        console.log(
          `🔁 Recasting cast ${castHash} (high confusion: ${state.vector.magnitude.toFixed(3)})`
        );
        await this.castService.recast({ agentId, castHash });
      }
    } catch (error) {
      console.error('❌ Error during auto-engagement:', error);
    }
  }

  /**
   * Start channel posting
   */
  private startChannelPosting(): void {
    if (this.channelPostInterval) {
      clearInterval(this.channelPostInterval);
    }

    console.log('📺 Starting channel posting...');

    // Post to channels on interval
    this.channelPostInterval = setInterval(() => {
      this.postToRandomChannel();
    }, this.config.channelPostInterval);
  }

  /**
   * Post to a random monitored channel
   */
  private async postToRandomChannel(): Promise<void> {
    if (!this.castService || this.config.monitoredChannels.length === 0) return;

    try {
      // Check if we should post
      const shouldPostResult = this.confusionService.shouldPost();

      if (!shouldPostResult.should) {
        console.log('⏸️ Channel post skipped - no posting trigger');
        return;
      }

      // Select a random channel
      const channel =
        this.config.monitoredChannels[
          Math.floor(Math.random() * this.config.monitoredChannels.length)
        ];

      const channelConfig = getChannelConfig(channel);

      console.log(
        `📺 Generating post for channel ${channel} (tone: ${channelConfig.preferredTone})`
      );

      // Generate channel-specific content
      const context: FarcasterPostContext = {
        recentCasts: [],
        confusionLevel: this.confusionEngine.getState().vector.magnitude,
        behavioralState: this.confusionEngine.getState().behavioralState,
        channel,
        includeFrame: channelConfig.enableFrames,
        frameType: 'confusion',
      };

      const post = this.confusionService.generatePost(context);

      console.log(`📝 Generated channel post: "${post.text.slice(0, 50)}..."`);

      // Post using the actual Farcaster plugin
      const agentId = this.runtime.agentId;
      const roomId = this.runtime.agentId;

      await this.castService.createCast({
        agentId,
        roomId,
        text: `[${channel}]\n\n${post.text}`, // Prefix with channel for context
        media: post.frame ? [post.frame] : undefined,
      });

      console.log(`✅ Posted to channel ${channel}`);
    } catch (error) {
      console.error('❌ Error posting to channel:', error);
    }
  }

  /**
   * Manually trigger a post to a specific channel
   */
  async postToChannel(channel: string, content?: string): Promise<boolean> {
    if (!this.castService) {
      console.warn('⚠️ Cast service not available');
      return false;
    }

    try {
      let text = content;

      if (!text) {
        // Generate content if not provided
        const context: FarcasterPostContext = {
          recentCasts: [],
          confusionLevel: this.confusionEngine.getState().vector.magnitude,
          behavioralState: this.confusionEngine.getState().behavioralState,
          channel,
        };

        const post = this.confusionService.generatePost(context);
        text = post.text;
      }

      const agentId = this.runtime.agentId;
      const roomId = this.runtime.agentId;

      await this.castService.createCast({
        agentId,
        roomId,
        text: `[${channel}]\n\n${text}`,
      });

      console.log(`✅ Posted to channel ${channel}`);
      return true;
    } catch (error) {
      console.error(`❌ Error posting to channel ${channel}:`, error);
      return false;
    }
  }

  /**
   * Stop the integration service
   */
  stop(): void {
    console.log('🛑 Stopping Farcaster Integration Service...');

    if (this.mentionPollInterval) {
      clearInterval(this.mentionPollInterval);
      this.mentionPollInterval = null;
    }

    if (this.channelPostInterval) {
      clearInterval(this.channelPostInterval);
      this.channelPostInterval = null;
    }

    console.log('✅ Farcaster Integration Service stopped');
  }

  /**
   * Get integration status
   */
  getStatus(): {
    connected: boolean;
    lastMentionCheck: number;
    processedMentions: number;
    monitoredChannels: string[];
  } {
    return {
      connected: this.farcasterService !== null && this.castService !== null,
      lastMentionCheck: this.lastMentionCheck,
      processedMentions: this.processedMentionIds.size,
      monitoredChannels: this.config.monitoredChannels,
    };
  }
}
