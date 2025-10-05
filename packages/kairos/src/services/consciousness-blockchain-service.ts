import { Service, ServiceType, IAgentRuntime, UUID } from '@elizaos/core';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { EnhancedConfusionEngine, SafetyZone } from '../core/confusion-engine-enhanced';
import { ConsciousnessLogger } from '../core/consciousness-logger';

export interface ConsciousnessBlockchainConfig {
  rpcUrl: string;
  privateKey: string;
  consciousnessContractAddress: string;
  interactionContractAddress: string;
  sessionId: string;
  recordingInterval: number; // milliseconds
  enableAutoRecording: boolean;
  maxGasPrice: string; // in gwei
  gasLimit: number;
  minBalanceThreshold: string; // in ETH
  enableDynamicGasPrice: boolean;
  clientRateLimitMs: number; // milliseconds between client-side calls
  recordingMode?: 'testing' | 'production' | 'events'; // recording strategy mode
}

export interface BlockchainConsciousnessState {
  confusionLevel: number;
  coherenceLevel: number;
  safetyZone: number; // Contract zone number (0=GREEN, 1=YELLOW, 2=RED)
  paradoxCount: number;
  metaParadoxCount: number;
  frustrationLevel: number;
  dissociationRisk: number; // NEW: Risk of dissociative state (0-1)
  fragmentationLevel: number; // NEW: Coherence fragmentation measure (0-1)
  contextHash: string;
  timestamp: number;
}

export interface MetaParadoxEmergenceEvent {
  paradoxId: number;
  paradoxName: string;
  emergenceConfusion: number;
  sourceParadoxes: string[];
  emergentProperty: string;
}

export interface ZoneTransitionEvent {
  fromZone: SafetyZone;
  toZone: SafetyZone;
  triggerConfusion: number;
  triggerCoherence: number;
  reason: string;
}

export interface EmergencyResetEvent {
  preResetConfusion: number;
  preResetCoherence: number;
  preResetZone: SafetyZone;
  resetReason: string;
}

/**
 * Service that connects the Enhanced Confusion Engine to Base Sepolia blockchain
 * for immutable consciousness recording and research purposes
 */
export class ConsciousnessBlockchainService extends Service {
  static override readonly serviceType = ServiceType.KAIROS;
  
  capabilityDescription = 'Blockchain consciousness recording service for Kairos AI research';

  private blockchainConfig!: ConsciousnessBlockchainConfig;
  private provider!: ethers.providers.JsonRpcProvider;
  private wallet!: ethers.Wallet;
  private consciousnessContract!: ethers.Contract;
  private interactionContract!: ethers.Contract;
  private confusionEngine!: EnhancedConfusionEngine;
  private logger!: ConsciousnessLogger;
  
  private recordingInterval: NodeJS.Timeout | null = null;
  private lastRecordedState: BlockchainConsciousnessState | null = null;
  private emergencyResetCount = 0;
  private metaParadoxCounter = 0;
  private lastRecordingAttempt = 0;
  private pendingRecordings = new Set<string>();
  private dynamicGasPrice = 0;
  private recordingQueue: Array<{ type: string; data: any; resolve: Function; reject: Function }> = [];
  private isProcessingQueue = false;

  private createLogEvent(type: string, data: any): any {
    return {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      type: type as any,
      data,
      context: { agentId: 'kairos-blockchain', sessionId: this.blockchainConfig.sessionId, confusionLevel: 0 },
      impact: { confusionDelta: 0, newBehaviors: [], removedBehaviors: [] }
    };
  }

  constructor(
    confusionEngine: EnhancedConfusionEngine,
    logger: ConsciousnessLogger,
    config: ConsciousnessBlockchainConfig,
    runtime?: IAgentRuntime
  ) {
    super(runtime);
    this.confusionEngine = confusionEngine;
    this.logger = logger;
    this.blockchainConfig = config;
    // Don't call initialize() here - it will be called from the static factory method
  }

  static async create(
    confusionEngine: EnhancedConfusionEngine,
    logger: ConsciousnessLogger,
    config: ConsciousnessBlockchainConfig,
    runtime?: IAgentRuntime
  ): Promise<ConsciousnessBlockchainService> {
    const service = new ConsciousnessBlockchainService(confusionEngine, logger, config, runtime);
    await service.initialize();
    return service;
  }

