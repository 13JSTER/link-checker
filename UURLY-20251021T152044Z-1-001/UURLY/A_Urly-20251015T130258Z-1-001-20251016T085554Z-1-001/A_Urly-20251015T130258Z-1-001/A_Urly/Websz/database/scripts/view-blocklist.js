import { supabase } from './supabase-config.js';

async function viewBlocklist() {
  const { data, error } = await supabase
    .from('blocklist')
    .select('*')
    .order('entry_type');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('\n📋 BLOCKLIST ENTRIES:\n');
  console.log('='.repeat(80));

  let lastType = '';
  data.forEach(d => {
    if (d.entry_type !== lastType) {
      console.log(`\n${d.entry_type.toUpperCase()}S:`);
      console.log('-'.repeat(80));
      lastType = d.entry_type;
    }
    console.log(`  ✓ ${d.value}`);
    console.log(`    Reason: ${d.reason}`);
    console.log(`    Added by: ${d.added_by} | Active: ${d.is_active}`);
    console.log('');
  });

  console.log('='.repeat(80));
  console.log(`✨ Total: ${data.length} active entries\n`);

  // Group by type
  const grouped = data.reduce((acc, item) => {
    acc[item.entry_type] = (acc[item.entry_type] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 Breakdown by type:');
  Object.entries(grouped).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });
  console.log('');
}

viewBlocklist();
