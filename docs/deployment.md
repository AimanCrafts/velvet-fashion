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
- **Expression:** `(http.request.method eq "POST" and http.request.uri.path contains "create_order_secure")`
- **Rate Limit:** 5 requests per 10 minutes per IP
- **Action:** `Managed Challenge`

### 2. Regional Geo-Challenge
- **Expression:** `(ip.geoip.country ne "BD" and cf.threat_score gt 15)`
- **Action:** `Managed Challenge`

### 3. Bot Management
- Enable **Bot Fight Mode** under **Security > Bots** to challenge automated scrapers.

---

## 4. SSL / TLS Configuration

- **Encryption Mode:** `Full (Strict)`
- **Minimum TLS Version:** `TLS 1.2`
- **TLS 1.3:** `ON`
- **Automatic HTTPS Rewrites:** `ON`
