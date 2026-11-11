import { CreateHash,authenticateUser } from "../functionHash.js";
import db from "./database.js";
export async function createStudent(data) {
    const passwordHash = await CreateHash(data.password);

    await db.query(`
        INSERT INTO app_user (
            name,
            email,
            address,
            phone_number,
            password_hash,
            role
        )
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [
        data.name,
        data.email,
        data.address,
        data.phoneNumber,
        passwordHash,
        "student"
    ]);
}

export async function loginUser(email, password) {
    const result = await db.query(`
        SELECT id, name, email, password_hash, role
        FROM app_user
        WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    return authenticateUser(user, password);
}

export async function createCaretaker(data) {
    const passwordHash = await CreateHash(data.password);

    await db.query(`
        INSERT INTO app_user (
            name,
            email,
            address,
            phone_number,
            password_hash,
            role
        )
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [
        data.name,
        data.email,
        data.address,
        data.phoneNumber,
        passwordHash,
        "caretaker"
    ]);
}

export async function getUserRoles() {
    const result = await db.query(`
        SELECT id, name, email, role
        FROM app_user
    `);

    return result.rows;
}

export async function updateUserRole(id, role) {
    await db.query(`
        UPDATE app_user
        SET role = $1
        WHERE id = $2
    `, [role, id]);
}

export async function getStudents() {
    const result = await db.query(`
        SELECT
            id,
            name
        FROM app_user
        WHERE role = 'student'
        ORDER BY name
    `);

    return result.rows;
}