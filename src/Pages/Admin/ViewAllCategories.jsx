import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ViewAllCategories = () => {
  const [petCategories, setPetCategories] = useState([]);
  const [productSubcategories, setProductSubcategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      const allCategories = res.data;
      setPetCategories(allCategories);

      const flatSubcategories = [];
      allCategories.forEach((cat) => {
        cat.product_categories.forEach((subcategory) => {
          flatSubcategories.push({
            _id: `${cat._id}-${subcategory}`,
            category: subcategory,
            pet_type: cat.pet_type,
            catId: cat._id,
          });
        });
      });

      setProductSubcategories(flatSubcategories);
    } catch (err) {
      console.error("❌ Failed to fetch categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeletePetCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pet category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      toast.success("Pet category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("❌ Failed to delete pet category:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.error || "Failed to delete pet category");
    }
  };

  const handleDeleteProductCategory = async (catId, subcategory) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product subcategory?");
    if (!confirmDelete) return;

    try {
      await axios.put(`http://localhost:5000/api/categories/${catId}/remove-category`, {
        categoryToRemove: subcategory,
      });
      toast.success("Product subcategory deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("❌ Failed to delete product subcategory:", err);
      toast.error("Failed to delete product subcategory");
    }
  };

  return (
    <div className="p-6 font-inter bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
        <p className="text-gray-600">Manage pet categories and their subcategories</p>
      </div>

      {/* Add Category Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/add-category"
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </Link>
      </div>

      {/* Pet Categories Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto mb-10">
        <h2 className="text-lg font-semibold text-gray-700 px-6 pt-4">Pet Categories</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="text-xs text-white uppercase bg-brand">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Pet Type</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {petCategories.map((category, index) => (
              <tr key={category._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 capitalize">{category.pet_type}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/update-category/pet/${category._id}`)}
                    className="text-blue-600 hover:underline"
                    title="Edit Pet Category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePetCategory(category._id)}
                    className="text-red-600 hover:underline"
                    title="Delete Pet Category"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Subcategories Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 px-6 pt-4">Product Subcategories</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="text-xs text-white uppercase bg-brand">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Subcategory</th>
              <th className="px-6 py-3 text-left">Pet Type</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productSubcategories.map((subcat, index) => (
              <tr key={subcat._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 capitalize">{subcat.category}</td>
                <td className="px-6 py-4 capitalize">{subcat.pet_type}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/update-category/subcategory/${subcat.catId}/${encodeURIComponent(
                          subcat.category
                        )}`
                      )
                    }
                    className="text-blue-600 hover:underline"
                    title="Edit Subcategory"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProductCategory(subcat.catId, subcat.category)
                    }
                    className="text-red-600 hover:underline"
                    title="Delete Subcategory"
                  >
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
