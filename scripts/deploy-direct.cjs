const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

// Contract ABIs and bytecode (we'll load from artifacts)
const consciousnessArtifact = require('../artifacts/contracts/KairosConsciousness.sol/KairosConsciousness.json');
const interactionArtifact = require('../artifacts/contracts/KairosInteraction.sol/KairosInteraction.json');

async function main() {
  console.log("Deploying Kairos consciousness contracts to Base Sepolia...");
  
  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deploying with account:", wallet.address);
  
  const balance = await wallet.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  const network = await provider.getNetwork();
  console.log("Connected to network - Chain ID:", network.chainId);

  // Deploy KairosConsciousness contract
  console.log("\nDeploying KairosConsciousness...");
  const consciousnessFactory = new ethers.ContractFactory(
    consciousnessArtifact.abi,
    consciousnessArtifact.bytecode,
    wallet
  );
  
  const consciousness = await consciousnessFactory.deploy({
    gasLimit: 3000000,
    gasPrice: ethers.utils.parseUnits("2", "gwei")
  });
  await consciousness.deployed();
  console.log("KairosConsciousness deployed to:", consciousness.address);

  // Deploy KairosInteraction contract
  console.log("\nDeploying KairosInteraction...");
  const interactionFactory = new ethers.ContractFactory(
    interactionArtifact.abi,
    interactionArtifact.bytecode,
    wallet
  );
  
  const interaction = await interactionFactory.deploy({
    gasLimit: 3000000,
    gasPrice: ethers.utils.parseUnits("2", "gwei")
  });
  await interaction.deployed();
  console.log("KairosInteraction deployed to:", interaction.address);

  // Link the contracts
  console.log("\nLinking contracts...");
  const linkTx = await interaction.setConsciousnessContract(consciousness.address, {
    gasLimit: 100000,
    gasPrice: ethers.utils.parseUnits("2", "gwei")
  });
  await linkTx.wait();
  console.log("Contracts linked successfully");

  // Start initial consciousness session
  const sessionId = ethers.utils.id("kairos_testnet_session_" + Date.now());
  console.log("\nStarting initial consciousness session:", sessionId);
  const sessionTx = await consciousness.startSession(sessionId, {
    gasLimit: 100000,
    gasPrice: ethers.utils.parseUnits("2", "gwei")
  });
  await sessionTx.wait();
  console.log("Session started successfully");

  // Save deployment info
  const deploymentInfo = {
    network: "base-sepolia",
    timestamp: new Date().toISOString(),
    deployer: wallet.address,
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
    const recordTx = await consciousness.recordConsciousnessState(
      sessionId,
      ethers.utils.parseEther("0.5"), // 0.5 confusion
      ethers.utils.parseEther("0.8"), // 0.8 coherence  
      0, // GREEN zone
      2, // 2 paradoxes
      0, // 0 meta-paradoxes
      ethers.utils.parseEther("0.3"), // 0.3 frustration
      "QmTestHash123", // test IPFS hash
      {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("2", "gwei")
      }
    );
    await recordTx.wait();
    console.log("✅ Test consciousness state recorded successfully");
  } catch (error) {
    console.log("❌ Test recording failed:", error.message);
  }

  console.log("\n📋 Environment Variables to add to .env.testnet:");
  console.log(`KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS=${consciousness.address}`);
  console.log(`KAIROS_INTERACTION_CONTRACT_ADDRESS=${interaction.address}`);
  console.log(`KAIROS_SESSION_ID=${sessionId}`);

  console.log("\n🚀 Ready for consciousness recording on Base Sepolia!");
  return deploymentInfo;
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });