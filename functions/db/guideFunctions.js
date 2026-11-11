import db from "./database.js";
export async function getGuides() {
    const result = await db.query(`
        SELECT
            guide.id,
            guide.title,
            guide.description,
            guide.equipment_type_id,
            equipment_type.name AS equipment_type_name
        FROM guide
        JOIN equipment_type
            ON guide.equipment_type_id = equipment_type.id
        ORDER BY guide.id
    `);
    return result.rows;
}

export async function createGuide(data) {
    const result = await db.query(`
        INSERT INTO guide (
            title,
            description,
            equipment_type_id
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            title,
            description,
            equipment_type_id
    `, [
        data.title,
        data.description,
        data.equipmentTypeId
    ]);

    return result.rows[0];
}

export async function updateGuide(data) {
    const result = await db.query(`
        UPDATE guide
        SET
            title = $1,
            description = $2,
            equipment_type_id = $3
        WHERE id = $4
        RETURNING
            id,
            title,
            description,
            equipment_type_id
    `, [
        data.title,
        data.description,
        data.equipmentTypeId,
        data.id
    ]);

    return result.rows[0];
}
export async function createGuideStep(data) {
    const result = await db.query(`
        INSERT INTO guide_step (
            guide_id,
            step_number,
            content,
            image_url,
            video_url
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            guide_id,
            step_number,
            content,
            image_url,
            video_url
    `, [
        data.guideId,
        data.stepNumber,
        data.content,
        data.imageUrl,
        data.videoUrl
    ]);

    return result.rows[0];
}


export async function updateGuideStep(data) {
    let imageUrl = data.imageUrl;

    if (!imageUrl) {
        const currentStep = await db.query(`
            SELECT image_url
            FROM guide_step
            WHERE id = $1
            AND guide_id = $2
        `, [
            data.stepId,
            data.guideId
        ]);

        imageUrl = currentStep.rows[0].image_url;
    }

    const result = await db.query(`
        UPDATE guide_step
        SET
            step_number = $1,
            content = $2,
            image_url = $3,
            video_url = $4
        WHERE id = $5
        AND guide_id = $6
        RETURNING
            id,
            guide_id,
            step_number,
            content,
            image_url,
            video_url
    `, [
        data.stepNumber,
        data.content,
        imageUrl,
        data.videoUrl,
        data.stepId,
        data.guideId
    ]);

    return result.rows[0];
}


export async function getGuideSteps(guideId) {
    const result = await db.query(`
        SELECT
            id,
            guide_id,
            step_number,
            content,
            image_url,
            video_url
        FROM guide_step
        WHERE guide_id = $1
        ORDER BY step_number
    `, [guideId]);

    return result.rows;
}

export async function getGuidesByEquipmentTypeId(equipmentTypeId) {
    const result = await db.query(`
        SELECT
            id,
            title,
            description,
            equipment_type_id
        FROM guide
        WHERE equipment_type_id = $1
        ORDER BY id
    `, [equipmentTypeId]);
    return result.rows;
}

