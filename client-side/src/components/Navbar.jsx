import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartSidebar from './CartSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const navMenus = {
  shop: {
    title: 'SHOP',
    link: '/shop',
    columns: [
      {
        heading: 'By Category',
        items: [
          { label: 'Rings', link: '/shop?category=Rings' },
          { label: 'Earrings', link: '/shop?category=Earrings' },
          { label: 'Necklaces', link: '/shop?category=Necklace' },
          { label: 'Bracelets', link: '/shop?category=Bracelets' },
          { label: 'Anklets', link: '/shop?category=Anklets' },
          { label: 'Nose Pins', link: '/shop?category=Nose Pins' },
          { label: 'Mangalsutra', link: '/shop?category=Mangalsutra' },
          { label: 'Couple Rings', link: '/shop?category=Couple Rings' },
        ],
      },
    ],
  },
  newArrivals: {
    title: 'NEW ARRIVALS',
    link: '/shop?filter=new',
    columns: [
      {
        heading: 'New In',
        items: [
          { label: 'New Rings', link: '/shop?category=Rings&filter=new' },
          { label: 'New Earrings', link: '/shop?category=Earrings&filter=new' },
          { label: 'New Necklaces', link: '/shop?category=Necklace&filter=new' },
          { label: 'New Bracelets', link: '/shop?category=Bracelets&filter=new' },
        ],
      },
      {
        heading: 'Trending',
        items: [
          { label: 'Most Popular', link: '/shop?sort=popular' },
          { label: 'Just Dropped', link: '/shop?filter=new' },
        ],
      },
    ],
  },
  gifts: {
    title: 'GIFTS',
    link: '/shop',
    columns: [
      {
        heading: 'By Occasion',
        items: [
          { label: 'Birthday Gifts', link: '/shop?occasion=birthday' },
          { label: 'Anniversary Gifts', link: '/shop?occasion=anniversary' },
          { label: 'Wedding Gifts', link: '/shop?occasion=wedding' },
          { label: "Valentine's Day", link: '/shop?occasion=valentines' },
        ],
      },
      {
        heading: 'By Recipient',
        items: [
          { label: 'For Her', link: '/shop?recipient=her' },
          { label: 'For Him', link: '/shop?recipient=him' },
          { label: 'For Couples', link: '/shop?category=Couple Rings' },
        ],
      },
    ],
  },
  bestsellers: {
    title: 'BESTSELLERS',
    link: '/shop?sort=bestselling',
    columns: [
      {
        heading: 'Top Selling',
        items: [
          { label: 'Best Rings', link: '/shop?category=Rings&sort=bestselling' },
          { label: 'Best Earrings', link: '/shop?category=Earrings&sort=bestselling' },
          { label: 'Best Necklaces', link: '/shop?category=Necklace&sort=bestselling' },
          { label: 'Best Bracelets', link: '/shop?category=Bracelets&sort=bestselling' },
        ],
      },
    ],
  },
  valueDeals: {
    title: 'VALUE DEALS',
    link: '/shop?sort=price_low',
    columns: [
      {
        heading: 'By Price',
        items: [
          { label: 'Under ₹500', link: '/shop?maxPrice=500' },
          { label: 'Under ₹1,000', link: '/shop?maxPrice=1000' },
          { label: 'Under ₹2,000', link: '/shop?maxPrice=2000' },
          { label: 'Under ₹5,000', link: '/shop?maxPrice=5000' },
        ],
      },
      {
        heading: 'Special Offers',
        items: [
          { label: 'Clearance Sale', link: '/shop?sale=clearance' },
          { label: 'Combo Deals', link: '/shop?sale=combo' },
        ],
      },
    ],
  },
  more: {
    title: 'MORE',
    link: '#',
    columns: [
      {
        heading: 'About',
        items: [
          { label: 'Our Story', link: '/about' },
          { label: 'Contact Us', link: '/contact' },
          { label: 'Jewellery Care', link: '/jewelry-care' },
          { label: 'FAQ', link: '/faq' },
        ],
      },
      {
        heading: 'Policies',
        items: [
          { label: 'Shipping Policy', link: '/shipping' },
          { label: 'Return Policy', link: '/returns' },
          { label: 'Privacy Policy', link: '/privacy' },
        ],
      },
    ],
  },
};

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const dropdownTimeout = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setSearchLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.products || []);
      setShowResults(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSelect = (productId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleMouseEnter = (key) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <style>{`
        .nav-dropdown-hover { position: relative; }
        .nav-mega-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border-top: 2px solid #0B6F73;
          padding: 24px 28px;
          min-width: 220px;
          z-index: 1050;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
          transform: translateX(-50%) translateY(8px);
        }
        .nav-dropdown-hover:hover .nav-mega-menu,
        .nav-mega-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .mega-col-heading {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #0B6F73;
          letter-spacing: 1px;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e8e8e8;
        }
        .mega-link {
          display: block;
          padding: 5px 0;
          color: #333;
          text-decoration: none;
          font-size: 13px;
          font-family: 'Poppins', sans-serif;
          transition: color 0.2s, padding-left 0.2s;
        }
        .mega-link:hover {
          color: #0B6F73;
          padding-left: 6px;
        }
        .search-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border: 1px solid #e8e8e8;
          border-top: 2px solid #0B6F73;
          z-index: 1060;
          max-height: 400px;
          overflow-y: auto;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          text-decoration: none;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background 0.15s;
        }
        .search-result-item:hover { background: #f8f8f8; }
        .mobile-accordion-btn {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 10px 0;
          font-weight: 600;
          color: #0B6F73;
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mobile-sub-menu {
          padding-left: 16px;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        .mobile-sub-menu.open { max-height: 500px; }
        
        /* Navbar responsive fixes */
        @media (max-width: 575.98px) {
          .navbar { padding-left: 8px !important; padding-right: 8px !important; }
          .navbar-brand span:first-child { font-size: 22px !important; letter-spacing: 1px !important; }
          .navbar-brand span:last-child { font-size: 8px !important; }
        }
      `}</style>

      {/* Top Banner */}
      <div className="text-white text-center py-2" style={{ background: "linear-gradient(90deg, #0B6F73 0%, #0a5a5d 100%)", fontSize: '12px', letterSpacing: '0.5px' }}>
        <i className="bi bi-stars me-2"></i>
        Clearance Sale: Flat 70% OFF on Selected Items | Free Shipping on Orders Above ₹999
        <i className="bi bi-stars ms-2"></i>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-light bg-white px-3 py-2" style={{ borderBottom: '1px solid #eee' }}>
        <button
          className="btn d-md-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
        >
          <i className="bi bi-list fs-4" style={{ color: "#0B6F73" }}></i>
        </button>

        <Link className="navbar-brand fw-bold mx-auto mx-md-0" to="/">
          <span style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: '28px', 
            fontWeight: 700, 
            color: '#0B6F73',
            letterSpacing: '3px'
          }}>
            RIVAAH
          </span>
          <span style={{ 
            display: 'block', 
            fontSize: '9px', 
            color: '#888', 
            letterSpacing: '2px',
            marginTop: '-4px'
          }}>
            FINE SILVER JEWELLERY
          </span>
        </Link>

        {/* Search Bar */}
        <div className="d-none d-md-flex w-50 position-relative" ref={searchRef}>
          <input
            className="form-control rounded-0"
            type="search"
            placeholder="Search for jewellery"
            style={{ borderColor: '#0B6F73' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          {showResults && (
            <div className="search-results-dropdown">
              {searchLoading ? (
                <div className="p-3 text-center">
                  <span className="spinner-border spinner-border-sm" style={{ color: '#0B6F73' }}></span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-center text-muted" style={{ fontSize: '13px' }}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="search-result-item"
                    onClick={() => handleSearchSelect(product._id)}
                  >
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt=""
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div className="ms-3">
                      <p className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>{product.name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                        {product.category} &middot; ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="d-flex align-items-center flex-nowrap" style={{ gap: '10px' }}>
          <Link to={isAuthenticated ? "/account" : "/login"}>
            <i className="bi bi-person" style={{ color: "#0B6F73", fontSize: "1.3rem" }}></i>
          </Link>
          <Link to="/wishlist" className="position-relative">
            <i className="bi bi-heart" style={{ color: "#0B6F73", fontSize: "1.3rem" }}></i>
            {wishlistCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '9px', padding: '3px 5px' }}>
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn position-relative p-0 border-0 bg-transparent"
          >
            <i className="bi bi-bag" style={{ color: "#0B6F73", fontSize: "1.3rem" }}></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '9px', padding: '3px 5px' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Categories with Hover Dropdowns */}
      <nav className="navbar navbar-expand justify-content-center d-none d-md-flex bg-white border-bottom" style={{ position: 'relative', zIndex: 1040 }}>
        <ul className="navbar-nav gap-4" style={{ fontSize: "12px", fontFamily: "Poppins, sans-serif" }}>
          {Object.entries(navMenus).map(([key, menu]) => (
            <li
              key={key}
              className="nav-item nav-dropdown-hover"
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={menu.link}
                className="nav-link fw-semibold px-2"
                style={{ color: activeDropdown === key ? '#0B6F73' : '#333', transition: 'color 0.2s' }}
              >
                {menu.title}
                <i className="bi bi-chevron-down ms-1" style={{ fontSize: '9px' }}></i>
              </Link>
              <div className={`nav-mega-menu ${activeDropdown === key ? 'show' : ''}`}
                   style={{ minWidth: menu.columns.length > 1 ? '380px' : '220px' }}>
                <div className="d-flex gap-4">
                  {menu.columns.map((col, i) => (
                    <div key={i} style={{ minWidth: '150px' }}>
                      <div className="mega-col-heading">{col.heading}</div>
                      {col.items.map((item, j) => (
                        <Link key={j} to={item.link} className="mega-link">{item.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Offcanvas */}
      <MobileMenu />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}

function MobileMenu() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="mobileMenu">
      <div className="offcanvas-header" style={{ borderBottom: '2px solid #0B6F73' }}>
        <h5 className="offcanvas-title fw-bold" style={{ color: "#0B6F73" }}>Shop Jewellery</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body p-0">
        {/* Mobile Search */}
        <div className="p-3 border-bottom">
          <input
            className="form-control rounded-0"
            type="search"
            placeholder="Search for jewellery"
            style={{ borderColor: '#0B6F73', fontSize: '14px' }}
          />
        </div>

        {Object.entries(navMenus).map(([key, menu]) => (
          <div key={key} className="border-bottom">
            <button
              className="mobile-accordion-btn px-3"
              onClick={() => toggleSection(key)}
            >
              {menu.title}
              <i className={`bi bi-chevron-${openSection === key ? 'up' : 'down'}`} style={{ fontSize: '12px' }}></i>
            </button>
            <div className={`mobile-sub-menu ${openSection === key ? 'open' : ''}`}>
              {menu.columns.map((col, i) => (
                <div key={i} className="mb-2 px-3">
                  <p className="text-muted small fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {col.heading}
                  </p>
                  {col.items.map((item, j) => (
                    <Link
                      key={j}
                      to={item.link}
                      className="d-block text-decoration-none text-dark py-1"
                      style={{ fontSize: '14px' }}
                      data-bs-dismiss="offcanvas"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="mb-3"></div>
            </div>
          </div>
        ))}

        {/* Mobile quick links */}
        <div className="p-3">
          <Link to="/account" className="d-block text-decoration-none py-2" style={{ color: '#0B6F73', fontWeight: 600 }} data-bs-dismiss="offcanvas">
            <i className="bi bi-person me-2"></i>My Account
          </Link>
          <Link to="/wishlist" className="d-block text-decoration-none py-2" style={{ color: '#0B6F73', fontWeight: 600 }} data-bs-dismiss="offcanvas">
            <i className="bi bi-heart me-2"></i>Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
