
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

import { useAuth } from "../context/AuthContext";

interface Props {
    children: JSX.Element;
    role?: "ADMIN" | "EMPLOYEE";
}

export default function ProtectedRoute({ children, role }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}
