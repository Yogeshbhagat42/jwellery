import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/account');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className="col-md-7 col-lg-5">
            {/* Decorative Header */}
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ 
                  width: '70px', 
                  height: '70px', 
                  backgroundColor: '#0B6F73',
                  boxShadow: '0 4px 15px rgba(11, 111, 115, 0.3)'
                }}
              >
                <i className="bi bi-person-plus text-white" style={{ fontSize: '28px' }}></i>
              </div>
              <h2 style={{ color: '#0B6F73', fontWeight: '600' }}>Create Account</h2>
              <p className="text-muted">Join us for exclusive offers & updates</p>
            </div>
            
            <div 
              className="card border-0"
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          className="form-control border-start-0 ps-0"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-telephone text-muted"></i>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control border-start-0 ps-0"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          name="password"
                          className="form-control border-start-0 ps-0"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="6"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control border-start-0 ps-0"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-3 fw-semibold mt-2"
                    style={{ 
                      backgroundColor: '#0B6F73', 
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '16px'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      style={{ color: '#0B6F73', fontWeight: '600', textDecoration: 'none' }}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center flex-wrap gap-3 text-muted small">
                <span><i className="bi bi-shield-check me-1"></i> Secure</span>
                <span><i className="bi bi-award me-1"></i> 100% Authentic</span>
                <span><i className="bi bi-gift me-1"></i> Welcome Offer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}