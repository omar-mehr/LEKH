import db from "./database.js";
export async function getConditionPhotosByLoanId(loanId) {
    const result = await db.query(`
        SELECT
            id,
            loan_id,
            photo_url,
            created_at
        FROM condition_photo
        WHERE loan_id = $1
        ORDER BY created_at
    `, [loanId]);

    return result.rows;
}


export async function createConditionPhoto(data) {
    const result = await db.query(`
        INSERT INTO condition_photo (
            loan_id,
            photo_url
        )
        VALUES ($1, $2)
        RETURNING
            id,
            loan_id,
            photo_url,
            created_at
    `, [
        data.loanId,
        data.photoUrl
    ]);

    return result.rows[0];
}