// Check if the last scan (github.com) was saved to database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestScan() {
  console.log('🔍 Checking if latest scan saved to database...\n');
  
  const { data: scans, error } = await supabase
    .from('scans')
    .select('*')
    .order('scanned_at', { ascending: false })
    .limit(1);
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  if (scans && scans.length > 0) {
    const latest = scans[0];
    console.log('✅ Latest scan in database:');
    console.log(`   URL: ${latest.url}`);
    console.log(`   Hostname: ${latest.hostname}`);
    console.log(`   Safety Score: ${latest.safety_score}%`);
    console.log(`   Status: ${latest.status}`);
    console.log(`   Risk Score: ${latest.risk_score}`);
    console.log(`   Scanned At: ${latest.scanned_at}`);
    console.log(`   GSB Verdict: ${latest.gsb_verdict}`);
    console.log(`   Heuristic Score: ${latest.heuristic_score}`);
  } else {
    console.log('❌ No scans found in database');
  }
}

checkLatestScan();
