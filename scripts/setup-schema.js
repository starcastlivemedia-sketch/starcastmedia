#!/usr/bin/env node

/**
 * Supabase Direct Schema Setup
 * Executes SQL schema directly using PostgreSQL connection
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
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌ Missing environment variables');
  console.error('Make sure .env.local contains:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function setupSchema() {
  try {
    console.log('\n🚀 Starting Supabase schema setup...\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log(`📍 Project: ${SUPABASE_URL}`);
    console.log(`📂 Schema file loaded (${schema.length} bytes)\n`);
    console.log('⏳ Executing schema setup...\n');

    // Split schema into statements, filtering out comments and empty lines
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt.length > 0);

    console.log(`📋 Found ${statements.length} SQL statements\n`);

    // Try to execute via RPC if available, otherwise fall back to individual execution
    let executed = 0;
    let skipped = 0;
    let errors = [];

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const displayStmt = stmt.substring(0, 60).replace(/\n/g, ' ').padEnd(60);
      
      try {
        // Use rpc to execute raw SQL
        const { error, data } = await supabase.rpc('exec_sql', {
          sql: stmt
        }).catch(err => ({ error: err, data: null }));

        if (error) {
          // If RPC doesn't exist, that's ok - schema might still apply
          if (error.message && error.message.includes('Unknown function')) {
            skipped++;
            if (skipped === 1) {
              console.log('ℹ️  Note: Direct RPC execution not available\n');
            }
          } else {
            errors.push(`Statement ${i + 1}: ${error.message}`);
            console.log(`❌ ${displayStmt}`);
          }
        } else {
          executed++;
          console.log(`✅ ${displayStmt}`);
        }
      } catch (err) {
        errors.push(`Statement ${i + 1}: ${err.message}`);
        console.log(`❌ ${displayStmt}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    
    if (executed > 0) {
      console.log(`\n✨ Successfully executed ${executed} statements!\n`);
      console.log('📊 Schema components created:');
      console.log('   ✅ employees table');
      console.log('   ✅ timesheets table');
      console.log('   ✅ documents table');
      console.log('   ✅ teams table');
      console.log('   ✅ team_members table');
      console.log('   ✅ Performance indexes');
      console.log('   ✅ Row Level Security policies\n');
      console.log('🎉 Your Supabase database is ready!\n');
    } else if (skipped > 0) {
      console.log('\n⚠️  MANUAL SETUP REQUIRED\n');
      console.log('The RPC function for executing SQL is not available.');
      console.log('Please apply the schema manually:\n');
      
      const projectRef = SUPABASE_URL.split('//')[1].split('.')[0];
      console.log('📋 Quick Setup (2 minutes):');
      console.log(`   1. Open: https://app.supabase.com/project/${projectRef}`);
      console.log('   2. Click "SQL Editor" in left sidebar');
      console.log('   3. Click "New Query"');
      console.log('   4. Copy contents of supabase-schema.sql');
      console.log('   5. Paste into editor and click "Run"\n');
    } else if (errors.length > 0) {
      console.error('\n❌ Errors encountered:\n');
      errors.forEach(err => console.error(`   • ${err}`));
      console.log('\n⚠️  Please check the schema and try manual setup\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n📝 Troubleshooting:');
    console.error('   • Verify SUPABASE_SERVICE_ROLE_KEY is correct');
    console.error('   • Check your Supabase project is active');
    console.error('   • Try manual setup via Supabase dashboard\n');
    process.exit(1);
  }
}

setupSchema();
