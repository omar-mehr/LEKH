import express from "express"
import * as functions from "../../functions/db/loanFunctions.js";
import { getAuthenticatedUser, checkRole } from "../../functions/helper.js";
import multer from "multer";
import fs from "fs";


const router = express.Router();
const conditionUpload = multer({dest: "uploads/conditions/"});

router.post("/borrow-requests", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const user = authentication.user;

        const roleError = checkRole(user, ["student"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        if (!req.body.equipmentId || !req.body.purpose) {
            return res.status(400).json({
                status: 400,
                error: "Required information is missing"
            });
        }

        const result = await functions.createBorrowRequest(
            user.userId,
            req.body
        );

        if (result === "pending") {
            return res.status(409).json({
                status: 409,
                error: "You already have a pending borrow request for this equipment"
            });
        }

        if (result === "not_found") {
            return res.status(404).json({
                status: 404,
                error: "Equipment not found"
            });
        }

        if (result !== "created") {
            return res.status(409).json({
                status: 409,
                error: "Equipment is not available for borrowing"
            });
        }

        res.status(201).json({
            message: "Borrow request created successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});


router.get("/borrow-requests", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(
            authentication.user, ["caretaker", "administrator"]
        );

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const requests = await functions.getBorrowRequests();

        res.json(requests);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch borrow requests"
        });
    }
});

router.put("/borrow-requests/:id", async (req, res) => {
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

        if (!req.body.status) {
            return res.status(400).json({
                status: 400,
                error: "Status is required"
            });
        }

        if (req.body.status === "approved") {
            const result = await functions.approveBorrowRequest(req.params.id);

            if (result === "reserved") {
                return res.status(409).json({
                    status: 409,
                    error: "Equipment is already reserved for other user"
                });
            }

            if (!result) {
                return res.status(404).json({
                    status: 404,
                    error: "Borrow request not found"
                });
            }
        } else {
            await functions.updateBorrowRequest(
                req.params.id,
                req.body.status
            );
        }

        res.json({
            message: "Borrow request updated successfully"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});

router.get("/my-borrow-requests", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const requests = await functions.getMyBorrowRequests(authentication.user.userId);

        res.json(requests);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch borrow requests"
        });
    }
});

router.post("/borrow-requests/:id/checkout",conditionUpload.single("photo"),async (req, res) => {
        try {
            const authentication = getAuthenticatedUser(req);

            if (authentication.error) {
                return res.status(authentication.status).json({
                    status: authentication.status,
                    error: authentication.error
                });
            }

            const roleError = checkRole(authentication.user,["student"]);

            if (roleError) {
                return res.status(roleError.status).json(roleError);
            }

            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: "Condition photo is required"
                });
            }

            const newFileName = `before-${req.file.filename}`;
            fs.renameSync(`uploads/conditions/${req.file.filename}`,`uploads/conditions/${newFileName}`);
            const photoUrl = `/uploads/conditions/${newFileName}`;

            const result = await functions.checkoutEquipment(req.params.id,authentication.user.userId,photoUrl);

            if (result === "photo_required") {
                return res.status(400).json({
                    status: 400,
                    error: "Condition photo is required"
                });
            }

            if (!result) {
                return res.status(403).json({
                    status: 403,
                    error: "Borrow request is not approved or does not belong to the user"
                });
            }

            res.json({
                message: "Equipment checked out successfully"
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                status: 500,
                error: error.message
            });
        }
    }
);


router.post("/loans/:id/return",conditionUpload.single("photo"),async (req, res) => {
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
                ["student", "caretaker", "administrator"]
            );

            if (roleError) {
                return res.status(roleError.status).json(roleError);
            }

            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: "Condition photo is required"
                });
            }

            const newFileName = `after-${req.file.filename}`;
            fs.renameSync(`uploads/conditions/${req.file.filename}`,`uploads/conditions/${newFileName}`);
            const photoUrl = `/uploads/conditions/${newFileName}`;

            const result = await functions.returnEquipment(
                req.params.id,
                authentication.user.userId,
                authentication.user.role,
                photoUrl
            );

            if (result === "photo_required") {
                return res.status(400).json({
                    status: 400,
                    error: "Condition photo is required"
                });
            }

            if (!result) {
                return res.status(403).json({
                    status: 403,
                    error: "Loan does not belong to the user or has already been returned"
                });
            }

            res.json({
                message: "Equipment returned successfully"
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                status: 500,
                error: error.message
            });
        }
    }
);

