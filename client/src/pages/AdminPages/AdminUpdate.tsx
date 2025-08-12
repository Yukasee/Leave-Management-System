import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function UpdateEmployee() {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        joiningDate: "",
        defaultAnnualDays: 20,
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        if (!id) return;
        fetch(BACKEND_URL+`/employees/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    department: data.department || "",
                    joiningDate: data.joiningDate
                        ? new Date(data.joiningDate).toISOString().slice(0, 10)
                        : "",
                    defaultAnnualDays: data.defaultAnnualDays || 20,
                });
            })
            .catch((err) => setError("Failed to load employee data"));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(BACKEND_URL+`/employees/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update employee");
            }
            alert("Employee updated successfully");
            navigate("/admin/employees");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <AdminNavbar />
            <main
                style={{
                    padding: "2rem",
                    maxWidth: "600px",
                    margin: "auto",
                    backgroundColor: "#fff",
                    color: "#111",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    minHeight: "100vh",
                }}
            >
                <h1 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "1rem" }}>
                    Update Employee
                </h1>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    <input
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="Department"
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    <input
                        type="date"
                        name="joiningDate"
                        value={form.joiningDate}
                        onChange={handleChange}
                        required
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    <input
                        type="number"
                        name="defaultAnnualDays"
                        value={form.defaultAnnualDays}
                        onChange={handleChange}
                        min={0}
                        placeholder="Default Annual Leave Days"
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "#000",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                fontWeight: "600",
                                cursor: "pointer",
                                border: "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/employees")}
                            style={{
                                backgroundColor: "#555",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                fontWeight: "600",
                                cursor: "pointer",
                                border: "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#777")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#555")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
