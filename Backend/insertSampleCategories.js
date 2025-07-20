// insertSampleCategories.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/category'); // adjust path if needed

dotenv.config();

const sampleCategories = [
  {
    pet_type: 'Dog',
    product_categories: ['Food', 'Toys', 'Accessories', 'Health Care']
  },
  {
    pet_type: 'Cat',
    product_categories: ['Food', 'Scratchers', 'Litter', 'Health Care']
  }
];

async function insertData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Category.deleteMany(); // Optional: Clears existing categories
    await Category.insertMany(sampleCategories);

    console.log('✅ Sample categories inserted successfully!');
    process.exit(); // Ends script
  } catch (error) {
    console.error('❌ Error inserting data:', error);
    process.exit(1);
  }
}

insertData();
