const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// ADD a review
router.post('/', async (req, res) => {
  try {
    const { consumer, product, farmer, rating, comment } = req.body;

    const newReview = new Review({ consumer, product, farmer, rating, comment });
    await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('consumer', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET reviews for a specific farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const reviews = await Review.find({ farmer: req.params.farmerId }).populate('consumer', 'name').populate('product', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;