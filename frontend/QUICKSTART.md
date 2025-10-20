# AfriVerse - Quick Start Guide 🚀

Get AfriVerse running on your machine in under 5 minutes!

## Prerequisites ✅

Make sure you have installed:
- **Node.js 18+** → [Download](https://nodejs.org/)
- **npm 9+** (comes with Node.js)
- **Git** → [Download](https://git-scm.com/)

Check your versions:
```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

## Installation Steps 📦

### 1. Clone the Repository
```bash
git clone https://github.com/Edwin420s/AfriVerse.git
cd AfriVerse/frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages (~2-3 minutes).

### 3. Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Open `.env.local` and update if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to **http://localhost:3000** 🎉

You should see the AfriVerse home page!

## Available Pages 📄

Once running, explore these pages:

- **Home** → http://localhost:3000
- **Explore Knowledge** → http://localhost:3000/explore
- **Submit Knowledge** → http://localhost:3000/submit
- **Communities** → http://localhost:3000/communities
- **Timeline** → http://localhost:3000/timeline
- **Validator Dashboard** → http://localhost:3000/validator
- **User Profile** → http://localhost:3000/profile

## Key Features to Test 🧪

### 1. Voice Recording
- Go to Submit page
- Click on "Voice Recording" option
- Allow microphone access
- Record a sample audio

### 2. Knowledge Exploration
- Visit Explore page
- Use search bar to filter entries
- Click on any entry to view details

### 3. Interactive Map
- Go to Timeline page
- Switch to "Map View"
- Click on regions to explore

### 4. AI Chat Assistant
- Look for the chat icon in the bottom-right corner
- Ask questions about cultural knowledge

## Common Commands 🛠️

```bash
# Development
npm run dev          # Start dev server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Check code quality

# Troubleshooting
rm -rf node_modules .next  # Clean install
npm install                # Reinstall
npm run dev                # Restart
```

## Troubleshooting 🔧

### Port Already in Use
If port 3000 is taken:
```bash
# Option 1: Kill the process using port 3000
npx kill-port 3000

# Option 2: Use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Environment Variables Not Loading
```bash
# Ensure .env.local exists
ls -la .env.local

# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

## Project Structure 📁

```
frontend/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # API client
│   ├── styles/          # CSS files
│   └── utils/           # Utilities
├── public/              # Static assets
└── package.json         # Dependencies
```

## Next Steps 🎯

1. **Read the full README** → `README.md`
2. **Check contribution guide** → `CONTRIBUTING.md`
3. **Explore components** → `src/components/`
4. **Review API integration** → `src/lib/api.js`

## Need Help? 💬

- **Documentation** → See `README.md`
- **Issues** → [GitHub Issues](https://github.com/Edwin420s/AfriVerse/issues)
- **Email** → eduedwyn5@gmail.com

## Production Build 🏗️

When ready to deploy:

```bash
# Create optimized build
npm run build

# Test production build locally
npm run start

# Deploy to Vercel (recommended)
vercel
```

---

**You're all set!** Start exploring and contributing to AfriVerse 🌍✨
