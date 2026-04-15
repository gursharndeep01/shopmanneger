import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import CustomerDetail from './components/Customers/CustomerDetail';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import BillList from './components/Bills/BillList';
import BillForm from './components/Bills/BillForm';
import BillDetail from './components/Bills/BillDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <div className="animated-background">
          <div className="bg-slide"></div>
          <div className="bg-slide"></div>
          <div className="bg-slide"></div>
        </div>

        <div className="content-overlay">
          <Navbar />
          <div className="container">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
              <Route path="/customers/new" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
              <Route path="/customers/edit/:id" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
              <Route path="/customers/:id" element={<PrivateRoute><CustomerDetail /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
              <Route path="/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
              <Route path="/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
              <Route path="/bills" element={<PrivateRoute><BillList /></PrivateRoute>} />
              <Route path="/bills/new" element={<PrivateRoute><BillForm /></PrivateRoute>} />
              <Route path="/bills/:id" element={<PrivateRoute><BillDetail /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;