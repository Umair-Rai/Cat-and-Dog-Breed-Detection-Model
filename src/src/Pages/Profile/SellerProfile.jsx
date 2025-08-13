import React, { useState } from "react";
import { FaBoxOpen, FaClipboardList, FaDollarSign, FaEdit, FaTrash } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SellerDashboard = () => {
  const [orders] = useState([
    { id: "ORD001", date: "2025-08-01", buyer: "John Doe", product: "Dog Food", status: "Pending", total: "$25" },
    { id: "ORD002", date: "2025-08-03", buyer: "Sarah Smith", product: "Cat Toy", status: "Shipped", total: "$15" },
    { id: "ORD003", date: "2025-08-05", buyer: "Mike Johnson", product: "Bird Cage", status: "Delivered", total: "$85" },
  ]);

  const [products] = useState([
    { id: 1, name: "Premium Dog Food", price: "$25", stock: 50, status: "Active" },
    { id: 2, name: "Luxury Cat Bed", price: "$45", stock: 20, status: "Active" },
    { id: 3, name: "Bird Cage XL", price: "$85", stock: 5, status: "Inactive" },
  ]);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Monthly Earnings ($)",
        data: [120, 190, 300, 250, 200, 300, 400],
        borderColor: "#4F46E5",
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Seller"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-bold">PetStore Official</h2>
            <p className="text-gray-600">Seller ID: SLR12345</p>
            <p className="text-gray-500">Member since Jan 2024</p>
          </div>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Edit Store Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
          <FaClipboardList className="text-indigo-600 text-3xl" />
          <div>
            <p className="text-gray-500">Total Orders</p>
            <h3 className="text-lg font-bold">150</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
          <FaBoxOpen className="text-green-600 text-3xl" />
          <div>
            <p className="text-gray-500">Products Listed</p>
            <h3 className="text-lg font-bold">35</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
          <FaDollarSign className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500">Earnings This Month</p>
            <h3 className="text-lg font-bold">$2,350</h3>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.buyer}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">{order.total}</td>
                  <td className="p-3 text-blue-600 cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">My Products</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Product Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{prod.name}</td>
                  <td className="p-3">{prod.price}</td>
                  <td className="p-3">{prod.stock}</td>
                  <td className="p-3">{prod.status}</td>
                  <td className="p-3 flex space-x-2">
                    <button className="text-blue-600"><FaEdit /></button>
                    <button className="text-red-600"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Sales Analytics</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default SellerDashboard;