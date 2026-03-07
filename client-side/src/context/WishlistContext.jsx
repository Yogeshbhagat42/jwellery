import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const getToken = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo?.token || localStorage.getItem('token') || null;
    } catch {
      return localStorage.getItem('token') || null;
    }
  };

  const getHeaders = () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const token = getToken();
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setWishlistLoading(true);
      const response = await axios.get(`${API_URL}/api/wishlist`, getHeaders());
      setWishlistItems(response.data.wishlist || []);
    } catch {
      setWishlistItems([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Please login to add to wishlist' };
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/wishlist/add`,
        { productId },
        getHeaders()
      );
      setWishlistItems(response.data.wishlist || []);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = getToken();
    if (!token) return { success: false };

    try {
      const response = await axios.delete(
        `${API_URL}/api/wishlist/remove/${productId}`,
        getHeaders()
      );
      setWishlistItems(response.data.wishlist || []);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      wishlistLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
