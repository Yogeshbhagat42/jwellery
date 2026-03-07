import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Newsletter Banner */}
      <div style={{ backgroundColor: '#0B6F73', padding: '50px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <h5 className="fw-bold text-white mb-1" style={{ fontSize: '20px', letterSpacing: '1px' }}>
                Stay in the Loop
              </h5>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                Subscribe for exclusive deals and new arrivals
              </p>
            </div>
            <div className="col-md-6">
              <form onSubmit={handleSubscribe}>
                <div className="d-flex gap-2 justify-content-center justify-content-md-end">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="form-control rounded-0 border-0"
                    style={{
                      fontSize: '14px',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      padding: '12px 16px',
                      maxWidth: '320px',
                      backdropFilter: 'blur(10px)'
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn rounded-0 text-white px-4 fw-semibold"
                    style={{
                      backgroundColor: '#fff',
                      color: '#0B6F73',
                      fontSize: '13px',
                      letterSpacing: '1px'
                    }}
                  >
                    SUBSCRIBE
                  </button>
                </div>
                {subscribed && (
                  <p className="mt-2 mb-0 text-end" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ backgroundColor: '#fafafa', color: '#555', padding: '60px 0 40px', borderTop: '1px solid #eee' }}>
        <div className="container">
          <div className="row">
            {/* Brand Section */}
            <div className="col-12 col-md-3 mb-4">
              <Link to="/" className="text-decoration-none">
                <h4 className="fw-bold mb-2" style={{ color: '#0B6F73', letterSpacing: '3px', fontFamily: 'Georgia, serif' }}>RIVAAH</h4>
              </Link>
              <p className="mb-1" style={{ fontSize: '10px', color: '#999', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Fine Silver Jewellery
              </p>
              <p className="mt-3" style={{ fontSize: '13px', lineHeight: '1.8', color: '#777' }}>
                Crafting timeless jewellery that celebrates every moment.
                Each piece is designed with love and precision.
              </p>
              <div className="d-flex gap-3 mt-3">
                {[
                  { icon: 'bi-facebook', label: 'Facebook' },
                  { icon: 'bi-instagram', label: 'Instagram' },
                  { icon: 'bi-twitter-x', label: 'Twitter' },
                  { icon: 'bi-pinterest', label: 'Pinterest' },
                  { icon: 'bi-youtube', label: 'YouTube' }
                ].map((social) => (
                  <a key={social.icon} href="#" className="text-decoration-none d-flex align-items-center justify-content-center"
                     style={{
                       width: '36px', height: '36px', borderRadius: '50%',
                       border: '1px solid #ddd', color: '#777',
                       transition: 'all 0.3s ease'
                     }}
                     onMouseEnter={e => {
                       e.currentTarget.style.backgroundColor = '#0B6F73';
                       e.currentTarget.style.borderColor = '#0B6F73';
                       e.currentTarget.style.color = '#fff';
                     }}
                     onMouseLeave={e => {
                       e.currentTarget.style.backgroundColor = 'transparent';
                       e.currentTarget.style.borderColor = '#ddd';
                       e.currentTarget.style.color = '#777';
                     }}
                     aria-label={social.label}
                  >
                    <i className={`bi ${social.icon}`} style={{ fontSize: '14px' }}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div className="col-6 col-md-2 mb-4">
              <h6 className="fw-bold mb-3" style={{ color: '#333', fontSize: '13px', letterSpacing: '1px' }}>SHOP</h6>
              <ul className="list-unstyled" style={{ fontSize: '13px' }}>
                {[
                  { label: 'Rings', cat: 'Rings' },
                  { label: 'Earrings', cat: 'Earrings' },
                  { label: 'Necklaces', cat: 'Necklace' },
                  { label: 'Bracelets', cat: 'Bracelets' },
                  { label: 'Anklets', cat: 'Anklets' },
                  { label: 'Nose Pins', cat: 'Nose Pins' },
                  { label: 'Mangalsutra', cat: 'Mangalsutra' },
                  { label: 'Couple Rings', cat: 'Couple Rings' },
                ].map((item) => (
                  <li key={item.cat} className="mb-2">
                    <Link to={`/shop?category=${item.cat}`} className="text-decoration-none"
                          style={{ color: '#777', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.target.style.color = '#0B6F73'; e.target.style.paddingLeft = '4px'; }}
                          onMouseLeave={e => { e.target.style.color = '#777'; e.target.style.paddingLeft = '0'; }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Links */}
            <div className="col-6 col-md-2 mb-4">
              <h6 className="fw-bold mb-3" style={{ color: '#333', fontSize: '13px', letterSpacing: '1px' }}>HELP</h6>
              <ul className="list-unstyled" style={{ fontSize: '13px' }}>
                {[
                  { label: 'Shipping & Delivery', to: '/shipping' },
                  { label: 'Returns & Exchanges', to: '/returns' },
                  { label: 'FAQ', to: '/faq' },
                  { label: 'Contact Us', to: '/contact' },
                  { label: 'Track Order', to: '/track-order' },
                  { label: 'Jewellery Care', to: '/jewelry-care' },
                  { label: 'Privacy Policy', to: '/privacy' },
                ].map((item) => (
                  <li key={item.to} className="mb-2">
                    <Link to={item.to} className="text-decoration-none"
                          style={{ color: '#777', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.target.style.color = '#0B6F73'; e.target.style.paddingLeft = '4px'; }}
                          onMouseLeave={e => { e.target.style.color = '#777'; e.target.style.paddingLeft = '0'; }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-12 col-md-5 mb-4">
              <div className="row">
                <div className="col-12 col-sm-6 mb-4 mb-sm-0">
                  <h6 className="fw-bold mb-3" style={{ color: '#333', fontSize: '13px', letterSpacing: '1px' }}>REACH US</h6>
                  <div style={{ fontSize: '13px' }}>
                    <p className="mb-2 d-flex align-items-center" style={{ color: '#777' }}>
                      <i className="bi bi-telephone me-2" style={{ color: '#0B6F73' }}></i>
                      011 43078430
                    </p>
                    <p className="mb-2 d-flex align-items-center" style={{ color: '#777' }}>
                      <i className="bi bi-clock me-2" style={{ color: '#0B6F73' }}></i>
                      Mon-Sat | 9:30am - 6:30pm
                    </p>
                    <p className="mb-2 d-flex align-items-center">
                      <i className="bi bi-envelope me-2" style={{ color: '#0B6F73' }}></i>
                      <a href="mailto:care@marchjewellery.com" className="text-decoration-none" style={{ color: '#777' }}
                         onMouseEnter={e => e.target.style.color = '#0B6F73'}
                         onMouseLeave={e => e.target.style.color = '#777'}>
                        care@marchjewellery.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <h6 className="fw-bold mb-3" style={{ color: '#333', fontSize: '13px', letterSpacing: '1px' }}>WE PROMISE</h6>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { icon: 'bi-shield-check', text: 'Secure Payment' },
                      { icon: 'bi-truck', text: 'Free Shipping' },
                      { icon: 'bi-arrow-return-left', text: 'Easy Returns' },
                      { icon: 'bi-gem', text: 'Certified Purity' }
                    ].map((item) => (
                      <div key={item.icon} className="d-flex align-items-center gap-2">
                        <i className={`bi ${item.icon}`} style={{ color: '#0B6F73', fontSize: '16px' }}></i>
                        <span style={{ fontSize: '13px', color: '#777' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '18px 0', borderTop: '1px solid #e5e5e5' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 mb-2 mb-md-0 text-center text-md-start">
              <p className="mb-0" style={{ fontSize: '12px', color: '#999' }}>
                &copy; {new Date().getFullYear()} RIVAAH Jewellery. All Rights Reserved.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex gap-2 justify-content-center justify-content-md-end align-items-center">
                <span style={{ fontSize: '11px', color: '#999', marginRight: '8px' }}>We Accept:</span>
                {['VISA', 'MC', 'UPI', 'RuPay'].map((method) => (
                  <span
                    key={method}
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#777',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      padding: '3px 10px',
                      letterSpacing: '0.5px',
                      backgroundColor: '#fff'
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
