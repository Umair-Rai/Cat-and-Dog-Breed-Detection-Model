import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  KeyIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  UsersIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Select from '../../components/Select';
import "react-toastify/dist/ReactToastify.css";

const AccountSettings = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const adminId = adminData?._id;

  // Current admin state
  const [admin, setAdmin] = useState({ admin_name: "", admin_email: "" });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  
  // Admin management state
  const [allAdmins, setAllAdmins] = useState([]);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    admin_name: "",
    admin_email: "",
    admin_pass: "",
    confirmPassword: "",
    role: "admin"
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Load current admin info and all admins
  useEffect(() => {
    if (!adminToken || !adminId) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current admin
        const adminRes = await axios.get(`http://localhost:5000/api/admins/${adminId}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setAdmin(adminRes.data);
        
        // Fetch all admins
        const allAdminsRes = await axios.get('http://localhost:5000/api/admins', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setAllAdmins(allAdminsRes.data);
      } catch (err) {
        toast.error("❌ Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [adminId, adminToken, navigate]);

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admins/${adminId}`, admin, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("✅ Profile updated successfully");
      
      // Update localStorage
      const updatedAdminData = { ...adminData, ...admin };
      localStorage.setItem("adminData", JSON.stringify(updatedAdminData));
    } catch (err) {
      toast.error("❌ Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    const { old, new: newPass, confirm } = passwords;
    if (!old || !newPass || !confirm) {
      return toast.error("❗ Please fill all password fields");
    }
    if (newPass !== confirm) {
      return toast.error("❌ New passwords do not match");
    }
    if (newPass.length < 6) {
      return toast.error("❌ Password must be at least 6 characters long");
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/admins/password/${adminId}`,
        { oldPassword: old, newPassword: newPass },
        { 
          headers: { 
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      toast.success("✅ Password updated successfully");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error("❌ Request timeout - server not responding");
      } else {
        toast.error(err?.response?.data?.error || "❌ Failed to update password");
      }
    }
  };

  const handleCreateAdmin = async () => {
    const { admin_name, admin_email, admin_pass, confirmPassword, role } = newAdmin;
    
    if (!admin_name || !admin_email || !admin_pass || !confirmPassword) {
      return toast.error("❗ Please fill all fields");
    }
    if (admin_pass !== confirmPassword) {
      return toast.error("❌ Passwords do not match");
    }
    if (admin_pass.length < 6) {
      return toast.error("❌ Password must be at least 6 characters long");
    }

    try {
      await axios.post('http://localhost:5000/api/admins/register', {
        admin_name,
        admin_email,
        admin_pass,
        role
      }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      
      toast.success("✅ Admin account created successfully");
      setNewAdmin({
        admin_name: "",
        admin_email: "",
        admin_pass: "",
        confirmPassword: "",
        role: "admin"
      });
      setShowCreateAdmin(false);
      
      // Refresh admin list
      const allAdminsRes = await axios.get('http://localhost:5000/api/admins', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setAllAdmins(allAdminsRes.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Failed to create admin account");
    }
  };

  const handleDeleteAdmin = async (adminIdToDelete) => {
    if (adminIdToDelete === adminId) {
      return toast.error("❌ You cannot delete your own account from here");
    }
    
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this admin account permanently?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admins/${adminIdToDelete}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("✅ Admin account deleted successfully");
      
      // Refresh admin list
      const allAdminsRes = await axios.get('http://localhost:5000/api/admins', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setAllAdmins(allAdminsRes.data);
    } catch (err) {
      toast.error("❌ Failed to delete admin account");
    }
  };

  const handleDeleteOwnAccount = async () => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete your account permanently? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("✅ Account deleted successfully");
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "superadmin", label: "Super Admin" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        </div>
        <p className="text-gray-600">Manage your personal information, security, and administrator accounts.</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            Profile Settings
          </button>
          {/* Conditionally render Admin Management tab only for superadmin */}
          {admin.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'admins'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              Admin Management
            </button>
          )}
        </div>
      </div>

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                  <Input
                    type="text"
                    placeholder="Enter admin name"
                    value={admin.admin_name}
                    onChange={(e) => setAdmin({ ...admin, admin_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={admin.admin_email}
                    onChange={(e) => setAdmin({ ...admin, admin_email: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleProfileUpdate} 
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Password & Security */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Password & Security</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.old ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwords.old}
                      onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('old')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.old ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handlePasswordChange} 
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <KeyIcon className="h-5 w-5" />
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-800">Danger Zone</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
                <button 
                  onClick={handleDeleteOwnAccount} 
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete Account Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Management Tab - Only render if user is superadmin */}
      {activeTab === 'admins' && admin.role === 'superadmin' && (
        <div className="space-y-6">
          {/* Create Admin Section */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Create New Admin</h2>
                </div>
                <button
                  onClick={() => setShowCreateAdmin(!showCreateAdmin)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <PlusIcon className="h-5 w-5" />
                  {showCreateAdmin ? 'Cancel' : 'Add Admin'}
                </button>
              </div>
            </div>
            
            {showCreateAdmin && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                    <Input
                      type="text"
                      placeholder="Enter admin name"
                      value={newAdmin.admin_name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, admin_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newAdmin.admin_email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, admin_email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={newAdmin.admin_pass}
                      onChange={(e) => setNewAdmin({ ...newAdmin, admin_pass: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={newAdmin.confirmPassword}
                      onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <Select
                      options={roleOptions}
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                      className="w-full md:w-1/2"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={handleCreateAdmin} 
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create Admin Account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">All Administrators</h2>
                <span className="text-sm text-gray-500">({allAdmins.length})</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allAdmins.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <UsersIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No administrators found</p>
                      </td>
                    </tr>
                  ) : (
                    allAdmins.map((adminUser, index) => (
                      <tr key={adminUser._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                              <UserIcon className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{adminUser.admin_name}</span>
                              {adminUser._id === adminId && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{adminUser.admin_email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            text={adminUser.role === 'superadmin' ? 'Super Admin' : 'Admin'} 
                            status={adminUser.role === 'superadmin' ? 'delivered' : 'shipped'} 
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(adminUser.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {adminUser._id !== adminId ? (
                            <button
                              onClick={() => handleDeleteAdmin(adminUser._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Delete Admin"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">Current User</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
