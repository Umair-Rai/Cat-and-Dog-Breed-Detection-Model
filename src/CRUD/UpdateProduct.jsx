import React, { useEffect, useState } from 'react';
import  {useParams } from 'react-router-dom';
import  Input  from '../components/Input';
import  Select  from '../components/Select';
import  Textarea  from '../components/Textarea';
import  Button  from '../components/Button';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

const UpdateProduct = () => {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);

  const [petCategory, setPetCategory] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    // 🧪 Fetch product data by ID (replace with actual fetch)
    const fetchProduct = async () => {
      const mockProduct = {
        petCategory: 'Cat',
        productCategory: 'Food',
        productName: 'Whiskas Adult',
        description: 'Healthy cat food for adults.',
        images: [],
        variants: [
          { weight: '2kg', price: 1200, stock: 10 },
          { weight: '5kg', price: 2500, stock: 5 },
        ],
      };
      setProduct(mockProduct);
      setPetCategory(mockProduct.petCategory);
      setProductCategory(mockProduct.productCategory);
      setProductName(mockProduct.productName);
      setDescription(mockProduct.description);
      setVariants(mockProduct.variants);
      setImages(mockProduct.images);
    };

    fetchProduct();
  }, [productId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.slice(0, 6 - images.length);
    const preview = validFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...preview]);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setVariants(prev => [...prev, { weight: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      petCategory,
      productCategory,
      productName,
      description,
      images,
      variants
    });
    alert('Product updated successfully!');
  };

  if (!product) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-poppins">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-semibold mb-1 text-blue-600">Update Product</h2>
        <p className="text-gray-500 mb-8">Edit product details, images and variants</p>

        {/* Category Section */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🗂 Category</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Pet Category"
              value={petCategory}
              onChange={(e) => setPetCategory(e.target.value)}
              options={['Cat', 'Dog']}
              placeholder="Select pet category"
            />
            <Select
              label="Product Category"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              options={['Food', 'Toys', 'Items']}
              placeholder="Select product category"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Product Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Upload Images</label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-400 hover:border-blue-400 transition cursor-pointer">
              <AiOutlinePlus size={28} />
              <p className="mt-2">Drag & drop images here or click to upload</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`upload-${idx}`}
                    className="w-24 h-24 object-cover rounded shadow-md animate-fade-in"
                  />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== idx))
                    }
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📦 Product Variants</h3>
          {variants.map((variant, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-2 items-end">
              <Input
                label="Weight"
                value={variant.weight}
                onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                placeholder="e.g., 5kg"
              />
              <Input
                label="Price"
                type="number"
                value={variant.price}
                onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  label="Stock"
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                />
                <button
                  onClick={() => handleRemoveVariant(idx)}
                  className="mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded shadow-md"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <Button className="mt-2" onClick={handleAddVariant}>
            + Add Variant
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="ghost">Cancel</Button>
          <Button variant="outline">Save as Draft</Button>
          <Button onClick={handleSubmit}>Update Product</Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
