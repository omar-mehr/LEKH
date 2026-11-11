import express from "express";
import * as functions from "../../functions/db/searchFunctions.js";
import { getAuthenticatedUser } from "../../functions/helper.js";

const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const search = req.query.search;

        if (!search) {
            return res.status(400).json({
                status: 400,
                error: "Search query is required"
            });
        }

        const results = await functions.search(search);

        res.json(results);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Search failed"
        });
    }
});

export default router;