// src/pages/ViewAllProduct.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function ViewAllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-inter">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">View All Products</h1>
        <p className="text-gray-600">Manage store inventory and product listings</p>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex flex-1 gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4"><input type="checkbox" /></th>
              <th className="p-4">Image</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4">Pet Type</th>
              <th className="p-4">Product Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" /></td>
                  <td className="p-4">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/60"}
                      alt="Product"
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.brand}</div>
                  </td>
                  <td className="p-4">SAR {product.price}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 0
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.pet_id?.pet_type || "—"}
                  </td>
                  <td className="p-4">
                    {product.category_id?.name || "—"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 items-center">
                      <Link to={`/admin/update-product/${product._id}`}>
                        <Pencil className="text-blue-600 hover:scale-110 transition cursor-pointer" size={18} />
                      </Link>
                      <Trash2 className="text-red-600 hover:scale-110 transition cursor-pointer" size={18} />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Optional Later) */}
    </div>
  );
}
