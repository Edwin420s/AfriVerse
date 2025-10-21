# ⚡ IMMEDIATE ACTION CHECKLIST - BGI Hackathon

**Time Required:** 8-10 hours  
**Deadline:** Before hackathon submission closes  
**Status:** 🔴 CRITICAL - 3 blocking items remain

---

## 🚨 CRITICAL BLOCKERS (MUST COMPLETE)

### 1. ✅ Install Dependencies (IN PROGRESS)

**Smart Contracts:**
```bash
cd smartcontracts
npm install
```
Status: Running...

**Backend:**
```bash
cd services/backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Agents:**
```bash
cd services/agentverse
pip install -r requirements.txt
```

---

### 2. ❌ Setup Environment Variables (30 minutes)

#### **Smart Contracts `.env`**
Location: `smartcontracts/.env`

```bash
cd smartcontracts
copy .env.example .env
```

Then edit `.env` and add:
```env
PRIVATE_KEY=your_metamask_private_key
LINEA_TESTNET_RPC=https://rpc.goerli.linea.build
LINEA_SCAN_API_KEY=your_api_key  # Optional for verification
```

**How to get PRIVATE_KEY:**
1. Open MetaMask
2. Click account → Account details → Export Private Key
3. Enter password
4. Copy private key
5. **⚠️ NEVER commit this to Git!**

**How to get testnet ETH:**
1. Visit https://faucet.goerli.linea.build/
2. Connect wallet
3. Request testnet ETH (free)

#### **Backend `.env`**
Location: `services/backend/.env`

```bash
cd services/backend
copy .env.example .env
```

Edit `.env`:
```env
# Required
PINATA_JWT=your_pinata_jwt  # Get from https://pinata.cloud/
DATABASE_URL="postgresql://afri:afri_pass@localhost:5432/afriverse"

# Optional but recommended
OPENAI_API_KEY=your_openai_key

# Will update after deployment
CONTRACT_ADDRESS=0xToBeUpdatedAfterDeployment
PRIVATE_KEY=same_as_smartcontracts
```

#### **Frontend `.env.local`**
Location: `frontend/.env.local`

```bash
cd frontend
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WEB3_PROVIDER=https://rpc.goerli.linea.build
NEXT_PUBLIC_CHAIN_ID=59140
```

---

### 3. ❌ Deploy Smart Contracts (1-2 hours)

**Step-by-step:**

```bash
cd smartcontracts

# 1. Compile contracts
npm run compile

# 2. Run tests (optional but recommended)
npm test

# 3. Deploy to Linea Testnet
npm run deploy:testnet

# Expected output:
# 🚀 Deploying AfriVerse Smart Contracts...
# ValidatorManager deployed to: 0x...
# CulturalToken deployed to: 0x...
# UjuziRegistry deployed to: 0x...
# ✅ Granted roles
# 🎉 Deployment completed!
```

**After deployment:**
1. Copy the three contract addresses from terminal output
2. Save to notepad/file temporarily
3. Proceed to step 4

---

### 4. ❌ Update Documentation (30 minutes)

#### **Update README.md**

Add this section after "## Features":

```markdown
## 🌐 Live Demo

