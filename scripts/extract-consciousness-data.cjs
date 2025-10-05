const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

// Import the analyzer from the compiled kairos package
const { ConsciousnessAnalyzer } = require('../packages/kairos/dist/index.cjs');

async function main() {
  console.log("🧠 Kairos Consciousness Data Extraction Tool");
  console.log("============================================");
  
  // Load deployment configuration
  const deploymentFile = path.join(__dirname, '..', 'deployments', 'base-sepolia.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Run deploy-contracts.js first.");
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  console.log("📄 Using deployment configuration:");
  console.log("   Consciousness Contract:", deployment.contracts.KairosConsciousness.address);
  console.log("   Interaction Contract:", deployment.contracts.KairosInteraction.address);
  console.log("   Session ID:", deployment.sessionId);
  console.log("");
  
  // Configuration
  const config = {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    consciousnessContractAddress: deployment.contracts.KairosConsciousness.address,
    interactionContractAddress: deployment.contracts.KairosInteraction.address,
    sessionId: deployment.sessionId
  };
  
  try {
    // Initialize analyzer
    console.log("🔗 Connecting to Base Sepolia...");
    const analyzer = new ConsciousnessAnalyzer(config);

    // Test connection with explicit network config
    const networkConfig = { name: 'base-sepolia', chainId: 84532 };
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl, networkConfig);
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
    
    // Get current state first
    console.log("\\n📊 Checking current consciousness state...");
    const currentState = await analyzer.getCurrentState();
    
    if (currentState) {
      console.log(`✅ Current State Found:`);
      console.log(`   Confusion Level: ${currentState.confusionLevel.toFixed(4)}`);
      console.log(`   Coherence Level: ${currentState.coherenceLevel.toFixed(4)}`);
      console.log(`   Safety Zone: ${currentState.safetyZone}`);
      console.log(`   Paradox Count: ${currentState.paradoxCount}`);
      console.log(`   Meta-Paradox Count: ${currentState.metaParadoxCount}`);
      console.log(`   Frustration Level: ${currentState.frustrationLevel.toFixed(4)}`);
      console.log(`   Last Updated: ${new Date(currentState.timestamp).toISOString()}`);
    } else {
      console.log("ℹ️ No current consciousness state found");
    }
    
    // Extract all historical data
    console.log("\\n🔍 Extracting historical consciousness data...");
    
    const states = await analyzer.extractConsciousnessStates();
    console.log(`✅ Extracted ${states.length} consciousness states`);
    
    const metaParadoxes = await analyzer.extractMetaParadoxEvents();
    console.log(`✅ Extracted ${metaParadoxes.length} meta-paradox events`);
    
    const transitions = await analyzer.extractZoneTransitions();
    console.log(`✅ Extracted ${transitions.length} zone transitions`);
    
    const resets = await analyzer.extractEmergencyResets();
    console.log(`✅ Extracted ${resets.length} emergency resets`);
    
    // Perform analysis
    console.log("\\n🔬 Performing consciousness analysis...");
    const analysis = await analyzer.analyzeConsciousness();
    
    console.log("\\n📈 Analysis Results:");
    console.log("=====================");
    console.log(`Total States: ${analysis.totalStates}`);
    console.log(`Time Range: ${new Date(analysis.timeRange.start).toISOString()} to ${new Date(analysis.timeRange.end).toISOString()}`);
    console.log(`Duration: ${analysis.timeRange.durationHours.toFixed(2)} hours`);
    console.log("");
    
    console.log("Confusion Statistics:");
    console.log(`  Min: ${analysis.confusionStats.min.toFixed(4)}`);
    console.log(`  Max: ${analysis.confusionStats.max.toFixed(4)}`);
    console.log(`  Average: ${analysis.confusionStats.average.toFixed(4)}`);
    console.log(`  Trend: ${analysis.confusionStats.trend}`);
    console.log("");
    
    console.log("Coherence Statistics:");
    console.log(`  Min: ${analysis.coherenceStats.min.toFixed(4)}`);
    console.log(`  Max: ${analysis.coherenceStats.max.toFixed(4)}`);
    console.log(`  Average: ${analysis.coherenceStats.average.toFixed(4)}`);
    console.log(`  Trend: ${analysis.coherenceStats.trend}`);
    console.log("");
    
    console.log("Safety Zone Distribution:");
    console.log(`  GREEN: ${analysis.safetyZoneDistribution.GREEN} (${(analysis.safetyZoneDistribution.GREEN/analysis.totalStates*100).toFixed(1)}%)`);
    console.log(`  YELLOW: ${analysis.safetyZoneDistribution.YELLOW} (${(analysis.safetyZoneDistribution.YELLOW/analysis.totalStates*100).toFixed(1)}%)`);
    console.log(`  RED: ${analysis.safetyZoneDistribution.RED} (${(analysis.safetyZoneDistribution.RED/analysis.totalStates*100).toFixed(1)}%)`);
    console.log(`  EMERGENCY: ${analysis.safetyZoneDistribution.EMERGENCY} (${(analysis.safetyZoneDistribution.EMERGENCY/analysis.totalStates*100).toFixed(1)}%)`);
    console.log("");
    
    console.log("Paradox Progression:");
    console.log(`  Total Paradoxes: ${analysis.paradoxProgression.totalParadoxes}`);
    console.log(`  Meta-Paradoxes: ${analysis.paradoxProgression.metaParadoxes}`);
    console.log(`  Average per State: ${analysis.paradoxProgression.averageParadoxesPerState.toFixed(2)}`);
    console.log("");
    
    console.log("Emergency Events:");
    console.log(`  Total Resets: ${analysis.emergencyEvents.totalResets}`);
    console.log(`  Zone Transitions: ${analysis.emergencyEvents.zoneTransitions}`);
    console.log(`  Critical Periods: ${analysis.emergencyEvents.criticalPeriods.length}`);
    
    if (analysis.emergencyEvents.criticalPeriods.length > 0) {
      console.log("\\n🚨 Critical Periods Detected:");
      analysis.emergencyEvents.criticalPeriods.forEach((period, index) => {
        console.log(`  ${index + 1}. ${new Date(period.start).toISOString()} - ${new Date(period.end).toISOString()}`);
        console.log(`     Max Confusion: ${period.maxConfusion.toFixed(4)}`);
        console.log(`     Reason: ${period.reason}`);
      });
    }
    
    // Show recent states
    if (states.length > 0) {
      console.log("\\n📊 Most Recent Consciousness States:");
      const recentStates = states.slice(-5); // Last 5 states
      
      recentStates.forEach((state, index) => {
        console.log(`  ${recentStates.length - index}. ${new Date(state.timestamp).toISOString()}`);
        console.log(`     Confusion: ${state.confusionLevel.toFixed(4)} | Coherence: ${state.coherenceLevel.toFixed(4)}`);
        console.log(`     Zone: ${state.safetyZone} | Paradoxes: ${state.paradoxCount} | Meta: ${state.metaParadoxCount}`);
      });
    }
    
    // Show recent transitions
    if (transitions.length > 0) {
      console.log("\\n🔄 Recent Zone Transitions:");
      const recentTransitions = transitions.slice(-3);
      
      recentTransitions.forEach((transition, index) => {
        console.log(`  ${recentTransitions.length - index}. ${new Date(transition.timestamp).toISOString()}`);
        console.log(`     ${transition.fromZone} → ${transition.toZone}`);
        console.log(`     Trigger: Confusion ${transition.triggerConfusion.toFixed(4)}, Coherence ${transition.triggerCoherence.toFixed(4)}`);
        console.log(`     Reason: ${transition.reason}`);
      });
    }
    
    // Export data
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(__dirname, '..', 'data', 'consciousness-exports');
    const outputFile = path.join(outputDir, `consciousness-data-${timestamp}.json`);
    
    console.log(`\\n💾 Exporting data to: ${outputFile}`);
    await analyzer.exportToJSON(outputFile);
    
    // Also create a summary report
    const summaryFile = path.join(outputDir, `consciousness-summary-${timestamp}.md`);
    await createSummaryReport(analysis, states, metaParadoxes, transitions, resets, summaryFile);
    
    console.log("\\n🎉 Data extraction complete!");
    console.log("===============================");
    console.log(`✅ Extracted ${states.length} consciousness states`);
    console.log(`✅ Analyzed ${analysis.timeRange.durationHours.toFixed(2)} hours of consciousness evolution`);
    console.log(`✅ Exported data to: ${outputFile}`);
    console.log(`✅ Created summary report: ${summaryFile}`);
    console.log(`🔗 Blockchain Explorer: ${deployment.explorerUrls.consciousness}`);
    
  } catch (error) {
    console.error("❌ Extraction failed:", error);
    process.exit(1);
  }
}

