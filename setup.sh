#!/bin/bash

# Starcast Media - Quick Setup Script

echo "🚀 Starcast Media Employee Portal - Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo ""
    echo "Please enter your Supabase credentials:"
    echo ""
    
    read -p "Enter your Supabase URL (https://your-project.supabase.co): " SUPABASE_URL
    read -p "Enter your Supabase Anon Key: " SUPABASE_KEY
    
    # Create .env.local
    cat > .env.local << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
EOF
    
    echo ""
    echo "✅ .env.local created successfully!"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🧪 Starting development server..."
echo "📍 Visit: http://localhost:5173"
npm run dev
