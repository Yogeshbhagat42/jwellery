import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Inject animations once ──────────────────────────────────────────
const styleId = 'checkout-anims';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const s = document.createElement('style');
  s.id = styleId;
  s.textContent = `
    @keyframes fadeInUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideDown{from{opacity:0;max-height:0}to{opacity:1;max-height:800px}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes checkDraw{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes scalePop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
    .ck-card{animation:fadeInUp .5s ease-out both}
    .ck-card:nth-child(2){animation-delay:.12s}
    .ck-item{animation:fadeIn .35s ease-out both}
    .ck-addr:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(11,111,115,.14)!important}
    .ck-pay:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(11,111,115,.13)!important}
    .ck-btn{position:relative;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1)}
    .ck-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(11,111,115,.32)}
    .ck-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 2.5s infinite;background-size:200% 100%}
    .form-control:focus,.form-select:focus{border-color:#0B6F73!important;box-shadow:0 0 0 3px rgba(11,111,115,.1)!important}
  `;
  document.head.appendChild(s);
}

const EMPTY = { fullName:'', phone:'', addressLine1:'', addressLine2:'', city:'', state:'', pincode:'' };

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Chandigarh','Jammu & Kashmir','Ladakh',
  'Puducherry','Andaman & Nicobar','Dadra & Nagar Haveli','Lakshadweep'
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();

  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showPay, setShowPay]             = useState(false);
  const [payStep, setPayStep]             = useState(0);   // 0=form 1=processing 2=done
  const [step, setStep]                   = useState(1);   // 1=address 2=payment 3=review

  // ─── Saved addresses ───────────────────────────────────────────────
  const [addrs, setAddrs]           = useState([]);
  const [selIdx, setSelIdx]         = useState(-1);
  const [showForm, setShowForm]     = useState(false);
  const [addr, setAddr]             = useState({ ...EMPTY });
  const [editIdx, setEditIdx]       = useState(-1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
      if (saved.length) { setAddrs(saved); setSelIdx(0); setAddr(saved[0]); }
      else {
        const old = localStorage.getItem('savedShippingAddress');
        if (old) { const p = JSON.parse(old); if (p.fullName) { setAddrs([p]); setSelIdx(0); setAddr(p); localStorage.setItem('savedAddresses', JSON.stringify([p])); } }
        if (!saved.length && !old) setShowForm(true);
      }
    } catch { setShowForm(true); }
  }, []);

  const persist = (list) => localStorage.setItem('savedAddresses', JSON.stringify(list));
  const handleChange = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });

  const getToken = () => {
    try { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return u?.token || token || localStorage.getItem('token'); }
    catch { return token || localStorage.getItem('token'); }
  };

  const validate = () => {
    if (!addr.fullName?.trim()) return 'Full name is required';
    if (!addr.phone?.trim() || addr.phone.trim().length < 10) return 'Enter a valid 10-digit phone number';
    if (!addr.addressLine1?.trim()) return 'Address is required';
    if (!addr.city?.trim()) return 'City is required';
    if (!addr.state?.trim()) return 'State is required';
    if (!addr.pincode?.trim() || addr.pincode.trim().length < 6) return 'Enter a valid 6-digit pincode';
    return null;
  };

  // ─── Address CRUD ──────────────────────────────────────────────────
  const saveAddr = () => {
    const e = validate(); if (e) { setError(e); return; } setError('');
    let list;
    if (editIdx >= 0) { list = [...addrs]; list[editIdx] = { ...addr }; setSelIdx(editIdx); setEditIdx(-1); }
    else { list = [...addrs, { ...addr }]; setSelIdx(list.length - 1); }
    setAddrs(list); persist(list); setShowForm(false);
  };
  const selectAddr = (i) => { setSelIdx(i); setAddr(addrs[i]); setShowForm(false); setEditIdx(-1); setError(''); };
  const editAddress = (i) => { setAddr({ ...addrs[i] }); setEditIdx(i); setShowForm(true); setSelIdx(i); };
  const deleteAddr = (i) => {
    const list = addrs.filter((_, j) => j !== i); setAddrs(list); persist(list);
    if (selIdx === i) { if (list.length) { setSelIdx(0); setAddr(list[0]); } else { setSelIdx(-1); setAddr({ ...EMPTY }); setShowForm(true); } }
    else if (selIdx > i) setSelIdx(selIdx - 1);
  };

  // ─── Place order (works for both COD & Online) ────────────────────
  const placeOrder = async (method) => {
    const tk = getToken();
    return axios.post(`${API_URL}/api/orders`, {
      shippingAddress: addr,
      paymentMethod: method,
      paymentStatus: method === 'Online' ? 'Paid' : 'Pending',
      items: cartItems.map(it => ({
        productId: it.productId || it._id, name: it.name,
        price: Number(it.price), image: it.image, quantity: Number(it.quantity)
      }))
    }, { headers: { Authorization: `Bearer ${tk}` } });
  };

  const handlePlace = async (e) => {
    e?.preventDefault(); setError('');
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!cartItems?.length) { setError('Your cart is empty'); return; }
    const v = validate(); if (v) { setError(v); setStep(1); return; }
    if (paymentMethod === 'Online') { setShowPay(true); setPayStep(0); return; }
    setLoading(true);
    try {
      const r = await placeOrder('COD');
      if (r.data.success) { await clearCart(); navigate(`/order-success/${r.data.order._id}`); }
    } catch (err) { setError(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  const handleOnlinePay = async () => {
    setPayStep(1);
    setTimeout(async () => {
      try {
        const r = await placeOrder('Online');
        if (r.data.success) { await clearCart(); setPayStep(2); setTimeout(() => { setShowPay(false); navigate(`/order-success/${r.data.order._id}`); }, 2400); }
      } catch (err) { setError(err.response?.data?.message || 'Payment failed'); setShowPay(false); setPayStep(0); }
    }, 2200);
  };

  // ─── Guard screens ─────────────────────────────────────────────────
  if (!isAuthenticated) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f8fffe,#eef7f7)' }}>
      <div className="text-center p-5 bg-white" style={{ borderRadius:24, boxShadow:'0 20px 60px rgba(11,111,115,.1)', animation:'fadeInUp .6s ease-out' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <i className="bi bi-lock-fill text-white" style={{ fontSize:32 }}></i>
        </div>
        <h4 style={{ color:'#0B6F73', fontWeight:700 }}>Login Required</h4>
        <p className="text-muted mb-4">Please login to complete your purchase</p>
        <Link to="/login" className="btn px-5 py-2 text-white" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontWeight:600 }}>
          <i className="bi bi-box-arrow-in-right me-2" />Login Now
        </Link>
      </div>
    </div>
  );

  if (!cartItems?.length) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f8fffe,#eef7f7)' }}>
      <div className="text-center p-5 bg-white" style={{ borderRadius:24, boxShadow:'0 20px 60px rgba(0,0,0,.07)', animation:'fadeInUp .6s ease-out' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <i className="bi bi-cart-x" style={{ fontSize:36, color:'#999' }}></i>
        </div>
        <h4 style={{ color:'#333', fontWeight:700 }}>Your Cart is Empty</h4>
        <p className="text-muted mb-4">Add some beautiful jewellery to get started</p>
        <Link to="/shop" className="btn px-5 py-2 text-white" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontWeight:600 }}>
          <i className="bi bi-gem me-2" />Shop Now
        </Link>
      </div>
    </div>
  );

  // ─── Online Payment Modal ──────────────────────────────────────────
  if (showPay) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f8fffe,#eef7f7)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ maxWidth:480, width:'100%', animation:'fadeInUp .45s ease-out' }}>
        <div className="bg-white overflow-hidden" style={{ borderRadius:24, boxShadow:'0 20px 60px rgba(11,111,115,.14)' }}>
          <div style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', padding:'32px 24px', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,.15)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
              <i className="bi bi-shield-lock-fill text-white" style={{ fontSize:26 }}></i>
            </div>
            <h5 className="text-white mb-1" style={{ fontWeight:700 }}>Secure Payment</h5>
            <p className="mb-0" style={{ color:'rgba(255,255,255,.65)', fontSize:13 }}>256-bit SSL Encrypted</p>
          </div>

          <div className="p-4">
            {payStep === 0 && (
              <div style={{ animation:'fadeIn .3s ease-out' }}>
                <div className="text-center mb-4 p-3" style={{ background:'#f0fafa', borderRadius:14 }}>
                  <p className="text-muted small mb-1">Amount to Pay</p>
                  <h3 className="fw-bold mb-0" style={{ color:'#0B6F73', fontSize:32 }}>{'\u20B9'}{cartTotal.toLocaleString()}</h3>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Card Number</label>
                  <div className="position-relative">
                    <input type="text" className="form-control py-2" defaultValue="4242 4242 4242 4242" style={{ borderRadius:10, paddingLeft:44 }} />
                    <i className="bi bi-credit-card position-absolute" style={{ left:14, top:'50%', transform:'translateY(-50%)', color:'#0B6F73' }}></i>
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Expiry</label>
                    <input type="text" className="form-control py-2" defaultValue="12/28" style={{ borderRadius:10 }} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">CVV</label>
                    <input type="password" className="form-control py-2" defaultValue="123" maxLength={4} style={{ borderRadius:10 }} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">Cardholder Name</label>
                  <input type="text" className="form-control py-2" defaultValue={addr.fullName} style={{ borderRadius:10 }} />
                </div>
                <button className="btn w-100 text-white py-3 fw-semibold ck-btn" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontSize:16 }} onClick={handleOnlinePay}>
                  <i className="bi bi-lock-fill me-2" />Pay {'\u20B9'}{cartTotal.toLocaleString()}
                </button>
                <button className="btn btn-light w-100 mt-2 py-2" style={{ borderRadius:12 }} onClick={() => setShowPay(false)}>Cancel</button>
                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize:11 }}><i className="bi bi-info-circle me-1" />Demo – no real charge</p>
              </div>
            )}
            {payStep === 1 && (
              <div className="text-center py-5" style={{ animation:'fadeIn .3s ease-out' }}>
                <div style={{ width:64, height:64, border:'4px solid #0B6F73', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto 20px' }}></div>
                <h5 style={{ color:'#0B6F73', fontWeight:700 }}>Processing Payment…</h5>
                <p className="text-muted small">Please don't close this page</p>
              </div>
            )}
            {payStep === 2 && (
              <div className="text-center py-5" style={{ animation:'scalePop .5s ease-out' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#28a745,#20c997)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 25px rgba(40,167,69,.3)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" style={{ strokeDasharray:50, animation:'checkDraw .6s ease-out forwards' }} />
                  </svg>
                </div>
                <h5 style={{ color:'#28a745', fontWeight:700 }}>Payment Successful!</h5>
                <p className="text-muted small">Redirecting to confirmation…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Steps bar data ────────────────────────────────────────────────
  const STEPS = [
    { n:1, label:'Address', icon:'bi-geo-alt-fill' },
    { n:2, label:'Payment', icon:'bi-credit-card-2-front-fill' },
    { n:3, label:'Review',  icon:'bi-bag-check-fill' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f8fffe,#eef7f7)' }}>
      <div className="container py-4 py-md-5" style={{ fontFamily:"'Poppins',sans-serif", maxWidth:1200 }}>

        {/* Header */}
        <div className="text-center mb-4" style={{ animation:'fadeIn .5s ease-out' }}>
          <h2 className="mb-1" style={{ color:'#0B6F73', fontWeight:700 }}><i className="bi bi-gem me-2" />Checkout</h2>
          <p className="text-muted mb-0">Complete your jewellery order</p>
        </div>

        {/* Step bar */}
        <div className="d-flex justify-content-center align-items-center gap-2 mb-4 flex-wrap" style={{ animation:'fadeIn .6s ease-out' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="d-flex align-items-center">
              <div onClick={() => { if (s.n <= step) setStep(s.n); }} style={{
                display:'flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:30,
                cursor: s.n <= step ? 'pointer' : 'default',
                background: step === s.n ? 'linear-gradient(135deg,#0B6F73,#0a5c5f)' : step > s.n ? '#d4edda' : '#f0f0f0',
                color: step === s.n ? '#fff' : step > s.n ? '#28a745' : '#aaa',
                fontWeight:600, fontSize:13, transition:'all .3s ease',
                boxShadow: step === s.n ? '0 4px 15px rgba(11,111,115,.22)' : 'none'
              }}>
                {step > s.n ? <i className="bi bi-check-circle-fill" /> : <i className={`bi ${s.icon}`} />}
                <span className="d-none d-sm-inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width:32, height:2, background: step > s.n ? '#28a745' : '#ddd', margin:'0 4px', borderRadius:2, transition:'background .4s' }} />}
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* ═══ LEFT COLUMN ═══════════════════════════════════════ */}
          <div className="col-lg-7">

            {/* ── STEP 1 : Address ────────────────────────────────── */}
            {step === 1 && (
              <div className="ck-card bg-white p-4" style={{ borderRadius:20, boxShadow:'0 8px 30px rgba(0,0,0,.06)' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold" style={{ color:'#0B6F73' }}><i className="bi bi-geo-alt-fill me-2" />Shipping Address</h5>
                  {addrs.length > 0 && (
                    <button className="btn btn-sm px-3 py-1" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', color:'#fff', borderRadius:20, fontSize:12, fontWeight:600 }} onClick={() => { setAddr({ ...EMPTY }); setEditIdx(-1); setShowForm(true); }}>
                      <i className="bi bi-plus me-1" />Add New
                    </button>
                  )}
                </div>

                {/* Saved cards */}
                {addrs.length > 0 && !showForm && addrs.map((a, i) => (
                  <div key={i} className="ck-addr mb-2 p-3 border" style={{
                    borderRadius:14, cursor:'pointer', transition:'all .3s ease',
                    borderColor: selIdx === i ? '#0B6F73' : '#e9ecef',
                    background: selIdx === i ? '#f0fafa' : '#fff',
                    animation:`fadeIn .35s ease-out ${i*.08}s both`
                  }} onClick={() => selectAddr(i)}>
                    <div className="d-flex align-items-start gap-3">
                      <input type="radio" checked={selIdx === i} onChange={() => selectAddr(i)} style={{ width:18, height:18, accentColor:'#0B6F73', marginTop:3 }} />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{a.fullName}</strong>
                            <span className="ms-2 badge" style={{ background:'#0B6F73', fontSize:10, borderRadius:20 }}>{i === 0 ? 'Default' : `#${i+1}`}</span>
                          </div>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm p-1" style={{ color:'#0B6F73' }} onClick={e => { e.stopPropagation(); editAddress(i); }}><i className="bi bi-pencil" style={{ fontSize:13 }} /></button>
                            {addrs.length > 1 && <button className="btn btn-sm p-1 text-danger" onClick={e => { e.stopPropagation(); deleteAddr(i); }}><i className="bi bi-trash" style={{ fontSize:13 }} /></button>}
                          </div>
                        </div>
                        <p className="mb-0 text-muted mt-1" style={{ fontSize:13, lineHeight:1.6 }}>
                          {a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ''}<br />
                          {a.city}, {a.state} – {a.pincode}<br />
                          <i className="bi bi-telephone me-1" style={{ fontSize:11 }} />{a.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Form */}
                {(showForm || addrs.length === 0) && (
                  <div style={{ animation:'slideDown .4s ease-out', overflow:'hidden' }}>
                    {addrs.length > 0 && (
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-semibold text-secondary">{editIdx >= 0 ? 'Edit Address' : 'New Address'}</h6>
                        <button className="btn btn-sm text-muted" onClick={() => { setShowForm(false); if (addrs.length) { setSelIdx(0); setAddr(addrs[0]); } }}><i className="bi bi-x-lg" /></button>
                      </div>
                    )}
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Full Name *</label>
                        <input type="text" name="fullName" className="form-control py-2" value={addr.fullName} onChange={handleChange} placeholder="Enter full name" style={{ borderRadius:10 }} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Phone *</label>
                        <input type="tel" name="phone" className="form-control py-2" value={addr.phone} onChange={handleChange} maxLength={10} placeholder="10-digit mobile" style={{ borderRadius:10 }} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted">Address Line 1 *</label>
                        <input type="text" name="addressLine1" className="form-control py-2" value={addr.addressLine1} onChange={handleChange} placeholder="House no., Building, Street" style={{ borderRadius:10 }} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted">Address Line 2</label>
                        <input type="text" name="addressLine2" className="form-control py-2" value={addr.addressLine2} onChange={handleChange} placeholder="Landmark (optional)" style={{ borderRadius:10 }} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">City *</label>
                        <input type="text" name="city" className="form-control py-2" value={addr.city} onChange={handleChange} style={{ borderRadius:10 }} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">State *</label>
                        <select name="state" className="form-select py-2" value={addr.state} onChange={handleChange} style={{ borderRadius:10 }}>
                          <option value="">Select</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">Pincode *</label>
                        <input type="text" name="pincode" className="form-control py-2" value={addr.pincode} onChange={handleChange} maxLength={6} placeholder="6 digits" style={{ borderRadius:10 }} />
                      </div>
                      <div className="col-12">
                        <button className="btn px-4 py-2 text-white" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:10, fontWeight:600 }} onClick={saveAddr}>
                          <i className="bi bi-check2 me-2" />{editIdx >= 0 ? 'Update' : 'Save Address'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {error && step === 1 && <div className="alert d-flex align-items-center mt-3" style={{ borderRadius:12, border:'none', background:'#fff5f5', color:'#c62828' }}><i className="bi bi-exclamation-triangle-fill me-2" />{error}</div>}

                <button className="btn w-100 text-white py-3 mt-4 fw-semibold ck-btn" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontSize:16 }}
                  disabled={selIdx < 0 && !showForm}
                  onClick={() => { const e = validate(); if (e) { setError(e); return; } setError(''); setStep(2); }}>
                  Continue to Payment <i className="bi bi-arrow-right ms-2" />
                </button>
              </div>
            )}

            {/* ── STEP 2 : Payment ────────────────────────────────── */}
            {step === 2 && (
              <div className="ck-card bg-white p-4" style={{ borderRadius:20, boxShadow:'0 8px 30px rgba(0,0,0,.06)' }}>
                <h5 className="mb-4 fw-bold" style={{ color:'#0B6F73' }}><i className="bi bi-credit-card-2-front-fill me-2" />Payment Method</h5>

                {/* COD */}
                <div className="ck-pay p-4 border mb-3" style={{
                  borderRadius:16, cursor:'pointer', transition:'all .3s ease',
                  borderColor: paymentMethod === 'COD' ? '#0B6F73' : '#e9ecef',
                  borderWidth: paymentMethod === 'COD' ? 2 : 1,
                  background: paymentMethod === 'COD' ? 'linear-gradient(135deg,#f0fafa,#e8f5f5)' : '#fff',
                  animation:'fadeInUp .4s ease-out'
                }} onClick={() => setPaymentMethod('COD')}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width:52, height:52, borderRadius:14, background: paymentMethod === 'COD' ? 'linear-gradient(135deg,#0B6F73,#0a5c5f)' : '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .3s ease' }}>
                      <i className="bi bi-cash-stack" style={{ fontSize:24, color: paymentMethod === 'COD' ? '#fff' : '#999' }} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ fontSize:16 }}>Cash on Delivery</strong>
                        <span className="badge" style={{ background:'#e8f5e9', color:'#2e7d32', fontSize:10, borderRadius:20, padding:'3px 10px' }}>Popular</span>
                      </div>
                      <p className="text-muted small mb-0 mt-1">Pay when your order arrives at your doorstep</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ width:20, height:20, accentColor:'#0B6F73' }} />
                  </div>
                </div>

                {/* Online */}
                <div className="ck-pay p-4 border" style={{
                  borderRadius:16, cursor:'pointer', transition:'all .3s ease',
                  borderColor: paymentMethod === 'Online' ? '#0B6F73' : '#e9ecef',
                  borderWidth: paymentMethod === 'Online' ? 2 : 1,
                  background: paymentMethod === 'Online' ? 'linear-gradient(135deg,#f0fafa,#e8f5f5)' : '#fff',
                  animation:'fadeInUp .5s ease-out'
                }} onClick={() => setPaymentMethod('Online')}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width:52, height:52, borderRadius:14, background: paymentMethod === 'Online' ? 'linear-gradient(135deg,#0B6F73,#0a5c5f)' : '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .3s ease' }}>
                      <i className="bi bi-credit-card-2-front" style={{ fontSize:24, color: paymentMethod === 'Online' ? '#fff' : '#999' }} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ fontSize:16 }}>Online Payment</strong>
                        <span className="badge" style={{ background:'#e3f2fd', color:'#1565c0', fontSize:10, borderRadius:20, padding:'3px 10px' }}>Instant</span>
                      </div>
                      <p className="text-muted small mb-0 mt-1">Credit / Debit Card, UPI, Net Banking</p>
                      <div className="d-flex gap-2 mt-2">
                        {['bi-credit-card','bi-phone','bi-bank'].map((ic,i) => (
                          <span key={i} style={{ width:32, height:22, borderRadius:6, background:'#f0f0f0', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                            <i className={`bi ${ic}`} style={{ fontSize:12, color:'#666' }} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <input type="radio" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} style={{ width:20, height:20, accentColor:'#0B6F73' }} />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-light py-3 px-4" style={{ borderRadius:12, fontWeight:600 }} onClick={() => setStep(1)}><i className="bi bi-arrow-left me-1" />Back</button>
                  <button className="btn flex-grow-1 text-white py-3 fw-semibold ck-btn" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontSize:16 }} onClick={() => setStep(3)}>
                    Review Order <i className="bi bi-arrow-right ms-2" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 : Review ─────────────────────────────────── */}
            {step === 3 && (
              <div className="ck-card bg-white p-4" style={{ borderRadius:20, boxShadow:'0 8px 30px rgba(0,0,0,.06)' }}>
                <h5 className="mb-4 fw-bold" style={{ color:'#0B6F73' }}><i className="bi bi-bag-check-fill me-2" />Review Your Order</h5>

                {/* Address summary */}
                <div className="p-3 mb-3" style={{ background:'#f0fafa', borderRadius:14, border:'1px solid #d0eded' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="small fw-bold mb-1" style={{ color:'#0B6F73' }}><i className="bi bi-geo-alt-fill me-1" />Delivering to</p>
                      <p className="mb-0 fw-semibold">{addr.fullName}</p>
                      <p className="mb-0 text-muted small">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                      <p className="mb-0 text-muted small">{addr.city}, {addr.state} – {addr.pincode}</p>
                      <p className="mb-0 text-muted small"><i className="bi bi-telephone me-1" />{addr.phone}</p>
                    </div>
                    <button className="btn btn-sm" style={{ color:'#0B6F73', fontWeight:600 }} onClick={() => setStep(1)}>Change</button>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="p-3 mb-3" style={{ background:'#fafaf0', borderRadius:14, border:'1px solid #ededd0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${paymentMethod === 'COD' ? 'bi-cash-stack' : 'bi-credit-card-2-front'}`} style={{ color:'#0B6F73', fontSize:20 }} />
                      <div>
                        <p className="mb-0 fw-semibold">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        <p className="mb-0 text-muted" style={{ fontSize:12 }}>{paymentMethod === 'COD' ? 'Pay when delivered' : 'Card / UPI / Net Banking'}</p>
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ color:'#0B6F73', fontWeight:600 }} onClick={() => setStep(2)}>Change</button>
                  </div>
                </div>

                {/* Items */}
                <p className="small fw-bold mb-2" style={{ color:'#0B6F73' }}><i className="bi bi-box-seam me-1" />Items ({cartItems.length})</p>
                {cartItems.map((it, i) => (
                  <div key={it.productId || it._id} className="d-flex align-items-center gap-3 py-2 ck-item" style={{ borderBottom: i < cartItems.length - 1 ? '1px solid #f0f0f0' : 'none', animationDelay:`${i*.07}s` }}>
                    <img src={it.image || '/placeholder.jpg'} alt={it.name} style={{ width:56, height:56, objectFit:'cover', borderRadius:10 }} onError={e => { e.target.src = '/placeholder.jpg'; }} />
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-semibold" style={{ fontSize:14 }}>{it.name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize:12 }}>Qty: {it.quantity}</p>
                    </div>
                    <span className="fw-bold" style={{ color:'#0B6F73' }}>{'\u20B9'}{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}

                {error && <div className="alert d-flex align-items-center mt-3" style={{ borderRadius:12, border:'none', background:'#fff5f5', color:'#c62828' }}><i className="bi bi-exclamation-triangle-fill me-2" />{error}</div>}

                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-light py-3 px-4" style={{ borderRadius:12, fontWeight:600 }} onClick={() => setStep(2)}><i className="bi bi-arrow-left me-1" />Back</button>
                  <button className="btn flex-grow-1 text-white py-3 fw-semibold ck-btn" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontSize:16 }} disabled={loading} onClick={handlePlace}>
                    {loading
                      ? <span><span className="spinner-border spinner-border-sm me-2" />Placing Order…</span>
                      : paymentMethod === 'Online'
                        ? <><i className="bi bi-lock-fill me-2" />Pay {'\u20B9'}{cartTotal.toLocaleString()}</>
                        : <><i className="bi bi-bag-check-fill me-2" />Place Order – {'\u20B9'}{cartTotal.toLocaleString()}</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RIGHT COLUMN — Order Summary ════════════════════════ */}
          <div className="col-lg-5">
            <div className="ck-card bg-white p-4" style={{ borderRadius:20, boxShadow:'0 8px 30px rgba(0,0,0,.06)', position:'sticky', top:20 }}>
              <h5 className="fw-bold mb-3" style={{ color:'#0B6F73' }}><i className="bi bi-bag me-2" />Order Summary</h5>
              <p className="text-muted mb-3" style={{ fontSize:13 }}>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>

              <div style={{ maxHeight:280, overflowY:'auto', paddingRight:4 }}>
                {cartItems.map((it, i) => (
                  <div key={it.productId || it._id} className="d-flex align-items-center gap-3 mb-3 pb-3 ck-item" style={{ borderBottom:'1px solid #f5f5f5', animationDelay:`${i*.08}s` }}>
                    <div className="position-relative">
                      <img src={it.image || '/placeholder.jpg'} alt={it.name} style={{ width:58, height:58, objectFit:'cover', borderRadius:12 }} onError={e => { e.target.src = '/placeholder.jpg'; }} />
                      <span className="position-absolute" style={{ top:-6, right:-6, width:22, height:22, borderRadius:'50%', background:'#0B6F73', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{it.quantity}</span>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-semibold" style={{ fontSize:13 }}>{it.name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize:12 }}>{'\u20B9'}{it.price.toLocaleString()} × {it.quantity}</p>
                    </div>
                    <span className="fw-bold" style={{ color:'#0B6F73', fontSize:14 }}>{'\u20B9'}{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop:'2px dashed #e9ecef', paddingTop:16, marginTop:8 }}>
                <div className="d-flex justify-content-between mb-2"><span className="text-muted">Subtotal</span><span className="fw-semibold">{'\u20B9'}{cartTotal.toLocaleString()}</span></div>
                <div className="d-flex justify-content-between mb-2"><span className="text-muted">Shipping</span><span className="fw-semibold" style={{ color:'#28a745' }}><i className="bi bi-truck me-1" />FREE</span></div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Payment</span>
                  <span className="badge px-3 py-1" style={{ background: paymentMethod === 'COD' ? '#e8f5e9' : '#e3f2fd', color: paymentMethod === 'COD' ? '#2e7d32' : '#1565c0', borderRadius:20, fontSize:11 }}>
                    {paymentMethod === 'COD' ? '💵 COD' : '💳 Online'}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center fw-bold pt-3 mt-2" style={{ borderTop:'2px solid #0B6F73', fontSize:20 }}>
                  <span>Total</span><span style={{ color:'#0B6F73' }}>{'\u20B9'}{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="d-flex justify-content-center gap-4 mt-4 pt-3" style={{ borderTop:'1px solid #f0f0f0' }}>
                {[{icon:'bi-shield-check',t:'Secure'},{icon:'bi-truck',t:'Free Shipping'},{icon:'bi-arrow-repeat',t:'Easy Returns'}].map((b,i) => (
                  <div key={i} className="text-center">
                    <i className={`bi ${b.icon} d-block`} style={{ color:'#0B6F73', fontSize:18 }} />
                    <span style={{ fontSize:10, color:'#999' }}>{b.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
