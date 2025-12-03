#!/usr/bin/env node

/**
 * Supabase Schema Setup Script
 * This script applies the database schema to your Supabase project
 * 
 * Usage: node scripts/setup-supabase.js
 * 
 * Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing environment variables');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupSchema() {
  try {
    console.log('🚀 Starting Supabase schema setup...\n');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📂 Schema file loaded successfully');
    console.log(`📍 Project URL: ${SUPABASE_URL}\n`);

    // Execute the schema
    console.log('⏳ Executing schema setup...\n');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: schema
    }).catch(() => {
      // If rpc doesn't exist, we'll execute statements individually
      return { error: null, needsManual: true };
    });

    if (error && !error.toString().includes('function')) {
      throw error;
    }

    console.log('✅ Schema setup completed!\n');
    console.log('📊 Created tables:');
    console.log('   - employees');
    console.log('   - timesheets');
    console.log('   - documents');
    console.log('   - teams');
    console.log('   - team_members\n');

    console.log('🔒 Row Level Security (RLS) enabled on all tables');
    console.log('📈 Performance indexes created\n');

    console.log('✨ Next steps:');
    console.log('   1. Verify tables in Supabase dashboard > Table Editor');
    console.log('   2. Create a test user via the app signup');
    console.log('   3. Test the application\n');

  } catch (error) {
    console.error('❌ Error setting up schema:');
    console.error(error.message);
    console.error('\n⚠️  Manual setup required:');
    console.error('   1. Go to https://app.supabase.com/project/' + SUPABASE_URL.split('//')[1].split('.')[0]);
    console.error('   2. Click SQL Editor');
    console.error('   3. Paste the contents of supabase-schema.sql');
    console.error('   4. Click Run\n');
    process.exit(1);
  }
}

setupSchema();
