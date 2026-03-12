import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength
  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Excellent"][strength] || "";
  const strengthColor = ["", "#ef5350", "#ff9800", "#ffc107", "#66bb6a", "#2e7d32"][strength] || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/reset-password/${token}`, { password });
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f8fffe 0%,#eef7f7 100%)", padding: 20, fontFamily: "'Poppins',sans-serif" }}>

      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scalePop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
        @keyframes checkDraw{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0)}50%{opacity:1}100%{transform:translateY(50px) rotate(360deg);opacity:0}}
        .rp-card{animation:fadeInUp .6s ease-out}
        .rp-input:focus{border-color:#0B6F73!important;box-shadow:0 0 0 3px rgba(11,111,115,.12)!important}
        .rp-btn{position:relative;overflow:hidden;transition:all .3s}
        .rp-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(11,111,115,.3)}
      `}</style>

      <div className="rp-card" style={{ maxWidth: 440, width: "100%" }}>
        <div className="bg-white overflow-hidden" style={{ borderRadius: 24, boxShadow: "0 20px 60px rgba(11,111,115,.1)" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#0B6F73,#0a5c5f)", padding: "36px 28px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`bi ${message ? "bi-shield-check" : "bi-lock-fill"} text-white`} style={{ fontSize: 34 }}></i>
            </div>
            <h4 className="text-white mt-3 mb-1" style={{ fontWeight: 700 }}>
              {message ? "Password Reset!" : "Create New Password"}
            </h4>
            <p className="mb-0" style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}>
              {message ? "You can now login with your new password" : "Your new password must be different from previous"}
            </p>
          </div>

          <div className="p-4">
            {message ? (
              <div className="text-center py-3" style={{ animation: "scalePop .5s ease-out" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#28a745,#20c997)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 25px rgba(40,167,69,.3)" }}>
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 50, animation: "checkDraw .6s ease-out forwards" }} />
                  </svg>
                </div>
                <h5 className="fw-bold" style={{ color: "#28a745" }}>{message}</h5>
                <p className="text-muted" style={{ fontSize: 13 }}>Redirecting to login in 3 seconds…</p>
                <Link to="/login" className="btn px-4 py-2 text-white mt-2" style={{ background: "linear-gradient(135deg,#0B6F73,#0a5c5f)", borderRadius: 10, fontWeight: 600 }}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">New Password</label>
                  <div className="position-relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-control rp-input py-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required minLength="6"
                      placeholder="Min 6 characters"
                      style={{ borderRadius: 12, paddingLeft: 46, paddingRight: 46 }}
                    />
                    <i className="bi bi-lock position-absolute" style={{ left: 16, top: "50%", transform: "translateY(-50%)", color: "#0B6F73", fontSize: 18 }}></i>
                    <button type="button" className="btn btn-sm position-absolute p-0" style={{ right: 14, top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowPass(!showPass)}>
                      <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "#999", fontSize: 16 }}></i>
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="d-flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : "#e9ecef", transition: "all .3s" }}></div>
                        ))}
                      </div>
                      <p className="mb-0" style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Confirm Password</label>
                  <div className="position-relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-control rp-input py-3"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required minLength="6"
                      placeholder="Re-enter your password"
                      style={{ borderRadius: 12, paddingLeft: 46, paddingRight: 46 }}
                    />
                    <i className="bi bi-lock-fill position-absolute" style={{ left: 16, top: "50%", transform: "translateY(-50%)", color: "#0B6F73", fontSize: 18 }}></i>
                    <button type="button" className="btn btn-sm position-absolute p-0" style={{ right: 14, top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowConfirm(!showConfirm)}>
                      <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "#999", fontSize: 16 }}></i>
                    </button>
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="mt-1 mb-0" style={{ fontSize: 12, color: "#ef5350" }}>
                      <i className="bi bi-x-circle me-1"></i>Passwords don't match
                    </p>
                  )}
                  {confirmPassword.length > 0 && password === confirmPassword && (
                    <p className="mt-1 mb-0" style={{ fontSize: 12, color: "#28a745" }}>
                      <i className="bi bi-check-circle me-1"></i>Passwords match
                    </p>
                  )}
                </div>

                {error && (
                  <div className="d-flex align-items-center gap-2 p-3 mb-3" style={{ background: "#fff5f5", borderRadius: 12, color: "#c62828", fontSize: 13 }}>
                    <i className="bi bi-exclamation-triangle-fill"></i>{error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn w-100 text-white py-3 fw-semibold rp-btn"
                  style={{ background: "linear-gradient(135deg,#0B6F73,#0a5c5f)", borderRadius: 12, fontSize: 16 }}
                  disabled={loading}
                >
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</span>
                  ) : (
                    <><i className="bi bi-check2-circle me-2"></i>Reset Password</>
                  )}
                </button>
              </form>
            )}

            <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
              <Link to="/login" style={{ color: "#0B6F73", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                <i className="bi bi-arrow-left me-1"></i>Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
