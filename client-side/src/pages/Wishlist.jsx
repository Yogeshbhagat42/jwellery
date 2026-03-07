import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Wishlist() {
  const { wishlistItems, wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    await addToCart(product, 1);
    setAddingId(null);
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <div className="container py-5 text-center">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: '#f8f9fa'
            }}
          >
            <i className="bi bi-heart" style={{ fontSize: '48px', color: '#0B6F73' }}></i>
          </div>
          <h4 style={{ color: '#333' }}>Please login to view your wishlist</h4>
          <p className="text-muted">Sign in to save and view your favourite items</p>
          <Link 
            to="/login" 
            className="btn px-4 py-2 mt-2 text-white" 
            style={{ 
              backgroundColor: '#0B6F73',
              borderRadius: '8px'
            }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <div className="container py-5 text-center">
          <div className="spinner-border" style={{ color: "#0B6F73", width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h2 style={{ color: '#0B6F73', fontWeight: '600' }}>
            <i className="bi bi-heart-fill me-2" style={{ color: '#e74c3c' }}></i>
            My Wishlist
          </h2>
          {wishlistItems.length > 0 && (
            <p className="text-muted">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-5">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{ 
                width: '120px', 
                height: '120px', 
                backgroundColor: '#f8f9fa'
              }}
            >
              <i className="bi bi-heart" style={{ fontSize: '60px', color: '#ccc' }}></i>
            </div>
            <h4 className="text-muted mb-3">Your wishlist is empty</h4>
            <p className="text-muted mb-4">Browse our collection and save your favourite pieces here.</p>
            <Link 
              to="/shop" 
              className="btn px-4 py-2 text-white" 
              style={{ 
                backgroundColor: '#0B6F73',
                borderRadius: '8px'
              }}
            >
              <i className="bi bi-bag me-2"></i>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div 
                  className="card border-0 h-100 position-relative"
                  style={{ 
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Remove button */}
                  <button
                    className="btn position-absolute top-0 end-0 m-2 p-0 border-0"
                    style={{ 
                      zIndex: 2, 
                      background: 'rgba(255,255,255,0.95)', 
                      borderRadius: '50%', 
                      width: '36px', 
                      height: '36px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => handleRemove(product._id)}
                    title="Remove from wishlist"
                  >
                    <i className="bi bi-x-lg" style={{ fontSize: '14px', color: '#e74c3c' }}></i>
                  </button>

                  <Link to={`/product/${product._id}`}>
                    <div style={{ overflow: 'hidden' }}>
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        className="card-img-top"
                        alt={product.name}
                        style={{ 
                          height: '250px', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                  </Link>
                  <div className="card-body d-flex flex-column p-3">
                    <span 
                      className="text-uppercase small mb-1"
                      style={{ color: '#0B6F73', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}
                    >
                      {product.category}
                    </span>
                    <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                      <h6 className="card-title fw-semibold mb-2" style={{ fontSize: '15px' }}>{product.name}</h6>
                    </Link>
                    <p className="fw-bold mb-3" style={{ color: '#0B6F73', fontSize: '18px' }}>
                      ₹{product.price?.toLocaleString()}
                    </p>
                    <button
                      className="btn w-100 mt-auto text-white"
                      style={{ 
                        backgroundColor: '#0B6F73',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product._id}
                    >
                      {addingId === product._id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-bag-plus me-2"></i>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
