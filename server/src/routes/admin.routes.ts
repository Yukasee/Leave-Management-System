import { Router } from "express";
import { getAdminStats } from "../controller/admin.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/stats", requireAuth, getAdminStats);

export default router;