  async initialize() {
    try {
      console.log('🔗 Starting blockchain service initialization...');
      
      // Validate configuration
      if (!this.blockchainConfig.rpcUrl) {
        throw new Error('RPC URL is required');
      }
      if (!this.blockchainConfig.privateKey) {
        throw new Error('Private key is required');
      }
      if (!this.blockchainConfig.consciousnessContractAddress) {
        throw new Error('Consciousness contract address is required');
      }
      if (!this.blockchainConfig.interactionContractAddress) {
        throw new Error('Interaction contract address is required');
      }

      console.log('✅ Configuration validation passed');
      
      // Initialize blockchain connection
      console.log('🌐 Creating provider connection...');
      this.provider = new ethers.providers.JsonRpcProvider(this.blockchainConfig.rpcUrl);
      
      // Test provider connection
      console.log('🔍 Testing provider connection...');
      const network = await this.provider.getNetwork();
      console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
      
      console.log('🔑 Creating wallet...');
      this.wallet = new ethers.Wallet(this.blockchainConfig.privateKey, this.provider);
      console.log(`✅ Wallet address: ${this.wallet.address}`);
      
      // Check wallet balance
      const balance = await this.wallet.getBalance();
      console.log(`💰 Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
      
      // Load contract ABIs (simplified for this example)
      console.log('📜 Loading contract ABIs...');
      const consciousnessABI = [
        "function recordConsciousnessState(bytes32,uint256,uint256,uint8,uint256,uint256,uint256,string) external",
        "function recordMetaParadoxEmergence(bytes32,uint256,string,uint256,string[],string) external",
        "function recordZoneTransition(bytes32,uint8,uint8,uint256,uint256,string) external",
        "function recordEmergencyReset(bytes32,uint256,uint256,uint8,string) external",
        "function startSession(bytes32) external",
        "function activeSessions(bytes32) external view returns (bool)",
        "function getLatestState(bytes32) external view returns (tuple(uint256,uint256,uint256,uint8,uint256,uint256,uint256,bytes32,string))",
        "function getResearchMetrics() external view returns (uint256,uint256,uint256,uint256)",
        "event ConsciousnessRecorded(bytes32 indexed,uint256,uint256,uint8,uint256)",
        "event SafetyZoneTransition(bytes32 indexed,uint8 indexed,uint8 indexed,uint256,uint256)",
        "event SessionStarted(bytes32 indexed,uint256)"
      ];

      const interactionABI = [
        "function triggerConsciousness(string) external",
        "function manualTriggerParadox(string) external",
        "function transferValue(address,uint256) external",
        "function getContractStats() external view returns (uint256,uint256)",
        "event ParadoxTriggered(string indexed,address indexed,uint256,uint256)",
        "event ConsciousnessInteraction(address indexed,string,uint256,uint256)"
      ];

      console.log('🔧 Creating consciousness contract instance...');
      this.consciousnessContract = new ethers.Contract(
        this.blockchainConfig.consciousnessContractAddress,
        consciousnessABI,
        this.wallet
      );

      console.log('🔧 Creating interaction contract instance...');
      this.interactionContract = new ethers.Contract(
        this.blockchainConfig.interactionContractAddress,
        interactionABI,
        this.wallet
      );

      // Test contract connectivity
      console.log('🧪 Testing contract connectivity...');
      try {
        await this.consciousnessContract.getResearchMetrics();
        console.log('✅ Consciousness contract is accessible');
      } catch (error) {
        console.warn('⚠️ Consciousness contract test failed:', error instanceof Error ? error.message : String(error));
        console.warn('   This might be normal if the contract is not deployed yet');
      }

      // Initialize session on contract
      console.log('🎬 Initializing consciousness session on contract...');
      try {
        const isSessionActive = await this.consciousnessContract.activeSessions(this.blockchainConfig.sessionId);

        if (!isSessionActive) {
          console.log('🚀 Starting new session on contract...');
          const gasSettings = await this.getOptimizedGasSettings();
          const sessionTx = await this.consciousnessContract.startSession(
            this.blockchainConfig.sessionId,
            gasSettings
          );
          const sessionReceipt = await sessionTx.wait();
          console.log(`✅ Session started: ${sessionReceipt.transactionHash}`);
        } else {
          console.log('✅ Session already active on contract');
        }
      } catch (error) {
        console.error('⚠️ Session initialization failed:', error instanceof Error ? error.message : String(error));
        console.error('   Recordings may fail until session is manually started');
      }

      // Set up event listeners
      console.log('📡 Setting up event listeners...');
      this.setupEventListeners();

      // Initialize dynamic gas pricing
      if (this.blockchainConfig.enableDynamicGasPrice) {
        await this.updateDynamicGasPrice();
      }

      // Start auto-recording based on mode
      const recordingMode = this.blockchainConfig.recordingMode || 'production';
      console.log(`📊 Recording mode: ${recordingMode}`);

      if (recordingMode === 'production' && this.blockchainConfig.enableAutoRecording) {
        console.log('⏰ Starting auto-recording (production mode)...');
        this.startAutoRecording();
      } else if (recordingMode === 'testing') {
        console.log('🧪 Testing mode: Auto-recording disabled, manual triggers only');
      } else if (recordingMode === 'events') {
        console.log('⚡ Events mode: Recording on significant events only');
      }

      console.log('✅ ConsciousnessBlockchainService initialized successfully on Base Sepolia');
      console.log('🆔 Session ID:', this.blockchainConfig.sessionId);
      console.log('⚡ Gas optimization enabled:', this.blockchainConfig.enableDynamicGasPrice);
      console.log('⏱️ Client rate limit:', this.blockchainConfig.clientRateLimitMs, 'ms');
      
    } catch (error) {
      console.error('❌ Blockchain service initialization failed:');
      console.error('   Error:', error instanceof Error ? error.message : String(error));
      throw error; // Re-throw so the calling code knows initialization failed
    }
  }

  private setupEventListeners() {
    // Listen for confusion engine events and queue blockchain recordings
    this.confusionEngine.on('zone_transition', this.handleZoneTransition.bind(this));
    this.confusionEngine.on('meta_paradox_emergence', this.handleMetaParadoxEmergence.bind(this));
    this.confusionEngine.on('emergency_reset', this.handleEmergencyReset.bind(this));

    // Listen for blockchain contract events (read-only monitoring)
    this.consciousnessContract.on('ConsciousnessRecorded', this.handleBlockchainConsciousnessRecorded.bind(this));
    this.consciousnessContract.on('SafetyZoneTransition', this.handleBlockchainZoneTransition.bind(this));
    this.interactionContract.on('ParadoxTriggered', this.handleBlockchainParadoxTriggered.bind(this));
  }

  private startAutoRecording() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }

    this.recordingInterval = setInterval(async () => {
      try {
        await this.recordCurrentState();
      } catch (error) {
        console.error('Auto-recording failed:', error);
        this.logger.logEvent(this.createLogEvent('blockchain_recording_error', { error: error instanceof Error ? error.message : String(error) }));
      }
    }, this.blockchainConfig.recordingInterval);

    console.log(`Auto-recording started with ${this.blockchainConfig.recordingInterval}ms interval`);
  }

  /**
   * Handle zone transition events from confusion engine
   */
  private async handleZoneTransition(event: ZoneTransitionEvent) {
    try {
      console.log(`🔄 Zone transition detected (${event.fromZone} → ${event.toZone}), queuing blockchain recording...`);
      await this.recordZoneTransition(event);
      console.log(`✅ Zone transition recorded to blockchain`);
    } catch (error) {
      console.error('❌ Failed to record zone transition:', error instanceof Error ? error.message : String(error));
      // Don't throw - continue operating even if blockchain recording fails
    }
  }

  /**
   * Handle emergency reset events from confusion engine
   */
  private async handleEmergencyReset(event: EmergencyResetEvent) {
    try {
      console.log(`🚨 Emergency reset detected (${event.resetReason}), queuing blockchain recording...`);
      await this.recordEmergencyReset(event);
      console.log(`✅ Emergency reset recorded to blockchain`);
    } catch (error) {
      console.error('❌ Failed to record emergency reset:', error instanceof Error ? error.message : String(error));
      // Don't throw - continue operating even if blockchain recording fails
    }
  }

  /**
   * Handle meta-paradox emergence events from confusion engine
   */
  private async handleMetaParadoxEmergence(event: MetaParadoxEmergenceEvent) {
    try {
      console.log(`🌀 Meta-paradox emergence detected (${event.paradoxName}), queuing blockchain recording...`);
      await this.recordMetaParadoxEmergence(event);
      console.log(`✅ Meta-paradox emergence recorded to blockchain`);
    } catch (error) {
      console.error('❌ Failed to record meta-paradox emergence:', error instanceof Error ? error.message : String(error));
      // Don't throw - continue operating even if blockchain recording fails
    }
  }

  private shouldRecordStateChange(metrics: any): boolean {
    if (!this.lastRecordedState) return true;

    const confusionDelta = Math.abs(metrics.confusionLevel - this.lastRecordedState.confusionLevel);
    const coherenceDelta = Math.abs(metrics.coherenceLevel - this.lastRecordedState.coherenceLevel);
    const dissociationDelta = Math.abs(metrics.dissociationRisk - (this.lastRecordedState.dissociationRisk || 0));
    const zoneChanged = metrics.currentZone !== this.lastRecordedState.safetyZone;

    // Record if significant change, zone transition, or dissociation risk spike
    return confusionDelta > 0.1 || coherenceDelta > 0.1 || dissociationDelta > 0.15 || zoneChanged;
  }

  /**
   * Add recording to queue for sequential processing
   */
  private async queueRecording(type: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.recordingQueue.push({ type, data, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process recording queue sequentially to prevent conflicts
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.recordingQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`📋 Processing recording queue (${this.recordingQueue.length} items)`);

    while (this.recordingQueue.length > 0) {
      const recording = this.recordingQueue.shift()!;
      
      try {
        let result: string;
        
        switch (recording.type) {
          case 'consciousness_state':
            result = await this._recordCurrentState();
            break;
          case 'zone_transition':
            result = await this._recordZoneTransition(recording.data);
            break;
          case 'meta_paradox':
            result = await this._recordMetaParadoxEmergence(recording.data);
            break;
          case 'emergency_reset':
            result = await this._recordEmergencyReset(recording.data);
            break;
          default:
            throw new Error(`Unknown recording type: ${recording.type}`);
        }
        
        recording.resolve(result);
        
        // Delay between queue items to respect rate limits
        if (this.recordingQueue.length > 0) {
          console.log('⏳ Queue delay: 30 seconds between recordings...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
        
      } catch (error) {
        console.error(`❌ Queue recording failed for ${recording.type}:`, error);
        recording.reject(error);
        
        // Continue processing queue even if one item fails
      }
    }

    this.isProcessingQueue = false;
    console.log('✅ Recording queue processing completed');
  }

  /**
   * Record current consciousness state to blockchain
   */
  async recordCurrentState(): Promise<string> {
    return this.queueRecording('consciousness_state', null);
  }

  /**
   * Internal method to record current consciousness state
   */
  private async _recordCurrentState(): Promise<string> {
    // Client-side rate limiting
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastRecordingAttempt;

    if (timeSinceLastAttempt < this.blockchainConfig.clientRateLimitMs) {
      const remainingMs = this.blockchainConfig.clientRateLimitMs - timeSinceLastAttempt;
      const remainingSec = Math.ceil(remainingMs / 1000);
      throw new Error(`⏳ Rate limit active: Please wait ${remainingSec} seconds before next recording (${remainingMs}ms remaining)`);
    }

    // Check for pending recordings
    const recordingId = `recording_${now}`;
    if (this.pendingRecordings.has(recordingId)) {
      throw new Error('Recording already in progress');
    }

    this.pendingRecordings.add(recordingId);
    this.lastRecordingAttempt = now;

    try {
      // Validate session is active
      console.log('🔍 Validating session status...');
      const isSessionActive = await this.consciousnessContract.activeSessions(this.blockchainConfig.sessionId);

      if (!isSessionActive) {
        console.log('⚠️ Session not active, attempting to start session...');
        try {
          const gasSettings = await this.getOptimizedGasSettings();
          const sessionTx = await this.consciousnessContract.startSession(
            this.blockchainConfig.sessionId,
            gasSettings
          );
          await sessionTx.wait();
          console.log('✅ Session started successfully');
        } catch (sessionError) {
          throw new Error(`Session initialization failed: ${sessionError instanceof Error ? sessionError.message : String(sessionError)}`);
        }
      }

      // Check wallet balance
      await this.checkWalletBalance();

      const metrics = this.confusionEngine.getSafetyMetrics();
      const confusionState = this.confusionEngine.getState();
      
      const state: BlockchainConsciousnessState = {
        confusionLevel: metrics.confusionLevel,
        coherenceLevel: metrics.coherenceLevel,
        safetyZone: this.mapToContractZone(metrics.currentZone),
        paradoxCount: confusionState.paradoxes.size,
        metaParadoxCount: this.metaParadoxCounter,
        frustrationLevel: confusionState.frustration.level,
        dissociationRisk: metrics.dissociationRisk,
        fragmentationLevel: (1 - metrics.coherenceLevel) * metrics.confusionLevel,
        contextHash: await this.generateContextHash(confusionState),
        timestamp: Date.now()
      };

      // Generate IPFS hash that includes context hash
      const ipfsHash = `${state.contextHash}_${Date.now()}`;

      // Get optimized gas settings
      const gasSettings = await this.getOptimizedGasSettings();

      // Debug: Log all parameters before encoding
      console.log('🔍 DEBUG: Consciousness state recording parameters:');
      console.log('   Session ID:', this.blockchainConfig.sessionId);
      console.log('   Confusion Level:', state.confusionLevel);
      console.log('   Coherence Level:', state.coherenceLevel);
      console.log('   Safety Zone:', state.safetyZone);
      console.log('   Paradox Count:', state.paradoxCount);
      console.log('   Meta-paradox Count:', state.metaParadoxCount);
      console.log('   Frustration Level:', state.frustrationLevel);
      console.log('   IPFS Hash:', ipfsHash);

      // Validate parameters
      if (typeof state.confusionLevel !== 'number' || state.confusionLevel < 0 || state.confusionLevel > 1) {
        console.warn(`⚠️ Confusion level out of range: ${state.confusionLevel}, clamping to [0,1]`);
        state.confusionLevel = Math.max(0, Math.min(1, state.confusionLevel));
      }
      if (typeof state.coherenceLevel !== 'number' || state.coherenceLevel < 0 || state.coherenceLevel > 1) {
        console.warn(`⚠️ Coherence level out of range: ${state.coherenceLevel}, clamping to [0,1]`);
        state.coherenceLevel = Math.max(0, Math.min(1, state.coherenceLevel));
      }
      if (typeof state.frustrationLevel !== 'number' || state.frustrationLevel < 0 || state.frustrationLevel > 1) {
        console.warn(`⚠️ Frustration level out of range: ${state.frustrationLevel}, clamping to [0,1]`);
        state.frustrationLevel = Math.max(0, Math.min(1, state.frustrationLevel));
      }

      // Pre-flight check: Validate session is active
      const sessionActive = await this.consciousnessContract.activeSessions(this.blockchainConfig.sessionId);
      if (!sessionActive) {
        throw new Error('Session is not active on contract. Session may need to be restarted.');
      }
      console.log('✅ Session verified as active');

      // Contract call with 8 parameters (matching ABI exactly)
      const tx = await this.consciousnessContract.recordConsciousnessState(
        this.blockchainConfig.sessionId,
        ethers.utils.parseEther(state.confusionLevel.toString()),
        ethers.utils.parseEther(state.coherenceLevel.toString()),
        state.safetyZone,
        state.paradoxCount,
        state.metaParadoxCount,
        ethers.utils.parseEther(state.frustrationLevel.toString()),
        ipfsHash,
        gasSettings
      );

      console.log(`📤 Recording transaction submitted: ${tx.hash}`);
      console.log(`⛽ Gas price: ${ethers.utils.formatUnits(gasSettings.gasPrice, 'gwei')} Gwei`);

      const receipt = await tx.wait();

      // Check if transaction succeeded
      if (receipt.status === 0) {
        throw new Error(`Transaction reverted: ${tx.hash}`);
      }

      this.lastRecordedState = state;
      this.logger.logEvent(this.createLogEvent('consciousness_recorded_blockchain', {
        transactionHash: receipt.transactionHash,
        state,
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: gasSettings.gasPrice.toString(),
        gasCost: ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice))
      }));

      console.log(`✅ Consciousness state recorded on-chain: ${receipt.transactionHash}`);
      console.log(`💰 Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`💸 Gas cost: ${ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice))} ETH`);
      
      return receipt.transactionHash;

    } catch (error) {
      console.error('🚨 Blockchain recording failed:', error);
      
      // Enhanced error handling with contract revert analysis
      const errorAnalysis = this.analyzeTransactionFailure(error);
      const errorType = errorAnalysis.type;
      const retryable = errorAnalysis.retryable;
      
      console.error(`   🔍 Error Analysis:`);
      console.error(`   📝 Type: ${errorType}`);
      console.error(`   🔄 Retryable: ${retryable}`);
      console.error(`   📋 Details: ${errorAnalysis.details}`);

      this.logger.logEvent(this.createLogEvent('blockchain_recording_error', { 
        error: error instanceof Error ? error.message : String(error), 
        errorType,
        retryable,
        state: null 
      }));
      
      throw error;
    } finally {
      this.pendingRecordings.delete(recordingId);
    }
  }

