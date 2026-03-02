import { Link } from 'react-router-dom';
import { useState } from 'react';

const headerStyle = {
  backgroundColor: '#0B6F73',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center'
};

const faqData = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days depending on your location. Metro cities receive orders in 3-5 days while other areas may take up to 7-10 days.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on all orders above ₹999. For orders below ₹999, a flat rate of ₹49 is charged.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order is shipped, you will receive an SMS and email with tracking details. You can also track from your Account page.' },
      { q: 'Do you offer Cash on Delivery?', a: 'Yes, Cash on Delivery (COD) is available across India on all orders.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 15-day hassle-free return policy from the date of delivery. Items must be unused and in original packaging.' },
      { q: 'How do I initiate a return?', a: 'Email us at care@marchjewellery.com or call 011-43078430 with your order ID. We will arrange a free reverse pickup.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.' },
      { q: 'Can I exchange instead of return?', a: 'Yes, we offer exchanges for a different size or design within the same price range. Contact us to arrange an exchange.' },
    ]
  },
  {
    category: 'Product & Care',
    items: [
      { q: 'Is the jewellery hypoallergenic?', a: 'Most of our pieces are made with hypoallergenic materials. Product descriptions include full material details for sensitive skin.' },
      { q: 'How do I care for my jewellery?', a: 'Store pieces in the provided box, avoid contact with perfumes and chemicals, and clean gently with a soft cloth. Visit our Jewellery Care page for detailed tips.' },
      { q: 'Do you provide a certificate of authenticity?', a: 'Yes, every piece comes with a certificate of authenticity and quality assurance in the branded packaging.' },
    ]
  },
  {
    category: 'Account & Payments',
    items: [
      { q: 'How do I create an account?', a: 'Click on the user icon in the navbar and select Register. Fill in your details and you are good to go!' },
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, UPI, RuPay, net banking, and Cash on Delivery.' },
      { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through secure, encrypted gateways. We never store your card details.' },
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff', minHeight: '70vh' }}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Frequently Asked Questions</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>FAQ</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '800px' }}>
        {faqData.map((section, sIdx) => (
          <div key={sIdx} className="mb-5">
            <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
              {section.category}
            </h5>
            <div className="accordion" id={`faq-${sIdx}`}>
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isOpen = openIndex === key;
                return (
                  <div className="card border mb-2" key={key} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="btn w-100 text-start d-flex justify-content-between align-items-center py-3 px-3"
                      style={{ fontSize: '14px', fontWeight: 600, backgroundColor: isOpen ? '#f0fafa' : '#fff', border: 'none' }}
                      onClick={() => toggle(key)}
                    >
                      <span>{item.q}</span>
                      <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#0B6F73' }}></i>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3">
                        <p className="text-muted mb-0" style={{ fontSize: '13px', lineHeight: '1.8' }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center mt-4 p-4 rounded" style={{ backgroundColor: '#f0fafa' }}>
          <p className="mb-2 fw-semibold" style={{ fontSize: '14px' }}>Still have questions?</p>
          <Link to="/contact" className="btn btn-sm text-white px-4" style={{ backgroundColor: '#0B6F73' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
