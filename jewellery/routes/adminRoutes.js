// routes/adminRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();

// ✅ JWT Secret
const JWT_SECRET = "jewelry_mca_project_secret_2024";

// ============== ADMIN LOGIN ==============
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ✅ Find admin by email
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log("❌ Admin not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("🔍 Found admin:", admin.email);

    // ✅ Check password
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for:", email);

    // ✅ Send response
    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============== GET CURRENT ADMIN ==============
// Simple middleware for checking token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

router.get("/me", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.error("❌ Get admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============== DASHBOARD STATS ==============
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const Product = require("../models/productModel");

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Orders grouped by status
    const statusAgg = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    const ordersByStatus = {};
    statusAgg.forEach(s => { ordersByStatus[s._id] = s.count; });

    // Monthly revenue for last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' }, createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Build arrays for last 6 months (fill 0 for months with no orders)
    const monthlyRevenue = [];
    const monthlyOrders = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const found = monthlyAgg.find(item => item._id.year === y && item._id.month === m);
      monthlyRevenue.push(found ? found.revenue : 0);
      monthlyOrders.push(found ? found.count : 0);
    }

    // Category stats (product count per category)
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        pendingOrders,
        recentOrders,
        ordersByStatus,
        monthlyRevenue,
        monthlyOrders,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============== GET ALL ORDERS (ADMIN) ==============
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('userId', 'name email phone');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============== UPDATE ORDER STATUS ==============
router.put("/orders/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============== GET ALL CUSTOMERS ==============
router.get("/customers", verifyToken, async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ userId: customer._id });
        const totalSpent = await Order.aggregate([
          { $match: { userId: customer._id, orderStatus: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        return {
          ...customer.toObject(),
          totalOrders: orderCount,
          totalSpent: totalSpent[0]?.total || 0
        };
      })
    );

    res.json({ success: true, customers: customersWithOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;