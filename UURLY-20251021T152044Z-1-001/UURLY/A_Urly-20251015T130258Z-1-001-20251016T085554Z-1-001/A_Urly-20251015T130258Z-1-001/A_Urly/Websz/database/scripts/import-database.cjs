/**
 * Database Import Tool
 * Imports the URLY database from SQL file
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// UPDATE THESE SETTINGS FOR YOUR ENVIRONMENT
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',  // Add your MySQL password here
  multipleStatements: true  // Required for importing SQL dumps
};

async function importDatabase(sqlFile) {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL');
    
    // Check if file exists
    try {
      await fs.access(sqlFile);
    } catch (error) {
      console.error('❌ SQL file not found:', sqlFile);
      console.log('\n💡 Available SQL files:');
      const exportsDir = path.join(__dirname, 'database-exports');
      try {
        const files = await fs.readdir(exportsDir);
        const sqlFiles = files.filter(f => f.endsWith('.sql'));
        sqlFiles.forEach(f => console.log(`   - ${f}`));
      } catch (e) {
        console.log('   (No exports directory found)');
      }
      process.exit(1);
    }
    
    console.log(`\n📁 Reading SQL file: ${path.basename(sqlFile)}`);
    const sqlContent = await fs.readFile(sqlFile, 'utf8');
    
    const sizeKB = (sqlContent.length / 1024).toFixed(2);
    console.log(`💾 File size: ${sizeKB} KB`);
    
    console.log('\n🚀 Importing database...');
    console.log('⏳ This may take a moment...\n');
    
    // Execute SQL
    await connection.query(sqlContent);
    
    console.log('✅ Database imported successfully!');
    
    // Verify import
    const [databases] = await connection.query("SHOW DATABASES LIKE 'urly'");
    if (databases.length > 0) {
      await connection.query('USE urly');
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`\n📊 Verified: ${tables.length} tables imported`);
      
      // Show table row counts
      console.log('\n📈 Table Statistics:');
      for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0];
        const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        const rowCount = countResult[0].count;
        console.log(`   - ${tableName}: ${rowCount} rows`);
      }
    }
    
    console.log('\n🎉 Import completed successfully!');
    console.log('\n✅ Your database is ready to use!');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running. Please start MySQL and try again.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Please check your MySQL username and password.');
    } else {
      console.error(error);
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Get SQL file from command line or use latest
async function main() {
  let sqlFile = process.argv[2];
  
  if (!sqlFile) {
    // Try to find the latest SQL file
    const exportsDir = path.join(__dirname, 'database-exports');
    try {
      const files = await fs.readdir(exportsDir);
      const sqlFiles = files.filter(f => f.endsWith('.sql')).sort().reverse();
      
      if (sqlFiles.length > 0) {
        sqlFile = path.join(exportsDir, sqlFiles[0]);
        console.log(`📁 No file specified, using latest: ${sqlFiles[0]}`);
      } else {
        console.error('❌ No SQL files found in database-exports/');
        console.log('\n💡 Usage: node import-database.js <path-to-sql-file>');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ No database-exports directory found');
      console.log('\n💡 Usage: node import-database.js <path-to-sql-file>');
      console.log('   Example: node import-database.js ./urly-database.sql');
      process.exit(1);
    }
  } else if (!path.isAbsolute(sqlFile)) {
    sqlFile = path.join(__dirname, sqlFile);
  }
  
  console.log('🚀 Starting URLY Database Import...\n');
  await importDatabase(sqlFile);
}

main();
