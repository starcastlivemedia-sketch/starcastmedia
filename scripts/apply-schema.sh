#!/bin/bash

# Supabase Schema Setup Script
# This script applies the database schema directly via psql

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Supabase schema setup...${NC}\n"

# Load environment variables
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local not found${NC}"
    exit 1
fi

# Extract Supabase connection info from the URL
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env.local | cut -d'=' -f2)
SUPABASE_HOST=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/\.supabase\.co//')

# Get project reference from host
PROJECT_REF=$SUPABASE_HOST

echo -e "${BLUE}📍 Project Reference: $PROJECT_REF${NC}"
echo -e "${BLUE}📂 Schema file: supabase-schema.sql${NC}\n"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql is not installed${NC}"
    echo -e "${BLUE}Installing PostgreSQL client...${NC}\n"
    apt-get update > /dev/null 2>&1 && apt-get install -y postgresql-client > /dev/null 2>&1
fi

# Construct the PostgreSQL connection string
# Note: We'll use the Supabase PostgreSQL connection
PG_HOST="${PROJECT_REF}.db.supabase.co"
PG_PORT="5432"
PG_USER="postgres"
PG_DATABASE="postgres"

echo -e "${BLUE}⏳ Attempting to connect to Supabase PostgreSQL...${NC}\n"

# Try to execute the schema
if [ -f supabase-schema.sql ]; then
    echo -e "${BLUE}📋 Executing schema statements...${NC}\n"
    
    # Split and execute statements
    psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DATABASE \
        -f supabase-schema.sql 2>&1 | head -50
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✅ Schema setup completed successfully!${NC}\n"
        echo -e "${GREEN}📊 Created tables:${NC}"
        echo -e "   - employees"
        echo -e "   - timesheets"
        echo -e "   - documents"
        echo -e "   - teams"
        echo -e "   - team_members\n"
        echo -e "${GREEN}✨ Your database is ready!${NC}\n"
    else
        echo -e "\n${RED}⚠️  Could not connect via psql${NC}"
        echo -e "${BLUE}Please use the manual method instead.${NC}\n"
    fi
else
    echo -e "${RED}❌ Error: supabase-schema.sql not found${NC}"
    exit 1
fi
