// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const isProduction = process.env.NODE_ENV === 'production';

// console.log("[DB] SSL config is explicitly set to rejectUnauthorized: false");
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // ssl: isProduction ? { rejectUnauthorized: false } : false,
//   ssl: { rejectUnauthorized: false }
// });

// export default pool;
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

console.log('[DB] Using updated pool configuration with SSL: { rejectUnauthorized: false }');

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
