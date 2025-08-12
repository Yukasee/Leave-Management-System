import { Response } from "express";
import prisma from "../utils/prismaClient";
import { AuthRequest } from "../middlewares/auth";

/**
 * Employee applies for leave
 */
export const applyLeave = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== "EMPLOYEE") {
            return res.status(403).json({ error: "Only employees can apply for leave" });
        }

        const { startDate, endDate, type, reason } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Start date and end date are required" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        if (start > end) {
            return res.status(400).json({ error: "Start date cannot be after end date" });
        }

        if (start < today) {
            return res.status(400).json({ error: "Cannot apply for leave in the past" });
        }

        const employee = await prisma.employee.findUnique({
            where: { id: req.user.employeeId }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        if (start < employee.joiningDate) {
            return res.status(400).json({
                error: `You cannot apply for leave before your joining date (${employee.joiningDate.toISOString().split('T')[0]})`
            });
        }
        
        // Check overlapping leaves for same employee
        const overlapping = await prisma.leave.findFirst({
            where: {
                employeeId: req.user.employeeId!,
                status: { in: ["PENDING", "APPROVED"] },
                OR: [
                    { startDate: { lte: end }, endDate: { gte: start } }
                ]
            }
        });

        if (overlapping) {
            return res.status(409).json({ error: "Overlapping leave request exists" });
        }

        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (type === "ANNUAL" && employee.defaultAnnualDays < days) {
            return res.status(400).json({
                error: `Insufficient leave balance. You have ${employee.defaultAnnualDays} days left.`
            });
        }

        const leave = await prisma.leave.create({
            data: {
                employeeId: req.user.employeeId!,
                startDate: start,
                endDate: end,
                days,
                type,
                reason,
            },
        });

        res.status(201).json({ message: "Leave request submitted", leave });
    } catch (err) {
        console.error("Error applying for leave:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get leaves (Employee = own leaves, Admin = all leaves)
 */
export const getLeaves = async (req: AuthRequest, res: Response) => {
    try {
        let leaves;

        if (req.user?.role === "ADMIN") {
            leaves = await prisma.leave.findMany({
                include: { employee: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: "desc" },
            });
        } else {
            leaves = await prisma.leave.findMany({
                where: { employeeId: req.user?.employeeId },
                orderBy: { createdAt: "desc" },
            });
        }

        res.json(leaves);
    } catch (err) {
        console.error("Error fetching leaves:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Admin updates leave status (approve/reject)
 */
export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Only admin can update leave status" });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const leave = await prisma.leave.findUnique({
            where: { id: Number(id) },
            include: { employee: true }
        });

        if (!leave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        // Deduct balance only for APPROVED annual leaves
        if (status === "APPROVED" && leave.type === "ANNUAL") {
            const employee = await prisma.employee.findUnique({
                where: { id: leave.employeeId }
            });

            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }

            if (employee.defaultAnnualDays < leave.days) {
                return res.status(400).json({ error: "Not enough leave balance" });
            }

            await prisma.employee.update({
                where: { id: employee.id },
                data: { defaultAnnualDays: employee.defaultAnnualDays - leave.days }
            });
        }

        const updatedLeave = await prisma.leave.update({
            where: { id: leave.id },
            data: { status },
            include: {
                employee: {
                    select: { id: true, name: true, email: true, defaultAnnualDays: true }
                }
            }
        });

        res.json(updatedLeave);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
