/**
 * Site Configuration
 * Global site settings and constants for AfriVerse
 */

export const siteConfig = {
  // Site Info
  name: 'AfriVerse',
  title: 'AfriVerse - Preserving Wisdom Through AGI',
  description: 'Decentralized platform for preserving and sharing African indigenous knowledge using AI and blockchain technology.',
  tagline: 'Where Ancestral Knowledge Meets Artificial Intelligence',
  
  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs',
  
  // Contact & Social
  email: 'eduedwyn5@gmail.com',
  social: {
    twitter: 'https://twitter.com/afriverse',
    github: 'https://github.com/Edwin420s/AfriVerse',
    discord: 'https://discord.gg/afriverse',
    telegram: 'https://t.me/afriverse'
  },
  
  // Links
  links: {
    docs: '/docs',
    whitepaper: '/whitepaper.pdf',
    github: 'https://github.com/Edwin420s/AfriVerse',
    support: '/support'
  },

  // Features
  features: [
    {
      id: 'voice-recording',
      name: 'Voice Recording',
      description: 'Record oral traditions and stories in native languages',
      icon: 'Mic',
      enabled: true
    },
    {
      id: 'ai-transcription',
      name: 'AI Transcription',
      description: 'Automatic transcription with multi-language support',
      icon: 'FileText',
      enabled: true
    },
    {
      id: 'knowledge-graph',
      name: '3D Knowledge Graph',
      description: 'Interactive visualization of cultural connections',
      icon: 'Network',
      enabled: true
    },
    {
      id: 'blockchain-verification',
      name: 'Blockchain Verification',
      description: 'Immutable proof of authenticity and ownership',
      icon: 'Shield',
      enabled: true
    },
    {
      id: 'community-validation',
      name: 'Community Validation',
      description: 'Peer-reviewed by cultural experts',
      icon: 'Users',
      enabled: true
    },
    {
      id: 'ipfs-storage',
      name: 'Decentralized Storage',
      description: 'Permanent storage on IPFS',
      icon: 'Database',
      enabled: true
    }
  ],

  // Content Types
  contentTypes: [
    { id: 'story', name: 'Story', icon: 'BookOpen', color: 'cyan' },
    { id: 'practice', name: 'Practice', icon: 'Activity', color: 'gold' },
    { id: 'plant', name: 'Plant Knowledge', icon: 'Leaf', color: 'green' },
    { id: 'ritual', name: 'Ritual', icon: 'Sparkles', color: 'purple' },
    { id: 'artifact', name: 'Artifact', icon: 'Package', color: 'orange' },
    { id: 'song', name: 'Song', icon: 'Music', color: 'pink' },
    { id: 'proverb', name: 'Proverb', icon: 'Quote', color: 'blue' },
    { id: 'recipe', name: 'Recipe', icon: 'Utensils', color: 'red' }
  ],

  // Languages
  supportedLanguages: [
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
    { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'om', name: 'Oromo', nativeName: 'Oromoo' },
    { code: 'sn', name: 'Shona', nativeName: 'chiShona' },
    { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
    { code: 'lg', name: 'Luganda', nativeName: 'Luganda' },
    { code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
  ],

  // Regions
  regions: [
    { id: 'east', name: 'East Africa', countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia'] },
    { id: 'west', name: 'West Africa', countries: ['Nigeria', 'Ghana', 'Senegal', 'Mali', 'Benin', 'Togo'] },
    { id: 'south', name: 'Southern Africa', countries: ['South Africa', 'Zimbabwe', 'Botswana', 'Zambia', 'Mozambique'] },
    { id: 'central', name: 'Central Africa', countries: ['DRC', 'Cameroon', 'CAR', 'Chad', 'Gabon'] },
    { id: 'north', name: 'North Africa', countries: ['Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya'] }
  ],

  // License Types
  licenseTypes: [
    {
      id: 'cc-by',
      name: 'CC BY 4.0',
      description: 'Attribution - Others can share and adapt with credit',
      icon: 'Share2',
      commercial: true,
      derivatives: true
    },
    {
      id: 'cc-by-nc',
      name: 'CC BY-NC 4.0',
      description: 'Attribution Non-Commercial - No commercial use',
      icon: 'DollarSign',
      commercial: false,
      derivatives: true
    },
    {
      id: 'cc-by-sa',
      name: 'CC BY-SA 4.0',
      description: 'Attribution Share-Alike - Share under same license',
      icon: 'Share',
      commercial: true,
      derivatives: true
    },
    {
      id: 'community-only',
      name: 'Community Only',
      description: 'Restricted to community members only',
      icon: 'Lock',
      commercial: false,
      derivatives: false
    },
    {
      id: 'research-only',
      name: 'Research Only',
      description: 'For academic and research purposes only',
      icon: 'BookOpen',
      commercial: false,
      derivatives: false
    }
  ],

  // Status Types
  statusTypes: [
    { id: 'pending', name: 'Pending Validation', color: 'yellow', icon: 'Clock' },
    { id: 'validated', name: 'Validated', color: 'green', icon: 'CheckCircle' },
    { id: 'rejected', name: 'Rejected', color: 'red', icon: 'XCircle' },
    { id: 'flagged', name: 'Flagged', color: 'orange', icon: 'AlertTriangle' }
  ],

  // Badges/Achievements
  badges: [
    {
      id: 'first-contribution',
      name: 'First Contribution',
      description: 'Made your first knowledge contribution',
      icon: '🌱',
      requirement: 'Submit 1 entry'
    },
    {
      id: 'knowledge-keeper',
      name: 'Knowledge Keeper',
      description: 'Contributed 10 validated entries',
      icon: '📚',
      requirement: 'Submit 10 validated entries'
    },
    {
      id: 'community-validator',
      name: 'Community Validator',
      description: 'Validated 50 community entries',
      icon: '✅',
      requirement: 'Validate 50 entries'
    },
    {
      id: 'elder-wisdom',
      name: 'Elder Wisdom',
      description: 'Contributed 100+ entries',
      icon: '👴',
      requirement: 'Submit 100 validated entries'
    },
    {
      id: 'voice-ambassador',
      name: 'Voice Ambassador',
      description: 'Recorded 20+ audio entries',
      icon: '🎙️',
      requirement: 'Submit 20 audio entries'
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Created and managed a community',
      icon: '🏘️',
      requirement: 'Create a community'
    }
  ],

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    pageSizeOptions: [10, 20, 50, 100]
  },

  // File Upload
  fileUpload: {
    maxSize: 100 * 1024 * 1024, // 100MB
    acceptedTypes: {
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      document: ['application/pdf', 'text/plain']
    }
  },

  // Theme Colors
  colors: {
    primary: {
      navy: '#0B132B',
      cyan: '#00ADB5',
      gold: '#FFD369',
      white: '#EEEEEE'
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },

  // Analytics
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.NEXT_PUBLIC_GA_ID
  },

  // Rate Limiting
  rateLimits: {
    submitEntry: {
      requests: 10,
      period: '1h'
    },
    search: {
      requests: 100,
      period: '1m'
    },
    api: {
      requests: 1000,
      period: '1h'
    }
  },

  // SEO
  seo: {
    keywords: [
      'African knowledge',
      'indigenous wisdom',
      'cultural preservation',
      'blockchain',
      'AI',
      'AGI',
      'decentralized',
      'IPFS',
      'Web3',
      'cultural heritage',
      'oral traditions',
      'African languages'
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'AfriVerse'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@afriverse'
    }
  }
}

export default siteConfig
