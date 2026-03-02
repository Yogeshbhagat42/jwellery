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

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="position-relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            className="card-img-top"
            alt={product.name}
            style={{ height: '250px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        </Link>
        <button
          onClick={toggleWishlist}
          className="btn position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <i
            className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`}
            style={{ fontSize: '16px', color: wishlisted ? '#e74c3c' : '#666' }}
          ></i>
        </button>
      </div>
      <div className="card-body">
        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
          <h6 className="card-title">{product.name}</h6>
        </Link>
        <p className="text-secondary small mb-2">{product.category}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">{'\u20B9'}{product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="btn btn-sm"
            style={{ backgroundColor: '#0B6F73', color: 'white' }}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
        {showMessage && (
          <div className="alert alert-success mt-2 py-1 small text-center">
            Added to cart!
          </div>
        )}
      </div>
    </div>
  );
}
