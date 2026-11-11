import db from "./database.js";

export async function createFaultReport(data) {
    await db.query(`
        INSERT INTO fault_reports (
            equipment_unit_id,
            equipment_type_id,
            description
        )
        VALUES ($1, $2, $3)
    `, [
        data.equipmentUnitId || null,
        data.equipmentTypeId || null,
        data.description
    ]);
}

export async function getFaultReportsForEquipmentType(equipmentTypeId) {
    const result = await db.query(`
        SELECT
            id,
            equipment_type_id,
            description,
            status,
            created_at
        FROM fault_reports 
        WHERE equipment_type_id = $1 AND status = 'open'
        ORDER BY created_at DESC
    `, [equipmentTypeId]);

    return result.rows;
}

export async function getFaultReportsForEquipment(equipmentUnitId) {
    const result = await db.query(`
        SELECT
            id,
            equipment_unit_id,
            description,
            status,
            created_at
        FROM fault_reports 
        WHERE equipment_unit_id = $1 AND status = 'open'
        ORDER BY created_at DESC
    `, [equipmentUnitId]);

    return result.rows;
}

export async function closeFaultReport(faultReportId) {
    await db.query(`
        UPDATE fault_reports
        SET status = $1
        WHERE id = $2
    `, ["closed", faultReportId]);
}