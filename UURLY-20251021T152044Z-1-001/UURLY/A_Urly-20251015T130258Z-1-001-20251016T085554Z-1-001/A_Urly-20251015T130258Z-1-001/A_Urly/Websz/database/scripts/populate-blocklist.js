import { supabase } from './supabase-config.js';
import { readFileSync } from 'fs';

async function populateBlocklist() {
  console.log('📋 Populating Supabase blocklist...\n');

  // Common malicious domains to add
  const commonMalicious = [
    // Phishing/Scam domains
    { type: 'hostname', value: 'smartki.help', reason: 'Known phishing site - fake rewards' },
    { type: 'url', value: 'https://smartki.help/rewards', reason: 'Phishing page - fake rewards scam' },
    
    // Test malware domains (safe to add, won't resolve)
    { type: 'hostname', value: 'malware-test-site.com', reason: 'Test malware domain' },
    { type: 'hostname', value: 'phishing-test-site.com', reason: 'Test phishing domain' },
    { type: 'hostname', value: 'example-scam.tk', reason: 'Example scam site with suspicious TLD' },
    { type: 'hostname', value: 'fake-bank-login.ml', reason: 'Fake banking phishing site' },
    
    // Known bad TLDs patterns (we'll store as domain patterns)
    { type: 'pattern', value: '*.tk', reason: 'High-risk TLD commonly used in scams' },
    { type: 'pattern', value: '*.ml', reason: 'High-risk TLD commonly used in scams' },
    { type: 'pattern', value: '*.ga', reason: 'High-risk TLD commonly used in scams' },
    { type: 'pattern', value: '*.cf', reason: 'High-risk TLD commonly used in scams' },
    { type: 'pattern', value: '*.gq', reason: 'High-risk TLD commonly used in scams' },
  ];

  // Read local denylist file
  try {
    const localDenylist = readFileSync('./feeds/local-denylist.txt', 'utf-8');
    const lines = localDenylist.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      // Determine if it's a URL or domain
      const isUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://');
      const type = isUrl ? 'url' : 'hostname';  // Changed from 'domain' to 'hostname'
      
      // Check if already in our list
      const exists = commonMalicious.some(m => m.value === trimmed);
      if (!exists) {
        commonMalicious.push({
          type: type,
          value: trimmed,
          reason: 'From local denylist'
        });
      }
    }
    console.log(`✅ Loaded ${lines.length} entries from local-denylist.txt`);
  } catch (err) {
    console.log('⚠️  No local denylist file found, using defaults only');
  }

  // Insert into Supabase
  let successCount = 0;
  let errorCount = 0;

  for (const entry of commonMalicious) {
    const { data, error } = await supabase
      .from('blocklist')
      .insert({
        entry_type: entry.type,
        value: entry.value,
        reason: entry.reason,
        added_by: 'system',
        is_active: true
      });

    if (error) {
      // Check if it's a duplicate
      if (error.code === '23505') {
        console.log(`⏭️  Skipped (duplicate): ${entry.value}`);
      } else {
        console.log(`❌ Error adding ${entry.value}:`, error.message);
        errorCount++;
      }
    } else {
      console.log(`✅ Added: ${entry.type} - ${entry.value}`);
      successCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total entries processed: ${commonMalicious.length}`);

  // Show final count
  const { data: finalData } = await supabase
    .from('blocklist')
    .select('*', { count: 'exact' });
  
  console.log(`\n✨ Blocklist now contains ${finalData?.length || 0} active entries\n`);
  
  // Show sample entries
  console.log('📋 Sample entries:');
  if (finalData && finalData.length > 0) {
    finalData.slice(0, 5).forEach(entry => {
      console.log(`   ${entry.entry_type}: ${entry.value}`);
      console.log(`      Reason: ${entry.reason}`);
    });
  }
}

// Run the population
populateBlocklist().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
