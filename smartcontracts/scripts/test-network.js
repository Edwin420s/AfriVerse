const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing network connectivity...\n");

  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log("✅ Network detected:");
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Network Name: ${network.name || 'Unknown'}\n`);

    // Get block number
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`✅ Latest block: ${blockNumber}\n`);

    // Get signer
    const [signer] = await ethers.getSigners();
    console.log(`✅ Signer address: ${signer.address}`);

    // Get balance
    const balance = await signer.getBalance();
    console.log(`✅ Balance: ${ethers.utils.formatEther(balance)} ETH\n`);

    // Get gas price
    const gasPrice = await ethers.provider.getGasPrice();
    console.log(`✅ Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei\n`);

    console.log("🎉 Network connectivity test passed!");
    console.log("✅ You can now deploy contracts\n");

  } catch (error) {
    console.error("❌ Network connectivity test failed!\n");
    console.error("Error:", error.message);
    
    console.log("\n📝 Troubleshooting steps:");
    console.log("1. Check your internet connection");
    console.log("2. Verify RPC URL in hardhat.config.js");
    console.log("3. Try alternative RPC endpoint:");
    console.log("   npx hardhat run scripts/test-network.js --network lineaSepoliaAlt");
    console.log("4. Check if RPC service is down: https://linea.statuspage.io/");
    console.log("5. Consider using Infura or Alchemy RPC (see .env.example)");
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
