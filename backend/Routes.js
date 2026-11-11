import express from "express"
import equipmentRoutes from "./routes/equipmentRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import loanRoutes from "./routes/loanRoutes.js"
import guideRoutes from "./routes/guideRoutes.js"
import log from "./routes/logRoutes.js"
import searchRoutes from "./routes/searchRoutes.js";
import faultReport from "./routes/faultReportRoutes.js"

const router = express.Router();


router.use(equipmentRoutes);
router.use(userRoutes);
router.use(authRoutes);
router.use(loanRoutes);
router.use(log);
router.use(guideRoutes);
router.use(searchRoutes);
router.use(faultReport)
export default router;