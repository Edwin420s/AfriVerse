# Deploy Guide - BGI Hackathon 2025

**Time:** 5-10 hours | **Score:** 85/100 → 95/100 with deployment 🏆

---

## 3 Critical Tasks

### 1. Deploy Smart Contracts (1-2 hrs)

```bash
# Setup environment
cd smartcontracts
copy .env.example .env
# Edit .env: Add PRIVATE_KEY (from MetaMask → Export Private Key)
# Get testnet ETH: https://faucet.goerli.linea.build/

# Deploy
npm install
npm run compile
npm run deploy:testnet

# Save the 3 contract addresses from output
```

Update `services/backend/.env`:
```env
CONTRACT_ADDRESS=0xYourUjuziRegistryAddress
```

### 2. Record Demo Video (2-4 hrs)

**Requirements:** 3-5 min, MP4, YouTube

**Show:**
- Problem (cultural knowledge loss)
- Demo (submit → IPFS → blockchain)  
- Technology (MeTTa AI + blockchain)
- Impact statement

**Script:** See `docs/DEMO_SCRIPT.md`

### 3. Update README (15 min)

Add to README.md line ~31:
```markdown
**📺 Demo Video:** [Watch](YOUR_YOUTUBE_URL)  
**⛓️ Contracts:**
- UjuziRegistry: `0xYourAddress` ([View](https://goerli.lineascan.build/address/0x...))
- CulturalToken: `0xYourAddress`
- ValidatorManager: `0xYourAddress`
```

---

## Testing

```bash
# Terminal 1
cd services/backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Test at http://localhost:3000
```

---

## Troubleshooting

- **Insufficient funds:** Get ETH at https://faucet.goerli.linea.build/
- **Module error:** Run `npm install` in smartcontracts/
- **Transaction failed:** Check MetaMask is on Linea Testnet (Chain ID: 59140)

---

## Pre-Submission Checklist

```
✅ Contracts deployed
✅ Demo video uploaded
✅ README updated
✅ Code pushed to GitHub
✅ .env files NOT committed
```

---

**Resources:**
- Linea Docs: https://docs.linea.build/
- Pinata (IPFS): https://pinata.cloud/
- Help: edwin420@outlook.com
