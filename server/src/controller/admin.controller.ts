import { Response } from "express";
import prisma from "../utils/prismaClient";
import { AuthRequest } from "../middlewares/auth";


export const getAdminStats = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden — Admin access only" });
        }

        const totalEmployees = await prisma.employee.count();
        const departments = await prisma.employee.findMany({
            select: { department: true },
            distinct: ["department"]
        });
        const totalDepartments = departments.length;

        const leaveApplied = await prisma.leave.count();
        const leaveApproved = await prisma.leave.count({ where: { status: "APPROVED" } });
        const leavePending = await prisma.leave.count({ where: { status: "PENDING" } });
        const leaveRejected = await prisma.leave.count({ where: { status: "REJECTED" } });

        res.json({
            totalEmployees,
            totalDepartments,
            leaveApplied,
            leaveApproved,
            leavePending,
            leaveRejected
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
