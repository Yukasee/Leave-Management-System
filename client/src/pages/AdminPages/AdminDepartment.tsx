import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

export default function AdminDepartments() {
    const [departments, setDepartments] = useState<string[]>([]);
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        fetch(BACKEND_URL+"/employees", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const uniqueDeps = Array.from(
                    new Set(data.map((emp: any) => emp.department).filter(Boolean))
                );
                setDepartments(uniqueDeps);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <AdminNavbar />
            <main style={{ padding: "2rem", maxWidth: "960px", margin: "auto" }}>
                <h1 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "1.5rem" }}>Departments</h1>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {departments.length === 0 ? (
                        <p style={{ fontStyle: "italic", color: "#6b7280" }}>No departments found</p>
                    ) : (
                        departments.map((dep) => (
                            <li
                                key={dep}
                                style={{
                                    padding: "0.6rem 1rem",
                                    backgroundColor: "#e0f2fe", // light blue
                                    borderRadius: "8px",
                                    color: "#0369a1", // blue-700
                                    fontWeight: "600",
                                    userSelect: "none",
                                }}
                            >
                                {dep}
                            </li>
                        ))
                    )}
                </ul>
            </main>
        </>
    );
}
