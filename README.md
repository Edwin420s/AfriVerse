# AfriVerse 🌍🤖

**Where Ancestral Knowledge Meets Artificial Intelligence**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.17-orange.svg)](https://soliditylang.org/)

> **A decentralized platform for preserving indigenous knowledge using AI, blockchain, and community governance.**

AfriVerse uses symbolic AI (MeTTa), blockchain (Linea zkEVM), and IPFS to help communities preserve their cultural heritage in a way that AI systems can understand and reason with—not just store.

---

## 📖 Table of Contents

- [What is AfriVerse?](#-what-is-afriverse)
- [Why It Matters](#-why-it-matters)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Smart Contracts](#-smart-contracts)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 What is AfriVerse?

AfriVerse is a **decentralized cultural preservation platform** that addresses the global crisis of indigenous knowledge loss. We combine:

- **🧠 Symbolic AI (MeTTa)** - AI that reasons with cultural knowledge, not just searches it
- **⛓️ Blockchain (Linea)** - Immutable attribution and provenance for cultural contributions
- **📁 Decentralized Storage (IPFS)** - Community-owned, censorship-resistant storage
- **🤖 Autonomous Agents** - Automated processing and validation workflows
- **👥 Community Governance** - Cultural experts validate knowledge accuracy

### The Problem

1. **Cultural Extinction** - UNESCO reports 43% of world languages are endangered
2. **AI Bias** - Current AGI systems ignore non-Western cultural wisdom
3. **Data Colonization** - Big tech monopolizes training data without community benefit

### Our Solution

A voice-first platform where elders and cultural practitioners can:
- Record knowledge in their native language (no typing required)
- Maintain ownership through blockchain provenance
- Earn reputation tokens for contributions
- Ensure cultural accuracy through community validation

---

## 🌟 Why It Matters

### For Communities

- **Preserve Cultural Heritage** - Before it's lost forever
- **Maintain Ownership** - Blockchain proves who contributed what
- **Earn Recognition** - Reputation system rewards cultural experts
- **Control Access** - Choose licenses (Community Only, Research, Open Access)

### For AI Development

- **Reduce Bias** - Train on diverse, non-Western knowledge
- **Enable Reasoning** - MeTTa symbolic AI enables logical inference, not just pattern matching
- **Ethical Data** - Contributors consent and are recognized
- **Explainability** - See how AI arrives at answers about cultural knowledge

### For Researchers

- **Structured Knowledge** - Query cultural wisdom like a database
- **Provenance** - Know the source and validation status
- **Multilingual** - Access knowledge in original languages
- **Reasoning Traces** - Understand AI's logical steps

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  1. SUBMIT                                                  │
│     Elder records a story about medicinal plants (Swahili)  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. UPLOAD TO IPFS                                          │
│     Audio stored on decentralized network (content hash)    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. AI PROCESSING (Agents)                                  │
│     → Transcribe: Audio → Text (OpenAI Whisper)            │
│     → Symbolize: Text → MeTTa Atoms (Symbolic AI)          │
│        Example: (treats burns (plant "aloe-vera"))          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. COMMUNITY VALIDATION                                    │
│     Local validators review for cultural accuracy           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. BLOCKCHAIN ANCHORING                                    │
│     Validated entry recorded on Linea zkEVM                 │
│     Contributor earns reputation tokens                     │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  6. QUERY & REASONING                                       │
│     Q: "What treats burns in Kenya?"                        │
│     A: "Aloe vera - used by Kikuyu for burn treatment"      │
│     [Shows reasoning trace and cultural context]            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🎙️ **Voice-First Submission**
- Record directly in your native language
- No typing or technical skills required
- Audio, video, or text supported

### 🧠 **Symbolic AI Integration**
- MeTTa atoms enable AI reasoning (not just search)
- Example: `(plant aloe-vera) (treats burns) (community Kikuyu)`
- AI can infer new relationships and answer complex questions

### ⛓️ **Blockchain Provenance**
- Immutable record of who contributed what
- Timestamp and license information
- Deployed on Linea zkEVM (low gas fees: ~$0.05 per entry)

### 👥 **Community Validation**
- Cultural experts review submissions
- Multi-signature style validation
- Reputation tracking for validators

### 📊 **Knowledge Graph**
- Visualize cultural connections
- See reasoning traces
- Explore related knowledge

### 🌐 **Multilingual Support**
- Swahili, English, Yoruba, Igbo, Hausa
- More languages coming soon

---

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with server components
- **TailwindCSS** - Modern, responsive styling
- **Framer Motion** - Smooth animations
- **ethers.js** - Blockchain wallet integration

### Backend
- **Node.js + Express** - RESTful API server
- **PostgreSQL + Prisma** - Database and ORM
- **Redis + BullMQ** - Caching and job queues
- **OpenAI Whisper** - Speech-to-text transcription
- **Pinata** - IPFS pinning service

### Blockchain
- **Linea zkEVM** - Ethereum Layer 2 (low fees, high speed)
- **Solidity 0.8.17** - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security-audited contract libraries

### AI & Agents
- **MeTTa** - Symbolic AI for knowledge representation
- **Fetch.AI uAgents** - Autonomous agent framework (Python)
- **HuggingFace** - Fallback AI models

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **PostgreSQL** database
- **MetaMask** wallet
- **(Optional)** API keys for Pinata (IPFS) and OpenAI

### Quick Setup

**See [SETUP.md](./SETUP.md) for detailed installation instructions.**

**Quick version:**

```bash
# 1. Clone and install
git clone https://github.com/Edwin420s/AfriVerse.git
cd AfriVerse

# 2. Backend
cd services/backend
npm install
cp .env.example .env
# Edit .env with your database URL and API keys

# 3. Frontend
cd ../../frontend
npm install
cp .env.local.example .env.local

# 4. Smart Contracts
cd ../smartcontracts
npm install
cp .env.example .env
# Edit .env with your MetaMask private key

# 5. Deploy contracts
npm run compile
npm run deploy:testnet
# Save the contract addresses

# 6. Start services
# Terminal 1: Backend
cd services/backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
AfriVerse/
├── frontend/              # Next.js web application
│   ├── src/app/          # Pages: submit, explore, validator
│   ├── src/components/   # React components
│   └── src/lib/          # API client, utilities
│
├── services/
│   ├── backend/          # Express API server
│   │   ├── src/routes/   # API endpoints
│   │   ├── src/services/ # IPFS, AI, blockchain services
│   │   └── prisma/       # Database schema
│   │
│   └── agentverse/       # Python AI agents
│       └── agents/       # Transcribe, symbolize, validate
│
├── smartcontracts/       # Solidity blockchain contracts
│   ├── contracts/        # UjuziRegistry, CulturalToken
│   └── scripts/          # Deployment scripts
│
├── docs/                 # Documentation
│   └── API_DOCUMENTATION.md
│
├── README.md             # This file
└── SETUP.md             # Setup guide
```

---

## 🔌 API Overview

**Base URL:** `http://localhost:4000/api`

### Main Endpoints

#### Submit Cultural Knowledge
```http
POST /api/submit
Content-Type: multipart/form-data

file: <audio/video/text>
title: "Traditional Healing Practice"
language: "sw"
community: "Kikuyu"
license: "CC-BY-NC-4.0"
```

#### Get Entry
```http
GET /api/entries/:id
```

#### Query Knowledge (AI Reasoning)
```http
POST /api/entries/query
Content-Type: application/json

{
  "query": "What plants treat burns in Kenya?",
  "context": { "language": "sw" }
}
```

#### Validate Entry (For Validators)
```http
POST /api/validate/:entryId
Content-Type: application/json

{
  "decision": "approved",
  "notes": "Culturally accurate"
}
```

**Rate Limits:**
- General API: 100 requests / 15 min
- Submit endpoint: 10 requests / hour

**See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for full API reference.**

---

## ⛓️ Smart Contracts

**Network:** Linea Goerli Testnet  
**Explorer:** https://goerli.lineascan.build/

### UjuziRegistry (Main Contract)

Manages cultural knowledge entries, validation, and provenance.

**Key Functions:**

```solidity
// Submit new cultural knowledge
function submitEntry(
    bytes32 cid,           // IPFS content hash
    LicenseType license,   // Usage license
    string language,       // e.g., "sw" for Swahili
    string community,      // e.g., "Kikuyu"
    bytes32[] atomHashes   // MeTTa atom hashes
) external returns (uint256 entryId)

// Validate an entry (validators only)
function validateEntry(
    uint256 entryId,
    bool approve,
    string notes
) external onlyValidator

// Get entry details
function getEntry(uint256 entryId) 
    external view returns (CulturalEntry memory)
```

**Features:**
- Multi-signature validation (3 validators required)
- License enforcement (Community Only, CC-BY-NC, Research, Open Access)
- Event logging for off-chain indexing
- Reputation token rewards (CulturalToken minted on validation)

**Gas Cost:** ~$0.05 per entry on Linea L2

### CulturalToken

Non-transferable reputation token (ERC20) earned through contributions and validation.

---

## 🤝 Contributing

We welcome contributors! AfriVerse is built for communities, by communities.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-idea`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-idea`
5. Open a Pull Request

### Development Guidelines

- Write clean, documented code (JSDoc for JavaScript, docstrings for Python)
- Add tests for new features
- Follow existing code style (Prettier + ESLint configured)
- Update documentation as needed

### Areas Where We Need Help

- 🌐 **Language Support** - Add more African languages
- 🎨 **UI/UX** - Improve accessibility and mobile experience
- 🤖 **AI** - Enhance MeTTa symbolization accuracy
- 🧪 **Testing** - Write unit and integration tests
- 📚 **Documentation** - Tutorials, guides, translations
- 🔐 **Security** - Smart contract audits, vulnerability testing

---

## 👥 Team

**Developer:** Edwin Mwiti  
**Institution:** Kirinyaga University (Electronics & Computer Engineering)  
**Location:** Nairobi, Kenya 🇰🇪  
**GitHub:** [@Edwin420s](https://github.com/Edwin420s)  
**Email:** edwin420@outlook.com

### Hackathon Submission

**Event:** BGI25 Hackathon - AGI Without Borders  
**Track:** AGI + Cultural Memory  
**Dates:** October 14-25, 2025

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Open Source Acknowledgments

Built with amazing open-source tools:
- **SingularityNET** - MeTTa and decentralized AI vision
- **Fetch.AI** - Autonomous agent framework
- **Linea** - zkEVM Layer 2 blockchain
- **OpenAI** - Whisper transcription model
- **HuggingFace** - Open AI models
- **Pinata** - IPFS pinning service
- **OpenZeppelin** - Smart contract security standards

---

## 📞 Contact & Links

**Project Links:**
- **Repository:** https://github.com/Edwin420s/AfriVerse
- **Setup Guide:** [SETUP.md](./SETUP.md)
- **API Docs:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

**Hackathon:**
- **BGI25 Website:** https://bgi25.com/
- **WhatsApp Community:** https://chat.whatsapp.com/Le91NfrRsJT1Dk9fgttoV1

**Support:**
- Email: edwin420@outlook.com
- Open an issue on GitHub

---

## 🙏 Acknowledgments

Special thanks to:
- **BGI25 Organizers** - For hosting this incredible hackathon
- **SingularityNET & ASI Alliance** - For the vision of beneficial AGI
- **Local Elders** - For sharing cultural wisdom
- **Open Source Community** - For amazing tools and libraries

---

## 🌟 Support This Project

If AfriVerse resonates with you, please ⭐ **star this repository** and share it with others who care about cultural preservation and ethical AI!

---

<div align="center">

**AfriVerse - Where Ancestral Knowledge Meets Artificial Intelligence** 🌍🤖

*Built with ❤️ in Kenya for the world*

</div>
