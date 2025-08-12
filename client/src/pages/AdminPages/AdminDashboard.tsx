import { useEffect, useState } from "react";
import { FaUsers, FaBuilding, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";

const cardColors = {
    green: "#22c55e",   // green-500
    yellow: "#eab308",  // yellow-500
    teal: "#14b8a6",    // teal-500
    red: "#ef4444",     // red-500
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        leaveApplied: 0,
        leaveApproved: 0,
        leavePending: 0,
        leaveRejected: 0,
    });
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        fetch(BACKEND_URL+"/api/admin/stats", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <AdminNavbar />
            <main style={{ padding: "2rem", maxWidth: "960px", margin: "auto" }}>
                <h1 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "1.5rem" }}>Welcome, Admin</h1>

                <section style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontWeight: "600", fontSize: "1.4rem", marginBottom: "1rem" }}>Dashboard Overview</h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        <Card icon={<FaUsers />} title="Total Employees" value={stats.totalEmployees} color={cardColors.green} />
                        <Card icon={<FaBuilding />} title="Total Departments" value={stats.totalDepartments} color={cardColors.yellow} />
                    </div>
                </section>

                <section>
                    <h2 style={{ fontWeight: "600", fontSize: "1.4rem", marginBottom: "1rem" }}>Leave Details</h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        <Card icon={<FaFileAlt />} title="Leave Applied" value={stats.leaveApplied} color={cardColors.teal} />
                        <Card icon={<FaCheckCircle />} title="Leave Approved" value={stats.leaveApproved} color={cardColors.green} />
                        <Card icon={<FaHourglassHalf />} title="Leave Pending" value={stats.leavePending} color={cardColors.yellow} />
                        <Card icon={<FaTimesCircle />} title="Leave Rejected" value={stats.leaveRejected} color={cardColors.red} />
                    </div>
                </section>
            </main>
        </>
    );
}

function Card({ icon, title, value, color }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <div
                style={{
                    backgroundColor: color,
                    color: "white",
                    padding: "0.5rem",
                    borderRadius: "9999px",
                    fontSize: "1.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "42px",
                    minHeight: "42px",
                }}
            >
                {icon}
            </div>
            <div>
                <p style={{ fontWeight: "600", fontSize: "1rem", margin: 0 }}>{title}</p>
                <p style={{ fontWeight: "700", fontSize: "1.6rem", margin: 0 }}>{value}</p>
            </div>
        </div>
    );
}
