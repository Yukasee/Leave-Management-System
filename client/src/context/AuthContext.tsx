// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../api/axios";

interface User {
    id: number;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
    employeeId?: number;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setUser(res.data); // Make sure backend returns id, email, role, employeeId
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            api
                .get("http://localhost:8000/auth/me")
                .then(res => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
