# Palu Dev House

A modern landing page for Palu Dev House - a technology company from Indonesia building tools and SaaS applications.

## Features

- **Landing Page Sections**: Jumbotron, About Us, Philosophy, Focus, Projects, Founders, Articles, Contact
- **Project Pages**: Project listing and detail pages
- **Articles**: Article listing and detail pages with rich content
- **Founders Page**: Detailed background information
- **Admin Panel**: TOTP-based authentication for content management
- **SEO Optimized**: Meta tags, Open Graph, semantic HTML
- **Mobile Friendly**: Fully responsive design
- **Static Export**: Pre-rendered pages for fast loading

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite (better-sqlite3)
- Bun

## Project Structure

```
palu-dev-house/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── admin/          # Admin panel
│   │   ├── api/            # API routes
│   │   ├── articles/       # Article pages
│   │   ├── founders/       # Founders page
│   │   ├── projects/       # Project pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── AboutUs.tsx
│   │   ├── Articles.tsx
│   │   ├── Contact.tsx
│   │   ├── Focus.tsx
│   │   ├── Footer.tsx
│   │   ├── Founders.tsx
│   │   ├── Header.tsx
│   │   ├── Jumbotron.tsx
│   │   ├── Philosophy.tsx
│   │   └── Projects.tsx
│   └── lib/
│       ├── auth.ts         # TOTP authentication
│       └── db.ts           # Database utilities
├── public/
│   └── images/            # Static images
├── data/                   # SQLite database
└── dist/                   # Static export
```

## Getting Started

### Prerequisites

- Bun 1.3+
- Node.js 18+ (for Next.js)

### Installation

```bash
# Install dependencies
bun install

# Create data directory
mkdir -p data

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build static export
bun run build

# The static files will be in the dist/ directory
```

## Admin Access

The admin panel is accessible at `/admin`.

**TOTP Secret**: `KBZXI2D7N2VTSZLWKR5GK2LMNRXHG2L7`

Use this secret in any TOTP authenticator app (Google Authenticator, Authy, etc.) to generate login codes.

**Note**: This is a static TOTP for demonstration. In production, implement proper per-user authentication.

## Pages

- `/` - Home page with all sections
- `/projects` - Project listing
- `/projects/[slug]` - Project detail
- `/articles` - Article listing
- `/articles/[slug]` - Article detail
- `/founders` - Founders background
- `/admin` - Admin panel (TOTP protected)

## Customization

### Colors

The primary color scheme uses blue (`blue-600`) as the main brand color. You can customize this in component files.

### Content

Update the content in the component files:
- `src/components/AboutUs.tsx` - Company information
- `src/components/Founders.tsx` - Founder information
- `src/components/Projects.tsx` - Project listings
- `src/components/Articles.tsx` - Article listings

### Images

Replace the placeholder images in `public/images/`:
- `stiven.png` - Stiven's photo
- `ferdy.png` - Ferdy's photo
- `Palu Dev House.svg` - Company logo

## Deployment

This project is configured for static export. Deploy the `dist/` folder to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

## License

MIT License - Palu Dev House

## Contact

- Email: hello@paludevhouse.id
- Location: Sulawesi, Indonesia
