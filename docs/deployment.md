# Cloudflare Pages Deployment & Edge Configuration

Velvet Fashion is designed for deployment on **Cloudflare Pages** utilizing Cloudflare's Anycast Edge Network and Web Application Firewall (WAF).

---

## 1. Cloudflare Pages Setup

### Project Settings
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Root Directory:** `/`

### Production Environment Variables
Set the following environment variables in **Cloudflare Dashboard > Pages > Settings > Environment variables**:

| Variable | Description |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase project URL (`https://your-project-id.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase anonymous client key |
| `VITE_SITE_URL` | Production storefront domain (`https://velvetfashion.com.bd`) |

Set `SITE_URL=https://velvetfashion.com.bd` as a Supabase Edge Function secret so the function origin allowlist matches the production site. Do not set `ALLOW_LOCAL_ORIGIN` in production.

---

## 2. Edge Routing & Security Headers

### Single-Page Application (SPA) Routing
The file `public/_redirects` routes client-side hash and history paths to the application entrypoint:
```
/*    /index.html   200
```

### Edge Response Headers
The file `public/_headers` configures production HTTP headers applied at Cloudflare edge:
- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`
- **X-Frame-Options:** `DENY`
- **X-Content-Type-Options:** `nosniff`
- **Content-Security-Policy:** Restricts frame embedding and third-party script sources
- **Cache-Control:** Edge caching disabled for sensitive administrative and checkout routes

---

## 3. Web Application Firewall (WAF) Rules

Configure the following WAF rules in **Cloudflare Dashboard > Security > WAF**:

### 1. Checkout Throttling
The Edge Function path is `/functions/v1/create-order` (order lookup uses `/functions/v1/order-lookup`). The frontend currently sends these requests directly to the Supabase project URL. A Cloudflare WAF rule on `velvetfashion.com.bd` will not see that traffic unless the API is routed through a Cloudflare-proxied hostname or Worker. The application also enforces shared database-backed limits of 5 checkout attempts and 20 order lookups per 10 minutes per client IP.

### 2. Regional Geo-Challenge
- **Expression:** `(ip.src.country ne "BD")`
- **Action:** `Managed Challenge`

### 3. Bot Management
- Enable **Bot Fight Mode** under **Security > Bots** to challenge automated scrapers.

---

## 4. SSL / TLS Configuration

- **Encryption Mode:** `Full (Strict)`
- **Minimum TLS Version:** `TLS 1.2`
- **TLS 1.3:** `ON`
- **Automatic HTTPS Rewrites:** `ON`

## 5. GitHub Pages deployment note

The repository's GitHub Actions deploy workflow publishes to GitHub Pages, while `public/_headers` is honored by Cloudflare Pages rather than GitHub Pages. To make the configured HTTP security headers active, either deploy the built `dist` directory to Cloudflare Pages or proxy the custom domain through Cloudflare and add equivalent response header rules. The HTML CSP remains a fallback, but it cannot set HSTS or `X-Frame-Options`.
