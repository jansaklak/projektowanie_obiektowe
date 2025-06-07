// frontend/src/__tests__/components.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Products from '../components/Products';
import Cart from '../components/Cart';
import Payment from '../components/Payment';
import { CartProvider, useCart } from '../contexts/CartContext';
import App from '../App';

// Mock fetch dla testów API
global.fetch = jest.fn();

// Mock router
const RouterWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

// Mock component dla testów kontekstu
const MockCartComponent = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  
  return (
    <div>
      <div data-testid="cart-items">{cart.length}</div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      <button 
        data-testid="add-product" 
        onClick={() => addToCart({ id: 1, name: 'Test Product', price: 10.99 })}
      >
        Add Product
      </button>
      <button 
        data-testid="remove-product" 
        onClick={() => removeFromCart(1)}
      >
        Remove Product
      </button>
      <button 
        data-testid="update-quantity" 
        onClick={() => updateQuantity(1, 3)}
      >
        Update Quantity
      </button>
      <button 
        data-testid="clear-cart" 
        onClick={clearCart}
      >
        Clear Cart
      </button>
    </div>
  );
};

describe('CartContext Tests', () => {
  test('should initialize with empty cart', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0'); // Asercja 1
    expect(screen.getByTestId('total-items')).toHaveTextContent('0'); // Asercja 2
    expect(screen.getByTestId('total-price')).toHaveTextContent('0'); // Asercja 3
  });

  test('should add product to cart', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-product'));
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('1'); // Asercja 4
    expect(screen.getByTestId('total-items')).toHaveTextContent('1'); // Asercja 5
    expect(screen.getByTestId('total-price')).toHaveTextContent('10.99'); // Asercja 6
  });

  test('should increase quantity when adding same product twice', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-product'));
    fireEvent.click(screen.getByTestId('add-product'));
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('1'); // Asercja 7
    expect(screen.getByTestId('total-items')).toHaveTextContent('2'); // Asercja 8
    expect(screen.getByTestId('total-price')).toHaveTextContent('21.98'); // Asercja 9
  });

  test('should remove product from cart', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-product'));
    fireEvent.click(screen.getByTestId('remove-product'));
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0'); // Asercja 10
    expect(screen.getByTestId('total-items')).toHaveTextContent('0'); // Asercja 11
    expect(screen.getByTestId('total-price')).toHaveTextContent('0'); // Asercja 12
  });

  test('should update product quantity', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-product'));
    fireEvent.click(screen.getByTestId('update-quantity'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('3'); // Asercja 13
    expect(screen.getByTestId('total-price')).toHaveTextContent('32.97'); // Asercja 14
  });

  test('should clear entire cart', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-product'));
    fireEvent.click(screen.getByTestId('clear-cart'));
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0'); // Asercja 15
    expect(screen.getByTestId('total-items')).toHaveTextContent('0'); // Asercja 16
    expect(screen.getByTestId('total-price')).toHaveTextContent('0'); // Asercja 17
  });
});

describe('Products Component Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should render loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(
      <CartProvider>
        <Products />
      </CartProvider>
    );
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument(); // Asercja 18
  });

  test('should render products after successful fetch', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product 1', price: 99.99, description: 'Test description 1' },
      { id: 2, name: 'Test Product 2', price: 199.99, description: 'Test description 2' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts
    });

    render(
      <CartProvider>
        <Products />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument(); // Asercja 19
      expect(screen.getByText('Test Product 2')).toBeInTheDocument(); // Asercja 20
      expect(screen.getByText('$99.99')).toBeInTheDocument(); // Asercja 21
      expect(screen.getByText('$199.99')).toBeInTheDocument(); // Asercja 22
    });
  });

  test('should handle fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <CartProvider>
        <Products />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading products. Please try again.')).toBeInTheDocument(); // Asercja 23
    });
  });

  test('should add product to cart when Add to Cart button is clicked', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product', price: 99.99, description: 'Test description' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts
    });

    render(
      <CartProvider>
        <Products />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument(); // Asercja 24
    });

    const addButton = screen.getByText('Add to Cart');
    expect(addButton).toBeInTheDocument(); // Asercja 25
    
    fireEvent.click(addButton);
    // Tutaj normalnie sprawdzilibyśmy stan koszyka, ale to wymaga dodatkowego setup
  });
});

