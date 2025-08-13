import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

interface User {
    id: number;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
    employeeId?: number | null;
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

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const login = async (email: string, password: string) => {
        try {
            // 1️⃣ Login request
            const res = await api.post("/auth/login", { email, password });

            // 2️⃣ Save token in localStorage
            localStorage.setItem("token", res.data.token);
            
            api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

            // 3️⃣ Fetch full user details
            const meRes = await api.get(`${BACKEND_URL}/auth/me`);
            localStorage.setItem("user", JSON.stringify(meRes.data));
            localStorage.setItem('role', meRes.data.role);
            setUser(meRes.data);
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    // Load user on first render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            api.get(`${BACKEND_URL}/auth/me`)
                .then(res => {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    setUser(res.data);
                })
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
