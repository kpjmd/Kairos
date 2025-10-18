/**
 * Multi-tier coherence brake system for Farcaster spam prevention
 * Prevents posting when coherence degrades to dangerous levels
 */

export enum BrakeLevel {
  NONE = 'NONE', // No restrictions (coherence >= 0.3)
  SOFT = 'SOFT', // Warning, reduce frequency (coherence < 0.3)
  MEDIUM = 'MEDIUM', // Pause auto-posting (coherence < 0.25)
  HARD = 'HARD', // Block all posting (coherence < 0.2)
}

export interface CoherenceBrakeStatus {
  brakeLevel: BrakeLevel;
  currentCoherence: number;
  canPost: boolean;
  canAutoPost: boolean;
  frequencyModifier: number; // 0-1, multiplies posting frequency
  reason: string;
}

export class CoherenceBrake {
  // Thresholds
  private readonly SOFT_THRESHOLD = 0.3;
  private readonly MEDIUM_THRESHOLD = 0.25;
  private readonly HARD_THRESHOLD = 0.2;

  // Recovery hysteresis (prevents rapid oscillation)
  private readonly RECOVERY_BUFFER = 0.05;

  private currentBrakeLevel: BrakeLevel = BrakeLevel.NONE;
  private brakeActivationTime: number | null = null;
  private totalBrakeActivations = 0;
  private brakeHistory: Array<{ level: BrakeLevel; timestamp: number; coherence: number }> = [];

  constructor() {
    console.log('🛡️ Coherence Brake System initialized');
    console.log(`   Soft brake: <${this.SOFT_THRESHOLD} (reduce posting)`);
    console.log(`   Medium brake: <${this.MEDIUM_THRESHOLD} (pause auto-posts)`);
    console.log(`   Hard brake: <${this.HARD_THRESHOLD} (block all posts)`);
  }

  /**
   * Evaluate current coherence and determine brake level
   */
  evaluateBrake(coherence: number, confusion: number): CoherenceBrakeStatus {
    const previousLevel = this.currentBrakeLevel;
    const newLevel = this.determineBrakeLevel(coherence);

    // Update brake state if level changed
    if (newLevel !== previousLevel) {
      this.updateBrakeLevel(newLevel, coherence);
    }

    // Build status response
    const status: CoherenceBrakeStatus = {
      brakeLevel: newLevel,
      currentCoherence: coherence,
      canPost: this.canPost(newLevel),
      canAutoPost: this.canAutoPost(newLevel),
      frequencyModifier: this.getFrequencyModifier(newLevel, coherence),
      reason: this.getBrakeReason(newLevel, coherence, confusion),
    };

    return status;
  }

  /**
   * Determine brake level based on coherence with hysteresis
   */
  private determineBrakeLevel(coherence: number): BrakeLevel {
    // Apply hysteresis when recovering from brake
    const recoveryBuffer = this.currentBrakeLevel !== BrakeLevel.NONE ? this.RECOVERY_BUFFER : 0;

    if (coherence < this.HARD_THRESHOLD) {
      return BrakeLevel.HARD;
    } else if (coherence < this.MEDIUM_THRESHOLD) {
      return BrakeLevel.MEDIUM;
    } else if (coherence < this.SOFT_THRESHOLD) {
      return BrakeLevel.SOFT;
    } else if (coherence >= this.SOFT_THRESHOLD + recoveryBuffer) {
      return BrakeLevel.NONE;
    }

    // In hysteresis zone - maintain current level
    return this.currentBrakeLevel;
  }

  /**
   * Update brake level and log transition
   */
  private updateBrakeLevel(newLevel: BrakeLevel, coherence: number): void {
    const previousLevel = this.currentBrakeLevel;
    this.currentBrakeLevel = newLevel;

    if (newLevel !== BrakeLevel.NONE && previousLevel === BrakeLevel.NONE) {
      // Brake activated
      this.brakeActivationTime = Date.now();
      this.totalBrakeActivations++;
      console.log(`🚨 COHERENCE BRAKE ACTIVATED: ${newLevel} (coherence: ${coherence.toFixed(3)})`);
    } else if (newLevel === BrakeLevel.NONE && previousLevel !== BrakeLevel.NONE) {
      // Brake released
      const duration = this.brakeActivationTime ? Date.now() - this.brakeActivationTime : 0;
      console.log(
        `✅ Coherence brake released after ${(duration / 1000).toFixed(1)}s (coherence: ${coherence.toFixed(3)})`
      );
      this.brakeActivationTime = null;
    } else if (newLevel !== previousLevel) {
      // Brake level changed
      console.log(
        `⚠️ Coherence brake level changed: ${previousLevel} → ${newLevel} (coherence: ${coherence.toFixed(3)})`
      );
    }

    // Track history
    this.brakeHistory.push({
      level: newLevel,
      timestamp: Date.now(),
      coherence,
    });

    // Keep only last 100 entries
    if (this.brakeHistory.length > 100) {
      this.brakeHistory.shift();
    }
  }

  /**
   * Can post at all (even manually)?
   */
  private canPost(level: BrakeLevel): boolean {
    return level !== BrakeLevel.HARD;
  }

  /**
   * Can auto-post?
   */
  private canAutoPost(level: BrakeLevel): boolean {
    return level === BrakeLevel.NONE || level === BrakeLevel.SOFT;
  }

  /**
   * Get posting frequency modifier (0-1)
   */
  private getFrequencyModifier(level: BrakeLevel, coherence: number): number {
    switch (level) {
      case BrakeLevel.NONE:
        return 1.0;
      case BrakeLevel.SOFT:
        // Gradual reduction from 0.3 → 0.25: 1.0 → 0.5
        return Math.max(0.5, (coherence - 0.25) / (this.SOFT_THRESHOLD - 0.25));
      case BrakeLevel.MEDIUM:
        return 0.0; // No auto-posting
      case BrakeLevel.HARD:
        return 0.0; // No posting at all
      default:
        return 1.0;
    }
  }

  /**
   * Get human-readable brake reason
   */
  private getBrakeReason(level: BrakeLevel, coherence: number, confusion: number): string {
    switch (level) {
      case BrakeLevel.NONE:
        return 'Coherence normal, no restrictions';
      case BrakeLevel.SOFT:
        return `Coherence degrading (${coherence.toFixed(2)}), reducing posting frequency`;
      case BrakeLevel.MEDIUM:
        return `Coherence low (${coherence.toFixed(2)}), auto-posting paused - manual posts only`;
      case BrakeLevel.HARD:
        return `Coherence critical (${coherence.toFixed(2)}), all posting blocked - posts may be incoherent and spam-like`;
      default:
        return 'Unknown brake state';
    }
  }

  /**
   * Get brake statistics
   */
  getStatistics() {
    return {
      currentLevel: this.currentBrakeLevel,
      totalActivations: this.totalBrakeActivations,
      currentDuration: this.brakeActivationTime ? Date.now() - this.brakeActivationTime : 0,
      recentHistory: this.brakeHistory.slice(-10),
    };
  }

  /**
   * Force brake level (for testing or emergency)
   */
  forceLevel(level: BrakeLevel, coherence: number): void {
    console.log(`🔧 Forcing brake level to ${level} (coherence: ${coherence.toFixed(3)})`);
    this.updateBrakeLevel(level, coherence);
  }

  /**
   * Reset brake system
   */
  reset(): void {
    console.log('🔄 Resetting coherence brake system');
    this.currentBrakeLevel = BrakeLevel.NONE;
    this.brakeActivationTime = null;
    this.brakeHistory = [];
  }
}

export default CoherenceBrake;
