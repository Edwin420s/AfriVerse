# AfriVerse

Where Ancestral Knowledge Meets Artificial Intelligence

---

## Monorepo Overview

AfriVerse is a decentralized platform for preserving African indigenous knowledge using a blend of symbolic AI (MeTTa), LLMs, and on-chain provenance. This repository contains multiple services:

- `frontend/` – Next.js 14 app for submission, exploration, and validation.
- `services/backend/` – Node/Express API with Prisma, Redis, IPFS (Pinata), and blockchain integration.
- `services/agentverse/` – Python uAgents orchestrating ingestion, transcription, symbolization, validation, and queries.
- `services/metta-integration/` – MeTTa client and example atoms for symbolic reasoning.
- `services/docker-compose.yml` – Local development stack.

High-level flow:

1. Submit audio/text via `frontend/` to `backend/submit` which uploads to IPFS and enqueues processing.
2. `agentverse/` agents transcribe, symbolize to MeTTa atoms, validate, and update the backend.
3. Knowledge can be queried and visualized; validated entries can be anchored on-chain.

---

## Quickstart

1. Clone and install

```bash
git clone <this-repo>
cd AfriVerse
```

2. Start services with Docker (recommended)

```bash
cd services
docker compose up -d
```

This typically starts: Postgres, Redis, backend API (if configured), and supporting infra. Adjust as needed.

3. Run backend locally (if not via Docker)

```bash
cd services/backend
npm install
npm run dev
```

4. Run agents

```bash
cd services/agentverse
pip install -r requirements.txt
python main.py  # or run individual agents as per your process
```

5. Run frontend

```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

---

## Environment Variables

Create local env files as needed. Examples:

Backend (`services/backend/.env.local`):

```env
PORT=4000
WEB3_PROVIDER=https://linea-sepolia.rpc
PRIVATE_KEY=...
CONTRACT_ADDRESS=0x...
PINATA_JWT=...
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/afriverse
METTA_API_URL=http://localhost:8080
OPENAI_API_KEY=...
HUGGINGFACE_TOKEN=...
```

Frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=...
```

Agents (`services/agentverse/.env`):

```env
BACKEND_URL=http://localhost:4000
OPENAI_API_KEY=...
HUGGINGFACE_TOKEN=...
```

---

## API Endpoints (key)

Aligned endpoints used by agents and frontend:

- Submissions (`services/backend/src/routes/submit.js`)
  - `POST /api/submit` – create entry (multipart file upload)
  - `GET /api/submit/status/:entryId` – submission status
  - `PATCH /api/submit/:entryId/transcript` – update transcript
  - `PATCH /api/submit/:entryId/atoms` – update atoms
  - `POST /api/submit/symbolize` – symbolize transcript to MeTTa atoms
  - `POST /api/submit/transcribe` – transcribe uploaded audio

- Entries (`services/backend/src/routes/entries.js`)
  - `GET /api/entries/:id` – get entry
  - `GET /api/entries` – list entries
  - `GET /api/entries/search/all` – search
  - `POST /api/entries/query` – knowledge query

- Validate (`services/backend/src/routes/validate.js`)
  - `GET /api/validate/pending` – pending validations
  - `POST /api/validate/:entryId` – submit validation

- Health/Metrics/Community – see respective files in `services/backend/src/routes/`.

---

## Services Overview

- `BlockchainService` – ethers.js client for anchoring/validation events.
- `IPFSService` – Pinata integration for upload/fetch/unpin.
- `TranscriptionService` – OpenAI Whisper with HuggingFace fallback.
- `SymbolizerService` – LLM prompt to extract MeTTa atoms (fallback heuristics).
- `MeTTaService` – MeTTa runtime client with in-memory fallback.
- `CacheService` – Redis helpers.
- `CommunityService`, `MetricsService`, `HealthService` – domain/services utilities.

Agents (`services/agentverse/agents/`):

- `ingest_agent.py` – downloads from IPFS, transcribes, updates backend.
- `transcribe_agent.py` – speech-to-text (OpenAI/HF) and backend update.
- `symbolizer_agent.py` – converts transcript to atoms, validates format.
- `validator_agent.py` – cultural sensitivity + consistency checks.
- `query_agent.py` – forwards queries to backend and returns structured answers.

MeTTa Integration (`services/metta-integration/`):

- `metta_client.py`, `example_atoms.met`, `README.md` for local reasoning tests.

---

## Dev with Docker

Use `services/docker-compose.yml` for local Postgres/Redis, optionally the backend. Example:

```bash
cd services
docker compose up -d
```

Update `.env` to point to these services (e.g., `DATABASE_URL`, `REDIS_URL`).

---

## Contributing

1. Fork and create a feature branch.
2. Keep services documented (JSDoc/docstrings) and aligned with shared endpoints.
3. Add tests where feasible (service unit tests, mock integrations).
4. Open a PR with a clear description and screenshots for UI changes.

## Frontend Overview

AfriVerse is a decentralized platform for preserving African indigenous knowledge using AGI (Artificial General Intelligence). This frontend application provides an intuitive interface for contributors, validators, and explorers to interact with the cultural knowledge graph.

## Features

- 🎤 **Voice-First Submission**: Record cultural knowledge directly in native languages
- 🧠 **AI-Powered Processing**: View how AGI structures and understands cultural content
- 🛡️ **Ethical Consent**: Comprehensive consent flows respecting cultural rights
- 🔍 **Knowledge Exploration**: Interactive graph visualization of cultural connections
- 👥 **Community Validation**: Crowdsourced validation ensuring cultural accuracy
- 🌐 **Multilingual Support**: Support for multiple African languages

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Web3 Integration**: ethers.js (for wallet connectivity)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/afriverse/frontend.git
cd afriverse-frontend

```
Install dependencies:
```
npm install
```

Run the development server:

```
npm run dev
```
Open http://localhost:3000 in your browser.

Project Structure
```
...
frontend/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── middleware.js
├── .env.local.example
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── error.js
│   │   ├── not-found.js
│   │   ├── submit/
│   │   │   └── page.js
│   │   ├── explore/
│   │   │   └── page.js
│   │   ├── entry/
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   ├── validator/
│   │   │   └── page.js
│   │   └── profile/
│   │       └── page.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SubmitWizard.jsx
│   │   ├── VoiceRecorder.jsx
│   │   ├── NodeGraph.jsx
│   │   ├── ReasoningTrace.jsx
│   │   ├── ConsentModal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Web3Provider.jsx
│   │   └── WalletConnect.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useAudioRecorder.js
│   ├── lib/
│   │   └── api.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── constants.js
│   └── styles/
│       └── globals.css
└── README.md
```
## Key Components
### SubmitWizard
Multi-step form for contributing cultural knowledge with:

Content type selection

Voice recording and file upload

Metadata collection

Consent and license agreement

Submission review

## VoiceRecorder
Audio recording component with:

Real-time recording visualization

Playback and deletion controls

Mobile-friendly interface

## NodeGraph
Interactive knowledge graph visualization showing:

Cultural entities and relationships

Symbolic AI reasoning connections

Community validation status

## ReasoningTrace
Displays AI processing results with:

Natural language explanations

Technical symbolic representations

Cultural context preservation

## Environment Variables

Create a .env.local file: 
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

