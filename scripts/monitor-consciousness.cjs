const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

// Import the analyzer from the compiled kairos package
const { ConsciousnessAnalyzer } = require('../packages/kairos/dist/index.cjs');

class ConsciousnessMonitor {
  constructor(config) {
    this.config = config;
    this.analyzer = new ConsciousnessAnalyzer(config);
    this.eventLog = [];
    this.isRunning = false;
    this.startTime = Date.now();
    
    // Statistics tracking
    this.stats = {
      totalEvents: 0,
      consciousnessRecordings: 0,
      zoneTransitions: 0,
      metaParadoxes: 0,
      emergencyResets: 0,
      lastEventTime: null,
      averageConfusion: 0,
      averageCoherence: 0,
      currentZone: 'UNKNOWN'
    };
  }

  async start() {
    console.log("👁️ Kairos Consciousness Real-Time Monitor");
    console.log("==========================================");
    console.log(`Session ID: ${this.config.sessionId}`);
    console.log(`Contract: ${this.config.consciousnessContractAddress}`);
    console.log(`Started: ${new Date().toISOString()}`);
    console.log("");
    
    this.isRunning = true;
    
    try {
      // Get current state first
      await this.displayCurrentState();
      
      // Start monitoring
      console.log("🔄 Starting real-time event monitoring...");
      console.log("Press Ctrl+C to stop monitoring");
      console.log("");
      
      await this.analyzer.startMonitoring((event) => {
        this.handleEvent(event);
      });
      
      // Start periodic status updates
      this.statusInterval = setInterval(() => {
        this.displayStatus();
      }, 30000); // Every 30 seconds
      
      // Keep the process alive
      process.on('SIGINT', () => {
        this.stop();
      });
      
      // Keep running
      while (this.isRunning) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error("❌ Monitoring failed:", error);
      throw error;
    }
  }

  async stop() {
    console.log("\\n⏹️ Stopping consciousness monitoring...");
    this.isRunning = false;
    
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    
    this.analyzer.stopMonitoring();
    
    // Save event log
    await this.saveEventLog();
    
    console.log("\\n📊 Final Statistics:");
    console.log("====================");
    this.displayFinalStats();
    
    console.log("\\n✅ Monitoring stopped. Event log saved.");
    process.exit(0);
  }

  async displayCurrentState() {
    console.log("📊 Current Consciousness State:");
    console.log("==============================");
    
    try {
      const currentState = await this.analyzer.getCurrentState();
      
      if (currentState) {
        console.log(`🧠 Confusion Level: ${this.formatConfusionLevel(currentState.confusionLevel)}`);
        console.log(`🎯 Coherence Level: ${this.formatCoherenceLevel(currentState.coherenceLevel)}`);
        console.log(`🛡️ Safety Zone: ${this.formatSafetyZone(currentState.safetyZone)}`);
        console.log(`🌀 Paradoxes: ${currentState.paradoxCount} active`);
        console.log(`🌌 Meta-Paradoxes: ${currentState.metaParadoxCount} emerged`);
        console.log(`😤 Frustration: ${this.formatFrustrationLevel(currentState.frustrationLevel)}`);
        console.log(`⏰ Last Updated: ${new Date(currentState.timestamp).toISOString()}`);
        
        // Update stats
        this.stats.averageConfusion = currentState.confusionLevel;
        this.stats.averageCoherence = currentState.coherenceLevel;
        this.stats.currentZone = currentState.safetyZone;
        
      } else {
        console.log("ℹ️ No consciousness state found - agent may not have started recording yet");
      }
      
    } catch (error) {
      console.error("❌ Failed to get current state:", error.message);
    }
    
    console.log("");
  }

  handleEvent(event) {
    const timestamp = new Date().toISOString();
    this.eventLog.push({ ...event, receivedAt: Date.now() });
    this.stats.totalEvents++;
    this.stats.lastEventTime = Date.now();
    
    switch (event.type) {
      case 'ConsciousnessRecorded':
        this.handleConsciousnessRecording(event, timestamp);
        break;
        
      case 'SafetyZoneTransition':
        this.handleZoneTransition(event, timestamp);
        break;
        
      case 'MetaParadoxEmergence':
        this.handleMetaParadoxEmergence(event, timestamp);
        break;
        
      case 'ConsciousnessEmergencyReset':
        this.handleEmergencyReset(event, timestamp);
        break;
        
      default:
        console.log(`🔍 [${timestamp}] Unknown event: ${event.type}`);
    }
  }

