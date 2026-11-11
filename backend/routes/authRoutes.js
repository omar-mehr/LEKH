import express from "express"
import * as functions from "../../functions/db/authFunctions.js";
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";
const router = express.Router()


router.post("/login", async (req, res) => {
    try {
        const result = await functions.loginUser(req.body.email,req.body.password);

        if (!result) {
            return res.status(401).json({
                status: 401,
                error: "Invalid email or password"
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: "Login failed"
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        await functions.createStudent(req.body);

        res.status(201).json({
            message: "User registered successfully"
        });
    } catch (error) {  
        if (error.code === "23505") {
            return res.status(409).json({
                status: 409,
                error: "Email already exists"
            });
        }

        res.status(500).json({
            status: 500,
            error: "Registration failed"
        });
    }
});


router.post("/caretakers", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(authentication.user,["administrator"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        await functions.createCaretaker(req.body);

        res.status(201).json({
            message: "Caretaker created successfully"
        });
    } catch (error) {
        
        if (error.code === "23505") {
            return res.status(409).json({
                status: 409,
                error: "Email already exists"
            });
        }

        res.status(500).json({
            status: 500,
            error: "Caretaker creation failed"
        });
    }
});


export default router;