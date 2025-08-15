# Travel + Music Portfolio

A unique, travel-themed portfolio where destinations come alive through interactive 3D globes, immersive storytelling, and live music integration. Built with Next.js, Three.js, and modern web technologies.

## 🌟 Features

### 🌍 Interactive Globe Experience
- **3D Globe Navigation**: Explore destinations using a Three.js-powered interactive globe
- **Smooth Camera Transitions**: Cinematic fly-to animations between cities
- **Day/Night Modes**: Toggle between different lighting and atmosphere
- **Auto Tour & Manual Modes**: Guided journey or free exploration

### 🎵 Music Integration
- **City Soundtracks**: Each destination has curated playlists that enhance the experience
- **Mini Player**: Persistent audio player with city-specific tracks
- **Festival Playlist Generator**: AI-powered OCR tool that creates Spotify playlists from festival posters

### 📱 Responsive Design
- **Mobile Optimized**: Graceful fallbacks for mobile devices
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Progressive Enhancement**: Works without JavaScript for core content

### 🏗️ Modern Architecture
- **Next.js 14**: App Router with TypeScript for type safety
- **Framer Motion**: Smooth animations and page transitions
- **Contentlayer**: MDX-based content management
- **Zustand**: Lightweight state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd travel-music-portfolio

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the portfolio in action.

## 🧰 Troubleshooting (dev cache, chunk errors)

### Why you might see ChunkLoadError, hydration errors, or missing middleware-manifest
- **Stale client bundle after layout changes**: Moving components in `src/app/layout.tsx` changes the layout chunk. Browsers may keep an old chunk cached and request an outdated URL.
- **Multiple dev servers/ports**: If dev bounces between 3000/3001/3002, the browser might request chunks from a different port than the server currently uses.
- **Deleting `.next` while dev is running**: Clearing build output during compilation can leave Next in a partial state (e.g., missing `middleware-manifest.json`).
- **Node version mismatch**: Switching Node versions invalidates compiled artifacts and caches, increasing inconsistency.

### Prevent it
- **Pin Node and always use it**: Use Node 20 (e.g., via nvm). Create `.nvmrc` with `20` and run `nvm use` before dev.
- **Run a single dev server on port 3000**: Avoid multiple terminals/ports. If 3000 is busy, kill the old process rather than auto-switching ports.
- **Don’t delete `.next` while dev is running**: Stop dev first, then clear caches, then start dev again.
- **Force-refresh after layout changes**: Hard refresh (Cmd-Shift-R) or open a new private window.

### Clean restart sequence
Run this if anything gets weird:

```bash
# Stop all Next devs and free ports
pkill -f "next dev" || true; lsof -ti:3000,3001,3002 | xargs -I {} kill -9 {} || true

# Clean caches (with dev stopped)
rm -rf .next .contentlayer .turbo node_modules/.cache

# Ensure Node 20
nvm use 20

# Fresh install and start on port 3000
npm ci
npm run dev
```

## 🗺️ Portfolio Structure

### Welcome Section
- Boarding pass-themed hero with animated elements
- Call-to-action buttons for different exploration modes
- Smooth scroll indicators and navigation

### Interactive Globe
- 3D Earth with city pins for each destination
- Click pins to explore specific projects
- Drag to rotate, scroll to zoom
- Real-time UI controls for customization

### Destination Stories
Each city represents a different project:

- **New York**: Spotify notebook sharing platform
- **Washington DC**: Government AI ethics compliance system
- **Los Angeles**: Music analytics dashboard
- **Tokyo**: Cross-cultural ML research
- **Copenhagen**: Festival playlist generator (live demo)

### Copenhagen Demo
Live demonstration of AI + music technology:
- Upload festival posters
- OCR text extraction
- Artist name normalization
- Spotify playlist generation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and globe rendering
- **React Three Fiber** - React renderer for Three.js

### Backend
- **Next.js API Routes** - Serverless functions
- **Tesseract.js** - OCR text recognition
- **Spotify Web API** - Music data and playlist creation

### Content & Data
- **Contentlayer** - MDX content management
- **MDX** - Markdown with React components
- **Zustand** - State management

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📄 API Endpoints

### `/api/ocr`
Processes uploaded images and extracts text using OCR.

**Request**: `POST` with `multipart/form-data`
- `file`: Image file (PNG, JPG, WebP, max 5MB)

**Response**: 
```json
{
  "text": "extracted text",
  "lines": ["line 1", "line 2"],
  "confidence": 85
}
```

### `/api/normalize`
Normalizes OCR text and extracts potential artist names.

**Request**: `POST` with JSON body
```json
{ "raw": "raw OCR text" }
```

**Response**:
```json
{
  "artists": [
    { "name": "Artist Name", "confidence": 85 }
  ],
  "rejected": ["rejected text"]
}
```

### `/api/previewPlaylist`
Generates preview playlists from artist names.

**Request**: `POST` with JSON body
```json
{
  "artists": ["Artist 1", "Artist 2"],
  "limitPerArtist": 2
}
```

**Response**:
```json
{
  "tracks": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "spotifyUrl": "https://open.spotify.com/track/...",
      "previewUrl": "https://p.scdn.co/mp3-preview/..."
    }
  ]
}
```

## 🎨 Content Management

### Adding New Destinations
Create a new MDX file in `content/destinations/`:

```mdx
---
slug: city-name
city: City Name
country: Country
headline: Project Title
role: Your Role
timeframe: Timeline
coordinates:
  lat: 40.7128
  lng: -74.0060
metrics:
  - { label: "Users", value: 1000, suffix: "+" }
stack: ["React", "Node.js", "TypeScript"]
overview: Project description
---

# Detailed Case Study

Your project story with full Markdown support.
```

### Globe Coordinates
Update `src/utils/coordinates.ts` to add the new city coordinates and position on the 3D globe.

## 🔧 Configuration

### Environment Variables
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS=vercel

# Spotify API (for live playlist creation)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/auth/callback

# OCR Configuration
OCR_PROVIDER=tesseract
OCRSPACE_API_KEY=your_ocrspace_api_key # Optional alternative OCR provider

# Feature Flags
ENABLED_GLOBE_3D=true
ENABLED_CPH_DEMO=true
```

### Customization
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Fonts**: Update font imports in `src/app/layout.tsx`
- **Globe Appearance**: Adjust textures and materials in `src/components/Globe.tsx`
- **Animations**: Customize motion parameters in component files

## 📊 Performance

### Optimization Features
- **Lazy Loading**: 3D components load on-demand
- **Code Splitting**: Route-based bundle optimization
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Efficient API response caching

### Performance Targets
- **First Contentful Paint**: < 1.5s (desktop), < 2.5s (mobile)
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
# Add domain to Spotify app settings
```

### Other Platforms
The portfolio works on any platform supporting Node.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## 🎯 Browser Support

### Minimum Requirements
- **Chrome/Edge**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Mobile Safari**: 14+

### Features with Fallbacks
- **WebGL**: Required for 3D globe (fallback to 2D map)
- **WebAssembly**: Used by Tesseract.js OCR
- **Modern JavaScript**: ES2020 features

## 🤝 Contributing

This is a personal portfolio, but you're welcome to:
- Report bugs or issues
- Suggest improvements
- Use as inspiration for your own portfolio

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Three.js** - 3D graphics framework
- **React Three Fiber** - React integration for Three.js
- **Framer Motion** - Animation library
- **Contentlayer** - Content management
- **Spotify Web API** - Music data
- **Tesseract.js** - OCR capabilities

---

Built with ❤️ and ☕ by [Your Name]

*"Building playful AI + music products that travel the world"*
