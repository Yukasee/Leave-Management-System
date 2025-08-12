import { Router } from "express";
import { applyLeave, getLeaves, updateLeaveStatus } from "../controller/leave.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Employee applies for leave
router.post("/", requireAuth, applyLeave);

// Get leaves (Admin gets all, Employee gets own)
router.get("/", requireAuth, getLeaves);

// Admin updates leave status
router.put("/:id/status", requireAuth, updateLeaveStatus);

export default router;
