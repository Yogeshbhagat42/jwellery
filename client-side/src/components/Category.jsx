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
    <div className="container-fluid p-0 bg-white">
      {/* BANNER */}
      <div className="position-relative">
        <img
          src="/Banner.webp"
          className="img-fluid w-100"
          alt="Banner"
        />
      </div>

      {/* CATEGORIES SECTION */}
      <div className="bg-white py-4">
        <h5 className="text-center mb-4" style={{ color: "#0B6F73" }}>Shop by Category</h5>
        
        <div
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            padding: "0 16px 20px",
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
                minWidth: "90px",
                flexShrink: 0,
                textAlign: "center",
              }}
            >
              <div
                className="rounded-circle overflow-hidden mx-auto mb-2 border"
                style={{ 
                  width: 70, 
                  height: 70,
                  borderColor: '#0B6F73'
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
              <small style={{ color: "#0B6F73" }}>{c.name}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}