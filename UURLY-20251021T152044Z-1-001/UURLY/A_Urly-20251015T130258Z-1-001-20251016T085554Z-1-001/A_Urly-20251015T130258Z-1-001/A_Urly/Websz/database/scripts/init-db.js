// Initialize Database Schema
import * as db from './db-config.js';
import fs from 'fs';

async function initializeDatabase() {
  console.log('\n🚀 Initializing URLY Scanner Database...\n');
  
  try {
    // Read SQL schema file
    const schema = fs.readFileSync('./database-schema.sql', 'utf8');
    
    // Remove comments and split by semicolons
    const cleanedSchema = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    // Split by semicolons to get individual statements
    const statements = cleanedSchema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const connection = await db.getConnection();
    
    console.log(`📝 Executing ${statements.length} SQL statements...\n`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.query(statement);
          // Extract table name from CREATE TABLE statements
          const match = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (match) {
            console.log(`✅ Created table: ${match[1]}`);
          } else if (statement.includes('INSERT INTO')) {
            console.log(`✅ Inserted default configuration`);
          }
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_CLAUSE') {
            // Table already exists, skip
            const match = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
            if (match) {
              console.log(`ℹ️  Table already exists: ${match[1]}`);
            }
          } else {
            console.error(`❌ Error executing statement:`, error.message);
          }
        }
      }
    }
    
    // Verify tables created
    console.log('\n📋 Verifying database tables...\n');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length > 0) {
      console.log('✅ Database tables:');
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
      });
      console.log(`\n✅ SUCCESS: Database initialized with ${tables.length} tables!\n`);
    } else {
      console.log('❌ No tables found after initialization.\n');
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  } finally {
    await db.closeConnection();
  }
}

initializeDatabase();
