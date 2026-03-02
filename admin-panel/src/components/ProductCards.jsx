import { useState, useEffect } from "react";
import { deleteProduct } from "../services/productApi";
import { useNavigate } from "react-router-dom";

const ProductCards = ({ products = [], onRefresh }) => {
  const navigate = useNavigate();
  const [viewProduct, setViewProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (viewProduct?.images?.length > 0) {
      setMainImage(viewProduct.images[0]);
    }
  }, [viewProduct]);

  const handleEdit = (productId) => {
    console.log("Editing product ID:", productId);
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
        alert("✅ Product deleted successfully!");
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("❌ Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {products.map((product) => (
          <div className="col" key={product._id}>
            <div
              className="card h-100 rounded-lg overflow-hidden border-0"
              style={{
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = "#E8E8E8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.borderColor = "#E8E8E8";
              }}
            >
              {/* Product Image */}
              <div className="position-relative" style={{ height: "180px", overflow: "hidden" }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].startsWith('/') 
                      ? `http://localhost:5000${product.images[0]}` 
                      : product.images[0]
                    }
                    alt={product.name}
                    className="card-img-top h-100 w-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div 
                    className="h-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "#F8F9FA"
                    }}
                  >
                    <span className="display-6" style={{ color: "#E8E8E8" }}>
                      💎
                    </span>
                  </div>
                )}
                <div 
                  className="position-absolute top-0 end-0 m-3"
                >
                  <span 
                    className="badge rounded-pill px-3 py-1 fw-semibold"
                    style={{
                      background: "rgba(0, 0, 0, 0.85)",
                      color: "#FFFFFF",
                      fontSize: "12px"
                    }}
                  >
                    ₹{product.price}
                  </span>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="card-body p-3">
                <h6 
                  className="card-title fw-semibold mb-2"
                  style={{ 
                    color: "#000000",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    minHeight: "42px"
                  }}
                >
                  {product.name}
                </h6>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span 
                      className="px-2 py-1 rounded-sm"
                      style={{
                        background: "#E8E8E8",
                        color: "#666666",
                        fontSize: "11px",
                        fontWeight: "500"
                      }}
                    >
                      {product.category}
                    </span>
                    <span 
                      className="px-2 py-1 rounded-sm"
                      style={{
                        background: "#F8F9FA",
                        color: "#666666",
                        fontSize: "11px",
                        fontWeight: "500"
                      }}
                    >
                      SKU: {product.sku}
                    </span>
                  </div>
                  
                  {product.material && (
                    <p className="mb-0">
                      <small className="text-muted" style={{ fontSize: "12px" }}>
                        <span className="fw-medium">Material:</span> {product.material}
                      </small>
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm flex-grow-1 px-3 py-2 rounded-sm fw-medium"
                    onClick={() => setViewProduct(product)}
                    style={{
                      background: "#FFFFFF",
                      color: "#000000",
                      border: "1px solid #E8E8E8",
                      transition: "all 0.2s ease",
                      fontSize: "12px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#F8F9FA";
                      e.target.style.borderColor = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#FFFFFF";
                      e.target.style.borderColor = "#E8E8E8";
                    }}
                  >
                    👁️ View
                  </button>
                  
                  <button
                    className="btn btn-sm px-3 py-2 rounded-sm fw-medium"
                    onClick={() => handleEdit(product._id)}
                    style={{
                      background: "#FFFFFF",
                      color: "#000000",
                      border: "1px solid #E8E8E8",
                      transition: "all 0.2s ease",
                      fontSize: "12px",
                      minWidth: "60px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#000000";
                      e.target.style.color = "#FFFFFF";
                      e.target.style.borderColor = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#FFFFFF";
                      e.target.style.color = "#000000";
                      e.target.style.borderColor = "#E8E8E8";
                    }}
                  >
                    Edit
                  </button>
                  
                  <button
                    className="btn btn-sm px-3 py-2 rounded-sm fw-medium"
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                    style={{
                      background: deletingId === product._id ? "#E8E8E8" : "#FFFFFF",
                      color: deletingId === product._id ? "#999999" : "#000000",
                      border: "1px solid #E8E8E8",
                      transition: "all 0.2s ease",
                      fontSize: "12px",
                      minWidth: "70px"
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== product._id) {
                        e.target.style.background = "#000000";
                        e.target.style.color = "#FFFFFF";
                        e.target.style.borderColor = "#000000";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingId !== product._id) {
                        e.target.style.background = "#FFFFFF";
                        e.target.style.color = "#000000";
                        e.target.style.borderColor = "#E8E8E8";
                      }
                    }}
                  >
                    {deletingId === product._id ? (
                      <span className="spinner-border spinner-border-sm" style={{ color: "#999999" }}></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Product Modal */}
      {viewProduct && (
        <div 
          className="modal fade show d-block"
          style={{ 
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setViewProduct(null)}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="modal-content rounded-lg overflow-hidden border-0"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              {/* Modal Header */}
              <div 
                className="modal-header p-4"
                style={{
                  background: "#FFFFFF",
                  borderBottom: "1px solid #E8E8E8"
                }}
              >
                <h5 
                  className="modal-title fw-semibold mb-0"
                  style={{ 
                    color: "#000000",
                    fontSize: "16px"
                  }}
                >
                  {viewProduct.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewProduct(null)}
                  style={{
                    backgroundSize: "0.8rem"
                  }}
                ></button>
              </div>
              
              {/* Modal Body */}
              <div className="modal-body p-4">
                <div className="row">
                  {/* Image Section */}
                  <div className="col-md-6 mb-4 mb-md-0">
                    {/* Main Image Display */}
                    <div 
                      className="rounded-lg overflow-hidden border mb-3"
                      style={{ 
                        borderColor: "#E8E8E8",
                        height: "250px",
                        background: "#F8F9FA"
                      }}
                    >
                      {viewProduct.images && viewProduct.images.length > 0 ? (
                        <img
                          src={mainImage.startsWith('/') 
                            ? `http://localhost:5000${mainImage}` 
                            : mainImage
                          }
                          alt={viewProduct.name}
                          className="img-fluid h-100 w-100"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div 
                          className="h-100 d-flex align-items-center justify-content-center"
                          style={{
                            background: "#F8F9FA"
                          }}
                        >
                          <span 
                            className="display-3"
                            style={{ color: "#E8E8E8" }}
                          >
                            💎
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Image Thumbnails */}
                    {viewProduct.images && viewProduct.images.length > 1 && (
                      <div className="d-flex gap-2 overflow-auto py-2">
                        {viewProduct.images.map((image, index) => (
                          <div
                            key={index}
                            className={`rounded-sm overflow-hidden border cursor-pointer`}
                            style={{
                              width: "50px",
                              height: "50px",
                              flexShrink: 0,
                              borderColor: mainImage === image ? "#000000" : "#E8E8E8",
                              borderWidth: mainImage === image ? "2px" : "1px",
                              transition: "all 0.2s ease",
                              background: "#FFFFFF"
                            }}
                            onClick={() => setMainImage(image)}
                            onMouseEnter={(e) => {
                              if (mainImage !== image) {
                                e.currentTarget.style.borderColor = "#000000";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (mainImage !== image) {
                                e.currentTarget.style.borderColor = "#E8E8E8";
                              }
                            }}
                          >
                            <img
                              src={image.startsWith('/') 
                                ? `http://localhost:5000${image}` 
                                : image
                              }
                              alt={`${viewProduct.name} view ${index + 1}`}
                              className="h-100 w-100"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Details Section */}
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6 
                        className="fw-semibold mb-3"
                        style={{ 
                          color: "#000000",
                          fontSize: "14px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}
                      >
                        Product Details
                      </h6>
                      
                      <div className="row g-2">
                        <div className="col-6">
                          <div 
                            className="p-3 rounded-sm"
                            style={{
                              background: "#F8F9FA",
                              border: "1px solid #E8E8E8"
                            }}
                          >
                            <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>SKU</small>
                            <span className="fw-semibold" style={{ fontSize: "13px" }}>{viewProduct.sku}</span>
                          </div>
                        </div>
                        
                        <div className="col-6">
                          <div 
                            className="p-3 rounded-sm"
                            style={{
                              background: "#F8F9FA",
                              border: "1px solid #E8E8E8"
                            }}
                          >
                            <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>Category</small>
                            <span className="fw-semibold" style={{ fontSize: "13px" }}>{viewProduct.category}</span>
                          </div>
                        </div>
                        
                        <div className="col-12 mt-2">
                          <div 
                            className="p-3 rounded-sm"
                            style={{
                              background: "#000000",
                              border: "1px solid #000000"
                            }}
                          >
                            <small className="text-white-50 d-block mb-1" style={{ fontSize: "11px" }}>Price</small>
                            <span 
                              className="fw-semibold"
                              style={{ color: "#FFFFFF", fontSize: "18px" }}
                            >
                              ₹{viewProduct.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h6 
                        className="fw-semibold mb-3"
                        style={{ 
                          color: "#000000",
                          fontSize: "14px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}
                      >
                        Specifications
                      </h6>
                      
                      <div className="row g-2 mb-3">
                        {viewProduct.material && (
                          <div className="col-6">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>Material</small>
                            <p className="fw-medium mb-0" style={{ fontSize: "13px" }}>{viewProduct.material}</p>
                          </div>
                        )}
                        
                        {viewProduct.plating && (
                          <div className="col-6">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>Plating</small>
                            <p className="fw-medium mb-0" style={{ fontSize: "13px" }}>{viewProduct.plating}</p>
                          </div>
                        )}
                        
                        {viewProduct.weight && (
                          <div className="col-6">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>Weight</small>
                            <p className="fw-medium mb-0" style={{ fontSize: "13px" }}>{viewProduct.weight}</p>
                          </div>
                        )}
                        
                        {viewProduct.dimensions && (
                          <div className="col-6">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>Dimensions</small>
                            <p className="fw-medium mb-0" style={{ fontSize: "13px" }}>
                              {viewProduct.dimensions.length}cm × {viewProduct.dimensions.width}cm
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {viewProduct.description && (
                        <div className="mt-3">
                          <small className="text-muted d-block mb-2" style={{ fontSize: "11px" }}>Description</small>
                          <p 
                            className="mt-1 p-3 rounded-sm"
                            style={{
                              background: "#F8F9FA",
                              border: "1px solid #E8E8E8",
                              fontSize: "13px",
                              lineHeight: "1.5"
                            }}
                          >
                            {viewProduct.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="modal-footer p-4 border-top-0">
                <button
                  className="btn btn-sm px-4 py-2 rounded-sm fw-medium"
                  onClick={() => setViewProduct(null)}
                  style={{
                    background: "#FFFFFF",
                    color: "#000000",
                    border: "1px solid #E8E8E8",
                    transition: "all 0.2s ease",
                    fontSize: "13px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#F8F9FA";
                    e.target.style.borderColor = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#FFFFFF";
                    e.target.style.borderColor = "#E8E8E8";
                  }}
                >
                  Close
                </button>
                <button
                  className="btn btn-sm px-4 py-2 rounded-sm fw-medium"
                  onClick={() => {
                    handleEdit(viewProduct._id);
                    setViewProduct(null);
                  }}
                  style={{
                    background: "#000000",
                    color: "#FFFFFF",
                    border: "1px solid #000000",
                    transition: "all 0.2s ease",
                    fontSize: "13px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#333333";
                    e.target.style.borderColor = "#333333";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#000000";
                    e.target.style.borderColor = "#000000";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCards;