import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home/Home';
import About from './Pages/About us/About';
import BreedDetection from './Pages/Breed Detection/BreedDetection';
import AuthPage from './Pages/Login/AuthPage';
import Admin from './Pages/Admin/Admin';
import AddProduct from './Pages/CRUD/AddProduct';
import UpdateProduct from './Pages/CRUD/UpdateProduct';
import AddCategory from './Pages/CRUD/AddCategory';
import UpdateCategory from './Pages/CRUD/UpdateCategory';
import ProductListingPage from './Pages/Product/product';
import AdminLogin from './Pages/Admin/Adminlogin';
import CustomerProfile from './Pages/Profile/CustomerProfile';
import SellerProfile from './Pages/Profile/SellerProfile';
import AdminRoute from './components/AdminRoute';
import BreederConnect from './Pages/Breeder/BreederConnect';
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/breed-detection" element={<BreedDetection />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/profile/customer" element={<CustomerProfile />} />
        <Route path="/profile/seller" element={<SellerProfile />} />
        <Route path="/breeder-connect" element={<BreederConnect />} />
        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/update-product/:productId"
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-category"
          element={
            <AdminRoute>
              <AddCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/update-category/:type/:categoryId/:subcategoryName?"
          element={
            <AdminRoute>
              <UpdateCategory />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
