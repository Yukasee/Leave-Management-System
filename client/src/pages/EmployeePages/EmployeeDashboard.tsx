import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Leave {
    id: number;
    startDate: string;
    endDate: string;
    days: number;
    type: "ANNUAL" | "SICK" | "CASUAL" | "UNPAID";
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
    const [view, setView] = useState<"status" | "apply">("status");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        fetch(BACKEND_URL+"/auth/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => res.json())
            .then((data) => {
                setLeaveBalance(data.employee?.defaultAnnualDays || 0);
            })
            .catch((err) => console.error(err));

        fetch(BACKEND_URL+"/leaves", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => res.json())
            .then((data) => setLeaves(data))
            .catch((err) => console.error(err));
    }, []);

    const applyLeave = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(BACKEND_URL+"/leaves", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form)
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error(err.error || "Failed to apply leave");
            return;
        }

        toast.success("Leave applied successfully!");
        setForm({ startDate: "", endDate: "", type: "ANNUAL", reason: "" });

        // Refresh leaves
        const updated = await fetch(BACKEND_URL+"/leaves", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then((r) => r.json());
        setLeaves(updated);

        setView("status"); // Switch to status after applying
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#fff",
                color: "#000",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <header
                style={{
                    padding: "1rem 2rem",
                    borderBottom: "1px solid #000",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <h1 style={{ fontWeight: "700", fontSize: "1.5rem" }}>Employee Dashboard</h1>

                {/* Navigation Links */}
                <nav style={{ display: "flex", gap: "1rem" }}>
                    <button
                        onClick={() => setView("status")}
                        style={{
                            background: view === "status" ? "#000" : "transparent",
                            color: view === "status" ? "#fff" : "#000",
                            border: "2px solid #000",
                            padding: "0.4rem 1.2rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            borderRadius: "4px",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (view !== "status") {
                                (e.target as HTMLButtonElement).style.backgroundColor = "#000";
                                (e.target as HTMLButtonElement).style.color = "#fff";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (view !== "status") {
                                (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                                (e.target as HTMLButtonElement).style.color = "#000";
                            }
                        }}
                    >
                        Leave Status
                    </button>

                    <button
                        onClick={() => setView("apply")}
                        style={{
                            background: view === "apply" ? "#000" : "transparent",
                            color: view === "apply" ? "#fff" : "#000",
                            border: "2px solid #000",
                            padding: "0.4rem 1.2rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            borderRadius: "4px",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (view !== "apply") {
                                (e.target as HTMLButtonElement).style.backgroundColor = "#000";
                                (e.target as HTMLButtonElement).style.color = "#fff";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (view !== "apply") {
                                (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                                (e.target as HTMLButtonElement).style.color = "#000";
                            }
                        }}
                    >
                        Apply Leave
                    </button>
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                    style={{
                        background: "none",
                        border: "2px solid #000",
                        color: "#000",
                        padding: "0.4rem 1.2rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        borderRadius: "4px",
                        transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#000";
                        (e.target as HTMLButtonElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                        (e.target as HTMLButtonElement).style.color = "#000";
                    }}
                >
                    Logout
                </button>
            </header>

            <main style={{ flex: 1, padding: "2rem", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
                {view === "status" && (
                    <>
                        <section
                            style={{
                                marginBottom: "2.5rem",
                                padding: "1.5rem",
                                border: "2px solid #000",
                                borderRadius: "6px",
                                textAlign: "center"
                            }}
                        >
                            <h2 style={{ margin: "0 0 0.5rem 0", fontWeight: "700", fontSize: "1.25rem" }}>Leave Balance</h2>
                            <p style={{ fontSize: "3rem", margin: 0, fontWeight: "900", letterSpacing: "0.05em" }}>{leaveBalance} days</p>
                        </section>

                        <section style={{ padding: "1.5rem", border: "2px solid #000", borderRadius: "6px" }}>
                            <h2 style={{ marginBottom: "1rem", fontWeight: "700", fontSize: "1.25rem" }}>My Leave History</h2>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        {["Type", "Start", "End", "Days", "Status"].map((header) => (
                                            <th
                                                key={header}
                                                style={{
                                                    borderBottom: "2px solid #000",
                                                    padding: "0.75rem 0.5rem",
                                                    fontWeight: "700",
                                                    textAlign: "left",
                                                    userSelect: "none"
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ padding: "1rem", textAlign: "center", fontStyle: "italic", color: "#555" }}>
                                                No leave records found
                                            </td>
                                        </tr>
                                    )}

                                    {leaves.map((leave) => {
                                        let statusColor = "#000";
                                        if (leave.status === "APPROVED") statusColor = "#008000"; // green
                                        else if (leave.status === "REJECTED") statusColor = "#B22222"; // firebrick red
                                        else if (leave.status === "PENDING") statusColor = "#FFA500"; // orange

                                        return (
                                            <tr key={leave.id} style={{ borderTop: "1px solid #000" }}>
                                                <td style={{ padding: "0.5rem" }}>{leave.type}</td>
                                                <td style={{ padding: "0.5rem" }}>{new Date(leave.startDate).toLocaleDateString()}</td>
                                                <td style={{ padding: "0.5rem" }}>{new Date(leave.endDate).toLocaleDateString()}</td>
                                                <td style={{ padding: "0.5rem" }}>{leave.days}</td>
                                                <td style={{ padding: "0.5rem", fontWeight: "700", color: statusColor }}>{leave.status}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </section>
                    </>
                )}

                {view === "apply" && (
                    <section style={{ padding: "1.5rem", border: "2px solid #000", borderRadius: "6px" }}>
                        <h2 style={{ marginBottom: "1rem", fontWeight: "700", fontSize: "1.25rem" }}>Apply for Leave</h2>
                        <form
                            onSubmit={applyLeave}
                            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
                        >
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label htmlFor="startDate" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                                    Start Date
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    required
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    style={{
                                        padding: "0.5rem",
                                        border: "1.5px solid #000",
                                        borderRadius: "4px",
                                        fontSize: "1rem",
                                        backgroundColor: "#fff",
                                        color: "#000"
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label htmlFor="endDate" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                                    End Date
                                </label>
                                <input
                                    id="endDate"
                                    type="date"
                                    required
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    style={{
                                        padding: "0.5rem",
                                        border: "1.5px solid #000",
                                        borderRadius: "4px",
                                        fontSize: "1rem",
                                        backgroundColor: "#fff",
                                        color: "#000"
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label htmlFor="type" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                                    Type
                                </label>
                                <select
                                    id="type"
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                    style={{
                                        padding: "0.5rem",
                                        border: "1.5px solid #000",
                                        borderRadius: "4px",
                                        fontSize: "1rem",
                                        backgroundColor: "#fff",
                                        color: "#000"
                                    }}
                                >
                                    <option value="ANNUAL">Annual</option>
                                    <option value="SICK">Sick</option>
                                    <option value="CASUAL">Casual</option>
                                    <option value="UNPAID">Unpaid</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}>
                                <label htmlFor="reason" style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                                    Reason
                                </label>
                                <textarea
                                    id="reason"
                                    required
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                    rows={3}
                                    style={{
                                        padding: "0.5rem",
                                        border: "1.5px solid #000",
                                        borderRadius: "4px",
                                        fontSize: "1rem",
                                        resize: "vertical",
                                        backgroundColor: "#fff",
                                        color: "#000"
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    gridColumn: "1 / -1",
                                    padding: "0.75rem",
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    marginTop: "1rem",
                                    transition: "background-color 0.3s ease"
                                }}
                                onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#333")}
                                onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#000")}
                            >
                                Apply Leave
                            </button>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
}
