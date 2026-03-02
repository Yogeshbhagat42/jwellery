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

const Returns = () => {
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Returns & Exchanges</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Returns & Exchanges</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-arrow-return-left me-2"></i>Return Policy
          </h5>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>
            We want you to be completely happy with your purchase. If for any reason you are not satisfied,
            we offer a hassle-free return and exchange policy within <strong>15 days</strong> of delivery.
          </p>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-check-circle me-2"></i>Eligible for Return/Exchange
          </h5>
          <ul style={{ fontSize: '14px', lineHeight: '2' }} className="text-muted">
            <li>Product must be in its original, unused condition with tags attached.</li>
            <li>Must be returned in the original branded packaging.</li>
            <li>Return request must be raised within 15 days of delivery.</li>
            <li>Items received damaged or defective are eligible for immediate replacement.</li>
          </ul>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-x-circle me-2"></i>Not Eligible for Return
          </h5>
          <ul style={{ fontSize: '14px', lineHeight: '2' }} className="text-muted">
            <li>Customized or personalized jewellery pieces.</li>
            <li>Products that have been worn, altered, or resized.</li>
            <li>Earrings and nose pins (for hygiene reasons), unless defective.</li>
            <li>Items purchased during clearance or final sale.</li>
          </ul>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-list-ol me-2"></i>How to Initiate a Return
          </h5>
          <div className="row g-3">
            {[
              { step: '1', icon: 'bi-envelope', title: 'Contact Us', desc: 'Email us at care@marchjewellery.com or call 011-43078430 with your order ID.' },
              { step: '2', icon: 'bi-check2-square', title: 'Get Approval', desc: 'Our team will review and approve your request within 24 hours.' },
              { step: '3', icon: 'bi-box-arrow-in-left', title: 'Ship It Back', desc: 'Pack the item securely. We will arrange a free reverse pickup.' },
              { step: '4', icon: 'bi-wallet2', title: 'Get Refund', desc: 'Refund will be processed within 5-7 business days after receiving the item.' }
            ].map((item) => (
              <div className="col-md-6" key={item.step}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                           style={{ width: 36, height: 36, backgroundColor: '#0B6F73', fontSize: '14px' }}>
                        {item.step}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>{item.title}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-currency-rupee me-2"></i>Refund Details
          </h5>
          <div className="table-responsive">
            <table className="table table-bordered" style={{ fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>Payment Method</th>
                  <th>Refund Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>UPI / Net Banking</td><td>3-5 business days</td></tr>
                <tr><td>Credit / Debit Card</td><td>5-7 business days</td></tr>
                <tr><td>Cash on Delivery (COD)</td><td>Refund via bank transfer within 7-10 days</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-5 p-4 rounded" style={{ backgroundColor: '#f0fafa' }}>
          <p className="mb-2 fw-semibold" style={{ fontSize: '14px' }}>Need help with a return?</p>
          <Link to="/contact" className="btn btn-sm text-white px-4" style={{ backgroundColor: '#0B6F73' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Returns;
