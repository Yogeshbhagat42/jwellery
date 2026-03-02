import { Link } from 'react-router-dom';

const pageStyle = {
  fontFamily: 'Poppins, sans-serif',
  backgroundColor: '#fff',
  minHeight: '70vh'
};

const headerStyle = {
  backgroundColor: '#0B6F73',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center'
};

const Shipping = () => {
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Shipping & Delivery</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Shipping & Delivery</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-truck me-2"></i>Delivery Timelines
          </h5>
          <div className="table-responsive">
            <table className="table table-bordered" style={{ fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>Location</th>
                  <th>Standard Delivery</th>
                  <th>Express Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Metro Cities (Delhi, Mumbai, Bangalore, etc.)</td><td>3-5 business days</td><td>1-2 business days</td></tr>
                <tr><td>Tier 2 Cities</td><td>5-7 business days</td><td>2-3 business days</td></tr>
                <tr><td>Other Locations</td><td>7-10 business days</td><td>3-5 business days</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-box-seam me-2"></i>Shipping Charges
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <i className="bi bi-gift" style={{ fontSize: '32px', color: '#0B6F73' }}></i>
                  <h6 className="fw-bold mt-2">Free Shipping</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>On all orders above ₹999</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <i className="bi bi-cash-stack" style={{ fontSize: '32px', color: '#0B6F73' }}></i>
                  <h6 className="fw-bold mt-2">Standard Rate</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>₹49 flat rate for orders below ₹999</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-shield-check me-2"></i>Packaging & Safety
          </h5>
          <ul style={{ fontSize: '14px', lineHeight: '2' }} className="text-muted">
            <li>Every piece is carefully packed in a premium branded jewellery box.</li>
            <li>Tamper-proof packaging ensures your order reaches you safely.</li>
            <li>All shipments are fully insured against damage or loss during transit.</li>
            <li>A certificate of authenticity is included with every piece.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-info-circle me-2"></i>Important Notes
          </h5>
          <ul style={{ fontSize: '14px', lineHeight: '2' }} className="text-muted">
            <li>Orders placed before 2:00 PM are dispatched the same business day.</li>
            <li>Delivery timelines may vary during festive seasons or sale events.</li>
            <li>You will receive an SMS/email with tracking details once your order is shipped.</li>
            <li>Cash on Delivery (COD) is available across India.</li>
          </ul>
        </div>

        <div className="text-center mt-5 p-4 rounded" style={{ backgroundColor: '#f0fafa' }}>
          <p className="mb-2 fw-semibold" style={{ fontSize: '14px' }}>Have questions about your delivery?</p>
          <Link to="/contact" className="btn btn-sm text-white px-4" style={{ backgroundColor: '#0B6F73' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
