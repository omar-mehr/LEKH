import db from "./database.js";
export async function getLog() {
    const result = await db.query(`
        SELECT *
        FROM audit_log
        ORDER BY created_at DESC
    `);

    return result.rows;
}

