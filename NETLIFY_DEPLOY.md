# Netlify Deployment Guide - Starcast Media Employee Portal

## Overview
This guide will deploy your employee portal to Netlify with a custom domain.

## Prerequisites
✅ GitHub account  
✅ Netlify account (create at netlify.com)  
✅ Supabase project with credentials  
✅ Domain with DNS access (Squarespace)

---

## Step 1: Push Code to GitHub

First, initialize git and push your code to GitHub:

```bash
cd /workspaces/starcastmedia

# Initialize git repo (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Starcast Media Employee Portal with Supabase auth"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/starcastmedia.git

# Push to GitHub
git branch -M main
git push -u origin main
```

After pushing, verify your code is on GitHub by visiting:
`https://github.com/YOUR_USERNAME/starcastmedia`

---

## Step 2: Connect GitHub to Netlify

### Option A: Using Netlify UI (Easiest)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"GitHub"** to connect your GitHub account
4. Search for and select **`starcastmedia`** repository
5. Click **"Deploy site"**

Netlify will automatically:
- Build your project (`npm run build`)
- Deploy to `starcastmedia.netlify.app`
- Create a preview deployment

### Option B: Using Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from your project directory
cd /workspaces/starcastmedia
netlify deploy

# For production deployment
netlify deploy --prod
```

---

## Step 3: Add Environment Variables in Netlify

Your Supabase credentials need to be in Netlify.

### Get Your Supabase Credentials:

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key

### Add to Netlify:

1. In Netlify dashboard, go to your site
2. Click **"Site settings"** → **"Build & deploy"** → **"Environment"**
3. Click **"Edit variables"**
4. Add two new variables:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project.supabase.co`
   
   And:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `your_anon_key_here`

5. Click **"Save"**
6. **Redeploy** your site (Deployments → Trigger deploy)

---

## Step 4: Connect Custom Domain (employee.starcast.only)

### In Netlify:

1. Site settings → **"Domain management"**
2. Click **"Add custom domain"**
3. Enter: `employee.starcast.only`
4. Click **"Verify"**
5. Netlify will show you the DNS records to add

### In Squarespace DNS Settings:

1. Go to your Squarespace account
2. Navigate to Domains → **Your Domain** → **DNS Settings** (or Advanced DNS)
3. Look for DNS records section
4. Add the CNAME record Netlify provided:
   - **Type:** CNAME
   - **Host/Name:** `employee`
   - **Value/Points to:** `xxxxx.netlify.app` (from Netlify)
   - **TTL:** 3600 (default)

5. Save the DNS record
6. Wait 24-48 hours for DNS to propagate

### Verify DNS is Working:

1. Use an online DNS checker: https://www.nslookup.io/
2. Search for `employee.starcast.only`
3. It should show it points to Netlify

---

## Step 5: Configure Supabase CORS

Allow requests from your new domain:

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Settings → **API** → **CORS**
4. Add these origins:
   - `https://employee.starcast.only`
   - `https://www.employee.starcast.only`
   - `https://starcastmedia.netlify.app` (for testing before domain setup)

5. Click **"Save"**

---

## Step 6: Test Your Deployment

### Before Domain is Ready:
Visit your Netlify subdomain:
`https://starcastmedia.netlify.app`

You should see:
- Login page
- Ability to signup
- Redirects to dashboard when logged in

### After Domain is Ready (24-48 hours):
Visit your custom domain:
`https://employee.starcast.only`

Should work identically to the Netlify subdomain.

---

## Troubleshooting

### "Cannot find module" or build errors

**Solution:**
- Make sure you pushed the latest code to GitHub
- In Netlify: **Deployments** → **Trigger deploy** (this rebuilds from GitHub)
- Check build logs in Netlify dashboard

### Environment variables not working

**Solution:**
- Verify variables are set in **Site settings** → **Build & deploy** → **Environment**
- After adding/changing variables, must redeploy
- Check build logs to confirm variables are loaded

### Authentication not working

**Solution:**
- Verify Supabase credentials are correct
- Check CORS settings in Supabase (allow your domain)
- Check browser console for errors (F12 → Console tab)

### Domain not working (still shows Netlify subdomain)

**Solution:**
- DNS changes take 24-48 hours
- Verify DNS record is added correctly in Squarespace
- Use https://www.nslookup.io/ to check DNS
- Check Netlify domain settings - should show "DNS configured correctly"

### Build fails on Netlify

**Solution:**
- Check build logs in Netlify dashboard
- Common fixes:
  - Ensure `.env.example` has correct variable names
  - Check `package.json` has all dependencies
  - Try: `npm install && npm run build` locally first

---

## What Happens on Each Deployment

When you push code to GitHub:
1. Netlify automatically detects the push
2. Runs `npm install`
3. Runs `npm run build` (creates `dist/` folder)
4. Deploys `dist/` folder to Netlify servers
5. Site is live at `employee.starcast.only`

---

## Redeploy Without Code Changes

Sometimes you need to redeploy (e.g., after adding env vars):

**In Netlify Dashboard:**
1. Go to **Deployments**
2. Click the latest deployment
3. Click **"Redeploy"**

Or via CLI:
```bash
netlify deploy --prod
```

---

## View Deployment Status

### Live Deployments:
Netlify Dashboard → **Deployments**

### View Logs:
Netlify Dashboard → **Deployments** → Click any deployment → **Deploy log**

### Monitor Performance:
Netlify Dashboard → **Analytics**

---

## Security Notes

✅ Do NOT commit `.env.local` to GitHub  
✅ Environment variables are private in Netlify  
✅ The `anon key` is safe (it's public, only users can read data)  
✅ Supabase Row Level Security (RLS) protects your database  
✅ HTTPS is automatic on all Netlify sites

---

## Next Steps After Deployment

1. ✅ Test signup and login on your domain
2. Create test employees in Supabase
3. Configure Supabase tables:
   - `employees` - for employee profiles
   - `timesheets` - for time tracking
   - `documents` - for file storage
4. Set up Row Level Security (RLS) policies
5. Connect employee data to dashboard

---

## Quick Reference

| What | Where |
|------|-------|
| Deploy logs | Netlify Dashboard → Deployments |
| Environment vars | Site Settings → Build & deploy → Environment |
| Domain settings | Site Settings → Domain management |
| GitHub connection | Site Settings → Build & deploy → Source |
| View live site | `https://employee.starcast.only` |

---

## Support & Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com/)

---

**Your site should be live at `https://employee.starcast.only` within 48 hours!** 🚀
