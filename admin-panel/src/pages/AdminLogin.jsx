// pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      // ✅ Call the onLogin function passed from App.jsx
      const result = await onLogin(email, password);
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body p-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-dark mb-3" 
              style={{ width: "60px", height: "60px" }}>
              <span className="text-white fw-bold fs-4">💎</span>
            </div>
            <h4 className="fw-bold mb-1">Jewelry Luxe</h4>
            <p className="text-muted mb-4">Admin Login</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger py-2 mb-3">
                ⚠️ {error}
              </div>
            )}
            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-dark w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Authenticating...
                </>
              ) : (
                "🔐 Login to Dashboard"
              )}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <small className="text-muted">
              Use: admin@gmail.com / admin123
            </small>
            <br />
            <small className="text-muted" style={{ fontSize: "12px" }}>
              🔒 MongoDB + JWT Authentication
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;