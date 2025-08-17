import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AccountSettings = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const adminId = adminData?._id;

  const [admin, setAdmin] = useState({ admin_name: "", admin_email: "" });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  // ✅ Load current admin info
  useEffect(() => {
    if (!adminToken || !adminId) {
      navigate("/admin/login");
      return;
    }

    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admins/${adminId}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setAdmin(res.data); 
      } catch (err) {
        toast.error("❌ Failed to fetch admin data");
      }
    };
    fetchAdmin();
  }, [adminId, adminToken, navigate]);

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admins/${adminId}`, admin, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("✅ Profile updated");
    } catch (err) {
      toast.error("❌ Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    const { old, new: newPass, confirm } = passwords;
    if (!old || !newPass || !confirm) return toast.error("❗ Fill all password fields");
    if (newPass !== confirm) return toast.error("❌ Passwords do not match");

    try {
      // Add console.log to debug
      console.log('Sending request with token:', adminToken);
      console.log('Admin ID:', adminId);
      
      const response = await axios.patch(
        `http://localhost:5000/api/admins/password/${adminId}`,
        { oldPassword: old, newPassword: newPass },
        { 
          headers: { 
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // Add timeout to prevent infinite pending
        }
      );
      
      console.log('Response:', response.data);
      toast.success("✅ Password updated");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      console.error('Password update error:', err);
      if (err.code === 'ECONNABORTED') {
        toast.error("❌ Request timeout - server not responding");
      } else {
        toast.error(err?.response?.data?.error || "❌ Failed to update password");
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete your account permanently?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("✅ Account deleted");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      setTimeout(() => navigate("/admin/login"), 1000);
    } catch (err) {
      toast.error("❌ Failed to delete account");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-inter">
      <ToastContainer />
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Account Settings</h2>
        <p className="text-gray-500">Manage your personal information, security and preferences.</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Admin Name"
            value={admin.admin_name}
            onChange={(e) => setAdmin({ ...admin, admin_name: e.target.value })}
            className="border rounded-xl px-4 py-3 h-12 w-full"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={admin.admin_email}
            onChange={(e) => setAdmin({ ...admin, admin_email: e.target.value })}
            className="border rounded-xl px-4 py-3 h-12 w-full"
          />
        </div>
        <button onClick={handleProfileUpdate} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 mt-4">
          Save Changes
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold">Password & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={passwords.old}
            onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
            className="border rounded-xl px-4 py-3 h-12 w-full"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="border rounded-xl px-4 py-3 h-12 w-full"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="border rounded-xl px-4 py-3 h-12 w-full md:col-span-2"
          />
        </div>
        <button onClick={handlePasswordChange} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 mt-4">
          Save Password
        </button>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold">Account Actions</h3>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <button onClick={handleLogout} className="bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300">
            Logout
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700">
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
