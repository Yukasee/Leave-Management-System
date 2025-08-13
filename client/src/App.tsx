// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Authentication/Login";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeePages/EmployeeDashboard";
import AdminEmployees from "./pages/AdminPages/AdminEmployees";
import AdminDepartments from "./pages/AdminPages/AdminDepartment";
import AdminLeaves from "./pages/AdminPages/AdminLeaves";
import ProtectedRoute from "./components/ProtectedRoute";
import AddEmployee from "./pages/AdminPages/AdminAddEmployee";
import UpdateEmployee from "./pages/AdminPages/AdminUpdate";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>}/>

         
          <Route path="/admin/employees/add"
            element={
              <ProtectedRoute role="ADMIN">
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/employees/update/:id"
            element={
              <ProtectedRoute role="ADMIN">
                <UpdateEmployee />
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

          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
