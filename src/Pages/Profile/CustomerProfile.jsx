// src/Pages/Profile/CustomerProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/**
 * CustomerProfile.jsx
 * - All hooks declared at top level (no conditional hooks)
 * - Uses user.Account_type OR user.role to determine redirects
 * - Placeholder data & handlers remain; replace with real API calls as needed
 */

const TABS = {
  ORDERS: "orders",
  WISHLIST: "wishlist",
  ADDRESSES: "addresses",
  SETTINGS: "settings",
};

export default function CustomerProfile() {
  // ---------- Hooks (always declared at top) ----------
  const { user, setUser } = useContext(AuthContext);

  // UI state
  const [activeTab, setActiveTab] = useState(TABS.ORDERS);

  // Placeholder data - replace with API responses
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "" });
  const [newAddress, setNewAddress] = useState({ label: "", line1: "", city: "", postal: "" });

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep profileForm in sync when user updates (e.g. login or context changes)
  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  // ---------- Effects (fetch placeholder data) ----------
  // NOTE: This hook is declared unconditionally (top-level). Inside it we can
  // safely bail if there's no user — but the hook itself must exist on every render.
  useEffect(() => {
    // If no user yet, don't attempt to load user-specific data
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      // TODO: replace these placeholders with real API calls (axios/fetch)
      setOrders([
        {
          id: "ORD-1001",
          status: "Delivered",
          date: "2025-08-01",
          total: 45.0,
          items: [{ title: "Dog Toy Pack", img: "/assets/images/sample1.jpg", qty: 1 }],
        },
        {
          id: "ORD-1002",
          status: "Shipped",
          date: "2025-08-04",
          total: 23.5,
          items: [{ title: "Catnip Toy", img: "/assets/images/sample2.jpg", qty: 2 }],
        },
      ]);

      setWishlist([
        { id: "P-101", title: "Premium Dog Food", price: 34.99, img: "/assets/images/sample3.jpg" },
        { id: "P-102", title: "Cat Scratcher", price: 19.95, img: "/assets/images/sample4.jpg" },
      ]);

      setAddresses([
        { id: "A1", label: "Home", line1: "House 12, Gulshan", city: "Karachi", postal: "75300", isDefault: true },
      ]);
    } catch (err) {
      setError("Failed to load profile data (placeholder).");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // re-run when user changes

  // ---------- Redirects (after hooks) ----------
  // If not logged in -> go to signin (render redirect)
  if (!user) return <Navigate to="/signin" replace />;

  // If user is not a customer, redirect them to their proper page
  const accountType = user?.Account_type; // front-end saved value (Customer Account / Seller Account)
  const role = user?.role; // backend role (customer / seller / admin)

  if (accountType === "Seller Account" || role === "seller") {
    return <Navigate to="/profile/seller" replace />;
  }
  if (role === "admin" || accountType === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  // ---------- Handlers ----------
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // full reload to clear app state
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    // TODO: call API to update user profile, then setUser(updatedUser)
    setEditingProfile(false);
    alert("Profile updated (mock). Hook this to your API.");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // TODO: call API to change password
    setPasswordForm({ current: "", newPass: "" });
    alert("Password change (mock). Hook this to your API.");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const addr = { ...newAddress, id: "A" + (addresses.length + 1), isDefault: addresses.length === 0 };
    setAddresses((p) => [...p, addr]);
    setNewAddress({ label: "", line1: "", city: "", postal: "" });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((p) => p.filter((x) => x.id !== productId));
    // TODO: call API to remove wishlist item
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === id })));
    // TODO: call API to update default address on server
  };

  // ---------- Render helpers ----------
  const renderOrders = () => {
    if (!orders.length)
      return <div className="p-6 text-center text-gray-500">You have no orders yet. Shop something nice for your pet!</div>;

    return (
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4">
              <img src={o.items[0].img} alt="product" className="h-20 w-20 object-cover rounded" />
              <div>
                <div className="font-semibold text-gray-800">{o.items[0].title}</div>
                <div className="text-sm text-gray-500">Order: {o.id}</div>
                <div className="text-sm text-gray-500">Date: {o.date}</div>
              </div>
            </div>

            <div className="mt-3 md:mt-0 flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${statusColor(o.status)}`}>{o.status}</span>
              <div className="text-right">
                <div className="text-gray-700 font-medium">Rs {o.total.toFixed(2)}</div>
                <button className="mt-2 text-sm text-purple-600 underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWishlist = () => {
    if (!wishlist.length)
      return <div className="p-6 text-center text-gray-500">Your wishlist is empty. Add products you like!</div>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col">
            <img src={p.img} alt={p.title} className="h-40 w-full object-cover rounded" />
            <div className="mt-3 flex flex-col flex-1">
              <div className="font-semibold text-gray-800">{p.title}</div>
              <div className="text-gray-500 mt-1">Rs {p.price.toFixed(2)}</div>
              <div className="mt-auto flex items-center justify-between">
                <button onClick={() => handleRemoveFromWishlist(p.id)} className="text-sm text-red-500">Remove</button>
                <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAddresses = () => {
    return (
      <div className="space-y-4">
        {addresses.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-white rounded shadow p-4">
            <div>
              <div className="font-medium">
                {a.label} {a.isDefault && <span className="text-sm text-green-600 ml-2">(Default)</span>}
              </div>
              <div className="text-gray-500">{a.line1}, {a.city} — {a.postal}</div>
            </div>
            <div className="flex items-center gap-2">
              {!a.isDefault && <button onClick={() => handleSetDefaultAddress(a.id)} className="text-sm text-purple-600">Set Default</button>}
              <button className="text-sm text-red-500">Delete</button>
            </div>
          </div>
        ))}

        <form onSubmit={handleAddAddress} className="bg-white rounded shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required value={newAddress.label} onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))} placeholder="Label (Home / Office)" className="input" />
            <input required value={newAddress.line1} onChange={(e) => setNewAddress((p) => ({ ...p, line1: e.target.value }))} placeholder="Address line" className="input" />
            <input required value={newAddress.city} onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))} placeholder="City" className="input" />
            <input required value={newAddress.postal} onChange={(e) => setNewAddress((p) => ({ ...p, postal: e.target.value }))} placeholder="Postal" className="input" />
          </div>
          <div className="mt-3 text-right">
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Add Address</button>
          </div>
        </form>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-3">Edit Profile</h3>
          <form onSubmit={handleProfileSave} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input" value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} />
              <input className="input" value={profileForm.email} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} />
              <input className="input" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="text-right">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-3">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input type="password" className="input" placeholder="Current password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} />
            <input type="password" className="input" placeholder="New password" value={passwordForm.newPass} onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))} />
            <div className="text-right">
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">Change Password</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-3">Danger Zone</h3>
          <p className="text-sm text-gray-600">Delete your account — this is irreversible.</p>
          <div className="mt-3 flex gap-3">
            <button className="px-4 py-2 bg-gray-200 rounded">Deactivate</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded">Delete Account</button>
          </div>
        </div>
      </div>
    );
  };

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <aside className="md:w-80 p-6 border-r">
              <div className="flex flex-col items-center">
                <img src={user?.profile_image || "/anon.png"} alt="avatar" className="h-28 w-28 rounded-full object-cover border-4 border-purple-100" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{user?.name || "Customer"}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>

                <div className="mt-6 w-full space-y-2">
                  <button onClick={() => setActiveTab(TABS.ORDERS)} className={`w-full text-left px-4 py-2 rounded ${activeTab === TABS.ORDERS ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100"}`}>My Orders</button>
                  <button onClick={() => setActiveTab(TABS.WISHLIST)} className={`w-full text-left px-4 py-2 rounded ${activeTab === TABS.WISHLIST ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100"}`}>Wishlist</button>
                  <button onClick={() => setActiveTab(TABS.ADDRESSES)} className={`w-full text-left px-4 py-2 rounded ${activeTab === TABS.ADDRESSES ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100"}`}>Address Book</button>
                  <button onClick={() => setActiveTab(TABS.SETTINGS)} className={`w-full text-left px-4 py-2 rounded ${activeTab === TABS.SETTINGS ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100"}`}>Account Settings</button>

                  <hr className="my-2" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Your Account</h1>
                <div>
                  <button onClick={() => setEditingProfile(true)} className="px-3 py-2 bg-purple-600 text-white rounded mr-2">Edit Profile</button>
                </div>
              </div>

              <div>
                {activeTab === TABS.ORDERS && renderOrders()}
                {activeTab === TABS.WISHLIST && renderWishlist()}
                {activeTab === TABS.ADDRESSES && renderAddresses()}
                {activeTab === TABS.SETTINGS && renderSettings()}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Small CSS in JS to keep inputs consistent with Tailwind */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
}

/** helper to color order statuses */
function statusColor(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered")) return "bg-green-100 text-green-700";
  if (s.includes("shipped")) return "bg-blue-100 text-blue-700";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
  if (s.includes("cancel")) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}
