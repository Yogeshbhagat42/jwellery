import { Link } from 'react-router-dom';

export default function Category() {
  const categories = [
    { name: "Earrings", img: "/earrings.avif", category: "earrings" },
    { name: "Bracelets", img: "/Bracelets.avif", category: "bracelets" },
    { name: "Necklace", img: "/Necklace.avif", category: "necklaces" },
    { name: "Rings", img: "/Rings.avif", category: "rings" },
    { name: "Couple Rings", img: "/couple-rings.avif", category: "couple-rings" },
    { name: "Mangalsutra", img: "/Mangalsutra.avif", category: "mangalsutra" },
    { name: "Anklets", img: "/Anklets.avif", category: "anklets" },
    { name: "Nose Pins", img: "/Nosepins.avif", category: "nose-pins" },
  ];

  const giftSections = [
    { title: "PARTNER", image: "/couple-rings.avif", link: "/shop?category=Couple Rings" },
    { title: "HIM & HER", image: "/Rings.avif", link: "/shop?recipient=couples" },
    { title: "FRIEND", image: "/Bracelets.avif", link: "/shop?recipient=friend" },
    { title: "YOURSELF", image: "/earrings.avif", link: "/shop?recipient=self" },
    { title: "SISTER", image: "/Necklace.avif", link: "/shop?recipient=sister" },
    { title: "MOTHER", image: "/Mangalsutra.avif", link: "/shop?recipient=mother" },
  ];

  return (
    <div className="bg-white">
      {/* HERO BANNER */}
      <div className="position-relative" style={{ 
        background: 'linear-gradient(135deg, #0B6F73 0%, #0a5a5d 100%)',
        minHeight: '420px'
      }}>
        <div className="container">
          <div className="row align-items-center" style={{ minHeight: '420px' }}>
            <div className="col-lg-6 text-center text-lg-start py-5">
              <p className="text-uppercase mb-2" style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '12px', 
                letterSpacing: '3px',
                fontWeight: 500 
              }}>
                Pure 925 Sterling Silver
              </p>
              <h1 className="fw-bold mb-3" style={{ 
                color: '#fff', 
                fontSize: 'clamp(32px, 5vw, 48px)',
                lineHeight: 1.2
              }}>
                Timeless Elegance<br />
                <span style={{ fontWeight: 300 }}>Crafted for You</span>
              </h1>
              <p className="mb-4" style={{ 
                color: 'rgba(255,255,255,0.85)', 
                fontSize: '16px',
                maxWidth: '450px',
                margin: '0 auto 0 0'
              }}>
                Discover our exquisite collection of handcrafted jewellery designed to celebrate every moment of your life.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link 
                  to="/shop" 
                  className="btn px-4 py-2 fw-semibold"
                  style={{ 
                    backgroundColor: '#fff', 
                    color: '#0B6F73',
                    borderRadius: '0',
                    fontSize: '14px'
                  }}
                >
                  SHOP NOW
                </Link>
                <Link 
                  to="/shop?filter=new" 
                  className="btn px-4 py-2 fw-semibold"
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '0',
                    fontSize: '14px'
                  }}
                >
                  NEW ARRIVALS
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center py-4">
              <img 
                src="/Necklace.avif" 
                alt="Featured Jewellery"
                style={{ 
                  maxHeight: '350px', 
                  borderRadius: '8px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BRAND PROMISE SECTION */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '40px 0' }}>
        <div className="container">
          <h5 className="text-center mb-4" style={{ color: '#fff', fontSize: '14px', letterSpacing: '2px' }}>
            ◆ Our Brand Promise ◆
          </h5>
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '60px', height: '60px', border: '2px solid #0B6F73' }}>
                  <span style={{ color: '#0B6F73', fontWeight: 'bold', fontSize: '14px' }}>925</span>
                </div>
                <p className="mb-0 text-white fw-semibold" style={{ fontSize: '13px' }}>925 Pure Silver</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '60px', height: '60px', border: '2px solid #0B6F73' }}>
                  <i className="bi bi-gem" style={{ color: '#0B6F73', fontSize: '22px' }}></i>
                </div>
                <p className="mb-0 text-white fw-semibold" style={{ fontSize: '13px' }}>Natural Gemstones</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '60px', height: '60px', border: '2px solid #0B6F73' }}>
                  <span style={{ color: '#0B6F73', fontWeight: 'bold', fontSize: '14px' }}>6M</span>
                </div>
                <p className="mb-0 text-white fw-semibold" style={{ fontSize: '13px' }}>6 Months Warranty</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '60px', height: '60px', border: '2px solid #0B6F73' }}>
                  <i className="bi bi-patch-check" style={{ color: '#0B6F73', fontSize: '22px' }}></i>
                </div>
                <p className="mb-0 text-white fw-semibold" style={{ fontSize: '13px' }}>Certificate of Authenticity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION */}
      <div className="bg-white py-5">
        <div className="container">
          <h5 className="text-center mb-4" style={{ color: "#0B6F73", fontSize: '18px', fontWeight: 600 }}>
            Shop by Category
          </h5>
          
          <div
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              paddingBottom: "20px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="justify-content-start justify-content-md-center"
          >
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/shop?category=${c.category}`}
                className="text-decoration-none"
                style={{
                  minWidth: "100px",
                  flexShrink: 0,
                  textAlign: "center",
                }}
              >
                <div
                  className="rounded-circle overflow-hidden mx-auto mb-2"
                  style={{ 
                    width: 85, 
                    height: 85,
                    border: '3px solid #0B6F73',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(11,111,115,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <small className="fw-semibold" style={{ color: "#333", fontSize: '13px' }}>{c.name}</small>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* GIFT YOUR LOVED ONES SECTION */}
      <div className="py-5" style={{ backgroundColor: '#fafafa' }}>
        <div className="container">
          <h5 className="text-center mb-2" style={{ color: "#0B6F73", fontSize: '18px', fontWeight: 600 }}>
            Gift Your Loved Ones
          </h5>
          <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>
            Find the perfect piece for every special person in your life
          </p>
          
          <div className="row g-3">
            {giftSections.map((gift, index) => (
              <div className="col-6 col-md-4" key={index}>
                <Link to={gift.link} className="text-decoration-none">
                  <div 
                    className="position-relative overflow-hidden"
                    style={{ 
                      height: '220px',
                      borderRadius: '0',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    }}
                  >
                    <img 
                      src={gift.image} 
                      alt={gift.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))'
                      }}
                    >
                      <h5 
                        className="text-white fw-bold mb-0"
                        style={{ 
                          fontSize: '18px', 
                          letterSpacing: '3px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      >
                        {gift.title}
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS / ABOUT SECTION */}
      <div className="py-5 bg-white">
        <div className="container">
          <h5 className="text-center mb-4" style={{ color: "#0B6F73", fontSize: '18px', fontWeight: 600 }}>
            Why Choose Rivaah?
          </h5>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4">
                <i className="bi bi-truck mb-3" style={{ fontSize: '36px', color: '#0B6F73' }}></i>
                <h6 className="fw-semibold mb-2">Free Shipping</h6>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                  Free delivery on all prepaid orders across India
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <i className="bi bi-arrow-repeat mb-3" style={{ fontSize: '36px', color: '#0B6F73' }}></i>
                <h6 className="fw-semibold mb-2">Easy Returns</h6>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                  7-day hassle-free returns and exchanges
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <i className="bi bi-shield-check mb-3" style={{ fontSize: '36px', color: '#0B6F73' }}></i>
                <h6 className="fw-semibold mb-2">Secure Payments</h6>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                  100% secure payments with multiple options
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}