import { Link, useLocation } from "react-router-dom";

const navLinks = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Employees", to: "/admin/employees" },
    { label: "Departments", to: "/admin/departments" },
    { label: "Leaves", to: "/admin/leaves" },
];

export default function AdminNavbar() {
    const location = useLocation();

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 2rem",
                backgroundColor: "#f8fafc", // very light blue-gray
                borderBottom: "1px solid #e2e8f0", // light border
                position: "sticky",
                top: 0,
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    color: "#FFFFF", // blue-600
                    userSelect: "none",
                }}
            >
                Leave Manager Admin
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                {navLinks.map(({ label, to }) => {
                    const isActive = location.pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontWeight: isActive ? "700" : "500",
                                color: isActive ? "#2563eb" : "#374151", // blue or gray-700
                                borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                                transition: "all 0.3s ease",
                                userSelect: "none",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLAnchorElement).style.color = "#2563eb";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLAnchorElement).style.color = "#374151";
                                }
                            }}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
                style={{
                    backgroundColor: "#ef4444", // red-500
                    color: "white",
                    border: "none",
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626"; // red-600
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ef4444"; // red-500
                }}
            >
                Logout
            </button>
        </nav>
    );
}
