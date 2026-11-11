import db from "./database.js";

export async function search(search) {
    const equipmentResult = await db.query(`
        SELECT
            individual_equipment.id,
            individual_equipment.name,
            individual_equipment.serial_number,
            equipment_type.name AS equipment_type
        FROM individual_equipment
        JOIN equipment_type
            ON individual_equipment.equipment_type_id = equipment_type.id
        WHERE
            individual_equipment.name ILIKE $1
            OR individual_equipment.serial_number ILIKE $1
            OR equipment_type.name ILIKE $1
            OR equipment_type.description ILIKE $1
    `, [`%${search}%`]);

    const guideResult = await db.query(`
    SELECT
        guide.id,
        guide.title,
        guide.description
    FROM guide
    WHERE
        guide.title ILIKE $1
        OR guide.description ILIKE $1
        OR EXISTS (
            SELECT 1
            FROM guide_step
            WHERE guide_step.guide_id = guide.id
            AND guide_step.content ILIKE $1
        )
`, [`%${search}%`]);

    return {
        equipment: equipmentResult.rows,
        guides: guideResult.rows
    };
}