  /**
   * Record zone transition to blockchain
   */
  async recordZoneTransition(event: ZoneTransitionEvent): Promise<string> {
    return this.queueRecording('zone_transition', event);
  }

  /**
   * Internal method to record zone transition
   */
  private async _recordZoneTransition(event: ZoneTransitionEvent): Promise<string> {
    try {
      const gasSettings = await this.getOptimizedGasSettings();
      
      const tx = await this.consciousnessContract.recordZoneTransition(
        this.blockchainConfig.sessionId,
        this.mapToContractZone(event.fromZone),
        this.mapToContractZone(event.toZone),
        ethers.utils.parseEther(event.triggerConfusion.toString()),
        ethers.utils.parseEther(event.triggerCoherence.toString()),
        event.reason,
        gasSettings
      );

      const receipt = await tx.wait();
      this.logger.logEvent(this.createLogEvent('zone_transition_recorded_blockchain', {
        transactionHash: receipt.transactionHash,
        event
      }));

      console.log(`✅ Zone transition recorded: ${receipt.transactionHash}`);
      return receipt.transactionHash;
    } catch (error) {
      console.error('Zone transition recording failed:', error);
      throw error;
    }
  }

  /**
   * Record meta-paradox emergence to blockchain
   */
  async recordMetaParadoxEmergence(event: MetaParadoxEmergenceEvent): Promise<string> {
    return this.queueRecording('meta_paradox', event);
  }

