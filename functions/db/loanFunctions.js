import db from "./database.js";
import { createConditionPhoto } from "./conditionPhotoFunctions.js";

export async function createBorrowRequest(userId, data) {
    const existingRequest = await db.query(`
        SELECT id
        FROM borrow_request
        WHERE user_id = $1
        AND equipment_id = $2
        AND status = 'pending'
    `, [
        userId,
        data.equipmentId
    ]);

    if (existingRequest.rows.length > 0) {
        return "pending";
    }

    const equipment = await db.query(`
        SELECT status
        FROM individual_equipment
        WHERE id = $1
    `, [
        data.equipmentId
    ]);

    if (equipment.rows.length === 0) {
        return "not_found";
    }

    if (equipment.rows[0].status !== "available" ) {
        return equipment.rows[0].status;
    }

    await db.query(`
        INSERT INTO borrow_request (
            user_id,
            equipment_id,
            purpose,
            status
        )
        VALUES ($1, $2, $3, $4)
    `, [
        userId,
        data.equipmentId,
        data.purpose,
        "pending"
    ]);

    return "created";
}

export async function getBorrowRequests() {
    const result = await db.query(`
        SELECT
            borrow_request.id,
            borrow_request.purpose,
            borrow_request.status,

            app_user.id AS user_id,
            app_user.name,
            app_user.email,
            app_user.phone_number,
            app_user.address,
            app_user.role,

            individual_equipment.id AS equipment_id,
            individual_equipment.name AS equipment_name,
            individual_equipment.serial_number

        FROM borrow_request

        JOIN app_user
        ON borrow_request.user_id = app_user.id

        JOIN individual_equipment
        ON borrow_request.equipment_id = individual_equipment.id
         WHERE borrow_request.status = 'pending'
    `);

    return result.rows;
}

export async function updateBorrowRequest(id, status) {
    await db.query(`
        UPDATE borrow_request
        SET status = $1
        WHERE id = $2
    `, [status, id]);
}


