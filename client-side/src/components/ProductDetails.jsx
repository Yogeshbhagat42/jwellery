import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cartAdding, setCartAdding] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);

      if (response.data) {
        const productData = response.data.product;
        setProduct({
          id: productData._id,
          name: productData.name,
          price: productData.price,
          images: productData.images,
          mainImage: productData.images[0],
          description: productData.description,
          details: `Material: ${productData.material}, Plating: ${productData.plating}, Weight: ${productData.weight}, Size: ${productData.dimensions.length} x ${productData.dimensions.width}`,
          category: productData.category,
          stock: 10,
          oldPrice: productData.price * 2,
          discount: 50
        });
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const allProducts = response.data;

      if (product && product.category) {
        const related = allProducts
          .filter(p =>
            (p._id || p.id) !== id &&
            p.category === product.category
          )
          .slice(0, 4)
          .map(p => ({
            id: p._id || p.id,
            name: p.name,
            image: p.image || p.images?.[0] || '/placeholder.jpg',
            price: p.price
          }));
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const addToCart = async () => {
    try {
      setCartAdding(true);
      const result = await addToCartContext(
        { _id: product.id, name: product.name, price: product.price, images: product.images },
        quantity
      );
      setCartAdding(false);
      if (result && result.success) {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      setCartAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center" style={{ backgroundColor: '#fff', minHeight: '60vh' }}>
        <div className="spinner-border" style={{ color: "#0B6F73" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-5 text-center" style={{ backgroundColor: '#fff', minHeight: '60vh' }}>
        <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
             style={{ width: '80px', height: '80px', backgroundColor: '#f8f9fa' }}>
          <i className="bi bi-exclamation-circle" style={{ fontSize: '32px', color: '#dc3545' }}></i>
        </div>
        <h5 className="fw-semibold mb-2">Product Not Found</h5>
        <p className="text-muted mb-3" style={{ fontSize: '14px' }}>{error || 'The product you are looking for does not exist.'}</p>
        <button
          className="btn px-4"
          style={{ backgroundColor: "#0B6F73", color: "#fff" }}
          onClick={() => navigate('/shop')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Product Image */}
          <div className="col-md-6">
            <div className="p-3" style={{ backgroundColor: '#fafafa' }}>
              <img
                src={product.mainImage}
                className="img-fluid w-100"
                alt={product.name}
                style={{ maxHeight: "450px", objectFit: "contain" }}
              />
              <div className="d-flex gap-2 mt-3 overflow-auto">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border: product.mainImage === img ? "3px solid #0B6F73" : "1px solid #ddd",
                      transition: 'border 0.2s ease'
                    }}
                    onClick={() => setProduct(prev => ({ ...prev, mainImage: img }))}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">
            <div className="h-100">
              <p className="text-muted mb-1" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.category}
              </p>
              <h4 className="fw-bold mb-3" style={{ color: "#1a1a1a" }}>{product.name}</h4>

              <div className="d-flex align-items-center gap-3 mb-4">
                <h3 className="fw-bold mb-0" style={{ color: '#0B6F73' }}>₹{product.price}</h3>
                <span className="text-muted text-decoration-line-through" style={{ fontSize: '18px' }}>₹{product.oldPrice}</span>
                <span className="badge px-2 py-1" style={{ backgroundColor: "#0B6F73", color: "#fff", fontSize: '11px' }}>
                  {product.discount}% OFF
                </span>
              </div>

              <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.7' }}>{product.description}</p>

              <div className="d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span style={{ fontSize: '14px', color: '#28a745' }}>In Stock ({product.stock} available)</span>
              </div>

              <div className="mb-4 p-3" style={{ backgroundColor: '#fafafa' }}>
                <h6 className="fw-semibold mb-2" style={{ fontSize: '13px', color: "#0B6F73" }}>Product Details</h6>
                <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>{product.details}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-2" style={{ fontSize: '13px' }}>Quantity</h6>
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', border: '1px solid #0B6F73', color: '#0B6F73' }}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="fw-semibold" style={{ fontSize: '18px', width: '40px', textAlign: 'center' }}>{quantity}</span>
                  <button
                    className="btn d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', border: '1px solid #0B6F73', color: '#0B6F73' }}
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn flex-grow-1 py-3 rounded-0 fw-semibold"
                  style={{ 
                    backgroundColor: cartAdded ? "#28a745" : "#0B6F73", 
                    color: "#fff",
                    fontSize: '14px',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={addToCart}
                  disabled={cartAdding}
                >
                  {cartAdding ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : cartAdded ? (
                    <><i className="bi bi-check me-2"></i>Added to Cart!</>
                  ) : (
                    <><i className="bi bi-bag me-2"></i>ADD TO CART</>
                  )}
                </button>
                <button
                  className="btn py-3 rounded-0 px-4"
                  style={{
                    border: '2px solid #0B6F73',
                    color: product && isInWishlist(product.id) ? '#fff' : '#0B6F73',
                    backgroundColor: product && isInWishlist(product.id) ? '#0B6F73' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    if (product) {
                      isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id);
                    }
                  }}
                >
                  <i className={`bi ${product && isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'}`} style={{ fontSize: '18px' }}></i>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="d-flex gap-4 py-3" style={{ borderTop: '1px solid #eee' }}>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-truck" style={{ color: '#0B6F73' }}></i>
                  <span style={{ fontSize: '12px' }}>Free Shipping</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-repeat" style={{ color: '#0B6F73' }}></i>
                  <span style={{ fontSize: '12px' }}>7 Day Returns</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check" style={{ color: '#0B6F73' }}></i>
                  <span style={{ fontSize: '12px' }}>Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
