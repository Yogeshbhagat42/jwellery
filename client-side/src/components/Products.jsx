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
        category: product.category || '',
        discount: product.discountPercentage ||
                 Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) ||
                 Math.round(((product.price * 2 - product.price) / (product.price * 2)) * 100)
      }));

      setProducts(processedProducts.slice(0, 8));
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
    <div style={{ padding: '70px 0', backgroundColor: '#fff' }}>
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-uppercase mb-2" style={{ color: '#0B6F73', fontSize: '11px', letterSpacing: '3px', fontWeight: 600 }}>
            Fresh Picks
          </p>
          <h2 className="fw-bold" style={{ color: '#1a1a1a', fontSize: '28px' }}>
            New Arrivals
          </h2>
          <p className="text-muted mt-2" style={{ fontSize: '15px' }}>
            Discover our latest collection of stunning pieces
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "#0B6F73", width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {products.map((p) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <div
                    className="card h-100 border-0 overflow-hidden"
                    style={{
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 15px rgba(0,0,0,0.06)',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      borderRadius: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.06)';
                    }}
                  >
                    <Link to={`/product/${p.id}`} className="position-relative d-block overflow-hidden">
                      <img
                        src={p.image}
                        className="card-img-top"
                        alt={p.name}
                        style={{
                          height: '300px',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                      />
                      {p.discount > 0 && (
                        <span
                          className="position-absolute top-0 start-0 m-3"
                          style={{
                            backgroundColor: '#0B6F73',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {p.discount}% OFF
                        </span>
                      )}
                    </Link>

                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <div>
                        {p.category && (
                          <p className="mb-1 text-muted" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            {p.category}
                          </p>
                        )}
                        <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                          <p className="mb-2 fw-semibold" style={{ fontSize: '15px', lineHeight: 1.3 }}>{p.name}</p>
                        </Link>

                        <p className="mb-3" style={{ fontSize: '14px' }}>
                          <span className="fw-bold" style={{ color: '#0B6F73', fontSize: '17px' }}>₹{p.price}</span>{" "}
                          <span className="text-muted text-decoration-line-through" style={{ fontSize: '13px' }}>
                            ₹{p.oldPrice}
                          </span>
                        </p>
                      </div>

                      <button
                        className="btn w-100 btn-sm rounded-0 fw-semibold"
                        style={{
                          backgroundColor: addedId === p.id ? "#28a745" : "#0B6F73",
                          color: "#fff",
                          fontSize: '12px',
                          padding: '10px 0',
                          letterSpacing: '1px',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleAddToCart(p)}
                        disabled={addingId === p.id}
                      >
                        {addingId === p.id ? (
                          <span className="spinner-border spinner-border-sm me-1"></span>
                        ) : addedId === p.id ? (
                          <><i className="bi bi-check me-1"></i>ADDED</>
                        ) : (
                          'ADD TO CART'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Link to="/shop">
                <button
                  className="btn px-5 py-3 rounded-0 fw-semibold"
                  style={{
                    backgroundColor: "#0B6F73",
                    color: "#fff",
                    fontSize: '13px',
                    letterSpacing: '2px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#085456';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(11,111,115,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B6F73';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
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
