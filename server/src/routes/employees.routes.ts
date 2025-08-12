import { Router } from "express";
import {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controller/employees.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAllEmployees);
router.get("/:id", requireAuth, getEmployeeById);
router.put("/:id", requireAuth, requireAdmin, updateEmployee);
router.delete("/:id", requireAuth, requireAdmin, deleteEmployee);

export default router;
