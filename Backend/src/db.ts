// src/db.ts
import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()
const isProduction = process.env.NODE_ENV === "production";

console.log('Running in production?', isProduction);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})