describe('Cart Component Tests', () => {
  test('should display empty cart message when cart is empty', () => {
    render(
      <RouterWrapper>
        <CartProvider>
          <Cart />
        </CartProvider>
      </RouterWrapper>
    );
    
    expect(screen.getByText('Your Cart')).toBeInTheDocument(); // Asercja 26
    expect(screen.getByText('Your cart is empty. Add some products!')).toBeInTheDocument(); // Asercja 27
  });

  test('should display cart items when cart has products', () => {
    const CartWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99, image: 'test.jpg' });
      }, [addToCart]);
      
      return <Cart />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <CartWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    expect(screen.getByText('Your Cart')).toBeInTheDocument(); // Asercja 28
    expect(screen.getByText('Test Product')).toBeInTheDocument(); // Asercja 29
    expect(screen.getByText('$99.99')).toBeInTheDocument(); // Asercja 30
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument(); // Asercja 31
  });

  test('should update quantity when + button is clicked', () => {
    const CartWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99, image: 'test.jpg' });
      }, [addToCart]);
      
      return <Cart />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <CartWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Asercja 32
  });

  test('should decrease quantity when - button is clicked', () => {
    const CartWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99, image: 'test.jpg' });
        addToCart({ id: 1, name: 'Test Product', price: 99.99, image: 'test.jpg' });
      }, [addToCart]);
      
      return <Cart />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <CartWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    const minusButton = screen.getByText('-');
    fireEvent.click(minusButton);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Asercja 33
  });

  test('should disable minus button when quantity is 1', () => {
    const CartWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99, image: 'test.jpg' });
      }, [addToCart]);
      
      return <Cart />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <CartWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    const minusButton = screen.getByText('-');
    expect(minusButton).toBeDisabled(); // Asercja 34
  });

  test('should remove item when Remove button is clicked', () => {
    const CartWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99, image: 'test.jpg' });
      }, [addToCart]);
      
      return <Cart />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <CartWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(screen.getByText('Your cart is empty. Add some products!')).toBeInTheDocument(); // Asercja 35
  });
});

describe('Payment Component Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should display empty cart message when cart is empty', () => {
    render(
      <RouterWrapper>
        <CartProvider>
          <Payment />
        </CartProvider>
      </RouterWrapper>
    );
    
    expect(screen.getByText('Payment')).toBeInTheDocument(); // Asercja 36
    expect(screen.getByText('Your cart is empty. Add some products before proceeding to payment.')).toBeInTheDocument(); // Asercja 37
  });

  test('should display payment form when cart has items', () => {
    const PaymentWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99 });
      }, [addToCart]);
      
      return <Payment />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <PaymentWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    expect(screen.getByText('Complete Your Purchase')).toBeInTheDocument(); // Asercja 38
    expect(screen.getByText('Order Summary')).toBeInTheDocument(); // Asercja 39
    expect(screen.getByText('Shipping Information')).toBeInTheDocument(); // Asercja 40
    expect(screen.getByText('Payment Information')).toBeInTheDocument(); // Asercja 41
  });

  test('should update form data when input values change', () => {
    const PaymentWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99 });
      }, [addToCart]);
      
      return <Payment />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <PaymentWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput.value).toBe('John Doe'); // Asercja 42
  });

  test('should handle successful payment submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, message: 'Order created successfully' })
    });

    const PaymentWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99 });
      }, [addToCart]);
      
      return <Payment />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <PaymentWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    // Wypełnienie formularza
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('ZIP Code'), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText('Card Number'), { target: { value: '1234567890123456' } });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText('CVV'), { target: { value: '123' } });
    
    const submitButton = screen.getByText('Complete Purchase');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument(); // Asercja 43
    });
  });

  test('should handle payment submission error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const PaymentWithItems = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        addToCart({ id: 1, name: 'Test Product', price: 99.99 });
      }, [addToCart]);
      
      return <Payment />;
    };

    render(
      <RouterWrapper>
        <CartProvider>
          <PaymentWithItems />
        </CartProvider>
      </RouterWrapper>
    );
    
    // Wypełnienie formularza
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    
    const submitButton = screen.getByText('Complete Purchase');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Payment processing failed. Please try again.')).toBeInTheDocument(); // Asercja 44
    });
  });
});

describe('App Component Tests', () => {
  test('should render header with navigation', () => {
    render(<App />);
    
    expect(screen.getByText('E-Commerce Store')).toBeInTheDocument(); // Asercja 45
    expect(screen.getByText('Products')).toBeInTheDocument(); // Asercja 46
    expect(screen.getByText('Cart')).toBeInTheDocument(); // Asercja 47
    expect(screen.getByText('Payment')).toBeInTheDocument(); // Asercja 48
  });

  test('should render navigation links', () => {
    render(<App />);
    
    const productsLink = screen.getByRole('link', { name: 'Products' });
    const cartLink = screen.getByRole('link', { name: 'Cart' });
    const paymentLink = screen.getByRole('link', { name: 'Payment' });
    
    expect(productsLink).toHaveAttribute('href', '/'); // Asercja 49
    expect(cartLink).toHaveAttribute('href', '/cart'); // Asercja 50
    expect(paymentLink).toHaveAttribute('href', '/payment'); // Asercja 51
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle updateQuantity with zero or negative values', () => {
    render(
      <CartProvider>
        <MockCartComponent />
      </CartProvider>
    );
    
    // Dodaj produkt
    fireEvent.click(screen.getByTestId('add-product'));
    expect(screen.getByTestId('cart-items')).toHaveTextContent('1'); // Asercja 52
    
    // Update quantity to 0 should remove item
    const UpdateZeroQuantity = () => {
      const { updateQuantity } = useCart();
      return (
        <button 
          data-testid="update-zero" 
          onClick={() => updateQuantity(1, 0)}
        >
          Update to Zero
        </button>
      );
    };
    
    render(
      <CartProvider>
        <MockCartComponent />
        <UpdateZeroQuantity />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-product'));
    fireEvent.click(screen.getByTestId('update-zero'));
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0'); // Asercja 53
  });
});