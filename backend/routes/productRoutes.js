const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// ADD a new product
router.post('/', async (req, res) => {
  try {
    const { name, category, price, quantity, unit, organic, description, farmer } = req.body;

    const newProduct = new Product({
      name,
      category,
      price,
      quantity,
      unit,
      organic,
      description,
      farmer
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, organic, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }
    if (organic === 'true') {
      filter.organic = true;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter).populate('farmer', 'name email farmLocation');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET products by a specific farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.params.farmerId }).populate('farmer', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;