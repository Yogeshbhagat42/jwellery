  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const path = require("path"); 
  const fs = require("fs"); 
  require("dotenv").config();

  const app = express();
  app.use(cors()); 
  // Middleware
  app.use(express.json());

  // ✅ Create uploads folder
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
  app.use('/uploads', express.static('uploads'));

  // ✅ MongoDB Connection - FIXED (remove unsupported options)
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jewellery")
    .then(async () => {
      console.log("✅ MongoDB connected ✔️");
      
      // ✅ Fix orderId index issue (drop problematic unique index)
      await fixOrderIdIndex();
      
      // ✅ Create default admin if not exists
      await createDefaultAdmin();
    })
    .catch((err) => {
      console.log("❌ DB connection error:", err.message);
      console.log("💡 Make sure MongoDB is running: mongod --dbpath='C:/data/db'");
    });

  // ✅ Function to fix orderId index issue
  async function fixOrderIdIndex() {
    try {
      const Order = require("./models/Order");
      const collection = mongoose.connection.collection('orders');
      
      // Get all indexes
      const indexes = await collection.indexes();
      
      // Find and drop the problematic orderId unique index
      for (const index of indexes) {
        if (index.key && index.key.orderId && index.unique) {
          console.log("⚡ Dropping problematic orderId index...");
          await collection.dropIndex(index.name);
          console.log("✅ Fixed orderId index - unique constraint removed");
        }
      }
      
      // Sync indexes from schema
      await Order.syncIndexes();
      console.log("✅ Order indexes synchronized");
    } catch (error) {
      // Index might not exist, that's okay
      if (error.code !== 27) { // 27 = IndexNotFound
        console.log("ℹ️ Order index fix:", error.message);
      }
    }
  }

  // ✅ Function to create default admin
  async function createDefaultAdmin() {
    try {
      // ✅ FIX: Use correct model import
      const Admin = require("./models/Admin");
      
      // Check if admin already exists
      const adminExists = await Admin.findOne({ email: "admin@gmail.com" });
      
      if (!adminExists) {
        console.log("⚡ Creating default admin...");
        
        const defaultAdmin = new Admin({
          name: "Admin User",
          email: "admin@gmail.com",
          password: "admin123", // Will be hashed automatically
          role: "super-admin",
        });
        
        await defaultAdmin.save();
        console.log("✅ Default admin created successfully!");
        console.log("   📧 Email: admin@gmail.com");
        console.log("   🔑 Password: admin123");
        
        // Show in MongoDB
        const allAdmins = await Admin.find({});
        console.log("📊 Total admins in DB:", allAdmins.length);
      } else {
        console.log("✅ Admin already exists in database");
      }
    } catch (error) {
      console.error("❌ Error creating default admin:", error.message);
    }
  }

  // ✅ Import routes AFTER Admin model is loaded
  const productRoutes = require("./routes/productRoutes");
  const adminRoutes = require("./routes/adminRoutes");
  const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");

  // ✅ Routes
  app.use("/api", productRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/orders", orderRoutes);


  // ✅ Test endpoint to check if admin exists
  app.get("/check-admin", async (req, res) => {
    try {
      const Admin = require("./models/Admin");
      const admins = await Admin.find({});
      
      res.json({
        success: true,
        message: "Admin check",
        totalAdmins: admins.length,
        admins: admins.map(a => ({
          name: a.name,
          email: a.email,
          role: a.role,
          createdAt: a.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

  // ✅ Test endpoint to check users
  app.get("/check-users", async (req, res) => {
    try {
      const User = require("./models/User");
      const users = await User.find({}).select('-password');
      
      res.json({
        success: true,
        message: "Users in database",
        totalUsers: users.length,
        users: users.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

  // ✅ Test endpoint to check orders
 

  // ✅ Home route
  app.get("/", (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Jewelry Backend</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
            .success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007bff; }
            .method { display: inline-block; padding: 5px 10px; border-radius: 4px; color: white; font-weight: bold; margin-right: 10px; }
            .get { background: #28a745; }
            .post { background: #007bff; }
            .test-btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎯 Jewelry Backend is Running</h1>
            
            <div class="status success">
              <strong>✅ MongoDB Connected</strong><br>
              Database: jewellery
            </div>
            
            <div class="endpoint">
              <h3>🔐 Admin Endpoints</h3>
              <div>
                <span class="method post">POST</span> /api/admin/login - Admin Login
              </div>
              <div>
                <span class="method get">GET</span> /api/admin/me - Get Current Admin
              </div>
              <a href="/check-admin" class="test-btn">Test Admin Creation</a>
            </div>
            
            <div class="endpoint">
              <h3>💎 Product Endpoints</h3>
              <div>
                <span class="method get">GET</span> /api/products - Get All Products (Public)
              </div>
              <div>
                <span class="method post">POST</span> /api/products - Create Product (Protected)
              </div>
              <div>
                <span class="method put">PUT</span> /api/products/:id - Update Product (Protected)
              </div>
              <div>
                <span class="method delete">DELETE</span> /api/products/:id - Delete Product (Protected)
              </div>
            </div>
            
            <p><strong>👤 Default Admin:</strong> admin@gmail.com / admin123</p>
            <p>📁 Uploads folder: <code>/uploads</code></p>
            
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
              <h4>🛠️ Quick Tests:</h4>
              <a href="http://localhost:5000/api/products" class="test-btn">Test Products API</a>
              <a href="/check-admin" class="test-btn">Check Admin in DB</a>
            </div>
          </div>
        </body>
      </html>
    `);
  });


  // ✅ Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔐 Admin Login: POST http://localhost:${PORT}/api/admin/login`);
    console.log(`📦 Products API: GET http://localhost:${PORT}/api/products`);
    console.log(`👤 Check Admin: GET http://localhost:${PORT}/check-admin`);

    console.log(`👤 User Register: POST http://localhost:${PORT}/api/users/register`);
    console.log(`👤 User Login: POST http://localhost:${PORT}/api/users/login`);
    console.log(`👥 Check Users: GET http://localhost:${PORT}/check-users`);
  });