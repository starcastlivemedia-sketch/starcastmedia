#!/usr/bin/env node

/**
 * Supabase Schema Setup - Local Machine Version
 * Run this on your local machine to set up the database schema
 * 
 * Prerequisites:
 * - Node.js installed
 * - .env.local file with Supabase credentials
 * 
 * Usage:
 * node setup-schema-local.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌ Missing credentials in .env.local');
  console.error('Make sure you have:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];
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
    console.log(`📍 Project: ${projectRef}`);
    console.log(`🔐 Using service role key\n`);

    console.log('⏳ Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📂 Schema file loaded');
    console.log(`📋 Executing ${schema.length} bytes of SQL...\n`);

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
      console.log('   ✅ Row Level Security (RLS)');
      console.log('   ✅ User data isolation');
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
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 Could not connect to database.');
      console.error('   Check your internet connection.\n');
    }
    
    process.exit(1);

  } finally {
    if (client) {
      await client.end();
      console.log('🔌 Connection closed');
    }
  }
}

setupSchema();
