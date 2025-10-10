import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/dashboard/users";
  const token = localStorage.getItem("token"); // if protected route

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }, // optional
      });
      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#1565c0] mb-6 text-center">
        Admin Users Dashboard
      </h1>

      {/* Total Users Card */}
      <div className="flex justify-center mb-6">
        <div className="bg-white shadow rounded-lg p-6 w-64 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-2xl font-bold text-[#1565c0]">{totalUsers}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#1565c0] text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
