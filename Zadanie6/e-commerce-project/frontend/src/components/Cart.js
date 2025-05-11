import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();
  
  const handleProceedToCheckout = () => {
    navigate('/payment');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your Cart</h2>
        <p>Your cart is empty. Add some products!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <button 
          className="checkout-btn"
          onClick={handleProceedToCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;