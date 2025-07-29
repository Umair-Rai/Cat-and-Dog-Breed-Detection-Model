import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import BreedDetection from './Pages/BreedDetection';
import Login from './Pages/login';
import Admin from './Pages/Admin';
import AddProduct from './CRUD/AddProduct';
import UpdateProduct from './CRUD/UpdateProduct';
import AddCategory from './CRUD/AddCategory';
import UpdateCategory from './CRUD/UpdateCategory';

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
        <Route path="/signin" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;