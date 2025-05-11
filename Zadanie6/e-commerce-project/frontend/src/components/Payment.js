import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Payment.css';

function Payment() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create order data to send to server
      const orderData = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zip: formData.zip
        },
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalPrice()
      };

      // Send order to server
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Order was successful
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setError('Payment processing failed. Please try again.');
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="payment-container">
        <h2>Payment</h2>
        <p>Your cart is empty. Add some products before proceeding to payment.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payment-container">
        <div className="payment-success">
          <h2>Payment Successful!</h2>
          <p>Thank you for your order. You will be redirected to the home page shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h2>Complete Your Purchase</h2>
      <div className="payment-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3>Payment Information</h3>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX XXXX"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-payment-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Purchase'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;
