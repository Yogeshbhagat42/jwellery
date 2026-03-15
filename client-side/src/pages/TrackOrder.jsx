import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const headerStyle = {
  backgroundColor: '#0B6F73',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center'
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Order not found. Please check the Order ID.');
      }
    } catch {
      setError('Order not found. Please check your Order ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStep = order ? getStatusStep(order.orderStatus) : -1;

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff', minHeight: '70vh' }}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Track Your Order</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Track Order</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '700px' }}>
        <div className="text-center mb-4">
          <p className="text-muted" style={{ fontSize: '14px' }}>Enter your Order ID to check the current status of your order.</p>
        </div>

        <form onSubmit={handleTrack} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Order ID (e.g., 683a5f...)"
              style={{ fontSize: '14px' }}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <button className="btn text-white px-4" style={{ backgroundColor: '#0B6F73', fontSize: '14px' }} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        {order && (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>Order #{order._id.slice(-8).toUpperCase()}</h6>
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </small>
                </div>
                <span className={`badge bg-${order.orderStatus === 'Delivered' ? 'success' : order.orderStatus === 'Cancelled' ? 'danger' : 'warning'}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Progress Bar */}
              {order.orderStatus !== 'Cancelled' && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between position-relative" style={{ padding: '0 10px' }}>
                    <div style={{ position: 'absolute', top: '14px', left: '30px', right: '30px', height: '3px', backgroundColor: '#e9ecef', zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', top: '14px', left: '30px', height: '3px', backgroundColor: '#0B6F73', zIndex: 1, width: `${(currentStep / (steps.length - 1)) * (100 - 10)}%`, transition: 'width 0.5s' }}></div>
                    {steps.map((step, idx) => (
                      <div key={step} className="text-center" style={{ zIndex: 2 }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1"
                          style={{
                            width: 30, height: 30,
                            backgroundColor: idx <= currentStep ? '#0B6F73' : '#e9ecef',
                            color: idx <= currentStep ? '#fff' : '#999',
                            fontSize: '12px', fontWeight: 700
                          }}
                        >
                          {idx <= currentStep ? <i className="bi bi-check"></i> : idx + 1}
                        </div>
                        <small style={{ fontSize: '11px', color: idx <= currentStep ? '#0B6F73' : '#999' }}>{step}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <h6 className="fw-bold mt-4 mb-3" style={{ fontSize: '13px' }}>Items</h6>
              {order.items?.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-3 mb-2 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                  <img src={item.image || '/placeholder.jpg'} alt={item.name}
                       style={{ width: 45, height: 45, objectFit: 'cover', borderRadius: 6 }} />
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>{item.name}</p>
                    <small className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.quantity}</small>
                  </div>
                  <span className="fw-bold" style={{ fontSize: '13px' }}>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold" style={{ fontSize: '14px' }}>Total</span>
                <span className="fw-bold" style={{ fontSize: '14px', color: '#0B6F73' }}>{formatCurrency(order.totalAmount)}</span>
              </div>

              {/* Shipping Address */}
              <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                <h6 className="fw-bold mb-2" style={{ fontSize: '13px' }}>Shipping To</h6>
                <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                  {order.shippingAddress?.fullName}<br />
                  {order.shippingAddress?.addressLine1}<br />
                  {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                  Phone: {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {!order && !error && !loading && (
          <div className="text-center mt-4 text-muted">
            <i className="bi bi-box-seam" style={{ fontSize: '48px', color: '#ddd' }}></i>
            <p className="mt-2" style={{ fontSize: '13px' }}>Your order details will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
