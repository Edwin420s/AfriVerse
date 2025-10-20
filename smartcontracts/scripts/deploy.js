const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying AfriVerse Smart Contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // Deploy ValidatorManager
  console.log("📋 Deploying ValidatorManager...");
  const ValidatorManager = await ethers.getContractFactory("ValidatorManager");
  const validatorManager = await ValidatorManager.deploy();
  await validatorManager.deployed();
  console.log(`ValidatorManager deployed to: ${validatorManager.address}`);

  // Deploy CulturalToken
  console.log("🎨 Deploying CulturalToken...");
  const CulturalToken = await ethers.getContractFactory("CulturalToken");
  const culturalToken = await CulturalToken.deploy();
  await culturalToken.deployed();
  console.log(`CulturalToken deployed to: ${culturalToken.address}`);

  // Deploy UjuziRegistry
  console.log("📚 Deploying UjuziRegistry...");
  const UjuziRegistry = await ethers.getContractFactory("UjuziRegistry");
  const ujuziRegistry = await UjuziRegistry.deploy(
    validatorManager.address,
    culturalToken.address
  );
  await ujuziRegistry.deployed();
  console.log(`UjuziRegistry deployed to: ${ujuziRegistry.address}`);

  // Setup roles and permissions
  console.log("⚙️ Setting up roles and permissions...");
  
  // Grant MINTER_ROLE to UjuziRegistry in CulturalToken
  const MINTER_ROLE = await culturalToken.MINTER_ROLE();
  await culturalToken.grantRole(MINTER_ROLE, ujuziRegistry.address);
  console.log("✅ Granted MINTER_ROLE to UjuziRegistry");

  // Grant BURNER_ROLE to UjuziRegistry in CulturalToken
  const BURNER_ROLE = await culturalToken.BURNER_ROLE();
  await culturalToken.grantRole(BURNER_ROLE, ujuziRegistry.address);
  console.log("✅ Granted BURNER_ROLE to UjuziRegistry");

  // Grant ADMIN_ROLE to deployer in ValidatorManager
  const ADMIN_ROLE = await validatorManager.ADMIN_ROLE();
  await validatorManager.grantRole(ADMIN_ROLE, deployer.address);
  console.log("✅ Granted ADMIN_ROLE to deployer");

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      validatorManager: validatorManager.address,
      culturalToken: culturalToken.address,
      ujuziRegistry: ujuziRegistry.address,
    },
    deployer: deployer.address,
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `deployment-${network.name}-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("📄 Deployment info saved to:", deploymentFile);
  console.log("🎉 AfriVerse deployment completed successfully!");

  // Print verification commands
  console.log("\n🔍 Verification commands:");
  console.log(`npx hardhat verify --network ${network.name} ${validatorManager.address}`);
  console.log(`npx hardhat verify --network ${network.name} ${culturalToken.address}`);
  console.log(`npx hardhat verify --network ${network.name} ${ujuziRegistry.address} ${validatorManager.address} ${culturalToken.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });