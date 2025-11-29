// Test Database Connection Script
import * as db from './db-config.js';

async function main() {
  console.log('\n🔍 Testing database connection...\n');
  console.log('Database: urly');
  console.log('Host: localhost');
  console.log('User: root\n');
  
  const connected = await db.testConnection();
  
  if (connected) {
    console.log('\n✅ SUCCESS: Database is ready to use!\n');
    
    // Show existing tables
    try {
      const connection = await db.getConnection();
      const [tables] = await connection.query('SHOW TABLES');
      
      if (tables.length > 0) {
        console.log('📋 Existing tables:');
        tables.forEach((table, index) => {
          console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
        });
      } else {
        console.log('📋 No tables found. Database is empty.');
      }
    } catch (error) {
      console.error('Error fetching tables:', error.message);
    }
  } else {
    console.log('\n❌ FAILED: Could not connect to database.');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Verify database "urly" exists');
    console.log('3. Check password is correct: 200313');
    console.log('4. Ensure user "root" has access');
  }
  
  await db.closeConnection();
  process.exit(0);
}

main();
