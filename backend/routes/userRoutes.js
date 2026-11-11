import express from "express"
import * as functions from "../../functions/db/authFunctions.js"
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";
const router = express.Router()


router.get("/user-roles", async (req, res) => {
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
            ["administrator"]
        );

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const users = await functions.getUserRoles();

        res.json(users);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch user roles"
        });
    }
});

router.put("/user-roles/:id", async (req, res) => {
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
            ["administrator"]
        );

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        await functions.updateUserRole(req.params.id,req.body.role);

        res.json({
            message: "User role updated successfully"
        });
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to update user role"
        });
    }
});


router.get("/users/students", async (req, res) => {
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

        const students = await functions.getStudents();

        res.json(students);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch students"
        });
    }
});


export default router;