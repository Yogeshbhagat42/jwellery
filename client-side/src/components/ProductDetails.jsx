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
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: "#0B6F73" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 small">Loading product from database...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">{error || 'Product not found'}</p>
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#0B6F73", color: "#fff" }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <div className="bg-white p-3 shadow-sm mb-4">
            <img
              src={product.mainImage}
              className="img-fluid w-100"
              style={{ maxHeight: "450px", objectFit: "contain" }}
            />
            <div className="d-flex gap-2 mt-3 overflow-auto">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: product.mainImage === img ? "2px solid #0B6F73" : "1px solid #ccc"
                  }}
                  onClick={() => setProduct(prev => ({ ...prev, mainImage: img }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="bg-white p-4 shadow-sm h-100">
            <h4 style={{ color: "#0B6F73" }}>{product.name}</h4>

            <div className="d-flex align-items-center gap-3 my-3">
              <h3 className="fw-bold">{'\u20B9'}{product.price}</h3>
              <span className="text-muted text-decoration-line-through">{'\u20B9'}{product.oldPrice}</span>
              <span className="badge" style={{ backgroundColor: "#0B6F73", color: "#fff" }}>
                {product.discount}% OFF
              </span>
            </div>

            <p className="text-muted">{product.description}</p>

            <div className="mb-3">
              <span className="text-success">&#10003; In Stock ({product.stock} available)</span>
            </div>

            <div className="mb-4">
              <h6 style={{ color: "#0B6F73" }}>Product Details</h6>
              <p className="small">{product.details}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <h6 style={{ color: "#0B6F73" }}>Quantity</h6>
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn"
                  style={{ border: '1px solid #0B6F73', color: '#0B6F73' }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="fs-5">{quantity}</span>
                <button
                  className="btn"
                  style={{ border: '1px solid #0B6F73', color: '#0B6F73' }}
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-3">
              <button
                className="btn flex-grow-1 py-3 rounded-0"
                style={{ backgroundColor: "#0B6F73", color: "#fff" }}
                onClick={addToCart}
                disabled={cartAdding}
              >
                {cartAdding ? 'Adding...' : cartAdded ? 'Added to Cart!' : 'ADD TO CART'}
              </button>
              <button
                className="btn flex-grow-1 py-3 rounded-0"
                style={{
                  border: '1px solid #0B6F73',
                  color: product && isInWishlist(product.id) ? '#fff' : '#0B6F73',
                  backgroundColor: product && isInWishlist(product.id) ? '#0B6F73' : 'transparent'
                }}
                onClick={() => {
                  if (product) {
                    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id);
                  }
                }}
              >
                <i className={`bi ${product && isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                {product && isInWishlist(product.id) ? 'WISHLISTED' : 'WISHLIST'}
              </button>
            </div>

            <div className="mt-4">
              <Link to="/shop" className="text-decoration-none" style={{ color: "#0B6F73" }}>
                &larr; Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
