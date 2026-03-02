const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ MULTER CONFIGURATION (for file uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// ============== PUBLIC ROUTES ==============
// ✅ Anyone can view products (No auth required)
router.get("/products", productController.getAllProducts);
router.get("/products/search", productController.searchProducts);
router.get("/products/category/:category", productController.getProductsByCategory);
router.get("/products/:id", productController.getProductById);

// ============== PROTECTED ROUTES ==============
// ✅ Only authenticated admins can modify products
// CREATE with image upload (PROTECTED)
router.post(
  "/products", 
  authMiddleware,  // ✅ Check if admin is logged in
  upload.array("images", 5), 
  productController.createProduct
);

// UPDATE with image upload (PROTECTED)
router.put(
  "/products/:id", 
  authMiddleware,  // ✅ Check if admin is logged in
  upload.array("images", 5), 
  productController.updateProduct
);

// DELETE (PROTECTED)
router.delete(
  "/products/:id", 
  authMiddleware,  // ✅ Check if admin is logged in
  productController.deleteProduct
);

module.exports = router;