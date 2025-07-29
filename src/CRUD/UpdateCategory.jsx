import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateCategory = () => {
  const { type, categoryId, subcategoryName } = useParams();
  const navigate = useNavigate();

  const [petCategories, setPetCategories] = useState([]);
  const [petCategoryName, setPetCategoryName] = useState("");
  const [subcategory, setSubcategory] = useState(subcategoryName || "");
  const [prevSubcategory, setPrevSubcategory] = useState(subcategoryName || ""); // ✅ NEW
  const [selectedPetType, setSelectedPetType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setPetCategories(res.data);

        if (type === "pet") {
          const current = res.data.find((c) => c._id === categoryId);
          if (current) setPetCategoryName(current.pet_type);
        } else if (type === "subcategory") {
          const current = res.data.find((c) =>
            c.product_categories.includes(subcategoryName)
          );
          if (current) {
            setSelectedPetType(current._id);
            setSubcategory(subcategoryName);
            setPrevSubcategory(subcategoryName); // ✅ LOCK OLD NAME
          }
        }
      } catch (err) {
        toast.error("❌ Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [type, categoryId, subcategoryName]);

  const handleSave = async () => {
    if (type === "pet") {
      if (!petCategoryName.trim()) return toast.error("❗ Enter a category name");

      try {
        await axios.put(
          `http://localhost:5000/api/categories/pet/${categoryId}`,
          { pet_type: petCategoryName.trim() }
        );
        toast.success("✅ Pet category updated");
        navigate("/admin/categories");
      } catch (err) {
        console.error("❌ Pet update error:", err?.response?.data || err);
        toast.error("❌ Update failed");
      }
    } else {
      if (!subcategory.trim() || !selectedPetType)
        return toast.error("❗ All fields required");

      try {
        await axios.patch(
          `http://localhost:5000/api/categories/product/${selectedPetType}/subcategory`,
          {
            oldSubcategory: prevSubcategory.trim(), // ✅ USE LOCKED VALUE
            newSubcategory: subcategory.trim(),
          }
        );
        toast.success("✅ Subcategory updated");
        navigate("/admin/categories");
      } catch (err) {
        console.error("❌ Subcategory update error:", err?.response?.data || err);
        toast.error("❌ Subcategory update failed");
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 font-inter bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Category</h1>
        <p className="text-gray-500 mb-6">Update category information below.</p>

        {type === "pet" ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Pet Category Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={petCategoryName}
              onChange={(e) => setPetCategoryName(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Pet Category
            </label>
            <select
              className="w-full border rounded-lg p-3"
              value={selectedPetType}
              onChange={(e) => setSelectedPetType(e.target.value)}
            >
              <option value="">Select Pet Type</option>
              {petCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.pet_type}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Subcategory Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => navigate("/admin/categories")}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-400 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
