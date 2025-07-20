// /utils/categoryHandler.js

// Example: Validate Category Payload
function validateCategoryPayload({ pet_type, category_name, product_categories }) {
  if (!pet_type || !category_name) {
    throw new Error("Pet Type and Category Name are required.");
  }

  if (!Array.isArray(product_categories)) {
    throw new Error("Product Categories must be an array.");
  }

  return {
    pet_type: pet_type.trim(),
    category_name: category_name.trim(),
    product_categories: product_categories.map(item => item.trim()),
  };
}

// You can add more helpers here (formatting, logging, etc.)

module.exports = {
  validateCategoryPayload,
};
