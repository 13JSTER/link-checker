// Verify all Supabase tables have data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllTables() {
  console.log('🔍 Checking Supabase Database Tables...\n');
  
  // 1. Check scans table
  console.log('📊 SCANS TABLE:');
  const { data: scans, error: scanError } = await supabase
    .from('scans')
    .select('id, url, safety_score, status')
    .order('scanned_at', { ascending: false })
    .limit(5);
  
  if (scanError) {
    console.log(`   ❌ Error: ${scanError.message}`);
  } else {
    console.log(`   ✅ ${scans.length} recent scans found`);
    scans.forEach(s => console.log(`      - ${s.url} (${s.status}, ${s.safety_score}%)`));
  }
  
  // 2. Check blocklist table
  console.log('\n🚫 BLOCKLIST TABLE:');
  const { data: blocklist, error: blockError } = await supabase
    .from('blocklist')
    .select('*')
    .eq('is_active', true)
    .limit(5);
  
  if (blockError) {
    console.log(`   ❌ Error: ${blockError.message}`);
  } else {
    console.log(`   ✅ ${blocklist.length} entries found`);
    blocklist.forEach(b => console.log(`      - ${b.entry_type}: ${b.value}`));
  }
  
  // 3. Check configuration table
  console.log('\n⚙️  CONFIGURATION TABLE:');
  const { data: config, error: configError } = await supabase
    .from('configuration')
    .select('*')
    .order('config_key', { ascending: true })
    .limit(5);
  
  if (configError) {
    console.log(`   ❌ Error: ${configError.message}`);
  } else {
    console.log(`   ✅ ${config.length} settings found`);
    config.forEach(c => console.log(`      - ${c.config_key} = ${c.config_value}`));
  }
  
  // 4. Check scan_statistics table
  console.log('\n📈 SCAN_STATISTICS TABLE:');
  const { data: stats, error: statsError } = await supabase
    .from('scan_statistics')
    .select('*')
    .order('stat_date', { ascending: false })
    .limit(3);
  
  if (statsError) {
    console.log(`   ❌ Error: ${statsError.message}`);
  } else {
    console.log(`   ✅ ${stats.length} stats records found`);
    stats.forEach(s => console.log(`      - ${s.stat_date}: ${s.total_scans} scans`));
  }
  
  // 5. Check scan_recommendations table
  console.log('\n💡 SCAN_RECOMMENDATIONS TABLE:');
  const { data: recs, error: recError } = await supabase
    .from('scan_recommendations')
    .select('*')
    .limit(3);
  
  if (recError) {
    console.log(`   ❌ Error: ${recError.message}`);
  } else {
    console.log(`   ✅ ${recs ? recs.length : 0} recommendations found`);
  }
  
  // Security check
  console.log('\n\n🔒 SECURITY STATUS:');
  console.log('   ⚠️  All tables show "Unrestricted" in Supabase UI');
  console.log('   ℹ️  This means Row Level Security (RLS) is NOT enabled');
  console.log('   ⚠️  Anyone with your API key can read/write all data');
  console.log('   💡 Recommendation: Enable RLS policies for production\n');
}

checkAllTables();
