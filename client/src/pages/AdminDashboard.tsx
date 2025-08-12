// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaUsers, FaBuilding, FaFileAlt,
    FaCheckCircle, FaHourglassHalf, FaTimesCircle
} from "react-icons/fa";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        leaveApplied: 0,
        leaveApproved: 0,
        leavePending: 0,
        leaveRejected: 0
    });

    useEffect(() => {
        // Fetch stats from backend
        fetch("http://localhost:8000/api/admin/stats", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-slate-700">
                    Employee MS
                </div>
                <nav className="flex-1 p-4 space-y-3">
                    <Link className="block p-2 rounded hover:bg-slate-700" to="/admin/dashboard">Dashboard</Link>
                    <Link className="block p-2 rounded hover:bg-slate-700" to="/admin/employees">Employees</Link>
                    <Link className="block p-2 rounded hover:bg-slate-700" to="/admin/departments">Departments</Link>
                    <Link className="block p-2 rounded hover:bg-slate-700" to="/admin/leaves">Leaves</Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-100">
                {/* Top bar */}
                <header className="flex justify-between items-center p-4 bg-white shadow">
                    <h1 className="text-xl font-bold">Welcome, Admin</h1>
                    <button
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </button>
                </header>

                {/* Dashboard Overview */}
                <section className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card icon={<FaUsers size={24} />} title="Total Employees" value={stats.totalEmployees} color="bg-green-500" />
                        <Card icon={<FaBuilding size={24} />} title="Total Departments" value={stats.totalDepartments} color="bg-yellow-500" />
                    </div>
                </section>

                {/* Leave Details */}
                <section className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Leave Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card icon={<FaFileAlt size={24} />} title="Leave Applied" value={stats.leaveApplied} color="bg-teal-500" />
                        <Card icon={<FaCheckCircle size={24} />} title="Leave Approved" value={stats.leaveApproved} color="bg-green-500" />
                        <Card icon={<FaHourglassHalf size={24} />} title="Leave Pending" value={stats.leavePending} color="bg-yellow-500" />
                        <Card icon={<FaTimesCircle size={24} />} title="Leave Rejected" value={stats.leaveRejected} color="bg-red-500" />
                    </div>
                </section>
            </main>
        </div>
    );
}

function Card({ icon, title, value, color }: any) {
    return (
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
            <div className={`${color} text-white p-3 rounded-full mr-4`}>
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}
