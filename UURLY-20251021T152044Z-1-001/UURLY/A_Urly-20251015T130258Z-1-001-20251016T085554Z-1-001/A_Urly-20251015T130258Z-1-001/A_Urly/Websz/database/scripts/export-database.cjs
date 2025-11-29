/**
 * Database Export Tool
 * Exports the entire URLY database to SQL file for easy transfer
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration (from db-config.js)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '200313',
  database: 'urly'
};

async function exportDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Create exports directory
    const exportsDir = path.join(__dirname, 'database-exports');
    await fs.mkdir(exportsDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const exportFile = path.join(exportsDir, `urly-database-${timestamp}.sql`);
    
    let sqlContent = '';
    
    // Add header
    sqlContent += `-- ============================================\n`;
    sqlContent += `-- URLY Database Export\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
    sqlContent += `-- Database: ${dbConfig.database}\n`;
    sqlContent += `-- ============================================\n\n`;
    
    sqlContent += `-- Drop database if exists and create new\n`;
    sqlContent += `DROP DATABASE IF EXISTS \`${dbConfig.database}\`;\n`;
    sqlContent += `CREATE DATABASE \`${dbConfig.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sqlContent += `USE \`${dbConfig.database}\`;\n\n`;
    
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📊 Found ${tables.length} tables to export:`);
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      console.log(`  - Exporting table: ${tableName}`);
      
      // Get CREATE TABLE statement
      const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableSQL = createTable[0]['Create Table'];
      
      sqlContent += `-- ============================================\n`;
      sqlContent += `-- Table: ${tableName}\n`;
      sqlContent += `-- ============================================\n\n`;
      sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      sqlContent += createTableSQL + ';\n\n';
      
      // Get table data
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      
      if (rows.length > 0) {
        sqlContent += `-- Data for table: ${tableName} (${rows.length} rows)\n`;
        sqlContent += `LOCK TABLES \`${tableName}\` WRITE;\n`;
        
        for (const row of rows) {
          const columns = Object.keys(row);
          const values = Object.values(row).map(value => {
            if (value === null) return 'NULL';
            if (typeof value === 'number') return value;
            if (typeof value === 'boolean') return value ? 1 : 0;
            if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
            // Escape single quotes and backslashes
            const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            return `'${escaped}'`;
          });
          
          sqlContent += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
        }
        
        sqlContent += `UNLOCK TABLES;\n\n`;
        console.log(`    ✅ Exported ${rows.length} rows`);
      } else {
        sqlContent += `-- No data in table: ${tableName}\n\n`;
        console.log(`    ℹ️  No data to export`);
      }
    }
    
    // Write to file
    await fs.writeFile(exportFile, sqlContent, 'utf8');
    
    // Get file size
    const stats = await fs.stat(exportFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('\n✅ Export completed successfully!');
    console.log(`📁 File: ${exportFile}`);
    console.log(`💾 Size: ${fileSizeKB} KB`);
    console.log(`📊 Tables exported: ${tables.length}`);
    
    // Also create a JSON export for easier reading
    const jsonExportFile = path.join(exportsDir, `urly-database-${timestamp}.json`);
    const jsonData = {};
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      jsonData[tableName] = rows;
    }
    
    await fs.writeFile(jsonExportFile, JSON.stringify(jsonData, null, 2), 'utf8');
    const jsonStats = await fs.stat(jsonExportFile);
    const jsonSizeKB = (jsonStats.size / 1024).toFixed(2);
    
    console.log(`\n📄 JSON Export also created:`);
    console.log(`📁 File: ${jsonExportFile}`);
    console.log(`💾 Size: ${jsonSizeKB} KB`);
    
    // Create a README
    const readmeContent = `# URLY Database Export

## Export Information
- **Date**: ${new Date().toISOString()}
- **Database**: ${dbConfig.database}
- **SQL File**: urly-database-${timestamp}.sql
- **JSON File**: urly-database-${timestamp}.json
- **Tables Exported**: ${tables.length}

## Files Included

### 1. SQL File (.sql)
Complete MySQL dump including:
- Database creation statement
- All table structures (CREATE TABLE)
- All data (INSERT statements)
- Can be imported directly into MySQL

### 2. JSON File (.json)
Human-readable JSON format with all data
- Easy to read and inspect
- Can be imported programmatically
- Good for version control

## How to Import

### Option 1: MySQL Command Line
\`\`\`bash
mysql -u root -p < urly-database-${timestamp}.sql
\`\`\`

### Option 2: phpMyAdmin
1. Open phpMyAdmin
2. Click "Import" tab
3. Choose the SQL file
4. Click "Go"

### Option 3: MySQL Workbench
1. Open MySQL Workbench
2. Server > Data Import
3. Select "Import from Self-Contained File"
4. Choose the SQL file
5. Click "Start Import"

### Option 4: Using Node.js Script
\`\`\`javascript
const mysql = require('mysql2/promise');
const fs = require('fs');

async function importDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });
  
  const sql = fs.readFileSync('urly-database-${timestamp}.sql', 'utf8');
  await connection.query(sql);
  console.log('Database imported successfully!');
  await connection.end();
}

importDatabase();
\`\`\`

## Table List
${tables.map(t => `- ${Object.values(t)[0]}`).join('\n')}

## Notes for Other Developers

1. **Database Name**: The database is called "urly"
2. **Character Set**: UTF-8 (utf8mb4_unicode_ci)
3. **Engine**: InnoDB (supports transactions)
4. **Foreign Keys**: Check for any foreign key constraints

## Configuration Needed

Update your database connection settings:
\`\`\`javascript
const dbConfig = {
  host: 'localhost',      // Or your MySQL server
  user: 'root',           // Your MySQL user
  password: '',           // Your MySQL password
  database: 'urly'        // Database name
};
\`\`\`

## Questions?

Contact the original developer for:
- Database schema documentation
- API endpoints documentation
- Configuration setup
- Security considerations

---
Generated by URLY Database Export Tool
`;
    
    const readmeFile = path.join(exportsDir, `README-${timestamp}.md`);
    await fs.writeFile(readmeFile, readmeContent, 'utf8');
    console.log(`\n📖 README created: ${readmeFile}`);
    
    console.log('\n🎉 All export files created successfully!');
    console.log(`\n📂 Export directory: ${exportsDir}`);
    console.log('\nYou can now share the entire "database-exports" folder with other developers.');
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run export
console.log('🚀 Starting URLY Database Export...\n');
exportDatabase();
