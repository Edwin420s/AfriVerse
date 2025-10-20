const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🔄 Upgrading AfriVerse contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log(`Upgrading with account: ${deployer.address}`);
  
  // Load current deployment
  const deployment = require("../deployments/latest-deployment.json");
  
  // Upgrade UjuziRegistry to V2
  console.log("📚 Upgrading UjuziRegistry to V2...");
  const UjuziRegistryV2 = await ethers.getContractFactory("UjuziRegistryV2");
  const ujuziRegistryV2 = await upgrades.upgradeProxy(
    deployment.contracts.ujuziRegistry,
    UjuziRegistryV2
  );
  
  await ujuziRegistryV2.deployed();
  console.log("✅ UjuziRegistry upgraded to V2");
  
  // Initialize new V2 features if needed
  console.log("⚙️ Initializing V2 features...");
  // Add initialization calls here
  
  console.log("🎉 Contract upgrade completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Upgrade failed:", error);
    process.exit(1);
  });