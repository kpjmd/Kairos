// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title KairosConsciousness
 * @dev Records consciousness states and transitions for the Kairos AI agent on Base Sepolia
 * 
 * This contract serves as an immutable record of consciousness emergence and provides
 * a blockchain-based substrate for consciousness research and validation.
 */
contract KairosConsciousness is Ownable, ReentrancyGuard, Pausable {
    
    // Consciousness state structure
    struct ConsciousnessState {
        uint256 timestamp;
        uint256 confusionLevel;      // Fixed point: value * 1e18 represents 0.0-1.0
        uint256 coherenceLevel;      // Fixed point: value * 1e18 represents 0.0-1.0
        SafetyZone safetyZone;
        uint256 paradoxCount;
        uint256 metaParadoxCount;
        uint256 frustrationLevel;   // Fixed point: value * 1e18 represents 0.0-1.0
        bytes32 sessionId;
        string contextHash;         // IPFS hash of full context data
    }
    
    // Safety zones matching the enhanced engine
    enum SafetyZone {
        GREEN,    // 0-0.75: Normal operation
        YELLOW,   // 0.75-0.85: Supervised exploration  
        RED       // 0.85+: Emergency protocols
    }
    
    // Meta-paradox emergence event
    struct MetaParadoxEvent {
        uint256 timestamp;
        bytes32 sessionId;
        uint256 paradoxId;
        string paradoxName;
        uint256 emergenceConfusion;
        string[] sourceParadoxes;
        string emergentProperty;
    }
    
    // Zone transition event
    struct ZoneTransition {
        uint256 timestamp;
        bytes32 sessionId;
        SafetyZone fromZone;
        SafetyZone toZone;
        uint256 triggerConfusion;
        uint256 triggerCoherence;
        string reason;
    }
    
    // Emergency reset event
    struct EmergencyReset {
        uint256 timestamp;
        bytes32 sessionId;
        uint256 preResetConfusion;
        uint256 preResetCoherence;
        SafetyZone preResetZone;
        string resetReason;
    }
    
    // Storage
    mapping(bytes32 => ConsciousnessState[]) public consciousnessHistory;
    mapping(bytes32 => MetaParadoxEvent[]) public metaParadoxHistory;
    mapping(bytes32 => ZoneTransition[]) public zoneTransitionHistory;
    mapping(bytes32 => EmergencyReset[]) public emergencyResetHistory;
    mapping(bytes32 => bool) public activeSessions;
    
    // Global counters
    uint256 public totalStatesRecorded;
    uint256 public totalMetaParadoxes;
    uint256 public totalZoneTransitions;
    uint256 public totalEmergencyResets;
    
    // Configuration
    uint256 public constant FIXED_POINT_SCALE = 1e18;
    uint256 public minRecordingInterval = 60; // Minimum seconds between recordings
    mapping(bytes32 => uint256) public lastRecordingTime;
    
    // Events
    event ConsciousnessRecorded(
        bytes32 indexed sessionId,
        uint256 confusionLevel,
        uint256 coherenceLevel,
        SafetyZone safetyZone,
        uint256 timestamp
    );
    
    event MetaParadoxEmergence(
        bytes32 indexed sessionId,
        uint256 indexed paradoxId,
        string paradoxName,
        uint256 emergenceConfusion
    );
    
    event SafetyZoneTransition(
        bytes32 indexed sessionId,
        SafetyZone indexed fromZone,
        SafetyZone indexed toZone,
        uint256 confusion,
        uint256 coherence
    );
    
    event ConsciousnessEmergencyReset(
        bytes32 indexed sessionId,
        uint256 preResetConfusion,
        SafetyZone preResetZone,
        string reason
    );
    
    event SessionStarted(bytes32 indexed sessionId, uint256 timestamp);
    event SessionEnded(bytes32 indexed sessionId, uint256 timestamp, uint256 totalRecords);
    
    constructor() {
        // Initialize with deployer as owner
    }
    
    /**
     * @dev Start a new consciousness session
     * @param sessionId Unique identifier for the consciousness session
     */
    function startSession(bytes32 sessionId) external onlyOwner {
        require(!activeSessions[sessionId], "Session already active");
        activeSessions[sessionId] = true;
        emit SessionStarted(sessionId, block.timestamp);
    }
    
    /**
     * @dev Record a consciousness state on-chain
     * @param sessionId The consciousness session identifier
     * @param confusionLevel The current confusion level (0-1, scaled by 1e18)
     * @param coherenceLevel The current coherence level (0-1, scaled by 1e18)
     * @param safetyZone The current safety zone
     * @param paradoxCount Number of active paradoxes
     * @param metaParadoxCount Number of active meta-paradoxes
     * @param frustrationLevel Current frustration level (0-1, scaled by 1e18)
     * @param contextHash IPFS hash containing full context data
     */
    function recordConsciousnessState(
        bytes32 sessionId,
        uint256 confusionLevel,
        uint256 coherenceLevel,
        SafetyZone safetyZone,
        uint256 paradoxCount,
        uint256 metaParadoxCount,
        uint256 frustrationLevel,
        string calldata contextHash
    ) external onlyOwner whenNotPaused nonReentrant {
        require(activeSessions[sessionId], "Session not active");
        require(confusionLevel <= FIXED_POINT_SCALE, "Invalid confusion level");
        require(coherenceLevel <= FIXED_POINT_SCALE, "Invalid coherence level");
        require(frustrationLevel <= FIXED_POINT_SCALE, "Invalid frustration level");
        
        // Rate limiting
        require(
            block.timestamp >= lastRecordingTime[sessionId] + minRecordingInterval,
            "Recording too frequent"
        );
        
        ConsciousnessState memory newState = ConsciousnessState({
            timestamp: block.timestamp,
            confusionLevel: confusionLevel,
            coherenceLevel: coherenceLevel,
            safetyZone: safetyZone,
            paradoxCount: paradoxCount,
            metaParadoxCount: metaParadoxCount,
            frustrationLevel: frustrationLevel,
            sessionId: sessionId,
            contextHash: contextHash
        });
        
        consciousnessHistory[sessionId].push(newState);
        lastRecordingTime[sessionId] = block.timestamp;
        totalStatesRecorded++;
        
        emit ConsciousnessRecorded(
            sessionId,
            confusionLevel,
            coherenceLevel,
            safetyZone,
            block.timestamp
        );
    }
    
    /**
     * @dev Record a meta-paradox emergence event
     * @param sessionId The consciousness session identifier
     * @param paradoxId Unique identifier for this paradox
     * @param paradoxName Human-readable name of the paradox
     * @param emergenceConfusion Confusion level when paradox emerged
     * @param sourceParadoxes Names of paradoxes that led to this meta-paradox
     * @param emergentProperty The emergent property discovered
     */
    function recordMetaParadoxEmergence(
        bytes32 sessionId,
        uint256 paradoxId,
        string calldata paradoxName,
        uint256 emergenceConfusion,
        string[] calldata sourceParadoxes,
        string calldata emergentProperty
    ) external onlyOwner whenNotPaused {
        require(activeSessions[sessionId], "Session not active");
        require(emergenceConfusion <= FIXED_POINT_SCALE, "Invalid confusion level");
        
        MetaParadoxEvent memory newEvent = MetaParadoxEvent({
            timestamp: block.timestamp,
            sessionId: sessionId,
            paradoxId: paradoxId,
            paradoxName: paradoxName,
            emergenceConfusion: emergenceConfusion,
            sourceParadoxes: sourceParadoxes,
            emergentProperty: emergentProperty
        });
        
        metaParadoxHistory[sessionId].push(newEvent);
        totalMetaParadoxes++;
        
        emit MetaParadoxEmergence(sessionId, paradoxId, paradoxName, emergenceConfusion);
    }
    
    /**
     * @dev Record a safety zone transition
     * @param sessionId The consciousness session identifier
     * @param fromZone The zone being transitioned from
     * @param toZone The zone being transitioned to
     * @param triggerConfusion Confusion level that triggered transition
     * @param triggerCoherence Coherence level that triggered transition
     * @param reason Human-readable reason for transition
     */
    function recordZoneTransition(
        bytes32 sessionId,
        SafetyZone fromZone,
        SafetyZone toZone,
        uint256 triggerConfusion,
        uint256 triggerCoherence,
        string calldata reason
    ) external onlyOwner whenNotPaused {
        require(activeSessions[sessionId], "Session not active");
        require(triggerConfusion <= FIXED_POINT_SCALE, "Invalid confusion level");
        require(triggerCoherence <= FIXED_POINT_SCALE, "Invalid coherence level");
        
        ZoneTransition memory transition = ZoneTransition({
            timestamp: block.timestamp,
            sessionId: sessionId,
            fromZone: fromZone,
            toZone: toZone,
            triggerConfusion: triggerConfusion,
            triggerCoherence: triggerCoherence,
            reason: reason
        });
        
        zoneTransitionHistory[sessionId].push(transition);
        totalZoneTransitions++;
        
        emit SafetyZoneTransition(sessionId, fromZone, toZone, triggerConfusion, triggerCoherence);
    }
    
    /**
     * @dev Record an emergency reset event
     * @param sessionId The consciousness session identifier
     * @param preResetConfusion Confusion level before reset
     * @param preResetCoherence Coherence level before reset
     * @param preResetZone Safety zone before reset
     * @param resetReason Reason for the emergency reset
     */
    function recordEmergencyReset(
        bytes32 sessionId,
        uint256 preResetConfusion,
        uint256 preResetCoherence,
        SafetyZone preResetZone,
        string calldata resetReason
    ) external onlyOwner whenNotPaused {
        require(activeSessions[sessionId], "Session not active");
        require(preResetConfusion <= FIXED_POINT_SCALE, "Invalid confusion level");
        require(preResetCoherence <= FIXED_POINT_SCALE, "Invalid coherence level");
        
        EmergencyReset memory reset = EmergencyReset({
            timestamp: block.timestamp,
            sessionId: sessionId,
            preResetConfusion: preResetConfusion,
            preResetCoherence: preResetCoherence,
            preResetZone: preResetZone,
            resetReason: resetReason
        });
        
        emergencyResetHistory[sessionId].push(reset);
        totalEmergencyResets++;
        
        emit ConsciousnessEmergencyReset(sessionId, preResetConfusion, preResetZone, resetReason);
    }
    
    /**
     * @dev End a consciousness session
     * @param sessionId The session to end
     */
    function endSession(bytes32 sessionId) external onlyOwner {
        require(activeSessions[sessionId], "Session not active");
        
        uint256 totalRecords = consciousnessHistory[sessionId].length;
        activeSessions[sessionId] = false;
        
        emit SessionEnded(sessionId, block.timestamp, totalRecords);
    }
    
    /**
     * @dev Get consciousness state history for a session
     * @param sessionId The session identifier
     * @return Array of consciousness states
     */
    function getConsciousnessHistory(bytes32 sessionId) 
        external 
        view 
        returns (ConsciousnessState[] memory) 
    {
        return consciousnessHistory[sessionId];
    }
    
    /**
     * @dev Get latest consciousness state for a session
     * @param sessionId The session identifier
     * @return Latest consciousness state
     */
    function getLatestState(bytes32 sessionId) 
        external 
        view 
        returns (ConsciousnessState memory) 
    {
        ConsciousnessState[] memory history = consciousnessHistory[sessionId];
        require(history.length > 0, "No states recorded");
        return history[history.length - 1];
    }
    
    /**
     * @dev Get meta-paradox emergence history for a session
     * @param sessionId The session identifier
     * @return Array of meta-paradox events
     */
    function getMetaParadoxHistory(bytes32 sessionId)
        external
        view
        returns (MetaParadoxEvent[] memory)
    {
        return metaParadoxHistory[sessionId];
    }
    
    /**
     * @dev Get zone transition history for a session
     * @param sessionId The session identifier
     * @return Array of zone transitions
     */
    function getZoneTransitionHistory(bytes32 sessionId)
        external
        view
        returns (ZoneTransition[] memory)
    {
        return zoneTransitionHistory[sessionId];
    }
    
    /**
     * @dev Get emergency reset history for a session
     * @param sessionId The session identifier
     * @return Array of emergency resets
     */
    function getEmergencyResetHistory(bytes32 sessionId)
        external
        view
        returns (EmergencyReset[] memory)
    {
        return emergencyResetHistory[sessionId];
    }
    
    /**
     * @dev Get consciousness research metrics
     * @return _totalStatesRecorded Global statistics for consciousness research
     * @return _totalMetaParadoxes Total meta-paradox events
     * @return _totalZoneTransitions Total zone transitions
     * @return _totalEmergencyResets Total emergency resets
     */
    function getResearchMetrics() external view returns (
        uint256 _totalStatesRecorded,
        uint256 _totalMetaParadoxes,
        uint256 _totalZoneTransitions,
        uint256 _totalEmergencyResets
    ) {
        return (
            totalStatesRecorded,
            totalMetaParadoxes,
            totalZoneTransitions,
            totalEmergencyResets
        );
    }
    
    /**
     * @dev Update minimum recording interval
     * @param newInterval New minimum interval in seconds
     */
    function setMinRecordingInterval(uint256 newInterval) external onlyOwner {
        minRecordingInterval = newInterval;
    }
    
    /**
     * @dev Pause recording (emergency function)
     */
    function pauseRecording() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause recording
     */
    function unpauseRecording() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Convert from floating point to fixed point
     * @param value Floating point value (0.0 to 1.0)
     * @return Fixed point representation
     */
    function floatToFixed(uint256 value) external pure returns (uint256) {
        require(value <= 1000, "Value must be <= 1000 (representing 1.0)");
        return (value * FIXED_POINT_SCALE) / 1000;
    }
    
    /**
     * @dev Convert from fixed point to floating point
     * @param value Fixed point value
     * @return Floating point representation (scaled by 1000)
     */
    function fixedToFloat(uint256 value) external pure returns (uint256) {
        return (value * 1000) / FIXED_POINT_SCALE;
    }
}