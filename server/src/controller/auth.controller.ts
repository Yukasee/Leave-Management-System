import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import { AuthRequest } from "../middlewares/auth";

/**
 * Admin creates employee account
 */
export const createEmployeeAccount = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, department, joiningDate, password, defaultAnnualDays } = req.body;

        if (!name || !email || !joiningDate || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create employee
        const employee = await prisma.employee.create({
            data: {
                name,
                email,
                department,
                joiningDate: new Date(),
                defaultAnnualDays: defaultAnnualDays || 20,
            },
        });

        // Create user linked to employee
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: "EMPLOYEE",
                employee: { connect: { id: employee.id } },
            },
        });

        // Link back userId in employee
        await prisma.employee.update({
            where: { id: employee.id },
            data: { userId: user.id },
        });

        res.status(201).json({ message: "Employee account created successfully", employee });
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(409).json({ error: "Email already exists" });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * User login (Admin or Employee)
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { employee: true },
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                employeeId: user.employee?.id || undefined,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get logged-in user profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { employee: true },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
