const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Fetch all products
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch single product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    // Filter products by category
    return data.filter(product => 
      product.category && product.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    // Extract unique categories from products
    const categories = [...new Set(data.map(product => product.category).filter(Boolean))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchProductDetails = async (productId) => {
  const response = await fetch(`/api/products/${productId}`);
  const productData = await response.json();
  
  // Now update state to show details
  setProductDetails(productData);
};