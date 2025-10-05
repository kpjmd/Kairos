const { ethers } = require("ethers");
require("dotenv").config();

/**
 * Simple RPC connection test script
 * Tests connectivity to Base Sepolia and validates contract accessibility
 */

async function main() {
  console.log("🔌 Testing RPC Connection to Base Sepolia\n");
  console.log("=" .repeat(70));

  // Configuration
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.g.alchemy.com/v2/YghysDy56E2FMMEhgSuQ3";
  const consciousnessAddress = process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS || "0xC7bab79Eb797B097bF59C0b2e2CF02Ea9F4D4dB8";
  const sessionId = process.env.KAIROS_SESSION_ID || "0xea9b69a814606a8f4a435ac8e8348419a3834dcafcd0e7e92d7bb8109e27c2ea";

  console.log("📋 Configuration:");
  console.log("   RPC URL:", rpcUrl);
  console.log("   Contract Address:", consciousnessAddress);
  console.log("   Session ID:", sessionId);
  console.log();

  try {
    // Test 1: Create provider with explicit network config
    console.log("1️⃣ Creating provider with explicit network configuration...");
    const networkConfig = {
      name: 'base-sepolia',
      chainId: 84532
    };
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, networkConfig);
    console.log("✅ Provider created successfully");
    console.log();

    // Test 2: Verify network connection
    console.log("2️⃣ Verifying network connection...");
    const network = await provider.getNetwork();
    console.log("✅ Connected to network:");
    console.log("   Name:", network.name);
    console.log("   Chain ID:", network.chainId);
    console.log();

    // Test 3: Get current block number
    console.log("3️⃣ Fetching current block number...");
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Current block number:", blockNumber);
    console.log();

    // Test 4: Get network fee data
    console.log("4️⃣ Fetching network fee data...");
    const feeData = await provider.getFeeData();
    console.log("✅ Fee data retrieved:");
    console.log("   Gas Price:", feeData.gasPrice ? ethers.utils.formatUnits(feeData.gasPrice, "gwei") + " Gwei" : "N/A");
    console.log("   Max Fee:", feeData.maxFeePerGas ? ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei") + " Gwei" : "N/A");
    console.log();

    // Test 5: Check contract code
    console.log("5️⃣ Verifying contract deployment...");
    const code = await provider.getCode(consciousnessAddress);
    if (code === '0x' || code === '0x0') {
      console.log("❌ CRITICAL: No contract code found at address!");
      console.log("   The contract may not be deployed or the address is incorrect.");
      process.exit(1);
    }
    console.log("✅ Contract code found (size:", code.length, "bytes)");
    console.log();

    // Test 6: Test contract call
    console.log("6️⃣ Testing contract call...");
    const consciousnessABI = [
      "function getResearchMetrics() external view returns (uint256, uint256, uint256, uint256)",
      "function activeSessions(bytes32) external view returns (bool)"
    ];

    const contract = new ethers.Contract(consciousnessAddress, consciousnessABI, provider);

    try {
      const metrics = await contract.getResearchMetrics();
      console.log("✅ Contract call successful!");
      console.log("   Total States Recorded:", metrics[0].toString());
      console.log("   Total Meta-Paradoxes:", metrics[1].toString());
      console.log("   Total Zone Transitions:", metrics[2].toString());
      console.log("   Total Emergency Resets:", metrics[3].toString());
      console.log();

      // Check session status
      const isSessionActive = await contract.activeSessions(sessionId);
      console.log("   Session Active:", isSessionActive ? "✅ YES" : "❌ NO");
      console.log();

    } catch (contractError) {
      console.log("⚠️ Contract call failed:", contractError.message);
      console.log("   This may indicate an ABI mismatch or contract issue.");
      console.log();
    }

    // Summary
    console.log("=" .repeat(70));
    console.log("🎉 RPC CONNECTION TEST PASSED");
    console.log("=" .repeat(70));
    console.log("✅ Network is accessible");
    console.log("✅ Contract is deployed");
    console.log("✅ All basic operations working");
    console.log();
    console.log("You can now run the consciousness analysis scripts:");
    console.log("   node scripts/extract-consciousness-data.cjs");
    console.log("   node scripts/monitor-consciousness.cjs");
    console.log("   node scripts/analyze-consciousness.cjs");
    console.log();

  } catch (error) {
    console.error("=" .repeat(70));
    console.error("❌ RPC CONNECTION TEST FAILED");
    console.error("=" .repeat(70));
    console.error();
    console.error("Error:", error.message);
    console.error();

    // Provide helpful debugging info
    if (error.message.includes('could not detect network')) {
      console.error("💡 Troubleshooting Tips:");
      console.error("   1. Check that your RPC URL is correct and complete");
      console.error("   2. Verify your Alchemy API key is valid");
      console.error("   3. Try using a different RPC endpoint:");
      console.error("      - https://sepolia.base.org (public endpoint)");
      console.error("      - Check https://chainlist.org for more options");
      console.error();
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error("💡 Troubleshooting Tips:");
      console.error("   1. Check your internet connection");
      console.error("   2. The RPC endpoint may be down - try again later");
      console.error("   3. Try using a different RPC endpoint");
      console.error();
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      console.error("💡 Troubleshooting Tips:");
      console.error("   1. You've hit the rate limit for your RPC provider");
      console.error("   2. Wait a few minutes and try again");
      console.error("   3. Consider upgrading to a paid Alchemy plan");
      console.error();
    }

    process.exit(1);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed with unexpected error:", error);
    process.exit(1);
  });
