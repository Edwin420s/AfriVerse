# AfriVerse Public Assets

This directory contains all public assets for the AfriVerse frontend application.

## Directory Structure

```
assets/
├── icons/          # App icons and favicons (various sizes)
├── images/         # General images, hero images, placeholders
└── README.md       # This file
```

## Icons (`/icons`)

App icons for PWA support and branding. Required sizes:
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px

**Format:** PNG with transparent background
**Color Scheme:** Primary Navy (#0B132B), Cyan (#00ADB5), Gold (#FFD369)

## Images (`/images`)

General application images including:
- Hero section backgrounds
- OG (Open Graph) images for social sharing (1200x630px)
- Timeline event illustrations
- Community avatars
- Placeholder images

**Formats:** PNG, JPG, WebP (optimized for web)
**Naming Convention:** Use kebab-case (e.g., `hero-background.jpg`)

## Usage in Components

```javascript
// Next.js Image component
import Image from 'next/image'

<Image 
  src="/assets/images/hero-bg.jpg" 
  alt="Description"
  width={1200}
  height={600}
/>

// Standard img tag
<img src="/assets/icons/logo.png" alt="AfriVerse" />
```

## Asset Optimization

- Compress images before adding (use tools like TinyPNG, ImageOptim)
- Use WebP format for better compression
- Provide multiple resolutions for responsive images
- Keep individual file sizes under 500KB when possible

## Cultural Sensitivity

When adding images:
- Ensure proper consent for cultural imagery
- Credit original photographers/artists
- Respect sacred or sensitive cultural content
- Follow community guidelines for representation
