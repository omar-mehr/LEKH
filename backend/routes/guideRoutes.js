import express from "express"
import * as functions from "../../functions/db/guideFunctions.js";
const router = express.Router()
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";
import multer from "multer";
const guideUpload = multer({dest: "uploads/guides/"});
router.get("/guides", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const guides = await functions.getGuides();

        res.json(guides);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch guides"
        });
    }
});


router.post("/guides", async (req, res) => {
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

        if (!req.body.title || !req.body.equipmentTypeId) {
            return res.status(400).json({
                status: 400,
                error: "Title and equipment type are required"
            });
        }

        const guide = await functions.createGuide(req.body);

        res.status(201).json(guide);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to create guide"
        });
    }
});

router.put("/guides/:id", async (req, res) => {
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

        if (!req.body.title || !req.body.equipmentTypeId) {
            return res.status(400).json({
                status: 400,
                error: "Title and equipment type are required"
            });
        }

        req.body.id = req.params.id;

        const guide = await functions.updateGuide(req.body);

        if (!guide) {
            return res.status(404).json({
                status: 404,
                error: "Guide not found"
            });
        }

        res.json(guide);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to update guide"
        });
    }
});


router.post( "/guides/:id/steps",guideUpload.single("photo"),async (req, res) => {
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

        if (!req.body.stepNumber || !req.body.content) {
            return res.status(400).json({
                status: 400,
                error: "Step number and content are required"
            });
        }
        if (req.file) {
            req.body.imageUrl = `/uploads/guides/${req.file.filename}`;
        }
        req.body.guideId = req.params.id;
        const step = await functions.createGuideStep(req.body);

        res.status(201).json(step);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to create guide step"
        });
    }
});


router.put("/guides/:id/steps/:stepId",guideUpload.single("photo"),async (req, res) => {
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

            if (!req.body.stepNumber || !req.body.content) {
                return res.status(400).json({
                    status: 400,
                    error: "Step number and content are required"
                });
            }

            if (req.file) {
                req.body.imageUrl =
                    `/uploads/guides/${req.file.filename}`;
            }

            req.body.stepId = req.params.stepId;
            req.body.guideId = req.params.id;

            const step = await functions.updateGuideStep(
                req.body
            );

            if (!step) {
                return res.status(404).json({
                    status: 404,
                    error: "Guide step not found"
                });
            }

            res.json(step);

        } catch (error) {
            console.log(error);

            res.status(500).json({
                status: 500,
                error: "Failed to update guide step"
            });
        }
    }
);


router.get("/guides/:id/steps", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const steps = await functions.getGuideSteps(req.params.id);

        res.json(steps);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch guide steps"
        });
    }
});




router.get("/guides/equipment-type/:equipmentTypeId", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const guides = await functions.getGuidesByEquipmentTypeId(req.params.equipmentTypeId);

        res.json(guides);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch guides"
        });
    }
});


export default router;