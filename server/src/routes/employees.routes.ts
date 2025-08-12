import { Router } from "express";
import {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controller/employees.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

// Get all employees — ADMIN only
router.get("/", requireAuth, requireAdmin, getAllEmployees);

// Get single employee — ADMIN or self
router.get("/:id", requireAuth, getEmployeeById);

// Update employee — ADMIN only
router.put("/:id", requireAuth, requireAdmin, updateEmployee);

// Delete employee — ADMIN only
router.delete("/:id", requireAuth, requireAdmin, deleteEmployee);

export default router;
