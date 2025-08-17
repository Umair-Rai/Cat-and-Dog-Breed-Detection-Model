import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

// Icons
import { 
  AiOutlinePlus, 
  AiOutlineDelete, 
  AiOutlineSave, 
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineClose
} from 'react-icons/ai';
import {
  PhotoIcon,
  InformationCircleIcon,
  CubeIcon,
  TagIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    pet_type_id: '',
    product_category: '',
    discount: 0,
    tags: '',
    description: '',
    season: '',
    is_active: true
  });

  // Status options for product management
  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  // Season options
  const seasonOptions = [
    { value: '', label: 'Select Season' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'autumn', label: 'Autumn' },
    { value: 'winter', label: 'Winter' },
    { value: 'all_year', label: 'All Year' }
  ];

  // Fetch categories and product data
  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
      const productData = response.data;
      
      setProduct(productData);
      setForm({
        name: productData.name || '',
        brand: productData.brand || '',
        price: productData.price || '',
        stock: productData.stock || '',
        pet_type_id: productData.pet_type_id?._id || '',
        product_category: productData.product_category || '',
        discount: productData.discount || 0,
        tags: Array.isArray(productData.tags) ? productData.tags.join(', ') : '',
        description: productData.description || '',
        season: productData.season || '',
        is_active: productData.is_active !== undefined ? productData.is_active : true
      });
      setVariants(productData.variants || []);
      setImages(productData.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic category options based on selected pet type
  const getProductCategoryOptions = () => {
    if (!form.pet_type_id) {
      return [{ value: '', label: 'Select Pet Type First' }];
    }
    
    const selectedCategory = categories.find(cat => cat._id === form.pet_type_id);
    if (!selectedCategory || !selectedCategory.product_categories) {
      return [{ value: '', label: 'No Categories Available' }];
    }
    
    return [
      { value: '', label: 'Select Product Category' },
      ...selectedCategory.product_categories.map(category => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1)
      }))
    ];
  };

  const petTypeOptions = [
    { value: '', label: 'Select Pet Type' },
    ...categories.map(cat => ({
      value: cat._id,
      label: cat.pet_type
    }))
  ];

  const handleFormChange = (field, value) => {
    if (field === 'pet_type_id') {
      setForm({ ...form, [field]: value, product_category: '' });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  // Image handling
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = Math.max(0, 6 - (images.length + newImages.length));
    const validFiles = files.slice(0, remainingSlots);

    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setNewImages(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Variant handling
  const handleVariantChange = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { weight: '', price: '', stock: '' }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.price || !form.stock || !form.pet_type_id || !form.product_category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(form[key].split(',').map(tag => tag.trim()).filter(tag => tag)));
        } else {
          formData.append(key, form[key]);
        }
      });
      
      // Add variants
      formData.append('variants', JSON.stringify(variants));
      
      // Add existing images
      formData.append('existingImages', JSON.stringify(images));
      
      // Add new images
      newImages.forEach(img => {
        formData.append('images', img.file);
      });

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Product updated successfully!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Product not found</p>
        <Button onClick={() => navigate('/admin')} className="mt-4">
          Back to Admin Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <AiOutlineEdit className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
                <p className="text-gray-600 mt-1">Modify product details and manage status</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                text={form.is_active ? 'Active' : 'Inactive'} 
                status={form.is_active ? 'delivered' : 'cancelled'} 
              />
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/products')}
              >
                Back to Products
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <InformationCircleIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Product Name *"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
                <Input
                  label="Brand"
                  value={form.brand}
                  onChange={(e) => handleFormChange('brand', e.target.value)}
                  placeholder="Enter brand name"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (SAR) *"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <Input
                    label="Stock *"
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleFormChange('stock', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Select
                  label="Pet Type *"
                  options={petTypeOptions}
                  value={form.pet_type_id}
                  onChange={(e) => handleFormChange('pet_type_id', e.target.value)}
                  required
                />
                <Select
                  label="Product Category *"
                  options={getProductCategoryOptions()}
                  value={form.product_category}
                  onChange={(e) => handleFormChange('product_category', e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Discount (%)"
                    type="number"
                    value={form.discount}
                    onChange={(e) => handleFormChange('discount', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <Select
                    label="Season"
                    options={seasonOptions}
                    value={form.season}
                    onChange={(e) => handleFormChange('season', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Input
                label="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => handleFormChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
              <Select
                label="Status *"
                options={statusOptions}
                value={form.is_active}
                onChange={(e) => handleFormChange('is_active', e.target.value === 'true')}
                required
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <PhotoIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Product Images</h2>
            </div>
            
            {/* Current Images */}
            {images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={`http://localhost:5000/uploads/${img}`}
                        alt={`Current ${idx}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <AiOutlineDelete size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload New Images */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer group">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 group-hover:text-purple-500 transition-colors" />
              <p className="text-gray-600 mb-2">Drag & drop new images here or click to upload</p>
              <p className="text-sm text-gray-500">Maximum 6 images total</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">New Images</h3>
                <div className="flex flex-wrap gap-4">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.preview}
                        alt={`New ${idx}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <AiOutlineDelete size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CubeIcon className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Product Variants</h2>
              </div>
              <Button type="button" onClick={addVariant} variant="outline">
                <AiOutlinePlus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <Input
                    label="Weight/Size"
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                    placeholder="e.g., 5kg, Large"
                  />
                  <Input
                    label="Price (SAR)"
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    placeholder="0.00"
                  />
                  <Input
                    label="Stock"
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                    placeholder="0"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      disabled={variants.length === 1}
                    >
                      <AiOutlineDelete className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-wrap justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => handleFormChange('is_active', false)}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <AiOutlineSave className="h-4 w-4 mr-2" />
                    Update Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
