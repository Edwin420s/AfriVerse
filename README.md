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
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── styles/             # Global styles and Tailwind config
└── lib/                # Utility functions and API calls
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

