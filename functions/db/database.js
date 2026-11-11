import postgres from "pg";
import "dotenv/config";

const db = new postgres.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
export default db;