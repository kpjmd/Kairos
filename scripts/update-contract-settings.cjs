const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

async function main() {
  console.log("🔧 Updating KairosConsciousness Contract Settings");
  console.log("===============================================");

  // Load deployment configuration
  const deploymentFile = path.join(__dirname, '..', 'deployments', 'base-sepolia.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Run deploy-contracts.js first.");
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  console.log("📄 Using deployment configuration:");
  console.log("   Consciousness Contract:", deployment.contracts.KairosConsciousness.address);
  console.log("   Session ID:", deployment.sessionId);
  console.log("");

  // Configuration
  const config = {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    privateKey: process.env.PRIVATE_KEY,
    consciousnessContractAddress: deployment.contracts.KairosConsciousness.address,
  };

  if (!config.privateKey) {
    console.error("❌ PRIVATE_KEY environment variable is required");
    process.exit(1);
  }

  try {
    // Initialize provider and wallet
    console.log("🔗 Connecting to Base Sepolia...");
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);
    
    // Test connection
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
    
    // Check wallet balance
    const balance = await wallet.getBalance();
    console.log(`💰 Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    if (balance.lt(ethers.utils.parseEther("0.001"))) {
      console.warn("⚠️ Low wallet balance - may not have enough for gas fees");
    }

    // Load contract ABI
    const consciousnessABI = [
      "function setMinRecordingInterval(uint256) external",
      "function minRecordingInterval() external view returns (uint256)",
      "function owner() external view returns (address)",
      "function pauseRecording() external",
      "function unpauseRecording() external",
      "function paused() external view returns (bool)"
    ];

    console.log("🔧 Creating contract instance...");
    const contract = new ethers.Contract(
      config.consciousnessContractAddress,
      consciousnessABI,
      wallet
    );

    // Verify we're the owner
    console.log("🔍 Verifying contract ownership...");
    const owner = await contract.owner();
    console.log(`   Contract owner: ${owner}`);
    console.log(`   Wallet address: ${wallet.address}`);
    
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      console.error("❌ Wallet is not the contract owner. Cannot update settings.");
      process.exit(1);
    }

    // Get current settings
    console.log("📊 Current contract settings:");
    const currentInterval = await contract.minRecordingInterval();
    const isPaused = await contract.paused();
    console.log(`   Min Recording Interval: ${currentInterval.toString()} seconds`);
    console.log(`   Contract Paused: ${isPaused}`);
    console.log("");

    // Update minimum recording interval to 120 seconds (2 minutes)
    const newInterval = 120;
    console.log(`🔄 Updating minimum recording interval to ${newInterval} seconds...`);
    
    const gasPrice = await provider.getGasPrice();
    const adjustedGasPrice = gasPrice.mul(110).div(100); // 10% buffer
    
    const tx = await contract.setMinRecordingInterval(newInterval, {
      gasLimit: 100000, // Conservative gas limit for simple state change
      gasPrice: adjustedGasPrice
    });

    console.log(`📤 Transaction submitted: ${tx.hash}`);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`💰 Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`💸 Gas cost: ${ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice))} ETH`);

    // Verify the change
    console.log("🔍 Verifying update...");
    const updatedInterval = await contract.minRecordingInterval();
    console.log(`✅ New minimum recording interval: ${updatedInterval.toString()} seconds`);

    if (updatedInterval.eq(newInterval)) {
      console.log("🎉 Contract settings updated successfully!");
    } else {
      console.error("❌ Update verification failed");
    }

    console.log("");
    console.log("📋 Summary:");
    console.log(`   Old interval: ${currentInterval.toString()} seconds`);
    console.log(`   New interval: ${updatedInterval.toString()} seconds`);
    console.log(`   Transaction: ${tx.hash}`);
    console.log(`   Block: ${receipt.blockNumber}`);
    
  } catch (error) {
    console.error("❌ Contract update failed:", error);
    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.error("   Insufficient funds for gas fees. Please add more ETH to the wallet.");
    } else if (error.message.includes('revert')) {
      console.error("   Transaction reverted. Check if you're the contract owner.");
    }
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  main()
    .then(() => {
      console.log("🚀 Contract settings update completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Update failed:", error);
      process.exit(1);
    });
}

module.exports = { main };