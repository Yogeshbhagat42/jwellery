import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      const result = await addToCart(product, 1);
      setIsAdding(false);

      if (result && result.success) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      setIsAdding(false);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 50;

  return (
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
      <div className="position-relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            className="card-img-top"
            alt={product.name}
            style={{ height: '220px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        </Link>
        {discount > 0 && (
          <span 
            className="position-absolute top-0 start-0 m-2 badge"
            style={{ backgroundColor: '#0B6F73', fontSize: '10px' }}
          >
            {discount}% OFF
          </span>
        )}
        <button
          onClick={toggleWishlist}
          className="btn position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <i
            className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`}
            style={{ fontSize: '16px', color: wishlisted ? '#e74c3c' : '#666' }}
          ></i>
        </button>
      </div>
      <div className="card-body p-3">
        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
          <h6 className="card-title mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>{product.name}</h6>
        </Link>
        <p className="text-muted small mb-2" style={{ fontSize: '12px' }}>{product.category}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold" style={{ color: '#0B6F73', fontSize: '15px' }}>₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '12px' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="btn btn-sm w-100 mt-2 rounded-0"
          style={{ 
            backgroundColor: showMessage ? '#28a745' : '#0B6F73', 
            color: 'white',
            fontSize: '12px',
            padding: '8px 0',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isAdding ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : showMessage ? (
            <><i className="bi bi-check me-1"></i>Added!</>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
}