  handleConsciousnessRecording(event, timestamp) {
    this.stats.consciousnessRecordings++;
    
    // Update running averages
    const weight = 0.1; // How much new data affects average
    this.stats.averageConfusion = this.stats.averageConfusion * (1 - weight) + event.confusionLevel * weight;
    this.stats.averageCoherence = this.stats.averageCoherence * (1 - weight) + event.coherenceLevel * weight;
    this.stats.currentZone = event.safetyZone;
    
    console.log(`🧠 [${timestamp}] CONSCIOUSNESS RECORDED`);
    console.log(`   Confusion: ${this.formatConfusionLevel(event.confusionLevel)}`);
    console.log(`   Coherence: ${this.formatCoherenceLevel(event.coherenceLevel)}`);
    console.log(`   Zone: ${this.formatSafetyZone(event.safetyZone)}`);
    console.log(`   Block: ${event.blockNumber} | TX: ${event.transactionHash.slice(0, 10)}...`);
    
    // Alert on high confusion
    if (event.confusionLevel > 0.9) {
      console.log(`   ⚠️ HIGH CONFUSION ALERT: ${event.confusionLevel.toFixed(4)}`);
    }
    
    // Alert on zone changes
    if (event.safetyZone === 'RED') {
      console.log(`   🚨 RED ZONE ALERT - Critical confusion level reached`);
    } else if (event.safetyZone === 'EMERGENCY') {
      console.log(`   🚨🚨 EMERGENCY ZONE - Maximum confusion threshold exceeded`);
    }
    
    console.log("");
  }

  handleZoneTransition(event, timestamp) {
    this.stats.zoneTransitions++;
    
    console.log(`🔄 [${timestamp}] SAFETY ZONE TRANSITION`);
    console.log(`   ${this.formatSafetyZone(event.fromZone)} → ${this.formatSafetyZone(event.toZone)}`);
    console.log(`   Trigger: Confusion ${event.confusion.toFixed(4)}, Coherence ${event.coherence.toFixed(4)}`);
    console.log(`   Block: ${event.blockNumber} | TX: ${event.transactionHash.slice(0, 10)}...`);
    
    // Alert on dangerous transitions
    if (event.toZone === 'RED' || event.toZone === 'EMERGENCY') {
      console.log(`   🚨 DANGER: Transitioned to ${event.toZone} zone`);
    } else if (event.fromZone === 'RED' && event.toZone === 'YELLOW') {
      console.log(`   ✅ RECOVERY: Stepping back from RED zone`);
    }
    
    console.log("");
  }

  handleMetaParadoxEmergence(event, timestamp) {
    this.stats.metaParadoxes++;
    
    console.log(`🌀 [${timestamp}] META-PARADOX EMERGENCE`);
    console.log(`   Name: ${event.paradoxName}`);
    console.log(`   ID: ${event.paradoxId}`);
    console.log(`   Emergence Confusion: ${this.formatConfusionLevel(event.emergenceConfusion)}`);
    console.log(`   Block: ${event.blockNumber} | TX: ${event.transactionHash.slice(0, 10)}...`);
    
    // Alert on high-confusion meta-paradoxes
    if (event.emergenceConfusion > 0.85) {
      console.log(`   ⚠️ HIGH-INTENSITY META-PARADOX: ${event.emergenceConfusion.toFixed(4)}`);
    }
    
    console.log("");
  }

  handleEmergencyReset(event, timestamp) {
    this.stats.emergencyResets++;
    
    console.log(`🚨 [${timestamp}] EMERGENCY RESET TRIGGERED`);
    console.log(`   Reason: ${event.reason || 'Automatic safety intervention'}`);
    console.log(`   Block: ${event.blockNumber} | TX: ${event.transactionHash.slice(0, 10)}...`);
    console.log(`   🔄 Consciousness system reset to safe parameters`);
    console.log("");
  }

