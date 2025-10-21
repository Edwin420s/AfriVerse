#!/bin/bash

set -e

echo "🏗️ Provisioning Testnet Environment for AfriVerse"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
LINEA_RPC_URL="https://rpc.testnet.linea.xyz"
CONTRACT_NAME="UjuziRegistry"
DEPLOYER_PRIVATE_KEY="${DEPLOYER_PRIVATE_KEY}"
FAUCET_URL="https://faucet.testnet.linea.xyz"

check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    local missing_deps=()
    
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v jq >/dev/null 2>&1 || missing_deps+=("jq")
    command -v curl >/dev/null 2>&1 || missing_deps+=("curl")
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies satisfied${NC}"
}

setup_environment() {
    echo "🔧 Setting up environment..."
    
    # Create environment file if it doesn't exist
    if [ ! -f .env.testnet ]; then
        cat > .env.testnet << EOF
# Testnet Environment Configuration
NODE_ENV=testnet
WEB3_PROVIDER=$LINEA_RPC_URL
CHAIN_ID=59140
NETWORK_NAME=linea_testnet

# Contract Address (will be filled after deployment)
CONTRACT_ADDRESS=

# Deployer Configuration
DEPLOYER_PRIVATE_KEY=$DEPLOYER_PRIVATE_KEY

# API Configuration
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# IPFS Configuration
IPFS_API=http://localhost:5001
IPFS_GATEWAY=https://ipfs.io/ipfs

# Feature Flags
ENABLE_BLOCKCHAIN=true
ENABLE_IPFS=true
ENABLE_AGENTS=true
EOF
        echo -e "${GREEN}✅ Created .env.testnet configuration file${NC}"
    else
        echo -e "${YELLOW}⚠️ .env.testnet already exists, skipping creation${NC}"
    fi
}

fund_deployer_account() {
    if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
        echo -e "${YELLOW}⚠️ DEPLOYER_PRIVATE_KEY not set. Skipping faucet request.${NC}"
        return 0
    fi
    
    echo "💰 Requesting testnet funds from faucet..."
    
    # Extract address from private key
    local address=$(node -e "
        const { ethers } = require('ethers');
        const wallet = new ethers.Wallet('$DEPLOYER_PRIVATE_KEY');
        console.log(wallet.address);
    ")
    
    echo "📮 Requesting funds for address: $address"
    
    # Request funds from Linea faucet
    local response=$(curl -s -X POST "$FAUCET_URL" \
        -H "Content-Type: application/json" \
        -d "{\"address\": \"$address\"}" || true)
    
    if echo "$response" | grep -q "success\|pending"; then
        echo -e "${GREEN}✅ Funds requested successfully${NC}"
    else
        echo -e "${YELLOW}⚠️ Faucet request may have failed. Response: $response${NC}"
    fi
}

deploy_contracts() {
    echo "📡 Deploying smart contracts..."
    
    cd "$(dirname "$0")/../../smartcontracts"
    
    if [ ! -f hardhat.config.js ]; then
        echo -e "${RED}❌ Hardhat config not found. Are you in the right directory?${NC}"
        return 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing smart contract dependencies..."
        npm install
    fi
    
    # Compile contracts
    echo "🔨 Compiling contracts..."
    npx hardhat compile
    
    # Deploy to testnet
    echo "🚀 Deploying to Linea testnet..."
    npx hardhat run scripts/deploy.js --network linea_testnet
    
    echo -e "${GREEN}✅ Contracts deployed successfully${NC}"
}

setup_database() {
    echo "🗄️ Setting up database..."
    
    cd "$(dirname "$0")/../../services/backend"
    
    if [ ! -f package.json ]; then
        echo -e "${RED}❌ Backend directory not found${NC}"
        return 1
    fi
    
    # Generate Prisma client
    if command -v npx >/dev/null 2>&1; then
        npx prisma generate
        echo -e "${GREEN}✅ Prisma client generated${NC}"
    else
        echo -e "${YELLOW}⚠️ npx not available, skipping Prisma generation${NC}"
    fi
}

create_test_accounts() {
    echo "👥 Creating test accounts..."
    
    # Create a test account for demonstration
    local test_account=$(node -e "
        const { ethers } = require('ethers');
        const wallet = ethers.Wallet.createRandom();
        console.log(JSON.stringify({
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase
        }));
    " 2>/dev/null || echo "{}")
    
    if [ "$test_account" != "{}" ]; then
        echo "$test_account" > test_account.json
        echo -e "${GREEN}✅ Test account created and saved to test_account.json${NC}"
        echo -e "${YELLOW}⚠️ Keep this file secure and do not commit it to version control!${NC}"
    fi
}

display_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Testnet environment provisioning completed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. 📝 Review the .env.testnet configuration file"
    echo "2. 🐳 Start the application: docker-compose up -d"
    echo "3. 🔍 Check contract deployment in deployment-info.txt"
    echo "4. 🌐 Access the frontend at http://localhost:3000"
    echo "5. 🔧 Test the API at http://localhost:4000/health"
    echo ""
    echo "For development:"
    echo "  - Use test_account.json for testing wallet functionality"
    echo "  - Monitor blockchain transactions on https://goerli.lineascan.build"
    echo "  - Check IPFS files at http://localhost:8080/ipfs/<CID>"
    echo ""
}

main() {
    echo -e "${GREEN}Starting AfriVerse Testnet Environment Setup...${NC}"
    echo "================================================"
    
    check_dependencies
    setup_environment
    fund_deployer_account
    deploy_contracts
    setup_database
    create_test_accounts
    display_next_steps
    
    echo -e "${GREEN}✅ Setup completed successfully!${NC}"
}

# Run main function
main "$@"