import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined, // production
  user: isProduction ? undefined : process.env.DB_USER,   // dev
  password: isProduction ? undefined : process.env.DB_PASS,
  host: isProduction ? undefined : process.env.DB_HOST,
  port: isProduction ? undefined : Number(process.env.DB_PORT),
  database: isProduction ? undefined : process.env.DB_NAME,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB_NAME,
// });

export default pool;
