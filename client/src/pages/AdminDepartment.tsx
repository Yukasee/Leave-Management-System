import { useEffect, useState } from "react";

export default function AdminDepartments() {
    const [departments, setDepartments] = useState<string[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/employees", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => {
                const uniqueDeps = Array.from(new Set(data.map((emp: any) => emp.department).filter(Boolean)));
                setDepartments(uniqueDeps);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Departments</h1>
            <ul className="bg-white shadow rounded p-4 space-y-2">
                {departments.map(dep => (
                    <li key={dep} className="p-2 border rounded hover:bg-gray-100">{dep}</li>
                ))}
            </ul>
        </div>
    );
}
