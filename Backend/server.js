const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // ← Add this
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();

dotenv.config(); // ← Load .env variables

// Middleware
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.get('/', (req, res) => {
  res.send('✅ Petify API is running!');
});

// Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => app.listen(process.env.PORT, () => {
  console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
}))
.catch(err => console.error('❌ MongoDB connection error:', err));
