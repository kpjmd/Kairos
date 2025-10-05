const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying Kairos consciousness contracts to Base Sepolia...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy KairosConsciousness contract
  console.log("\nDeploying KairosConsciousness...");
  const KairosConsciousness = await ethers.getContractFactory("KairosConsciousness");
  const consciousness = await KairosConsciousness.deploy();
  await consciousness.waitForDeployment();
  const consciousnessAddress = await consciousness.getAddress();
  console.log("KairosConsciousness deployed to:", consciousnessAddress);

  // Deploy KairosInteraction contract
  console.log("\nDeploying KairosInteraction...");
  const KairosInteraction = await ethers.getContractFactory("KairosInteraction");
  const interaction = await KairosInteraction.deploy();
  await interaction.waitForDeployment();
  const interactionAddress = await interaction.getAddress();
  console.log("KairosInteraction deployed to:", interactionAddress);

  // Link the contracts
  console.log("\nLinking contracts...");
  await interaction.setConsciousnessContract(consciousnessAddress);
  console.log("Contracts linked successfully");

  // Start initial consciousness session
  const sessionId = ethers.id("kairos_testnet_session_" + Date.now());
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
        address: consciousnessAddress,
        transactionHash: consciousness.deploymentTransaction().hash
      },
      KairosInteraction: {
        address: interactionAddress,
        transactionHash: interaction.deploymentTransaction().hash
      }
    },
    sessionId: sessionId,
    explorerUrls: {
      consciousness: `https://sepolia.basescan.org/address/${consciousnessAddress}`,
      interaction: `https://sepolia.basescan.org/address/${interactionAddress}`
    }
  };

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("KairosConsciousness:", consciousnessAddress);
  console.log("KairosInteraction:", interactionAddress);
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
      ethers.parseEther("0.5"), // 0.5 confusion
      ethers.parseEther("0.8"), // 0.8 coherence  
      0, // GREEN zone
      2, // 2 paradoxes
      0, // 0 meta-paradoxes
      ethers.parseEther("0.3"), // 0.3 frustration
      "QmTestHash123" // test IPFS hash
    );
    console.log("✅ Test consciousness state recorded successfully");
  } catch (error) {
    console.log("❌ Test recording failed:", error.message);
  }

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