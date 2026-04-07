import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const useSsl = !process.env.DATABASE_URL?.includes("localhost");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});

export const query = (text, params) => pool.query(text, params);
export const testConnection = () => pool.query("SELECT 1");