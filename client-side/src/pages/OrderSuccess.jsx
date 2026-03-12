import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => { if (orderId) fetchOrder(); }, [orderId]);

  const getAuthToken = () => {
    try { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return u?.token || token || localStorage.getItem('token'); }
    catch { return token || localStorage.getItem('token'); }
  };

  const fetchOrder = async () => {
    try {
      const r = await axios.get(`${API_URL}/api/orders/${orderId}`, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
      if (r.data.success) setOrder(r.data.order);
    } catch (e) { console.error('Fetch order error:', e); }
    finally { setLoading(false); }
  };

  const handlePrint = () => {
    const html = invoiceRef.current.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Invoice - ${order?._id?.slice(-8).toUpperCase()}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>body{font-family:'Poppins',Arial,sans-serif;padding:20px}@media print{.no-print{display:none!important}body{padding:0}}</style>
    </head><body>${html}<script>setTimeout(()=>{window.print();window.close()},500)<\/script></body></html>`);
    w.document.close();
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const inv = () => order ? 'INV-' + order._id.slice(-8).toUpperCase() : '';

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f8fffe,#eef7f7)' }}>
      <div className="text-center">
        <div className="spinner-border" style={{ color:'#0B6F73', width:'3rem', height:'3rem' }} role="status"><span className="visually-hidden">Loading...</span></div>
        <p className="mt-3 text-muted">Loading your order...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f8fffe,#eef7f7)', fontFamily:"'Poppins',sans-serif" }}>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scalePop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
        @keyframes checkDraw{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(80px) rotate(360deg);opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .os-card{animation:fadeInUp .6s ease-out}
        .os-btn{transition:all .3s ease}
        .os-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(11,111,115,.25)}
      `}</style>

      <div className="container py-5">
        {!showInvoice && (
          <div className="os-card text-center bg-white p-4 p-md-5 mx-auto" style={{ maxWidth:650, borderRadius:24, boxShadow:'0 20px 60px rgba(0,0,0,.07)' }}>

            {/* Confetti dots */}
            <div className="position-relative" style={{ height:0 }}>
              {['#0B6F73','#ffc107','#e91e63','#4caf50','#2196f3','#ff5722','#9c27b0','#00bcd4'].map((c,i) => (
                <div key={i} style={{
                  position:'absolute', width:8, height:8, borderRadius:'50%', background:c,
                  left: `${10 + i*12}%`, top: -10,
                  animation:`confetti 1.5s ease-out ${i*.12}s both`
                }} />
              ))}
            </div>

            {/* Success icon */}
            <div style={{ animation:'scalePop .6s ease-out' }}>
              <div style={{ width:100, height:100, borderRadius:'50%', background:'linear-gradient(135deg,#28a745,#20c997)', display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow:'0 12px 35px rgba(40,167,69,.3)' }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" style={{ strokeDasharray:50, animation:'checkDraw .7s ease-out .3s forwards', strokeDashoffset:50 }} />
                </svg>
              </div>
            </div>

            <h3 className="mt-4 fw-bold" style={{ color:'#0B6F73' }}>Order Placed Successfully!</h3>
            <p className="text-muted mt-2" style={{ fontSize:15 }}>
              {order?.paymentMethod === 'Online'
                ? 'Payment received! Your order is confirmed.'
                : 'Your order is confirmed. Pay on delivery.'}
            </p>

            {/* Order ID */}
            {orderId && (
              <div className="mx-auto mt-3 mb-4 p-3" style={{ background:'#f0fafa', borderRadius:14, maxWidth:400, border:'1px dashed #0B6F73' }}>
                <p className="mb-0 small text-muted">Order ID</p>
                <p className="mb-0 fw-bold" style={{ color:'#0B6F73', fontSize:14, wordBreak:'break-all' }}>{orderId}</p>
              </div>
            )}

            {/* Quick stats */}
            {order && (
              <div className="row g-3 mb-4 mx-auto" style={{ maxWidth:450 }}>
                {[
                  { label:'Total', value:`₹${order.totalAmount?.toLocaleString()}`, icon:'bi-wallet2', color:'#0B6F73' },
                  { label:'Payment', value: order.paymentMethod === 'Online' ? 'Paid Online' : 'COD', icon: order.paymentMethod === 'Online' ? 'bi-credit-card-2-front' : 'bi-cash-stack', color: order.paymentMethod === 'Online' ? '#28a745' : '#ff9800' },
                  { label:'Items', value:`${order.items?.length || 0} items`, icon:'bi-box-seam', color:'#2196f3' },
                  { label:'Status', value: order.orderStatus, icon:'bi-clock-history', color:'#9c27b0' }
                ].map((s,i) => (
                  <div key={i} className="col-6">
                    <div className="p-3" style={{ background:'#fafafa', borderRadius:14, animation:`fadeInUp .5s ease-out ${.2+i*.1}s both` }}>
                      <i className={`bi ${s.icon} d-block mb-1`} style={{ color:s.color, fontSize:20 }} />
                      <p className="mb-0 text-muted" style={{ fontSize:11 }}>{s.label}</p>
                      <p className="mb-0 fw-bold" style={{ fontSize:14, color:s.color }}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button onClick={() => setShowInvoice(true)} className="btn text-white px-4 py-2 os-btn" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontWeight:600 }}>
                <i className="bi bi-receipt me-2" />View Invoice
              </button>
              <Link to="/account" className="btn px-4 py-2 os-btn" style={{ border:'2px solid #0B6F73', color:'#0B6F73', borderRadius:12, fontWeight:600 }}>
                <i className="bi bi-bag me-2" />My Orders
              </Link>
              <Link to="/shop" className="btn btn-light px-4 py-2 os-btn" style={{ borderRadius:12, fontWeight:600 }}>
                <i className="bi bi-arrow-right me-2" />Continue Shopping
              </Link>
            </div>

            {/* Delivery info */}
            {order && (
              <div className="mt-4 pt-3" style={{ borderTop:'1px solid #f0f0f0' }}>
                <p className="text-muted mb-0" style={{ fontSize:12 }}>
                  <i className="bi bi-truck me-1" />Expected delivery in 5-7 business days
                </p>
                <p className="text-muted mb-0" style={{ fontSize:12 }}>
                  <i className="bi bi-geo-alt me-1" />{order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══ Invoice ═════════════════════════════════════════════ */}
        {showInvoice && order && (
          <div style={{ animation:'fadeInUp .5s ease-out' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-light px-4 py-2" style={{ borderRadius:12, fontWeight:600 }} onClick={() => setShowInvoice(false)}>
                <i className="bi bi-arrow-left me-2" />Back
              </button>
              <button className="btn text-white px-4 py-2 os-btn" style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', borderRadius:12, fontWeight:600 }} onClick={handlePrint}>
                <i className="bi bi-printer me-2" />Print Invoice
              </button>
            </div>

            <div ref={invoiceRef} className="bg-white p-4 p-md-5 mx-auto" style={{ maxWidth:800, borderRadius:20, boxShadow:'0 10px 40px rgba(0,0,0,.06)' }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-4 pb-3" style={{ borderBottom:'2px solid #0B6F73' }}>
                <div>
                  <h3 className="mb-1 fw-bold" style={{ color:'#0B6F73' }}>💎 JEWELLERY STORE</h3>
                  <p className="text-muted small mb-0">Premium Jewelry Collection</p>
                  <p className="text-muted small mb-0">support@jewellerystore.com | +91 98765 43210</p>
                </div>
                <div className="text-end">
                  <h4 className="fw-bold mb-1" style={{ color:'#0B6F73' }}>INVOICE</h4>
                  <p className="small mb-0"><strong>No:</strong> {inv()}</p>
                  <p className="small mb-0"><strong>Date:</strong> {fmt(order.createdAt)}</p>
                  <span className={`badge ${order.paymentMethod === 'Online' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {order.paymentMethod === 'Online' ? 'PAID' : 'COD'}
                  </span>
                </div>
              </div>

              {/* Customer info */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h6 className="fw-bold" style={{ color:'#0B6F73' }}>Bill To:</h6>
                  <p className="mb-0 fw-semibold">{order.shippingAddress?.fullName}</p>
                  <p className="mb-0 text-muted small">{order.shippingAddress?.phone}</p>
                  <p className="mb-0 text-muted small">{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && <p className="mb-0 text-muted small">{order.shippingAddress.addressLine2}</p>}
                  <p className="mb-0 text-muted small">{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold" style={{ color:'#0B6F73' }}>Order Details:</h6>
                  <p className="mb-0 small"><strong>Order:</strong> #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mb-0 small"><strong>Payment:</strong> {order.paymentMethod === 'Online' ? 'Online (Paid)' : 'Cash on Delivery'}</p>
                  <p className="mb-0 small"><strong>Status:</strong> {order.orderStatus}</p>
                  <p className="mb-0 small"><strong>Date:</strong> {fmt(order.createdAt)}</p>
                </div>
              </div>

              {/* Items table */}
              <div className="table-responsive mb-4">
                <table className="table table-bordered mb-0" style={{ borderRadius:10, overflow:'hidden' }}>
                  <thead style={{ background:'linear-gradient(135deg,#0B6F73,#0a5c5f)', color:'#fff' }}>
                    <tr>
                      <th style={{ fontSize:13 }}>#</th>
                      <th style={{ fontSize:13 }}>Item</th>
                      <th style={{ fontSize:13 }} className="text-center">Qty</th>
                      <th style={{ fontSize:13 }} className="text-end">Price</th>
                      <th style={{ fontSize:13 }} className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((it, i) => (
                      <tr key={i}>
                        <td style={{ fontSize:13 }}>{i+1}</td>
                        <td style={{ fontSize:13 }}>
                          <div className="d-flex align-items-center gap-2">
                            {it.image && <img src={it.image} alt={it.name} style={{ width:35, height:35, objectFit:'cover', borderRadius:6 }} onError={e => { e.target.style.display='none'; }} />}
                            <span>{it.name}</span>
                          </div>
                        </td>
                        <td className="text-center" style={{ fontSize:13 }}>{it.quantity}</td>
                        <td className="text-end" style={{ fontSize:13 }}>{'\u20B9'}{it.price.toLocaleString('en-IN')}</td>
                        <td className="text-end fw-semibold" style={{ fontSize:13 }}>{'\u20B9'}{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="row justify-content-end">
                <div className="col-md-5">
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted">Subtotal</span><span>{'\u20B9'}{order.totalAmount.toLocaleString('en-IN')}</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted">Shipping</span><span className="text-success">Free</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted">Tax</span><span>Included</span></div>
                    <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2 mt-2">
                      <span>Grand Total</span>
                      <span style={{ color:'#0B6F73' }}>{'\u20B9'}{order.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top text-center">
                <p className="text-muted small mb-1">Thank you for shopping with Jewellery Store!</p>
                <p className="text-muted small mb-0">support@jewellerystore.com | +91 98765 43210</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
