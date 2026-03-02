import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// ============== AUTH HELPER FUNCTIONS ==============

// Get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Create headers with JWT token
const getAuthHeaders = (contentType = null) => {
  const token = getToken();
  if (!token) {
    console.warn("⚠️ No token found, API call might fail");
  }
  
  const headers = {};
  
  // Always add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add Content-Type only for JSON requests (NOT for FormData - let browser set it)
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  return { headers };
};

// Handle authentication errors
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    console.log("🔐 Token expired, redirecting to login...");
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Only redirect if we're on an admin page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    throw new Error('Session expired. Please login again.');
  }
  return error;
};

// ============== ADD NEW PRODUCT ==============
export const addProduct = async (productData) => {
  try {
    console.log("📤 Sending product...");
    
    const formData = new FormData();
    
    formData.append('name', productData.name || "");
    formData.append('sku', productData.sku || "");
    formData.append('category', productData.category || "");
    formData.append('price', productData.price || 0);
    formData.append('description', productData.description || "");
    formData.append('material', productData.material || "");
    formData.append('plating', productData.plating || "");
    formData.append('weight', productData.weight || "");
    formData.append('length', productData.dimensions?.length || "");
    formData.append('width', productData.dimensions?.width || "");
    
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((imageFile) => {
        if (imageFile instanceof File) {
          formData.append('images', imageFile);
        }
      });
    }
    
    // Use auth headers for protected route
    const response = await axios.post(API_URL, formData, getAuthHeaders());
    
    console.log("✅ Product added:", response.data);
    return response.data;
    
  } catch (error) {
    handleAuthError(error);
    console.error("❌ Error:", error.response?.data || error.message);
    throw error;
  }
};

// ============== GET ALL PRODUCTS ==============
export const getProducts = async () => {
  try {
    console.log("🔄 Fetching from:", API_URL);
    
    // GET requests are PUBLIC, no token needed
    const response = await axios.get(API_URL);
    
    console.log("📦 Data received:", response.data);
    
    // Check response structure and return consistent format
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return [];
    }
    
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return []; // Return empty array instead of crashing
  }
};

// ============== DELETE PRODUCT ==============
export const deleteProduct = async (id) => {
  try {
    console.log("🗑️ Deleting product ID:", id);
    
    // DELETE requires auth
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders('application/json'));
    
    console.log("✅ Delete response:", response.data);
    return response.data;
    
  } catch (error) {
    handleAuthError(error);
    console.error("❌ Error deleting product:", error);
    throw error;
  }
};

// ============== GET SINGLE PRODUCT ==============
export const getProductById = async (id) => {
  try {
    console.log("🔍 Fetching product ID:", id);
    const response = await axios.get(`${API_URL}/${id}`);
    
    console.log("📦 Full API response:", response);
    console.log("📦 Response data:", response.data);
    
    // Check the response structure
    let productData;
    
    if (response.data && response.data.product) {
      productData = response.data.product;
    } else if (response.data && response.data.data) {
      productData = response.data.data;
    } else {
      productData = response.data;
    }
    
    console.log("✅ Extracted product data:", productData);
    return productData;
    
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// ============== UPDATE PRODUCT ==============
export const updateProduct = async (id, productData) => {
  try {
    console.log("✏️ Updating product ID:", id);
    console.log("📦 Update data:", productData);
    
    // Create FormData
    const formData = new FormData();
    
    // Add all text fields
    formData.append('name', productData.name || "");
    formData.append('sku', productData.sku || "");
    formData.append('category', productData.category || "");
    formData.append('price', productData.price || 0);
    formData.append('description', productData.description || "");
    formData.append('material', productData.material || "");
    formData.append('plating', productData.plating || "");
    formData.append('weight', productData.weight || "");
    formData.append('length', productData.dimensions?.length || "");
    formData.append('width', productData.dimensions?.width || "");
    
    // Add new image files (if any)
    if (productData.images && productData.images.length > 0) {
      // Filter only File objects (new uploads)
      const newImageFiles = productData.images.filter(img => img instanceof File);
      
      newImageFiles.forEach((imageFile) => {
        formData.append('images', imageFile);
      });
      
      console.log("📸 New images to upload:", newImageFiles.length);
    }
    
    // UPDATE requires auth
    const response = await axios.put(`${API_URL}/${id}`, formData, getAuthHeaders());
    
    console.log("✅ Product updated:", response.data);
    return response.data;
    
  } catch (error) {
    handleAuthError(error);
    console.error("❌ Error updating product:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

// ============== GET PRODUCTS BY CATEGORY ==============
export const getProductsByCategory = async (category) => {
  try {
    // GET requests are PUBLIC, no token needed
    const response = await axios.get(`${API_URL}/category/${category}`);
    
    // Return consistent format
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// ============== CHECK IF USER IS AUTHENTICATED ==============
export const checkAuth = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { authenticated: false, user: null };
    }
    
    // Verify token with backend
    const response = await axios.get('http://localhost:5000/api/admin/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return { 
      authenticated: response.data.success, 
      user: response.data.user 
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return { authenticated: false, user: null };
  }
};

// ============== ADMIN LOGIN ==============
export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email,
      password
    });
    
    if (response.data.success) {
      // Save token and user data
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};

// ============== ADMIN LOGOUT ==============
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  return { success: true, message: 'Logged out' };
};

// ============== DASHBOARD STATS ==============
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/stats', getAuthHeaders('application/json'));
    return response.data;
  } catch (error) {
    handleAuthError(error);
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// ============== GET ALL ORDERS (ADMIN) ==============
export const getAdminOrders = async (status = '', page = 1, limit = 20) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('limit', limit);

    const response = await axios.get(
      `http://localhost:5000/api/admin/orders?${params.toString()}`,
      getAuthHeaders('application/json')
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// ============== UPDATE ORDER STATUS ==============
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/admin/orders/${orderId}/status`,
      { status },
      getAuthHeaders('application/json')
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ============== GET ALL CUSTOMERS ==============
export const getCustomers = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/admin/customers',
      getAuthHeaders('application/json')
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
    console.error('Error fetching customers:', error);
    throw error;
  }
};