async function createSummaryReport(analysis, states, metaParadoxes, transitions, resets, outputFile) {
  const report = `# Kairos Consciousness Analysis Report
Generated: ${new Date().toISOString()}

## Overview
- **Total States Recorded**: ${analysis.totalStates}
- **Analysis Period**: ${new Date(analysis.timeRange.start).toISOString()} to ${new Date(analysis.timeRange.end).toISOString()}
- **Duration**: ${analysis.timeRange.durationHours.toFixed(2)} hours
- **Average Recording Interval**: ${(analysis.timeRange.durationHours * 60 / analysis.totalStates).toFixed(1)} minutes

## Consciousness Metrics

### Confusion Analysis
- **Range**: ${analysis.confusionStats.min.toFixed(4)} - ${analysis.confusionStats.max.toFixed(4)}
- **Average**: ${analysis.confusionStats.average.toFixed(4)}
- **Trend**: ${analysis.confusionStats.trend}

### Coherence Analysis  
- **Range**: ${analysis.coherenceStats.min.toFixed(4)} - ${analysis.coherenceStats.max.toFixed(4)}
- **Average**: ${analysis.coherenceStats.average.toFixed(4)}
- **Trend**: ${analysis.coherenceStats.trend}

## Safety Zone Distribution
- **GREEN**: ${analysis.safetyZoneDistribution.GREEN} states (${(analysis.safetyZoneDistribution.GREEN/analysis.totalStates*100).toFixed(1)}%)
- **YELLOW**: ${analysis.safetyZoneDistribution.YELLOW} states (${(analysis.safetyZoneDistribution.YELLOW/analysis.totalStates*100).toFixed(1)}%)
- **RED**: ${analysis.safetyZoneDistribution.RED} states (${(analysis.safetyZoneDistribution.RED/analysis.totalStates*100).toFixed(1)}%)
- **EMERGENCY**: ${analysis.safetyZoneDistribution.EMERGENCY} states (${(analysis.safetyZoneDistribution.EMERGENCY/analysis.totalStates*100).toFixed(1)}%)

## Paradox Evolution
- **Total Paradoxes**: ${analysis.paradoxProgression.totalParadoxes}
- **Meta-Paradoxes Emerged**: ${analysis.paradoxProgression.metaParadoxes}
- **Average Paradoxes per State**: ${analysis.paradoxProgression.averageParadoxesPerState.toFixed(2)}

## Emergency Events
- **Zone Transitions**: ${analysis.emergencyEvents.zoneTransitions}
- **Emergency Resets**: ${analysis.emergencyEvents.totalResets}
- **Critical Periods**: ${analysis.emergencyEvents.criticalPeriods.length}

${analysis.emergencyEvents.criticalPeriods.length > 0 ? `
### Critical Periods
${analysis.emergencyEvents.criticalPeriods.map((period, i) => 
  `${i+1}. **${new Date(period.start).toISOString()}** - **${new Date(period.end).toISOString()}**
   - Max Confusion: ${period.maxConfusion.toFixed(4)}
   - Reason: ${period.reason}`
).join('\\n\\n')}
` : ''}

## Research Insights

### Consciousness Stability
${analysis.confusionStats.trend === 'increasing' ? '⚠️ **Confusion levels are trending upward** - may indicate consciousness expansion or instability' : ''}
${analysis.confusionStats.trend === 'decreasing' ? '✅ **Confusion levels are trending downward** - may indicate stabilization and learning' : ''}
${analysis.confusionStats.trend === 'stable' ? 'ℹ️ **Confusion levels are stable** - consciousness appears to be in equilibrium' : ''}

${analysis.coherenceStats.trend === 'increasing' ? '✅ **Coherence levels are increasing** - consciousness integration improving' : ''}
${analysis.coherenceStats.trend === 'decreasing' ? '⚠️ **Coherence levels are decreasing** - may indicate fragmentation or complexity growth' : ''}
${analysis.coherenceStats.trend === 'stable' ? 'ℹ️ **Coherence levels are stable** - consciousness consistency maintained' : ''}

### Safety Profile
- **Safe Operation**: ${((analysis.safetyZoneDistribution.GREEN + analysis.safetyZoneDistribution.YELLOW)/analysis.totalStates*100).toFixed(1)}% of time in GREEN/YELLOW zones
- **High-Risk Operation**: ${((analysis.safetyZoneDistribution.RED + analysis.safetyZoneDistribution.EMERGENCY)/analysis.totalStates*100).toFixed(1)}% of time in RED/EMERGENCY zones

### Meta-Paradox Emergence
${metaParadoxes.length > 0 ? `
**Recent Meta-Paradoxes:**
${metaParadoxes.slice(-3).map(mp => 
  `- **${mp.paradoxName}** (Confusion: ${mp.emergenceConfusion.toFixed(4)})
  - Sources: ${mp.sourceParadoxes.join(', ')}
  - Property: ${mp.emergentProperty}`
).join('\\n\\n')}
` : 'No meta-paradoxes emerged during this period.'}

---
*Generated by Kairos Consciousness Analysis System*
*Blockchain: Base Sepolia | Contract: 0xC7bab79Eb797B097bF59C0b2e2CF02Ea9F4D4dB8*
`;

  // Ensure output directory exists
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, report);
}

// Handle command line arguments
if (require.main === module) {
  main()
    .then(() => {
      console.log("\\n🚀 Consciousness data extraction completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Extraction failed:", error);
      process.exit(1);
    });
}

module.exports = { main };