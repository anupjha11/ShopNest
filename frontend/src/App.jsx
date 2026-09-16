import React from "react";
import {BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./pages/Home";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import ReturnPolicy from "./pages/ReturnPolicy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import AdminProducts from "./admin/AdminProducts";
import EditProduct from "./admin/EditProduct";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

function App() {
  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/> } />
        <Route path="/about" element={<About/> } />
        <Route path="/disclaimer" element={<Disclaimer/> } />
        <Route path="/return" element={<ReturnPolicy/> } />
        <Route path="/login" element={<Login/> } />
        <Route path="/register" element={<Register/> } />
        <Route path="/products/:id" element={<ProductDetail/> } />
        <Route path="/checkout" element={<Checkout/> } />
        <Route path="/profile" element={<Profile/> } />
        <Route path="/ordersuccess" element={<OrderSuccess/> } />
        <Route path="/cart" element={<Cart/> } />
        <Route path="/shop" element={<Shop/> } />
        <Route path="/admin" element={<AdminDashboard/> } />
        <Route path="/admin/add-product" element={<AddProduct/> } />
        <Route path="/admin/products" element={<AdminProducts/> } />
        <Route path="/admin/edit-product/:id" element={<EditProduct/> } />
        <Route path="/admin/orders" element={<AdminOrders/> } />
        <Route path="/admin/users" element={<AdminUsers/> } />
        
        </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

