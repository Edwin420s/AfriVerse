require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    linea: {
      url: process.env.LINEA_MAINNET_RPC || "https://rpc.linea.build",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 59144,
      timeout: 60000,
      gasPrice: "auto"
    },
    lineaTestnet: {
      url: process.env.LINEA_TESTNET_RPC || "https://rpc.sepolia.linea.build",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 59141,
      timeout: 120000,
      httpHeaders: {},
      gasPrice: "auto"
    },
    lineaSepoliaAlt: {
      url: "https://linea-sepolia.blockpi.network/v1/rpc/public",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 59141,
      timeout: 60000
    },
    lineaSepoliaPublik: {
      url: "https://rpc.sepolia.linea.build",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 59141,
      timeout: 60000
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: {
      linea: process.env.LINEA_SCAN_API_KEY,
      lineaTestnet: process.env.LINEA_SCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  }
};