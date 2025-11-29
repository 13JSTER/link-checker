import { supabase } from './supabase-config.js';

async function viewRecommendations() {
  console.log('\n📋 SCAN RECOMMENDATIONS\n');
  console.log('='.repeat(100));

  // Get all recommendations with scan info
  const { data, error } = await supabase
    .from('scan_recommendations')
    .select(`
      *,
      scans (
        id,
        url,
        status,
        risk_score,
        scanned_at
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (data.length === 0) {
    console.log('No recommendations found.');
    return;
  }

  // Group by scan
  const grouped = data.reduce((acc, rec) => {
    const scanId = rec.scan_id;
    if (!acc[scanId]) {
      acc[scanId] = {
        scan: rec.scans,
        recommendations: []
      };
    }
    acc[scanId].recommendations.push(rec);
    return acc;
  }, {});

  // Display each scan's recommendations
  Object.entries(grouped).forEach(([scanId, group], index) => {
    const scan = group.scan;
    console.log(`\n📊 Scan #${scanId}`);
    console.log(`   URL: ${scan.url}`);
    console.log(`   Status: ${scan.status} | Risk: ${scan.risk_score}%`);
    console.log(`   Scanned: ${new Date(scan.scanned_at).toLocaleString()}`);
    console.log(`   Recommendations: ${group.recommendations.length}`);
    console.log('-'.repeat(100));

    // Group recommendations by type
    const messages = group.recommendations.filter(r => r.message);
    const actions = group.recommendations.filter(r => r.action);
    const contexts = group.recommendations.filter(r => r.context);

    if (messages.length > 0) {
      console.log('\n   💡 MESSAGES:');
      messages.forEach(m => {
        console.log(`      ${m.message}`);
      });
    }

    if (actions.length > 0) {
      console.log('\n   ⚡ SUGGESTED ACTIONS:');
      actions.forEach(a => {
        console.log(`      • ${a.action}`);
      });
    }

    if (contexts.length > 0) {
      console.log('\n   🔍 TECHNICAL CONTEXT:');
      contexts.forEach(c => {
        console.log(`      ℹ️  ${c.context}`);
      });
    }

    if (index < Object.keys(grouped).length - 1) {
      console.log('\n' + '='.repeat(100));
    }
  });

  console.log('\n' + '='.repeat(100));
  console.log(`\n📊 Summary:`);
  console.log(`   Total scans with recommendations: ${Object.keys(grouped).length}`);
  console.log(`   Total recommendation entries: ${data.length}`);
  
  // Count by rating
  const ratings = data.reduce((acc, rec) => {
    acc[rec.rating] = (acc[rec.rating] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`\n   Breakdown by rating:`);
  Object.entries(ratings).forEach(([rating, count]) => {
    console.log(`      ${rating}: ${count}`);
  });
  console.log('');
}

viewRecommendations();
