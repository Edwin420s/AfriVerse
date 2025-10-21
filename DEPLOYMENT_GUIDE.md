# 🚀 AfriVerse Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v18+) and **npm** installed
2. **Linea Testnet ETH** for gas fees
   - Get free testnet ETH from [Linea Faucet](https://faucet.goerli.linea.build/)
3. **API Keys**:
   - Pinata JWT (for IPFS): [https://pinata.cloud/](https://pinata.cloud/)
   - OpenAI API Key (optional for AI features): [https://platform.openai.com/](https://platform.openai.com/)
   - Linea Scan API Key (for contract verification): [https://lineascan.build/](https://lineascan.build/)

---

## 🔑 Step 1: Environment Setup

### Smart Contracts (.env)

```bash
cd smartcontracts
cp .env.example .env
```

Edit `smartcontracts/.env`:

```env
# REQUIRED: Your wallet private key (DO NOT share or commit this!)
PRIVATE_KEY=your_metamask_private_key_here

# OPTIONAL: For contract verification on Linea Scan
LINEA_SCAN_API_KEY=your_linea_scan_api_key

# Network RPC URLs (default values should work)
LINEA_MAINNET_RPC=https://rpc.linea.build
LINEA_TESTNET_RPC=https://rpc.goerli.linea.build

# OPTIONAL: Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_key
```

### Backend Service (.env)

```bash
cd services/backend
cp .env.example .env
```

Edit `services/backend/.env`:

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0

# Database (PostgreSQL)
DATABASE_URL="postgresql://afri:afri_pass@localhost:5432/afriverse"

# Redis
REDIS_URL=redis://localhost:6379

# IPFS (Pinata) - REQUIRED
PINATA_JWT=your_pinata_jwt_here
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret

# AI Services - OPTIONAL but recommended
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_TOKEN=your_huggingface_token

# Blockchain - Will be updated after smart contract deployment
WEB3_PROVIDER=https://rpc.goerli.linea.build
CONTRACT_ADDRESS=0xYourUjuziRegistryAddressHere
PRIVATE_KEY=your_private_key

# MeTTa
METTA_API_URL=http://localhost:8080

# Frontend
FRONTEND_URL=http://localhost:3000

# API Keys
API_KEYS=your_api_key_1,your_api_key_2

# Logging
LOG_LEVEL=info
```

### Frontend (.env.local)

```bash
cd frontend
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WEB3_PROVIDER=https://rpc.goerli.linea.build
NEXT_PUBLIC_CHAIN_ID=59140
```

---

## 📦 Step 2: Install Dependencies

```bash
# Smart Contracts
cd smartcontracts
npm install

# Backend
cd ../services/backend
npm install

# Frontend
cd ../../frontend
npm install

# Agent Services
cd ../services/agentverse
pip install -r requirements.txt
```

---

## 🔐 Step 3: Deploy Smart Contracts

### Compile Contracts

```bash
cd smartcontracts
npm run compile
```

### Run Tests (Optional but Recommended)

```bash
npm test
```

### Deploy to Linea Testnet

```bash
npm run deploy:testnet
```

**Expected Output:**

```
🚀 Deploying AfriVerse Smart Contracts...
Deploying contracts with account: 0xYourAddress
📋 Deploying ValidatorManager...
ValidatorManager deployed to: 0xValidatorManagerAddress
🎨 Deploying CulturalToken...
CulturalToken deployed to: 0xCulturalTokenAddress
📚 Deploying UjuziRegistry...
UjuziRegistry deployed to: 0xUjuziRegistryAddress
⚙️ Setting up roles and permissions...
✅ Granted MINTER_ROLE to UjuziRegistry
✅ Granted BURNER_ROLE to UjuziRegistry
✅ Granted ADMIN_ROLE to deployer
📄 Deployment info saved to: ./deployments/deployment-lineaTestnet-1234567890.json
🎉 AfriVerse deployment completed successfully!
```

### Save Deployment Addresses

The deployment script saves addresses to:
- `smartcontracts/deployments/latest-deployment.json`

**Important:** Copy the `UjuziRegistry` address and update:
1. `services/backend/.env` → `CONTRACT_ADDRESS`
2. `README.md` → Smart Contracts section

### Verify Contracts (Optional)

```bash
npm run verify:testnet
```

---

## 🗄️ Step 4: Setup Database

```bash
cd services/backend

# Create PostgreSQL database
# Make sure PostgreSQL is running, then:
createdb afriverse

# Run Prisma migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

---

## ▶️ Step 5: Start Services

### Terminal 1: Backend

```bash
cd services/backend
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

### Terminal 3: Agent Services (Optional)

```bash
cd services/agentverse
python -m agents.transcribe_agent
```

### Terminal 4: Redis (Required for job queues)

```bash
redis-server
```

---

## 🌐 Step 6: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Docs:** http://localhost:4000/api-docs

---

## ✅ Verification Checklist

- [ ] Smart contracts deployed to Linea Testnet
- [ ] Deployment addresses saved and documented
- [ ] Backend `.env` updated with contract address
- [ ] PostgreSQL database created and migrated
- [ ] Redis server running
- [ ] Backend server running (port 4000)
- [ ] Frontend running (port 3000)
- [ ] Can submit test cultural knowledge
- [ ] IPFS uploads working (Pinata configured)

---

## 🔍 Testing the Deployment

1. **Navigate to frontend:** http://localhost:3000
2. **Click "Share Knowledge"**
3. **Fill in the form:**
   - Title: "Test Submission"
   - Description: "Testing AfriVerse deployment"
   - Language: "English"
   - Category: "Story"
   - Upload a small audio/video file or text
4. **Submit and verify:**
   - Check backend logs for processing
   - Verify IPFS upload success
   - Check blockchain transaction on [Linea Testnet Explorer](https://goerli.lineascan.build/)

---

## 🐛 Troubleshooting

### Issue: "Insufficient funds for gas"
- **Solution:** Get testnet ETH from [Linea Faucet](https://faucet.goerli.linea.build/)

### Issue: "Cannot connect to database"
- **Solution:** Ensure PostgreSQL is running and `DATABASE_URL` in `.env` is correct

### Issue: "IPFS upload failed"
- **Solution:** Verify `PINATA_JWT` and API keys are correct in `services/backend/.env`

### Issue: "Contract deployment failed"
- **Solution:** 
  - Check `PRIVATE_KEY` in `smartcontracts/.env`
  - Ensure you have sufficient testnet ETH
  - Verify RPC URL is correct

---

## 📝 Next Steps After Deployment

1. ✅ Update `README.md` with deployed contract addresses
2. 🎥 Record demo video showing the deployed application
3. 📊 Add deployment links to hackathon submission
4. 🧪 Test all features end-to-end
5. 📤 Submit to BGI Hackathon 2025

---

## 🔒 Security Notes

- **NEVER** commit `.env` files to Git
- **NEVER** share your private keys
- Use separate wallets for testnet and mainnet
- Rotate API keys regularly
- For production, use environment variable management services (AWS Secrets Manager, HashiCorp Vault, etc.)

---

## 📞 Support

If you encounter issues:
1. Check the [README.md](./README.md) documentation
2. Review logs in `services/backend/logs/`
3. Open an issue on GitHub
4. Contact: edwin420@outlook.com

---

**Good luck with your deployment! 🚀🌍**
