  import { useEffect, useState } from "react";
  import { addProduct, getProductById, updateProduct } from "../services/productApi";
  import { useParams, useNavigate } from "react-router-dom";

  const AddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    console.log("📌 AddProduct Page Loaded");
    console.log("Product ID from URL:", id);
    console.log("Edit Mode:", id ? "YES" : "NO");

    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [form, setForm] = useState({
      name: "",
      sku: "",
      category: "",
      price: "",
      description: "",
      material: "",
      plating: "",
      weight: "",
      dimensions: { length: "", width: "" },
      images: [],
      oldImages: [],
    });

    // ✅ FETCH PRODUCT DATA WHEN EDITING
    useEffect(() => {
      if (id) {
        fetchProductData();
      }
    }, [id]);

    const fetchProductData = async () => {
      setLoading(true);
      console.log("=== FETCHING PRODUCT DATA ===");
      console.log("ID to fetch:", id);
      
      try {
        console.log("📞 Calling getProductById API...");
        const response = await getProductById(id);
        console.log("📦 API RESPONSE:", response);
        console.log("📦 Response type:", typeof response);
        console.log("📦 Response keys:", Object.keys(response));
        
        // Check what we actually received
        if (response && typeof response === 'object') {
          console.log("📋 Response properties:");
          for (let key in response) {
            console.log(`  ${key}:`, response[key]);
          }
        }
        
        // Try different ways to extract data
        let productData = null;
        
        // Option 1: Direct response
        if (response && response._id) {
          productData = response;
          console.log("✅ Found product directly in response");
        }
        // Option 2: Nested in product property
        else if (response && response.product && response.product._id) {
          productData = response.product;
          console.log("✅ Found product in response.product");
        }
        // Option 3: Nested in data property
        else if (response && response.data && response.data._id) {
          productData = response.data;
          console.log("✅ Found product in response.data");
        }
        else {
          console.log("❌ Cannot find product in response structure");
          console.log("Full response:", JSON.stringify(response, null, 2));
          throw new Error("Invalid response structure");
        }
        
        console.log("🎯 FINAL PRODUCT DATA TO SET:", productData);
        
        // Set the form
        setForm({
          name: productData.name || "",
          sku: productData.sku || "",
          category: productData.category || "",
          price: productData.price || "",
          description: productData.description || "",
          material: productData.material || "",
          plating: productData.plating || "",
          weight: productData.weight || "",
          dimensions: {
            length: productData.dimensions?.length || "",
            width: productData.dimensions?.width || ""
          },
          images: productData.images || [],
          oldImages: productData.images || []
        });
        
        console.log("✅ FORM SET SUCCESSFULLY");
        
        // Set image previews
        if (productData.images && productData.images.length > 0) {
          console.log("🖼️ Images found:", productData.images);
          const previews = productData.images.map(img => {
            if (img.startsWith('http')) return img;
            if (img.startsWith('/')) return `http://localhost:5000${img}`;
            return `http://localhost:5000/uploads/${img}`;
          });
          setImagePreviews(previews);
          console.log("🖼️ Image previews set:", previews);
        } else {
          console.log("🖼️ No images found");
          setImagePreviews([]);
        }
        
      } catch (error) {
        console.error("❌ FETCH ERROR:", error);
        console.error("Error stack:", error.stack);
        alert(`Error loading product: ${error.message}`);
      } finally {
        setLoading(false);
        console.log("=== FETCH COMPLETE ===");
      }
    };

    // ✅ HANDLE FORM INPUT CHANGES
    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "length" || name === "width") {
        setForm({
          ...form,
          dimensions: { ...form.dimensions, [name]: value },
        });
      } else {
        setForm({ ...form, [name]: value });
      }
    };

    // ✅ HANDLE IMAGE UPLOAD
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      
      if (files.length > 0) {
        // Keep File objects, not URLs
        setForm({ 
          ...form, 
          images: [...form.images, ...files] 
        });
      }
    };

    // ✅ REMOVE IMAGE
    const removeImage = (index) => {
      const previewToRemove = imagePreviews[index];

      setImagePreviews(prev => prev.filter((_, i) => i !== index));

      // If blob → new image
      if (previewToRemove.startsWith("blob:")) {
        setForm(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index - prev.oldImages.length)
        }));
      }
      // If server image → old image
      else {
        setForm(prev => ({
          ...prev,
          oldImages: prev.oldImages.filter((_, i) => i !== index)
        }));
      }
    };

    // ✅ SUBMIT FORM
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validation
      if (!form.name || !form.sku || !form.category || !form.price) {
        alert("Please fill required fields: Name, SKU, Category, Price");
        return;
      }
      
      setLoading(true);
      
      try {
        console.log("📤 Submitting form for:", id ? "EDIT" : "ADD");
        console.log("📦 Form data:", form);
        
        if (id) {
          // EDIT MODE - Update existing product
          console.log("✏️ Updating product ID:", id);
          await updateProduct(id, form);
          alert("✅ Product updated successfully!");
        } else {
          // ADD MODE - Create new product
          console.log("➕ Adding new product");
          await addProduct(form);
          alert("✅ Product added successfully!");
          
          // Reset form only for add mode
          setForm({
            name: "",
            sku: "",
            category: "",
            price: "",
            description: "",
            material: "",
            plating: "",
            weight: "",
            dimensions: { length: "", width: "" },
            images: [],
          });
          setImagePreviews([]);
        }
        
        // Navigate back to products page
        navigate("/products");
        
      } catch (error) {
        console.error("❌ Error saving product:", error);
        alert(`Error: ${error.response?.data?.message || error.message || "Failed to save product"}`);
      } finally {
        setLoading(false);
      }
    };

    // ✅ LOADING STATE
    if (loading && id) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="text-center">
            <div 
              className="spinner-border" 
              role="status"
              style={{ 
                width: "3rem", 
                height: "3rem",
                color: "#000000" 
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fw-medium" style={{ color: "#000000" }}>
              Loading product details...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="border-0 rounded-lg overflow-hidden">
              {/* Header */}
              <div 
                className="p-4"
                style={{
                  background: "#FFFFFF",
                  borderBottom: "1px solid #E8E8E8"
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-semibold mb-1" style={{ color: "#000000" }}>
                      {id ? "✏️ Edit Product" : "✨ Add New Product"}
                    </h4>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      {id ? "Update jewelry details" : "Add new jewelry to collection"}
                    </p>
                  </div>
                  <span className="badge px-3 py-2 fw-medium" style={{
                    background: "#F8F9FA",
                    color: "#000000",
                    border: "1px solid #E8E8E8",
                    fontSize: "12px"
                  }}>
                    {id ? "EDIT MODE" : "NEW PRODUCT"}
                  </span>
                </div>
              </div>
              
              {/* Form Body */}
              <div 
                className="p-4"
                style={{
                  background: "#FFFFFF"
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    
                    {/* Product Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Product Name *
                      </label>
                      <input
                        type="text"
                        className="form-control p-3 rounded-sm"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* SKU */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        SKU *
                      </label>
                      <input
                        type="text"
                        className="form-control p-3 rounded-sm"
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="Enter unique SKU"
                        required
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Category *
                      </label>
                      <input
                        type="text"
                        className="form-control p-3 rounded-sm"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="e.g., Rings, Necklaces, Bracelets"
                        required
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Price */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        className="form-control p-3 rounded-sm"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        step="0.01"
                        min="0"
                        required
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Description
                      </label>
                      <textarea
                        className="form-control p-3 rounded-sm"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe this jewelry piece..."
                        rows="4"
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Material */}
                    <div className="col-md-4">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Material
                      </label>
                      <input
                        type="text"
                        className="form-control p-3 rounded-sm"
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        placeholder="e.g., Gold, Silver, Platinum"
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Plating */}
                    <div className="col-md-4">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Plating
                      </label>
                      <input
                        type="text"
                        className="form-control p-3 rounded-sm"
                        name="plating"
                        value={form.plating}
                        onChange={handleChange}
                        placeholder="e.g., Rose Gold, Rhodium"
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Weight */}
                    <div className="col-md-4">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Weight
                      </label>
                      <input
                        type="text"
                        className="form-control p-3 rounded-sm"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        placeholder="e.g., 10g, 1.5g"
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Dimensions */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        className="form-control p-3 rounded-sm"
                        name="length"
                        value={form.dimensions.length}
                        onChange={handleChange}
                        placeholder="Enter length"
                        step="0.1"
                        min="0"
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-medium mb-2" style={{ color: "#000000", fontSize: "14px" }}>
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        className="form-control p-3 rounded-sm"
                        name="width"
                        value={form.dimensions.width}
                        onChange={handleChange}
                        placeholder="Enter width"
                        step="0.1"
                        min="0"
                        style={{
                          border: "1px solid #E8E8E8",
                          background: "#FFFFFF",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#000000";
                          e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8E8E8";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    
                    {/* Image Upload */}
                    <div className="col-12 mt-3">
                      <div 
                        className="p-4 rounded-sm mb-3"
                        style={{
                          background: "#F8F9FA",
                          border: "2px dashed #E8E8E8",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                          e.currentTarget.style.background = "#F0F0F0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E8E8E8";
                          e.currentTarget.style.background = "#F8F9FA";
                        }}
                      >
                        <label className="form-label fw-medium mb-3 d-block" style={{ color: "#000000", fontSize: "14px" }}>
                          📸 Product Images
                          <span className="text-muted ms-2 fw-normal" style={{ fontSize: "13px" }}>(Select multiple images for this piece)</span>
                        </label>
                        <input
                          type="file"
                          multiple
                          className="form-control p-3 rounded-sm"
                          onChange={handleImageUpload}
                          accept="image/*"
                          style={{
                            border: "1px solid #E8E8E8",
                            background: "#FFFFFF",
                            cursor: "pointer"
                          }}
                        />
                      </div>
                      
                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="mt-4">
                          <h6 className="fw-medium mb-3" style={{ color: "#000000", fontSize: "14px" }}>
                            Selected Images ({imagePreviews.length})
                          </h6>
                          <div className="row g-2">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="col-6 col-md-4 col-lg-3">
                                <div 
                                  className="position-relative rounded-sm overflow-hidden border"
                                  style={{ 
                                    borderColor: "#E8E8E8",
                                    transition: "all 0.2s ease"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#000000";
                                    e.currentTarget.style.transform = "scale(1.02)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#E8E8E8";
                                    e.currentTarget.style.transform = "scale(1)";
                                  }}
                                >
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="img-fluid"
                                    style={{ 
                                      height: "120px", 
                                      width: "100%", 
                                      objectFit: "cover" 
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                                    onClick={() => removeImage(index)}
                                    style={{ 
                                      width: "24px", 
                                      height: "24px", 
                                      padding: "0",
                                      background: "#000000",
                                      color: "#FFFFFF",
                                      border: "1px solid #FFFFFF",
                                      fontSize: "12px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = "#FFFFFF";
                                      e.target.style.color = "#000000";
                                      e.target.style.borderColor = "#000000";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = "#000000";
                                      e.target.style.color = "#FFFFFF";
                                      e.target.style.borderColor = "#FFFFFF";
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Buttons */}
                    <div className="col-12 mt-4 pt-4 border-top">
                      <div className="d-flex justify-content-center gap-3">
                        <button
                          type="submit"
                          className="btn px-4 py-2 fw-medium rounded-sm"
                          disabled={loading}
                          style={{
                            background: loading ? "#E8E8E8" : "#000000",
                            color: loading ? "#999999" : "#FFFFFF",
                            border: "1px solid #000000",
                            minWidth: "160px",
                            transition: "all 0.2s ease",
                            fontSize: "14px"
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.target.style.background = "#333333";
                              e.target.style.borderColor = "#333333";
                              e.target.style.transform = "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!loading) {
                              e.target.style.background = "#000000";
                              e.target.style.borderColor = "#000000";
                              e.target.style.transform = "translateY(0)";
                            }
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              {id ? "Updating..." : "Adding..."}
                            </>
                          ) : (
                            id ? "✏️ Update Product" : "✨ Add Product"
                          )}
                        </button>
                        
                        <button
                          type="button"
                          className="btn px-4 py-2 fw-medium rounded-sm"
                          onClick={() => navigate("/products")}
                          style={{
                            background: "#FFFFFF",
                            color: "#000000",
                            border: "1px solid #E8E8E8",
                            minWidth: "160px",
                            transition: "all 0.2s ease",
                            fontSize: "14px"
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
                          ← Cancel
                        </button>
                      </div>
                      
                      <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "13px" }}>
                        {id 
                          ? "Make sure all details are accurate for your jewelry" 
                          : "Fill all required fields (*) to add this piece to your collection"}
                      </p>
                    </div>
                    
                  </div>
                </form>
              </div>
              
              {/* Footer */}
              <div 
                className="text-center py-3"
                style={{
                  background: "#F8F9FA",
                  borderTop: "1px solid #E8E8E8"
                }}
              >
                <small className="text-muted" style={{ fontSize: "12px" }}>
                  💎 Luxury Jewelry Admin Panel
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AddProduct;