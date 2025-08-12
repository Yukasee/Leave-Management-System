import { Router } from "express";
import { applyLeave, getLeaves, updateLeaveStatus } from "../controller/leave.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/", requireAuth, applyLeave);
router.get("/", requireAuth, getLeaves);
router.put("/:id/status", requireAuth, updateLeaveStatus);

export default router;
