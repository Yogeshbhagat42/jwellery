const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/productModel');
const protect = require('../middleware/userAuth');

// GET /api/wishlist - Get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }

    // Populate product details
    await wishlist.populate('products');

    // Add full image URLs
    const items = wishlist.products.map(product => {
      const obj = product.toObject();
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map(img =>
          img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`
        );
      }
      return obj;
    });

    res.json({ success: true, wishlist: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist/add - Add product to wishlist
router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate('products');

    const items = wishlist.products.map(product => {
      const obj = product.toObject();
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map(img =>
          img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`
        );
      }
      return obj;
    });

    res.json({ success: true, wishlist: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/wishlist/remove/:productId - Remove product from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== req.params.productId
    );
    await wishlist.save();

    await wishlist.populate('products');

    const items = wishlist.products.map(product => {
      const obj = product.toObject();
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map(img =>
          img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`
        );
      }
      return obj;
    });

    res.json({ success: true, wishlist: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
