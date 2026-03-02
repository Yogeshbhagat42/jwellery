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

      setProducts(processedProducts.slice(0, 4)); // Show only 4 on homepage
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
    <div className="container py-5">
      <h5 className="text-center mb-4" style={{ color: "#0B6F73" }}>New Arrivals</h5>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#0B6F73" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "10px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  minWidth: "280px",
                  flexShrink: 0,
                }}
              >
                <div className="card border-0 h-100 shadow-sm">
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.image}
                      className="img-fluid"
                      alt={p.name}
                      style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                  </Link>

                  <div className="card-body p-3 d-flex flex-column justify-content-between bg-white">
                    <div>
                      <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                        <p className="small mb-1 fw-semibold">{p.name}</p>
                      </Link>

                      <p className="small mb-2">
                        <span className="fw-bold">₹{p.price}</span>{" "}
                        <span className="text-muted text-decoration-line-through">
                          ₹{p.oldPrice}
                        </span>
                        <span
                          className="badge ms-2"
                          style={{ backgroundColor: "#0B6F73", color: "#fff" }}
                        >
                          {p.discount}% OFF
                        </span>
                      </p>
                    </div>

                    <button
                      className="btn w-100 btn-sm rounded-0"
                      style={{ backgroundColor: "#0B6F73", color: "#fff" }}
                      onClick={() => handleAddToCart(p)}
                      disabled={addingId === p.id}
                    >
                      {addingId === p.id ? 'Adding...' : addedId === p.id ? 'Added!' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VIEW ALL BUTTON - Goes to ALL products (no category filter) */}
          <div className="text-center mt-4">
            <Link to="/shop">
              <button
                className="btn px-4 rounded-0"
                style={{ backgroundColor: "#0B6F73", color: "#fff" }}
              >
                VIEW ALL PRODUCTS
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}