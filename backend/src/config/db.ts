import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(isProduction ? {
  connectionString: process.env.DATABASE_URL || undefined, // production
  ssl: { rejectUnauthorized: false }

} : {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB_NAME,
// });

export default pool;
