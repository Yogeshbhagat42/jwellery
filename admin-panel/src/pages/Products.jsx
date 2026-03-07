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
    
    try {
      const response = await getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
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
          <div className="spinner-border" style={{ width: "2rem", height: "2rem", color: '#0B6F73' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-2 mb-md-0">
          <h4 className="fw-bold mb-1" style={{ color: "#1a1a1a" }}>Product Catalog</h4>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            {products.length} {products.length === 1 ? 'item' : 'items'} in your collection
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={handleRefresh}
            style={{ fontSize: "13px", borderRadius: '6px' }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          
          <button 
            className="btn btn-sm px-3"
            onClick={handleAddProduct}
            style={{ fontSize: "13px", borderRadius: '6px', backgroundColor: '#0B6F73', color: '#fff' }}
          >
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </button>
        </div>
      </div>
      
      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-body p-5 text-center">
            <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #0B6F73 0%, #0d8a8f 100%)' }}>
              <i className="bi bi-gem text-white" style={{ fontSize: "32px" }}></i>
            </div>
            <h5 className="fw-semibold mb-2">Start Your Collection</h5>
            <p className="text-muted mb-4" style={{ fontSize: "14px", maxWidth: '400px', margin: '0 auto' }}>
              Add your first jewellery product to begin building your beautiful collection
            </p>
            <button 
              className="btn px-4 py-2"
              onClick={handleAddProduct}
              style={{ fontSize: "14px", borderRadius: '6px', backgroundColor: '#0B6F73', color: '#fff' }}
            >
              <i className="bi bi-plus-lg me-2"></i>Add First Product
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