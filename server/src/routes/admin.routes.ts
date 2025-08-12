import { Router } from "express";
import { getAdminStats } from "../controller/admin.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Get admin dashboard stats
router.get("/stats", requireAuth, getAdminStats);

export default router;
