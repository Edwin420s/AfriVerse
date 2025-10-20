const { run } = require("hardhat");

async function verify(contractAddress, constructorArguments) {
  console.log(`🔍 Verifying contract at ${contractAddress}...`);
  
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract already verified!");
    } else {
      console.error("❌ Verification failed:", error);
    }
  }
}

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log(`Verifying contracts on network: ${network.name} (${network.chainId})`);

  // Load deployment info
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "../deployments");
  
  const files = fs.readdirSync(deploymentsDir)
    .filter(file => file.startsWith(`deployment-${network.name}`))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error("❌ No deployment files found for this network");
    return;
  }

  const latestDeployment = files[0];
  const deploymentInfo = JSON.parse(
    fs.readFileSync(path.join(deploymentsDir, latestDeployment), "utf8")
  );

  console.log("📄 Using deployment info from:", latestDeployment);

  // Verify ValidatorManager
  await verify(deploymentInfo.contracts.validatorManager, []);

  // Verify CulturalToken
  await verify(deploymentInfo.contracts.culturalToken, []);

  // Verify UjuziRegistry
  await verify(deploymentInfo.contracts.ujuziRegistry, [
    deploymentInfo.contracts.validatorManager,
    deploymentInfo.contracts.culturalToken
  ]);

  console.log("🎉 All contracts verified successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });