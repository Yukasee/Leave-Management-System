import express,{Request,Response} from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import employeesRouter from "./routes/employees.routes";
import leaveRouter from "./routes/leave.routes";
import adminRoutes from "./routes/admin.routes";
import cors from "cors";
import path = require("path");
dotenv.config({});


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use('/employees', employeesRouter);
app.use('/leaves', leaveRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("Hii from Server");
});

const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, "client/dist"))); 
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirnamePath, "client/dist", "index.html"));
});

app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:"+PORT);
})