- **Frontend:** http://localhost:3000 (local) / [Vercel URL if deployed]
- **Smart Contracts (Linea Testnet):**
  - UjuziRegistry: `0xYOUR_CONTRACT_ADDRESS` ([View on LineaScan](https://goerli.lineascan.build/address/0xYOUR_CONTRACT_ADDRESS))
  - CulturalToken: `0xYOUR_TOKEN_ADDRESS`
  - ValidatorManager: `0xYOUR_VALIDATOR_ADDRESS`
- **Demo Video:** [YouTube Link]

## ✅ Verification

All smart contracts are verified on Linea Testnet. Click the LineaScan links above to view source code.
```

#### **Update Backend `.env`**

```bash
cd services/backend
```

Edit `.env` and update:
```env
CONTRACT_ADDRESS=0xYOUR_UJUZI_REGISTRY_ADDRESS  # From deployment output
```

---

### 5. ❌ Record Demo Video (2-4 hours)

**Follow the script:** `docs/DEMO_SCRIPT.md`

**Minimum requirements:**
- **Length:** 3-5 minutes
- **Format:** MP4, 1080p
- **Content:**
  1. Introduction (30s)
  2. Problem statement (30s)
  3. Live demo of features (2-3 min)
  4. Technology overview (30s)
  5. Impact statement (30s)

**Recording options:**
- **OBS Studio** (free, powerful)
- **Loom** (easy, browser-based)
- **Zoom** (record yourself presenting)

**What to show:**
1. Landing page
2. Submit cultural knowledge form
3. Show IPFS upload
4. Show blockchain transaction on LineaScan
5. Show MeTTa symbolic output (if working)

**Upload to:**
- YouTube (unlisted or public)
- Vimeo
- Google Drive (public link)

**After upload:**
- Copy video URL
- Add to README.md
- Add to hackathon submission form

---

## 🎯 OPTIONAL BUT RECOMMENDED

### 6. ⚠️ Deploy Backend + Frontend (3-4 hours)

**Frontend (Vercel):**
```bash
# In frontend directory
npm run build  # Test build locally first

# Then deploy to Vercel:
# 1. Install Vercel CLI: npm i -g vercel
# 2. Run: vercel
# 3. Follow prompts
# 4. Configure environment variables in Vercel dashboard
```

**Backend (Railway/Render):**
1. Create account on Railway.app or Render.com
2. Connect GitHub repo
3. Select `services/backend` as root directory
4. Add environment variables
5. Deploy

**Benefits:**
- Live demo accessible by judges
- Better presentation
- Shows production readiness
- **+15 points in judging**

---

### 7. ⚠️ Integration Testing (1-2 hours)

**Test complete flow:**

```bash
# Terminal 1: Start backend
cd services/backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Test submission
# Go to http://localhost:3000
# Click "Share Knowledge"
# Fill form and submit
# Verify:
# - IPFS upload success
# - Blockchain transaction
# - Data in database
```

**Document results:**
- Create `TEST_RESULTS.md`
- Screenshot successful submission
- Add blockchain transaction link

---

## 📋 FINAL CHECKLIST

Before submission, verify:

```
✅ Dependencies installed
✅ Environment variables configured
✅ Smart contracts deployed
✅ Contract addresses in README
✅ Demo video recorded and uploaded
✅ README updated with all links
✅ GitHub repo is public
✅ All code committed and pushed
✅ .env files NOT committed (in .gitignore)
✅ Hackathon submission form completed

OPTIONAL:
☐ Backend deployed online
☐ Frontend deployed online
☐ Integration tests passed
☐ Known issues documented
```

---

## 🚀 QUICK START SCRIPT

Copy and run this script to setup everything quickly:

```bash
# 1. Install all dependencies
cd d:\Projects\AfriVerse\smartcontracts && npm install
cd ../services/backend && npm install
cd ../../frontend && npm install
cd ../services/agentverse && pip install -r requirements.txt

# 2. Setup environment files
cd d:\Projects\AfriVerse\smartcontracts
copy .env.example .env
echo "⚠️ EDIT smartcontracts/.env and add PRIVATE_KEY"

cd ../services/backend
copy .env.example .env
echo "⚠️ EDIT services/backend/.env and add PINATA_JWT"

# 3. Compile contracts
cd d:\Projects\AfriVerse\smartcontracts
npm run compile

# 4. Deploy (after editing .env files)
npm run deploy:testnet

echo "✅ Setup complete! Now:"
echo "1. Update README with contract addresses"
echo "2. Record demo video"
echo "3. Submit to hackathon"
```

---

## ⏰ TIME ESTIMATES

| Task | Time | Priority |
|------|------|----------|
| Install dependencies | 15 min | 🔴 Critical |
| Setup .env files | 30 min | 🔴 Critical |
| Deploy contracts | 1-2 hrs | 🔴 Critical |
| Update README | 30 min | 🔴 Critical |
| Record demo video | 2-4 hrs | 🔴 Critical |
| Deploy frontend/backend | 3-4 hrs | 🟡 High |
| Integration testing | 1-2 hrs | 🟡 High |
| **TOTAL** | **8-13 hrs** | |

**Minimum to submit:** 5-7 hours (Critical items only)  
**Recommended:** 10-13 hours (Critical + High priority)

---

## 🆘 TROUBLESHOOTING

### "Insufficient funds for gas"
→ Get testnet ETH from https://faucet.goerli.linea.build/

### "Cannot find module 'hardhat'"
→ Run `npm install` in smartcontracts directory

### "IPFS upload failed"
→ Check PINATA_JWT in backend/.env

### "Transaction failed"
→ Check you're on Linea Testnet in MetaMask

### "Video too large to upload"
→ Compress with HandBrake or use Loom

---

## 📞 GET HELP

- **Hardhat docs:** https://hardhat.org/
- **Linea docs:** https://docs.linea.build/
- **Pinata docs:** https://docs.pinata.cloud/
- **Project email:** edwin420@outlook.com

---

**Last Updated:** October 21, 2025  
**Status:** 🔴 3 critical items remaining  
**Next Action:** Setup environment variables and deploy contracts

---

**YOU CAN DO THIS! 💪 Focus on one task at a time. Start with deployment!** 🚀
