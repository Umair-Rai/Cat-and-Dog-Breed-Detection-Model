import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const ViewAllCategories = () => {
  const [petCategories, setPetCategories] = useState([]);
  const [productSubcategories, setProductSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        const allCategories = res.data;

        // Assuming response looks like:
        // [{ pet_type: "Dog", category: "Toys" }, { pet_type: "Cat", category: null }]
        const pet = [];
        const product = [];

        allCategories.forEach((item) => {
          if (!item.category) {
            pet.push(item);
          } else {
            product.push(item);
          }
        });

        setPetCategories(pet);
        setProductSubcategories(product);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6 font-inter bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
        <p className="text-gray-600">Manage pet categories and their subcategories</p>
      </div>

      <div className="flex justify-end mb-4">
        <Link
          to="/admin/add-category"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </Link>
      </div>

      {/* Pet Categories */}
      <div className="bg-white shadow rounded-lg overflow-x-auto mb-10">
        <h2 className="text-lg font-semibold text-gray-700 px-6 pt-4">Pet Categories</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="text-xs text-white uppercase bg-brand">
            <tr>
              <th className="px-6 py-3 text-left">Number</th>
              <th className="px-6 py-3 text-left">Pet Type</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {petCategories.map((category, index) => (
              <tr key={category._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{category.pet_type}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button className="text-blue-600 hover:underline">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:underline">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Subcategories */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 px-6 pt-4">Product Subcategories</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="text-xs text-white uppercase bg-brand">
            <tr>
              <th className="px-6 py-3 text-left">Number</th>
              <th className="px-6 py-3 text-left">Product Category</th>
              <th className="px-6 py-3 text-left">Pet Type</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productSubcategories.map((subcategory, index) => (
              <tr key={subcategory._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{subcategory.category}</td>
                <td className="px-6 py-4">{subcategory.pet_type}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button className="text-blue-600 hover:underline">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:underline">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllCategories;
