import express from "express";
import * as functions from "../../functions/db/equipmentFunctions.js";
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";
import multer from "multer";
import fs from "fs";
const router = express.Router();
const upload = multer({dest: "uploads/equipment-types/"});

router.post("/categories", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }
        const user = authentication.user;
        const roleError = checkRole(user,  ["caretaker", "administrator"]);
        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        if (!req.body.name) {
            return res.status(400).json({
                status: 400,
                error: "Required information is missing"
            });
        }

        await functions.createCategory(req.body.name);

        res.status(201).json({
            message: "Category created"
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                status: 409,
                error: "The category already exists"
            });
        }

        return res.status(500).json({
            status: 500,
            error: "Failed to create category"
        });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const categories = await functions.getCategories();
        res.json(categories);
    } catch  {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch categories"
        });
    }
});


router.get("/equipment-types", async (req, res) => {
    try {
        const equipmentTypes = await functions.getEquipmentTypes();
        res.json(equipmentTypes);
    } catch  {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch equipment types"
        });
    }
});

router.put("/equipment-types/:id/photo",upload.single("photo"),async (req, res) => {
        try {
            const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }
        const user = authentication.user;
        const roleError = checkRole(user,  ["caretaker", "administrator"]);
        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: "Photo is missing"
                });
            }

            const imageUrl = `/uploads/equipment-types/${req.file.filename}`;

            await functions.updateEquipmentTypePhoto(
                req.params.id,
                imageUrl
            );

            res.json({
                message: "Equipment photo updated",
                imageUrl: imageUrl
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                error: "Failed to update equipment photo"
            });
        }
    }
);

router.delete("/equipment-types/:id/photo", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }
        const user = authentication.user;
        const roleError = checkRole(user,  ["caretaker", "administrator"]);
        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const equipmentType = await functions.getEquipmentType(req.params.id);
        if (!equipmentType || !equipmentType.image_url) {
            return res.status(404).json({
                status: 404,
                error: "Equipment photo not found"
            });
        }

        const filePath = equipmentType.image_url.replace(
            "/uploads/",
            "uploads/"
        );

        fs.unlinkSync(filePath);

        await functions.deleteEquipmentTypePhoto(req.params.id);

        res.json({
            message: "Equipment photo deleted"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: "Failed to delete equipment photo"
        });
    }
});


router.post("/equipment-types",upload.single("photo"),async (req, res) => {
        try {
            const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }
        const user = authentication.user;
        const roleError = checkRole(user,  ["caretaker", "administrator"]);
        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

            if (
                !req.body.name ||
                !req.body.description ||
                !req.body.categoryId
            ) {
                return res.status(400).json({
                    status: 400,
                    error: "Required information is missing"
                });
            }

            const imageUrl = req.file
                ? `/uploads/equipment-types/${req.file.filename}`
                : null;

            await functions.createEquipmentType({
                name: req.body.name,
                description: req.body.description,
                categoryId: req.body.categoryId,
                imageUrl: imageUrl
            });

            res.status(201).json({
                message: "Equipment type created"
            });
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    status: 409,
                    error: "The equipment type already exists"
                });
            }

            return res.status(500).json({
                status: 500,
                error: "Server error"
            });
        }
    }
);

router.get("/individual-equipment", async (req, res) => {
    try {
        const equipment = await functions.getEquipment(
            req.query.equipment_type_id
        );

        res.json(equipment);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch equipment"
        });

        
    }
});

router.post("/create-equipment", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }
        const user = authentication.user;
        const roleError = checkRole(user,  ["caretaker", "administrator"]);
        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        if (
            !req.body.name ||
            !req.body.serialNumber ||
            !req.body.equipmentTypeId
        ) {
            return res.status(400).json({
                status: 400,
                error: "Required information is missing"
            });
        }

        await functions.createEquipment(req.body);

        res.status(201).json({
            message: "Equipment created"
        });
    } catch (error) {
        console.error("CREATE EQUIPMENT ERROR:", error);
        if (error.code === "23505") {
            return res.status(409).json({
                status: 409,
                error: "The serial number already exists"
            });
        }

        return res.status(500).json({
            status: 500,
            error: "Server error"
        });
    }
});

router.post("/locations", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }
        const user = authentication.user;
        const roleError = checkRole(user,  ["caretaker", "administrator"]);
        if (roleError) {
            return res.status(403).json(roleError);
        }
        await functions.createLocation(req.body);

        res.status(201).json({
            message: "Location created successfully"
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                status: 409,
                error: "Location already exists"
            });
        }

        res.status(500).json({
            status: 500,
            error: "Failed to create location"
        });
    }
});

router.get("/locations", async (req, res) => {
    try {
        const locations = await functions.getLocations();
        res.json(locations);
    } catch  {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch locations"
        });
    }
});


router.put("/individual-equipment/:id", async (req, res) => {
    try {
         
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;

        const roleError = checkRole(
            user,
            ["caretaker", "administrator"]
        );

        if (roleError) {
            return res.status(roleError.status).json({
                status: roleError.status,
                error: roleError.error
            });
        }

        const equipment = await functions.getEquipmentById(req.params.id);
        if (!equipment) {
            return res.status(404).json({
                status: 404,
                error: "Equipment not found"
            });
        }

        if (equipment.status === "on_loan" || equipment.status === "reserved") {
            return res.status(409).json({
                status: 409,
                error: "Equipment cannot be updated while borrowed or reserved"
            });
        }
       
        await functions.updateEquipment(req.params.id,req.body);

        res.json({
            message: "Equipment updated successfully"
        });
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to update equipment"
        });
    }
});


router.get("/individual-equipment/serial/:serialNumber", async (req, res) => {
    try {
        const equipment = await functions.getEquipmentBySerialNumber(req.params.serialNumber);

        if (!equipment) {
            return res.status(404).json({
                status: 404,
                error: "Equipment not found"
            });
        }

        res.json(equipment);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to find equipment"
        });
    }
});


router.get("/individual-equipment/available", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(
            authentication.user,
            ["caretaker", "administrator"]
        );

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const equipment = await functions.getAvailableEquipment();

        res.json(equipment);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch available equipment"
        });
    }
});
export default router;