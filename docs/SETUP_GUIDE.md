# AfriVerse - Quick Setup Guide

**For BGI25 Hackathon - AfriVerse: Preserving Wisdom Through AGI**

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Docker** and Docker Compose
- **Git**
- **MetaMask** wallet (for blockchain interactions)

---

## Step 1: Clone and Initial Setup (5 minutes)

```bash
# Clone repository
git clone https://github.com/Edwin420s/AfriVerse.git
cd AfriVerse

# Verify structure
ls -la
# Should see: frontend/, services/, smartcontracts/, infra/, README.md
```

---

## Step 2: Install Backend Dependencies (5 minutes)

```bash
cd services/backend

# Install Node.js dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Verify installation
npm list --depth=0
```

**Expected packages:**
- express, cors, helmet, morgan
- @prisma/client, prisma
- ethers, axios
- ioredis, bull
- multer, express-fileupload
- zod, winston, dotenv

---

## Step 3: Install Frontend Dependencies (5 minutes)

```bash
cd ../../frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected packages:**
- next, react, react-dom
- tailwindcss, autoprefixer, postcss
- lucide-react, framer-motion
- axios, web3

---

## Step 4: Install Agent Dependencies (5 minutes)

```bash
cd ../services/agentverse

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

**Expected packages:**
- uagents, requests, aiohttp
- openai, transformers, torch
- web3, redis, pydantic

---

## Step 5: Install Smart Contract Dependencies (5 minutes)

```bash
cd ../../smartcontracts

# Install dependencies
npm install

# Compile contracts
npm run compile

# Verify compilation
ls -la artifacts/contracts/
```

You should see compiled `.json` files for UjuziRegistry, CulturalToken, and ValidatorManager.

---

## Step 6: Configure Environment Variables (10 minutes)

### Backend Environment

```bash
cd ../services/backend

# Copy example to actual env file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your preferred editor
```

**Required values to update:**

```env
# Database (use Docker defaults for local dev)
DATABASE_URL="postgresql://afri:afri_pass@localhost:5432/afriverse"

# Redis
REDIS_URL=redis://localhost:6379

# IPFS - Get from https://pinata.cloud
PINATA_JWT=your_actual_pinata_jwt_token

# AI Services
OPENAI_API_KEY=sk-your_actual_openai_key
HUGGINGFACE_TOKEN=hf_your_actual_huggingface_token

# Blockchain (Linea Testnet)
WEB3_PROVIDER=https://rpc.goerli.linea.build
PRIVATE_KEY=your_wallet_private_key_WITHOUT_0x_prefix
CONTRACT_ADDRESS=0x...  # Will fill after deployment

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment

```bash
cd ../../frontend

# Copy example
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

**Required values:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Will fill after deployment
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
```

### AgentVerse Environment

```bash
cd ../services/agentverse

# Create .env file
cat > .env << EOL
BACKEND_URL=http://localhost:4000
OPENAI_API_KEY=sk-your_actual_openai_key
HUGGINGFACE_TOKEN=hf_your_actual_huggingface_token
EOL
```

### Smart Contracts Environment

```bash
cd ../../smartcontracts

# Copy example
cp .env.example .env

# Edit .env
nano .env
```

**Required values:**

```env
PRIVATE_KEY=your_wallet_private_key_WITHOUT_0x_prefix
LINEA_TESTNET_RPC=https://rpc.goerli.linea.build
LINEA_SCAN_API_KEY=your_lineascan_api_key_optional
```

---

## Step 7: Start Infrastructure Services (5 minutes)

```bash
cd ../services

# Start PostgreSQL and Redis using Docker
docker compose up -d postgres redis

# Wait for services to be healthy (30 seconds)
docker compose ps

# Verify databases are running
docker compose logs postgres
docker compose logs redis
```

Expected output: Both services should show "ready to accept connections"

---

## Step 8: Run Database Migrations (5 minutes)

```bash
cd backend

# Run migrations
npm run prisma:migrate

# When prompted, enter migration name:
# > init

# Verify database schema
npm run prisma:studio
# This opens Prisma Studio in your browser at http://localhost:5555
```

You should see tables: Entry, Validation, User, Community, Cache

---

## Step 9: Deploy Smart Contracts to Testnet (10 minutes)

**Prerequisites:**
- Have testnet ETH in your wallet
- Get testnet ETH from Linea Goerli faucet: https://faucet.goerli.linea.build/

```bash
cd ../../smartcontracts

# Compile contracts
npm run compile

# Deploy to Linea Testnet
npm run deploy:testnet

# Save the output - you'll see addresses like:
# ValidatorManager deployed to: 0x1234...
# CulturalToken deployed to: 0x5678...
# UjuziRegistry deployed to: 0x9abc...
```

**IMPORTANT:** Copy the `UjuziRegistry` contract address and update:
- `services/backend/.env.local` → CONTRACT_ADDRESS
- `frontend/.env.local` → NEXT_PUBLIC_CONTRACT_ADDRESS

---

## Step 10: Start All Services (5 minutes)

### Terminal 1 - Backend API

```bash
cd services/backend
npm run dev
```

Expected output:
```
✅ Database connected successfully
✅ Redis connected successfully
🚀 AfriVerse API server running on http://0.0.0.0:4000
❤️  Health check at http://0.0.0.0:4000/health
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000
```

### Terminal 3 - AgentVerse (Optional for full demo)

```bash
cd services/agentverse
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run_agents.py
```

Expected output:
```
Starting AfriVerse Agent Bureau...
 - Ingest Agent: agent1q...
 - Symbolizer Agent: agent1q...
 - Query Agent: agent1q...
