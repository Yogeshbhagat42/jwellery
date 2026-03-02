import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const getAuthToken = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo?.token || token || localStorage.getItem('token') || null;
    } catch {
      return token || localStorage.getItem('token') || null;
    }
  };

  const fetchOrder = async () => {
    try {
      const authToken = getAuthToken();
      const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order?._id?.slice(-8).toUpperCase()}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: 'Poppins', Arial, sans-serif; padding: 20px; }
            @media print {
              .no-print { display: none !important; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const generateInvoiceNumber = () => {
    if (!order) return '';
    return 'INV-' + order._id.slice(-8).toUpperCase();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#0B6F73' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Success Message */}
      {!showInvoice && (
        <div className="text-center bg-white p-5 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <div
            className="d-inline-flex align-items-center justify-content-center mb-4"
            style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#d4edda' }}
          >
            <i className="bi bi-check-lg" style={{ fontSize: '40px', color: '#0B6F73' }}></i>
          </div>

          <h4 style={{ color: '#0B6F73' }}>Order Placed Successfully!</h4>
          <p className="text-muted mt-2">
            Thank you for your order. {order?.paymentMethod === 'Online' ? 'Payment received successfully.' : 'Payment will be collected at the time of delivery (COD).'}
          </p>

          {orderId && (
            <div className="bg-light p-3 rounded mt-3 mb-4">
              <p className="mb-0 small text-muted">Order ID</p>
              <p className="mb-0 fw-bold" style={{ color: '#0B6F73', fontSize: '14px', wordBreak: 'break-all' }}>
                {orderId}
              </p>
            </div>
          )}

          {order && (
            <div className="text-start bg-light p-3 rounded mb-4">
              <div className="row">
                <div className="col-6">
                  <p className="small text-muted mb-1">Total Amount</p>
                  <p className="fw-bold mb-0" style={{ color: '#0B6F73' }}>{'\u20B9'}{order.totalAmount}</p>
                </div>
                <div className="col-6">
                  <p className="small text-muted mb-1">Payment Method</p>
                  <p className="fw-bold mb-0">
                    <span className={`badge ${order.paymentMethod === 'Online' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {order.paymentMethod === 'Online' ? 'Paid Online' : 'COD'}
                    </span>
                  </p>
                </div>
                <div className="col-6 mt-2">
                  <p className="small text-muted mb-1">Items</p>
                  <p className="fw-bold mb-0">{order.items?.length || 0} items</p>
                </div>
                <div className="col-6 mt-2">
                  <p className="small text-muted mb-1">Status</p>
                  <p className="fw-bold mb-0">
                    <span className="badge bg-info">{order.orderStatus}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              onClick={() => setShowInvoice(true)}
              className="btn rounded-0 text-white"
              style={{ backgroundColor: '#0B6F73' }}
            >
              <i className="bi bi-receipt me-2"></i>View Invoice
            </button>
            <Link to="/account" className="btn rounded-0" style={{ border: '1px solid #0B6F73', color: '#0B6F73' }}>
              <i className="bi bi-bag me-2"></i>View My Orders
            </Link>
            <Link to="/shop" className="btn rounded-0 btn-outline-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Invoice / Bill */}
      {showInvoice && order && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 no-print">
            <button
              className="btn btn-outline-secondary rounded-0"
              onClick={() => setShowInvoice(false)}
            >
              <i className="bi bi-arrow-left me-2"></i>Back
            </button>
            <button
              className="btn text-white rounded-0"
              style={{ backgroundColor: '#0B6F73' }}
              onClick={handlePrint}
            >
              <i className="bi bi-printer me-2"></i>Print Invoice
            </button>
          </div>

          <div ref={invoiceRef} className="bg-white p-4 p-md-5 shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
            {/* Invoice Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
              <div>
                <h3 className="mb-1 fw-bold" style={{ color: '#0B6F73' }}>JEWELLERY STORE</h3>
                <p className="text-muted small mb-0">Premium Jewelry Collection</p>
                <p className="text-muted small mb-0">Email: support@jewellerystore.com</p>
                <p className="text-muted small mb-0">Phone: +91 98765 43210</p>
              </div>
              <div className="text-end">
                <h4 className="fw-bold mb-1" style={{ color: '#0B6F73' }}>INVOICE</h4>
                <p className="small mb-0"><strong>Invoice No:</strong> {generateInvoiceNumber()}</p>
                <p className="small mb-0"><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                <p className="small mb-0">
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${order.paymentMethod === 'Online' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {order.paymentMethod === 'Online' ? 'PAID' : 'COD'}
                  </span>
                </p>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <h6 className="fw-bold" style={{ color: '#0B6F73' }}>Bill To:</h6>
                <p className="mb-0 fw-semibold">{order.shippingAddress?.fullName}</p>
                <p className="mb-0 text-muted small">{order.shippingAddress?.phone}</p>
                <p className="mb-0 text-muted small">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && (
                  <p className="mb-0 text-muted small">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="mb-0 text-muted small">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold" style={{ color: '#0B6F73' }}>Order Details:</h6>
                <p className="mb-0 small"><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
                <p className="mb-0 small"><strong>Payment:</strong> {order.paymentMethod === 'Online' ? 'Online Payment (Paid)' : 'Cash on Delivery'}</p>
                <p className="mb-0 small"><strong>Order Status:</strong> {order.orderStatus}</p>
                <p className="mb-0 small"><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered mb-0">
                <thead style={{ backgroundColor: '#0B6F73', color: 'white' }}>
                  <tr>
                    <th style={{ fontSize: '13px' }}>#</th>
                    <th style={{ fontSize: '13px' }}>Item</th>
                    <th style={{ fontSize: '13px' }} className="text-center">Qty</th>
                    <th style={{ fontSize: '13px' }} className="text-end">Price</th>
                    <th style={{ fontSize: '13px' }} className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: '13px' }}>{index + 1}</td>
                      <td style={{ fontSize: '13px' }}>
                        <div className="d-flex align-items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: 4 }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="text-center" style={{ fontSize: '13px' }}>{item.quantity}</td>
                      <td className="text-end" style={{ fontSize: '13px' }}>{'\u20B9'}{item.price.toLocaleString('en-IN')}</td>
                      <td className="text-end fw-semibold" style={{ fontSize: '13px' }}>{'\u20B9'}{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="row justify-content-end">
              <div className="col-md-5">
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>{'\u20B9'}{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax (Included)</span>
                    <span>{'\u20B9'}0</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2 mt-2">
                    <span>Grand Total</span>
                    <span style={{ color: '#0B6F73' }}>{'\u20B9'}{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-top text-center">
              <p className="text-muted small mb-1">Thank you for shopping with Jewellery Store!</p>
              <p className="text-muted small mb-0">For queries, contact us at support@jewellerystore.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
