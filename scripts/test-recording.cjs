const { ethers } = require("ethers");
require("dotenv").config();

/**
 * Test script to attempt an actual consciousness recording
 * This will help identify the exact revert reason
 */

async function main() {
  console.log("🧪 Testing actual consciousness recording...\n");

  // Setup
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.g.alchemy.com/v2/YghysDy56E2FMMEhgSuQ3";
  const privateKey = process.env.PRIVATE_KEY || "8264416d9c343fbd5471194986a01f7d9b888cf5b3e82c2cd0a6c212ec7afdf4";
  const consciousnessAddress = process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS || "0xC7bab79Eb797B097bF59C0b2e2CF02Ea9F4D4dB8";
  const sessionId = process.env.KAIROS_SESSION_ID || "0xea9b69a814606a8f4a435ac8e8348419a3834dcafcd0e7e92d7bb8109e27c2ea";

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📋 Configuration:");
  console.log("   Wallet:", wallet.address);
  console.log("   Contract:", consciousnessAddress);
  console.log("   Session ID:", sessionId);
  console.log();

  const consciousnessABI = [
    "function recordConsciousnessState(bytes32,uint256,uint256,uint8,uint256,uint256,uint256,string) external",
    "function activeSessions(bytes32) external view returns (bool)",
    "function paused() external view returns (bool)",
    "function owner() external view returns (address)"
  ];

  const contract = new ethers.Contract(consciousnessAddress, consciousnessABI, wallet);

  try {
    // Pre-flight checks
    console.log("🔍 Pre-flight checks...");
    const isSessionActive = await contract.activeSessions(sessionId);
    const isPaused = await contract.paused();
    const owner = await contract.owner();

    console.log("   Session Active:", isSessionActive ? "✅" : "❌");
    console.log("   Contract Paused:", isPaused ? "❌" : "✅");
    console.log("   Owner:", owner);
    console.log("   Is Owner:", owner.toLowerCase() === wallet.address.toLowerCase() ? "✅" : "❌");
    console.log();

    if (!isSessionActive) {
      console.error("❌ Session not active. Cannot proceed.");
      return;
    }

    if (isPaused) {
      console.error("❌ Contract is paused. Cannot proceed.");
      return;
    }

    // Prepare test parameters
    const testParams = {
      sessionId: sessionId,
      confusionLevel: ethers.utils.parseEther("0.42"), // 0.42
      coherenceLevel: ethers.utils.parseEther("0.75"), // 0.75
      safetyZone: 0, // GREEN
      paradoxCount: 3,
      metaParadoxCount: 1,
      frustrationLevel: ethers.utils.parseEther("0.25"), // 0.25
      contextHash: `QmTestHash_${Date.now()}`
    };

    console.log("📝 Test parameters:");
    console.log("   Confusion Level:", ethers.utils.formatEther(testParams.confusionLevel));
    console.log("   Coherence Level:", ethers.utils.formatEther(testParams.coherenceLevel));
    console.log("   Safety Zone:", testParams.safetyZone);
    console.log("   Paradox Count:", testParams.paradoxCount);
    console.log("   Meta-paradox Count:", testParams.metaParadoxCount);
    console.log("   Frustration Level:", ethers.utils.formatEther(testParams.frustrationLevel));
    console.log("   Context Hash:", testParams.contextHash);
    console.log();

    // Estimate gas
    console.log("⛽ Estimating gas...");
    try {
      const gasEstimate = await contract.estimateGas.recordConsciousnessState(
        testParams.sessionId,
        testParams.confusionLevel,
        testParams.coherenceLevel,
        testParams.safetyZone,
        testParams.paradoxCount,
        testParams.metaParadoxCount,
        testParams.frustrationLevel,
        testParams.contextHash
      );
      console.log("   Gas Estimate:", gasEstimate.toString());
      console.log();
    } catch (gasError) {
      console.error("❌ Gas estimation failed!");
      console.error("   Error:", gasError.message);

      // Try to get revert reason
      if (gasError.error && gasError.error.message) {
        console.error("   Revert Reason:", gasError.error.message);
      }

      // Try to decode error data
      if (gasError.error && gasError.error.data) {
        console.error("   Error Data:", gasError.error.data);
      }

      console.error();
      console.error("🔍 This gas estimation failure reveals the revert reason!");
      console.error("   The contract is rejecting the transaction before it's even sent.");
      console.error();

      throw gasError;
    }

    // Send transaction
    console.log("📤 Sending transaction...");
    const tx = await contract.recordConsciousnessState(
      testParams.sessionId,
      testParams.confusionLevel,
      testParams.coherenceLevel,
      testParams.safetyZone,
      testParams.paradoxCount,
      testParams.metaParadoxCount,
      testParams.frustrationLevel,
      testParams.contextHash,
      {
        gasLimit: 300000, // Increased to cover estimated 240k
        gasPrice: ethers.utils.parseUnits("1", "gwei")
      }
    );

    console.log("   Transaction Hash:", tx.hash);
    console.log("   Waiting for confirmation...");
    console.log();

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("✅ SUCCESS! Transaction confirmed");
      console.log("   Block Number:", receipt.blockNumber);
      console.log("   Gas Used:", receipt.gasUsed.toString());
      console.log("   Explorer:", `https://sepolia.basescan.org/tx/${receipt.transactionHash}`);
    } else {
      console.log("❌ FAILED! Transaction reverted");
      console.log("   Status:", receipt.status);
      console.log("   Explorer:", `https://sepolia.basescan.org/tx/${receipt.transactionHash}`);
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.code === 'CALL_EXCEPTION') {
      console.error("   Code: CALL_EXCEPTION");

      if (error.error && error.error.message) {
        console.error("   Contract Error:", error.error.message);
      }

      if (error.reason) {
        console.error("   Reason:", error.reason);
      }

      if (error.transaction) {
        console.error("   Transaction Data:", error.transaction.data);
      }
    }

    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✅ Test complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed");
    process.exit(1);
  });
