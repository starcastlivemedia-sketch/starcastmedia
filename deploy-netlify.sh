#!/bin/bash

# Netlify Deployment Script for Starcast Media

echo "🚀 Starcast Media - Netlify Deployment Setup"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📝 Configuring Git user (if not already done)..."
git config user.email "dev@starcast.media" 2>/dev/null || echo "   (You may need to configure git user)"
git config user.name "Starcast Dev" 2>/dev/null || echo "   (You may need to configure git user)"

echo ""
echo "📤 Staging all files..."
git add .

echo ""
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Starcast Media Employee Portal with Supabase auth" || echo "   (Files may already be committed)"

echo ""
echo "🔗 Checking remote..."
if git remote get-url origin &>/dev/null; then
    echo "✅ GitHub remote already configured"
    echo "   Remote URL: $(git remote get-url origin)"
else
    echo "⚠️  GitHub remote not configured yet"
    echo ""
    echo "Next steps to connect to GitHub:"
    echo "1. Create a new repository on GitHub at https://github.com/new"
    echo "2. Name it: starcastmedia"
    echo "3. Then run:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/starcastmedia.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
fi

echo ""
echo "✅ Git setup complete!"
echo ""
echo "Next: Connect to Netlify"
echo "1. Go to https://netlify.com"
echo "2. Click 'Add new site' → 'Import an existing project'"
echo "3. Select GitHub and choose 'starcastmedia' repository"
echo "4. Set environment variables:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
