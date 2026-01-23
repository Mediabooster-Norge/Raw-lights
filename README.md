# Sanity starter Multisite

A multisite Next.js + Sanity CMS setup for managing multiple  websites from a single codebase.

## Sites


## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token
SANITY_PREVIEW_SECRET=your-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=https://yoursite.com
REVALIDATE_SECRET=your-revalidate-secret
SITE_URL_LANDSTREFF=https://landstreffstavanger.no
SITE_URL_YPSILON=https://ypsilonfestivalen.no
SITE_URL_JULIVINTERLAND=https://julivinterland.no
```

## Project Structure

```
├── app/
│   ├── (sites)/[site]/     # Site-specific routes
│   ├── api/                 # API routes
│   └── studio/              # Sanity Studio
├── lib/
│   ├── components/          # React components
│   ├── sanity/              # Sanity config & queries
│   ├── theme/               # Theme system
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── schemas/                 # Sanity schemas
└── architecture/            # Documentation
```

## Features

- 🏢 **Multisite** - Single codebase, multiple sites
- 🎨 **Theming** - Per-site customizable themes
- 📝 **Page Builder** - Flexible block-based pages
- 🔍 **SEO** - Full SEO control per page
- 📱 **Responsive** - Mobile-first design
- ⚡ **Fast** - ISR + On-demand revalidation
- 🔐 **Preview** - Sanity preview mode
- 🎫 **Ticketing** - Ticketmaster/Tickster integration

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typegen   # Generate Sanity types
```

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

## Documentation

See the `/architecture` folder for detailed documentation:

- Environment setup
- Directory structure
- Multisite routing
- Theme system
- Components
- Sanity schemas
- And more...
