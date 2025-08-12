import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminEmployees() {
    const [employees, setEmployees] = useState<any[]>([]);
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        fetch(BACKEND_URL+"/employees", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => setEmployees(data))
            .catch((err) => console.error(err));
    }, []);

    const deleteEmployee = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        fetch(BACKEND_URL+`/employees/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete employee");
                setEmployees((prev) => prev.filter((e) => e.id !== id));
            })
            .catch((err) => alert(err.message));
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
                    color: "#111",
                    minHeight: "100vh",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h1 style={{ fontWeight: "700", fontSize: "1.8rem", color: "#000" }}>Employees</h1>
                    <Link
                        to="/admin/employees/add"
                        style={{
                            backgroundColor: "#000",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            textDecoration: "none",
                            userSelect: "none",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
                    >
                        Add Employee
                    </Link>
                </div>

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
                    <thead style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #222" }}>
                        <tr>
                            {["ID", "Name", "Email", "Department", "Joining Date", "Actions"].map((header) => (
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
                        {employees.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    style={{
                                        padding: "1rem",
                                        textAlign: "center",
                                        color: "#555",
                                        fontStyle: "italic",
                                    }}
                                >
                                    No employee records found
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr
                                    key={emp.id}
                                    style={{ cursor: "default", transition: "background-color 0.2s ease" }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#f0f0f0";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent";
                                    }}
                                >
                                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #ddd", color: "#111" }}>
                                        {emp.id}
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #ddd", color: "#111" }}>
                                        {emp.name}
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #ddd", color: "#111" }}>
                                        {emp.email}
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #ddd", color: "#111" }}>
                                        {emp.department || "-"}
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #ddd", color: "#111" }}>
                                        {new Date(emp.joiningDate).toLocaleDateString()}
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
                                            onClick={() => navigate(`/admin/employees/update/${emp.id}`)}
                                            style={{
                                                backgroundColor: "#000",
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
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#222";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#000";
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => deleteEmployee(emp.id)}
                                            style={{
                                                backgroundColor: "#555",
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
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#777";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#555";
                                            }}
                                        >
                                            Delete
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
