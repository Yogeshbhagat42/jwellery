import { Link } from 'react-router-dom';

const headerStyle = {
  backgroundColor: '#0B6F73',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center'
};

const Privacy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: 'bi-clipboard-data',
      content: [
        'Personal identification information: name, email address, phone number, and shipping address provided during registration or checkout.',
        'Payment information: processed securely through third-party payment gateways. We do not store your card details on our servers.',
        'Browsing data: pages visited, products viewed, time spent on site, and device information collected via cookies.',
        'Order history: details of products purchased, order amounts, and delivery addresses.'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: 'bi-gear',
      content: [
        'To process and fulfill your orders, including shipping and handling returns.',
        'To communicate with you about order updates, promotions, and new arrivals (with your consent).',
        'To improve our website, product offerings, and customer experience.',
        'To prevent fraud and ensure the security of our platform.',
        'To comply with legal obligations and resolve disputes.'
      ]
    },
    {
      title: 'Information Sharing',
      icon: 'bi-people',
      content: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'We may share information with trusted service providers (shipping partners, payment processors) solely for order fulfillment.',
        'We may disclose information when required by law, court order, or government regulation.',
        'In the event of a merger or acquisition, user data may be transferred to the new entity.'
      ]
    },
    {
      title: 'Cookies & Tracking',
      icon: 'bi-cookie',
      content: [
        'We use cookies to enhance your browsing experience and remember your preferences.',
        'Analytics cookies help us understand how visitors interact with our website.',
        'You can control cookie settings through your browser. Disabling cookies may affect site functionality.',
        'We do not use cookies to collect personally identifiable information without your consent.'
      ]
    },
    {
      title: 'Data Security',
      icon: 'bi-shield-lock',
      content: [
        'All data transmission is encrypted using SSL/TLS technology.',
        'We implement industry-standard security measures to protect your data.',
        'Access to personal information is restricted to authorized personnel only.',
        'We regularly review and update our security practices to address new threats.'
      ]
    },
    {
      title: 'Your Rights',
      icon: 'bi-person-check',
      content: [
        'You have the right to access, update, or delete your personal information at any time through your account settings.',
        'You can unsubscribe from marketing emails by clicking the unsubscribe link in any email.',
        'You may request a copy of all personal data we hold about you by contacting us.',
        'You can request permanent deletion of your account and associated data.'
      ]
    }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff', minHeight: '70vh' }}>
      <div style={headerStyle}>
        <div className="container">
          <h2 className="fw-bold mb-1">Privacy Policy</h2>
          <nav style={{ fontSize: '13px' }}>
            <Link to="/" className="text-white text-decoration-none opacity-75">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Privacy Policy</span>
          </nav>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-5">
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>
            At RIVAAH Jewellery, we value your trust and are committed to protecting your privacy.
            This policy outlines how we collect, use, and safeguard your personal information.
          </p>
          <small className="text-muted">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</small>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="mb-5">
            <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
              <i className={`bi ${section.icon} me-2`}></i>
              {idx + 1}. {section.title}
            </h5>
            <ul style={{ fontSize: '14px', lineHeight: '2' }} className="text-muted">
              {section.content.map((item, iIdx) => (
                <li key={iIdx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mb-5">
          <h5 className="fw-bold mb-3" style={{ color: '#0B6F73' }}>
            <i className="bi bi-arrow-repeat me-2"></i>7. Changes to This Policy
          </h5>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
            We will notify you of any significant changes by posting a notice on our website or sending an email.
            We encourage you to review this page periodically.
          </p>
        </div>

        <div className="p-4 rounded text-center" style={{ backgroundColor: '#f0fafa' }}>
          <h6 className="fw-bold mb-2">Questions About Our Privacy Policy?</h6>
          <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
            If you have any concerns or questions, please reach out to us.
          </p>
          <Link to="/contact" className="btn btn-sm text-white px-4" style={{ backgroundColor: '#0B6F73' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
