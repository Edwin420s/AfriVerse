# AfriVerse Frontend 🌍

**Where Ancestral Knowledge Meets Artificial Intelligence**

A decentralized platform for preserving African indigenous wisdom using AGI (Artificial General Intelligence) and blockchain technology. Built for the BGI25 Hackathon: "AGI Without Borders".

![AfriVerse Banner](https://img.shields.io/badge/BGI25-Hackathon-gold?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Components](#key-components)
- [Pages Overview](#pages-overview)
- [Styling Guide](#styling-guide)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- 🎤 **Voice-First Submission** - Record cultural knowledge in native languages
- 🧠 **AI-Powered Processing** - AGI systems understand and structure cultural content
- 🔍 **Knowledge Exploration** - Interactive graph visualization of cultural connections
- 👥 **Community Validation** - Crowdsourced validation ensuring cultural accuracy
- 🌐 **Multilingual Support** - 35+ African languages supported
- 🛡️ **Ethical Consent** - Comprehensive consent flows respecting cultural rights
- 🔐 **Web3 Integration** - Wallet connectivity for decentralized identity
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop

### Advanced Features
- 🎨 **3D Knowledge Graph** - Interactive 3D visualization of knowledge relationships
- 🤖 **AI Chat Assistant** - Conversational interface for knowledge exploration
- 🗺️ **Interactive Map** - Geographic exploration of cultural knowledge
- 📅 **Cultural Timeline** - Historical journey of knowledge preservation
- 🎙️ **Voice Assistant** - Multi-language speech recognition and transcription
- 📊 **Analytics Dashboard** - Real-time insights and statistics
- 🔔 **Real-time Notifications** - Stay updated on validations and contributions

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18.2** - UI library with hooks
- **TypeScript** - Type safety (via JSDoc)

### Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Custom CSS** - Advanced animations and utilities

### Libraries & Tools
- **Lucide React** - Icon library (modern, customizable)
- **Axios** - HTTP client for API requests
- **Web3.js** - Ethereum blockchain integration
- **IPFS** - Decentralized file storage

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
│   ├── assets/
│   │   ├── icons/              # App icons (PWA)
│   │   └── images/             # Images and graphics
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt              # SEO robots file
│   └── sitemap.xml             # SEO sitemap
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   └── route.js        # Health check endpoint
│   │   ├── communities/        # Communities page
│   │   │   └── page.js
│   │   ├── entry/              # Entry detail pages
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   ├── explore/            # Knowledge exploration
│   │   │   └── page.js
│   │   ├── profile/            # User profile
│   │   │   └── page.js
│   │   ├── submit/             # Knowledge submission
│   │   │   └── page.js
│   │   ├── timeline/           # Cultural timeline
│   │   │   └── page.js
│   │   ├── validator/          # Validation dashboard
│   │   │   └── page.js
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Home page
│   │   ├── error.js            # Error boundary
│   │   ├── not-found.js        # 404 page
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── AIChatAssistant.jsx         # AI chat interface
│   │   ├── CommunityValidator.jsx      # Validation component
│   │   ├── ConsentModal.jsx            # Consent dialog
│   │   ├── CulturalTimeline.jsx        # Timeline component
│   │   ├── EntryCard.jsx               # Knowledge card
│   │   ├── ErrorBoundary.jsx           # Error handler
│   │   ├── FileUpload.jsx              # File uploader
│   │   ├── Footer.jsx                  # Page footer
│   │   ├── Header.jsx                  # Navigation header
│   │   ├── InteractiveMap.jsx          # Geographic map
│   │   ├── KnowledgeGraph3D.jsx        # 3D graph
│   │   ├── LoadingSpinner.jsx          # Loading indicator
│   │   ├── NodeGraph.jsx               # 2D knowledge graph
│   │   ├── NotificationBell.jsx        # Notifications
│   │   ├── ProgressBar.jsx             # Progress indicator
│   │   ├── ReasoningTrace.jsx          # AI reasoning display
│   │   ├── SearchBar.jsx               # Search component
│   │   ├── SubmitWizard.jsx            # Multi-step submission
│   │   ├── UserProfile.jsx             # Profile component
│   │   ├── VoiceAssistant.jsx          # Speech recognition
│   │   ├── VoiceRecorder.jsx           # Audio recording
│   │   ├── WalletConnect.jsx           # Web3 wallet
│   │   └── Web3Provider.jsx            # Web3 context
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAudioRecorder.js         # Audio recording hook
│   │   ├── useCulturalData.js          # Data management hook
│   │   ├── useLocalStorage.js          # Local storage hook
│   │   └── useNotifications.js         # Notifications hook
│   │
│   ├── lib/                    # Libraries and utilities
│   │   └── api.js              # API client with all endpoints
│   │
│   ├── styles/                 # Additional styles
│   │   ├── animations.css      # Animation utilities
│   │   └── utilities.css       # Helper classes
│   │
│   ├── utils/                  # Utility functions
│   │   ├── constants.js        # App constants
│   │   ├── format.js           # Formatting utilities
│   │   └── validation.js       # Validation helpers
│   │
│   └── middleware.js           # Next.js middleware
│
├── .env.local.example          # Environment variables template
├── .gitignore                  # Git ignore rules
├── jsconfig.json               # JavaScript config
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS config
├── tailwind.config.js          # Tailwind config
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **yarn** 1.22.x)
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Edwin420s/AfriVerse.git
cd AfriVerse/frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=1
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the frontend directory:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:4000/api` |
| `NEXT_PUBLIC_IPFS_GATEWAY` | IPFS gateway URL | No | `https://ipfs.io/ipfs` |
| `NEXT_PUBLIC_WEB3_STORAGE_TOKEN` | Web3.Storage API token | No | - |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Smart contract address | No | - |
| `NEXT_PUBLIC_NETWORK_ID` | Blockchain network ID | No | `1` |
| `NEXT_PUBLIC_INFURA_ID` | Infura project ID | No | - |
| `NEXT_PUBLIC_ENABLE_WEB3` | Enable Web3 features | No | `true` |
| `NEXT_PUBLIC_ENABLE_VOICE_RECORDING` | Enable voice recording | No | `true` |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Max file upload size (bytes) | No | `10485760` |
| `NEXT_PUBLIC_SUPPORTED_LANGUAGES` | Comma-separated language codes | No | `en,sw,yo,ig,ha` |

---

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
```

### Production Build
```bash
npm run build        # Build for production
npm run start        # Start production server
```

---

## 🧩 Key Components

### SubmitWizard
Multi-step form for cultural knowledge submission:
- **Step 1**: Content type selection
- **Step 2**: Voice/text/file input
- **Step 3**: Metadata (community, language, location)
- **Step 4**: Consent and licensing
- **Step 5**: Review and submit

```javascript
import SubmitWizard from '@/components/SubmitWizard'

<SubmitWizard onComplete={(data) => console.log(data)} />
```

### VoiceRecorder
Audio recording with visualization:
```javascript
import VoiceRecorder from '@/components/VoiceRecorder'

<VoiceRecorder onRecordingComplete={(blob) => handleAudio(blob)} />
```

### KnowledgeGraph3D
Interactive 3D visualization:
```javascript
import KnowledgeGraph3D from '@/components/KnowledgeGraph3D'

<KnowledgeGraph3D data={graphData} />
```

### AIChatAssistant
Conversational AI interface:
```javascript
import AIChatAssistant from '@/components/AIChatAssistant'

<AIChatAssistant />
```

---

## 📄 Pages Overview

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.js` | Home page with hero and features |
| `/explore` | `explore/page.js` | Browse knowledge entries |
| `/submit` | `submit/page.js` | Submit new knowledge |
| `/entry/[id]` | `entry/[id]/page.js` | View entry details |
| `/validator` | `validator/page.js` | Validation dashboard |
| `/profile` | `profile/page.js` | User profile and stats |
| `/communities` | `communities/page.js` | Browse communities |
| `/timeline` | `timeline/page.js` | Cultural timeline |

---

## 🎨 Styling Guide

### Color Palette
```css
/* Primary Colors */
--primary-navy: #0B132B;    /* Dark background */
--primary-cyan: #00ADB5;    /* Accent color */
--primary-gold: #FFD369;    /* Highlight color */
--primary-white: #EEEEEE;   /* Text color */
```

### Gradient Classes
```css
.gradient-text          /* Gold to Cyan text gradient */
.gold-gradient         /* Gold background gradient */
.cyan-gradient         /* Cyan background gradient */
.navy-gradient         /* Navy background gradient */
```

### Custom Utilities
```css
.glass                 /* Glass morphism effect */
.hover-lift            /* Lift on hover */
.animate-float         /* Floating animation */
.skeleton             /* Loading skeleton */
```

---

## 🔌 API Integration

### Using the API Client

```javascript
import { api } from '@/lib/api'

// Fetch entries
const entries = await api.getEntries({ type: 'story', limit: 10 })

// Submit new entry
const formData = new FormData()
formData.append('title', 'My Story')
formData.append('content', 'Content here')
const result = await api.submitEntry(formData)

// Search knowledge
const results = await api.searchKnowledge('traditional medicine')
```

### Available API Methods

- **Auth**: `login()`, `register()`
- **Entries**: `getEntries()`, `getEntry()`, `submitEntry()`, `updateEntry()`
- **Validation**: `getPendingValidations()`, `submitValidation()`
- **User**: `getUserProfile()`, `getUserContributions()`, `updateUserProfile()`
- **Communities**: `getCommunities()`, `getCommunity()`, `joinCommunity()`
- **Search**: `searchKnowledge()`
- **Analytics**: `getPlatformStats()`, `getUserStats()`
- **Insights**: `getCulturalInsights()`, `getCulturalTimeline()`

---

## 📱 Progressive Web App (PWA)

AfriVerse is PWA-ready with:
- **Offline support** - Service worker caching
- **Install prompt** - Add to home screen
- **App icons** - Multiple sizes for all devices
- **Manifest** - Full PWA configuration

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
```bash
vercel --prod
```

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Environment variables**: Add in Netlify dashboard

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t afriverse-frontend .
docker run -p 3000:3000 afriverse-frontend
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style Guidelines
- Use **functional components** with hooks
- Follow **ESLint** rules
- Write **descriptive commit messages**
- Add **JSDoc comments** for complex functions
- Ensure **responsive design** for all components

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: Module not found errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Problem**: Environment variables not loading
```bash
# Solution: Ensure .env.local exists and restart dev server
cp .env.local.example .env.local
npm run dev
```

**Problem**: Build fails
```bash
# Solution: Check Node version and clear cache
node --version  # Should be 18+
npm run build
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 BGI25 Hackathon

Built for **BGI25 Hackathon: "AGI Without Borders"**
- **Track**: AGI + Cultural Memory
- **Goal**: Preserve African indigenous knowledge using symbolic AI
- **Tech**: MeTTa, SingularityNET SDKs, Fetch.AI, Blockchain

---

## 👥 Team

**Developer**: Edwin Mwiti
- **GitHub**: [@Edwin420s](https://github.com/Edwin420s)
- **Email**: eduedwyn5@gmail.com
- **LinkedIn**: [Edwin Mwiti](https://linkedin.com/in/edwin-mwiti)

---

## 🙏 Acknowledgments

- **SingularityNET** - AGI infrastructure
- **Fetch.AI** - Agent framework
- **Cudos** - Compute resources
- **WADA** - Cultural guidance
- **BGI25 Summit** - Hackathon organization
- **African communities** - Cultural knowledge sharing

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [SingularityNET Documentation](https://docs.singularitynet.io/)
- [Fetch.AI Documentation](https://docs.fetch.ai/)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for African Cultural Preservation**
