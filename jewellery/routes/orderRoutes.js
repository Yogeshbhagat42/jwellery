const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const protect = require('../middleware/userAuth');

// POST /api/orders - Create new order from cart
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
        !shippingAddress.addressLine1 || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address required' });
    }

    // Get user's cart from DB, or fall back to items sent from frontend
    const cart = await Cart.findOne({ userId: req.user._id });
    const { items: bodyItems } = req.body;

    let orderItems = [];
    if (cart && cart.items && cart.items.length > 0) {
      // Use server-side cart
      orderItems = cart.items;
    } else if (bodyItems && Array.isArray(bodyItems) && bodyItems.length > 0) {
      // Fallback: use items sent from frontend (handles localStorage cart case)
      orderItems = bodyItems;
    } else {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Calculate total
    const totalAmount = orderItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        image: item.image && !item.image.startsWith('http') 
          ? `http://localhost:5000/uploads/${item.image}` 
          : item.image,
        quantity: Number(item.quantity)
      })),
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
      totalAmount,
      orderStatus: paymentMethod === 'Online' ? 'Confirmed' : 'Pending'
    });

    await order.save();

    // Clear server-side cart after order
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/my-orders - Get user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
