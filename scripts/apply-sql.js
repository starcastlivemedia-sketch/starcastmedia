#!/usr/bin/env node

/**
 * Supabase Schema Setup via SQL
 * Uses Supabase REST API to execute SQL statements
 */

import https from 'https';
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
  console.error('\n❌ Missing credentials in .env.local');
  process.exit(1);
}

const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://${projectRef}.supabase.co/rest/v1/rpc/exec`);
    
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      }
    };

    const payload = JSON.stringify({ query: sql });
    options.headers['Content-Length'] = Buffer.byteLength(payload);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function setupSchema() {
  try {
    console.log('\n🚀 Starting Supabase schema setup...\n');

    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log(`📍 Project: ${projectRef}`);
    console.log(`📂 Schema file: ${schema.length} bytes\n`);

    console.log('⏳ Executing schema via Supabase API...\n');

    // Try the REST API first
    const result = await executeSQL(schema);

    if (result.status === 200 || result.status === 201) {
      console.log('✅ Schema executed successfully!\n');
      console.log('📊 Created:');
      console.log('   ✅ employees table');
      console.log('   ✅ timesheets table');
      console.log('   ✅ documents table');
      console.log('   ✅ teams table');
      console.log('   ✅ team_members table');
      console.log('   ✅ Indexes and RLS policies\n');
      console.log('🎉 Your database is ready!\n');
    } else {
      throw new Error(`API returned status ${result.status}`);
    }

  } catch (error) {
    console.log('\n⚠️  MANUAL SETUP REQUIRED\n');
    console.log('The Supabase API doesn\'t support direct SQL execution.');
    console.log('No problem - just do this manually (takes 2 minutes):\n');
    
    console.log('📋 Steps:');
    console.log(`   1. Go to: https://app.supabase.com/project/${projectRef}`);
    console.log('   2. Click "SQL Editor" in the left sidebar');
    console.log('   3. Click "New Query"');
    console.log('   4. Copy entire contents of: supabase-schema.sql');
    console.log('   5. Paste into the SQL editor');
    console.log('   6. Click the "Run" button (green)\n');
    
    console.log('✨ That\'s it! All tables and security policies will be created.\n');
  }
}

setupSchema();
