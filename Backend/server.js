const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Enhanced middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' })); // ✅ JSON parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // ✅ URL-encoded parser

// Debug middleware to log request body
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// Routes
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/sellers", require("./routes/sellerRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);
