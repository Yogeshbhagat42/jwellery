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
      <div className="position-relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            className="card-img-top"
            alt={product.name}
            style={{
              height: '300px',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
          />
        </Link>
        {discount > 0 && (
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
            {discount}% OFF
          </span>
        )}
        <button
          onClick={toggleWishlist}
          className="btn position-absolute top-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <i
            className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`}
            style={{ fontSize: '16px', color: wishlisted ? '#e74c3c' : '#666' }}
          ></i>
        </button>
      </div>
      <div className="card-body p-3">
        <p className="text-muted mb-1" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {product.category}
        </p>
        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
          <h6 className="card-title mb-2" style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h6>
        </Link>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="fw-bold" style={{ color: '#0B6F73', fontSize: '17px' }}>₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '13px' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="btn btn-sm w-100 rounded-0 fw-semibold"
          style={{
            backgroundColor: showMessage ? '#28a745' : '#0B6F73',
            color: 'white',
            fontSize: '12px',
            padding: '10px 0',
            letterSpacing: '1px',
            transition: 'all 0.3s ease'
          }}
        >
          {isAdding ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : showMessage ? (
            <><i className="bi bi-check me-1"></i>ADDED</>
          ) : (
            'ADD TO CART'
          )}
        </button>
      </div>
    </div>
  );
}
