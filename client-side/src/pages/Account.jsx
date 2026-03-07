import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ORDER_STAGES = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

function OrderTracker({ status }) {
  const isCancelled = status === 'Cancelled';
  const currentIndex = ORDER_STAGES.indexOf(status);

  if (isCancelled) {
    return (
      <div className="d-flex align-items-center gap-2 mt-2 p-2 rounded" style={{ backgroundColor: '#f8d7da' }}>
        <i className="bi bi-x-circle-fill text-danger"></i>
        <span className="text-danger fw-semibold small">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between position-relative">
        {/* Progress Line */}
        <div className="position-absolute" style={{
          top: '14px', left: '20px', right: '20px', height: '3px',
          backgroundColor: '#e9ecef', zIndex: 0
        }}>
          <div style={{
            width: `${currentIndex >= 0 ? (currentIndex / (ORDER_STAGES.length - 1)) * 100 : 0}%`,
            height: '100%', backgroundColor: '#0B6F73',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {ORDER_STAGES.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={stage} className="text-center d-flex flex-column align-items-center" style={{ zIndex: 1, flex: 1 }}>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mb-1"
                style={{
                  width: 30, height: 30,
                  backgroundColor: isCompleted ? '#0B6F73' : '#e9ecef',
                  color: isCompleted ? 'white' : '#999',
                  border: isCurrent ? '3px solid #0B6F73' : 'none',
                  fontSize: '12px', fontWeight: 'bold'
                }}
              >
                {isCompleted ? <i className="bi bi-check"></i> : index + 1}
              </div>
              <span className="small" style={{
                color: isCompleted ? '#0B6F73' : '#999',
                fontWeight: isCurrent ? 'bold' : 'normal',
                fontSize: '10px'
              }}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id.slice(-8).toUpperCase()}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
        </head>
        <body>${printContent}<script>setTimeout(() => { window.print(); window.close(); }, 500);</script></body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
      <div className="bg-white rounded shadow" style={{ maxWidth: '750px', width: '95%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="mb-0 fw-bold" style={{ color: '#0B6F73' }}>Invoice</h6>
          <div className="d-flex gap-2">
            <button className="btn btn-sm text-white rounded-0" style={{ backgroundColor: '#0B6F73' }} onClick={handlePrint}>
              <i className="bi bi-printer me-1"></i>Print
            </button>
            <button className="btn btn-sm btn-outline-secondary rounded-0" onClick={onClose}>Close</button>
          </div>
        </div>
        <div ref={invoiceRef} className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
            <div>
              <h4 className="mb-1 fw-bold" style={{ color: '#0B6F73' }}>JEWELLERY STORE</h4>
              <p className="text-muted small mb-0">Premium Jewelry Collection</p>
              <p className="text-muted small mb-0">support@jewellerystore.com</p>
            </div>
            <div className="text-end">
              <h5 className="fw-bold mb-1" style={{ color: '#0B6F73' }}>INVOICE</h5>
              <p className="small mb-0"><strong>No:</strong> INV-{order._id.slice(-8).toUpperCase()}</p>
              <p className="small mb-0"><strong>Date:</strong> {formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-6">
              <h6 className="fw-bold" style={{ color: '#0B6F73' }}>Bill To:</h6>
              <p className="mb-0 fw-semibold">{order.shippingAddress?.fullName}</p>
              <p className="mb-0 text-muted small">{order.shippingAddress?.phone}</p>
              <p className="mb-0 text-muted small">{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p className="mb-0 text-muted small">{order.shippingAddress.addressLine2}</p>}
              <p className="mb-0 text-muted small">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
            <div className="col-6 text-end">
              <p className="small mb-0"><strong>Order:</strong> #{order._id.slice(-8).toUpperCase()}</p>
              <p className="small mb-0"><strong>Payment:</strong> {order.paymentMethod === 'Online' ? 'Online (Paid)' : 'COD'}</p>
              <p className="small mb-0"><strong>Status:</strong> {order.orderStatus}</p>
            </div>
          </div>

          <table className="table table-bordered mb-4">
            <thead style={{ backgroundColor: '#0B6F73', color: 'white' }}>
              <tr>
                <th style={{ fontSize: '12px' }}>#</th>
                <th style={{ fontSize: '12px' }}>Item</th>
                <th style={{ fontSize: '12px' }} className="text-center">Qty</th>
                <th style={{ fontSize: '12px' }} className="text-end">Price</th>
                <th style={{ fontSize: '12px' }} className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '12px' }}>{i + 1}</td>
                  <td style={{ fontSize: '12px' }}>{item.name}</td>
                  <td className="text-center" style={{ fontSize: '12px' }}>{item.quantity}</td>
                  <td className="text-end" style={{ fontSize: '12px' }}>{'\u20B9'}{item.price.toLocaleString('en-IN')}</td>
                  <td className="text-end fw-semibold" style={{ fontSize: '12px' }}>{'\u20B9'}{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row justify-content-end">
            <div className="col-5">
              <div className="d-flex justify-content-between mb-1"><span className="text-muted small">Subtotal</span><span className="small">{'\u20B9'}{order.totalAmount.toLocaleString('en-IN')}</span></div>
              <div className="d-flex justify-content-between mb-1"><span className="text-muted small">Shipping</span><span className="text-success small">Free</span></div>
              <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-1"><span>Grand Total</span><span style={{ color: '#0B6F73' }}>{'\u20B9'}{order.totalAmount.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-top text-center">
            <p className="text-muted small mb-0">Thank you for shopping with Jewellery Store!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { user, logout, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const authToken = token || localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'Shipped': 'primary',
      'Out for Delivery': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Invoice Modal */}
        {invoiceOrder && (
          <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
        )}

        {/* Page Header */}
        <div className="text-center mb-4">
          <h2 style={{ color: '#0B6F73', fontWeight: '600' }}>
            <i className="bi bi-person-circle me-2"></i>
            My Account
          </h2>
          <p className="text-muted">Manage your profile and track your orders</p>
        </div>

        <div className="row">
          {/* Profile Card */}
          <div className="col-md-4">
            <div 
              className="card border-0 mb-4"
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: '#0B6F73', 
                      color: 'white', 
                      fontSize: '32px',
                      boxShadow: '0 4px 15px rgba(11, 111, 115, 0.3)'
                    }}
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <h5 className="mb-0 mt-2">{user.name}</h5>
                  <p className="text-muted small mb-0">{user.email}</p>
                </div>
                <hr />
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person me-2" style={{ color: '#0B6F73', width: '20px' }}></i>
                    <span className="text-muted small">Name:</span>
                    <span className="ms-auto fw-medium">{user.name}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-envelope me-2" style={{ color: '#0B6F73', width: '20px' }}></i>
                    <span className="text-muted small">Email:</span>
                    <span className="ms-auto fw-medium small">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="d-flex align-items-center">
                      <i className="bi bi-phone me-2" style={{ color: '#0B6F73', width: '20px' }}></i>
                      <span className="text-muted small">Phone:</span>
                      <span className="ms-auto fw-medium">{user.phone}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger w-100"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div 
              className="card border-0 mb-4"
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="card-body p-4">
                <h6 className="mb-3 fw-semibold" style={{ color: "#0B6F73" }}>
                  <i className="bi bi-graph-up me-2"></i>Order Summary
                </h6>
                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <span className="text-muted small">Total Orders</span>
                  <span className="badge bg-secondary px-3">{orders.length}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <span className="text-muted small">Delivered</span>
                  <span className="badge bg-success px-3">{orders.filter(o => o.orderStatus === 'Delivered').length}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">In Progress</span>
                  <span className="badge bg-info px-3">{orders.filter(o => !['Delivered', 'Cancelled'].includes(o.orderStatus)).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="col-md-8">
            <div 
              className="card border-0"
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="card-body p-4">
                <h5 className="mb-4 fw-semibold" style={{ color: "#0B6F73" }}>
                  <i className="bi bi-bag me-2"></i>My Orders
                </h5>
                
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: "#0B6F73", width: '3rem', height: '3rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-5">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ width: '80px', height: '80px', backgroundColor: '#f8f9fa' }}
                    >
                      <i className="bi bi-bag-x" style={{ fontSize: '40px', color: '#ccc' }}></i>
                    </div>
                    <h5 className="text-muted mb-2">No orders yet</h5>
                    <p className="text-muted small mb-3">Start shopping to see your orders here</p>
                    <Link 
                      to="/shop" 
                      className="btn text-white px-4"
                      style={{ backgroundColor: "#0B6F73", borderRadius: '8px' }}
                    >
                      <i className="bi bi-bag-plus me-2"></i>Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div 
                        key={order._id} 
                        className="mb-3 overflow-hidden"
                        style={{ 
                          borderRadius: '10px',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        {/* Order Header */}
                        <div
                          className="p-3 d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        >
                        <div>
                          <p className="mb-0 fw-semibold small">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mb-0 text-muted small">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {' | '}{order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fw-bold" style={{ color: '#0B6F73' }}>{'\u20B9'}{order.totalAmount}</span>
                          <span className={`badge bg-${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <i className={`bi bi-chevron-${expandedOrder === order._id ? 'up' : 'down'}`}></i>
                        </div>
                      </div>

                      {/* Order Tracker - Always visible */}
                      <div className="px-3 pb-2">
                        <OrderTracker status={order.orderStatus} />
                      </div>

                      {/* Expanded Details */}
                      {expandedOrder === order._id && (
                        <div className="p-3 border-top">
                          {/* Items */}
                          <h6 className="small fw-bold mb-2" style={{ color: '#0B6F73' }}>Items Ordered</h6>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center gap-2 mb-2 p-2 bg-light rounded">
                              <img
                                src={item.image || '/placeholder.jpg'}
                                alt={item.name}
                                style={{ width: 45, height: 45, objectFit: 'cover', borderRadius: 4 }}
                                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                              />
                              <div className="flex-grow-1">
                                <p className="mb-0 small fw-semibold">{item.name}</p>
                                <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>
                                  Qty: {item.quantity} x {'\u20B9'}{item.price}
                                </p>
                              </div>
                              <span className="fw-bold small">{'\u20B9'}{item.price * item.quantity}</span>
                            </div>
                          ))}

                          {/* Shipping Address */}
                          <div className="mt-3 p-2 bg-light rounded">
                            <h6 className="small fw-bold mb-1" style={{ color: '#0B6F73' }}>Shipping Address</h6>
                            <p className="mb-0 small">{order.shippingAddress?.fullName}</p>
                            <p className="mb-0 text-muted small">{order.shippingAddress?.phone}</p>
                            <p className="mb-0 text-muted small">
                              {order.shippingAddress?.addressLine1}
                              {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                            </p>
                            <p className="mb-0 text-muted small">
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </p>
                          </div>

                          {/* Payment Info */}
                          <div className="mt-2 d-flex justify-content-between align-items-center p-2 bg-light rounded">
                            <span className="small"><strong>Payment:</strong> {order.paymentMethod === 'Online' ? 'Online (Paid)' : 'Cash on Delivery'}</span>
                            <span className="small fw-bold" style={{ color: '#0B6F73' }}>Total: {'\u20B9'}{order.totalAmount}</span>
                          </div>

                          {/* Actions */}
                          <div className="mt-3 d-flex gap-2">
                            <button
                              className="btn btn-sm text-white"
                              style={{ backgroundColor: '#0B6F73', borderRadius: '6px' }}
                              onClick={(e) => { e.stopPropagation(); setInvoiceOrder(order); }}
                            >
                              <i className="bi bi-receipt me-1"></i>Invoice
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
