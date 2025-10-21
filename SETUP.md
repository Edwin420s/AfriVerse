# Getting Started with AfriVerse

**AfriVerse** is a decentralized platform for preserving indigenous knowledge using AGI, blockchain, and IPFS.

---

## What You'll Need

- Node.js 18+ and npm
- PostgreSQL database
- MetaMask wallet
- (Optional) Pinata account for IPFS storage

---

## Quick Setup

### 1. Install Dependencies

```bash
# Smart contracts
cd smartcontracts
npm install

# Backend
cd ../services/backend
npm install

# Frontend
cd ../../frontend
npm install
```

### 2. Configure Environment

**Smart Contracts** (`smartcontracts/.env`):
```env
PRIVATE_KEY=your_wallet_private_key
LINEA_TESTNET_RPC=https://rpc.goerli.linea.build
```

**Backend** (`services/backend/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/afriverse"
PINATA_JWT=your_pinata_jwt_token
CONTRACT_ADDRESS=deployed_contract_address
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WEB3_PROVIDER=https://rpc.goerli.linea.build
NEXT_PUBLIC_CHAIN_ID=59140
```

### 3. Deploy Smart Contracts

```bash
cd smartcontracts
npm run compile
npm run deploy:testnet
```

Save the contract addresses from the output.

### 4. Start Services

```bash
# Terminal 1: Backend
cd services/backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Access the app at **http://localhost:3000**

---

## How It Works

1. **Submit Knowledge** - Upload cultural stories, traditions, or practices (text/audio/video)
2. **AI Processing** - Agents transcribe audio and convert to symbolic MeTTa format
3. **Community Validation** - Local validators verify cultural accuracy
4. **Blockchain Storage** - Immutable record stored on Linea testnet with IPFS
5. **Query & Reason** - AGI can reason about cultural knowledge, not just search

---

## Project Structure

```
AfriVerse/
├── frontend/          Next.js app
├── services/
│   ├── backend/      Express API
│   └── agentverse/   Python AI agents
├── smartcontracts/   Solidity contracts
└── docs/            Documentation
```

---

## Troubleshooting

**"Cannot connect to database"**  
→ Ensure PostgreSQL is running and DATABASE_URL is correct

**"Transaction failed"**  
→ Check MetaMask is on Linea Testnet (Chain ID: 59140)

**"Module not found"**  
→ Run `npm install` in the relevant directory

---

## Resources

- **Documentation:** See README.md for full details
- **API Reference:** `docs/API_DOCUMENTATION.md`
- **Support:** edwin420@outlook.com

---

## Technologies Used

- **Frontend:** Next.js 14, TailwindCSS
- **Backend:** Node.js, Express, PostgreSQL, Prisma
- **Blockchain:** Solidity, Hardhat, Linea zkEVM
- **AI:** MeTTa (symbolic AI), OpenAI Whisper
- **Storage:** IPFS via Pinata
- **Agents:** Python, Fetch.AI uAgents
