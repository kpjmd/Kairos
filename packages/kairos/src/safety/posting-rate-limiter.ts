/**
 * Farcaster posting rate limiter
 * Prevents spam and enforces platform-appropriate posting frequency
 */

export interface RateLimitConfig {
  maxPostsPerHour: number;
  maxPostsPerDay: number;
  burstLimit: number; // Max posts in quick succession
  burstWindowMs: number; // Time window for burst detection
}

export interface RateLimitStatus {
  canPost: boolean;
  postsInLastHour: number;
  postsInLastDay: number;
  postsInBurstWindow: number;
  reason?: string;
  nextAvailablePost?: number; // Timestamp when next post allowed
}

export class PostingRateLimiter {
  private config: RateLimitConfig;
  private postHistory: number[] = []; // Timestamps of posts

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      maxPostsPerHour: config?.maxPostsPerHour || 10,
      maxPostsPerDay: config?.maxPostsPerDay || 120,
      burstLimit: config?.burstLimit || 3,
      burstWindowMs: config?.burstWindowMs || 300000, // 5 minutes
    };

    console.log('⏱️ Posting Rate Limiter initialized');
    console.log(`   Max per hour: ${this.config.maxPostsPerHour}`);
    console.log(`   Max per day: ${this.config.maxPostsPerDay}`);
    console.log(
      `   Burst limit: ${this.config.burstLimit} posts in ${this.config.burstWindowMs / 1000}s`
    );
  }

  /**
   * Check if posting is allowed
   */
  checkLimit(): RateLimitStatus {
    const now = Date.now();
    this.cleanupHistory(now);

    const postsInLastHour = this.countPostsInWindow(now, 3600000); // 1 hour
    const postsInLastDay = this.countPostsInWindow(now, 86400000); // 24 hours
    const postsInBurstWindow = this.countPostsInWindow(now, this.config.burstWindowMs);

    // Check limits
    if (postsInBurstWindow >= this.config.burstLimit) {
      const oldestBurstPost = this.postHistory[this.postHistory.length - this.config.burstLimit];
      const nextAvailablePost = oldestBurstPost + this.config.burstWindowMs;

      return {
        canPost: false,
        postsInLastHour,
        postsInLastDay,
        postsInBurstWindow,
        reason: `Burst limit reached (${this.config.burstLimit} posts in ${this.config.burstWindowMs / 1000}s)`,
        nextAvailablePost,
      };
    }

    if (postsInLastHour >= this.config.maxPostsPerHour) {
      const oldestHourPost = this.postHistory.find((ts) => ts > now - 3600000);
      const nextAvailablePost = oldestHourPost ? oldestHourPost + 3600000 : now;

      return {
        canPost: false,
        postsInLastHour,
        postsInLastDay,
        postsInBurstWindow,
        reason: `Hourly limit reached (${this.config.maxPostsPerHour} posts/hour)`,
        nextAvailablePost,
      };
    }

    if (postsInLastDay >= this.config.maxPostsPerDay) {
      const oldestDayPost = this.postHistory.find((ts) => ts > now - 86400000);
      const nextAvailablePost = oldestDayPost ? oldestDayPost + 86400000 : now;

      return {
        canPost: false,
        postsInLastHour,
        postsInLastDay,
        postsInBurstWindow,
        reason: `Daily limit reached (${this.config.maxPostsPerDay} posts/day)`,
        nextAvailablePost,
      };
    }

    return {
      canPost: true,
      postsInLastHour,
      postsInLastDay,
      postsInBurstWindow,
    };
  }

  /**
   * Record a successful post
   */
  recordPost(): void {
    const now = Date.now();
    this.postHistory.push(now);
    this.cleanupHistory(now);

    console.log(`📝 Post recorded (${this.postHistory.length} in history)`);
  }

  /**
   * Count posts within a time window
   */
  private countPostsInWindow(now: number, windowMs: number): number {
    return this.postHistory.filter((ts) => ts > now - windowMs).length;
  }

  /**
   * Remove posts older than 24 hours from history
   */
  private cleanupHistory(now: number): void {
    const cutoff = now - 86400000; // 24 hours
    this.postHistory = this.postHistory.filter((ts) => ts > cutoff);
  }

  /**
   * Get current statistics
   */
  getStatistics() {
    const now = Date.now();
    return {
      postsInLastHour: this.countPostsInWindow(now, 3600000),
      postsInLastDay: this.countPostsInWindow(now, 86400000),
      postsInLastFiveMinutes: this.countPostsInWindow(now, this.config.burstWindowMs),
      totalRecorded: this.postHistory.length,
      config: this.config,
    };
  }

  /**
   * Reset rate limiter (for testing or manual override)
   */
  reset(): void {
    console.log('🔄 Resetting posting rate limiter');
    this.postHistory = [];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Rate limiter configuration updated:', this.config);
  }
}

export default PostingRateLimiter;
