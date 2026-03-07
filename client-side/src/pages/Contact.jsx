import { Link } from 'react-router-dom';
import { useState } from 'react';

const headerStyle = {
  backgroundColor: '#0B6F73',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center'
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff', minHeight: '70vh' }}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Contact Us</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Contact Us</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '900px' }}>
        <div className="row g-4">
          {/* Contact Info */}
          <div className="col-md-5">
            <h5 className="fw-bold mb-4">Get In Touch</h5>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>
              We would love to hear from you. Whether you have a question about our products, orders, or anything else, our team is ready to help.
            </p>

            <div className="mt-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style={{ width: 40, height: 40, backgroundColor: '#f0fafa' }}>
                  <i className="bi bi-geo-alt" style={{ color: '#0B6F73', fontSize: '18px' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>Visit Us</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>123, Jewellery Lane, Karol Bagh,<br />New Delhi - 110005, India</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style={{ width: 40, height: 40, backgroundColor: '#f0fafa' }}>
                  <i className="bi bi-telephone" style={{ color: '#0B6F73', fontSize: '18px' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>Call Us</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>011-43078430<br />Mon-Sat | 9:30 AM - 6:30 PM</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style={{ width: 40, height: 40, backgroundColor: '#f0fafa' }}>
                  <i className="bi bi-envelope" style={{ color: '#0B6F73', fontSize: '18px' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>Email Us</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>care@marchjewellery.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Send us a Message</h5>
                {submitted && (
                  <div className="alert alert-success py-2" style={{ fontSize: '13px' }}>
                    <i className="bi bi-check-circle me-2"></i>Thank you! We will get back to you within 24 hours.
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>Your Name</label>
                      <input type="text" className="form-control" style={{ fontSize: '13px' }}
                             name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>Email Address</label>
                      <input type="email" className="form-control" style={{ fontSize: '13px' }}
                             name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>Subject</label>
                      <select className="form-select" style={{ fontSize: '13px' }}
                              name="subject" value={form.subject} onChange={handleChange} required>
                        <option value="">Select a topic</option>
                        <option value="order">Order Related</option>
                        <option value="product">Product Inquiry</option>
                        <option value="return">Returns & Exchange</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>Message</label>
                      <textarea className="form-control" rows="4" style={{ fontSize: '13px' }}
                                name="message" value={form.message} onChange={handleChange} required></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#0B6F73', fontSize: '14px' }}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
