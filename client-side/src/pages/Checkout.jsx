import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Initialize address from localStorage if available
  const getSavedAddress = () => {
    try {
      const saved = localStorage.getItem('savedShippingAddress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved address:', e);
    }
    return {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    };
  };

  const [address, setAddress] = useState(getSavedAddress);

  // Save address to localStorage whenever it changes
  useEffect(() => {
    if (address.fullName || address.phone || address.addressLine1) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(address));
    }
  }, [address]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const getAuthToken = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo?.token || token || localStorage.getItem('token') || null;
    } catch {
      return token || localStorage.getItem('token') || null;
    }
  };

  const validateForm = () => {
    if (!address.fullName.trim()) return 'Full name is required';
    if (!address.phone.trim()) return 'Phone number is required';
    if (!address.addressLine1.trim()) return 'Address is required';
    if (!address.city.trim()) return 'City is required';
    if (!address.state.trim()) return 'State is required';
    if (!address.pincode.trim()) return 'Pincode is required';
    if (address.phone.trim().length < 10) return 'Enter a valid phone number';
    if (address.pincode.trim().length < 6) return 'Enter a valid 6-digit pincode';
    return null;
  };

  const placeOrder = async (method) => {
    const authToken = getAuthToken();
    const response = await axios.post(
      `${API_URL}/api/orders`,
      {
        shippingAddress: address,
        paymentMethod: method,
        paymentStatus: method === 'Online' ? 'Paid' : 'Pending',
        // Send cart items as fallback in case server-side cart is out of sync
        items: cartItems.map(item => ({
          productId: item.productId || item._id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          quantity: Number(item.quantity)
        }))
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (paymentMethod === 'Online') {
      setShowDemoPayment(true);
      return;
    }

    // COD order - place directly
    setLoading(true);
    try {
      const response = await placeOrder('COD');
      if (response.data.success) {
        await clearCart();
        navigate(`/order-success/${response.data.order._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPayment = async () => {
    setPaymentProcessing(true);
    setTimeout(async () => {
      try {
        const response = await placeOrder('Online');
        if (response.data.success) {
          await clearCart();
          setShowDemoPayment(false);
          navigate(`/order-success/${response.data.order._id}`);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Payment failed. Please try again.');
        setShowDemoPayment(false);
      } finally {
        setPaymentProcessing(false);
      }
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-lock" style={{ fontSize: '48px', color: '#0B6F73' }}></i>
        <h5 className="mt-3">Please login to checkout</h5>
        <Link to="/login" className="btn mt-3 text-white rounded-0" style={{ backgroundColor: '#0B6F73' }}>
          Login
        </Link>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x" style={{ fontSize: '48px', color: '#ccc' }}></i>
        <h5 className="mt-3">Your cart is empty</h5>
        <Link to="/shop" className="btn mt-3 text-white rounded-0" style={{ backgroundColor: '#0B6F73' }}>
          Shop Now
        </Link>
      </div>
    );
  }

  // Demo Payment Modal
  if (showDemoPayment) {
    return (
      <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="mx-auto" style={{ maxWidth: '500px' }}>
          <div className="bg-white shadow-sm rounded-0 overflow-hidden">
            <div className="p-4 text-white text-center" style={{ backgroundColor: '#0B6F73' }}>
              <i className="bi bi-shield-lock" style={{ fontSize: '32px' }}></i>
              <h5 className="mt-2 mb-0">Secure Payment</h5>
              <p className="small mb-0 opacity-75">Demo Payment Gateway</p>
            </div>

            <div className="p-4">
              <div className="text-center mb-4 p-3 bg-light rounded">
                <p className="text-muted small mb-1">Amount to Pay</p>
                <h3 className="fw-bold mb-0" style={{ color: '#0B6F73' }}>{'\u20B9'}{cartTotal}</h3>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Card Number</label>
                <input type="text" className="form-control rounded-0" defaultValue="4242 4242 4242 4242" style={{ borderColor: '#0B6F73' }} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Expiry Date</label>
                  <input type="text" className="form-control rounded-0" defaultValue="12/28" style={{ borderColor: '#0B6F73' }} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">CVV</label>
                  <input type="text" className="form-control rounded-0" defaultValue="123" style={{ borderColor: '#0B6F73' }} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Name on Card</label>
                <input type="text" className="form-control rounded-0" defaultValue={address.fullName} style={{ borderColor: '#0B6F73' }} />
              </div>

              <button
                className="btn w-100 text-white py-3 rounded-0 mb-3"
                style={{ backgroundColor: '#0B6F73' }}
                onClick={handleDemoPayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <span><span className="spinner-border spinner-border-sm me-2"></span>Processing Payment...</span>
                ) : (
                  <><i className="bi bi-lock-fill me-2"></i>Pay {'\u20B9'}{cartTotal}</>
                )}
              </button>

              <button
                className="btn btn-outline-secondary w-100 rounded-0"
                onClick={() => setShowDemoPayment(false)}
                disabled={paymentProcessing}
              >
                Cancel Payment
              </button>

              <p className="text-center text-muted small mt-3 mb-0">
                <i className="bi bi-info-circle me-1"></i>
                This is a demo payment page. No real payment will be charged.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Page Header */}
        <div className="text-center mb-4">
          <h2 style={{ color: '#0B6F73', fontWeight: '600' }}>
            <i className="bi bi-bag-check me-2"></i>
            Checkout
          </h2>
          <p className="text-muted">Complete your order</p>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            <div 
              className="bg-white p-4"
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h5 className="mb-3 fw-semibold" style={{ color: '#0B6F73' }}>
                <i className="bi bi-geo-alt me-2"></i>Shipping Address
              </h5>
              <form onSubmit={handlePlaceOrder}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Full Name *</label>
                    <input type="text" name="fullName" className="form-control" value={address.fullName} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Phone *</label>
                    <input type="tel" name="phone" className="form-control" value={address.phone} onChange={handleChange} required maxLength={10} style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-medium">Address Line 1 *</label>
                    <input type="text" name="addressLine1" className="form-control" value={address.addressLine1} onChange={handleChange} required placeholder="House no., Building, Street" style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-medium">Address Line 2</label>
                    <input type="text" name="addressLine2" className="form-control" value={address.addressLine2} onChange={handleChange} placeholder="Landmark, Area (optional)" style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-medium">City *</label>
                    <input type="text" name="city" className="form-control" value={address.city} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-medium">State *</label>
                    <input type="text" name="state" className="form-control" value={address.state} onChange={handleChange} required style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-medium">Pincode *</label>
                    <input type="text" name="pincode" className="form-control" value={address.pincode} onChange={handleChange} required maxLength={6} style={{ borderRadius: '8px' }} />
                  </div>
                </div>

              {/* Payment Method Selection */}
              <div className="mt-4">
                <h5 className="mb-3 fw-semibold" style={{ color: '#0B6F73' }}>
                  <i className="bi bi-credit-card me-2"></i>Payment Method
                </h5>

                <div
                  className="p-3 border mb-2"
                  style={{ borderRadius: '10px', borderColor: paymentMethod === 'COD' ? '#0B6F73' : '#dee2e6', backgroundColor: paymentMethod === 'COD' ? '#f0fafa' : 'white', cursor: 'pointer' }}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="form-check d-flex align-items-center gap-3">
                    <input className="form-check-input" type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-cash-stack" style={{ color: '#0B6F73', fontSize: '20px' }}></i>
                        <strong>Cash on Delivery (COD)</strong>
                      </div>
                      <p className="text-muted small mb-0 mt-1">Pay when your order is delivered</p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-3 border rounded-0"
                  style={{ borderColor: paymentMethod === 'Online' ? '#0B6F73' : '#dee2e6', backgroundColor: paymentMethod === 'Online' ? '#f0fafa' : 'white', cursor: 'pointer' }}
                  onClick={() => setPaymentMethod('Online')}
                >
                  <div className="form-check d-flex align-items-center gap-3">
                    <input className="form-check-input" type="radio" name="paymentMethod" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} />
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-credit-card" style={{ color: '#0B6F73', fontSize: '20px' }}></i>
                        <strong>Online Payment</strong>
                      </div>
                      <p className="text-muted small mb-0 mt-1">Pay securely with Credit/Debit Card, UPI, Net Banking</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mt-3 rounded-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>{error}
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 text-white py-3 mt-4 fw-semibold"
                style={{ backgroundColor: '#0B6F73', fontSize: '16px', borderRadius: '10px' }}
                disabled={loading}
              >
                {loading ? (
                  <span><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</span>
                ) : paymentMethod === 'Online' ? (
                  <><i className="bi bi-lock-fill me-2"></i>Proceed to Pay - {'\u20B9'}{cartTotal}</>
                ) : (
                  <><i className="bi bi-bag-check me-2"></i>Place Order (COD) - {'\u20B9'}{cartTotal}</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div 
            className="bg-white p-4"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              position: 'sticky',
              top: '20px'
            }}
          >
            <h5 className="mb-3 fw-semibold" style={{ color: '#0B6F73' }}>
              <i className="bi bi-bag me-2"></i>Order Summary ({cartItems.length} items)
            </h5>
            {cartItems.map((item) => (
              <div key={item.productId || item._id} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                <div className="flex-grow-1">
                  <p className="mb-0 small fw-semibold">{item.name}</p>
                  <p className="mb-0 text-muted small">Qty: {item.quantity}</p>
                </div>
                <span className="fw-bold" style={{ color: '#0B6F73' }}>{'\u20B9'}{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>{'\u20B9'}{cartTotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className="text-success fw-semibold">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Payment</span>
                <span className="badge" style={{ backgroundColor: '#0B6F73', borderRadius: '20px', padding: '5px 12px' }}>
                  {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3 mt-2">
                <span>Total</span>
                <span style={{ color: '#0B6F73' }}>{'\u20B9'}{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
