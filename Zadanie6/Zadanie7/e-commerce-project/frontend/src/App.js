import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './components/Products';
import Cart from './components/Cart';
import Payment from './components/Payment';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>E-Commerce Store</h1>
            <nav>
              <ul className="nav-links">
                <li><Link to="/">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/payment">Payment</Link></li>
              </ul>
            </nav>
          </header>
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;