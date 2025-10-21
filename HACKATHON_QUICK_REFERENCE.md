# 🚀 AfriVerse - BGI25 Hackathon Quick Reference

**URGENT: Complete these 3 critical tasks before submission!**

---

## ⚠️ CRITICAL TASKS (4 Hours Total)

### 1. Deploy Smart Contracts to Linea Testnet ⏱️ 1 Hour
**Status:** ❌ NOT DONE - **BLOCKING SUBMISSION**

```bash
# Step 1: Get Testnet ETH (5 min)
# Visit: https://faucet.goerli.linea.build/
# Enter your MetaMask address

# Step 2: Configure Environment (5 min)
cd smartcontracts
cp .env.example .env
# Edit .env and add:
# PRIVATE_KEY=your_metamask_private_key
# LINEA_TESTNET_RPC=https://rpc.goerli.linea.build

# Step 3: Deploy (10 min)
npx hardhat run scripts/deploy.js --network lineaTestnet

# Step 4: Copy Contract Addresses
# Save the output addresses!

# Step 5: Verify on LineaScan (optional, 5 min)
npx hardhat verify --network lineaTestnet <CONTRACT_ADDRESS>
```

**After Deployment, Update:**
- [ ] `README.md` - Add contract addresses in Smart Contracts section
- [ ] `frontend/.env.local` - Add `NEXT_PUBLIC_CONTRACT_ADDRESS=<address>`
- [ ] `services/backend/.env.local` - Add contract addresses

---

### 2. Record Demo Video ⏱️ 3 Hours
**Status:** ❌ NOT DONE - **BLOCKING SUBMISSION**

**Quick Recording Plan:**
1. **Setup** (30 min) - Get all services running, prepare test data
2. **Record** (1 hour) - Follow script in `docs/DEMO_SCRIPT.md`
3. **Edit** (30 min) - Add subtitles, music, branding
4. **Upload** (30 min) - YouTube (unlisted), get link

**What to Show (5 minutes):**
- 0:00-0:30 → Problem (cultural loss crisis)
- 0:30-1:00 → Solution (AfriVerse overview)
- 1:00-4:00 → Live Demo:
  - Voice recording submission
  - AI transcription
  - Validator review
  - Blockchain anchoring
  - Knowledge query with reasoning
- 4:00-5:00 → Impact & call to action

**Tools:**
- **Screen Recording:** OBS Studio (free) or Loom
- **Video Editing:** DaVinci Resolve (free)
- **Upload:** YouTube (unlisted)

**After Recording:**
- [ ] Upload to YouTube
- [ ] Add link to `README.md` (Demo Video section)
- [ ] Add link to hackathon submission form

---

### 3. Update README with Deployment Info ⏱️ 30 Min
**Status:** ⚠️ PARTIAL - **IMPORTANT**

**Add These Sections:**

```markdown
## 🚀 Live Demo

**Deployed Application:** [Coming Soon]  
**Demo Video:** [YouTube Link After Recording]  
**Smart Contracts:** Linea Goerli Testnet

### Contract Addresses

- **UjuziRegistry:** `0x...` [View on LineaScan](https://goerli.lineascan.build/address/0x...)
- **CulturalToken:** `0x...` [View on LineaScan](https://goerli.lineascan.build/address/0x...)
- **ValidatorManager:** `0x...` [View on LineaScan](https://goerli.lineascan.build/address/0x...)

### Network Details

- **Network:** Linea Goerli Testnet
- **Chain ID:** 59140
- **RPC URL:** https://rpc.goerli.linea.build
- **Block Explorer:** https://goerli.lineascan.build
- **Faucet:** https://faucet.goerli.linea.build
```

---

## 📋 SUBMISSION CHECKLIST

### Before You Submit ✅

- [ ] **Smart Contracts Deployed** to Linea Testnet
- [ ] **Contract Addresses** added to README
- [ ] **LineaScan URLs** verified and working
- [ ] **Demo Video** recorded and uploaded (2-5 min)
- [ ] **Demo Video Link** added to README
- [ ] **Frontend Deployed** (optional but recommended)
- [ ] **All environment variables** documented
- [ ] **Commit history** clean and meaningful
- [ ] **README.md** comprehensive (✅ Already done!)
- [ ] **Code quality** high (✅ Already done!)

