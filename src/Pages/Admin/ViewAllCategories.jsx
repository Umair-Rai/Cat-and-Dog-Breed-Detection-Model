import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Select from '../../components/Select';

const ViewAllCategories = () => {
  const [petCategories, setPetCategories] = useState([]);
  const [productSubcategories, setProductSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPetType, setFilterPetType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
            is_active: cat.is_active
          });
        });
      });

      setProductSubcategories(flatSubcategories);
    } catch (err) {
      console.error("❌ Failed to fetch categories:", err);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeletePetCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pet category? This will also remove all associated product subcategories.");
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

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Filter categories based on search and pet type
  const filteredPetCategories = petCategories.filter(category => {
    const matchesSearch = category.pet_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPetType = filterPetType === "all" || category.pet_type === filterPetType;
    return matchesSearch && matchesPetType;
  });

  const filteredSubcategories = productSubcategories.filter(subcat => {
    const matchesSearch = subcat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subcat.pet_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPetType = filterPetType === "all" || subcat.pet_type === filterPetType;
    return matchesSearch && matchesPetType;
  });

  const petTypeOptions = [
    { value: "all", label: "All Pet Types" },
    ...Array.from(new Set(petCategories.map(cat => cat.pet_type))).map(petType => ({
      value: petType,
      label: petType.charAt(0).toUpperCase() + petType.slice(1)
    }))
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading categories...</span>
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
            <Squares2X2Icon className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        </div>
        <p className="text-gray-600">Manage pet categories and product subcategories for your store.</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pet Categories</p>
                <p className="text-2xl font-bold text-gray-800">{petCategories.length}</p>
              </div>
              <Squares2X2Icon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Product Subcategories</p>
                <p className="text-2xl font-bold text-blue-600">{productSubcategories.length}</p>
              </div>
              <TagIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-green-600">{petCategories.filter(cat => cat.is_active).length}</p>
              </div>
              <TagIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Subcategories</p>
                <p className="text-2xl font-bold text-orange-600">
                  {petCategories.length > 0 ? Math.round(productSubcategories.length / petCategories.length) : 0}
                </p>
              </div>
              <TagIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Add Category Button */}
          <Link
            to="/admin/add-category"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </Link>
        </div>
        
        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <Select
              options={petTypeOptions}
              value={filterPetType}
              onChange={(e) => setFilterPetType(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Pet Categories Section */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Pet Categories</h2>
            <span className="text-sm text-gray-500">({filteredPetCategories.length})</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPetCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Squares2X2Icon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No categories found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredPetCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <Squares2X2Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 capitalize">{category.pet_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.product_categories.length} subcategories
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        text={category.is_active ? 'Active' : 'Inactive'} 
                        status={category.is_active ? 'delivered' : 'cancelled'} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCategory(category)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/update-category/pet/${category._id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit Category"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePetCategory(category._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete Category"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Subcategories Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Product Subcategories</h2>
            <span className="text-sm text-gray-500">({filteredSubcategories.length})</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubcategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <TagIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No subcategories found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map((subcat, index) => (
                  <tr key={subcat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <TagIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 capitalize">{subcat.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                        {subcat.pet_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        text={subcat.is_active ? 'Active' : 'Inactive'} 
                        status={subcat.is_active ? 'delivered' : 'cancelled'} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/update-category/subcategory/${subcat.catId}/${encodeURIComponent(
                                subcat.category
                              )}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit Subcategory"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProductCategory(subcat.catId, subcat.category)
                          }
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete Subcategory"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Details Modal */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Squares2X2Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {selectedCategory.pet_type} Category
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Category Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Pet Type:</span>
                  <p className="font-semibold capitalize">{selectedCategory.pet_type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="mt-1">
                    <Badge 
                      text={selectedCategory.is_active ? 'Active' : 'Inactive'} 
                      status={selectedCategory.is_active ? 'delivered' : 'cancelled'} 
                    />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="font-semibold">{new Date(selectedCategory.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <p className="font-semibold">{new Date(selectedCategory.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Product Categories */}
              <div>
                <span className="text-sm text-gray-600">Product Subcategories ({selectedCategory.product_categories.length}):</span>
                <div className="mt-2 space-y-2">
                  {selectedCategory.product_categories.length > 0 ? (
                    selectedCategory.product_categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4 text-blue-600" />
                          <span className="font-medium capitalize">{category}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowModal(false);
                              navigate(`/admin/update-category/subcategory/${selectedCategory._id}/${encodeURIComponent(category)}`);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Edit Subcategory"
                          >
                            <PencilIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => {
                              setShowModal(false);
                              handleDeleteProductCategory(selectedCategory._id, category);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete Subcategory"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TagIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p>No subcategories found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate(`/admin/update-category/pet/${selectedCategory._id}`);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllCategories;
