import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // ⬅️ added useParams
import {
  PlusIcon, TrashIcon, PhotoIcon, CubeIcon, TagIcon,
  InformationCircleIcon, CheckCircleIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Badge from '../../components/Badge';

const AddProduct = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { productId } = useParams(); // ⬅️ detect if editing
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // ⬅️ store old images
  const [variants, setVariants] = useState([{ weight: '', price: '', stock: '', discount: '' }]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    pet_type_id: '',
    product_category: '',
    tags: '',
    description: '',
    season: '',
    is_active: true
  });

  // Fetch categories + product (if editing)
  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProduct = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      const product = res.data;

      setForm({
        name: product.name || '',
        brand: product.brand || '',
        pet_type_id: product.pet_type_id?._id || '',
        product_category: product.product_category || '',
        tags: product.tags?.join(', ') || '',
        description: product.description || '',
        season: product.season || '',
        is_active: product.is_active
      });
      setVariants(product.variants || []);
      setExistingImages(product.images || []);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      toast.error('Error fetching product data');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 6);
    setImages(newImages);
  };

  const handleImageRemove = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleExistingImageRemove = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const addVariant = () => setVariants([...variants, { weight: '', price: '', stock: '', discount: '' }]);

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updated = [...variants];
      updated.splice(index, 1);
      setVariants(updated);
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleFormChange = (field, value) => {
    if (field === 'pet_type_id') {
      setForm({ ...form, [field]: value, product_category: '' });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleSubmit = async (isEdit) => {
  try {
    setLoading(true);

    const formData = new FormData();

    // Add form fields
    Object.keys(form).forEach((key) => {
      if (key === "tags") {
        formData.append(
          key,
          JSON.stringify(
            form[key]
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          )
        );
      } else {
        formData.append(key, form[key]);
      }
    });

    // Add variants
    formData.append("variants", JSON.stringify(variants));

    // Add images
    images.forEach((img) => {
      formData.append("images", img);
    });

    // Add existingImages if you want to keep them when updating
    if (isEdit && existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    if (isEdit && productId) {
      await axios.put(`http://localhost:5000/api/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
    } else {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added successfully!");
    }

    navigate("/admin");
  } catch (err) {
    console.error("Error saving product:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to save product");
  } finally {
    setLoading(false);
  }
};



  // Category options
  const petTypeOptions = categories.map(cat => ({ value: cat._id, label: cat.pet_type }));
  const productCategoryOptions = form.pet_type_id
    ? (categories.find(cat => cat._id === form.pet_type_id)?.product_categories || []).map(c => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1)
      }))
    : [];
const seasonOptions = [ { value: '', label: 'Select Season' }, { value: 'spring', label: 'Spring' }, { value: 'summer', label: 'Summer' }, { value: 'autumn', label: 'Autumn' }, { value: 'winter', label: 'Winter' }, { value: 'all_year', label: 'All Year' } ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <CubeIcon className="h-6 w-6 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          {productId ? 'Update Product' : 'Add New Product'}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <InformationCircleIcon className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
          </div>

          {/* Row 1: Product Name | Pet Type | Season */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <Input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type *</label>
              <Select
                options={petTypeOptions}
                value={form.pet_type_id}
                onChange={(e) => handleFormChange('pet_type_id', e.target.value)}
                placeholder="Select pet type"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
              <Select
                options={seasonOptions}
                value={form.season}
                onChange={(e) => handleFormChange('season', e.target.value)}
                placeholder="Select season"
              />
            </div>
          </div>

          {/* Row 2: Brand | Product Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <Input
                type="text"
                placeholder="Enter brand name"
                value={form.brand}
                onChange={(e) => handleFormChange('brand', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
              <Select
                options={productCategoryOptions}
                value={form.product_category}
                onChange={(e) => handleFormChange('product_category', e.target.value)}
                placeholder="Select category"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Enter product description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <Input
              type="text"
              placeholder="e.g. premium, organic, bestseller"
              value={form.tags}
              onChange={(e) => handleFormChange('tags', e.target.value)}
            />
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <PhotoIcon className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Product Images</h2>
            <Badge text={`${images.length}/6`} status="pending" />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors relative">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Product Images</h3>
            <p className="text-gray-500 mb-4">Drag and drop images here or click to browse</p>
            <p className="text-sm text-gray-400">Supports: PNG, JPG, WEBP (Max 6 images)</p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload}
              disabled={images.length >= 6}
            />
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Image Preview</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleImageRemove(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Product Variants</h2>
              <Badge text={`${variants.length} variant(s)`} status="pending" />
            </div>
            <button
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg relative">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight/Size *</label>
                  <Input
                    type="text"
                    placeholder="e.g. 500g, Large"
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (SAR) *</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.discount}
                    onChange={(e) => handleVariantChange(index, 'discount', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex items-end">
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(index)}
                      className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

{/* Action Buttons */}
<div className="bg-white rounded-xl shadow-sm border p-6">
  <div className="flex flex-col sm:flex-row gap-4 justify-end">
    <button
      onClick={() => navigate('/admin')}
      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      disabled={loading}
    >
      Cancel
    </button>
    <button
  onClick={() => handleSubmit(!!productId)} // use productId instead of isEdit
  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
  disabled={loading}
>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      {productId ? "Updating..." : "Adding..."}
    </>
  ) : (
    <>
      <CheckCircleIcon className="h-5 w-5" />
      {productId ? "Update Product" : "Add Product"}
    </>
  )}
</button>
  </div>
</div>
      </div>
    </div>
  );
};

export default AddProduct;
