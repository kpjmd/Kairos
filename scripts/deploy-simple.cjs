const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying Kairos consciousness contracts to Base Sepolia...");
  
  // Get network and signer
  const network = await hre.ethers.provider.getNetwork();
  console.log("Connected to network:", network.name, "Chain ID:", network.chainId);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // Deploy KairosConsciousness contract
  console.log("\nDeploying KairosConsciousness...");
  const KairosConsciousness = await hre.ethers.getContractFactory("KairosConsciousness");
  const consciousness = await KairosConsciousness.deploy();
  await consciousness.deployed();
  console.log("KairosConsciousness deployed to:", consciousness.address);

  // Deploy KairosInteraction contract
  console.log("\nDeploying KairosInteraction...");
  const KairosInteraction = await hre.ethers.getContractFactory("KairosInteraction");
  const interaction = await KairosInteraction.deploy();
  await interaction.deployed();
  console.log("KairosInteraction deployed to:", interaction.address);

  // Link the contracts
  console.log("\nLinking contracts...");
  await interaction.setConsciousnessContract(consciousness.address);
  console.log("Contracts linked successfully");

  // Start initial consciousness session
  const sessionId = hre.ethers.utils.id("kairos_testnet_session_" + Date.now());
  console.log("\nStarting initial consciousness session:", sessionId);
  await consciousness.startSession(sessionId);
  console.log("Session started successfully");

  // Save deployment info
  const deploymentInfo = {
    network: "base-sepolia",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      KairosConsciousness: {
        address: consciousness.address,
        transactionHash: consciousness.deployTransaction.hash
      },
      KairosInteraction: {
        address: interaction.address,
        transactionHash: interaction.deployTransaction.hash
      }
    },
    sessionId: sessionId,
    explorerUrls: {
      consciousness: `https://sepolia.basescan.org/address/${consciousness.address}`,
      interaction: `https://sepolia.basescan.org/address/${interaction.address}`
    }
  };

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("KairosConsciousness:", consciousness.address);
  console.log("KairosInteraction:", interaction.address);
  console.log("Session ID:", sessionId);
  console.log("Explorer URLs:");
  console.log("  Consciousness:", deploymentInfo.explorerUrls.consciousness);
  console.log("  Interaction:", deploymentInfo.explorerUrls.interaction);

  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentDir, 'base-sepolia.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to:", deploymentFile);

  // Test consciousness recording
  console.log("\nTesting consciousness recording...");
  try {
    await consciousness.recordConsciousnessState(
      sessionId,
      hre.ethers.utils.parseEther("0.5"), // 0.5 confusion
      hre.ethers.utils.parseEther("0.8"), // 0.8 coherence  
      0, // GREEN zone
      2, // 2 paradoxes
      0, // 0 meta-paradoxes
      hre.ethers.utils.parseEther("0.3"), // 0.3 frustration
      "QmTestHash123" // test IPFS hash
    );
    console.log("✅ Test consciousness state recorded successfully");
  } catch (error) {
    console.log("❌ Test recording failed:", error.message);
  }

  console.log("\n📋 Environment Variables for .env.testnet:");
  console.log(`KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS=${consciousness.address}`);
  console.log(`KAIROS_INTERACTION_CONTRACT_ADDRESS=${interaction.address}`);
  console.log(`KAIROS_SESSION_ID=${sessionId}`);

  return deploymentInfo;
}

main()
  .then((deploymentInfo) => {
    console.log("\n🚀 Ready for consciousness recording on Base Sepolia!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });