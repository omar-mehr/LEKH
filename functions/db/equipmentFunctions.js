import db from "./database.js";
export async function getEquipmentTypes() {
    const result = await db.query(`
        SELECT
            equipment_type.*,
            COUNT(individual_equipment.id) AS unit_count
        FROM equipment_type
        LEFT JOIN individual_equipment
            ON individual_equipment.equipment_type_id = equipment_type.id
        GROUP BY equipment_type.id
    `);

    return result.rows;
}

export async function updateEquipmentTypePhoto(id, imageUrl) {
    await db.query(`
        UPDATE equipment_type
        SET image_url = $1
        WHERE id = $2
    `, [imageUrl, id]);
}
export async function getEquipmentType(id) {
    const result = await db.query(`
        SELECT * FROM equipment_type
        WHERE id = $1
    `, [id]);

    return result.rows[0];
}

export async function deleteEquipmentTypePhoto(id) {
    await db.query(`
        UPDATE equipment_type
        SET image_url = NULL
        WHERE id = $1
    `, [id]);
}

export async function createCategory(name) {
    await db.query(`
        INSERT INTO category (name)
        VALUES ($1)
    `, [name]);
}

export async function getCategories() {
    const result = await db.query(`
        SELECT * FROM category
    `);
    return result.rows;
}

export async function createEquipmentType(data) {
    await db.query(`
        INSERT INTO equipment_type (
            name,
            description,
            image_url,
            category_id
        )
        VALUES ($1, $2, $3, $4)
    `, [
        data.name,
        data.description,
        data.imageUrl,
        data.categoryId
    ]);
}
export async function getEquipment(equipmentTypeId) {
    const result = await db.query(`
    SELECT
        individual_equipment.*,
        location.name AS location,
        category.name AS category_name
    FROM individual_equipment
    LEFT JOIN location
        ON individual_equipment.location_id = location.id
    JOIN equipment_type
        ON individual_equipment.equipment_type_id = equipment_type.id
    JOIN category
        ON equipment_type.category_id = category.id
    WHERE individual_equipment.equipment_type_id = $1
    ORDER BY individual_equipment.id ASC
`, [equipmentTypeId]);

    return result.rows;
}

export async function createEquipment(data) {
    await db.query(`
        INSERT INTO individual_equipment (
            name,
            serial_number,
            equipment_type_id,
            location_id,
            condition,
            status,
            mobility
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
        data.name,
        data.serialNumber,
        data.equipmentTypeId,
        data.locationId,
        data.condition,
        data.status,
        data.mobility
    ]);
}

export async function createLocation(data) {
    await db.query(`
        INSERT INTO location (name, description)
        VALUES ($1, $2)
    `, [data.name, data.description]);
}

export async function getLocations() {
    const result = await db.query(`
        SELECT * FROM location
    `);
    return result.rows;
}

export async function updateEquipment(id, data) {
    await db.query(`
        UPDATE individual_equipment
        SET
            location_id = $1,
            condition = $2,
            status = $3,
            mobility = $4
        WHERE id = $5
    `, [
        data.locationId,
        data.condition,
        data.status,
        data.mobility,
        id
    ]);
}

export async function getAvailableEquipment() {
    const result = await db.query(`
       SELECT
            id,
            name,
            serial_number
        FROM individual_equipment
        WHERE status = 'available'
        ORDER BY name;
    `);

    return result.rows;
}

export async function getEquipmentBySerialNumber(serialNumber) {
    const result = await db.query(`
        SELECT 
            individual_equipment.id,
            individual_equipment.name,
            individual_equipment.serial_number,
            location.name AS location_name,
            equipment_type.name AS equipment_type,
            individual_equipment.condition,
            individual_equipment.status,
            individual_equipment.mobility
        FROM individual_equipment
        JOIN location
            ON individual_equipment.location_id = location.id
        JOIN equipment_type
            ON individual_equipment.equipment_type_id = equipment_type.id
        WHERE individual_equipment.serial_number = $1
    `, [serialNumber]);

    return result.rows[0];
}

export async function getEquipmentById(id) {
    const result = await db.query(`
        SELECT id, status
        FROM individual_equipment
        WHERE id = $1
    `, [id]);

    return result.rows[0];
}