router.get("/my-loans", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const loans = await functions.getMyLoans(authentication.user.userId);

        res.json(loans);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to retrieve loans"
        });
    }
});


router.get("/loans/:id/due-date", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const loan = await functions.getLoanDueDate(req.params.id);

        if (!loan) {
            return res.status(404).json({
                status: 404,
                error: "Loan not found"
            });
        }

        res.json(loan);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch due date"
        });
    }
});

router.put("/loans/:id/due-date", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        if (!req.body.dueDate) {
            return res.status(400).json({
                status: 400,
                error: "Due date is required"
            });
        }

        const loan = await functions.updateLoanDueDate( req.params.id, req.body.dueDate);

        if (!loan) {
            return res.status(404).json({
                status: 404,
                error: "Loan not found"
            });
        }

        res.json(loan);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to update due date"
        });
    }
});

router.post("/loans/:id/renewal-requests", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const loan = await functions.getLoanById(
            req.params.id,
            authentication.user.userId
        );

        if (!loan) {
            return res.status(404).json({
                status: 404,
                error: "Loan not found"
            });
        }

        const renewalRequest = await functions.createRenewalRequest(req.params.id);

        if (!renewalRequest) {
            return res.status(409).json({
                status: 409,
                error: "A renewal request already exists for this loan"
            });
        }

        res.status(201).json(renewalRequest);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to create renewal request"
        });
    }
});


router.get("/renewal-requests", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const renewalRequests = await functions.getRenewalRequests();

        res.json(renewalRequests);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch renewal requests"
        });
    }
});

router.put("/renewal-requests/:id", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(authentication.user,["caretaker", "administrator"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        if (!req.body.status) {
            return res.status(400).json({
                status: 400,
                error: "Status is required"
            });
        }

        const renewalRequest = await functions.updateRenewalRequest(req.params.id,req.body.status);

        if (!renewalRequest) {
            return res.status(404).json({
                status: 404,
                error: "Renewal request not found"
            });
        }

        if (req.body.status === "approved") {
            await functions.extendLoanDueDate(renewalRequest.loan_id);
        }

        res.json(renewalRequest);
    } catch {
        res.status(500).json({
            status: 500,
            error: "Failed to update renewal request"
        });
    }
});



router.post("/loans/caretaker", async (req, res) => {
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

        if (!req.body.studentId || !req.body.equipmentId) {
            return res.status(400).json({
                status: 400,
                error: "Student and equipment are required"
            });
        }

        const result = await functions.createCaretakerLoan(req.body.studentId,req.body.equipmentId);

        if (!result) {
            return res.status(400).json({
                status: 400,
                error: "Student or equipment is invalid"
            });
        }

        res.status(201).json({
            message: "Loan registered successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});


router.get("/borrow-requests/:id", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const request = await functions.getBorrowRequestById(
            req.params.id
        );

        if (!request) {
            return res.status(404).json({
                status: 404,
                error: "Borrow request not found"
            });
        }

        res.json(request);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch borrow request"
        });
    }
});

router.get("/loans", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(
            authentication.user,["caretaker", "administrator"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const loans = await functions.getAllActiveLoans();

        res.json(loans);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch active loans"
        });
    }
});


router.get("/condition-photos/loan/:loanId", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const photos = await functions.getConditionPhotosByLoanId(req.params.loanId);

        res.json(photos);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: "Failed to fetch condition photos"
        });
    }
});


router.get("/loan/:loanId", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(
            authentication.user,["caretaker", "administrator"]);

        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const result = await functions.getLoanDetailsById(req.params.loanId);

        if (!result) {
            return res.status(404).json({
                status: 404,
                error: "Loan not found"
            });
        }

        res.json(result);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});

router.get("/loan/history/:serialNumber", async (req, res) => {
    try {
        const authentication = getAuthenticatedUser(req);

        if (authentication.error) {
            return res.status(authentication.status).json({
                status: authentication.status,
                error: authentication.error
            });
        }

        const roleError = checkRole(authentication.user,["caretaker", "administrator"]);
        if (roleError) {
            return res.status(roleError.status).json(roleError);
        }

        const loans = await functions.getLoanHistoryBySerialNumber(req.params.serialNumber);

        if (loans.length === 0) {
            return res.status(404).json({
                status: 404,
                error: "No loan history found for this equipment"
            });
        }

        res.json(loans);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});

export default router;