import express from "express"
import * as functions from "../../functions/db/auditFunctions.js"
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";
const router = express.Router();


router.get("/audit-log", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;

        const roleError = checkRole(user, ["administrator"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const log = await functions.getLog();

        res.json(log);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch audit log"
        });
    }
});
export default router;