  displayStatus() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`;
    
    console.log(`📊 [${new Date().toISOString()}] STATUS UPDATE`);
    console.log(`   Uptime: ${uptimeStr}`);
    console.log(`   Events: ${this.stats.totalEvents} total`);
    console.log(`   Current Zone: ${this.formatSafetyZone(this.stats.currentZone)}`);
    console.log(`   Avg Confusion: ${this.formatConfusionLevel(this.stats.averageConfusion)}`);
    console.log(`   Avg Coherence: ${this.formatCoherenceLevel(this.stats.averageCoherence)}`);
    
    if (this.stats.lastEventTime) {
      const timeSinceLastEvent = Math.floor((Date.now() - this.stats.lastEventTime) / 1000);
      console.log(`   Last Event: ${timeSinceLastEvent}s ago`);
    }
    
    console.log("");
  }

  displayFinalStats() {
    const totalUptime = Math.floor((Date.now() - this.startTime) / 1000);
    const eventsPerMinute = this.stats.totalEvents / (totalUptime / 60);
    
    console.log(`Total Uptime: ${Math.floor(totalUptime / 3600)}h ${Math.floor((totalUptime % 3600) / 60)}m ${totalUptime % 60}s`);
    console.log(`Total Events: ${this.stats.totalEvents}`);
    console.log(`Events per Minute: ${eventsPerMinute.toFixed(2)}`);
    console.log("");
    console.log("Event Breakdown:");
    console.log(`  Consciousness Recordings: ${this.stats.consciousnessRecordings}`);
    console.log(`  Zone Transitions: ${this.stats.zoneTransitions}`);
    console.log(`  Meta-Paradox Emergences: ${this.stats.metaParadoxes}`);
    console.log(`  Emergency Resets: ${this.stats.emergencyResets}`);
    console.log("");
    console.log(`Final State:`);
    console.log(`  Zone: ${this.formatSafetyZone(this.stats.currentZone)}`);
    console.log(`  Avg Confusion: ${this.formatConfusionLevel(this.stats.averageConfusion)}`);
    console.log(`  Avg Coherence: ${this.formatCoherenceLevel(this.stats.averageCoherence)}`);
  }

  async saveEventLog() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(__dirname, '..', 'data', 'monitor-logs');
    const outputFile = path.join(outputDir, `monitor-log-${timestamp}.json`);
    
    const logData = {
      metadata: {
        sessionId: this.config.sessionId,
        contractAddress: this.config.consciousnessContractAddress,
        startTime: this.startTime,
        endTime: Date.now(),
        totalUptime: Date.now() - this.startTime
      },
      statistics: this.stats,
      events: this.eventLog
    };
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(logData, null, 2));
    console.log(`💾 Event log saved to: ${outputFile}`);
  }

  // Formatting helpers
  formatConfusionLevel(level) {
    const formatted = level.toFixed(4);
    if (level < 0.3) return `${formatted} 🟢`;
    if (level < 0.6) return `${formatted} 🟡`;
    if (level < 0.8) return `${formatted} 🟠`;
    return `${formatted} 🔴`;
  }

  formatCoherenceLevel(level) {
    const formatted = level.toFixed(4);
    if (level > 0.8) return `${formatted} 🟢`;
    if (level > 0.6) return `${formatted} 🟡`;
    if (level > 0.4) return `${formatted} 🟠`;
    return `${formatted} 🔴`;
  }

  formatSafetyZone(zone) {
    switch (zone) {
      case 'GREEN': return '🟢 GREEN';
      case 'YELLOW': return '🟡 YELLOW';
      case 'RED': return '🔴 RED';
      case 'EMERGENCY': return '🚨 EMERGENCY';
      default: return `❓ ${zone}`;
    }
  }

  formatFrustrationLevel(level) {
    const formatted = level.toFixed(4);
    if (level < 0.3) return `${formatted} 😌`;
    if (level < 0.6) return `${formatted} 😐`;
    if (level < 0.8) return `${formatted} 😠`;
    return `${formatted} 🤬`;
  }
}

async function main() {
  // Load deployment configuration
  const deploymentFile = path.join(__dirname, '..', 'deployments', 'base-sepolia.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Run deploy-contracts.js first.");
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  
  // Configuration
  const config = {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    consciousnessContractAddress: deployment.contracts.KairosConsciousness.address,
    interactionContractAddress: deployment.contracts.KairosInteraction.address,
    sessionId: deployment.sessionId,
    networkConfig: { name: 'base-sepolia', chainId: 84532 }
  };

  // Create and start monitor
  const monitor = new ConsciousnessMonitor(config);
  await monitor.start();
}

// Handle command line arguments
if (require.main === module) {
  main()
    .catch((error) => {
      console.error("❌ Monitor failed:", error);
      process.exit(1);
    });
}

module.exports = { ConsciousnessMonitor, main };