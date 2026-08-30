const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');


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

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADD a category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE a category
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET platform commission summary
router.get('/commission', async (req, res) => {
  try {
    const COMMISSION_RATE = 0.10; // 10% platform commission

    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalCommission = totalSales * COMMISSION_RATE;
    const farmerEarnings = totalSales - totalCommission;

    res.status(200).json({
      totalOrders: orders.length,
      totalSales,
      commissionRate: COMMISSION_RATE * 100,
      totalCommission: Math.round(totalCommission),
      farmerEarnings: Math.round(farmerEarnings)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const verifiedFarmers = await User.countDocuments({ role: 'farmer', isVerified: true });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const totalProducts = await Product.countDocuments();
    const organicProducts = await Product.countDocuments({ organic: true });
    const totalOrders = await Order.countDocuments();

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const topProducts = await Order.aggregate([
      { $group: { _id: '$product', totalOrdered: { $sum: '$quantity' } } },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      }
    ]);

    res.status(200).json({
      totalFarmers,
      verifiedFarmers,
      totalConsumers,
      totalProducts,
      organicProducts,
      totalOrders,
      statusCounts,
      topProducts: topProducts.map(p => ({
        name: p.productInfo[0]?.name || 'Unknown',
        totalOrdered: p.totalOrdered
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;