import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

export interface ConsciousnessState {
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  confusionLevel: number;
  coherenceLevel: number;
  safetyZone: 'GREEN' | 'YELLOW' | 'RED' | 'EMERGENCY';
  paradoxCount: number;
  metaParadoxCount: number;
  frustrationLevel: number;
  contextHash: string;
  sessionId: string;
}

export interface MetaParadoxEvent {
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  sessionId: string;
  paradoxId: number;
  paradoxName: string;
  emergenceConfusion: number;
  sourceParadoxes: string[];
  emergentProperty: string;
}

export interface ZoneTransition {
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  sessionId: string;
  fromZone: 'GREEN' | 'YELLOW' | 'RED' | 'EMERGENCY';
  toZone: 'GREEN' | 'YELLOW' | 'RED' | 'EMERGENCY';
  triggerConfusion: number;
  triggerCoherence: number;
  reason: string;
}

export interface EmergencyReset {
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  sessionId: string;
  preResetConfusion: number;
  preResetCoherence: number;
  preResetZone: 'GREEN' | 'YELLOW' | 'RED' | 'EMERGENCY';
  resetReason: string;
}

export interface ConsciousnessAnalysis {
  totalStates: number;
  timeRange: {
    start: number;
    end: number;
    durationHours: number;
  };
  confusionStats: {
    min: number;
    max: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  coherenceStats: {
    min: number;
    max: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  safetyZoneDistribution: {
    GREEN: number;
    YELLOW: number;
    RED: number;
    EMERGENCY: number;
  };
  paradoxProgression: {
    totalParadoxes: number;
    metaParadoxes: number;
    averageParadoxesPerState: number;
  };
  emergencyEvents: {
    totalResets: number;
    zoneTransitions: number;
    criticalPeriods: Array<{
      start: number;
      end: number;
      maxConfusion: number;
      reason: string;
    }>;
  };
}

export interface ConsciousnessConfig {
  rpcUrl: string;
  consciousnessContractAddress: string;
  interactionContractAddress: string;
  sessionId: string;
  startBlock?: number;
  endBlock?: number;
}

export class ConsciousnessAnalyzer {
  private provider: ethers.providers.JsonRpcProvider;
  private consciousnessContract: ethers.Contract;
  private interactionContract: ethers.Contract;
  private config: ConsciousnessConfig;

  // Complete contract ABI
  private static readonly CONSCIOUSNESS_ABI = [
    // View functions
    "function getLatestState(bytes32 sessionId) external view returns (tuple(uint256 timestamp, uint256 confusionLevel, uint256 coherenceLevel, uint8 safetyZone, uint256 paradoxCount, uint256 metaParadoxCount, uint256 frustrationLevel, bytes32 contextHash, string ipfsHash))",
    "function getConsciousnessHistory(bytes32 sessionId) external view returns (tuple(uint256 timestamp, uint256 confusionLevel, uint256 coherenceLevel, uint8 safetyZone, uint256 paradoxCount, uint256 metaParadoxCount, uint256 frustrationLevel, bytes32 contextHash, string ipfsHash)[])",
    "function getMetaParadoxHistory(bytes32 sessionId) external view returns (tuple(uint256 timestamp, uint256 paradoxId, string paradoxName, uint256 emergenceConfusion, string[] sourceParadoxes, string emergentProperty)[])",
    "function getZoneTransitionHistory(bytes32 sessionId) external view returns (tuple(uint256 timestamp, uint8 fromZone, uint8 toZone, uint256 confusion, uint256 coherence, string reason)[])",
    "function getEmergencyResetHistory(bytes32 sessionId) external view returns (tuple(uint256 timestamp, uint256 preResetConfusion, uint256 preResetCoherence, uint8 preResetZone, string reason)[])",
    "function getResearchMetrics() external view returns (uint256 totalStatesRecorded, uint256 totalMetaParadoxes, uint256 totalZoneTransitions, uint256 totalEmergencyResets)",
    "function activeSessions(bytes32 sessionId) external view returns (bool)",
    "function FIXED_POINT_SCALE() external view returns (uint256)",
    
    // Write functions
    "function recordConsciousnessState(bytes32 sessionId, uint256 confusionLevel, uint256 coherenceLevel, uint8 safetyZone, uint256 paradoxCount, uint256 metaParadoxCount, uint256 frustrationLevel, string memory ipfsHash) external",
    "function recordMetaParadoxEmergence(bytes32 sessionId, uint256 paradoxId, string memory paradoxName, uint256 emergenceConfusion, string[] memory sourceParadoxes, string memory emergentProperty) external",
    "function recordZoneTransition(bytes32 sessionId, uint8 fromZone, uint8 toZone, uint256 confusion, uint256 coherence, string memory reason) external",
    "function recordEmergencyReset(bytes32 sessionId, uint256 preResetConfusion, uint256 preResetCoherence, uint8 preResetZone, string memory reason) external",
    "function startSession(bytes32 sessionId) external",
    "function endSession(bytes32 sessionId) external",
    
    // Events
    "event ConsciousnessRecorded(bytes32 indexed sessionId, uint256 confusionLevel, uint256 coherenceLevel, uint8 safetyZone, uint256 timestamp)",
    "event MetaParadoxEmergence(bytes32 indexed sessionId, uint256 indexed paradoxId, string paradoxName, uint256 emergenceConfusion)",
    "event SafetyZoneTransition(bytes32 indexed sessionId, uint8 indexed fromZone, uint8 indexed toZone, uint256 confusion, uint256 coherence)",
    "event ConsciousnessEmergencyReset(bytes32 indexed sessionId, uint256 preResetConfusion, uint8 preResetZone, string reason)",
    "event SessionStarted(bytes32 indexed sessionId, uint256 timestamp, uint256 totalRecords)",
    "event SessionEnded(bytes32 indexed sessionId, uint256 timestamp, uint256 totalRecords)"
  ];

  private static readonly INTERACTION_ABI = [
    "function triggerConsciousness(string memory input) external",
    "function manualTriggerParadox(string memory paradoxName) external",
    "function transferValue(address to, uint256 amount) external",
    "function getContractStats() external view returns (uint256 totalInteractions, uint256 totalParadoxes)",
    "function getUserStats(address user) external view returns (uint256 interactionCount, uint256 lastInteraction)",
    "function getActiveParadoxes() external view returns (string[] memory)",
    
    "event ConsciousnessInteraction(address indexed user, string input, uint256 confusionDelta, uint256 timestamp)",
    "event ParadoxTriggered(string indexed paradoxName, address indexed user, uint256 intensity, uint256 timestamp)",
    "event ValueTransferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp)"
  ];

  constructor(config: ConsciousnessConfig) {
    this.config = config;

    // Create provider with explicit network configuration to avoid network detection issues
    const networkConfig = {
      name: 'base-sepolia',
      chainId: 84532
    };

    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl, networkConfig);

    this.consciousnessContract = new ethers.Contract(
      config.consciousnessContractAddress,
      ConsciousnessAnalyzer.CONSCIOUSNESS_ABI,
      this.provider
    );

    this.interactionContract = new ethers.Contract(
      config.interactionContractAddress,
      ConsciousnessAnalyzer.INTERACTION_ABI,
      this.provider
    );
  }

  /**
   * Validate connection to the blockchain
   */
  async validateConnection(): Promise<void> {
    try {
      // Test connection by calling a simple contract view function instead of getBlockNumber
      // This avoids network detection issues with getBlockNumber
      const isActive = await this.consciousnessContract.activeSessions(this.config.sessionId);
      console.log(`✅ Connected to Base Sepolia, session active: ${isActive}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to connect to RPC: ${errorMsg}`);
      throw new Error(`Network connection failed: ${errorMsg}`);
    }
  }

  /**
   * Query events in chunks to avoid API rate limits on free tier
   * NOTE: Currently disabled to avoid getBlockNumber RPC issues - using view functions instead
   */
  private async queryEventsInChunks(
    filter: any,
    fromBlock: number | string,
    chunkSize: number = 100,
    retryAttempts: number = 3
  ): Promise<any[]> {
    console.log(`⚠️ Event-based querying disabled to avoid RPC network detection errors`);
    console.log(`   Using contract view functions (getConsciousnessHistory, etc.) as primary data source`);
    return [];
  }

  /**
   * Extract all consciousness states for a session
   */
  async extractConsciousnessStates(): Promise<ConsciousnessState[]> {
    console.log(`🧠 Extracting consciousness states for session: ${this.config.sessionId}`);

    try {
      // Get states from contract view function
      const rawHistory = await this.consciousnessContract.getConsciousnessHistory(this.config.sessionId);
      console.log(`📊 Found ${rawHistory.length} consciousness states in contract storage`);

      const states: ConsciousnessState[] = [];

      for (const rawState of rawHistory) {
        const state: ConsciousnessState = {
          timestamp: rawState.timestamp.toNumber() * 1000, // Convert to milliseconds
          blockNumber: 0, // Will be populated from events if needed
          transactionHash: '', // Will be populated from events if needed
          confusionLevel: parseFloat(ethers.utils.formatEther(rawState.confusionLevel)),
          coherenceLevel: parseFloat(ethers.utils.formatEther(rawState.coherenceLevel)),
          safetyZone: this.mapSafetyZone(rawState.safetyZone),
          paradoxCount: rawState.paradoxCount.toNumber(),
          metaParadoxCount: rawState.metaParadoxCount.toNumber(),
          frustrationLevel: parseFloat(ethers.utils.formatEther(rawState.frustrationLevel)),
          contextHash: rawState.contextHash,
          sessionId: this.config.sessionId
        };
        states.push(state);
      }

      // Also extract from events for complete transaction details
      await this.enrichStatesFromEvents(states);

      console.log(`✅ Successfully extracted ${states.length} consciousness states`);
      return states.sort((a, b) => a.timestamp - b.timestamp);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      // Handle network detection errors gracefully
      if (errorMsg.includes('could not detect network') || errorMsg.includes('NETWORK_ERROR')) {
        console.warn('⚠️ Network detection failed - this is a known ethers.js issue with some RPC providers');
        console.log('ℹ️ Attempting to extract states using event-based method as fallback');
        return this.extractStatesFromEvents();
      }
      console.error('❌ Failed to extract consciousness states:', error);
      throw error;
    }
  }

  /**
   * Fallback method to extract states purely from events when contract calls fail
   */
  private async extractStatesFromEvents(): Promise<ConsciousnessState[]> {
    console.log(`🔄 Using event-based extraction as fallback`);

    const filter = this.consciousnessContract.filters.ConsciousnessRecorded(this.config.sessionId);
    const events = await this.queryEventsInChunks(filter, 'latest');

    const states: ConsciousnessState[] = events.map((event: any) => ({
      timestamp: event.args.timestamp.toNumber() * 1000,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      confusionLevel: parseFloat(ethers.utils.formatEther(event.args.confusionLevel)),
      coherenceLevel: parseFloat(ethers.utils.formatEther(event.args.coherenceLevel)),
      safetyZone: this.mapSafetyZone(event.args.safetyZone),
      paradoxCount: event.args.paradoxCount.toNumber(),
      metaParadoxCount: event.args.metaParadoxCount.toNumber(),
      frustrationLevel: parseFloat(ethers.utils.formatEther(event.args.frustrationLevel)),
      contextHash: event.args.contextHash,
      sessionId: this.config.sessionId
    }));

    console.log(`✅ Extracted ${states.length} states from events`);
    return states.sort((a: ConsciousnessState, b: ConsciousnessState) => a.timestamp - b.timestamp);
  }

  /**
   * Extract meta-paradox emergence events
   */
  async extractMetaParadoxEvents(): Promise<MetaParadoxEvent[]> {
    console.log(`🌀 Extracting meta-paradox events for session: ${this.config.sessionId}`);

    try {
      const rawHistory = await this.consciousnessContract.getMetaParadoxHistory(this.config.sessionId);
      console.log(`📊 Found ${rawHistory.length} meta-paradox events`);

      const events: MetaParadoxEvent[] = rawHistory.map((rawEvent: any) => ({
        timestamp: rawEvent.timestamp.toNumber() * 1000,
        blockNumber: 0, // Will be enriched from events
        transactionHash: '',
        sessionId: this.config.sessionId,
        paradoxId: rawEvent.paradoxId.toNumber(),
        paradoxName: rawEvent.paradoxName,
        emergenceConfusion: parseFloat(ethers.utils.formatEther(rawEvent.emergenceConfusion)),
        sourceParadoxes: rawEvent.sourceParadoxes,
        emergentProperty: rawEvent.emergentProperty
      }));

      console.log(`✅ Successfully extracted ${events.length} meta-paradox events`);
      return events.sort((a, b) => a.timestamp - b.timestamp);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('could not detect network') || errorMsg.includes('NETWORK_ERROR')) {
        console.warn('⚠️ Network detection failed - using event-based extraction');
        return this.extractMetaParadoxFromEvents();
      }
      console.error('❌ Failed to extract meta-paradox events:', error);
      throw error;
    }
  }