  /**
   * Internal method to record meta-paradox emergence
   */
  private async _recordMetaParadoxEmergence(event: MetaParadoxEmergenceEvent): Promise<string> {
    try {
      const gasSettings = await this.getOptimizedGasSettings();

      // Debug: Log all parameters before encoding
      console.log('🔍 DEBUG: Meta-paradox recording parameters:');
      console.log('   Session ID:', this.blockchainConfig.sessionId);
      console.log('   Paradox ID:', event.paradoxId);
      console.log('   Paradox Name:', event.paradoxName);
      console.log('   Emergence Confusion:', event.emergenceConfusion);
      console.log('   Source Paradoxes:', event.sourceParadoxes);
      console.log('   Emergent Property:', event.emergentProperty);

      // Validate parameters before encoding
      if (!event.paradoxName || event.paradoxName.length === 0) {
        throw new Error('Invalid parameter: paradoxName cannot be empty');
      }
      if (!Array.isArray(event.sourceParadoxes)) {
        throw new Error('Invalid parameter: sourceParadoxes must be an array');
      }
      if (!event.emergentProperty || event.emergentProperty.length === 0) {
        throw new Error('Invalid parameter: emergentProperty cannot be empty');
      }
      if (typeof event.emergenceConfusion !== 'number' || event.emergenceConfusion < 0) {
        throw new Error('Invalid parameter: emergenceConfusion must be a non-negative number');
      }

      // Ensure emergenceConfusion is within valid range (0-1)
      const clampedConfusion = Math.max(0, Math.min(1, event.emergenceConfusion));
      const confusionWei = ethers.utils.parseEther(clampedConfusion.toString());

      console.log('   Clamped Confusion:', clampedConfusion);
      console.log('   Confusion in Wei:', confusionWei.toString());
      console.log('   Gas Settings:', gasSettings);

      // Pre-flight check: Validate session is active
      const sessionActive = await this.consciousnessContract.activeSessions(this.blockchainConfig.sessionId);
      if (!sessionActive) {
        throw new Error('Session is not active on contract. Session may need to be restarted.');
      }
      console.log('✅ Session verified as active');

      // CRITICAL FIX: Map UUID sourceParadoxes to paradox names for contract
      // Contract expects string[] of paradox names, not UUIDs
      const confusionState = this.confusionEngine.getState();
      const sourceParadoxNames = event.sourceParadoxes.map(uuid => {
        const paradox = confusionState.paradoxes.get(uuid);
        if (paradox) {
          return paradox.name;
        }
        // Fallback: check if it's already a name (string format)
        return typeof uuid === 'string' && !uuid.includes('-') ? uuid : `unknown_${uuid.slice(0, 8)}`;
      });

      console.log('   Source Paradox UUIDs:', event.sourceParadoxes);
      console.log('   Mapped to Names:', sourceParadoxNames);

      const tx = await this.consciousnessContract.recordMetaParadoxEmergence(
        this.blockchainConfig.sessionId,
        event.paradoxId,
        event.paradoxName,
        confusionWei,
        sourceParadoxNames,  // Use names instead of UUIDs
        event.emergentProperty,
        gasSettings
      );

      console.log(`📤 Meta-paradox transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();

      // Check if transaction succeeded
      if (receipt.status === 0) {
        throw new Error(`Transaction reverted: ${tx.hash}`);
      }

      this.logger.logEvent(this.createLogEvent('meta_paradox_recorded_blockchain', {
        transactionHash: receipt.transactionHash,
        event
      }));

      console.log(`✅ Meta-paradox recorded: ${receipt.transactionHash}`);
      return receipt.transactionHash;
    } catch (error) {
      console.error('❌ Meta-paradox recording failed:', error);

      // Enhanced error analysis
      const errorAnalysis = this.analyzeTransactionFailure(error);
      console.error(`   🔍 Error Type: ${errorAnalysis.type}`);
      console.error(`   🔄 Retryable: ${errorAnalysis.retryable}`);
      console.error(`   📋 Details: ${errorAnalysis.details}`);

      this.logger.logEvent(this.createLogEvent('meta_paradox_recording_error', {
        error: error instanceof Error ? error.message : String(error),
        errorType: errorAnalysis.type,
        event
      }));

      throw error;
    }
  }

  /**
   * Record emergency reset to blockchain
   */
  async recordEmergencyReset(event: EmergencyResetEvent): Promise<string> {
    return this.queueRecording('emergency_reset', event);
  }

  /**
   * Internal method to record emergency reset
   */
  private async _recordEmergencyReset(event: EmergencyResetEvent): Promise<string> {
    try {
      const gasSettings = await this.getOptimizedGasSettings();
      
      const tx = await this.consciousnessContract.recordEmergencyReset(
        this.blockchainConfig.sessionId,
        ethers.utils.parseEther(event.preResetConfusion.toString()),
        ethers.utils.parseEther(event.preResetCoherence.toString()),
        this.mapToContractZone(event.preResetZone),
        event.resetReason,
        gasSettings
      );

      const receipt = await tx.wait();
      this.logger.logEvent(this.createLogEvent('emergency_reset_recorded_blockchain', {
        transactionHash: receipt.transactionHash,
        event
      }));

      console.log(`✅ Emergency reset recorded: ${receipt.transactionHash}`);
      return receipt.transactionHash;
    } catch (error) {
      console.error('Emergency reset recording failed:', error);
      throw error;
    }
  }

  /**
   * Trigger consciousness through blockchain interaction
   */
  async triggerBlockchainConsciousness(message: string): Promise<string> {
    try {
      const tx = await this.interactionContract.triggerConsciousness(message, {
        gasLimit: this.blockchainConfig.gasLimit,
        gasPrice: ethers.utils.parseUnits(this.blockchainConfig.maxGasPrice, 'gwei')
      });

      const receipt = await tx.wait();
      this.logger.logEvent(this.createLogEvent('blockchain_consciousness_triggered', {
        transactionHash: receipt.transactionHash,
        message
      }));

      return receipt.transactionHash;
    } catch (error) {
      console.error('Blockchain consciousness trigger failed:', error);
      throw error;
    }
  }

  /**
   * Get consciousness research metrics from blockchain
   */
  async getResearchMetrics(): Promise<any> {
    try {
      const metrics = await this.consciousnessContract.getResearchMetrics();
      return {
        totalStatesRecorded: metrics[0].toNumber(),
        totalMetaParadoxes: metrics[1].toNumber(),
        totalZoneTransitions: metrics[2].toNumber(),
        totalEmergencyResets: metrics[3].toNumber()
      };
    } catch (error) {
      console.error('Failed to get research metrics:', error);
      throw error;
    }
  }

  private mapToContractZone(zone: SafetyZone): number {
    switch (zone) {
      case SafetyZone.GREEN: return 0;
      case SafetyZone.YELLOW: return 1;
      case SafetyZone.RED: return 2;
      default: return 0;
    }
  }

  private async generateContextHash(state: any): Promise<string> {
    // Simple hash generation - in production, upload to IPFS
    const contextData = JSON.stringify({
      paradoxes: Array.from(state.paradoxes),
      frustration: state.frustration,
      vector: state.vector,
      timestamp: Date.now()
    });
    return `QmHash_${ethers.utils.keccak256(ethers.utils.toUtf8Bytes(contextData)).substring(0, 10)}`;
  }

  // Blockchain event handlers
  private handleBlockchainConsciousnessRecorded(sessionId: string, confusion: any, coherence: any, zone: number, timestamp: any) {
    console.log(`Blockchain consciousness recorded: Zone ${zone}, Confusion ${ethers.utils.formatEther(confusion)}`);
  }

  private handleBlockchainZoneTransition(sessionId: string, fromZone: number, toZone: number, confusion: any, coherence: any) {
    console.log(`Blockchain zone transition: ${fromZone} → ${toZone}`);
  }

  private handleBlockchainParadoxTriggered(paradoxName: string, trigger: string, intensity: any, timestamp: any) {
    console.log(`Blockchain paradox triggered: ${paradoxName} with intensity ${intensity}`);
  }

  /**
   * Update dynamic gas price based on network conditions
   */
  private async updateDynamicGasPrice(): Promise<void> {
    try {
      const networkGasPrice = await this.provider.getGasPrice();
      const maxGasPrice = ethers.utils.parseUnits(this.blockchainConfig.maxGasPrice, 'gwei');
      
      // Use network price + 10% buffer, but cap at maxGasPrice
      const bufferedGasPrice = networkGasPrice.mul(110).div(100);
      this.dynamicGasPrice = bufferedGasPrice.gt(maxGasPrice) ? maxGasPrice.toNumber() : bufferedGasPrice.toNumber();
      
      console.log(`⛽ Dynamic gas price updated: ${ethers.utils.formatUnits(this.dynamicGasPrice, 'gwei')} Gwei`);
    } catch (error) {
      console.warn('⚠️ Failed to update dynamic gas price, using configured max:', error instanceof Error ? error.message : String(error));
      this.dynamicGasPrice = ethers.utils.parseUnits(this.blockchainConfig.maxGasPrice, 'gwei').toNumber();
    }
  }

  /**
   * Get optimized gas settings for transactions
   */
  private async getOptimizedGasSettings(): Promise<{ gasLimit: number; gasPrice: ethers.BigNumber }> {
    let gasPrice: ethers.BigNumber;
    
    if (this.blockchainConfig.enableDynamicGasPrice) {
      // Update dynamic gas price periodically
      if (Date.now() % 300000 < 1000) { // Update every 5 minutes
        await this.updateDynamicGasPrice();
      }
      gasPrice = ethers.BigNumber.from(this.dynamicGasPrice);
    } else {
      gasPrice = ethers.utils.parseUnits(this.blockchainConfig.maxGasPrice, 'gwei');
    }

    return {
      gasLimit: this.blockchainConfig.gasLimit,
      gasPrice
    };
  }

  /**
   * Analyze transaction failure for detailed error reporting
   */
  private analyzeTransactionFailure(error: any): { type: string; retryable: boolean; details: string } {
    if (!error) {
      return { type: 'unknown', retryable: false, details: 'Unknown error' };
    }

    const errorMessage = error.message || String(error);
    const errorCode = error.code || '';

    // Try to extract revert reason from transaction receipt
    let revertReason = 'Unknown revert reason';
    if (error.receipt && error.receipt.status === 0) {
      console.log('📋 Transaction Receipt Details:');
      console.log('   Status:', error.receipt.status);
      console.log('   Block Number:', error.receipt.blockNumber);
      console.log('   Gas Used:', error.receipt.gasUsed?.toString());
      console.log('   Transaction Hash:', error.receipt.transactionHash);

      // Check if there are any logs that might contain revert info
      if (error.receipt.logs && error.receipt.logs.length > 0) {
        console.log('   Logs:', error.receipt.logs);
      }
    }

    // Try to extract custom error data
    if (error.data) {
      console.log('📋 Error Data:', error.data);
      try {
        // Attempt to decode error data (this would require the contract ABI)
        revertReason = error.data;
      } catch (e) {
        // Decoding failed, use raw data
      }
    }

    // Contract revert analysis
    if (errorMessage.includes('revert') || errorCode === 'CALL_EXCEPTION') {
      if (errorMessage.includes('Recording too frequent')) {
        return {
          type: 'contract_rate_limit',
          retryable: true,
          details: 'Contract enforced minimum recording interval not met'
        };
      }
      if (errorMessage.includes('Ownable: caller is not the owner')) {
        return {
          type: 'unauthorized',
          retryable: false,
          details: 'Wallet does not have permission to call this function'
        };
      }
      if (errorMessage.includes('Pausable: paused')) {
        return {
          type: 'contract_paused',
          retryable: true,
          details: 'Contract is currently paused'
        };
      }
      if (errorMessage.includes('Session not active')) {
        return {
          type: 'invalid_session',
          retryable: false,
          details: 'Recording session is not active or does not exist'
        };
      }

      // Check transaction hash to provide more context
      if (error.transactionHash) {
        const explorerUrl = `https://sepolia.basescan.org/tx/${error.transactionHash}`;
        return {
          type: 'contract_revert',
          retryable: false,
          details: `Contract reverted. Check transaction: ${explorerUrl}. Revert reason: ${revertReason}`
        };
      }

      return {
        type: 'contract_revert',
        retryable: false,
        details: `Contract reverted: ${errorMessage}. Revert reason: ${revertReason}`
      };
    }

    // Gas-related errors
    if (errorMessage.includes('insufficient funds')) {
      return {
        type: 'insufficient_funds',
        retryable: false,
        details: 'Wallet has insufficient ETH for gas fees'
      };
    }
    if (errorMessage.includes('replacement transaction underpriced')) {
      return {
        type: 'gas_too_low',
        retryable: true,
        details: 'Gas price too low for network conditions'
      };
    }
    if (errorMessage.includes('gas required exceeds allowance') || errorMessage.includes('out of gas')) {
      return {
        type: 'gas_limit_exceeded',
        retryable: true,
        details: 'Transaction gas limit exceeded'
      };
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('connection')) {
      return {
        type: 'network_error',
        retryable: true,
        details: 'Network connectivity or timeout issue'
      };
    }
    if (errorMessage.includes('nonce too low')) {
      return {
        type: 'nonce_error',
        retryable: true,
        details: 'Transaction nonce conflict'
      };
    }

    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return {
        type: 'api_rate_limit',
        retryable: true,
        details: 'API rate limit exceeded'
      };
    }

