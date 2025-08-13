import { useState, useEffect } from 'react';
import { FiSearch, FiHeart, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showMoreCats, setShowMoreCats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPetType, setSelectedPetType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Fetch products
      const prodRes = await fetch('http://localhost:5000/api/products');
      const prodData = await prodRes.json();
      setProducts(prodData);

      // Fetch categories and flatten + deduplicate
      const catRes = await fetch('http://localhost:5000/api/categories');
      const catData = await catRes.json();

      const allCategories = catData.flatMap(c => c.product_categories);
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPet = selectedPetType
      ? product.category_id?.pet_type?.toLowerCase() === selectedPetType.toLowerCase()
      : true;
    const matchesCategory = selectedCategory
      ? product.category_id && product.category_id.product_categories
        ? product.category_id.product_categories.includes(selectedCategory)
        : product.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesSearch && matchesPet && matchesCategory;
  });

  // Handle "unselectable" radio
  const handlePetTypeChange = (type) => {
    setSelectedPetType(selectedPetType === type ? null : type);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(selectedCategory === cat ? null : cat);
  };

  return (
    <main className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="flex space-x-2 text-gray-500">
          <li>Home</li>
          <li>{'>'}</li>
          <li className="text-gray-900 font-medium">Products</li>
        </ol>
      </nav>

      {/* Page Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Dog Accessories</h1>
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Pet Type Filter */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-3">Pet Type</h2>
            {['dog', 'cat'].map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="petType"
                  checked={selectedPetType === type}
                  onClick={() => {handlePetTypeChange(selectedPetType === type ? null : type);}}
                  readOnly
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-3">Category</h2>
            {categories.slice(0, 5).map(cat => (
              <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat}
                  onClick={() => {setSelectedCategory(selectedCategory === cat ? null : cat);}}
                  readOnly
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{cat}</span>
              </label>
            ))}

            {categories.length > 5 && (
              <>
                <button
                  onClick={() => setShowMoreCats(!showMoreCats)}
                  className="flex items-center justify-between w-full text-blue-600 mt-3 text-sm font-medium hover:text-blue-800 transition"
                >
                  {showMoreCats ? 'Show Less' : 'View More'}
                  {showMoreCats ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showMoreCats && (
                  <div className="mt-2 space-y-2 bg-gray-50 rounded-lg p-3 shadow-inner border border-gray-200">
                    {categories.slice(5).map(cat => (
                      <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onClick={() => {setSelectedCategory(selectedCategory === cat ? null : cat);}}
                          readOnly
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const hasDiscount = product.discount && product.discount > 0;
            const salePrice = hasDiscount ? product.price - (product.price * product.discount / 100) : null;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="rounded-t-2xl w-full h-56 object-cover"
                  />
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                  <button
                    aria-label="Add to favorites"
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                  >
                    <FiHeart className="text-gray-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <div className="flex items-center text-yellow-400 text-sm my-1">
                    {'⭐'.repeat(5)}
                    <span className="ml-2 text-gray-500 text-xs">({product.total_reviews})</span>
                  </div>
                  <div className="mt-2">
                    {hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">
                          ${(salePrice / 100).toFixed(2)}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-900">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
