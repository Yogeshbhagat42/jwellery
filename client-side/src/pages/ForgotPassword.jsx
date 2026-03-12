import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email"); return; }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f8fffe 0%,#eef7f7 100%)", padding: 20, fontFamily: "'Poppins',sans-serif" }}>

      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes mailFly{0%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-15px) rotate(-5deg)}100%{transform:translateY(0) rotate(0deg)}}
        .fp-card{animation:fadeInUp .6s ease-out}
        .fp-input:focus{border-color:#0B6F73!important;box-shadow:0 0 0 3px rgba(11,111,115,.12)!important}
        .fp-btn{position:relative;overflow:hidden;transition:all .3s}
        .fp-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(11,111,115,.3)}
      `}</style>

      <div className="fp-card" style={{ maxWidth: 440, width: "100%" }}>
        <div className="bg-white overflow-hidden" style={{ borderRadius: 24, boxShadow: "0 20px 60px rgba(11,111,115,.1)" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#0B6F73,#0a5c5f)", padding: "36px 28px", textAlign: "center" }}>
            <div style={{ animation: sent ? "mailFly 2s ease-in-out infinite" : "float 3s ease-in-out infinite" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`bi ${sent ? "bi-envelope-check" : "bi-key"} text-white`} style={{ fontSize: 34 }}></i>
              </div>
            </div>
            <h4 className="text-white mt-3 mb-1" style={{ fontWeight: 700 }}>
              {sent ? "Check Your Email" : "Forgot Password?"}
            </h4>
            <p className="mb-0" style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}>
              {sent ? "We've sent you a reset link" : "No worries, we'll help you reset it"}
            </p>
          </div>

          <div className="p-4">
            {!sent ? (
              <>
                <p className="text-muted text-center mb-4" style={{ fontSize: 14 }}>
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control fp-input py-3"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ borderRadius: 12, paddingLeft: 46 }}
                      />
                      <i className="bi bi-envelope position-absolute" style={{ left: 16, top: "50%", transform: "translateY(-50%)", color: "#0B6F73", fontSize: 18 }}></i>
                    </div>
                  </div>

                  {error && (
                    <div className="d-flex align-items-center gap-2 p-3 mb-3" style={{ background: "#fff5f5", borderRadius: 12, color: "#c62828", fontSize: 13 }}>
                      <i className="bi bi-exclamation-triangle-fill"></i>{error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn w-100 text-white py-3 fw-semibold fp-btn"
                    style={{ background: "linear-gradient(135deg,#0B6F73,#0a5c5f)", borderRadius: 12, fontSize: 16 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span><span className="spinner-border spinner-border-sm me-2"></span>Sending...</span>
                    ) : (
                      <><i className="bi bi-send me-2"></i>Send Reset Link</>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f5e9", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, animation: "pulse 2s ease-in-out infinite" }}>
                  <i className="bi bi-check-lg" style={{ fontSize: 32, color: "#28a745" }}></i>
                </div>
                <p className="fw-semibold mb-1" style={{ fontSize: 16 }}>Email Sent Successfully!</p>
                <p className="text-muted mb-4" style={{ fontSize: 13 }}>
                  We've sent a password reset link to <strong style={{ color: "#0B6F73" }}>{email}</strong>. 
                  Please check your inbox and spam folder.
                </p>
                <div className="p-3" style={{ background: "#fafafa", borderRadius: 12, fontSize: 13, color: "#666" }}>
                  <i className="bi bi-info-circle me-1"></i>
                  Link expires in 1 hour. Didn't receive it?
                  <button className="btn btn-link btn-sm p-0 ms-1" style={{ color: "#0B6F73", fontWeight: 600, textDecoration: "none" }} onClick={() => { setSent(false); setError(""); }}>
                    Resend
                  </button>
                </div>
              </div>
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
