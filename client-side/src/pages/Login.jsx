import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
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
        <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div className="col-md-6 col-lg-5">
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
                <i className="bi bi-person text-white" style={{ fontSize: '28px' }}></i>
              </div>
              <h2 style={{ color: '#0B6F73', fontWeight: '600' }}>Welcome Back</h2>
              <p className="text-muted">Sign in to continue to your account</p>
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
                  <div className="mb-4">
                    <label className="form-label fw-medium">Email Address</label>
                    <div className="input-group">
                      <span 
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: '#dee2e6' }}
                      >
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ borderColor: '#dee2e6' }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-medium mb-0">Password</label>
                      <Link 
                        to="/forgot-password" 
                        style={{ color: '#0B6F73', fontSize: '13px', textDecoration: 'none' }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span 
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: '#dee2e6' }}
                      >
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ borderColor: '#dee2e6' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-3 fw-semibold"
                    style={{ 
                      backgroundColor: '#0B6F73', 
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      style={{ color: '#0B6F73', fontWeight: '600', textDecoration: 'none' }}
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center gap-4 text-muted small">
                <span><i className="bi bi-shield-check me-1"></i> Secure Login</span>
                <span><i className="bi bi-lock me-1"></i> 256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}