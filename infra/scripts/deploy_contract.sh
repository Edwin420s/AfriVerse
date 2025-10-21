#!/bin/bash

set -e

echo "🚀 Deploying AfriVerse Smart Contract to Linea Testnet"

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting." >&2; exit 1; }

# Navigate to smart contracts directory
cd "$(dirname "$0")/../../smartcontracts"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Load environment variables
if [ -f .env ]; then
    echo "🔐 Loading environment variables..."
    source .env
else
    echo "⚠️  No .env file found. Using default settings."
fi

# Compile contracts
echo "🔨 Compiling smart contracts..."
npx hardhat compile

# Run tests
echo "🧪 Running tests..."
npx hardhat test

# Deploy to Linea testnet
echo "📡 Deploying to Linea Testnet..."
npx hardhat run scripts/deploy.js --network linea_testnet

# Verify contract on explorer
if [ -n "$LINEA_SCAN_API_KEY" ]; then
    echo "🔍 Verifying contract on LineaScan..."
    npx hardhat verify --network linea_testnet <CONTRACT_ADDRESS>
else
    echo "⚠️  LINEA_SCAN_API_KEY not set. Skipping verification."
fi

echo "✅ Deployment completed successfully!"
echo "📝 Contract address saved to deployment-info.txt"