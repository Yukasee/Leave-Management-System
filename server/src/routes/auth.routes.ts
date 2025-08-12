import { Router } from "express";
import { createEmployeeAccount, login, getProfile } from "../controller/auth.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import prisma from "../utils/prismaClient";
import bcrypt from "bcrypt";
const router = Router();

router.post("/create-employee", requireAuth, requireAdmin, createEmployeeAccount);
router.post("/login", login);
router.get("/me", requireAuth, getProfile);

router.post("/register-admin", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const admin = await prisma.user.create({
            data: {
                email,
                passwordHash: hashed,
                role: "ADMIN"
            }
        });

        res.json({ message: "Admin created successfully", admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;
