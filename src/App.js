import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import BreedDetection from './Pages/BreedDetection';
import Login from './Pages/login';
import Admin from './Pages/Admin';
import AddProduct from './Admin/AddProduct';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/breed-detection" element={<BreedDetection />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/signin" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
