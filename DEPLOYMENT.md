# Starcast Media Employee Portal - Deployment Guide

## Overview
This guide will help you deploy the employee portal to Vercel and connect it to your custom domain.

## Prerequisites
- Supabase account with a project created
- GitHub account (to connect with Vercel)
- Squarespace domain with DNS access
- Vercel account (free)

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Employee portal with auth"
git remote add origin https://github.com/YOUR_USERNAME/starcastmedia.git
git push -u origin main
```

## Step 2: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (your VITE_SUPABASE_URL)
   - **anon public key** (your VITE_SUPABASE_ANON_KEY)

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy from project directory
cd /workspaces/starcastmedia
vercel
```

When prompted:
- Set up and deploy? → **Yes**
- Which scope? → Select your personal account
- Link to existing project? → **No** (or yes if you created one)
- Project name → `starcastmedia` (or your preferred name)
- Directory → `./` (current directory)

### Option B: Connect GitHub to Vercel (Better for auto-deployments)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `starcastmedia` repository
5. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

## Step 4: Add Environment Variables in Vercel

1. In Vercel dashboard, go to your project
2. Settings → Environment Variables
3. Add:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

## Step 5: Configure Custom Domain

### In Vercel:
1. Project Settings → Domains
2. Click "Add Domain"
3. Enter: `employee.starcast.only`
4. Copy the DNS records Vercel provides

### In Squarespace DNS Settings:
1. Go to your Squarespace domain settings
2. Navigate to **DNS Settings** or **Advanced DNS**
3. Add the CNAME record Vercel provided:
   - **Type:** CNAME
   - **Host:** `employee`
   - **Value:** `cname.vercel-dns.com` (or whatever Vercel shows)
4. Wait 24-48 hours for DNS to propagate

## Step 6: Configure Supabase CORS

Your Supabase project needs to allow requests from your new domain:

1. Go to Supabase Dashboard
2. Settings → API → CORS
3. Add allowed origins:
   - `https://employee.starcast.only`
   - `https://www.employee.starcast.only`

## Step 7: Verify Deployment

1. Visit `https://employee.starcast.only`
2. You should see the login page
3. Try signing up with a test email
4. Check that Supabase auth is working

## Troubleshooting

### "Cannot find module" errors
- Make sure all dependencies are installed: `npm install`
- Check that environment variables are set in Vercel

### Authentication not working
- Verify Supabase credentials in Vercel environment variables
- Check CORS settings in Supabase dashboard
- Check browser console for specific errors

### DNS not resolving
- DNS changes can take 24-48 hours
- Use online DNS checker: https://www.nslookup.io/
- Search for `employee.starcast.only`

### HTTPS/SSL issues
- Vercel provides free SSL automatically
- Wait a few minutes after adding domain for cert to generate
- Clear browser cache and try again

## Local Development

To test with your Supabase credentials locally:

1. Create `.env.local` in project root:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Run: `npm run dev`

3. Visit: `http://localhost:5173`

## Environment Variables Needed

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Never commit `.env.local` to git. It's already in `.gitignore`.

## Security Notes

- The anon key is public-facing (used in frontend) - this is safe
- Always use Supabase Row Level Security (RLS) for sensitive data
- Never commit real credentials to git
- Keep sensitive server keys on backend only

## Next Steps

After deployment:
1. Set up email authentication in Supabase (SMTP)
2. Configure password reset emails
3. Add user profile data to Supabase
4. Set up Row Level Security policies
5. Connect timesheet/document storage to Supabase tables

## Support

For issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- Check browser DevTools Console for errors
