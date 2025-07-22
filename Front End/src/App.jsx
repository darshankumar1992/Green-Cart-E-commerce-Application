import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/customer/Login';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // Optional: for toast messages
import SignUp from './pages/customer/SignUp';
import Navbar from './pages/customer/Navbar';
import Home from './pages/customer/Home';
import Allproduct from './pages/customer/Allproduct';
import Demo from './pages/customer/Demo';
import Wrapper from './pages/customer/Wrapper';
import CategoryProducts from './pages/customer/CategoryProducts';
import ProductItem from './pages/customer/ProductItem';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import Cart from './pages/customer/Cart';
import Orders from './pages/customer/Orders';

import AWrapper from './pages/admin/AWrapper';
import Addproduct from './pages/admin/Addproduct';
import Alogin from './pages/admin/Alogin';
import ACustomerData from './pages/admin/ACustomerData';
import AOrders from './pages/admin/AOrders';
import ADashboard from './pages/admin/ADashboard';
import AAllproduct from './pages/admin/AAllproduct';
import AUpdateproduct from './pages/admin/AUpdateproduct';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/alogin" element={<Alogin/>} />
         
         
          
          <Route path="/demo" element={<Demo/>}></Route>

          <Route path="/" element={<Wrapper/>}>
            <Route index element={<Home/>} />
            <Route path="/all" element={<Allproduct/>} />
            <Route path="/categoryProduct" element={<CategoryProducts/>}/>
            <Route path="/product/item" element={<ProductItem/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/payment/success" element={<OrderSuccess/>} />
          </Route>

         

          <Route path="/admin" element={<AWrapper />}>
            <Route index element={<ADashboard/>} />
            <Route path="add" element={<Addproduct />} />
            <Route path="all" element={<AAllproduct/>} />
            <Route path="orders" element={<AOrders/>} />
            <Route path="customer" element={<ACustomerData/>} />
            <Route path="update/:itemId" element={<AUpdateproduct/>} />
          </Route>


          
        </Routes>
      </Router>
      <Toaster position="top-center" />
      
    </QueryClientProvider>
  );
}

export default App;
