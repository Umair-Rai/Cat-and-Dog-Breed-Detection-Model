import { useState, useEffect } from "react";
import {
  FiSearch,
  FiHeart,
  FiChevronDown,
  FiChevronUp,
  FiShoppingCart,
  FiFilter,
} from "react-icons/fi";

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMoreCats, setShowMoreCats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const prodRes = await fetch("http://localhost:5000/api/products");
      const prodData = await prodRes.json();
      setProducts(prodData);

      const catRes = await fetch("http://localhost:5000/api/categories");
      const catData = await catRes.json();
      const allCategories = catData.flatMap((c) => c.product_categories);
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);

      setLoading(false);
    }
    fetchData();
  }, []);

  const togglePetType = (type) => {
    setSelectedPetTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPet =
      selectedPetTypes.length > 0
        ? selectedPetTypes.includes(
            product.category_id?.pet_type?.toLowerCase()
          )
        : true;
    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.some((cat) =>
            product.category_id?.product_categories?.includes(cat)
          )
        : true;

    return matchesSearch && matchesPet && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Pet Accessories
        </h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFiltersMobile(true)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`space-y-8 lg:block ${
            showFiltersMobile
              ? "fixed inset-0 bg-white z-50 p-6 overflow-y-auto"
              : "hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowFiltersMobile(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Pet Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Pet Type</h2>
            <div className="flex flex-col gap-2">
              {["dog", "cat"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPetTypes.includes(type)}
                    onChange={() => togglePetType(type)}
                    className="accent-blue-600"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="flex flex-col gap-2">
              {categories.slice(0, 6).map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-blue-600"
                  />
                  <span>{cat}</span>
                </label>
              ))}
              {categories.length > 6 && (
                <>
                  <button
                    onClick={() => setShowMoreCats(!showMoreCats)}
                    className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-2"
                  >
                    {showMoreCats ? "Show Less" : "View More"}
                    {showMoreCats ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {showMoreCats &&
                    categories.slice(6).map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="accent-blue-600"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            : filteredProducts.map((product) => {
                const hasDiscount =
                  product.discount && product.discount > 0;
                const salePrice = hasDiscount
                  ? product.price - product.price * (product.discount / 100)
                  : null;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative group">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                      <button
                        aria-label="Add to favorites"
                        className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
                      >
                        <FiHeart className="text-gray-500" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center text-yellow-400 text-sm my-1">
                        {"⭐".repeat(5)}
                        <span className="ml-2 text-gray-500 text-xs">
                          ({product.total_reviews})
                        </span>
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
                      <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        <FiShoppingCart /> Add to Cart
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
