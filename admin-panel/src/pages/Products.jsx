import { useEffect, useState } from "react";
import { getProducts } from "../services/productApi";
import ProductCards from "../components/ProductCards";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    console.log("🔄 Fetching products...");
    
    try {
      const response = await getProducts();
      console.log("✅ Products fetched:", response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate("/addproduct");
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-dark" style={{ width: "2rem", height: "2rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 fw-semibold text-dark" style={{ fontSize: "14px" }}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 py-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 p-3 bg-white rounded border">
        <div className="mb-2 mb-md-0">
          <h5 className="fw-semibold mb-0" style={{ color: "#000000", fontSize: "16px" }}>
            💎 Products
          </h5>
          <small className="text-muted" style={{ fontSize: "12px" }}>Manage your jewelry collection</small>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-dark btn-sm border"
            onClick={handleRefresh}
            style={{ fontSize: "12px" }}
          >
            🔄 Refresh
          </button>
          
          <button 
            className="btn btn-dark btn-sm"
            onClick={handleAddProduct}
            style={{ fontSize: "12px" }}
          >
            ✨ Add New
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border" style={{ fontSize: "12px" }}>
            Total: <span className="fw-semibold">{products.length}</span>
          </span>
          <span className="badge bg-light text-dark border" style={{ fontSize: "12px" }}>
            Active: <span className="fw-semibold">{products.length}</span>
          </span>
        </div>
      </div>
      
      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 text-center">
            <div className="mb-3" style={{ fontSize: "40px", color: "#E8E8E8" }}>💎</div>
            <h6 className="fw-semibold mb-2" style={{ color: "#000000", fontSize: "15px" }}>
              No products found
            </h6>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              Start building your jewelry collection
            </p>
            <button 
              className="btn btn-dark btn-sm"
              onClick={handleAddProduct}
              style={{ fontSize: "12px" }}
            >
              ✨ Add First Product
            </button>
          </div>
        </div>
      ) : (
        <ProductCards products={products} onRefresh={fetchProducts} />
      )}
    </div>
  );
};

export default Products;