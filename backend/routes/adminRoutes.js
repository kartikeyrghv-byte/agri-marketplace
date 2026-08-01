const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// GET all farmers (for approval)
router.get('/farmers', async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// APPROVE a farmer
router.put('/farmers/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Farmer approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all products (admin view)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE a product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all orders (admin view)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'name')
      .populate('consumer', 'name email')
      .populate('farmer', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;