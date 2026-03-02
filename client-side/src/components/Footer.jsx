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
      {/* Main Footer */}
      <div style={{ backgroundColor: '#1a1a1a', color: '#ccc', paddingTop: '50px', paddingBottom: '30px' }}>
        <div className="container">
          <div className="row">
            {/* Brand Section */}
            <div className="col-12 col-md-3 mb-4">
              <Link to="/" className="text-decoration-none">
                <h4 className="fw-bold mb-3" style={{ color: '#fff', letterSpacing: '2px' }}>RIVAAH</h4>
              </Link>
              <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#999' }}>
                Crafting timeless jewellery that celebrates every moment.
                Each piece is designed with love and precision to add sparkle to your life.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-decoration-none" style={{ color: '#999', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#0B6F73'}
                   onMouseLeave={e => e.target.style.color = '#999'}>
                  <i className="bi bi-facebook" style={{ fontSize: '18px' }}></i>
                </a>
                <a href="#" className="text-decoration-none" style={{ color: '#999' }}
                   onMouseEnter={e => e.target.style.color = '#0B6F73'}
                   onMouseLeave={e => e.target.style.color = '#999'}>
                  <i className="bi bi-instagram" style={{ fontSize: '18px' }}></i>
                </a>
                <a href="#" className="text-decoration-none" style={{ color: '#999' }}
                   onMouseEnter={e => e.target.style.color = '#0B6F73'}
                   onMouseLeave={e => e.target.style.color = '#999'}>
                  <i className="bi bi-twitter-x" style={{ fontSize: '18px' }}></i>
                </a>
                <a href="#" className="text-decoration-none" style={{ color: '#999' }}
                   onMouseEnter={e => e.target.style.color = '#0B6F73'}
                   onMouseLeave={e => e.target.style.color = '#999'}>
                  <i className="bi bi-pinterest" style={{ fontSize: '18px' }}></i>
                </a>
                <a href="#" className="text-decoration-none" style={{ color: '#999' }}
                   onMouseEnter={e => e.target.style.color = '#0B6F73'}
                   onMouseLeave={e => e.target.style.color = '#999'}>
                  <i className="bi bi-youtube" style={{ fontSize: '18px' }}></i>
                </a>
              </div>
            </div>

            {/* Shop Categories */}
            <div className="col-6 col-md-2 mb-4">
              <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '13px', letterSpacing: '1px' }}>SHOP</h6>
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
                          style={{ color: '#999', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color = '#0B6F73'}
                          onMouseLeave={e => e.target.style.color = '#999'}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="col-6 col-md-2 mb-4">
              <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '13px', letterSpacing: '1px' }}>HELP</h6>
              <ul className="list-unstyled" style={{ fontSize: '13px' }}>
                <li className="mb-2">
                  <Link to="/shipping" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    Shipping & Delivery
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/returns" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    Returns & Exchanges
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/faq" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    FAQ
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    Contact Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/track-order" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    Track Order
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/jewelry-care" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    Jewellery Care
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy" className="text-decoration-none" style={{ color: '#999' }}
                        onMouseEnter={e => e.target.style.color = '#0B6F73'}
                        onMouseLeave={e => e.target.style.color = '#999'}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="col-12 col-md-5 mb-4">
              <div className="row">
                {/* Contact Info */}
                <div className="col-12 col-sm-6 mb-4 mb-sm-0">
                  <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '13px', letterSpacing: '1px' }}>REACH US</h6>
                  <div style={{ fontSize: '13px' }}>
                    <p className="mb-2" style={{ color: '#999' }}>
                      <i className="bi bi-telephone me-2" style={{ color: '#0B6F73' }}></i>
                      011 43078430
                    </p>
                    <p className="mb-2" style={{ color: '#999' }}>
                      <i className="bi bi-clock me-2" style={{ color: '#0B6F73' }}></i>
                      Mon-Sat | 9:30am - 6:30pm
                    </p>
                    <p className="mb-2">
                      <i className="bi bi-envelope me-2" style={{ color: '#0B6F73' }}></i>
                      <a href="mailto:care@marchjewellery.com" className="text-decoration-none" style={{ color: '#999' }}
                         onMouseEnter={e => e.target.style.color = '#0B6F73'}
                         onMouseLeave={e => e.target.style.color = '#999'}>
                        care@marchjewellery.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="col-12 col-sm-6">
                  <h6 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '13px', letterSpacing: '1px' }}>NEWSLETTER</h6>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    Subscribe for exclusive deals and new arrivals.
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <div className="input-group">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="form-control rounded-0 border-0"
                        style={{ fontSize: '12px', backgroundColor: '#2a2a2a', color: '#fff' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="btn rounded-0 text-white px-3"
                        style={{ backgroundColor: '#0B6F73', fontSize: '11px', letterSpacing: '1px' }}
                      >
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                    {subscribed && (
                      <p className="mt-2 mb-0" style={{ fontSize: '11px', color: '#0B6F73' }}>
                        Thank you for subscribing!
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ backgroundColor: '#111', padding: '20px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Trust Badges */}
            <div className="col-12 col-md-4 mb-3 mb-md-0">
              <div className="d-flex gap-4 justify-content-center justify-content-md-start">
                <div className="text-center">
                  <i className="bi bi-shield-check" style={{ color: '#0B6F73', fontSize: '20px' }}></i>
                  <p className="mb-0" style={{ fontSize: '10px', color: '#999' }}>Secure Payment</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-truck" style={{ color: '#0B6F73', fontSize: '20px' }}></i>
                  <p className="mb-0" style={{ fontSize: '10px', color: '#999' }}>Free Shipping</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-arrow-return-left" style={{ color: '#0B6F73', fontSize: '20px' }}></i>
                  <p className="mb-0" style={{ fontSize: '10px', color: '#999' }}>Easy Returns</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-gem" style={{ color: '#0B6F73', fontSize: '20px' }}></i>
                  <p className="mb-0" style={{ fontSize: '10px', color: '#999' }}>Certified</p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="col-12 col-md-4 mb-3 mb-md-0 text-center">
              <p className="mb-0" style={{ fontSize: '11px', color: '#666' }}>
                &copy; {new Date().getFullYear()} RIVAAH Jewellery. All Rights Reserved.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="col-12 col-md-4">
              <div className="d-flex gap-2 justify-content-center justify-content-md-end align-items-center">
                <span style={{ fontSize: '10px', color: '#666', marginRight: '8px' }}>We Accept:</span>
                {['VISA', 'MC', 'UPI', 'RuPay'].map((method) => (
                  <span
                    key={method}
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#999',
                      border: '1px solid #333',
                      borderRadius: '3px',
                      padding: '3px 8px',
                      letterSpacing: '0.5px'
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
