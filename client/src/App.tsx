// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import RegisterEmployee from "./pages/RegisterEmployee";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminEmployees from "./pages/AdminEmployees";
import AdminDepartments from "./pages/AdminDepartment";
import AdminLeaves from "./pages/AdminLeaves";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>}/>

          {/* Admin-only */}
          <Route
            path="/register"
            element={
              <ProtectedRoute role="ADMIN">
                <RegisterEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLeaves />
              </ProtectedRoute>
            }
          />

          {/* Employee-only */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