### Submission Form Requirements 📝

**You'll Need:**
- [x] Project Name: **AfriVerse**
- [x] Track: **AGI + Cultural Memory**
- [x] Blockchain: **Linea zkEVM Testnet**
- [x] GitHub Link: `https://github.com/Edwin420s/AfriVerse`
- [ ] Contract Address: **[After deployment]**
- [ ] LineaScan URL: **[After deployment]**
- [ ] Demo Video: **[After recording]**
- [ ] Live Link: **[Optional]**
- [x] Team: **Edwin Karimi**
- [x] Description: See README Overview

---

## ⏰ TIME BREAKDOWN

| Task | Time | When |
|------|------|------|
| Get testnet ETH | 5 min | NOW |
| Deploy contracts | 1 hour | TODAY |
| Record demo | 3 hours | TODAY |
| Update README | 30 min | TODAY |
| **TOTAL** | **4.5 hours** | **TODAY** |

---

## 🎯 YOUR COMPETITIVE ADVANTAGES

**Already Strong:**
- ✅ **Comprehensive Documentation** (30 KB README, 7 guides)
- ✅ **High-Quality Code** (OpenZeppelin, modular, commented)
- ✅ **Functional UI** (25+ components, responsive)
- ✅ **Complete Tech Stack** (7 layers fully integrated)
- ✅ **Original Innovation** (MeTTa + AGI + Cultural Memory)
- ✅ **Professional Presentation** (badges, TOC, architecture diagrams)

**What You Need:**
- ⚠️ **Smart Contract Deployment** (1 hour away)
- ⚠️ **Demo Video** (3 hours away)
- ⚠️ **Live Deployment** (optional, 1 hour away)

---

## 🚨 PRIORITY ORDER

**Do This Exact Order:**

1. ✅ Read `docs/HACKATHON_COMPLIANCE_CHECKLIST.md` (you are here!)
2. ⏰ Get testnet ETH from Linea faucet (5 min)
3. ⏰ Deploy smart contracts (1 hour)
4. ⏰ Test contract interaction locally (30 min)
5. ⏰ Update README with addresses (15 min)
6. ⏰ Start all services for demo (15 min)
7. ⏰ Record demo video (1 hour)
8. ⏰ Edit and upload video (1.5 hours)
9. ⏰ Update README with video link (5 min)
10. ⏰ Final code commit and push (5 min)
11. ⏰ Fill submission form (15 min)
12. ⏰ Submit to BGI25 (5 min)

**Total: 4.5 hours to submission! 🚀**

---

## 🔗 QUICK LINKS

### Documentation (Already Complete!)
- `README.md` - Main overview ✅
- `docs/SETUP_GUIDE.md` - Full setup ✅
- `docs/DEMO_SCRIPT.md` - Demo script ✅
- `docs/API_DOCUMENTATION.md` - API reference ✅
- `docs/HACKATHON_COMPLIANCE_CHECKLIST.md` - Full compliance guide ✅

### Important URLs
- **Linea Faucet:** https://faucet.goerli.linea.build/
- **LineaScan:** https://goerli.lineascan.build/
- **OBS Studio:** https://obsproject.com/
- **YouTube Upload:** https://youtube.com/upload

### Configuration Files
- `smartcontracts/.env` - Add PRIVATE_KEY
- `frontend/.env.local` - Add contract addresses
- `services/backend/.env.local` - Add contract addresses

---

## 💡 PRO TIPS

### For Smart Contract Deployment
- ✅ Use MetaMask to get private key (Account Details → Export Private Key)
- ✅ Never commit `.env` files to GitHub
- ✅ Test deployment on localhost first: `npx hardhat run scripts/deploy.js`
- ✅ Save contract addresses immediately after deployment
- ✅ Gas fees on Linea Testnet are nearly free

### For Demo Video
- ✅ Close all unnecessary browser tabs
- ✅ Use a clean browser profile
- ✅ Prepare test data before recording
- ✅ Do a dry run before final recording
- ✅ Speak clearly and not too fast
- ✅ Show real functionality, not slides
- ✅ Highlight the blockchain interaction
- ✅ End with strong call to action

