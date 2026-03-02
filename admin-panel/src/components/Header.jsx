// components/Header.jsx
import { useState } from "react";

const Header = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
      setShowDropdown(false);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 mb-3 bg-white rounded" 
      style={{ border: "1px solid #E8E8E8" }}>
      
      <div>
        <h6 className="fw-semibold mb-0" style={{ color: "#000000", fontSize: "15px" }}>Dashboard</h6>
        <small className="text-muted" style={{ fontSize: "12px" }}>Manage your jewelry collection</small>
      </div>
      
      <div className="d-flex align-items-center gap-2">
        {/* Admin Profile */}
        <div className="position-relative">
          <button 
            className="btn btn-sm border-0 d-flex align-items-center gap-2 px-3 py-2 rounded"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: "#F8F9FA",
              border: "1px solid #E8E8E8"
            }}
          >
            <div className="rounded-circle bg-black text-white d-flex align-items-center justify-content-center" 
              style={{ width: "24px", height: "24px" }}>
              <span style={{ fontSize: "11px", fontWeight: "500" }}>
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="fw-medium" style={{ fontSize: "13px", color: "#000000" }}>
              {user?.name || 'Admin'}
            </span>
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div 
              className="position-absolute end-0 mt-2 bg-white rounded shadow-sm border"
              style={{ 
                minWidth: "180px", 
                zIndex: 1000 
              }}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="p-2 border-bottom">
                <small className="text-muted">Logged in as</small>
                <div className="fw-semibold">{user?.email || 'admin@gmail.com'}</div>
              </div>
              
              <button 
                className="dropdown-item w-100 text-start p-3 border-0 bg-white"
                onClick={handleLogout}
                style={{ 
                  color: "#dc3545",
                  fontSize: "14px"
                }}
              >
                <span className="me-2">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;