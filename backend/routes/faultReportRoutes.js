import express from "express";
import * as functions from "../../functions/db/faultReportFunctions.js";
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";

const router = express.Router();




router.post("/fault-reports", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;

        const hasEquipmentUnitId = req.body.equipmentUnitId != null;
        const hasEquipmentTypeId = req.body.equipmentTypeId != null;

        if (
            hasEquipmentUnitId === hasEquipmentTypeId ||
            !req.body.description ||
            !req.body.description.trim()
        ) {
            return res.status(400).json({
                status: 400,
                error: "Provide either an equipment unit or equipment type and a description"
            });
        }

        if (hasEquipmentTypeId) {
            const roleError = checkRole(user, ["caretaker","administrator"]);

            if (roleError) {
                return res.status(roleError.status).json(roleError);
            }
        } else {
            const roleError = checkRole(user, ["student"]);

            if (roleError) {
                return res.status(roleError.status).json(roleError);
            }
        }

        await functions.createFaultReport(req.body);

        res.status(201).json({
            message: "Fault report created successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to create fault report"
        });
    }
});



router.get("/fault-reports/type/:equipmentTypeId", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;
        const roleError = checkRole(user, ["student","administrator","caretaker"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const equipmentTypeId = req.params.equipmentTypeId;

        const faultReports = await functions.getFaultReportsForEquipmentType(equipmentTypeId);

        res.json(faultReports);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch fault reports"
        });
    }
});



router.get("/fault-reports/equipment/:equipmentUnitId", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;
        const roleError = checkRole(user, ["student","administrator","caretaker"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const equipmentUnitId = req.params.equipmentUnitId;

        const faultReports =
            await functions.getFaultReportsForEquipment(equipmentUnitId);

        res.json(faultReports);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch fault reports for equipment"
        });
    }
});



router.patch("/fault-reports/:faultReportId/close", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;

        const roleError = checkRole(user, ["administrator", "caretaker"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }
        await functions.closeFaultReport(req.params.faultReportId)

        res.json({
            message: "Fault report closed successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to close fault report"
        });
    }
});





export default router;