/**
 * View All Database Data
 * Displays all data from every table in the URLY database
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '200313',
  database: 'urly'
};

async function viewAllData() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...\n');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database: urly\n');
    console.log('='.repeat(80));
    
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    console.log(`\n📊 DATABASE: urly`);
    console.log(`📁 Total Tables: ${tableNames.length}\n`);
    console.log('='.repeat(80));
    
    for (const tableName of tableNames) {
      console.log(`\n\n🗂️  TABLE: ${tableName}`);
      console.log('-'.repeat(80));
      
      // Get row count
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      const rowCount = countResult[0].count;
      console.log(`📝 Total Rows: ${rowCount}`);
      
      if (rowCount === 0) {
        console.log('   (empty table)');
        continue;
      }
      
      // Get all data
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      
      // Get column info
      const [columns] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
      const columnNames = columns.map(col => col.Field);
      
      console.log(`\n📋 Columns: ${columnNames.join(', ')}`);
      console.log('-'.repeat(80));
      
      // Display each row
      rows.forEach((row, index) => {
        console.log(`\n📄 Row ${index + 1}:`);
        columnNames.forEach(col => {
          let value = row[col];
          
          // Format different data types
          if (value === null) {
            value = '(NULL)';
          } else if (value instanceof Date) {
            value = value.toISOString();
          } else if (typeof value === 'object') {
            value = JSON.stringify(value, null, 2);
          } else if (typeof value === 'string' && value.length > 200) {
            value = value.substring(0, 200) + '... (truncated)';
          }
          
          console.log(`   ${col}: ${value}`);
        });
      });
    }
    
    console.log('\n\n' + '='.repeat(80));
    console.log('✅ Database view complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL is running!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Check your database credentials (username/password)');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the viewer
viewAllData();
