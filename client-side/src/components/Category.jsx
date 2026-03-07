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

  return (
    <div className="bg-white">
      {/* HERO BANNER - Full Width */}
      <div className="position-relative" style={{
        background: 'linear-gradient(135deg, #0B6F73 0%, #085456 50%, #0a5a5d 100%)',
        minHeight: '520px',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.02)'
        }}></div>

        <div className="container">
          <div className="row align-items-center" style={{ minHeight: '520px' }}>
            <div className="col-lg-6 text-center text-lg-start py-5">
              <p className="text-uppercase mb-3" style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '11px',
                letterSpacing: '4px',
                fontWeight: 500
              }}>
                Pure 925 Sterling Silver
              </p>
              <h1 className="fw-bold mb-4" style={{
                color: '#fff',
                fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.5px'
              }}>
                Timeless Elegance<br />
                <span style={{ fontWeight: 300, fontStyle: 'italic' }}>Crafted for You</span>
              </h1>
              <p className="mb-4" style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '16px',
                maxWidth: '460px',
                lineHeight: 1.7,
                margin: '0 auto 0 0'
              }}>
                Discover our exquisite collection of handcrafted jewellery designed to celebrate every moment of your life.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start mt-4">
                <Link
                  to="/shop"
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: '#fff',
                    color: '#0B6F73',
                    borderRadius: '0',
                    fontSize: '13px',
                    letterSpacing: '2px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  SHOP NOW
                </Link>
                <Link
                  to="/shop?filter=new"
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '0',
                    fontSize: '13px',
                    letterSpacing: '2px',
                    transition: 'all 0.3s ease'
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
                  maxHeight: '440px',
                  borderRadius: '12px',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                  transform: 'rotate(-2deg)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION - Circle Style */}
      <div className="bg-white" style={{ padding: '60px 0 50px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-uppercase mb-2" style={{ color: '#0B6F73', fontSize: '11px', letterSpacing: '3px', fontWeight: 600 }}>
              Browse Collection
            </p>
            <h2 className="fw-bold" style={{ color: '#1a1a1a', fontSize: '28px' }}>
              Shop by Category
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
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
                  minWidth: "110px",
                  flexShrink: 0,
                  textAlign: "center",
                }}
              >
                <div
                  className="rounded-circle overflow-hidden mx-auto mb-3"
                  style={{
                    width: 100,
                    height: 100,
                    border: '3px solid #0B6F73',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    boxShadow: '0 4px 15px rgba(11,111,115,0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(11,111,115,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(11,111,115,0.15)';
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
                <small className="fw-semibold" style={{ color: "#333", fontSize: '13px', letterSpacing: '0.5px' }}>{c.name}</small>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandPromise() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', padding: '70px 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-uppercase mb-2" style={{ color: '#0B6F73', fontSize: '11px', letterSpacing: '3px', fontWeight: 600 }}>
            Why Trust Us
          </p>
          <h2 className="fw-bold" style={{ color: '#fff', fontSize: '28px' }}>
            Our Brand Promise
          </h2>
        </div>
        <div className="row text-center g-4">
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                   style={{
                     width: '80px', height: '80px',
                     border: '2px solid #0B6F73',
                     background: 'rgba(11,111,115,0.1)',
                     transition: 'all 0.3s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.2)';
                     e.currentTarget.style.transform = 'scale(1.05)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.1)';
                     e.currentTarget.style.transform = 'scale(1)';
                   }}
              >
                <span style={{ color: '#0B6F73', fontWeight: 'bold', fontSize: '18px' }}>925</span>
              </div>
              <p className="mb-1 text-white fw-semibold" style={{ fontSize: '15px' }}>925 Pure Silver</p>
              <p className="mb-0" style={{ fontSize: '12px', color: '#777' }}>Certified purity in every piece</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                   style={{
                     width: '80px', height: '80px',
                     border: '2px solid #0B6F73',
                     background: 'rgba(11,111,115,0.1)',
                     transition: 'all 0.3s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.2)';
                     e.currentTarget.style.transform = 'scale(1.05)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.1)';
                     e.currentTarget.style.transform = 'scale(1)';
                   }}
              >
                <i className="bi bi-gem" style={{ color: '#0B6F73', fontSize: '26px' }}></i>
              </div>
              <p className="mb-1 text-white fw-semibold" style={{ fontSize: '15px' }}>Natural Gemstones</p>
              <p className="mb-0" style={{ fontSize: '12px', color: '#777' }}>Ethically sourced stones</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                   style={{
                     width: '80px', height: '80px',
                     border: '2px solid #0B6F73',
                     background: 'rgba(11,111,115,0.1)',
                     transition: 'all 0.3s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.2)';
                     e.currentTarget.style.transform = 'scale(1.05)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.1)';
                     e.currentTarget.style.transform = 'scale(1)';
                   }}
              >
                <span style={{ color: '#0B6F73', fontWeight: 'bold', fontSize: '18px' }}>6M</span>
              </div>
              <p className="mb-1 text-white fw-semibold" style={{ fontSize: '15px' }}>6 Months Warranty</p>
              <p className="mb-0" style={{ fontSize: '12px', color: '#777' }}>Complete peace of mind</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                   style={{
                     width: '80px', height: '80px',
                     border: '2px solid #0B6F73',
                     background: 'rgba(11,111,115,0.1)',
                     transition: 'all 0.3s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.2)';
                     e.currentTarget.style.transform = 'scale(1.05)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'rgba(11,111,115,0.1)';
                     e.currentTarget.style.transform = 'scale(1)';
                   }}
              >
                <i className="bi bi-patch-check" style={{ color: '#0B6F73', fontSize: '26px' }}></i>
              </div>
              <p className="mb-1 text-white fw-semibold" style={{ fontSize: '15px' }}>Certificate of Authenticity</p>
              <p className="mb-0" style={{ fontSize: '12px', color: '#777' }}>Verified genuine silver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GiftSection() {
  const giftSections = [
    { title: "PARTNER", subtitle: "For your soulmate", image: "/couple-rings.avif", link: "/shop?category=Couple Rings" },
    { title: "HIM & HER", subtitle: "Matching sets", image: "/Rings.avif", link: "/shop?recipient=couples" },
    { title: "FRIEND", subtitle: "Friendship treasures", image: "/Bracelets.avif", link: "/shop?recipient=friend" },
    { title: "YOURSELF", subtitle: "You deserve it", image: "/earrings.avif", link: "/shop?recipient=self" },
    { title: "SISTER", subtitle: "Bond of love", image: "/Necklace.avif", link: "/shop?recipient=sister" },
    { title: "MOTHER", subtitle: "Timeless affection", image: "/Mangalsutra.avif", link: "/shop?recipient=mother" },
  ];

  return (
    <div style={{ padding: '70px 0', backgroundColor: '#fafafa' }}>
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-uppercase mb-2" style={{ color: '#0B6F73', fontSize: '11px', letterSpacing: '3px', fontWeight: 600 }}>
            Perfect Presents
          </p>
          <h2 className="fw-bold" style={{ color: '#1a1a1a', fontSize: '28px' }}>
            Gift Your Loved Ones
          </h2>
          <p className="text-muted mt-2" style={{ fontSize: '15px' }}>
            Find the perfect piece for every special person in your life
          </p>
        </div>

        <div className="row g-3">
          {giftSections.map((gift, index) => (
            <div className={`col-6 ${index < 2 ? 'col-md-6' : 'col-md-3'}`} key={index}>
              <Link to={gift.link} className="text-decoration-none">
                <div
                  className="position-relative overflow-hidden"
                  style={{
                    height: index < 2 ? '320px' : '280px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                    e.currentTarget.querySelector('.gift-overlay').style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.65))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    e.currentTarget.querySelector('.gift-overlay').style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.5))';
                  }}
                >
                  <img
                    src={gift.image}
                    alt={gift.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  />
                  <div
                    className="gift-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-end"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.5))',
                      padding: '30px',
                      transition: 'background 0.4s ease'
                    }}
                  >
                    <h5
                      className="text-white fw-bold mb-1"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '4px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}
                    >
                      {gift.title}
                    </h5>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                      {gift.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WhyChoose() {
  return (
    <div style={{ padding: '70px 0', backgroundColor: '#fff' }}>
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-uppercase mb-2" style={{ color: '#0B6F73', fontSize: '11px', letterSpacing: '3px', fontWeight: 600 }}>
            The Rivaah Difference
          </p>
          <h2 className="fw-bold" style={{ color: '#1a1a1a', fontSize: '28px' }}>
            Why Choose Rivaah?
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="text-center p-4" style={{
              border: '1px solid #eee',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0B6F73';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(11,111,115,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#eee';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '70px', height: '70px', backgroundColor: '#f0fafa' }}>
                <i className="bi bi-truck" style={{ fontSize: '28px', color: '#0B6F73' }}></i>
              </div>
              <h6 className="fw-bold mb-2">Free Shipping</h6>
              <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                Free delivery on all prepaid orders across India
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-4" style={{
              border: '1px solid #eee',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0B6F73';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(11,111,115,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#eee';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '70px', height: '70px', backgroundColor: '#f0fafa' }}>
                <i className="bi bi-arrow-repeat" style={{ fontSize: '28px', color: '#0B6F73' }}></i>
              </div>
              <h6 className="fw-bold mb-2">Easy Returns</h6>
              <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                7-day hassle-free returns and exchanges
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-4" style={{
              border: '1px solid #eee',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0B6F73';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(11,111,115,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#eee';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '70px', height: '70px', backgroundColor: '#f0fafa' }}>
                <i className="bi bi-shield-check" style={{ fontSize: '28px', color: '#0B6F73' }}></i>
              </div>
              <h6 className="fw-bold mb-2">Secure Payments</h6>
              <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                100% secure payments with multiple options
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