Agents are running...
```

---

## Step 11: Test the System (10 minutes)

### Test 1: Health Check

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "success": true,
  "message": "AfriVerse API is running",
  "timestamp": "2025-10-21T..."
}
```

### Test 2: Frontend Access

Open browser: **http://localhost:3000**

You should see:
- AfriVerse landing page with mission statement
- "Submit Knowledge" and "Explore" buttons
- Working navigation

### Test 3: Submit a Test Entry

1. Click "Submit Knowledge"
2. Select entry type (e.g., "Story")
3. Either:
   - Upload a small audio file, OR
   - Type a short cultural story/proverb
4. Fill metadata (language, community)
5. Accept consent checkbox
6. Click "Submit"

Expected behavior:
- File uploads to IPFS (check backend logs for CID)
- Entry created in database
- Redirect to entry detail page

### Test 4: Check Database

```bash
cd services/backend
npm run prisma:studio
```

Navigate to "Entry" model - you should see your submitted entry with:
- CID
- Status: "pending"
- Transcript: null (will be filled by agents)
- Atoms: null (will be filled after symbolization)

### Test 5: Blockchain Verification (Optional)

If you submitted with wallet signature:
- Go to https://goerli.lineascan.build
- Search for your contract address
- You should see the `EntrySubmitted` event

---

## Common Issues & Solutions

### Issue: `npm install` fails with peer dependency errors

**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: Prisma client generation fails

**Solution:**
```bash
cd services/backend
npx prisma generate --force
```

### Issue: Docker services won't start

**Solution:**
```bash
# Stop all containers
docker compose down -v

# Remove volumes and restart
docker compose up -d postgres redis --force-recreate
```

### Issue: Backend can't connect to database

**Solution:**
1. Verify postgres is running: `docker compose ps`
2. Check DATABASE_URL in `.env.local` matches docker-compose.yml
3. Default: `postgresql://afri:afri_pass@localhost:5432/afriverse`

### Issue: Frontend can't reach backend API

**Solution:**
1. Verify backend is running on port 4000
2. Check NEXT_PUBLIC_API_URL in frontend/.env.local
3. Should be: `http://localhost:4000/api`

### Issue: IPFS upload fails

**Solution:**
1. Verify PINATA_JWT is set correctly in backend/.env.local
2. Test Pinata access: https://app.pinata.cloud/
3. Ensure JWT token has upload permissions

### Issue: Smart contract deployment fails

**Solution:**
1. Verify you have testnet ETH: https://faucet.goerli.linea.build/
2. Check PRIVATE_KEY in smartcontracts/.env (no 0x prefix)
3. Ensure RPC URL is correct: `https://rpc.goerli.linea.build`

---

## API Keys Required

Before full functionality, obtain these API keys:

1. **Pinata (IPFS)**
   - Sign up: https://pinata.cloud
   - Create API key with admin access
   - Copy JWT token

2. **OpenAI**
   - Sign up: https://platform.openai.com
   - Create API key
   - Note: Requires paid account for Whisper API

3. **HuggingFace**
   - Sign up: https://huggingface.co
   - Create access token
   - Free tier available

4. **Web3.Storage (Optional)**
   - Sign up: https://web3.storage
   - Create API token
   - Free tier: 5GB storage

5. **Linea Testnet ETH**
   - Faucet: https://faucet.goerli.linea.build/
   - Free testnet tokens

---

## Next Steps

After successful setup:

1. **Seed Sample Data**
   ```bash
   cd services/backend
   npm run seed
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Build for Production**
   ```bash
   # Backend
   cd services/backend
   npm run build

   # Frontend
   cd ../../frontend
   npm run build
   ```

4. **Create Demo Video**
   - Record voice submission
   - Show IPFS upload
   - Display reasoning trace
   - Demonstrate validation
   - Show query functionality

5. **Prepare Pitch Deck**
   - Use docs/pitch_deck.md as template
   - Include architecture diagram
   - Show demo screenshots
   - Highlight cultural impact

---

## Support

For hackathon-specific questions:
- **WhatsApp Community:** https://chat.whatsapp.com/Le91NfrRsJT1Dk9fgttoV1
- **GitHub Issues:** https://github.com/Edwin420s/AfriVerse/issues
- **Email:** eduedwyn5@gmail.com

For technical documentation:
- **MeTTa:** https://metta-lang.dev/
- **Agentverse:** https://docs.agentverse.ai/home
- **ASI Alliance:** https://docs.asi1.ai/
- **Linea:** https://docs.linea.build/

---

## Estimated Setup Time

- **Minimal (local dev):** 1 hour
- **Full setup with deployment:** 3-4 hours
- **Production-ready:** 1-2 days

---

**Good luck with BGI25 Hackathon! 🚀**

*AfriVerse - Where Ancestral Knowledge Meets Artificial Intelligence*
