import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      
      const processedProducts = response.data.map(product => ({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.originalPrice || product.oldPrice || product.price * 2,
        image: product.image || product.images?.[0] || '/placeholder.jpg',
        discount: product.discountPercentage || 
                 Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) || 
                 Math.round(((product.price * 2 - product.price) / (product.price * 2)) * 100)
      }));

      setProducts(processedProducts.slice(0, 8)); // Show 8 on homepage
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (p) => {
    try {
      setAddingId(p.id);
      const result = await addToCart({ _id: p.id, name: p.name, price: p.price, images: [p.image] }, 1);
      setAddingId(null);
      if (result && result.success) {
        setAddedId(p.id);
        setTimeout(() => setAddedId(null), 2000);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      setAddingId(null);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <h5 className="text-center mb-2" style={{ color: "#0B6F73", fontSize: '18px', fontWeight: 600 }}>
          New Arrivals
        </h5>
        <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>
          Discover our latest collection of stunning pieces
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "#0B6F73" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* PRODUCTS GRID */}
            <div className="row g-3">
              {products.map((p) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <div 
                    className="card h-100 border-0"
                    style={{ 
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                    }}
                  >
                    <Link to={`/product/${p.id}`}>
                      <img
                        src={p.image}
                        className="card-img-top"
                        alt={p.name}
                        style={{ height: '220px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                    </Link>

                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <div>
                        <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                          <p className="mb-1 fw-semibold" style={{ fontSize: '14px' }}>{p.name}</p>
                        </Link>

                        <p className="mb-2" style={{ fontSize: '13px' }}>
                          <span className="fw-bold" style={{ color: '#0B6F73' }}>₹{p.price}</span>{" "}
                          <span className="text-muted text-decoration-line-through">
                            ₹{p.oldPrice}
                          </span>
                          <span
                            className="badge ms-2"
                            style={{ backgroundColor: "#0B6F73", color: "#fff", fontSize: '10px' }}
                          >
                            {p.discount}% OFF
                          </span>
                        </p>
                      </div>

                      <button
                        className="btn w-100 btn-sm rounded-0"
                        style={{ 
                          backgroundColor: addedId === p.id ? "#28a745" : "#0B6F73", 
                          color: "#fff",
                          fontSize: '12px',
                          padding: '8px 0',
                          transition: 'background-color 0.3s ease'
                        }}
                        onClick={() => handleAddToCart(p)}
                        disabled={addingId === p.id}
                      >
                        {addingId === p.id ? (
                          <span className="spinner-border spinner-border-sm me-1"></span>
                        ) : addedId === p.id ? (
                          <><i className="bi bi-check me-1"></i>Added!</>
                        ) : (
                          'ADD TO CART'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW ALL BUTTON */}
            <div className="text-center mt-5">
              <Link to="/shop">
                <button
                  className="btn px-5 py-2 rounded-0 fw-semibold"
                  style={{ 
                    backgroundColor: "#0B6F73", 
                    color: "#fff",
                    fontSize: '14px'
                  }}
                >
                  VIEW ALL PRODUCTS
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}