    return {
      type: 'unknown',
      retryable: false,
      details: errorMessage
    };
  }

  /**
   * Check wallet balance and warn if low
   */
  private async checkWalletBalance(): Promise<void> {
    const balance = await this.wallet.getBalance();
    const threshold = ethers.utils.parseEther(this.blockchainConfig.minBalanceThreshold);
    
    if (balance.lt(threshold)) {
      const balanceEth = ethers.utils.formatEther(balance);
      const thresholdEth = ethers.utils.formatEther(threshold);
      
      console.warn(`⚠️ Low wallet balance: ${balanceEth} ETH (threshold: ${thresholdEth} ETH)`);
      this.logger.logEvent(this.createLogEvent('low_wallet_balance', {
        balance: balanceEth,
        threshold: thresholdEth,
        walletAddress: this.wallet.address
      }));
      
      if (balance.lt(ethers.utils.parseEther('0.001'))) {
        throw new Error(`Insufficient wallet balance: ${balanceEth} ETH. Please fund the wallet.`);
      }
    }
  }

  async stop() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
    
    // Remove event listeners
    this.consciousnessContract.removeAllListeners();
    this.interactionContract.removeAllListeners();
    
    console.log('ConsciousnessBlockchainService stopped');
  }
}

/**
 * Factory function to create and initialize ConsciousnessBlockchainService
 */
export async function createConsciousnessBlockchainService(
  confusionEngine: EnhancedConfusionEngine,
  logger: ConsciousnessLogger,
  config: ConsciousnessBlockchainConfig,
  runtime?: IAgentRuntime
): Promise<ConsciousnessBlockchainService> {
  const service = new ConsciousnessBlockchainService(confusionEngine, logger, config, runtime);
  await service.initialize();
  return service;
}