import { useState, useEffect } from "react";
import { getCustomers } from "../services/productApi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        if (data.success) {
          setCustomers(data.customers);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  return (
    <div className="container-fluid px-3 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-0">Customers</h5>
          <small className="text-muted">{customers.length} registered customers</small>
        </div>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-2 px-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#0B6F73' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted" style={{ fontSize: '40px' }}></i>
              <p className="text-muted mt-2">
                {search ? 'No customers match your search' : 'No customers yet'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ fontSize: '13px' }}>#</th>
                    <th style={{ fontSize: '13px' }}>Customer</th>
                    <th style={{ fontSize: '13px' }}>Phone</th>
                    <th style={{ fontSize: '13px' }}>Orders</th>
                    <th style={{ fontSize: '13px' }}>Total Spent</th>
                    <th style={{ fontSize: '13px' }}>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer, index) => (
                    <tr key={customer._id}>
                      <td style={{ fontSize: '13px' }} className="text-muted">{index + 1}</td>
                      <td style={{ fontSize: '13px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: 35,
                              height: 35,
                              backgroundColor: '#0B6F73',
                              fontSize: '14px'
                            }}
                          >
                            {(customer.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold">{customer.name || 'N/A'}</div>
                            <small className="text-muted">{customer.email}</small>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px' }}>{customer.phone || '-'}</td>
                      <td style={{ fontSize: '13px' }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: customer.totalOrders > 0 ? '#e8f5f5' : '#f5f5f5',
                            color: customer.totalOrders > 0 ? '#0B6F73' : '#999'
                          }}
                        >
                          {customer.totalOrders || 0} orders
                        </span>
                      </td>
                      <td style={{ fontSize: '13px' }} className="fw-semibold">
                        {customer.totalSpent > 0 ? formatCurrency(customer.totalSpent) : '-'}
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
