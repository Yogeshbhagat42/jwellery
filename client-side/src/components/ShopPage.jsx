import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get('category');
  const maxPriceFromURL = searchParams.get('maxPrice');
  const sortFromURL = searchParams.get('sort');
  
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceFilter, setPriceFilter] = useState(maxPriceFromURL || '');
  const [sortBy, setSortBy] = useState(sortFromURL || '');

  useEffect(() => {
    fetchProducts();
  }, [categoryFromURL]);

  useEffect(() => {
    if (maxPriceFromURL) setPriceFilter(maxPriceFromURL);
  }, [maxPriceFromURL]);

  useEffect(() => {
    if (sortFromURL) setSortBy(sortFromURL);
  }, [sortFromURL]);

  useEffect(() => {
    applyFilters();
  }, [allProducts, priceFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Filter by category
      let filteredProducts = data;
      if (categoryFromURL) {
        const category = categoryFromURL.toLowerCase();
        filteredProducts = data.filter(product => 
          product.category && product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      setAllProducts(filteredProducts);
      
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Price filter
    if (priceFilter && Number(priceFilter) > 0) {
      filtered = filtered.filter(p => p.price <= Number(priceFilter));
    }

    // Sort
    if (sortBy === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setProducts(filtered);
  };

  const getCategoryDisplayName = () => {
    if (!categoryFromURL) return "All Products";
    
    const categoryMap = {
      'earrings': 'Earrings',
      'bracelets': 'Bracelets', 
      'necklaces': 'Necklaces',
      'necklace': 'Necklaces',
      'rings': 'Rings',
      'couple-rings': 'Couple Rings',
      'mangalsutra': 'Mangalsutra',
      'anklets': 'Anklets',
      'nose-pins': 'Nose Pins'
    };
    
    return categoryMap[categoryFromURL] || 
           categoryFromURL.charAt(0).toUpperCase() + categoryFromURL.slice(1);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '80vh' }}>
      <div className="container py-4">
        <h4 className="text-center mb-2" style={{ color: "#0B6F73", fontSize: '20px', fontWeight: 600 }}>
          {getCategoryDisplayName()}
        </h4>
        <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>
          {products.length > 0 ? `${products.length} ${products.length === 1 ? 'product' : 'products'} found` : 'Browse our collection'}
        </p>

        {/* Filters Bar */}
        {!loading && allProducts.length > 0 && (
          <div className="p-2 p-md-3 mb-3 mb-md-4" style={{ backgroundColor: '#fafafa', border: '1px solid #eee' }}>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="small fw-semibold" style={{ color: '#0B6F73', fontSize: '12px' }}>Filters:</span>
              <select
                className="form-select form-select-sm rounded-0"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                style={{ borderColor: '#0B6F73', maxWidth: '160px', fontSize: '12px' }}
              >
                <option value="">All Prices</option>
                <option value="500">Under ₹500</option>
                <option value="1000">Under ₹1,000</option>
                <option value="2000">Under ₹2,000</option>
                <option value="5000">Under ₹5,000</option>
                <option value="10000">Under ₹10,000</option>
              </select>
              <select
                className="form-select form-select-sm rounded-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ borderColor: '#0B6F73', maxWidth: '160px', fontSize: '12px' }}
              >
                <option value="">Default Sort</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="newest">Newest First</option>
              </select>
              {(priceFilter || sortBy) && (
                <button
                  className="btn btn-sm btn-outline-secondary rounded-0"
                  onClick={() => { setPriceFilter(''); setSortBy(''); }}
                  style={{ fontSize: '11px' }}
                >
                  <i className="bi bi-x-lg me-1"></i>Clear
                </button>
              )}
            </div>
          </div>
        )}
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#0B6F73" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <div className="alert alert-warning">
            <p>{error}</p>
            <button 
              onClick={fetchProducts}
              className="btn btn-sm mt-2"
              style={{ backgroundColor: "#0B6F73", color: "#fff" }}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
               style={{ width: '80px', height: '80px', backgroundColor: '#f8f9fa' }}>
            <i className="bi bi-search" style={{ fontSize: '32px', color: '#ccc' }}></i>
          </div>
          <h5 className="fw-semibold mb-2">No Products Found</h5>
          <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
            {categoryFromURL 
              ? `No products found in "${getCategoryDisplayName()}" category`
              : 'No products available'
            }
          </p>
          <Link to="/shop" className="btn btn-sm px-4" style={{ backgroundColor: "#0B6F73", color: "#fff" }}>
            View All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-2 g-md-3">
            {products.map(product => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}