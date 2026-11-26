# Velvet Fashion 

[![CI](https://github.com/AimanCrafts/velvet-fashion/actions/workflows/ci.yml/badge.svg)](https://github.com/AimanCrafts/velvet-fashion/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/AimanCrafts/velvet-fashion/actions/workflows/deploy.yml/badge.svg)](https://github.com/AimanCrafts/velvet-fashion/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-3E0713.svg)](LICENSE)

**Live Storefront:** [https://aimancrafts.github.io/velvet-fashion/](https://aimancrafts.github.io/velvet-fashion/)

An editorial luxury clothing storefront and operations hub tailored for the Bangladesh market — combining Scandinavian-inspired retail clarity with subcontinental couture, bilingual support (English & বাংলা), 64-district delivery zone calculations, bKash/Nagad/COD reconciliation, and a hardened Supabase backend.

---

## Features

- **Editorial Storefront & Lookbook:** Multi-slide campaign hero, curated department tiles, occasion-based wardrobe edits (*Wedding & Reception*, *Festive & Eid*, *Winter Soirée*, *Wardrobe Essentials*), and a chaptered *Behind the Seams* Lookbook (`#/lookbook`).
- **Streamlined Merchandising:** Department mega-menus, predictive live search (`/` shortcut), secondary-image hover swaps, quick-add size trays directly on product cards, multi-facet filtering (department, occasion, stock status, saved wishlist), and a slide-out mini bag with complimentary delivery progress tracking.
- **Bilingual Interface:** Full English and Bengali (`বাংলা`) copy, typography (`Playfair Display` / `Cinzel` / `Noto Serif Bengali`), and localized BDT (`৳`) formatting.
- **Bangladesh Logistics & Payments:** Tiered rates across Dhaka Metro, Dhaka Suburbs, Chittagong/Sylhet Divisional Metro, and Nationwide Express (64 districts), supporting Cash on Delivery (COD), bKash, and Nagad.
- **Order Concierge & Tracking:** Public order status lookup (`#/track` and `#/order/:token`) using cryptographic lookup tokens and masked customer PII.
- **Operations Dashboard (`#/admin`):** Staff portal for order fulfillment workflows, bKash/Nagad transaction verification, inventory lot intake, and regulatory credential updates.
- **Security & Privacy:** Server-authoritative pricing and stock locking (`FOR UPDATE`), Row-Level Security (RLS), edge CSP/HSTS headers, input sanitization, client rate limiting, and audit logging.

---

## Tech Stack

- **Frontend:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Lucide React
- **Backend & Database:** Supabase (PostgreSQL 15+), Edge Functions, PostgREST, Security-Definer RPCs, Row-Level Security
- **Deployment & Edge:** GitHub Pages (automated via GitHub Actions) and Cloudflare Pages edge security headers (`public/_headers`)

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm (v10+)

### Installation

```bash
git clone https://github.com/AimanCrafts/velvet-fashion.git
cd velvet-fashion
npm install
```

### Environment Configuration

Create a `.env` file in the root directory (optional for local preview):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_URL=https://velvetfashion.com.bd
```

> **Note:** When Supabase credentials are omitted, the storefront runs seamlessly in preview mode with local catalog, delivery zone, and session order data.

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to preview locally.

---

## Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Type-checks with `tsc -b` and builds production assets (`dist/`) |
| `npm run lint` | Runs ESLint across the repository |
| `npm test` | Runs the automated security, schema, and parity suite (`scripts/verify.mjs`) |
| `npm run preview` | Previews the compiled production bundle locally |

---

## Project Structure

```
├── .github/workflows/      # CI checks and automated GitHub Pages deployment
├── docs/                   # Database, Cloudflare deployment, and security docs
├── public/                 # Static assets, brand emblem, edge _headers & _redirects
├── scripts/
│   └── verify.mjs          # Automated security, migration, and data parity checks
├── src/
│   ├── components/
│   │   ├── admin/          # Staff fulfillment hub, print slips, and lot intake
│   │   ├── checkout/       # Cart drawer, checkout views, and order confirmation
│   │   ├── guidelines/     # Atelier brand standards reference modal
│   │   ├── layout/         # Mega-menu navbar, predictive search, and footer
│   │   ├── product/        # Product detail view and size guide modal
│   │   ├── store/          # Hero slider, category tiles, occasion edits, product cards
│   │   └── ui/             # Toast, Skeleton, EmptyState, and ErrorBoundary
│   ├── context/            # StoreContext state and custom useStore hook
│   ├── data/               # Catalog, delivery zones, and seed-aligned fallback data
│   ├── pages/              # HomePage, ShopPage, LookbookPage, TrackOrderPage, NotFoundPage
│   ├── router/             # Hash router and navigation Link component
│   ├── services/           # Typed Supabase client and Edge Function wrappers
│   ├── types/              # Domain and database TypeScript definitions
│   └── utils/              # BDT/Bengali formatters and XSS/validation helpers
└── supabase/
    ├── functions/          # Edge Functions (create-order, order-lookup)
    └── migrations/         # Sequential PostgreSQL migrations
```

---

## Documentation

- [Database Setup & Migrations](docs/database.md)
- [Cloudflare Edge Deployment](docs/deployment.md)
- [Security Controls & Architecture](docs/security.md)

---

## Compliance

Velvet Fashion is structured in accordance with the **Bangladesh Digital Commerce Operational Guidelines 2021** and the **Consumer Rights Protection Act 2009**.

---

## License

Licensed under the [MIT License](LICENSE).
