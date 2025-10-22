# 🌍 AfriVerse: Preserving Wisdom Through AGI

### **Where Ancestral Knowledge Meets Artificial General Intelligence**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.17-orange.svg)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000.svg)](https://nextjs.org/)

---

## 🏆 BGI25 Hackathon Submission

**Event:** BGI25 Hackathon - "AGI Without Borders"  
**Track:** AGI + Cultural Memory — Preserve and Translate Indigenous Knowledge using Symbolic AI  
**Dates:** October 14-25, 2025  
**Developer:** Edwin Mwiti ([@Edwin420s](https://github.com/Edwin420s))  
**Institution:** Kirinyaga University, Kenya 🇰🇪  
**Email:** eduedwyn5@gmail.com  
**Demo Video:** 🎥 [Watch on YouTube](https://www.youtube.com/watch?v=hDPMGjdSVfM)

> **Hackathon Mission:** Build real-world, ethically rooted, AGI-aligned projects using decentralized tools, rooted in cultural intelligence, local needs, and a global future.

---

## 📋 Executive Summary

**AfriVerse** is a decentralized AGI-powered platform that preserves, translates, and makes accessible African indigenous knowledge using symbolic AI (MeTTa), autonomous agents (Agentverse), blockchain provenance (Linea zkEVM), and decentralized storage (IPFS).

### The Crisis
- **43% of world languages are endangered** (UNESCO)
- **Cultural knowledge holders dying** without digital preservation
- **AI systems trained only on Western datasets**, ignoring non-Western wisdom
- **No mechanism for communities to own** their cultural data

### Our Solution
A **voice-first, decentralized knowledge vault** where elders and cultural practitioners can:
- 🎙️ **Record knowledge** in native languages (no typing required)
- 🧠 **Convert to symbolic AI format** (MeTTa atoms for AGI reasoning)
- ⛓️ **Prove ownership** through blockchain provenance
- 🤝 **Community validation** by cultural experts
- 🌐 **Query with natural language** and get explainable AI reasoning

### Impact
AfriVerse bridges **ancestral wisdom** with **future AGI systems**, ensuring African cultures are represented, preserved, and accessible for generations to come.

---

## 📖 Table of Contents

### 🎯 Overview
- [Executive Summary](#-executive-summary)
- [What is AfriVerse?](#-what-is-afriverse)
- [The Problem We're Solving](#-the-problem-were-solving)
- [Our Solution](#-our-solution)
- [Why It Matters](#-why-it-matters)

### 🔧 Technical Details
- [How It Works (Architecture)](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Smart Contracts](#-smart-contracts)
- [AI & Agent System](#-ai--agent-system)

### 🚀 Getting Started
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)

### 📚 Documentation
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Frontend Features](#-frontend-features)
- [Backend Services](#-backend-services)
- [MeTTa Integration](#-metta-integration)

### 🤝 Community
- [Contributing](#-contributing)
- [Hackathon Details](#-hackathon-details)
- [Team & Contact](#-team--contact)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 What is AfriVerse?

### Vision Statement
**"To create a living, breathing digital archive of African indigenous knowledge that AGI systems can understand, reason with, and learn from—while ensuring communities maintain ownership and control."**

AfriVerse is a **decentralized cultural preservation platform** that addresses the global crisis of indigenous knowledge loss. We combine:

- **🧠 Symbolic AI (MeTTa)** - AI that reasons with cultural knowledge, not just searches it
- **⛓️ Blockchain (Linea)** - Immutable attribution and provenance for cultural contributions
- **📁 Decentralized Storage (IPFS)** - Community-owned, censorship-resistant storage
- **🤖 Autonomous Agents** - Automated processing and validation workflows
- **👥 Community Governance** - Cultural experts validate knowledge accuracy

---

## 🚨 The Problem We're Solving

### 1. Cultural Knowledge Extinction
- **2,500+ African languages** at risk of disappearing
- **Oral traditions** dying with elders who are not digitally connected
- **No systematic preservation** of medicinal plant knowledge, proverbs, rituals
- **Colonial disruption** has already erased countless cultural practices

### 2. AI Colonialism & Bias
- **Western-centric training data** dominates AI models
- **African languages underrepresented** in NLP datasets
- **Cultural context ignored** by current AGI systems
- **No African participation** in shaping AGI development

### 3. Data Exploitation
- **Big Tech extracts** cultural data without permission
- **No attribution** or compensation for communities
- **Centralized platforms** control access and monetization
- **Communities powerless** over their own knowledge

### 4. Lack of Structured Cultural Reasoning
- Traditional databases can only **store and search** text
- No ability for AI to **reason symbolically** about cultural relationships
- **Lost connections** between plants, practices, beliefs, and languages
- Cannot answer queries like: *"What Kikuyu practices involve aloe vera for healing burns?"*

---

## 💡 Our Solution

### A Decentralized Cultural Memory System Powered by AGI

AfriVerse combines four breakthrough technologies:

#### 1. 🎙️ Voice-First Capture (Accessibility)
- **No typing required** — elders record in their native language
- **Audio/video upload** or direct voice recording
- **AI transcription** (OpenAI Whisper, HuggingFace models)
- **Works offline** (mobile app for remote areas — future roadmap)

#### 2. 🧠 Symbolic AI (MeTTa) — AGI-Ready Knowledge
- Convert transcripts to **MeTTa atoms** (symbolic AI format)
- Example: `(plant "aloe_vera") (treats "aloe_vera" "burn") (found_in "aloe_vera" "kenya")`
- Enables **logical reasoning**, not just keyword search
- AI can **infer new relationships** and answer complex queries
- **Explainable reasoning traces** show how AI reached conclusions

#### 3. ⛓️ Blockchain Provenance (Ownership & Trust)
- **Immutable attribution** on Linea zkEVM (Ethereum Layer 2)
- **CID (IPFS hash)** stored on-chain for content verification
- **License enforcement** (Community Only, CC-BY-NC, Research, Open Access)
- **Reputation tokens** (non-transferable ERC20) reward contributors
- **~$0.05 per entry** (affordable at scale)

#### 4. 🤖 Autonomous Agent Validation (Quality Control)
- **Fetch.AI uAgents** coordinate processing pipeline:
  - **Ingest Agent** — handles submissions
  - **Transcribe Agent** — audio → text
  - **Symbolizer Agent** — text → MeTTa atoms
  - **Validator Agent** — community approval workflow
  - **Query Agent** — natural language Q&A with reasoning

### Result: A Living Knowledge Graph
- **Searchable, queryable, and reasoning-enabled** cultural database
- **Community-owned and validated** by local experts
- **AGI-compatible** for future AI training and research
- **Transparent and explainable** — see how AI uses the knowledge

---

---

## 🌟 Why AfriVerse Matters

### For African Communities 🏘️

✅ **Cultural Sovereignty**  
- Communities **own their data** (blockchain provenance)
- **Choose access levels** (Community Only, Research, Public)
- **Cannot be censored** or deleted by centralized platforms

✅ **Economic Recognition**  
- **Reputation tokens** earned for contributions
- Future: **Tokenized cultural IP** for sustainable funding
- **Direct attribution** — every use links back to source

✅ **Intergenerational Bridge**  
- **Youth can access elder wisdom** in digital format
- **Oral traditions preserved** beyond individual lifetimes
- **Languages revitalized** through documentation

✅ **Cultural Accuracy**  
- **Community validators** ensure correctness
- **No misrepresentation** by external parties
- **Context preserved** alongside knowledge

---

### For AGI Development 🤖

✅ **Diverse Training Data**  
- **Non-Western knowledge systems** included in AGI training
- **Reduce cultural bias** in AI models
- **Multilingual reasoning** (Swahili, Yoruba, Kikuyu, etc.)

✅ **Symbolic AI Foundation**  
- **MeTTa atoms enable reasoning**, not just pattern matching
- AGI can **infer relationships** (`if plant treats burns → has medicinal use`)
- **Explainable AI** — trace how conclusions were reached

✅ **Ethical AI Benchmark**  
- Model for **consent-based data collection**
- **Community governance** of AI training data
- **Transparent provenance** for every data point

---

### For Researchers & Educators 📚

✅ **Structured Cultural Database**  
- **Query like SQL**: "Find all medicinal plants used by Kikuyu for burns"
- **Graph relationships**: See connections between plants, practices, and beliefs
- **Temporal data**: Track how knowledge evolved over time

✅ **Verified Sources**  
- **Blockchain provenance** proves authenticity
- **Validation scores** show community approval
- **IPFS storage** ensures content integrity

✅ **Multilingual Access**  
- **Original language preservation** alongside translations
- **Cultural context maintained** in metadata
- **No loss of meaning** through over-simplification

✅ **Research Compliance**  
- **Clear licensing** (Community, Research, Open Access)
- **Ethical data use** with contributor consent
- **Citation-ready** with immutable references

---

### For the Global AGI Ecosystem 🌐

✅ **Aligns with SingularityNET's Vision**  
- **Decentralized AI** — no single entity controls the knowledge
- **Beneficial AGI** — ensures African voices shape future AI
- **Open ecosystem** — data available for ethical research

✅ **Supports UN Sustainable Development Goals**  
- **SDG 4 (Education)** — preserve and share cultural knowledge
- **SDG 10 (Reduced Inequalities)** — include Global South in AI development
- **SDG 16 (Peace & Justice)** — protect indigenous rights

✅ **Sets Precedent for Cultural Data Governance**  
- **Model replicable** for other indigenous communities worldwide
- **Standards for consent** in cultural data collection
- **Blueprint for community-owned AI datasets**

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
- **ASI:Cloud** - AI inference ($20 hackathon credits) 🎟️
- **OpenAI Whisper** - Speech-to-text (fallback)
- **Pinata** - IPFS pinning service

### Blockchain
- **Linea zkEVM** - Ethereum Layer 2 (low fees, high speed)
- **Solidity 0.8.17** - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security-audited contract libraries

### AI & Agents (BGI25 Hackathon Stack)
- **Hyperon MeTTa** - Real symbolic AI runtime for knowledge representation
- **Fetch.AI uAgents** - Autonomous agent framework (3 agents + Bureau)
- **ASI Alliance Tools** - Decentralized AI infrastructure
- **HuggingFace** - Multilingual NLP models (fallback)

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
**Email:** eduedwyn5@gmail.com

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
- **Demo Video:** 🎥 [Watch on YouTube](https://www.youtube.com/watch?v=hDPMGjdSVfM)
- **Setup Guide:** [SETUP.md](./SETUP.md)
- **API Docs:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

**Hackathon:**
- **BGI25 Website:** https://bgi25.com/
- **WhatsApp Community:** https://chat.whatsapp.com/Le91NfrRsJT1Dk9fgttoV1

**Support:**
- Email: eduedwyn5@gmail.com
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
