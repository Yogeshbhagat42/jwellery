import { Link } from 'react-router-dom';

const headerStyle = {
  backgroundColor: '#0B6F73',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center'
};

const JewelleryCare = () => {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff', minHeight: '70vh' }}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Jewellery Care Guide</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Jewellery Care</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <p className="text-muted text-center mb-5" style={{ fontSize: '14px', lineHeight: '1.8' }}>
          Your jewellery is crafted to last a lifetime. With proper care, each piece will continue to
          shine and sparkle for years to come. Follow these simple tips to keep your collection looking its best.
        </p>

        {/* General Care */}
        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-gem me-2"></i>General Care Tips
          </h5>
          <div className="row g-3">
            {[
              { icon: 'bi-droplet-half', title: 'Avoid Water & Chemicals', desc: 'Remove jewellery before swimming, bathing, or applying perfume, lotion, or hairspray.' },
              { icon: 'bi-box-seam', title: 'Store Properly', desc: 'Keep each piece in the provided jewellery box or a soft pouch to prevent scratching and tarnishing.' },
              { icon: 'bi-hand-index', title: 'Last On, First Off', desc: 'Put your jewellery on last when dressing and take it off first when undressing.' },
              { icon: 'bi-stars', title: 'Clean Regularly', desc: 'Gently wipe with a soft, lint-free cloth after each wear to remove oils and dirt.' },
            ].map((tip, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-3 d-flex gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                         style={{ width: 40, height: 40, backgroundColor: '#f0fafa' }}>
                      <i className={`bi ${tip.icon}`} style={{ color: '#0B6F73', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>{tip.title}</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{tip.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Material */}
        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-palette me-2"></i>Care by Material
          </h5>

          <div className="accordion" id="materialAccordion">
            {[
              {
                title: 'Gold & Gold-Plated',
                tips: [
                  'Clean with warm water and mild soap using a soft brush.',
                  'Dry thoroughly with a soft cloth.',
                  'Avoid abrasive cleaners that can strip gold plating.',
                  'Store separately to prevent scratches from harder gemstones.'
                ]
              },
              {
                title: 'Silver & Sterling Silver',
                tips: [
                  'Use a silver polishing cloth to remove tarnish regularly.',
                  'Store in anti-tarnish pouches or airtight bags.',
                  'Avoid contact with rubber and latex which cause tarnishing.',
                  'For heavy tarnish, use a silver cleaning solution.'
                ]
              },
              {
                title: 'Artificial & Fashion Jewellery',
                tips: [
                  'Keep away from water completely to avoid discolouration.',
                  'Wipe with a dry soft cloth after every use.',
                  'Apply a thin coat of clear nail polish on metal parts to prevent oxidation.',
                  'Store in zip-lock bags to prevent air exposure.'
                ]
              },
              {
                title: 'Pearl & Kundan',
                tips: [
                  'Pearls are delicate - never use ultrasonic cleaners or steam.',
                  'Wipe pearls gently with a damp cloth after wearing.',
                  'Store pearls flat to prevent the string from stretching.',
                  'Keep Kundan pieces in padded storage away from humidity.'
                ]
              }
            ].map((mat, idx) => (
              <div className="card border mb-2" key={idx} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  className="btn w-100 text-start d-flex justify-content-between align-items-center py-3 px-3"
                  data-bs-toggle="collapse"
                  data-bs-target={`#material-${idx}`}
                  style={{ fontSize: '14px', fontWeight: 600, border: 'none' }}
                >
                  <span>{mat.title}</span>
                  <i className="bi bi-chevron-down" style={{ color: '#0B6F73' }}></i>
                </button>
                <div id={`material-${idx}`} className={`collapse ${idx === 0 ? 'show' : ''}`}>
                  <div className="px-3 pb-3">
                    <ul className="mb-0" style={{ fontSize: '13px', lineHeight: '2' }}>
                      {mat.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="text-muted">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="mb-4">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-exclamation-triangle me-2"></i>Do's & Don'ts
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card border-0 h-100" style={{ backgroundColor: '#f0faf0' }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold text-success mb-3" style={{ fontSize: '14px' }}>
                    <i className="bi bi-check-circle me-2"></i>Do's
                  </h6>
                  <ul className="mb-0" style={{ fontSize: '13px', lineHeight: '2.2' }}>
                    <li>Store in a cool, dry place</li>
                    <li>Clean after every wear</li>
                    <li>Remove before exercising</li>
                    <li>Handle with clean, dry hands</li>
                    <li>Use separate compartments for each piece</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 h-100" style={{ backgroundColor: '#faf0f0' }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold text-danger mb-3" style={{ fontSize: '14px' }}>
                    <i className="bi bi-x-circle me-2"></i>Don'ts
                  </h6>
                  <ul className="mb-0" style={{ fontSize: '13px', lineHeight: '2.2' }}>
                    <li>Don't wear in the shower or pool</li>
                    <li>Don't spray perfume directly on jewellery</li>
                    <li>Don't use harsh chemicals for cleaning</li>
                    <li>Don't store all pieces together loosely</li>
                    <li>Don't sleep wearing delicate pieces</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryCare;
