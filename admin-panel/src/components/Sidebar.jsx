import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", icon: "bi-grid-1x2", label: "Dashboard" },
    { path: "/products", icon: "bi-gem", label: "Products" },
    { path: "/orders", icon: "bi-box-seam", label: "Orders" },
    { path: "/customers", icon: "bi-people", label: "Customers" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1049
          }}
        />
      )}

      <div
        className={`admin-sidebar ${isOpen ? "open" : ""}`}
        style={{
          minHeight: "100vh",
          background: "#FFFFFF",
          width: "250px",
          borderRight: "1px solid #E8E8E8",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1050,
          transition: "transform 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* Logo Section */}
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: "#E8E8E8" }}>
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: "44px",
                height: "44px",
                background: "#000000",
                border: "2px solid #E8E8E8",
                flexShrink: 0,
              }}
            >
              <span className="text-white fw-bold" style={{ fontSize: "16px" }}>JL</span>
            </div>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: "#000000", fontSize: "16px", letterSpacing: "0.5px" }}>
                Jewelry Luxe
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "11px" }}>Admin Panel</p>
            </div>
          </div>
          {/* Close button only on mobile */}
          <button
            className="btn btn-sm d-lg-none p-0 border-0"
            onClick={onClose}
            style={{ fontSize: "20px", lineHeight: 1 }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-grow-1 p-3">
          <div className="nav flex-column gap-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  className="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none"
                  to={item.path}
                  onClick={onClose}
                  style={{
                    background: isActive ? "#000000" : "transparent",
                    color: isActive ? "#FFFFFF" : "#666666",
                    borderLeft: isActive ? "4px solid #000000" : "4px solid transparent",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#F8F9FA";
                      e.currentTarget.style.color = "#000000";
                      e.currentTarget.style.borderLeft = "4px solid #000000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#666666";
                      e.currentTarget.style.borderLeft = "4px solid transparent";
                    }
                  }}
                >
                  <i className={`bi ${item.icon}`} style={{ fontSize: "16px", width: "24px", textAlign: "center" }}></i>
                  <span className="fw-medium">{item.label}</span>
                  {isActive && (
                    <span className="ms-auto">
                      <div className="rounded-circle bg-white" style={{ width: "6px", height: "6px" }}></div>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile & Footer */}
        <div className="p-3 border-top" style={{ borderColor: "#E8E8E8" }}>
          <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded" style={{ background: "#F8F9FA", border: "1px solid #E8E8E8" }}>
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#000000", color: "#FFFFFF", flexShrink: 0 }}>
              <span className="fw-medium">A</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="fw-medium mb-0 text-truncate" style={{ color: "#000000", fontSize: "13px" }}>Admin User</p>
              <small className="text-muted" style={{ fontSize: "11px" }}>Super Admin</small>
            </div>
          </div>
          <div className="p-2 rounded text-center" style={{ background: "#F8F9FA", border: "1px solid #E8E8E8" }}>
            <small className="text-muted" style={{ fontSize: "11px" }}>© 2024 Jewelry Luxe</small>
            <br />
            <small className="text-muted" style={{ fontSize: "10px" }}>Version 2.1.0</small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;