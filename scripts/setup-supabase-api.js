#!/usr/bin/env node

/**
 * Direct Supabase API Schema Setup
 * Uses Supabase REST API to execute SQL directly
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

if (!SUPABASE_URL) {
  console.error('❌ Error: VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('\n📝 To get your Service Role Key:');
  console.error('   1. Go to https://app.supabase.com/project/_/settings/api');
  console.error('   2. Find "Service Role" key');
  console.error('   3. Add to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_key_here\n');
  process.exit(1);
}

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      }
    };

    if (data) {
      const payload = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function setupSchema() {
  try {
    console.log('🚀 Starting Supabase schema setup...\n');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📂 Schema file loaded');
    console.log(`📍 Project URL: ${SUPABASE_URL}\n`);

    // Try to execute schema using REST API
    console.log('⏳ Attempting to apply schema via Supabase API...\n');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('\n--'));

    let successCount = 0;
    let failCount = 0;

    for (const statement of statements) {
      try {
        // Try using the RPC endpoint if available
        const response = await makeRequest('POST', '/rest/v1/rpc/exec_sql', {
          sql: statement
        });

        if (response.status === 200 || response.status === 201) {
          successCount++;
          const display = statement.substring(0, 50).replace(/\n/g, ' ');
          console.log(`✅ ${display}...`);
        } else if (response.status === 404) {
          // RPC function doesn't exist, skip
          if (failCount === 0) {
            console.log('⚠️  Note: RPC execution not available\n');
          }
        } else if (response.status !== 400) {
          failCount++;
          console.log(`❌ Failed to execute: ${statement.substring(0, 50)}`);
          console.log(`   Status: ${response.status}\n`);
        }
      } catch (error) {
        failCount++;
        console.log(`❌ Error executing statement: ${error.message}\n`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n⚠️  MANUAL SETUP REQUIRED\n');
    console.log('The Supabase API doesn\'t support direct SQL execution.');
    console.log('Please apply the schema manually:\n');
    
    console.log('📋 Steps:');
    console.log('   1. Open your Supabase Dashboard');
    const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];
    console.log(`   2. Go to: https://app.supabase.com/project/${projectRef}`);
    console.log('   3. Click "SQL Editor" in the left sidebar');
    console.log('   4. Click "New Query"');
    console.log('   5. Copy the entire contents of supabase-schema.sql');
    console.log('   6. Paste into the editor');
    console.log('   7. Click "Run"\n');

    console.log('💡 Or use the Supabase CLI:');
    console.log('   npm install -g @supabase/cli');
    console.log('   supabase link --project-ref ' + projectRef);
    console.log('   supabase db push\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupSchema();
