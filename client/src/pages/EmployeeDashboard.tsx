import { useEffect, useState } from "react";

interface Leave {
    id: number;
    startDate: string;
    endDate: string;
    days: number;
    type: "ANNUAL" | "SICK";
    reason: string;
    status: string;
}

export default function EmployeeDashboard() {
    const [leaveBalance, setLeaveBalance] = useState<number>(0);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        type: "ANNUAL",
        reason: ""
    });

    // Fetch profile + leaves
    useEffect(() => {
        fetch("http://localhost:8000/auth/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => {
                setLeaveBalance(data.employee?.defaultAnnualDays || 0);
            })
            .catch(err => console.error(err));

        fetch("http://localhost:8000/leaves", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setLeaves(data))
            .catch(err => console.error(err));
    }, []);

    // Apply for leave
    const applyLeave = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("http://localhost:8000/leaves", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form)
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || "Failed to apply leave");
            return;
        }

        alert("Leave applied successfully!");
        setForm({ startDate: "", endDate: "", type: "ANNUAL", reason: "" });

        // Refresh leave list
        const updated = await fetch("http://localhost:8000/leaves", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(r => r.json());
        setLeaves(updated);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top Bar */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Employee Dashboard</h1>
                <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                >
                    Logout
                </button>
            </header>

            <main className="p-6 flex-1 space-y-6">
                {/* Leave Balance */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">Leave Balance</h2>
                    <p className="text-2xl font-bold">{leaveBalance} days</p>
                </div>

                {/* Apply Leave Form */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Apply for Leave</h2>
                    <form className="space-y-4" onSubmit={applyLeave}>
                        <div>
                            <label className="block mb-1">Start Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={form.startDate}
                                onChange={e => setForm({ ...form, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">End Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={form.endDate}
                                onChange={e => setForm({ ...form, endDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Type</label>
                            <select
                                className="border p-2 rounded w-full"
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="ANNUAL">Annual</option>
                                <option value="SICK">Sick</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Reason</label>
                            <textarea
                                className="border p-2 rounded w-full"
                                value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Apply Leave
                        </button>
                    </form>
                </div>

                {/* Leave History */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">My Leave History</h2>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">Type</th>
                                <th className="p-2 border">Start</th>
                                <th className="p-2 border">End</th>
                                <th className="p-2 border">Days</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={leave.id}>
                                    <td className="p-2 border">{leave.type}</td>
                                    <td className="p-2 border">{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className="p-2 border">{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className="p-2 border">{leave.days}</td>
                                    <td
                                        className={`p-2 border font-bold ${leave.status === "APPROVED"
                                                ? "text-green-600"
                                                : leave.status === "REJECTED"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                            }`}
                                    >
                                        {leave.status}
                                    </td>
                                </tr>
                            ))}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-2 border text-center text-gray-500">
                                        No leave records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
