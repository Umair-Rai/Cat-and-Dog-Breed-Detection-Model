import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateCategory = () => {
  const { type, categoryId, subcategoryName } = useParams();
  const navigate = useNavigate();

  const [petCategories, setPetCategories] = useState([]);
  const [petTypeName, setPetTypeName] = useState(""); // for pet category edit
  const [subcategory, setSubcategory] = useState(subcategoryName || "");
  const [prevSubcategory, setPrevSubcategory] = useState(subcategoryName || "");
  const [sourcePetTypeId, setSourcePetTypeId] = useState(""); // ✅ original source category ID
  const [selectedTargetPetTypeId, setSelectedTargetPetTypeId] = useState(""); // 🆕 destination category
  const [selectedTargetPetTypeName, setSelectedTargetPetTypeName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setPetCategories(res.data);

        if (type === "pet") {
          const current = res.data.find((c) => c._id === categoryId);
          if (current) setPetTypeName(current.pet_type);
        }

        if (type === "subcategory") {
          const current = res.data.find((c) =>
            c.product_categories.includes(subcategoryName)
          );
          if (current) {
            setSourcePetTypeId(current._id); // ✅ actual location of the subcategory
            setSelectedTargetPetTypeId(current._id); // pre-select it in dropdown
            setSelectedTargetPetTypeName(current.pet_type);
            setSubcategory(subcategoryName);
            setPrevSubcategory(subcategoryName);
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
    try {
      if (type === "pet") {
        if (!petTypeName.trim()) return toast.error("❗ Enter a category name");

        await axios.put(
          `http://localhost:5000/api/categories/pet/${categoryId}`,
          { pet_type: petTypeName.trim() }
        );
        toast.success("✅ Pet category updated");
      } else {
        if (
          !subcategory.trim() ||
          !sourcePetTypeId ||
          !selectedTargetPetTypeId ||
          !selectedTargetPetTypeName.trim()
        ) {
          return toast.error("❗ All fields are required");
        }

        await axios.patch(
          `http://localhost:5000/api/categories/product/${sourcePetTypeId}/subcategory`,
          {
            oldSubcategory: prevSubcategory.trim(),
            newSubcategory: subcategory.trim(),
            newPetType: selectedTargetPetTypeName.trim(),
          }
        );

        toast.success("✅ Subcategory updated and moved if needed");
      }

      navigate("/admin");
    } catch (err) {
      const msg = err?.response?.data?.error || "❌ Update failed";
      toast.error(msg);
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
              value={petTypeName}
              onChange={(e) => setPetTypeName(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Move To Pet Type
            </label>
            <select
              className="w-full border rounded-lg p-3"
              value={selectedTargetPetTypeId}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedName = petCategories.find((cat) => cat._id === selectedId)?.pet_type || "";
                setSelectedTargetPetTypeId(selectedId);
                setSelectedTargetPetTypeName(selectedName);
              }}
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
            onClick={() => navigate("/admin")}
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
