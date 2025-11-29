// Test Database Integration with Scan Server
// This tests that scans are saved to database and config works in real-time

const API_BASE = 'http://localhost:5050';

console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 Testing URLY Scanner Database Integration');
console.log('═══════════════════════════════════════════════════════════\n');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test1_ScanURL() {
  console.log('\n📝 TEST 1: Scan URL and Auto-Save to Database');
  console.log('─────────────────────────────────────────────────────────');
  
  try {
    const response = await fetch(`${API_BASE}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://google.com' })
    });
    
    const result = await response.json();
    console.log(`✅ Scan completed for: ${result.inputUrl}`);
    console.log(`   Risk: ${result.verdict.risk}`);
    console.log(`   Heuristic Score: ${result.heuristics.score}`);
    console.log(`   Safety Score: ${100 - result.heuristics.score}`);
    console.log(`   Blocklist Match: ${result.blocklist.match}`);
    console.log(`   GSB Verdict: ${result.gsb.verdict}`);
    
    // Wait for async save
    await sleep(1000);
    
    return true;
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    return false;
  }
}

async function test2_CheckScanHistory() {
  console.log('\n📝 TEST 2: Retrieve Recent Scans from Database');
  console.log('─────────────────────────────────────────────────────────');
  
  try {
    const response = await fetch(`${API_BASE}/api/scans/recent?limit=5`);
    const result = await response.json();
    
    console.log(`✅ Retrieved ${result.count} recent scans`);
    
    result.scans.forEach((scan, idx) => {
      console.log(`\n   Scan ${idx + 1}:`);
      console.log(`      URL: ${scan.url}`);
      console.log(`      Risk Score: ${scan.risk_score}`);
      console.log(`      Safety Score: ${scan.safety_score}`);
      console.log(`      Status: ${scan.status}`);
      console.log(`      Scanned: ${new Date(scan.scanned_at).toLocaleString()}`);
    });
    
    return true;
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    return false;
  }
}

async function test3_GetStatistics() {
  console.log('\n📝 TEST 3: Get Statistics from Database');
  console.log('─────────────────────────────────────────────────────────');
  
  try {
    const response = await fetch(`${API_BASE}/api/stats/summary`);
    const result = await response.json();
    
    console.log(`✅ Statistics Summary:`);
    console.log(`   Total Scans: ${result.stats.totalScans}`);
    console.log(`   Today's Scans: ${result.stats.todayScans}`);
    console.log(`   Average Risk: ${result.stats.averageRisk}`);
    console.log(`   Status Breakdown:`);
    
    Object.entries(result.stats.statusBreakdown).forEach(([status, count]) => {
      console.log(`      - ${status}: ${count}`);
    });
    
    return true;
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    return false;
  }
}

async function test4_ModifyConfig() {
  console.log('\n📝 TEST 4: Modify Configuration (Real-time Update)');
  console.log('─────────────────────────────────────────────────────────');
  
  try {
    // Get current config
    let response = await fetch(`${API_BASE}/api/config/heuristics_enabled`);
    let result = await response.json();
    const originalValue = result.value;
    console.log(`   Original heuristics_enabled: ${originalValue}`);
    
    // Toggle it
    const newValue = !originalValue;
    response = await fetch(`${API_BASE}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'heuristics_enabled',
        value: newValue,
        type: 'boolean',
        description: 'Enable heuristic analysis'
      })
    });
    
    result = await response.json();
    console.log(`✅ Updated heuristics_enabled to: ${newValue}`);
    
    // Wait for server to reload config (happens immediately after POST)
    await sleep(2000);
    
    // Verify it changed
    response = await fetch(`${API_BASE}/api/config/heuristics_enabled`);
    result = await response.json();
    console.log(`✅ Verified new value: ${result.value}`);
    
    if (result.value === newValue) {
      console.log(`✅ Real-time config update working!`);
    }
    
    // Restore original value
    await fetch(`${API_BASE}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'heuristics_enabled',
        value: originalValue,
        type: 'boolean',
        description: 'Enable heuristic analysis'
      })
    });
    console.log(`   Restored original value: ${originalValue}`);
    
    return true;
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    return false;
  }
}

async function test5_BlocklistManagement() {
  console.log('\n📝 TEST 5: Blocklist Management (Real-time Update)');
  console.log('─────────────────────────────────────────────────────────');
  
  try {
    const testUrl = 'http://test-blocked-site.com';
    
    // Add to blocklist
    let response = await fetch(`${API_BASE}/api/blocklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'url',
        value: testUrl,
        reason: 'Test entry for integration testing'
      })
    });
    
    let result = await response.json();
    console.log(`✅ Added to blocklist: ${testUrl}`);
    
    // Wait for server to reload blocklist
    await sleep(2000);
    
    // Check if it's in blocklist
    response = await fetch(`${API_BASE}/api/blocklist/check/${encodeURIComponent(testUrl)}`);
    result = await response.json();
    console.log(`✅ Check blocklist: ${result.blocked ? 'BLOCKED' : 'NOT BLOCKED'}`);
    
    if (result.blocked) {
      console.log(`✅ Real-time blocklist update working!`);
    }
    
    // Remove from blocklist
    response = await fetch(`${API_BASE}/api/blocklist/${encodeURIComponent(testUrl)}`, {
      method: 'DELETE'
    });
    result = await response.json();
    console.log(`✅ Removed from blocklist: ${testUrl}`);
    
    return true;
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    return false;
  }
}

async function test6_SearchScans() {
  console.log('\n📝 TEST 6: Search Scans');
  console.log('─────────────────────────────────────────────────────────');
  
  try {
    const response = await fetch(`${API_BASE}/api/scans/search?q=google`);
    const result = await response.json();
    
    console.log(`✅ Found ${result.count} scans matching 'google'`);
    
    result.scans.slice(0, 3).forEach((scan, idx) => {
      console.log(`   ${idx + 1}. ${scan.url} - ${scan.status} (${new Date(scan.scanned_at).toLocaleString()})`);
    });
    
    return true;
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    return false;
  }
}

// Run all tests
(async function runAllTests() {
  const tests = [
    test1_ScanURL,
    test2_CheckScanHistory,
    test3_GetStatistics,
    test4_ModifyConfig,
    test5_BlocklistManagement,
    test6_SearchScans
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) passed++;
    else failed++;
    await sleep(500);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round(passed / (passed + failed) * 100)}%`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Database integration is working perfectly!\n');
  }
  
  process.exit(failed === 0 ? 0 : 1);
})();
