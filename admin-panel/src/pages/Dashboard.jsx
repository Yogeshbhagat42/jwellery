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
        const productsData = await getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      
      try {
        const statsData = await getDashboardStats();
        if (statsData && statsData.success) {
          setStats(prev => ({ ...prev, ...statsData.stats }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      
      setLoading(false);
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

  // Generate last 6 month labels (handles year wrap correctly)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push(monthNames[d.getMonth()]);
  }

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
    <div className="container-fluid px-2 px-md-4 py-3 py-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Welcome Header */}
      <div className="mb-3 mb-md-4">
        <h5 className="fw-bold mb-1" style={{ color: '#1a1a1a', fontSize: 'clamp(16px, 4vw, 22px)' }}>Dashboard Overview</h5>
        <p className="text-muted mb-0 d-none d-sm-block" style={{ fontSize: '13px' }}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-3 mb-md-4 g-2 g-md-3">
        {[
          { label: 'Revenue', value: formatCurrency(stats.totalRevenue), color: '#0B6F73', gradient: 'linear-gradient(135deg, #0B6F73 0%, #0d8a8f 100%)', icon: 'bi-currency-rupee', sub: `${stats.totalOrders > 0 ? 'From ' + stats.totalOrders + ' orders' : 'No orders yet'}` },
          { label: 'Orders', value: stats.totalOrders, color: '#e65100', gradient: 'linear-gradient(135deg, #e65100 0%, #ff8a50 100%)', icon: 'bi-box-seam', sub: `${stats.pendingOrders} pending` },
          { label: 'Products', value: products.length, color: '#2e7d32', gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', icon: 'bi-gem', sub: 'Active in catalog' },
          { label: 'Customers', value: stats.totalCustomers, color: '#1565c0', gradient: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)', icon: 'bi-people', sub: 'Registered users' },
        ].map((card, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
              <div className="card-body p-2 p-md-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div style={{ minWidth: 0 }}>
                    <p className="text-muted mb-0 mb-md-1 text-truncate" style={{ fontSize: '11px', fontWeight: 500 }}>{card.label}</p>
                    <h4 className="fw-bold mb-0 text-truncate" style={{ fontSize: 'clamp(16px, 4vw, 22px)', color: card.color }}>{card.value}</h4>
                  </div>
                  <div className="rounded-circle d-none d-sm-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', background: card.gradient }}>
                    <i className={`bi ${card.icon} text-white`} style={{ fontSize: '18px' }}></i>
                  </div>
                </div>
                <p className="text-muted mb-0 mt-1 d-none d-md-block" style={{ fontSize: '10px' }}>{card.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row mb-3 mb-md-4 g-2 g-md-3">
        {/* Revenue Chart */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
            <div className="card-header bg-white border-0 py-2 py-md-3 px-3 px-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold mb-0" style={{ fontSize: '13px' }}>Revenue Overview</h6>
                  <p className="text-muted mb-0 d-none d-sm-block" style={{ fontSize: '11px' }}>Monthly revenue trend</p>
                </div>
                <span className="badge d-none d-sm-inline" style={{ backgroundColor: '#e8f5f5', color: '#0B6F73', fontSize: '10px', padding: '4px 8px' }}>
                  Last 6 months
                </span>
              </div>
            </div>
            <div className="card-body px-2 px-md-4 pb-3">
              <div style={{ height: 'clamp(180px, 30vw, 280px)' }}>
                <Line data={revenueData} options={revenueOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Doughnut */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
            <div className="card-header bg-white border-0 py-2 py-md-3 px-3 px-md-4">
              <h6 className="fw-semibold mb-0" style={{ fontSize: '13px' }}>Order Status</h6>
            </div>
            <div className="card-body px-2 px-md-4 pb-3 d-flex align-items-center justify-content-center">
              <div style={{ height: 'clamp(160px, 25vw, 240px)', width: '100%' }}>
                <Doughnut data={statusData} options={statusOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="row mb-3 mb-md-4 g-2 g-md-3">
        {/* Orders Chart */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
            <div className="card-header bg-white border-0 py-2 py-md-3 px-3 px-md-4">
              <h6 className="fw-semibold mb-0" style={{ fontSize: '13px' }}>Orders Trend</h6>
            </div>
            <div className="card-body px-2 px-md-4 pb-3">
              <div style={{ height: 'clamp(160px, 25vw, 220px)' }}>
                <Bar data={ordersData} options={ordersOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
            <div className="card-header bg-white border-0 py-2 py-md-3 px-3 px-md-4">
              <h6 className="fw-semibold mb-0" style={{ fontSize: '13px' }}>Products by Category</h6>
            </div>
            <div className="card-body px-2 px-md-4 pb-3">
              <div style={{ height: 'clamp(160px, 25vw, 220px)' }}>
                <Bar data={categoryData} options={categoryOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
        <div className="card-header bg-white border-0 py-2 py-md-3 px-3 px-md-4 d-flex justify-content-between align-items-center">
          <h6 className="fw-semibold mb-0" style={{ fontSize: '13px' }}>Recent Orders</h6>
          <button 
            className="btn btn-sm px-2 px-md-3"
            style={{ backgroundColor: '#0B6F73', color: '#fff', borderRadius: '6px', fontSize: '11px' }}
            onClick={() => navigate('/orders')}
          >
            View All <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
        <div className="card-body p-0">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '12px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ fontWeight: 600, color: '#666', padding: '10px 12px', whiteSpace: 'nowrap' }}>Order ID</th>
                    <th style={{ fontWeight: 600, color: '#666', padding: '10px 8px', whiteSpace: 'nowrap' }}>Customer</th>
                    <th className="d-none d-md-table-cell" style={{ fontWeight: 600, color: '#666', padding: '10px 8px' }}>Items</th>
                    <th style={{ fontWeight: 600, color: '#666', padding: '10px 8px', whiteSpace: 'nowrap' }}>Amount</th>
                    <th style={{ fontWeight: 600, color: '#666', padding: '10px 8px' }}>Status</th>
                    <th className="d-none d-sm-table-cell" style={{ fontWeight: 600, color: '#666', padding: '10px 8px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                        <span className="fw-semibold" style={{ color: '#0B6F73' }}>#{order._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <div className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>{order.userId?.name || 'N/A'}</div>
                      </td>
                      <td className="d-none d-md-table-cell" style={{ padding: '10px 8px' }}>
                        <span className="badge bg-light text-dark">{order.items?.length || 0}</span>
                      </td>
                      <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }} className="fw-semibold">{formatCurrency(order.totalAmount)}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className={`badge bg-${getStatusBadge(order.orderStatus)}`} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="d-none d-sm-table-cell" style={{ padding: '10px 8px', color: '#666', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '24px' }}></i>
              <p className="text-muted mb-0 mt-2" style={{ fontSize: '12px' }}>No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
