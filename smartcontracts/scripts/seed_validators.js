const { ethers } = require("hardhat");

async function main() {
  console.log("🌱 Seeding initial validators...");

  const [deployer, ...validators] = await ethers.getSigners();
  
  // Load deployed contracts
  const deployment = require("../deployments/latest-deployment.json");
  const ValidatorManager = await ethers.getContractFactory("ValidatorManager");
  const validatorManager = await ValidatorManager.attach(deployment.contracts.validatorManager);

  console.log(`Using ValidatorManager at: ${validatorManager.address}`);
  console.log(`Deployer: ${deployer.address}`);

  // Get current validator stake amount
  const validatorStake = await validatorManager.validatorStake();
  console.log(`Validator stake required: ${ethers.utils.formatEther(validatorStake)} ETH`);

  // Add initial validators (first 5 accounts after deployer)
  const initialValidators = validators.slice(0, 5);
  
  for (let i = 0; i < initialValidators.length; i++) {
    const validator = initialValidators[i];
    
    try {
      console.log(`\n👤 Adding validator ${i + 1}: ${validator.address}`);
      
      // Check if already validator
      const isValidator = await validatorManager.isValidator(validator.address);
      if (isValidator) {
        console.log("✅ Already a validator, skipping...");
        continue;
      }

      // Apply as validator by sending stake
      const tx = await validatorManager.connect(validator).applyAsValidator({
        value: validatorStake
      });
      
      await tx.wait();
      console.log("✅ Successfully added as validator");
      
      // Get validator info
      const validatorInfo = await validatorManager.getValidatorInfo(validator.address);
      console.log(`   Stake: ${ethers.utils.formatEther(validatorInfo.stake)} ETH`);
      console.log(`   Reputation: ${validatorInfo.reputation}`);
      console.log(`   Join Date: ${new Date(validatorInfo.joinDate * 1000).toISOString()}`);

    } catch (error) {
      console.error(`❌ Failed to add validator ${validator.address}:`, error.message);
    }
  }

  // Display final validator count
  const validatorCount = await validatorManager.getValidatorCount();
  console.log(`\n📊 Total validators: ${validatorCount}`);

  // Display all validators
  const allValidators = await validatorManager.getAllValidators();
  console.log("\n👥 All validators:");
  allValidators.forEach((validator, index) => {
    console.log(`   ${index + 1}. ${validator}`);
  });

  console.log("\n🎉 Validator seeding completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Validator seeding failed:", error);
    process.exit(1);
  });