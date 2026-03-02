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
      <div className="container py-5 text-center">
        <i className="bi bi-heart" style={{ fontSize: '48px', color: '#ccc' }}></i>
        <h5 className="mt-3" style={{ color: '#333' }}>Please login to view your wishlist</h5>
        <Link to="/login" className="btn mt-3 rounded-0 text-white" style={{ backgroundColor: '#0B6F73' }}>
          Login
        </Link>
      </div>
    );
  }

  if (wishlistLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: "#0B6F73" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h4 className="text-center mb-4" style={{ color: "#0B6F73" }}>
        My Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
      </h4>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heart" style={{ fontSize: '64px', color: '#ddd' }}></i>
          <h5 className="mt-3 text-muted">Your wishlist is empty</h5>
          <p className="text-muted">Browse our collection and add your favourites here.</p>
          <Link to="/shop" className="btn rounded-0 text-white mt-2" style={{ backgroundColor: '#0B6F73' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 h-100 shadow-sm position-relative">
                {/* Remove button */}
                <button
                  className="btn position-absolute top-0 end-0 m-2 p-1"
                  style={{ zIndex: 2, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handleRemove(product._id)}
                >
                  <i className="bi bi-x-lg" style={{ fontSize: '14px', color: '#666' }}></i>
                </button>

                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                    <h6 className="card-title small fw-semibold">{product.name}</h6>
                  </Link>
                  <p className="text-secondary small mb-2">{product.category}</p>
                  <p className="fw-bold mb-3">{'\u20B9'}{product.price}</p>
                  <button
                    className="btn w-100 rounded-0 mt-auto text-white"
                    style={{ backgroundColor: '#0B6F73' }}
                    onClick={() => handleAddToCart(product)}
                    disabled={addingId === product._id}
                  >
                    {addingId === product._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
