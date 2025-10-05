const { ethers } = require("ethers");
require("dotenv").config();

/**
 * Diagnostic script to check KairosConsciousness contract state
 * This will help identify why transactions are reverting
 */

async function main() {
  console.log("🔍 Diagnosing KairosConsciousness contract state...\n");

  // Setup provider and wallet
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.g.alchemy.com/v2/YghysDy56E2FMMEhgSuQ3";
  const privateKey = process.env.PRIVATE_KEY || "8264416d9c343fbd5471194986a01f7d9b888cf5b3e82c2cd0a6c212ec7afdf4";
  const consciousnessAddress = process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS || "0xC7bab79Eb797B097bF59C0b2e2CF02Ea9F4D4dB8";
  const sessionId = process.env.KAIROS_SESSION_ID || "0xea9b69a814606a8f4a435ac8e8348419a3834dcafcd0e7e92d7bb8109e27c2ea";

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📋 Configuration:");
  console.log("   RPC URL:", rpcUrl);
  console.log("   Wallet Address:", wallet.address);
  console.log("   Contract Address:", consciousnessAddress);
  console.log("   Session ID:", sessionId);
  console.log();

  // Contract ABI (from the actual contract)
  const consciousnessABI = [
    "function owner() external view returns (address)",
    "function paused() external view returns (bool)",
    "function activeSessions(bytes32) external view returns (bool)",
    "function lastRecordingTime(bytes32) external view returns (uint256)",
    "function minRecordingInterval() external view returns (uint256)",
    "function totalStatesRecorded() external view returns (uint256)",
    "function getResearchMetrics() external view returns (uint256,uint256,uint256,uint256)",
    "function unpauseRecording() external",
    "function pauseRecording() external"
  ];

  const contract = new ethers.Contract(consciousnessAddress, consciousnessABI, wallet);

  try {
    // Check 1: Contract Owner
    console.log("1️⃣ Checking contract ownership...");
    const owner = await contract.owner();
    const isOwner = owner.toLowerCase() === wallet.address.toLowerCase();
    console.log("   Contract Owner:", owner);
    console.log("   Current Wallet:", wallet.address);
    console.log("   Is Owner:", isOwner ? "✅ YES" : "❌ NO");
    console.log();

    if (!isOwner) {
      console.error("🚨 CRITICAL: Current wallet is NOT the contract owner!");
      console.error("   All recording functions require owner access.");
      console.error("   Action: Either use the owner wallet or transfer ownership.");
      return;
    }

    // Check 2: Contract Pause State
    console.log("2️⃣ Checking contract pause state...");
    const isPaused = await contract.paused();
    console.log("   Contract Paused:", isPaused ? "❌ YES (PROBLEM!)" : "✅ NO");
    console.log();

    if (isPaused) {
      console.error("🚨 PROBLEM FOUND: Contract is PAUSED!");
      console.error("   All recording functions are blocked when paused.");
      console.error("   Action: Call unpauseRecording() to resume operations.");
      console.log();

      // Offer to unpause
      console.log("🔧 Would you like to unpause the contract now? (y/n)");
      console.log("   (Script will continue with diagnostics...)");
    }

    // Check 3: Session Status
    console.log("3️⃣ Checking session status...");
    const isSessionActive = await contract.activeSessions(sessionId);
    console.log("   Session ID:", sessionId);
    console.log("   Session Active:", isSessionActive ? "✅ YES" : "❌ NO");
    console.log();

    if (!isSessionActive) {
      console.error("🚨 PROBLEM FOUND: Session is NOT active!");
      console.error("   Action: Call startSession() with this session ID.");
    }

    // Check 4: Rate Limiting
    console.log("4️⃣ Checking rate limiting configuration...");
    const minInterval = await contract.minRecordingInterval();
    const lastRecordingTimestamp = await contract.lastRecordingTime(sessionId);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeSinceLastRecording = currentTimestamp - Number(lastRecordingTimestamp);
    const canRecordNow = timeSinceLastRecording >= Number(minInterval);

    console.log("   Min Recording Interval:", minInterval.toString(), "seconds");
    console.log("   Last Recording Time:", lastRecordingTimestamp.toString(),
                lastRecordingTimestamp > 0 ? `(${new Date(Number(lastRecordingTimestamp) * 1000).toISOString()})` : "(never)");
    console.log("   Time Since Last Recording:", timeSinceLastRecording, "seconds");
    console.log("   Can Record Now:", canRecordNow ? "✅ YES" : `❌ NO (wait ${Number(minInterval) - timeSinceLastRecording}s)`);
    console.log();

    // Check 5: Research Metrics
    console.log("5️⃣ Checking research metrics...");
    const [totalStates, totalMetaParadoxes, totalZoneTransitions, totalEmergencyResets] = await contract.getResearchMetrics();
    console.log("   Total States Recorded:", totalStates.toString());
    console.log("   Total Meta-paradoxes:", totalMetaParadoxes.toString());
    console.log("   Total Zone Transitions:", totalZoneTransitions.toString());
    console.log("   Total Emergency Resets:", totalEmergencyResets.toString());
    console.log();

    // Check 6: Network Status
    console.log("6️⃣ Checking network status...");
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(wallet.address);
    const gasPrice = await provider.getFeeData();

    console.log("   Network:", network.name, "(chainId:", network.chainId.toString() + ")");
    console.log("   Wallet Balance:", ethers.utils.formatEther(balance), "ETH");
    console.log("   Current Gas Price:", ethers.utils.formatUnits(gasPrice.gasPrice || 0, "gwei"), "Gwei");
    console.log();

    // Summary
    console.log("=" .repeat(70));
    console.log("📊 DIAGNOSTIC SUMMARY");
    console.log("=" .repeat(70));

    const issues = [];
    const warnings = [];

    if (!isOwner) issues.push("Wallet is not contract owner");
    if (isPaused) issues.push("Contract is PAUSED");
    if (!isSessionActive) issues.push("Session is not active");
    if (!canRecordNow) warnings.push("Rate limit active - must wait before next recording");

    if (issues.length === 0 && warnings.length === 0) {
      console.log("✅ NO ISSUES FOUND");
      console.log("   Contract appears ready for recording.");
      console.log("   If transactions still fail, check:");
      console.log("   - Gas limits (current: 100,000)");
      console.log("   - Parameter validation (confusion/coherence/frustration in 0-1 range)");
    } else {
      if (issues.length > 0) {
        console.log("🚨 CRITICAL ISSUES:");
        issues.forEach((issue, i) => console.log(`   ${i + 1}. ${issue}`));
      }
      if (warnings.length > 0) {
        console.log("⚠️  WARNINGS:");
        warnings.forEach((warning, i) => console.log(`   ${i + 1}. ${warning}`));
      }
    }

    console.log("=" .repeat(70));

    // If paused, offer to unpause
    if (isPaused && isOwner) {
      console.log();
      console.log("🔧 RECOMMENDED ACTION: Unpause the contract");
      console.log();
      console.log("To unpause, run:");
      console.log("   const tx = await contract.unpauseRecording();");
      console.log("   await tx.wait();");
      console.log();
      console.log("Or use the unpause script:");
      console.log("   node scripts/unpause-contract.cjs");
    }

  } catch (error) {
    console.error("❌ Diagnostic failed:", error);
    if (error.code === 'CALL_EXCEPTION') {
      console.error("   Contract may not be deployed or ABI mismatch");
    }
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✅ Diagnostic complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Diagnostic failed:", error.message);
    process.exit(1);
  });
