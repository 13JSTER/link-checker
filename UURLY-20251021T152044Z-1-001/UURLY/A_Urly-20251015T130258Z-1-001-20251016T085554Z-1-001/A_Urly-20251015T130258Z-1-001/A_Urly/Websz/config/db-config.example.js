// Database Configuration Template for URLY Scanner
import mysql from 'mysql2/promise';

// Database connection settings
export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'YOUR_PASSWORD_HERE', // ⚠️ CHANGE THIS TO YOUR ACTUAL PASSWORD!
  database: 'urly',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
let pool = null;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Database connected successfully!');
    console.log('Test query result:', rows[0].result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Close database connection
export async function closeConnection() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
}
