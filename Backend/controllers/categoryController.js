// /controllers/categoryController.js

const addCategory = (req, res) => {
  // Your logic here
  res.status(200).json({ message: 'Category added successfully' });
};

const updateCategory = (req, res) => {
  // Your logic here
  res.status(200).json({ message: 'Category updated successfully' });
};

const getCategories = (req, res) => {
  // Your logic here
  res.status(200).json({ message: 'GET all categories' });
};

module.exports = {
  addCategory,
  updateCategory,
  getCategories, // ✅ Add this
};
