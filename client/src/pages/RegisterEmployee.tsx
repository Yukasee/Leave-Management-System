// src/pages/RegisterEmployee.tsx
import { useState } from "react";
import api from "../api/axios";

export default function RegisterEmployee() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        joiningDate: "",
        defaultAnnualDays: 20,
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register-employee", form);
            setMessage(res.data.message);
        } catch (err:any) {
            setMessage(err.response?.data?.error || "Error registering employee");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Register Employee</h2>
                {message && <p>{message}</p>}
                <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-4" />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-4" />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-4" />
                <input name="department" placeholder="Department" onChange={handleChange} className="border p-2 w-full mb-4" />
                <input name="joiningDate" type="date" onChange={handleChange} className="border p-2 w-full mb-4" />
                <input name="defaultAnnualDays" placeholder="Annual Leaves" type="number" onChange={handleChange} className="border p-2 w-full mb-4" />
                <button className="bg-green-500 text-white p-2 w-full rounded">Register</button>
            </form>
        </div>
    );
}
