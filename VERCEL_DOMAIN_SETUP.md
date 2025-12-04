# Vercel Domain Setup Guide

## Current Status
- ✅ `www.investlearn.co` - Configured
- ❌ `investlearn.co` (root domain) - Needs to be added

## How to Add Root Domain in Vercel

### Step 1: Add Domain in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **investlearn-compass-project**
3. Navigate to **Settings** → **Domains**
4. Click **"Add Domain"** button
5. Enter: `investlearn.co` (without www)
6. Click **"Add"**

### Step 2: Configure DNS Records

You need to add DNS records at your domain registrar (where you bought investlearn.co).

#### Option A: A Record (Root Domain)
Add an A record pointing to Vercel:
```
Type: A
Name: @ (or leave blank for root)
Value: 76.76.21.21
```

**Note:** Vercel uses dynamic IPs. Check Vercel's current IPs in the domain configuration page, or use CNAME if supported.

#### Option B: CNAME (If Your DNS Provider Supports Root CNAME)
Some DNS providers (like Cloudflare, Namecheap, etc.) support CNAME for root domains:
```
Type: CNAME
Name: @ (or leave blank for root)
Value: cname.vercel-dns.com
```

#### Option C: ALIAS/ANAME Record
Some providers use ALIAS/ANAME records for root domains:
```
Type: ALIAS (or ANAME)
Name: @
Value: cname.vercel-dns.com
```

### Step 3: Verify DNS Configuration

After adding the domain in Vercel, you'll see DNS configuration instructions. Vercel will show you:
- The exact DNS records needed
- Current DNS status
- Verification status

### Step 4: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate globally
- Usually works within 1-2 hours
- Check status in Vercel dashboard

### Step 5: SSL Certificate

Vercel automatically provisions SSL certificates for all configured domains via Let's Encrypt. This happens automatically once DNS is verified.

## Recommended Setup

### Both Domains Active
- `investlearn.co` → Main domain
- `www.investlearn.co` → Also works (already configured)

### Redirect Strategy (Optional)

You can configure redirects in Vercel:

1. **Redirect www to root** (Recommended for SEO):
   - Users visiting `www.investlearn.co` → Redirected to `investlearn.co`
   - Better for SEO (single canonical URL)

2. **Redirect root to www**:
   - Users visiting `investlearn.co` → Redirected to `www.investlearn.co`
   - Less common, but also valid

3. **Both work independently**:
   - Both domains serve the same content
   - No redirects

**To set up redirects:**
- Go to **Settings** → **Domains**
- Click on a domain
- Configure redirect rules

## DNS Provider Specific Instructions

### Cloudflare
1. Add A record: `@` → `76.76.21.21` (or use CNAME: `@` → `cname.vercel-dns.com`)
2. Set Proxy status to "DNS only" (gray cloud) initially
3. Once verified, you can enable proxy if desired

### Namecheap
1. Go to Advanced DNS
2. Add A record: Host `@`, Value `76.76.21.21`
3. Or use CNAME: Host `@`, Value `cname.vercel-dns.com`

### GoDaddy
1. Go to DNS Management
2. Add A record: Type `A`, Name `@`, Value `76.76.21.21`

### Google Domains
1. Go to DNS settings
2. Add A record: Name `@`, IPv4 address `76.76.21.21`

## Verification Checklist

- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured at registrar
- [ ] DNS verification passed in Vercel (green checkmark)
- [ ] SSL certificate issued (automatic)
- [ ] Both `investlearn.co` and `www.investlearn.co` work
- [ ] Test HTTPS: `https://investlearn.co`

## Troubleshooting

### Domain Not Verifying
- Check DNS records are correct
- Wait for DNS propagation (can take up to 48 hours)
- Use `dig investlearn.co` or `nslookup investlearn.co` to check DNS

### SSL Certificate Issues
- Vercel automatically provisions SSL
- If issues occur, wait 24 hours after DNS verification
- Check Vercel dashboard for SSL status

### Both Domains Not Working
- Ensure both are added in Vercel
- Check DNS records for both
- Verify DNS propagation with online tools

## Current Vercel Configuration

Your `vercel.json` is correctly configured for SPA routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes work correctly on both domains.

---

**Note:** Domain configuration is done entirely in the Vercel dashboard. The `vercel.json` file handles routing and headers, but not domain management.

