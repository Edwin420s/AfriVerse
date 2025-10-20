# AfriVerse Frontend

Where Ancestral Knowledge Meets Artificial Intelligence

## Overview

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

