import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

export default function AdminLeaves() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        fetch(BACKEND_URL+"/leaves", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => setLeaves(data))
            .catch((err) => console.error(err));
    }, []);

    const updateStatus = (id: number, status: string) => {
        fetch(BACKEND_URL+`/leaves/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status }),
        })
            .then((res) => res.json())
            .then(() => {
                setLeaves((prev) =>
                    prev.map((l) => (l.id === id ? { ...l, status } : l))
                );
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
            <AdminNavbar />
            <main
                style={{
                    padding: "2rem",
                    maxWidth: "960px",
                    margin: "auto",
                    overflowX: "auto",
                    backgroundColor: "#fff",
                    color: "#111", // dark text
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    minHeight: "100vh",
                }}
            >
                <h1
                    style={{
                        fontWeight: "700",
                        fontSize: "1.8rem",
                        marginBottom: "1.5rem",
                        color: "#000",
                    }}
                >
                    Leave Requests
                </h1>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 6px rgb(0 0 0 / 0.1)",
                        overflow: "hidden",
                    }}
                >
                    <thead
                        style={{
                            backgroundColor: "#f5f5f5",
                            borderBottom: "2px solid #222",
                        }}
                    >
                        <tr>
                            {[
                                "ID",
                                "Employee",
                                "Type",
                                "Dates",
                                "Days",
                                "Status",
                                "Actions",
                            ].map((header) => (
                                <th
                                    key={header}
                                    style={{
                                        padding: "0.75rem 1rem",
                                        fontWeight: "600",
                                        textAlign: "left",
                                        borderBottom: "2px solid #ccc",
                                        color: "#222",
                                        userSelect: "none",
                                    }}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        padding: "1rem",
                                        textAlign: "center",
                                        color: "#555",
                                        fontStyle: "italic",
                                    }}
                                >
                                    No leave requests found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => (
                                <tr
                                    key={leave.id}
                                    style={{
                                        cursor: "default",
                                        transition: "background-color 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                                            "#f0f0f0"; // light gray on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            color: "#111",
                                        }}
                                    >
                                        {leave.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            color: "#111",
                                        }}
                                    >
                                        {leave.employee?.name}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            color: "#111",
                                        }}
                                    >
                                        {leave.type}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            color: "#111",
                                        }}
                                    >
                                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
                                        {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            color: "#111",
                                        }}
                                    >
                                        {leave.days}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            color:
                                                leave.status === "APPROVED"
                                                    ? "#16a34a" // green
                                                    : leave.status === "REJECTED"
                                                        ? "#dc2626" // red
                                                        : "#6b7280", // gray for pending/others
                                            fontWeight: "600",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {leave.status}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderBottom: "1px solid #ddd",
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <button
                                            onClick={() => updateStatus(leave.id, "APPROVED")}
                                            style={{
                                                backgroundColor: "#000", // black button
                                                color: "white",
                                                border: "none",
                                                padding: "0.4rem 0.8rem",
                                                borderRadius: "6px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                transition: "background-color 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                                    "#222"; // slightly lighter black
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                                    "#000";
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(leave.id, "REJECTED")}
                                            style={{
                                                backgroundColor: "#555", // dark gray button
                                                color: "white",
                                                border: "none",
                                                padding: "0.4rem 0.8rem",
                                                borderRadius: "6px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                transition: "background-color 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                                    "#777"; // lighter gray
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                                    "#555";
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </main>
        </>
    );
}
