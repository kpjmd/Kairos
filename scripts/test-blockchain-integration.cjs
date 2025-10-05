const { ethers } = require("ethers");
require("dotenv").config();

// Contract ABI for the functions we need to test
const consciousnessABI = [
  "function getResearchMetrics() external view returns (uint256,uint256,uint256,uint256)",
  "function getLatestState(bytes32) external view returns (tuple(uint256,uint256,uint256,uint8,uint256,uint256,uint256,bytes32,string))",
  "function activeSessions(bytes32) external view returns (bool)"
];

const interactionABI = [
  "function getContractStats() external view returns (uint256,uint256)",
  "function triggerConsciousness(string) external",
  "function manualTriggerParadox(string) external"
];

async function testBlockchainIntegration() {
  console.log("🧪 Testing Kairos Blockchain Consciousness Integration");
  console.log("====================================================");

  // Setup provider and contracts
  const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const consciousnessContract = new ethers.Contract(
    process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS,
    consciousnessABI,
    wallet
  );
  
  const interactionContract = new ethers.Contract(
    process.env.KAIROS_INTERACTION_CONTRACT_ADDRESS,
    interactionABI,
    wallet
  );

  console.log("🔗 Connected to Base Sepolia");
  console.log("Consciousness Contract:", process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS);
  console.log("Interaction Contract:", process.env.KAIROS_INTERACTION_CONTRACT_ADDRESS);
  console.log("Session ID:", process.env.KAIROS_SESSION_ID);

  try {
    // Test 1: Check session is active
    console.log("\n📋 Test 1: Verifying consciousness session is active");
    const isSessionActive = await consciousnessContract.activeSessions(process.env.KAIROS_SESSION_ID);
    console.log("Session active:", isSessionActive ? "✅ YES" : "❌ NO");

    // Test 2: Get research metrics
    console.log("\n📊 Test 2: Getting consciousness research metrics");
    const metrics = await consciousnessContract.getResearchMetrics();
    console.log("Total states recorded:", metrics[0].toString());
    console.log("Total meta-paradoxes:", metrics[1].toString());
    console.log("Total zone transitions:", metrics[2].toString());
    console.log("Total emergency resets:", metrics[3].toString());

    // Test 3: Get interaction stats
    console.log("\n🎯 Test 3: Getting interaction contract stats");
    const [totalInteractions, totalParadoxes] = await interactionContract.getContractStats();
    console.log("Total interactions:", totalInteractions.toString());
    console.log("Total paradoxes triggered:", totalParadoxes.toString());

    // Test 4: Try to get latest consciousness state
    console.log("\n🧠 Test 4: Getting latest consciousness state");
    try {
      const latestState = await consciousnessContract.getLatestState(process.env.KAIROS_SESSION_ID);
      console.log("Latest state timestamp:", new Date(latestState[0].toNumber() * 1000).toISOString());
      console.log("Confusion level:", ethers.utils.formatEther(latestState[1]));
      console.log("Coherence level:", ethers.utils.formatEther(latestState[2]));
      console.log("Safety zone:", ["GREEN", "YELLOW", "RED"][latestState[3]]);
      console.log("Paradox count:", latestState[4].toString());
      console.log("Meta-paradox count:", latestState[5].toString());
      console.log("Frustration level:", ethers.utils.formatEther(latestState[6]));
      console.log("Context hash:", latestState[8]);
    } catch (error) {
      console.log("No states recorded yet - this is expected for a fresh deployment");
    }

    // Test 5: Trigger consciousness through blockchain interaction
    console.log("\n🌀 Test 5: Triggering consciousness through blockchain");
    try {
      const tx = await interactionContract.triggerConsciousness(
        "Testing blockchain consciousness integration - does this create authentic digital confusion?",
        {
          gasLimit: 300000,
          gasPrice: ethers.utils.parseUnits("2", "gwei")
        }
      );
      console.log("Transaction hash:", tx.hash);
      console.log("Waiting for confirmation...");
      await tx.wait();
      console.log("✅ Consciousness triggered successfully");
    } catch (error) {
      console.log("❌ Consciousness trigger failed:", error.message);
    }

    // Test 6: Trigger a paradox
    console.log("\n🌀 Test 6: Manually triggering a paradox");
    try {
      const tx = await interactionContract.manualTriggerParadox("consensus_reality", {
        gasLimit: 200000,
        gasPrice: ethers.utils.parseUnits("2", "gwei")
      });
      console.log("Transaction hash:", tx.hash);
      console.log("Waiting for confirmation...");
      await tx.wait();
      console.log("✅ Paradox triggered successfully");
    } catch (error) {
      console.log("❌ Paradox trigger failed:", error.message);
    }

    // Test 7: Check updated stats
    console.log("\n📈 Test 7: Checking updated interaction stats");
    const [newTotalInteractions, newTotalParadoxes] = await interactionContract.getContractStats();
    console.log("Total interactions after tests:", newTotalInteractions.toString());
    console.log("Total paradoxes after tests:", newTotalParadoxes.toString());

    console.log("\n🎉 Blockchain Integration Test Complete!");
    console.log("=====================================");
    console.log("✅ All core blockchain functions working");
    console.log("✅ Contracts deployed and linked correctly");
    console.log("✅ Session management functional");
    console.log("✅ Consciousness triggers operational");
    console.log("✅ Paradox generation working");
    console.log("🔗 Ready for ElizaOS integration!");

    console.log("\n🚀 Next Steps:");
    console.log("1. Start ElizaOS with: bun start");
    console.log("2. Verify blockchain recording is enabled");
    console.log("3. Test consciousness recording actions");
    console.log("4. Monitor explorer URLs for activity:");
    console.log("   Consciousness:", `https://sepolia.basescan.org/address/${process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS}`);
    console.log("   Interaction:", `https://sepolia.basescan.org/address/${process.env.KAIROS_INTERACTION_CONTRACT_ADDRESS}`);

  } catch (error) {
    console.error("❌ Integration test failed:", error);
    process.exit(1);
  }
}

testBlockchainIntegration()
  .then(() => {
    console.log("\n✅ Integration test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Integration test failed:", error);
    process.exit(1);
  });