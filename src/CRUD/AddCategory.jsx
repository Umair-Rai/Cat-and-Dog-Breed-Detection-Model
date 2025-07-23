import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [categoryType, setCategoryType] = useState("");
  const [petCategoryName, setPetCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [petCategories, setPetCategories] = useState([]);

  useEffect(() => {
    fetchPetCategories();
  }, []);

  const fetchPetCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      const categories = res.data.map((cat) => cat.pet_type);
      setPetCategories(categories);
    } catch (err) {
      toast.error("❌ Failed to load categories");
      console.error("Fetch Error:", err.message);
    }
  };

  const handleSave = async () => {
    if (categoryType === "pet") {
      if (!petCategoryName.trim()) {
        toast.error("❗ Pet Category name is required");
        return;
      }

      const exists = petCategories.some(
        (cat) => cat.toLowerCase() === petCategoryName.trim().toLowerCase()
      );

      if (exists) {
        toast.warning("⚠️ Pet Category already exists");
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/api/categories", {
          pet_type: petCategoryName.trim(),
          product_categories: [],
        });

        if (res.status === 201) {
          toast.success("✅ Pet Category added to database");
          setPetCategoryName("");
          fetchPetCategories();
        }
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data?.error;
        if (
          err.response?.status === 409 ||
          message?.toLowerCase()?.includes("duplicate")
        ) {
          toast.warning("⚠️ Pet Category already exists");
        } else {
          toast.error(`❌ ${message || "Failed to save pet category"}`);
        }
        console.error("Pet Category Save Error:", err);
      }
    }

    if (categoryType === "subcategory") {
      if (!subcategoryName.trim()) {
        toast.error("❗ Subcategory name is required");
        return;
      }

      if (!parentCategory) {
        toast.error("❗ Please select a parent category");
        return;
      }

      try {
        const res = await axios.put(
          `http://localhost:5000/api/categories/${parentCategory}`,
          {
            newCategory: subcategoryName.trim(),
          }
        );

        if (res.status === 200) {
          toast.success("✅ Subcategory added to database");
          setSubcategoryName("");
          setParentCategory("");
          fetchPetCategories();
        }
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data?.error;

        if (
          err.response?.status === 409 ||
          message?.toLowerCase()?.includes("already exist")
        ) {
          toast.warning(`⚠️ ${message}`);
        } else {
          toast.error("❌ Failed to add subcategory");
        }

        console.error("Subcategory Save Error:", err);
      }
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 flex justify-center items-start">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Category</h1>
        <p className="text-gray-500 mb-6">Choose category type and provide details.</p>

        <div className="flex space-x-6 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="categoryType"
              value="pet"
              checked={categoryType === "pet"}
              onChange={() => setCategoryType("pet")}
            />
            <span className="text-gray-700 font-medium">Pet Category</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="categoryType"
              value="subcategory"
              checked={categoryType === "subcategory"}
              onChange={() => setCategoryType("subcategory")}
            />
            <span className="text-gray-700 font-medium">Product Subcategory</span>
          </label>
        </div>

        <AnimatePresence>
          {categoryType === "pet" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Pet Category Name"
                value={petCategoryName}
                onChange={(e) => setPetCategoryName(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            </motion.div>
          )}

          {categoryType === "subcategory" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Subcategory Name"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                className="w-full border rounded-lg p-3"
              />

              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Parent Category</option>
                {petCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-400 transition"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
