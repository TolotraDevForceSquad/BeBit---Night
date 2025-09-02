import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

if (!connectionString.startsWith("postgres://") && !connectionString.startsWith("postgresql://")) {
  connectionString = `postgresql://${connectionString}`;
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Dès qu'une connexion est faite, on force UTF-8
pool.on("connect", async (client) => {
  await client.query(`SET client_encoding TO 'UTF8'`);
  console.log("Connected to PostgreSQL database with UTF-8 encoding");
});

pool.on("error", (err) => {
  console.error("PostgreSQL connection error:", err);
});

export { pool };
