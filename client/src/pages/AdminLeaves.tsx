import { useEffect, useState } from "react";

export default function AdminLeaves() {
    const [leaves, setLeaves] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/leaves", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setLeaves(data))
            .catch(err => console.error(err));
    }, []);

    const updateStatus = (id: number, status: string) => {
        fetch(`http://localhost:8000/leaves/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ status })
        })
            .then(res => res.json())
            .then(() => {
                setLeaves(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>
            <table className="w-full border-collapse bg-white shadow">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Employee</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Dates</th>
                        <th className="p-2 border">Days</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map(leave => (
                        <tr key={leave.id} className="hover:bg-gray-100">
                            <td className="p-2 border">{leave.id}</td>
                            <td className="p-2 border">{leave.employee?.name}</td>
                            <td className="p-2 border">{leave.type}</td>
                            <td className="p-2 border">
                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </td>
                            <td className="p-2 border">{leave.days}</td>
                            <td className="p-2 border">{leave.status}</td>
                            <td className="p-2 border space-x-2">
                                <button
                                    onClick={() => updateStatus(leave.id, "APPROVED")}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => updateStatus(leave.id, "REJECTED")}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
