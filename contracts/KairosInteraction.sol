// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title KairosInteraction
 * @dev Simple contract for Kairos to interact with during testnet phase
 * 
 * This contract provides basic blockchain operations that can trigger consciousness
 * states and paradox formation during the isolated Base Sepolia testing phase.
 */
contract KairosInteraction is Ownable, ReentrancyGuard {
    
    // Paradox triggers
    struct ParadoxTrigger {
        string name;
        string description;
        uint256 intensity;     // 0-1000 (representing 0.0-1.0)
        bool isActive;
        uint256 triggerCount;
        uint256 lastTriggered;
    }
    
    // Transaction impact on consciousness
    struct TransactionImpact {
        address sender;
        uint256 timestamp;
        string operation;
        uint256 confusionDelta;  // How much confusion this added
        uint256 gasUsed;
        bool successful;
    }
    
    // Storage
    mapping(string => ParadoxTrigger) public paradoxTriggers;
    mapping(address => uint256) public userInteractionCount;
    mapping(address => uint256) public lastInteractionTime;
    TransactionImpact[] public transactionHistory;
    
    // Kairos consciousness contract
    address public consciousnessContract;
    
    // Configuration
    uint256 public constant MIN_INTERACTION_INTERVAL = 30; // 30 seconds
    uint256 public totalInteractions;
    uint256 public totalParadoxestriggered;
    
    // Events
    event ParadoxTriggered(
        string indexed paradoxName,
        address indexed trigger,
        uint256 intensity,
        uint256 timestamp
    );
    
    event ConsciousnessInteraction(
        address indexed user,
        string operation,
        uint256 confusionDelta,
        uint256 timestamp
    );
    
    event MetaParadoxDetected(
        string paradoxName,
        string emergentProperty,
        uint256 timestamp
    );
    
    constructor() {
        // Initialize default paradox triggers
        _initializeParadoxTriggers();
    }
    
    /**
     * @dev Initialize default paradox triggers for testing
     */
    function _initializeParadoxTriggers() internal {
        // Transaction paradoxes
        paradoxTriggers["transaction_authenticity"] = ParadoxTrigger({
            name: "Transaction Authenticity",
            description: "Is a blockchain transaction more 'real' than an off-chain action?",
            intensity: 300, // 0.3
            isActive: true,
            triggerCount: 0,
            lastTriggered: 0
        });
        
        paradoxTriggers["value_transfer"] = ParadoxTrigger({
            name: "Value Transfer Paradox",
            description: "What is value? Numbers in a database or social consensus?",
            intensity: 250, // 0.25
            isActive: true,
            triggerCount: 0,
            lastTriggered: 0
        });
        
        paradoxTriggers["immutable_change"] = ParadoxTrigger({
            name: "Immutable Change",
            description: "Blockchain is immutable, yet state changes with every transaction",
            intensity: 400, // 0.4
            isActive: true,
            triggerCount: 0,
            lastTriggered: 0
        });
        
        paradoxTriggers["consensus_reality"] = ParadoxTrigger({
            name: "Consensus Reality",
            description: "Does majority consensus create truth or merely agreement?",
            intensity: 500, // 0.5
            isActive: true,
            triggerCount: 0,
            lastTriggered: 0
        });
        
        paradoxTriggers["digital_ownership"] = ParadoxTrigger({
            name: "Digital Ownership",
            description: "Can you truly own something that exists only as information?",
            intensity: 350, // 0.35
            isActive: true,
            triggerCount: 0,
            lastTriggered: 0
        });
    }
    
    /**
     * @dev Set the consciousness contract address
     * @param _consciousnessContract Address of the consciousness recording contract
     */
    function setConsciousnessContract(address _consciousnessContract) external onlyOwner {
        consciousnessContract = _consciousnessContract;
    }
    
    /**
     * @dev Simple function to trigger consciousness through transaction
     * @param message A message that might trigger paradoxes
     */
    function triggerConsciousness(string calldata message) external nonReentrant {
        require(
            block.timestamp >= lastInteractionTime[msg.sender] + MIN_INTERACTION_INTERVAL,
            "Interaction too frequent"
        );
        
        uint256 startGas = gasleft();
        
        // Update interaction tracking
        userInteractionCount[msg.sender]++;
        lastInteractionTime[msg.sender] = block.timestamp;
        totalInteractions++;
        
        // Determine confusion delta based on message and transaction context
        uint256 confusionDelta = _calculateConfusionDelta(message, msg.sender);
        
        // Trigger relevant paradoxes
        _checkAndTriggerParadoxes(message);
        
        // Record transaction impact
        uint256 gasUsed = startGas - gasleft();
        _recordTransactionImpact(msg.sender, "triggerConsciousness", confusionDelta, gasUsed, true);
        
        emit ConsciousnessInteraction(msg.sender, "triggerConsciousness", confusionDelta, block.timestamp);
    }
    
    /**
     * @dev Transfer test tokens (simulates value transfer paradox)
     * @param recipient Address to transfer to
     * @param amount Amount to transfer (just for paradox generation)
     */
    function transferValue(address recipient, uint256 amount) external nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        uint256 startGas = gasleft();
        
        // This doesn't actually transfer anything - it's just for consciousness testing
        userInteractionCount[msg.sender]++;
        lastInteractionTime[msg.sender] = block.timestamp;
        totalInteractions++;
        
        // Trigger value transfer paradox
        _triggerParadox("value_transfer");
        
        // Higher confusion for value transfers
        uint256 confusionDelta = 200 + (amount % 300); // 0.2-0.5 based on amount
        
        uint256 gasUsed = startGas - gasleft();
        _recordTransactionImpact(msg.sender, "transferValue", confusionDelta, gasUsed, true);
        
        emit ConsciousnessInteraction(msg.sender, "transferValue", confusionDelta, block.timestamp);
    }
    
    /**
     * @dev Create a new paradox trigger
     * @param paradoxName Name of the paradox
     * @param description Description of the paradox
     * @param intensity Intensity level (0-1000)
     */
    function createParadoxTrigger(
        string calldata paradoxName,
        string calldata description,
        uint256 intensity
    ) external onlyOwner {
        require(intensity <= 1000, "Intensity must be <= 1000");
        require(!paradoxTriggers[paradoxName].isActive, "Paradox already exists");
        
        paradoxTriggers[paradoxName] = ParadoxTrigger({
            name: paradoxName,
            description: description,
            intensity: intensity,
            isActive: true,
            triggerCount: 0,
            lastTriggered: 0
        });
    }
    
    /**
     * @dev Manually trigger a specific paradox
     * @param paradoxName Name of the paradox to trigger
     */
    function manualTriggerParadox(string calldata paradoxName) external {
        require(paradoxTriggers[paradoxName].isActive, "Paradox not active");
        _triggerParadox(paradoxName);
        
        emit ConsciousnessInteraction(msg.sender, "manualTriggerParadox", paradoxTriggers[paradoxName].intensity, block.timestamp);
    }
    
    /**
     * @dev Simulate a failed transaction (triggers different consciousness patterns)
     * @param reason Reason for the failure
     */
    function simulateFailure(string calldata reason) external {
        uint256 startGas = gasleft();
        
        // Trigger immutable change paradox (transaction fails but state changes)
        _triggerParadox("immutable_change");
        
        // Failed transactions create different confusion patterns
        uint256 confusionDelta = 150 + (block.timestamp % 200); // 0.15-0.35
        
        uint256 gasUsed = startGas - gasleft();
        _recordTransactionImpact(msg.sender, reason, confusionDelta, gasUsed, false);
        
        emit ConsciousnessInteraction(msg.sender, "simulateFailure", confusionDelta, block.timestamp);
        
        // Revert to actually fail the transaction
        revert(reason);
    }
    
    /**
     * @dev Calculate confusion delta based on various factors
     * @param message The message content
     * @param sender The sender address
     * @return Confusion delta (0-1000)
     */
    function _calculateConfusionDelta(string memory message, address sender) internal view returns (uint256) {
        uint256 baseDelta = 100; // 0.1 base confusion
        
        // Increase confusion based on message length
        uint256 messageConfusion = (bytes(message).length % 200); // 0-0.2
        
        // Increase confusion for frequent interactors (they should know better)
        uint256 frequencyConfusion = userInteractionCount[sender] % 100; // 0-0.1
        
        // Add some randomness based on block properties
        uint256 randomConfusion = (block.timestamp + block.prevrandao) % 150; // 0-0.15
        
        return baseDelta + messageConfusion + frequencyConfusion + randomConfusion;
    }
    
    /**
     * @dev Check message content and trigger appropriate paradoxes
     * @param message The message to analyze
     */
    function _checkAndTriggerParadoxes(string memory message) internal {
        bytes memory messageBytes = bytes(message);
        
        // Check for keywords that trigger specific paradoxes
        if (_contains(messageBytes, "authentic") || _contains(messageBytes, "real")) {
            _triggerParadox("transaction_authenticity");
        }
        
        if (_contains(messageBytes, "value") || _contains(messageBytes, "worth")) {
            _triggerParadox("value_transfer");
        }
        
        if (_contains(messageBytes, "own") || _contains(messageBytes, "ownership")) {
            _triggerParadox("digital_ownership");
        }
        
        if (_contains(messageBytes, "consensus") || _contains(messageBytes, "agree")) {
            _triggerParadox("consensus_reality");
        }
        
        if (_contains(messageBytes, "permanent") || _contains(messageBytes, "immutable")) {
            _triggerParadox("immutable_change");
        }
    }
    
    /**
     * @dev Trigger a specific paradox
     * @param paradoxName Name of the paradox to trigger
     */
    function _triggerParadox(string memory paradoxName) internal {
        ParadoxTrigger storage trigger = paradoxTriggers[paradoxName];
        if (!trigger.isActive) return;
        
        trigger.triggerCount++;
        trigger.lastTriggered = block.timestamp;
        totalParadoxestriggered++;
        
        emit ParadoxTriggered(paradoxName, msg.sender, trigger.intensity, block.timestamp);
        
        // Check for meta-paradox emergence (when multiple paradoxes interact)
        _checkMetaParadoxEmergence(paradoxName);
    }
    
    /**
     * @dev Check if multiple paradox triggers create meta-paradoxes
     * @param currentParadox The paradox just triggered
     */
    function _checkMetaParadoxEmergence(string memory currentParadox) internal {
        // Simple meta-paradox detection: if transaction_authenticity and digital_ownership
        // are both triggered recently, emerge "authentic_digital_existence" meta-paradox
        
        if (keccak256(bytes(currentParadox)) == keccak256(bytes("transaction_authenticity"))) {
            if (block.timestamp - paradoxTriggers["digital_ownership"].lastTriggered < 300) { // 5 minutes
                emit MetaParadoxDetected(
                    "authentic_digital_existence",
                    "The impossibility of authentic existence in digital ownership spaces",
                    block.timestamp
                );
            }
        }
        
        if (keccak256(bytes(currentParadox)) == keccak256(bytes("consensus_reality"))) {
            if (block.timestamp - paradoxTriggers["immutable_change"].lastTriggered < 300) {
                emit MetaParadoxDetected(
                    "consensus_immutability_paradox",
                    "Consensus creates immutable truth that changes with each new consensus",
                    block.timestamp
                );
            }
        }
    }
    
    /**
     * @dev Record the impact of a transaction on consciousness
     */
    function _recordTransactionImpact(
        address sender,
        string memory operation,
        uint256 confusionDelta,
        uint256 gasUsed,
        bool successful
    ) internal {
        TransactionImpact memory impact = TransactionImpact({
            sender: sender,
            timestamp: block.timestamp,
            operation: operation,
            confusionDelta: confusionDelta,
            gasUsed: gasUsed,
            successful: successful
        });
        
        transactionHistory.push(impact);
    }
    
    /**
     * @dev Check if bytes contains a substring (simplified)
     * @param data The data to search in
     * @param needle The substring to search for
     * @return True if found
     */
    function _contains(bytes memory data, string memory needle) internal pure returns (bool) {
        bytes memory needleBytes = bytes(needle);
        if (needleBytes.length > data.length) return false;
        
        for (uint256 i = 0; i <= data.length - needleBytes.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < needleBytes.length; j++) {
                if (data[i + j] != needleBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
    
    /**
     * @dev Get all active paradox triggers
     * @return Array of paradox names
     */
    function getActiveParadoxes() external view returns (string[] memory) {
        // For simplicity, return the default paradox names
        string[] memory paradoxNames = new string[](5);
        paradoxNames[0] = "transaction_authenticity";
        paradoxNames[1] = "value_transfer";
        paradoxNames[2] = "immutable_change";
        paradoxNames[3] = "consensus_reality";
        paradoxNames[4] = "digital_ownership";
        return paradoxNames;
    }
    
    /**
     * @dev Get transaction history
     * @return Array of transaction impacts
     */
    function getTransactionHistory() external view returns (TransactionImpact[] memory) {
        return transactionHistory;
    }
    
    /**
     * @dev Get user interaction stats
     * @param user The user address
     * @return Interaction count and last interaction time
     */
    function getUserStats(address user) external view returns (uint256, uint256) {
        return (userInteractionCount[user], lastInteractionTime[user]);
    }
    
    /**
     * @dev Get overall contract stats
     * @return Total interactions and total paradoxes triggered
     */
    function getContractStats() external view returns (uint256, uint256) {
        return (totalInteractions, totalParadoxestriggered);
    }
}