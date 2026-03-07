import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';
const CartContext = createContext();

// Helper: normalize image URL
const fixImageUrl = (img) => {
  if (!img) return '/placeholder.jpg';
  if (img.startsWith('http')) return img;
  return `${API_URL}/uploads/${img}`;
};

// Helper: normalize cart items from API response
const normalizeItems = (items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => ({
    ...item,
    productId: item.productId?._id || item.productId?.toString?.() || item.productId,
    image: fixImageUrl(item.image),
    quantity: item.quantity || 1,
    price: Number(item.price) || 0,
  }));
};

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Get token from localStorage
  const getToken = useCallback(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
      return userInfo?.token || localStorage.getItem('token') || null;
    } catch {
      return localStorage.getItem('token') || null;
    }
  }, []);

  // Load cart on mount + when token changes
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const token = getToken();

    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success) {
          setCartItems(normalizeItems(response.data.cart?.items));
          return;
        }
      } catch (error) {
        console.error('Cart load from API failed, using local:', error.message);
      }
    }

    // Guest user OR API failed - use localStorage
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
    } catch {
      setCartItems([]);
    }
  };

  // ====== ADD TO CART ======
  const addToCart = async (product, quantity = 1) => {
    try {
      const token = getToken();
      const pid = product._id || product.id;
      const productImage = fixImageUrl(product.images?.[0] || product.image);

      const cartItem = {
        productId: pid,
        name: product.name,
        price: Number(product.price) || 0,
        image: productImage,
        quantity: Number(quantity) || 1,
      };

      if (!token) {
        // ====== GUEST USER: localStorage cart ======
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const idx = existingCart.findIndex(item => String(item.productId) === String(pid));

        if (idx > -1) {
          existingCart[idx].quantity += cartItem.quantity;
        } else {
          existingCart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));
        setCartItems([...existingCart]);
        setIsCartOpen(true);
        return { success: true, message: 'Added to cart' };
      }

      // ====== LOGGED-IN USER: API cart ======
      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        { productId: pid, quantity: cartItem.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setCartItems(normalizeItems(response.data.cart?.items));
        setIsCartOpen(true);
        return { success: true, message: 'Added to cart' };
      }

      // API returned success: false
      return { success: false, message: response.data?.message || 'Failed to add' };
    } catch (error) {
      console.error('addToCart error:', error.message);

      // On auth failure, fallback to guest cart
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }

      // Fallback: add to localStorage anyway so user sees something
      try {
        const pid = product._id || product.id;
        const fallbackItem = {
          productId: pid,
          name: product.name,
          price: Number(product.price) || 0,
          image: fixImageUrl(product.images?.[0] || product.image),
          quantity: Number(quantity) || 1,
        };
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const idx = localCart.findIndex(i => String(i.productId) === String(pid));
        if (idx > -1) {
          localCart[idx].quantity += fallbackItem.quantity;
        } else {
          localCart.push(fallbackItem);
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCartItems([...localCart]);
        setIsCartOpen(true);
        return { success: true, message: 'Added to cart (offline)' };
      } catch {
        return { success: false, message: 'Failed to add to cart' };
      }
    }
  };

  // ====== UPDATE QUANTITY ======
  const updateQuantity = async (productId, newQuantity) => {
    if (!productId || newQuantity < 1) return;

    const pid = String(productId);
    const token = getToken();

    // Optimistic update: change UI immediately
    setCartItems(prev =>
      prev.map(item =>
        String(item.productId) === pid ? { ...item, quantity: newQuantity } : item
      )
    );

    if (!token) {
      // Guest: update localStorage
      try {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updated = localCart.map(item =>
          String(item.productId) === pid ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updated));
      } catch {}
      return;
    }

    // Logged-in: sync with server
    try {
      const response = await axios.put(
        `${API_URL}/api/cart/update`,
        { productId: pid, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success) {
        setCartItems(normalizeItems(response.data.cart?.items));
      }
    } catch (error) {
      console.error('updateQuantity error:', error.message);
      // Optimistic update already applied, so UI still works
    }
  };

  // ====== REMOVE FROM CART ======
  const removeFromCart = async (productId) => {
    if (!productId) return;

    const pid = String(productId);
    const token = getToken();

    // Optimistic update: remove from UI immediately
    setCartItems(prev => prev.filter(item => String(item.productId) !== pid));

    if (!token) {
      // Guest: update localStorage
      try {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updated = localCart.filter(item => String(item.productId) !== pid);
        localStorage.setItem('cart', JSON.stringify(updated));
      } catch {}
      return;
    }

    // Logged-in: sync with server
    try {
      const response = await axios.delete(
        `${API_URL}/api/cart/remove/${pid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success) {
        setCartItems(normalizeItems(response.data.cart?.items));
      }
    } catch (error) {
      console.error('removeFromCart error:', error.message);
    }
  };

  // ====== CLEAR CART ======
  const clearCart = async () => {
    const token = getToken();
    setCartItems([]);

    if (!token) {
      localStorage.removeItem('cart');
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('clearCart error:', error.message);
    }
    localStorage.removeItem('cart');
  };

  const cartCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const cartTotal = cartItems.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartProvider };

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