export async function approveBorrowRequest(id) {
    await db.query("START TRANSACTION");

    try {
        const result = await db.query(`
            SELECT individual_equipment.status
            FROM borrow_request
            JOIN individual_equipment
                ON borrow_request.equipment_id = individual_equipment.id
            WHERE borrow_request.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            await db.query("ROLLBACK");
            return null;
        }

        if (result.rows[0].status === "reserved") {
            await db.query("ROLLBACK");
            return "reserved";
        }

        await db.query(`
            UPDATE borrow_request
            SET
                status = 'approved',
                expires_at = NOW() + INTERVAL '24 hours'
            WHERE id = $1
        `, [id]);

        await db.query(`
            UPDATE individual_equipment
            SET status = 'reserved'
            WHERE id = (
                SELECT equipment_id
                FROM borrow_request
                WHERE id = $1
            )
        `, [id]);

        await db.query("COMMIT");

        return true;
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}
export async function expireBorrowRequests() {
    await db.query("START TRANSACTION");

    try {
        const result = await db.query(`
            SELECT id, equipment_id
            FROM borrow_request
            WHERE status = 'approved'
              AND expires_at < NOW()
        `);

        for (const request of result.rows) {
            await db.query(`
                UPDATE borrow_request
                SET status = 'expired'
                WHERE id = $1
            `, [request.id]);

            await db.query(`
                UPDATE individual_equipment
                SET status = 'available'
                WHERE id = $1
            `, [request.equipment_id]);
        }

        await db.query("COMMIT");
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}

export async function getMyBorrowRequests(userId) {
    const result = await db.query(`
   SELECT
    borrow_request.id,
    borrow_request.purpose,
    borrow_request.status,
    borrow_request.expires_at,

    individual_equipment.id AS equipment_id,
    individual_equipment.name AS equipment_name,
    individual_equipment.serial_number

    FROM borrow_request

    JOIN individual_equipment
        ON borrow_request.equipment_id = individual_equipment.id

    LEFT JOIN loan
        ON loan.borrow_request_id = borrow_request.id

    WHERE borrow_request.user_id = $1
    AND loan.id IS NULL
    `, [userId]);

    return result.rows;
    }

export async function checkoutEquipment(borrowRequestId, userId, photoUrl) {
    await db.query("START TRANSACTION");

    try {

        if (!photoUrl) {
            await db.query("ROLLBACK");
            return "photo_required";
        }
        const result = await db.query(`
            SELECT equipment_id
            FROM borrow_request
            WHERE id = $1
            AND user_id = $2
            AND status = 'approved'
        `, [borrowRequestId, userId]);

        if (result.rows.length === 0) {
            await db.query("ROLLBACK");
            return null;
        }

        const loanResult = await db.query(`
            INSERT INTO loan (
                borrow_request_id,
                user_id,
                equipment_id,
                start_date,
                due_date
            )
            VALUES (
                $1,
                $2,
                (SELECT equipment_id FROM borrow_request WHERE id = $1),
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '3 weeks'
            )
            RETURNING id
        `, [borrowRequestId, userId]);

        await createConditionPhoto({loanId: loanResult.rows[0].id,
            photoUrl: photoUrl});

        await db.query(`
            UPDATE individual_equipment
            SET status = 'on_loan'
            WHERE id = $1
        `, [result.rows[0].equipment_id]);

        await db.query("COMMIT");

        return true;
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}


export async function returnEquipment(loanId, userId, role, photoUrl) {
    await db.query("START TRANSACTION");

    try {

        if (!photoUrl) {
            await db.query("ROLLBACK");
            return "photo_required";
        }
        const result = await db.query(`
            SELECT
                loan.equipment_id
            FROM loan
            WHERE loan.id = $1
            AND loan.return_date IS NULL
            AND (
                loan.user_id = $2
                OR $3 IN ('caretaker', 'administrator')
            )
        `, [loanId, userId, role]);

        if (result.rows.length === 0) {
            await db.query("ROLLBACK");
            return null;
        }

        await db.query(`
            UPDATE loan
            SET return_date = CURRENT_DATE
            WHERE id = $1
        `, [loanId]);
        await createConditionPhoto({
            loanId: loanId,
            photoUrl: photoUrl
        });

        await db.query(`
            UPDATE individual_equipment
            SET status = 'available'
            WHERE id = $1
        `, [result.rows[0].equipment_id]);

        await db.query("COMMIT");

        return true;
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}



export async function getMyLoans(userId) {
    const result = await db.query(`
        SELECT 
            loan.id,
            loan.start_date,
            loan.due_date,
            loan.return_date,
            individual_equipment.id AS equipment_id,
            individual_equipment.name AS equipment_name,
            renewal_request.status AS renewal_status
        FROM loan
        JOIN individual_equipment
            ON loan.equipment_id = individual_equipment.id
        LEFT JOIN renewal_request
            ON renewal_request.id = (
                SELECT id
                FROM renewal_request
                WHERE renewal_request.loan_id = loan.id
                ORDER BY renewal_request.id DESC
                LIMIT 1
            )
        WHERE loan.user_id = $1
        AND loan.return_date IS NULL
    `, [userId]);

    return result.rows;
}



export async function getLoanDueDate(id) {
    const result = await db.query(`
        SELECT id, due_date
        FROM loan
        WHERE id = $1
    `, [id]);

    return result.rows[0];
}

export async function extendLoanDueDate(loanId) {
    await db.query(`
        UPDATE loan
        SET due_date = due_date + INTERVAL '2 weeks'
        WHERE id = $1
    `, [loanId]);
}

export async function createRenewalRequest(loanId) {
    const existingRequest = await db.query(`
        SELECT id
        FROM renewal_request
        WHERE loan_id = $1
        AND status = 'pending'
    `, [loanId]);

    if (existingRequest.rows.length > 0) {
        return null;
    }

    const result = await db.query(`
        INSERT INTO renewal_request (loan_id, status)
        VALUES ($1, 'pending')
        RETURNING id, loan_id, status
    `, [loanId]);

    return result.rows[0];
}

export async function getRenewalRequests() {
    const result = await db.query(`
        SELECT
            renewal_request.id,
            renewal_request.loan_id,
            renewal_request.status,
            app_user.name AS student_name,
            individual_equipment.name AS equipment_name,
            loan.due_date
        FROM renewal_request
        JOIN loan
            ON renewal_request.loan_id = loan.id
        JOIN borrow_request
            ON loan.borrow_request_id = borrow_request.id
        JOIN app_user
            ON borrow_request.user_id = app_user.id
        JOIN individual_equipment
            ON borrow_request.equipment_id = individual_equipment.id
        WHERE renewal_request.status = 'pending'
    `);

    return result.rows;
}


export async function getLoanById(loanId, userId) {
    const result = await db.query(`
        SELECT loan.id
        FROM loan
        JOIN borrow_request
            ON loan.borrow_request_id = borrow_request.id
        WHERE loan.id = $1
        AND borrow_request.user_id = $2
    `, [loanId, userId]);

    return result.rows[0];
}

export async function updateRenewalRequest(id, status) {
    const result = await db.query(`
        UPDATE renewal_request
        SET status = $1
        WHERE id = $2
        RETURNING id, loan_id, status
    `, [status, id]);

    return result.rows[0];
}

export async function createCaretakerLoan(studentId, equipmentId) {
    await db.query("START TRANSACTION");

    try {
        const student = await db.query(`
            SELECT id
            FROM app_user
            WHERE id = $1
            AND role = 'student'
        `, [studentId]);

        if (student.rows.length === 0) {
            await db.query("ROLLBACK");
            return null;
        }

        const equipment = await db.query(`
            SELECT id
            FROM individual_equipment
            WHERE id = $1
            AND status = 'available'
        `, [equipmentId]);

        if (equipment.rows.length === 0) {
            await db.query("ROLLBACK");
            return null;
        }

        await db.query(`
            INSERT INTO loan (
                borrow_request_id,
                user_id,
                equipment_id,
                start_date,
                due_date
            )
            VALUES (
                NULL,
                $1,
                $2,
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '3 weeks'
            )
        `, [studentId, equipmentId]);

        await db.query(`
            UPDATE individual_equipment
            SET status = 'borrowed'
            WHERE id = $1
        `, [equipmentId]);

        await db.query("COMMIT");

        return true;
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}

export async function getBorrowRequestById(id) {
    const result = await db.query(`
        SELECT
            borrow_request.id,
            borrow_request.purpose,
            borrow_request.status,
            borrow_request.expires_at,

            individual_equipment.id AS equipment_id,
            individual_equipment.name AS equipment_name,
            individual_equipment.serial_number

        FROM borrow_request

        JOIN individual_equipment
            ON borrow_request.equipment_id = individual_equipment.id

        WHERE borrow_request.id = $1
    `, [id]);

    return result.rows[0];
}


export async function getAllActiveLoans() {
    const result = await db.query(`
        SELECT
            loan.id,
            loan.start_date,
            loan.due_date,
            app_user.id AS user_id,
            app_user.name AS student_name,
            individual_equipment.id AS equipment_id,
            individual_equipment.name AS equipment_name,
            individual_equipment.serial_number
        FROM loan
        JOIN app_user
            ON loan.user_id = app_user.id
        JOIN individual_equipment
            ON loan.equipment_id = individual_equipment.id
        WHERE loan.return_date IS NULL
        ORDER BY loan.id
    `);

    return result.rows;
}

export async function getLoanDetailsById(loanId) {
    const result = await db.query(`
        SELECT
            loan.id AS loan_id,
            loan.start_date,
            loan.due_date,
            loan.return_date,

            app_user.id AS user_id,
            app_user.name,
            app_user.email,
            app_user.phone_number,

            individual_equipment.id AS equipment_id,
            individual_equipment.name AS equipment_name,
            individual_equipment.serial_number,

            condition_photo.id AS photo_id,
            condition_photo.photo_url,
            condition_photo.created_at AS photo_created_at

        FROM loan

        JOIN app_user
            ON loan.user_id = app_user.id

        JOIN individual_equipment
            ON loan.equipment_id = individual_equipment.id

        LEFT JOIN condition_photo
            ON loan.id = condition_photo.loan_id

        WHERE loan.id = $1

        ORDER BY condition_photo.created_at
    `, [loanId]);

    return result.rows;
}

export async function getLoanHistoryBySerialNumber(serialNumber) {
    const result = await db.query(`
        SELECT
            loan.id AS loan_id,
            loan.start_date,
            loan.due_date,
            loan.return_date,

            app_user.id AS user_id,
            app_user.name AS user_name,

            individual_equipment.id AS equipment_id,
            individual_equipment.name AS equipment_name,
            individual_equipment.serial_number

        FROM loan

        JOIN app_user
            ON loan.user_id = app_user.id

        JOIN individual_equipment
            ON loan.equipment_id = individual_equipment.id

        WHERE individual_equipment.serial_number = $1

        ORDER BY loan.start_date DESC
    `, [serialNumber]);

    return result.rows;
}