const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/productModel');
const protect = require('../middleware/userAuth');
const BASE_URL = process.env.SERVER_URL || 'http://localhost:5000';

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Build full image URL
    let imageUrl = '';
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      imageUrl = img.startsWith('http') ? img : `${BASE_URL}/uploads/${img}`;
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          image: imageUrl,
          quantity
        }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );
      
      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: imageUrl,
          quantity
        });
      }
      await cart.save();
    }
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
    }
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;