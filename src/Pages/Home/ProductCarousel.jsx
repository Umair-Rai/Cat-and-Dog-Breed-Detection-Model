import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4; // show 4 at a time

const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/products");

    // 📌 Sort products by avg_rating (desc) then total_reviews (desc)
    const sorted = [...res.data].sort((a, b) => {
      if (b.avg_rating === a.avg_rating) {
        return b.total_reviews - a.total_reviews;
      }
      return b.avg_rating - a.avg_rating;
    });

    // 📌 Take top 10
    const bestTen = sorted.slice(0, 10);

    setProducts(bestTen);
  } catch (err) {
    console.error("❌ Failed to fetch products", err);
  }
};

useEffect(() => {
  fetchProducts();
}, []);


  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    const maxStart = products.length - visibleCount;
    setStartIndex((prev) => Math.min(prev + visibleCount, maxStart));
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="bg-white py-12 px-4 max-w-7xl mx-auto">
      {/* Header + Nav */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pet Products</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + visibleCount >= products.length}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product) => {
          const v = product.variants?.[0]; // ✅ first variant
          const hasDiscount = v?.discount > 0;
          const salePrice = hasDiscount
            ? v.price - (v.price * v.discount) / 100
            : v?.price;

          return (
            <a
              key={product._id}
              href={`/products/${product._id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden group shadow-md hover:shadow-lg hover:shadow-purple-400 transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48">
                {product.images?.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${product.images[0]}`}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}

                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    -{v.discount}%
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {product.product_category}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-600 font-bold text-base">
                    SAR {salePrice?.toFixed(2) ?? "0.00"}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      SAR {v.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <p
                  className={`text-sm font-medium ${
                    v?.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {v?.stock > 0 ? `${v.stock} in stock` : "Out of stock"}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSlider;