### For Frontend Deployment (Optional)
```bash
# Vercel (Easiest)
npm i -g vercel
cd frontend
vercel --prod

# Netlify
npm i -g netlify-cli
cd frontend
npm run build
netlify deploy --prod
```

---

## ⚠️ COMMON MISTAKES TO AVOID

### DON'T:
- ❌ Deploy to wrong blockchain (Polygon, Ethereum mainnet)
- ❌ Forget to add testnet ETH before deploying
- ❌ Record demo without testing features first
- ❌ Submit without contract addresses
- ❌ Submit without demo video
- ❌ Use low-quality screen recording
- ❌ Make demo video longer than 5 minutes
- ❌ Hardcode API keys in code

### DO:
- ✅ Deploy to Linea Goerli Testnet specifically
- ✅ Test full user flow before recording
- ✅ Keep demo under 5 minutes
- ✅ Show actual contract interaction
- ✅ Add all required links to README
- ✅ Commit and push all changes
- ✅ Double-check submission form

---

## 📊 CURRENT STATUS

### Compliance Score: 75% → Target: 100%

**Strong (Already Complete):**
- ✅ Documentation (A+, 100%)
- ✅ Code Quality (A+, 95%)
- ✅ UI/UX (A, 90%)
- ✅ GitHub Repo (A+, 100%)

**Needs Work (Critical):**
- ⚠️ Smart Contract Deployment (F, 0%) ← **DO THIS FIRST**
- ⚠️ Demo Video (F, 0%) ← **DO THIS SECOND**
- ⚠️ Live Deployment (F, 0%) ← **OPTIONAL**

**After completing critical tasks: 95% → A Grade! 🏆**

---

## 🎬 DEMO VIDEO SCRIPT (Copy-Paste)

**Act 1: Problem (30 sec)**
> "Over 40% of African languages will disappear by 2100. Current AI systems are trained on Western data, ignoring millennia of African wisdom. Big tech monopolizes cultural knowledge without consent. What if communities could preserve their heritage on their own terms?"

**Act 2: Solution (30 sec)**
> "Meet AfriVerse - a decentralized AGI platform where elders record cultural knowledge, AI converts it to symbolic reasoning atoms, validators ensure accuracy, and blockchain proves ownership. Built on Linea zkEVM, powered by MeTTa symbolic AI, and governed by the community."

**Act 3: Demo (3 min)**
1. "Let me show you how it works..."
2. [Record voice → Upload audio]
3. [AI transcribes → Show transcript]
4. [Convert to MeTTa atoms → Show knowledge graph]
5. [Validator reviews → Approve]
6. [Blockchain anchor → Show MetaMask + LineaScan]
7. [Query knowledge → Show reasoning trace]
8. "And that's how AfriVerse preserves culture with AGI."

**Act 4: Impact (30 sec)**
> "AfriVerse has processed [X] submissions, [Y] validators, and [Z] queries. Join us in building AGI that respects cultural diversity. Visit our GitHub, try the demo, and help preserve African knowledge for future generations."

---

## 📞 HELP & SUPPORT

**Stuck? Check These:**
1. Full compliance guide: `docs/HACKATHON_COMPLIANCE_CHECKLIST.md`
2. Setup instructions: `docs/SETUP_GUIDE.md`
3. Demo script: `docs/DEMO_SCRIPT.md`

**Still Stuck?**
- Email: eduedwyn5@gmail.com
- GitHub: @Edwin420s

---

## 🏆 SUCCESS METRICS

**You'll Know You're Ready When:**
- ✅ Smart contracts deployed to Linea Testnet
- ✅ LineaScan shows your contracts
- ✅ Demo video uploaded to YouTube (2-5 min)
- ✅ README has all deployment links
- ✅ All services tested and working
- ✅ Submission form filled out
- ✅ Confident in your work!

---

<div align="center">

## 🚀 YOU'RE 75% DONE!

**Just 4.5 hours of focused work separates you from a winning submission!**

**Start with: Deploy Smart Contracts (1 hour)**

**Next: Record Demo Video (3 hours)**

**Then: Submit and Win! 🏆**

---

**AfriVerse - Where Ancestral Knowledge Meets Artificial Intelligence**

Built with ❤️ in Kenya • October 2025

</div>
