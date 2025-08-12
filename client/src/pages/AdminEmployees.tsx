import { useEffect, useState } from "react";

export default function AdminEmployees() {
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/employees", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Employees</h1>
            <table className="w-full border-collapse bg-white shadow">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Department</th>
                        <th className="p-2 border">Joining Date</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-100">
                            <td className="p-2 border">{emp.id}</td>
                            <td className="p-2 border">{emp.name}</td>
                            <td className="p-2 border">{emp.email}</td>
                            <td className="p-2 border">{emp.department || "-"}</td>
                            <td className="p-2 border">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
