// CartSidebar.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040 }}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Sidebar */}
      <div 
        className="offcanvas offcanvas-end show" 
        style={{ width: '400px', maxWidth: '100%', visibility: 'visible', zIndex: 1045 }}
      >
        {/* Header */}
        <div className="offcanvas-header border-bottom" style={{ backgroundColor: '#0B6F73' }}>
          <h5 className="offcanvas-title text-white">
            Shopping Cart ({cartItems.length})
          </h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setIsCartOpen(false)}
          ></button>
        </div>

        {/* Body */}
        <div className="offcanvas-body d-flex flex-column p-0">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x display-1 text-secondary"></i>
              <p className="mt-3 text-secondary">Your cart is empty</p>
              <button 
                className="btn btn-outline-secondary mt-3"
                onClick={() => setIsCartOpen(false)}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-grow-1 overflow-auto p-3">
                {cartItems.map((item) => (
                  <div key={item.productId || item._id} className="card mb-3 border-0 border-bottom rounded-0 pb-2">
                    <div className="row g-0">
                      {/* Product Image */}
                      <div className="col-3">
                        <img 
                          src={item.image || '/placeholder.jpg'} 
                          className="img-fluid rounded" 
                          alt={item.name}
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="col-9">
                        <div className="card-body p-0 ps-2">
                          {/* Title and Remove Button */}
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="card-title small fw-bold mb-1">{item.name}</h6>
                            <button 
                              className="btn p-0 border-0"
                              onClick={() => removeFromCart(item.productId || item._id)}
                            >
                              <i className="bi bi-x-lg text-danger"></i>
                            </button>
                          </div>

                          {/* Price */}
                          <p className="text-secondary small mb-1">₹{item.price}</p>

                          {/* Quantity Controls */}
                          <div className="d-flex align-items-center justify-content-between mt-1">
                            <div className="d-flex align-items-center border rounded">
                              <button 
                                className="btn btn-sm px-2 py-0"
                                onClick={() => updateQuantity(item.productId || item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >-</button>
                              <span className="px-2 small">{item.quantity}</span>
                              <button 
                                className="btn btn-sm px-2 py-0"
                                onClick={() => updateQuantity(item.productId || item._id, item.quantity + 1)}
                              >+</button>
                            </div>
                            <span className="fw-bold small">₹{item.price * item.quantity}</span>
                          </div>

                          {/* View Details Link */}
                          <Link 
                            to={`/product/${item.productId || item._id}`} 
                            className="small text-decoration-none d-block mt-1"
                            style={{ color: '#0B6F73' }}
                            onClick={() => setIsCartOpen(false)}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Total */}
              <div className="border-top p-3 bg-light">
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Subtotal:</span>
                  <span className="fw-bold">₹{cartTotal}</span>
                </div>
                <div className="d-grid gap-2">
                  <Link
                    to="/checkout"
                    className="btn text-white"
                    style={{ backgroundColor: '#0B6F73' }}
                    onClick={() => setIsCartOpen(false)}
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ✅ IMPORTANT: Add this default export at the bottom
export default CartSidebar;