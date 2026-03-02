const Product = require("../models/productModel");

// ✅ CREATE PRODUCT WITH IMAGES
exports.createProduct = async (req, res) => {
  try {
    console.log("📸 Uploaded files:", req.files);
    
    // 1. Get uploaded image filenames
    let imageNames = [];
    if (req.files && req.files.length > 0) {
      imageNames = req.files.map(file => file.filename);
      console.log("✅ Saved images:", imageNames);
    }
    
    // 2. Create product with image names
    const product = new Product({
      name: req.body.name,
      sku: req.body.sku,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      material: req.body.material,
      plating: req.body.plating,
      weight: req.body.weight,
      dimensions: {
        length: req.body.length,
        width: req.body.width
      },
      images: imageNames // Save actual image filenames
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: "Product created with images",
      product: product
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating product", 
      error: error.message 
    });
  }
};

// ✅ GET ALL PRODUCTS WITH FULL IMAGE URLS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Add full URL to each image
    const productsWithUrls = products.map(product => {
      const productObj = product.toObject();
      
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(img => 
          `http://localhost:5000/uploads/${img}`
        );
      }
      
      return productObj;
    });
    
    res.json(productsWithUrls);
    
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching products", 
      error: error.message 
    });
  }
};

// ============== GET SINGLE PRODUCT BY ID ==============
// In JEWELLERY/controllers/productController.js - UPDATE getProductById
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("🔍 Finding product ID:", productId);
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    // Convert to plain object and add full image URLs
    const productObj = product.toObject();
    
    // Add full URLs to images
    if (productObj.images && productObj.images.length > 0) {
      productObj.images = productObj.images.map(img => {
        // If image already has full URL, keep it
        if (img.startsWith('http')) return img;
        // Otherwise add base URL
        return `http://localhost:5000/uploads/${img}`;
      });
    }
    
    console.log("✅ Product found:", productObj.name);
    
    // Send consistent response structure
    res.json({
      success: true,
      product: productObj
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching product", 
      error: error.message 
    });
  }
};

// ============== UPDATE PRODUCT ==============
exports.updateProduct = async (req, res) => {
  try {
    // 1️⃣ Get product id from URL
    const productId = req.params.id;

    // 2️⃣ Find product in database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3️⃣ Old images user decided to keep
    // Frontend sends this as JSON string
    const oldImages = JSON.parse(req.body.oldImages || "[]");

    // 4️⃣ New uploaded images (files)
    const newImages = req.files
      ? req.files.map(file => file.filename)
      : [];

    // 5️⃣ Delete images user removed
    product.images.forEach(img => {
      if (!oldImages.includes(img)) {
        const filePath = `uploads/${img}`;
        if (require("fs").existsSync(filePath)) {
          require("fs").unlinkSync(filePath);
        }
      }
    });

    // 6️⃣ Update normal fields
    product.name = req.body.name;
    product.sku = req.body.sku;
    product.category = req.body.category;
    product.price = req.body.price;
    product.description = req.body.description;
    product.material = req.body.material;
    product.plating = req.body.plating;
    product.weight = req.body.weight;
    product.dimensions = {
      length: req.body.length,
      width: req.body.width,
    };

    // 7️⃣ Final images = old kept + new uploaded
    product.images = [...oldImages, ...newImages];

    // 8️⃣ Save product
    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============== DELETE PRODUCT ==============
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("🗑️ Deleting product ID:", productId);
    
    // Find and delete product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    console.log("✅ Product deleted:", deletedProduct.name);
    res.json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct
    });
    
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting product", 
      error: error.message 
    });
  }
};

// ============== SEARCH PRODUCTS ==============
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, products: [] });
    }

    const regex = new RegExp(q, 'i');

    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { category: { $regex: regex } },
        { description: { $regex: regex } },
        { material: { $regex: regex } }
      ]
    }).limit(10);

    const productsWithUrls = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(img =>
          img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`
        );
      }
      return productObj;
    });

    res.json({ success: true, products: productsWithUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============== GET PRODUCTS BY CATEGORY ==============
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    console.log("🔍 Fetching products for category:", category);
    
    // Case-insensitive search
    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    });
    
    // Add full URL to each image
    const productsWithUrls = products.map(product => {
      const productObj = product.toObject();
      
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(img => 
          `http://localhost:5000/uploads/${img}`
        );
      }
      
      return productObj;
    });
    
    console.log(`✅ Found ${productsWithUrls.length} products in ${category}`);
    
    res.json({
      success: true,
      data: productsWithUrls,
      category: category,
      count: productsWithUrls.length
    });
    
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching products by category", 
      error: error.message 
    });
  }
};