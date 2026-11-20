# Velvet Fashion | ভেলভেট ফ্যাশন

A modern luxury fashion storefront and operations hub designed for the Bangladesh market, featuring bilingual support (Bangla & English), multi-tier delivery zone calculations, mobile financial service reconciliation (bKash & Nagad), and a staff fulfillment dashboard.

---

## Features

- **Storefront & Catalog:** Curated luxury collections including Party Kaftans, Royal Panjabis, Exclusive Sarees, and Festive Kidswear.
- **Bilingual Interface:** Full bilingual UI support in English and Bengali (`বাংলা`).
- **Bangladesh Logistics Engine:** Tiered shipping rates and estimated delivery times across Dhaka Metro, Dhaka Suburbs, Divisional Hubs (Chittagong/Sylhet), and nationwide express courier coverage across all 64 districts.
- **Payment Methods:** Support for Cash on Delivery (COD), bKash Merchant Pay, and Nagad.
- **Operations Dashboard:** Staff admin panel for live order status workflows, payment reconciliation, inventory lot intake, and regulatory business profile management.
- **Security & Privacy:** Server-authoritative price and stock verification, Row-Level Security (RLS), PII masking, and tamper-evident audit logging.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React
- **Backend & Database:** Supabase (PostgreSQL 15+), PostgREST, Database RPCs, Row-Level Security
- **Hosting & Edge:** Cloudflare Pages with Anycast CDN and WAF security headers

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/velvet-fashion.git
cd velvet-fashion

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_URL=https://velvetfashion.com.bd
```

> **Note:** The storefront runs gracefully in local preview mode with offline fallback data if Supabase credentials are not configured.

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to explore the storefront.

---

## Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with hot module replacement |
| `npm run build` | Compiles TypeScript and builds production distribution (`dist/`) |
| `npm run lint` | Runs ESLint across the codebase |
| `npm test` | Runs the automated system & schema verification suite |
| `npm run preview` | Locally previews the compiled production build |

---

## Project Structure

```
├── docs/                   # Architecture, database, deployment, and security guides
│   ├── database.md         # PostgreSQL migrations, schema, and RPC documentation
│   ├── deployment.md       # Cloudflare Pages build and edge header setup
│   └── security.md         # Application and database security controls
├── public/                 # Static assets, brand emblems, and edge configs
│   ├── _headers            # Cloudflare Pages HTTP security headers
│   ├── _redirects          # SPA client-side routing fallback rule
│   └── robots.txt          # Search engine crawler policies
├── scripts/                # Utility and test scripts
│   └── verify.mjs          # Automated verification test suite
├── src/
│   ├── components/
│   │   ├── admin/          # Order management, fulfillment slips, and lot intake
│   │   ├── checkout/       # Shopping cart drawer, checkout modal, and receipts
│   │   ├── guidelines/     # Digital commerce guidelines & brand standards modal
│   │   ├── layout/         # Navigation bar, mobile menus, and footer
│   │   ├── product/        # Product detail modal, quick view, size guide
│   │   ├── store/          # Category grids, editorial banners, hero sections
│   │   └── ui/             # Reusable UI components (Toast, Skeleton, ErrorBoundary)
│   ├── context/            # React StoreContext provider and state management
│   ├── data/               # Catalog datasets and delivery zone configurations
│   ├── pages/              # Routed pages (Home, Shop, Order Confirmation, 404)
│   ├── router/             # Lightweight client router and link utilities
│   ├── services/           # Supabase REST client and PostgREST endpoints
│   ├── types/              # Domain interfaces and generated database types
│   └── utils/              # Currency formatters and sanitization helpers
└── supabase/
    └── migrations/         # Sequential PostgreSQL migration scripts (001-005)
```

---

## Documentation

- [Database Setup & Migrations](docs/database.md)
- [Cloudflare Edge Deployment](docs/deployment.md)
- [Security Controls & Architecture](docs/security.md)

---

## Compliance

Velvet Fashion is architected in accordance with the **Bangladesh Digital Commerce Operational Guidelines 2021** and the **Consumer Rights Protection Act 2009**.

---

## License

Private & Proprietary. All rights reserved.
