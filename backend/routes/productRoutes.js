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

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;