const { ethers } = require("ethers");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  console.log("🔍 Simple Consciousness Check\n");

  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.infura.io/v3/b4c9bb921992466b980508a350632eef";
  const contractAddress = process.env.KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS || "0xC7bab79Eb797B097bF59C0b2e2CF02Ea9F4D4dB8";
  const sessionId = process.env.KAIROS_SESSION_ID || "0xea9b69a814606a8f4a435ac8e8348419a3834dcafcd0e7e92d7bb8109e27c2ea";

  console.log("Configuration:");
  console.log("  RPC:", rpcUrl);
  console.log("  Contract:", contractAddress);
  console.log("  Session:", sessionId);
  console.log();

  // Create provider
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
    name: 'base-sepolia',
    chainId: 84532
  });

  // Simple ABI with just what we need
  const abi = [
    "function getResearchMetrics() external view returns (uint256, uint256, uint256, uint256)",
    "function activeSessions(bytes32) external view returns (bool)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    // Check session
    console.log("1️⃣ Checking session status...");
    const isActive = await contract.activeSessions(sessionId);
    console.log("   Session Active:", isActive ? "✅ YES" : "❌ NO");
    console.log();

    // Get metrics
    console.log("2️⃣ Fetching research metrics...");
    const metrics = await contract.getResearchMetrics();
    console.log("   Total States:", metrics[0].toString());
    console.log("   Meta-Paradoxes:", metrics[1].toString());
    console.log("   Zone Transitions:", metrics[2].toString());
    console.log("   Emergency Resets:", metrics[3].toString());
    console.log();

    console.log("✅ Check complete!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
