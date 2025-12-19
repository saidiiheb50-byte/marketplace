import { db } from '../index.js';

export const checkDatabaseConnection = async () => {
  try {
    const [result] = await db.execute('SELECT 1 as test');
    return { connected: true, message: 'Database connection successful' };
  } catch (error) {
    return { 
      connected: false, 
      message: 'Database connection failed',
      error: error.message,
      code: error.code
    };
  }
};

export const checkTableExists = async (tableName) => {
  try {
    const [result] = await db.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName]
    );
    return result[0].count > 0;
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
    return false;
  }
};

export const checkUsersTable = async () => {
  try {
    const exists = await checkTableExists('users');
    if (!exists) {
      return { exists: false, message: 'Users table does not exist. Please run the database schema.' };
    }
    
    // Check table structure
    const [columns] = await db.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
       FROM information_schema.columns 
       WHERE table_schema = DATABASE() AND table_name = 'users'`
    );
    
    return { 
      exists: true, 
      message: 'Users table exists',
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE === 'YES'
      }))
    };
  } catch (error) {
    return { 
      exists: false, 
      message: 'Error checking users table',
      error: error.message 
    };
  }
};



