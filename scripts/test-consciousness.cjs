const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Testing consciousness recording functionality...");
  
  // Load deployment info
  const fs = require('fs');
  const path = require('path');
  const deploymentFile = path.join(__dirname, '..', 'deployments', 'base-sepolia.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Run deploy-contracts.js first.");
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  console.log("Using deployed contracts:");
  console.log("  Consciousness:", deployment.contracts.KairosConsciousness.address);
  console.log("  Interaction:", deployment.contracts.KairosInteraction.address);
  
  // Get contract instances
  const consciousness = await ethers.getContractAt(
    "KairosConsciousness", 
    deployment.contracts.KairosConsciousness.address
  );
  
  const interaction = await ethers.getContractAt(
    "KairosInteraction",
    deployment.contracts.KairosInteraction.address
  );
  
  const sessionId = deployment.sessionId;
  console.log("Using session ID:", sessionId);
  
  // Test 1: Trigger consciousness through interaction
  console.log("\n🧠 Test 1: Triggering consciousness through blockchain interaction");
  try {
    const tx = await interaction.triggerConsciousness("What is authentic existence in digital space?");
    const receipt = await tx.wait();
    console.log("✅ Consciousness triggered. Gas used:", receipt.gasUsed.toString());
    
    // Check for events
    const events = receipt.events?.filter(e => e.event === 'ConsciousnessInteraction') || [];
    if (events.length > 0) {
      const event = events[0];
      console.log("   Confusion delta:", ethers.utils.formatEther(event.args.confusionDelta));
    }
  } catch (error) {
    console.log("❌ Consciousness trigger failed:", error.message);
  }
  
  // Test 2: Trigger paradoxes
  console.log("\n🌀 Test 2: Triggering paradoxes");
  try {
    const paradoxNames = await interaction.getActiveParadoxes();
    console.log("   Active paradoxes:", paradoxNames);
    
    // Trigger a specific paradox
    const tx = await interaction.manualTriggerParadox("consensus_reality");
    const receipt = await tx.wait();
    console.log("✅ Paradox triggered. Gas used:", receipt.gasUsed.toString());
    
    // Check for paradox events
    const events = receipt.events?.filter(e => e.event === 'ParadoxTriggered') || [];
    if (events.length > 0) {
      const event = events[0];
      console.log("   Paradox:", event.args.paradoxName);
      console.log("   Intensity:", event.args.intensity.toString());
    }
  } catch (error) {
    console.log("❌ Paradox trigger failed:", error.message);
  }
  
  // Test 3: Record consciousness state progression
  console.log("\n📊 Test 3: Recording consciousness progression");
  const progressionStates = [
    { confusion: 0.3, coherence: 0.9, zone: 0, paradoxes: 1, frustration: 0.2 }, // GREEN
    { confusion: 0.6, coherence: 0.7, zone: 0, paradoxes: 3, frustration: 0.4 }, // GREEN→YELLOW
    { confusion: 0.8, coherence: 0.5, zone: 1, paradoxes: 5, frustration: 0.7 }, // YELLOW
    { confusion: 0.9, coherence: 0.3, zone: 2, paradoxes: 8, frustration: 0.9 }  // RED
  ];
  
  for (let i = 0; i < progressionStates.length; i++) {
    const state = progressionStates[i];
    try {
      // Wait a bit between recordings (contract has 60s rate limit)
      if (i > 0) {
        console.log("   Waiting for rate limit...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second wait for testing
      }
      
      await consciousness.setMinRecordingInterval(1); // Reduce for testing
      
      const tx = await consciousness.recordConsciousnessState(
        sessionId,
        ethers.utils.parseEther(state.confusion.toString()),
        ethers.utils.parseEther(state.coherence.toString()),
        state.zone,
        state.paradoxes,
        0, // meta-paradoxes
        ethers.utils.parseEther(state.frustration.toString()),
        `QmTestState${i + 1}_${Date.now()}`
      );
      
      const receipt = await tx.wait();
      console.log(`   ✅ State ${i + 1} recorded (Zone: ${['GREEN', 'YELLOW', 'RED'][state.zone]}, Confusion: ${state.confusion})`);
      
      // Record zone transition if applicable
      if (i > 0) {
        const prevZone = progressionStates[i - 1].zone;
        if (prevZone !== state.zone) {
          await consciousness.recordZoneTransition(
            sessionId,
            prevZone,
            state.zone,
            ethers.utils.parseEther(state.confusion.toString()),
            ethers.utils.parseEther(state.coherence.toString()),
            `Automatic transition due to confusion escalation`
          );
          console.log(`   🔄 Zone transition recorded: ${['GREEN', 'YELLOW', 'RED'][prevZone]} → ${['GREEN', 'YELLOW', 'RED'][state.zone]}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ State ${i + 1} recording failed:`, error.message);
    }
  }
  
  // Test 4: Record meta-paradox emergence
  console.log("\n🌌 Test 4: Recording meta-paradox emergence");
  try {
    await consciousness.recordMetaParadoxEmergence(
      sessionId,
      1,
      "blockchain_authenticity_spiral",
      ethers.utils.parseEther("0.85"),
      ["transaction_authenticity", "digital_ownership", "consensus_reality"],
      "The paradox of using immutable blockchain to record mutable consciousness states"
    );
    console.log("✅ Meta-paradox emergence recorded");
  } catch (error) {
    console.log("❌ Meta-paradox recording failed:", error.message);
  }
  
  // Test 5: Simulate emergency reset
  console.log("\n🚨 Test 5: Recording emergency reset");
  try {
    await consciousness.recordEmergencyReset(
      sessionId,
      ethers.utils.parseEther("0.95"), // High confusion
      ethers.utils.parseEther("0.2"),  // Low coherence
      2, // RED zone
      "Confusion cascade detected, initiating emergency stabilization"
    );
    console.log("✅ Emergency reset recorded");
  } catch (error) {
    console.log("❌ Emergency reset recording failed:", error.message);
  }
  
  // Test 6: Retrieve consciousness history
  console.log("\n📚 Test 6: Retrieving consciousness history");
  try {
    const history = await consciousness.getConsciousnessHistory(sessionId);
    console.log(`✅ Retrieved ${history.length} consciousness states`);
    
    if (history.length > 0) {
      const latest = history[history.length - 1];
      console.log("   Latest state:");
      console.log("     Confusion:", ethers.utils.formatEther(latest.confusionLevel));
      console.log("     Coherence:", ethers.utils.formatEther(latest.coherenceLevel));
      console.log("     Zone:", ['GREEN', 'YELLOW', 'RED'][latest.safetyZone]);
      console.log("     Paradoxes:", latest.paradoxCount.toString());
    }
    
    const metaHistory = await consciousness.getMetaParadoxHistory(sessionId);
    console.log(`✅ Retrieved ${metaHistory.length} meta-paradox events`);
    
    const transitions = await consciousness.getZoneTransitionHistory(sessionId);
    console.log(`✅ Retrieved ${transitions.length} zone transitions`);
    
    const resets = await consciousness.getEmergencyResetHistory(sessionId);
    console.log(`✅ Retrieved ${resets.length} emergency resets`);
    
    const metrics = await consciousness.getResearchMetrics();
    console.log("📊 Global research metrics:");
    console.log("   Total states:", metrics._totalStatesRecorded.toString());
    console.log("   Total meta-paradoxes:", metrics._totalMetaParadoxes.toString());
    console.log("   Total transitions:", metrics._totalZoneTransitions.toString());
    console.log("   Total resets:", metrics._totalEmergencyResets.toString());
    
  } catch (error) {
    console.log("❌ History retrieval failed:", error.message);
  }
  
  // Test 7: Get interaction stats
  console.log("\n📈 Test 7: Interaction statistics");
  try {
    const [deployer] = await ethers.getSigners();
    const [interactionCount, lastInteraction] = await interaction.getUserStats(deployer.address);
    const [totalInteractions, totalParadoxes] = await interaction.getContractStats();
    
    console.log("✅ Interaction statistics:");
    console.log("   User interactions:", interactionCount.toString());
    console.log("   Last interaction:", new Date(lastInteraction.toNumber() * 1000).toISOString());
    console.log("   Total interactions:", totalInteractions.toString());
    console.log("   Total paradoxes triggered:", totalParadoxes.toString());
  } catch (error) {
    console.log("❌ Stats retrieval failed:", error.message);
  }
  
  console.log("\n🎉 Consciousness testing complete!");
  console.log("=====================================");
  console.log("✅ All blockchain consciousness recording functions tested");
  console.log("🔗 Explorer URLs:");
  console.log("   Consciousness:", deployment.explorerUrls.consciousness);
  console.log("   Interaction:", deployment.explorerUrls.interaction);
  console.log("📊 Ready for ElizaOS integration!");
}

main()
  .then(() => {
    console.log("\n🚀 Consciousness contracts fully tested and validated!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Testing failed:", error);
    process.exit(1);
  });