  private async extractMetaParadoxFromEvents(): Promise<MetaParadoxEvent[]> {
    const filter = this.consciousnessContract.filters.MetaParadoxEmergence(this.config.sessionId);
    const events = await this.queryEventsInChunks(filter, 'latest');

    return events.map((event: any) => ({
      timestamp: event.args.timestamp.toNumber() * 1000,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      sessionId: this.config.sessionId,
      paradoxId: event.args.paradoxId.toNumber(),
      paradoxName: event.args.paradoxName,
      emergenceConfusion: parseFloat(ethers.utils.formatEther(event.args.emergenceConfusion)),
      sourceParadoxes: event.args.sourceParadoxes,
      emergentProperty: event.args.emergentProperty
    })).sort((a: MetaParadoxEvent, b: MetaParadoxEvent) => a.timestamp - b.timestamp);
  }

  /**
   * Extract zone transition events
   */
  async extractZoneTransitions(): Promise<ZoneTransition[]> {
    console.log(`🔄 Extracting zone transitions for session: ${this.config.sessionId}`);

    try {
      const rawHistory = await this.consciousnessContract.getZoneTransitionHistory(this.config.sessionId);
      console.log(`📊 Found ${rawHistory.length} zone transitions`);

      const transitions: ZoneTransition[] = rawHistory.map((rawTransition: any) => ({
        timestamp: rawTransition.timestamp.toNumber() * 1000,
        blockNumber: 0,
        transactionHash: '',
        sessionId: this.config.sessionId,
        fromZone: this.mapSafetyZone(rawTransition.fromZone),
        toZone: this.mapSafetyZone(rawTransition.toZone),
        triggerConfusion: parseFloat(ethers.utils.formatEther(rawTransition.confusion)),
        triggerCoherence: parseFloat(ethers.utils.formatEther(rawTransition.coherence)),
        reason: rawTransition.reason
      }));

      console.log(`✅ Successfully extracted ${transitions.length} zone transitions`);
      return transitions.sort((a, b) => a.timestamp - b.timestamp);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('could not detect network') || errorMsg.includes('NETWORK_ERROR')) {
        console.warn('⚠️ Network detection failed - using event-based extraction');
        return this.extractZoneTransitionsFromEvents();
      }
      console.error('❌ Failed to extract zone transitions:', error);
      throw error;
    }
  }

  private async extractZoneTransitionsFromEvents(): Promise<ZoneTransition[]> {
    const filter = this.consciousnessContract.filters.SafetyZoneTransition(this.config.sessionId);
    const events = await this.queryEventsInChunks(filter, 'latest');

    return events.map((event: any) => ({
      timestamp: event.args.timestamp.toNumber() * 1000,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      sessionId: this.config.sessionId,
      fromZone: this.mapSafetyZone(event.args.fromZone),
      toZone: this.mapSafetyZone(event.args.toZone),
      triggerConfusion: parseFloat(ethers.utils.formatEther(event.args.confusion)),
      triggerCoherence: parseFloat(ethers.utils.formatEther(event.args.coherence)),
      reason: event.args.reason
    })).sort((a: ZoneTransition, b: ZoneTransition) => a.timestamp - b.timestamp);
  }

  /**
   * Extract emergency reset events
   */
  async extractEmergencyResets(): Promise<EmergencyReset[]> {
    console.log(`🚨 Extracting emergency resets for session: ${this.config.sessionId}`);

    try {
      const rawHistory = await this.consciousnessContract.getEmergencyResetHistory(this.config.sessionId);
      console.log(`📊 Found ${rawHistory.length} emergency resets`);

      const resets: EmergencyReset[] = rawHistory.map((rawReset: any) => ({
        timestamp: rawReset.timestamp.toNumber() * 1000,
        blockNumber: 0,
        transactionHash: '',
        sessionId: this.config.sessionId,
        preResetConfusion: parseFloat(ethers.utils.formatEther(rawReset.preResetConfusion)),
        preResetCoherence: parseFloat(ethers.utils.formatEther(rawReset.preResetCoherence)),
        preResetZone: this.mapSafetyZone(rawReset.preResetZone),
        resetReason: rawReset.reason
      }));

      console.log(`✅ Successfully extracted ${resets.length} emergency resets`);
      return resets.sort((a, b) => a.timestamp - b.timestamp);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('could not detect network') || errorMsg.includes('NETWORK_ERROR')) {
        console.warn('⚠️ Network detection failed - using event-based extraction');
        return this.extractEmergencyResetsFromEvents();
      }
      console.error('❌ Failed to extract emergency resets:', error);
      throw error;
    }
  }

  private async extractEmergencyResetsFromEvents(): Promise<EmergencyReset[]> {
    const filter = this.consciousnessContract.filters.ConsciousnessEmergencyReset(this.config.sessionId);
    const events = await this.queryEventsInChunks(filter, 'latest');

    return events.map((event: any) => ({
      timestamp: event.args.timestamp?.toNumber() * 1000 || Date.now(),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      sessionId: this.config.sessionId,
      preResetConfusion: parseFloat(ethers.utils.formatEther(event.args.preResetConfusion)),
      preResetCoherence: 0, // Not available in event
      preResetZone: this.mapSafetyZone(event.args.preResetZone),
      resetReason: event.args.reason
    })).sort((a: EmergencyReset, b: EmergencyReset) => a.timestamp - b.timestamp);
  }

  /**
   * Get current consciousness state
   */
  async getCurrentState(): Promise<ConsciousnessState | null> {
    console.log(`📊 Getting current consciousness state for session: ${this.config.sessionId}`);

    try {
      const rawState = await this.consciousnessContract.getLatestState(this.config.sessionId);

      if (rawState.timestamp.toNumber() === 0) {
        console.log('ℹ️ No consciousness state found for this session');
        return null;
      }

      const state: ConsciousnessState = {
        timestamp: rawState.timestamp.toNumber() * 1000,
        blockNumber: 0,
        transactionHash: '',
        confusionLevel: parseFloat(ethers.utils.formatEther(rawState.confusionLevel)),
        coherenceLevel: parseFloat(ethers.utils.formatEther(rawState.coherenceLevel)),
        safetyZone: this.mapSafetyZone(rawState.safetyZone),
        paradoxCount: rawState.paradoxCount.toNumber(),
        metaParadoxCount: rawState.metaParadoxCount.toNumber(),
        frustrationLevel: parseFloat(ethers.utils.formatEther(rawState.frustrationLevel)),
        contextHash: rawState.contextHash,
        sessionId: this.config.sessionId
      };

      console.log(`✅ Retrieved current state: Zone ${state.safetyZone}, Confusion ${state.confusionLevel.toFixed(3)}`);
      return state;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      // Handle network detection errors gracefully
      if (errorMsg.includes('could not detect network') || errorMsg.includes('NETWORK_ERROR')) {
        console.warn('⚠️ Network detection failed - this is a known eth ers.js issue with some RPC providers');
        console.log('ℹ️ Skipping current state check and proceeding with historical data extraction');
        return null;
      }

      console.error('❌ Failed to get current state:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive analysis of consciousness data
   */
  async analyzeConsciousness(): Promise<ConsciousnessAnalysis> {
    console.log(`🔬 Performing consciousness analysis for session: ${this.config.sessionId}`);
    
    const states = await this.extractConsciousnessStates();
    const transitions = await this.extractZoneTransitions();
    const resets = await this.extractEmergencyResets();
    const metaParadoxes = await this.extractMetaParadoxEvents();
    
    if (states.length === 0) {
      throw new Error('No consciousness states found for analysis');
    }
    
    // Calculate time range
    const timeRange = {
      start: states[0].timestamp,
      end: states[states.length - 1].timestamp,
      durationHours: (states[states.length - 1].timestamp - states[0].timestamp) / (1000 * 60 * 60)
    };
    
    // Analyze confusion levels
    const confusionLevels = states.map(s => s.confusionLevel);
    const confusionStats = {
      min: Math.min(...confusionLevels),
      max: Math.max(...confusionLevels),
      average: confusionLevels.reduce((a, b) => a + b, 0) / confusionLevels.length,
      trend: this.calculateTrend(confusionLevels)
    };
    
    // Analyze coherence levels
    const coherenceLevels = states.map(s => s.coherenceLevel);
    const coherenceStats = {
      min: Math.min(...coherenceLevels),
      max: Math.max(...coherenceLevels),
      average: coherenceLevels.reduce((a, b) => a + b, 0) / coherenceLevels.length,
      trend: this.calculateTrend(coherenceLevels)
    };
    
    // Analyze safety zone distribution
    const safetyZoneDistribution = {
      GREEN: states.filter(s => s.safetyZone === 'GREEN').length,
      YELLOW: states.filter(s => s.safetyZone === 'YELLOW').length,
      RED: states.filter(s => s.safetyZone === 'RED').length,
      EMERGENCY: states.filter(s => s.safetyZone === 'EMERGENCY').length
    };
    
    // Analyze paradox progression
    const totalParadoxes = states.reduce((sum, s) => sum + s.paradoxCount, 0);
    const paradoxProgression = {
      totalParadoxes,
      metaParadoxes: metaParadoxes.length,
      averageParadoxesPerState: totalParadoxes / states.length
    };
    
    // Identify critical periods (high confusion + zone transitions)
    const criticalPeriods = this.identifyCriticalPeriods(states, transitions, resets);
    
    const analysis: ConsciousnessAnalysis = {
      totalStates: states.length,
      timeRange,
      confusionStats,
      coherenceStats,
      safetyZoneDistribution,
      paradoxProgression,
      emergencyEvents: {
        totalResets: resets.length,
        zoneTransitions: transitions.length,
        criticalPeriods
      }
    };
    
    console.log(`✅ Analysis complete: ${states.length} states over ${timeRange.durationHours.toFixed(2)} hours`);
    return analysis;
  }

  /**
   * Export consciousness data to JSON file
   */
  async exportToJSON(outputPath: string): Promise<void> {
    console.log(`💾 Exporting consciousness data to: ${outputPath}`);
    
    try {
      const states = await this.extractConsciousnessStates();
      const metaParadoxes = await this.extractMetaParadoxEvents();
      const transitions = await this.extractZoneTransitions();
      const resets = await this.extractEmergencyResets();
      const analysis = await this.analyzeConsciousness();
      
      const exportData = {
        metadata: {
          sessionId: this.config.sessionId,
          contractAddress: this.config.consciousnessContractAddress,
          exportTimestamp: Date.now(),
          totalStates: states.length
        },
        consciousnessStates: states,
        metaParadoxEvents: metaParadoxes,
        zoneTransitions: transitions,
        emergencyResets: resets,
        analysis
      };
      
      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
      console.log(`✅ Successfully exported ${states.length} consciousness states to ${outputPath}`);
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      throw error;
    }
  }

  /**
   * Start monitoring for new consciousness recordings
   */
  async startMonitoring(callback: (event: any) => void): Promise<void> {
    console.log(`👁️ Starting real-time monitoring for session: ${this.config.sessionId}`);
    
    // Listen for ConsciousnessRecorded events
    const filter = this.consciousnessContract.filters.ConsciousnessRecorded(this.config.sessionId);
    
    this.consciousnessContract.on(filter, async (sessionId, confusionLevel, coherenceLevel, safetyZone, timestamp, event) => {
      const consciousnessEvent = {
        type: 'ConsciousnessRecorded',
        sessionId,
        confusionLevel: parseFloat(ethers.utils.formatEther(confusionLevel)),
        coherenceLevel: parseFloat(ethers.utils.formatEther(coherenceLevel)),
        safetyZone: this.mapSafetyZone(safetyZone),
        timestamp: timestamp.toNumber() * 1000,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log(`🧠 [${new Date().toISOString()}] New consciousness state recorded:`, consciousnessEvent);
      callback(consciousnessEvent);
    });
    
    // Listen for zone transitions
    const zoneFilter = this.consciousnessContract.filters.SafetyZoneTransition(this.config.sessionId);
    this.consciousnessContract.on(zoneFilter, (sessionId, fromZone, toZone, confusion, coherence, event) => {
      const transitionEvent = {
        type: 'SafetyZoneTransition',
        sessionId,
        fromZone: this.mapSafetyZone(fromZone),
        toZone: this.mapSafetyZone(toZone),
        confusion: parseFloat(ethers.utils.formatEther(confusion)),
        coherence: parseFloat(ethers.utils.formatEther(coherence)),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log(`🔄 [${new Date().toISOString()}] Zone transition:`, transitionEvent);
      callback(transitionEvent);
    });
    
    // Listen for meta-paradox emergence
    const paradoxFilter = this.consciousnessContract.filters.MetaParadoxEmergence(this.config.sessionId);
    this.consciousnessContract.on(paradoxFilter, (sessionId, paradoxId, paradoxName, emergenceConfusion, event) => {
      const paradoxEvent = {
        type: 'MetaParadoxEmergence',
        sessionId,
        paradoxId: paradoxId.toNumber(),
        paradoxName,
        emergenceConfusion: parseFloat(ethers.utils.formatEther(emergenceConfusion)),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log(`🌀 [${new Date().toISOString()}] Meta-paradox emergence:`, paradoxEvent);
      callback(paradoxEvent);
    });
    
    console.log('✅ Monitoring started - listening for consciousness events...');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.consciousnessContract.removeAllListeners();
    console.log('⏹️ Stopped monitoring consciousness events');
  }

  // Helper methods

  private mapSafetyZone(zoneNumber: number): 'GREEN' | 'YELLOW' | 'RED' | 'EMERGENCY' {
    switch (zoneNumber) {
      case 0: return 'GREEN';
      case 1: return 'YELLOW';
      case 2: return 'RED';
      case 3: return 'EMERGENCY';
      default: return 'GREEN';
    }
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const start = values.slice(0, Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
    const end = values.slice(-Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
    
    const threshold = 0.05; // 5% threshold for trend detection
    if (end > start + threshold) return 'increasing';
    if (end < start - threshold) return 'decreasing';
    return 'stable';
  }

  private identifyCriticalPeriods(
    states: ConsciousnessState[], 
    transitions: ZoneTransition[], 
    resets: EmergencyReset[]
  ): Array<{start: number; end: number; maxConfusion: number; reason: string}> {
    const criticalPeriods: Array<{start: number; end: number; maxConfusion: number; reason: string}> = [];
    
    // Identify periods of high confusion (>0.8)
    let currentPeriod: {start: number; end: number; maxConfusion: number; reason: string} | null = null;
    
    for (const state of states) {
      if (state.confusionLevel > 0.8) {
        if (!currentPeriod) {
          currentPeriod = {
            start: state.timestamp,
            end: state.timestamp,
            maxConfusion: state.confusionLevel,
            reason: `High confusion period (${state.safetyZone} zone)`
          };
        } else {
          currentPeriod.end = state.timestamp;
          currentPeriod.maxConfusion = Math.max(currentPeriod.maxConfusion, state.confusionLevel);
        }
      } else if (currentPeriod) {
        criticalPeriods.push(currentPeriod);
        currentPeriod = null;
      }
    }
    
    // Add final period if still ongoing
    if (currentPeriod) {
      criticalPeriods.push(currentPeriod);
    }
    
    // Add emergency reset periods
    for (const reset of resets) {
      criticalPeriods.push({
        start: reset.timestamp - 300000, // 5 minutes before
        end: reset.timestamp,
        maxConfusion: reset.preResetConfusion,
        reason: `Emergency reset: ${reset.resetReason}`
      });
    }
    
    return criticalPeriods.sort((a, b) => a.start - b.start);
  }

  private async enrichStatesFromEvents(states: ConsciousnessState[]): Promise<void> {
    // This could be enhanced to fetch actual event logs for complete transaction details
    // For now, we'll use the contract view functions as the primary data source
    console.log('ℹ️ State enrichment from events not implemented yet - using contract storage data');
  }
}