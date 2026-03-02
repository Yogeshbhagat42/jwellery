import { useState, useEffect } from "react";
import { getAdminOrders, updateOrderStatus } from "../services/productApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statuses = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders(statusFilter, page, 15);
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'warning',
      Confirmed: 'info',
      Shipped: 'primary',
      'Out for Delivery': 'primary',
      Delivered: 'success',
      Cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  return (
    <div className="container-fluid px-3 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-0">Orders</h5>
          <small className="text-muted">{total} total orders</small>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-2 px-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-muted small">Filter:</span>
            <button
              className={`btn btn-sm ${!statusFilter ? 'text-white' : 'btn-outline-secondary'}`}
              style={!statusFilter ? { backgroundColor: '#0B6F73' } : {}}
              onClick={() => { setStatusFilter(''); setPage(1); }}
            >
              All
            </button>
            {statuses.map(s => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? 'text-white' : 'btn-outline-secondary'}`}
                style={statusFilter === s ? { backgroundColor: '#0B6F73' } : {}}
                onClick={() => { setStatusFilter(s); setPage(1); }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#0B6F73' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '40px' }}></i>
              <p className="text-muted mt-2">No orders found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ fontSize: '13px' }}>Order ID</th>
                    <th style={{ fontSize: '13px' }}>Customer</th>
                    <th style={{ fontSize: '13px' }}>Items</th>
                    <th style={{ fontSize: '13px' }}>Amount</th>
                    <th style={{ fontSize: '13px' }}>Payment</th>
                    <th style={{ fontSize: '13px' }}>Status</th>
                    <th style={{ fontSize: '13px' }}>Date</th>
                    <th style={{ fontSize: '13px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <>
                      <tr key={order._id}>
                        <td style={{ fontSize: '13px' }}>
                          <span className="text-muted fw-semibold">#{order._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td style={{ fontSize: '13px' }}>
                          <div className="fw-semibold">{order.userId?.name || 'N/A'}</div>
                          <small className="text-muted">{order.userId?.email || ''}</small>
                          {order.userId?.phone && (
                            <><br /><small className="text-muted">{order.userId.phone}</small></>
                          )}
                        </td>
                        <td style={{ fontSize: '13px' }}>{order.items?.length || 0} items</td>
                        <td style={{ fontSize: '13px' }} className="fw-bold">{formatCurrency(order.totalAmount)}</td>
                        <td style={{ fontSize: '13px' }}>
                          <span className="badge bg-secondary">{order.paymentMethod || 'COD'}</span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            style={{ fontSize: '12px', width: '130px' }}
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {updatingId === order._id && (
                            <div className="spinner-border spinner-border-sm ms-1" style={{ color: '#0B6F73' }} role="status" />
                          )}
                        </td>
                        <td style={{ fontSize: '13px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            style={{ fontSize: '12px' }}
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          >
                            <i className={`bi bi-chevron-${expandedOrder === order._id ? 'up' : 'down'}`}></i>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {expandedOrder === order._id && (
                        <tr key={`${order._id}-details`}>
                          <td colSpan={8} className="bg-light p-3">
                            <div className="row">
                              {/* Items */}
                              <div className="col-md-7">
                                <h6 className="fw-semibold mb-2" style={{ fontSize: '13px' }}>Order Items</h6>
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="d-flex align-items-center gap-2 mb-2 p-2 bg-white rounded">
                                    <img
                                      src={item.image || '/placeholder.jpg'}
                                      alt={item.name}
                                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                    <div className="flex-grow-1">
                                      <div className="small fw-semibold">{item.name}</div>
                                      <div className="text-muted" style={{ fontSize: '11px' }}>
                                        Qty: {item.quantity} x {formatCurrency(item.price)}
                                      </div>
                                    </div>
                                    <span className="fw-bold small">{formatCurrency(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Shipping Address */}
                              <div className="col-md-5">
                                <h6 className="fw-semibold mb-2" style={{ fontSize: '13px' }}>Shipping Address</h6>
                                <div className="bg-white p-2 rounded small">
                                  <p className="mb-1 fw-semibold">{order.shippingAddress?.fullName}</p>
                                  <p className="mb-1 text-muted">{order.shippingAddress?.phone}</p>
                                  <p className="mb-1 text-muted">{order.shippingAddress?.addressLine1}</p>
                                  {order.shippingAddress?.addressLine2 && (
                                    <p className="mb-1 text-muted">{order.shippingAddress.addressLine2}</p>
                                  )}
                                  <p className="mb-0 text-muted">
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-3 d-flex justify-content-center">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                <button
                  className="page-link"
                  style={page === p ? { backgroundColor: '#0B6F73', borderColor: '#0B6F73' } : {}}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              </li>
            ))}
            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Orders;
