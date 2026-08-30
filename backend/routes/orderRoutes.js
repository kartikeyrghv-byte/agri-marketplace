const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// PLACE an order
router.post('/', async (req, res) => {
  try {
    const { consumer, product, quantity, deliverySlot } = req.body;

    // find the product to get price and farmer
    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // check if enough quantity is available
    if (foundProduct.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }

    const totalPrice = foundProduct.price * quantity;

    const newOrder = new Order({
  consumer,
  product,
  farmer: foundProduct.farmer,
  quantity,
  totalPrice,
  deliverySlot: deliverySlot || 'Morning (8AM-11AM)'
});

    await newOrder.save();

    // reduce the available quantity in the product
    foundProduct.quantity -= quantity;
    await foundProduct.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET orders for a specific consumer
router.get('/consumer/:consumerId', async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.params.consumerId })
      .populate('product', 'name price unit')
      .populate('farmer', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET orders for a specific farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.params.farmerId })
      .populate('product', 'name price unit')
      .populate('consumer', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET sales summary for a farmer
router.get('/farmer/:farmerId/summary', async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.params.farmerId });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    res.status(200).json({
      totalOrders,
      totalRevenue,
      deliveredOrders,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;