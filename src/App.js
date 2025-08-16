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
import SellerProfile from './Pages/Profile/SellerProfile'; // make sure you create this

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test") // This will go to http://localhost:5000/api/test
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/breed-detection" element={<BreedDetection />} />
        <Route path='/admin' element={<Admin />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/update-product/:id" element={<UpdateProduct />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/update-category/:type/:categoryId/:subcategoryName?" element={<UpdateCategory />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/profile/customer" element={<CustomerProfile />} />
        <Route path="/profile/seller" element={<SellerProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
