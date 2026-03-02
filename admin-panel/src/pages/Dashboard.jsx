import { useEffect, useState } from "react";
import { getProducts, getDashboardStats } from "../services/productApi";
import ProductCards from "../components/ProductCards";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, statsData] = await Promise.all([
          getProducts(),
          getDashboardStats()
        ]);
        setProducts(productsData);
        if (statsData.success) {
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'warning',
      Confirmed: 'info',
      Shipped: 'primary',
      Delivered: 'success',
      Cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" style={{ color: '#0B6F73' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-3">
      {/* Stats Cards */}
      <div className="row mb-3 g-3">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-semibold text-muted mb-1" style={{ fontSize: "12px" }}>TOTAL PRODUCTS</h6>
                  <h4 className="fw-bold mb-0" style={{ fontSize: "22px" }}>{products.length}</h4>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", backgroundColor: '#e8f5f5' }}>
                  <i className="bi bi-gem" style={{ fontSize: "18px", color: '#0B6F73' }}></i>
                </div>
              </div>
              <small className="text-muted" style={{ fontSize: "11px" }}>Items in catalog</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-semibold text-muted mb-1" style={{ fontSize: "12px" }}>TOTAL ORDERS</h6>
                  <h4 className="fw-bold mb-0" style={{ fontSize: "22px" }}>{stats.totalOrders}</h4>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", backgroundColor: '#fff3e0' }}>
                  <i className="bi bi-box-seam" style={{ fontSize: "18px", color: '#e65100' }}></i>
                </div>
              </div>
              <small className="text-muted" style={{ fontSize: "11px" }}>
                {stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : 'All processed'}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-semibold text-muted mb-1" style={{ fontSize: "12px" }}>TOTAL REVENUE</h6>
                  <h4 className="fw-bold mb-0" style={{ fontSize: "22px" }}>{formatCurrency(stats.totalRevenue)}</h4>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", backgroundColor: '#e8f5e9' }}>
                  <i className="bi bi-currency-rupee" style={{ fontSize: "18px", color: '#2e7d32' }}></i>
                </div>
              </div>
              <small className="text-muted" style={{ fontSize: "11px" }}>Excluding cancelled</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-semibold text-muted mb-1" style={{ fontSize: "12px" }}>TOTAL CUSTOMERS</h6>
                  <h4 className="fw-bold mb-0" style={{ fontSize: "22px" }}>{stats.totalCustomers}</h4>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", backgroundColor: '#e3f2fd' }}>
                  <i className="bi bi-people" style={{ fontSize: "18px", color: '#1565c0' }}></i>
                </div>
              </div>
              <small className="text-muted" style={{ fontSize: "11px" }}>Registered users</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <h6 className="fw-semibold mb-0">Recent Orders</h6>
        </div>
        <div className="card-body p-0">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ fontSize: '13px' }}>Order ID</th>
                    <th style={{ fontSize: '13px' }}>Customer</th>
                    <th style={{ fontSize: '13px' }}>Items</th>
                    <th style={{ fontSize: '13px' }}>Amount</th>
                    <th style={{ fontSize: '13px' }}>Status</th>
                    <th style={{ fontSize: '13px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontSize: '13px' }}>
                        <span className="text-muted">#{order._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {order.userId?.name || 'N/A'}
                        <br />
                        <small className="text-muted">{order.userId?.email || ''}</small>
                      </td>
                      <td style={{ fontSize: '13px' }}>{order.items?.length || 0} items</td>
                      <td style={{ fontSize: '13px' }} className="fw-semibold">{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(order.orderStatus)}`} style={{ fontSize: '11px' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '32px' }}></i>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '13px' }}>No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded border">
          <div>
            <h5 className="fw-semibold mb-0" style={{ fontSize: "15px" }}>
              Recent Products
            </h5>
            <small className="text-muted" style={{ fontSize: "12px" }}>Latest additions to your collection</small>
          </div>
          <span className="badge text-white px-2 py-1" style={{ fontSize: "11px", backgroundColor: '#0B6F73' }}>
            {products.length} Items
          </span>
        </div>
        <ProductCards products={products.slice(0, 8)} />
      </div>
    </div>
  );
};

export default Dashboard;
