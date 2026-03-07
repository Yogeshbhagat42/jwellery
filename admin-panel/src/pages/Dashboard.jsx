import { useEffect, useState } from "react";
import { getProducts, getDashboardStats } from "../services/productApi";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    recentOrders: [],
    ordersByStatus: {},
    monthlyRevenue: [],
    monthlyOrders: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Generate sample data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);

  // Revenue Chart Data
  const revenueData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Revenue',
        data: stats.monthlyRevenue?.length > 0 
          ? stats.monthlyRevenue 
          : [0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(11, 111, 115, 0.1)',
        borderColor: '#0B6F73',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#0B6F73',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      }
    ]
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        callbacks: {
          label: (context) => `Revenue: ₹${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: (value) => `₹${(value/1000).toFixed(0)}k`,
          font: { size: 11 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  // Orders Chart Data
  const ordersData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Orders',
        data: stats.monthlyOrders?.length > 0 
          ? stats.monthlyOrders 
          : [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(11, 111, 115, 0.8)',
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const ordersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        padding: 12,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  // Order Status Doughnut
  const statusData = {
    labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.ordersByStatus?.Pending || 0,
          stats.ordersByStatus?.Confirmed || 0,
          stats.ordersByStatus?.Shipped || 0,
          stats.ordersByStatus?.Delivered || 0,
          stats.ordersByStatus?.Cancelled || 0
        ],
        backgroundColor: [
          '#ffc107',
          '#17a2b8',
          '#007bff',
          '#28a745',
          '#dc3545'
        ],
        borderWidth: 0,
        cutout: '65%',
      }
    ]
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        padding: 12,
      }
    }
  };

  // Category Distribution
  const categoryLabels = stats.categoryStats?.length > 0 
    ? stats.categoryStats.map(c => c.category) 
    : ['No Data'];
  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Products',
        data: stats.categoryStats?.length > 0 
          ? stats.categoryStats.map(c => c.count)
          : [0],
        backgroundColor: [
          'rgba(11, 111, 115, 0.9)',
          'rgba(11, 111, 115, 0.75)',
          'rgba(11, 111, 115, 0.6)',
          'rgba(11, 111, 115, 0.45)',
          'rgba(11, 111, 115, 0.3)',
          'rgba(11, 111, 115, 0.2)',
        ],
        borderRadius: 6,
      }
    ]
  };

  const categoryOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        padding: 12,
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
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
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>Dashboard Overview</h4>
        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4 g-3">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>Total Revenue</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: "24px", color: '#0B6F73' }}>{formatCurrency(stats.totalRevenue)}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", background: 'linear-gradient(135deg, #0B6F73 0%, #0d8a8f 100%)' }}>
                  <i className="bi bi-currency-rupee text-white" style={{ fontSize: "22px" }}></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small fw-semibold"><i className="bi bi-arrow-up"></i> 12.5%</span>
                <span className="text-muted small ms-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>Total Orders</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: "24px", color: '#e65100' }}>{stats.totalOrders}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", background: 'linear-gradient(135deg, #e65100 0%, #ff8a50 100%)' }}>
                  <i className="bi bi-box-seam text-white" style={{ fontSize: "22px" }}></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-warning text-dark" style={{ fontSize: '10px' }}>{stats.pendingOrders} pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>Total Products</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: "24px", color: '#2e7d32' }}>{products.length}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)' }}>
                  <i className="bi bi-gem text-white" style={{ fontSize: "22px" }}></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-muted small">Active in catalog</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>Total Customers</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: "24px", color: '#1565c0' }}>{stats.totalCustomers}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)' }}>
                  <i className="bi bi-people text-white" style={{ fontSize: "22px" }}></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small fw-semibold"><i className="bi bi-arrow-up"></i> 8.2%</span>
                <span className="text-muted small ms-1">growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4 g-3">
        {/* Revenue Chart */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold mb-0">Revenue Overview</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Monthly revenue trend</p>
                </div>
                <div className="badge" style={{ backgroundColor: '#e8f5f5', color: '#0B6F73', fontSize: '11px', padding: '6px 12px' }}>
                  <i className="bi bi-graph-up me-1"></i> Last 6 months
                </div>
              </div>
            </div>
            <div className="card-body px-4 pb-4">
              <div style={{ height: '280px' }}>
                <Line data={revenueData} options={revenueOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Doughnut */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <h6 className="fw-semibold mb-0">Order Status</h6>
              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Distribution by status</p>
            </div>
            <div className="card-body px-4 pb-4 d-flex align-items-center justify-content-center">
              <div style={{ height: '240px', width: '100%' }}>
                <Doughnut data={statusData} options={statusOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="row mb-4 g-3">
        {/* Orders Chart */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <h6 className="fw-semibold mb-0">Orders Trend</h6>
              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Monthly order count</p>
            </div>
            <div className="card-body px-4 pb-4">
              <div style={{ height: '220px' }}>
                <Bar data={ordersData} options={ordersOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <h6 className="fw-semibold mb-0">Products by Category</h6>
              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Category distribution</p>
            </div>
            <div className="card-body px-4 pb-4">
              <div style={{ height: '220px' }}>
                <Bar data={categoryData} options={categoryOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
          <div>
            <h6 className="fw-semibold mb-0">Recent Orders</h6>
            <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Latest customer orders</p>
          </div>
          <button 
            className="btn btn-sm px-3"
            style={{ backgroundColor: '#0B6F73', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
            onClick={() => navigate('/orders')}
          >
            View All <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
        <div className="card-body p-0">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#666', padding: '14px 20px' }}>Order ID</th>
                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Customer</th>
                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Items</th>
                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Amount</th>
                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Status</th>
                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontSize: '13px', padding: '14px 20px' }}>
                        <span className="fw-semibold" style={{ color: '#0B6F73' }}>#{order._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        <div className="fw-semibold">{order.userId?.name || 'N/A'}</div>
                        <small className="text-muted">{order.userId?.email || ''}</small>
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        <span className="badge bg-light text-dark">{order.items?.length || 0} items</span>
                      </td>
                      <td style={{ fontSize: '13px' }} className="fw-semibold">{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(order.orderStatus)}`} style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '20px' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#666' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', backgroundColor: '#f8f9fa' }}>
                <i className="bi bi-inbox text-muted" style={{ fontSize: '28px' }}></i>
              </div>
              <h6 className="fw-semibold mb-1">No orders yet</h6>
              <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Orders will appear here once customers start shopping</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
