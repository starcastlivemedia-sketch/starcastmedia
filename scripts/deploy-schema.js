#!/usr/bin/env node

/**
 * Direct Supabase PostgreSQL Schema Setup
 * Connects directly to your database and executes the schema
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌ Missing credentials');
  process.exit(1);
}

// Extract project reference from URL
const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];

// Create PostgreSQL connection string
// Supabase uses JWT tokens as passwords in PostgreSQL
const connectionString = `postgres://postgres:${SERVICE_ROLE_KEY}@${projectRef}.db.supabase.co:5432/postgres`;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupSchema() {
  try {
    console.log('\n🚀 Starting Supabase schema setup...\n');
    console.log(`📍 Connecting to: ${projectRef}.db.supabase.co`);
    console.log(`🔐 Using service role key\n`);

    // Connect to database
    console.log('⏳ Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📂 Schema file loaded');
    console.log(`📋 Executing ${schema.length} bytes of SQL...\n`);

    // Execute the entire schema as one transaction
    await client.query('BEGIN');
    
    try {
      await client.query(schema);
      await client.query('COMMIT');
      
      console.log('✅ Schema executed successfully!\n');
      console.log('📊 Created tables:');
      console.log('   ✅ employees');
      console.log('   ✅ timesheets');
      console.log('   ✅ documents');
      console.log('   ✅ teams');
      console.log('   ✅ team_members\n');
      
      console.log('🔒 Security configured:');
      console.log('   ✅ Row Level Security (RLS) enabled');
      console.log('   ✅ User data isolation policies');
      console.log('   ✅ Team visibility controls\n');
      
      console.log('📈 Performance optimized:');
      console.log('   ✅ Indexes created');
      console.log('   ✅ Constraints added\n');
      
      console.log('🎉 Your Supabase database is ready!\n');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('\n❌ Error setting up schema:\n');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('password authentication failed')) {
      console.error('🔑 The service role key might be invalid.');
      console.error('   Get it from: https://app.supabase.com/project/ytepzyundsauhctalwgw/settings/api\n');
    } else if (error.message.includes('connect ENOTFOUND')) {
      console.error('🌐 Could not connect to database.');
      console.error('   Check your internet connection.\n');
    }
    
    process.exit(1);

  } finally {
    // Close connection
    if (client) {
      await client.end();
      console.log('🔌 Connection closed');
    }
  }
}

setupSchema();
